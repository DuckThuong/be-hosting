import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, MoreThan, Repository } from 'typeorm';
import {
  RentalClass,
} from '../common/rental-classification';
import {
  OwnerPackageSubscriptionStatus,
  TbOwnerPackageSubscription,
} from '../entities/payment/owner-package-subscription.entity';
import { TbOwnerPackagePlan } from '../entities/payment/owner-package-plan.entity';
import {
  PaymentPurpose,
  PaymentTransactionStatus,
  TbPaymentTransaction,
} from '../entities/payment/payment-transaction.entity';
import {
  BookingStatus,
  PaymentStatus,
  TbBooking,
} from '../entities/booking/booking.entity';
import { TbLocation } from '../entities/location/location.entity';

const DEFAULT_LONG_FREE_PLAN = {
  planCode: 'LONG_FREE',
  name: 'Free',
  rentalClass: RentalClass.LONG_TERM,
  price: 0,
  durationDays: 7,
  maxActiveListings: 1,
  isActive: true,
};

const DEFAULT_INDIVIDUAL_PLAN = {
  planCode: 'INDIVIDUAL',
  name: 'Individual',
  rentalClass: RentalClass.SHORT_TERM,
  price: 49000,
  durationDays: 30,
  maxActiveListings: 1,
  isActive: true,
};

const DEFAULT_LONG_PLUS_PLAN = {
  planCode: 'LONG_BASIC',
  name: 'Basic',
  rentalClass: RentalClass.LONG_TERM,
  price: 99000,
  durationDays: 30,
  maxActiveListings: 5,
  isActive: true,
};

const DEFAULT_LONG_PRO_PLAN = {
  planCode: 'LONG_PRO',
  name: 'Pro',
  rentalClass: RentalClass.LONG_TERM,
  price: 149000,
  durationDays: 30,
  maxActiveListings: 10,
  isActive: true,
};

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(TbPaymentTransaction)
    private readonly paymentRepo: Repository<TbPaymentTransaction>,
    @InjectRepository(TbOwnerPackagePlan)
    private readonly planRepo: Repository<TbOwnerPackagePlan>,
    @InjectRepository(TbOwnerPackageSubscription)
    private readonly subscriptionRepo: Repository<TbOwnerPackageSubscription>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public generateTransactionCode(prefix = 'PAY'): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = `${prefix}-`;
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public async ensureDefaultPlans(): Promise<void> {
    await this.ensurePlan(DEFAULT_LONG_FREE_PLAN);
    await this.ensurePlan(DEFAULT_INDIVIDUAL_PLAN);
    await this.ensurePlan(DEFAULT_LONG_PLUS_PLAN);
    await this.ensurePlan(DEFAULT_LONG_PRO_PLAN);
  }

  private async ensurePlan(plan: Partial<TbOwnerPackagePlan>): Promise<void> {
    const existing = await this.planRepo.findOneBy({
      planCode: plan.planCode!,
    });
    if (existing) {
      await this.planRepo.update({ planCode: plan.planCode! }, plan);
      return;
    }

    await this.planRepo.save(this.planRepo.create(plan));
  }

  public async getActivePlans(): Promise<TbOwnerPackagePlan[]> {
    await this.ensureDefaultPlans();
    return this.planRepo.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    });
  }

  public async findPlan(planCode: string): Promise<TbOwnerPackagePlan | null> {
    await this.ensureDefaultPlans();
    return this.planRepo.findOneBy({ planCode, isActive: true });
  }

  public async createPayment(data: {
    purpose: PaymentPurpose;
    amount: number;
    bookingCode?: string | null;
    ownerUserCode?: string | null;
    planCode?: string | null;
    expiredAt?: Date | null;
  }): Promise<TbPaymentTransaction> {
    const transactionCode = this.generateTransactionCode(
      data.purpose === PaymentPurpose.BOOKING_DEPOSIT ? 'DEP' : 'PKG',
    );

    const payment = this.paymentRepo.create({
      transactionCode,
      vnpayTxnRef: transactionCode,
      purpose: data.purpose,
      amount: data.amount,
      status: PaymentTransactionStatus.PENDING,
      bookingCode: data.bookingCode ?? null,
      ownerUserCode: data.ownerUserCode ?? null,
      planCode: data.planCode ?? null,
      expiredAt: data.expiredAt ?? null,
    });

    return this.paymentRepo.save(payment);
  }

  public async findPaymentByTxnRef(
    vnpayTxnRef: string,
  ): Promise<TbPaymentTransaction | null> {
    return this.paymentRepo.findOneBy({ vnpayTxnRef });
  }

  public async findPaymentByTransactionCode(
    transactionCode: string,
  ): Promise<TbPaymentTransaction | null> {
    return this.paymentRepo.findOneBy({ transactionCode });
  }

  public async findBookingByCode(bookingCode: string): Promise<TbBooking | null> {
    return this.entityManager.findOneBy(TbBooking, { bookingCode });
  }

  public async markPaymentFailed(
    transactionCode: string,
    metadata: Partial<TbPaymentTransaction>,
  ): Promise<void> {
    await this.paymentRepo.update(
      { transactionCode },
      {
        ...metadata,
        status: PaymentTransactionStatus.FAILED,
      },
    );
  }

  public async confirmPayment(data: {
    payment: TbPaymentTransaction;
    vnpayTransactionNo?: string | null;
    bankCode?: string | null;
    payDate?: string | null;
  }): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      const payment = await manager.findOne(TbPaymentTransaction, {
        where: { transactionCode: data.payment.transactionCode },
        lock: { mode: 'pessimistic_write' },
      });

      if (!payment || payment.status === PaymentTransactionStatus.PAID) {
        return;
      }

      payment.status = PaymentTransactionStatus.PAID;
      payment.vnpayTransactionNo = data.vnpayTransactionNo ?? null;
      payment.bankCode = data.bankCode ?? null;
      payment.payDate = data.payDate ?? null;
      payment.paidAt = new Date();
      await manager.save(payment);

      if (payment.purpose === PaymentPurpose.BOOKING_DEPOSIT) {
        await this.confirmBookingDeposit(manager, payment);
        return;
      }

      if (payment.purpose === PaymentPurpose.OWNER_PACKAGE) {
        await this.activateOwnerPackage(manager, payment);
      }
    });
  }

  private async confirmBookingDeposit(
    manager: EntityManager,
    payment: TbPaymentTransaction,
  ): Promise<void> {
    if (!payment.bookingCode) return;

    const booking = await manager.findOne(TbBooking, {
      where: { bookingCode: payment.bookingCode },
      lock: { mode: 'pessimistic_write' },
    });

    if (!booking) return;

    booking.status = BookingStatus.CONFIRMED;
    booking.paymentStatus = PaymentStatus.PAID;
    booking.lockedUntil = null;
    await manager.save(booking);

    await manager.update(
      TbLocation,
      { locationCode: booking.locationCode },
      { hasRent: 1, userRentCd: booking.guestUserCode },
    );
  }

  private async activateOwnerPackage(
    manager: EntityManager,
    payment: TbPaymentTransaction,
  ): Promise<void> {
    if (!payment.ownerUserCode || !payment.planCode) return;

    const plan = await manager.findOneBy(TbOwnerPackagePlan, {
      planCode: payment.planCode,
    });
    if (!plan) return;

    await manager.update(
      TbOwnerPackageSubscription,
      {
        ownerUserCode: payment.ownerUserCode,
        rentalClass: RentalClass.LONG_TERM,
        status: OwnerPackageSubscriptionStatus.ACTIVE,
      },
      { status: OwnerPackageSubscriptionStatus.EXPIRED },
    );

    const startsAt = new Date();
    const expiresAt = plan.durationDays
      ? new Date(startsAt.getTime() + plan.durationDays * 24 * 60 * 60 * 1000)
      : null;

    await manager.save(
      manager.create(TbOwnerPackageSubscription, {
        ownerUserCode: payment.ownerUserCode,
        planCode: plan.planCode,
        rentalClass: plan.rentalClass,
        startsAt,
        expiresAt,
        status: OwnerPackageSubscriptionStatus.ACTIVE,
      }),
    );
  }

  public async getActiveListingSubscription(
    ownerUserCode: string,
  ): Promise<TbOwnerPackageSubscription> {
    await this.ensureDefaultPlans();
    const now = new Date();
    const existing = await this.subscriptionRepo.findOne({
      where: [
        {
          ownerUserCode,
          rentalClass: RentalClass.LONG_TERM,
          status: OwnerPackageSubscriptionStatus.ACTIVE,
          expiresAt: MoreThan(now),
        },
        {
          ownerUserCode,
          rentalClass: RentalClass.LONG_TERM,
          status: OwnerPackageSubscriptionStatus.ACTIVE,
          expiresAt: IsNull(),
        },
      ],
      order: { id: 'DESC' },
      relations: ['plan'],
    });

    if (existing) return existing;

    throw new Error('LISTING_PACKAGE_REQUIRED');
  }

  public async activateFreeListingSubscription(
    ownerUserCode: string,
  ): Promise<TbOwnerPackageSubscription> {
    await this.ensureDefaultPlans();
    const now = new Date();

    const existing = await this.subscriptionRepo.findOne({
      where: [
        {
          ownerUserCode,
          rentalClass: RentalClass.LONG_TERM,
          status: OwnerPackageSubscriptionStatus.ACTIVE,
          expiresAt: MoreThan(now),
        },
        {
          ownerUserCode,
          rentalClass: RentalClass.LONG_TERM,
          status: OwnerPackageSubscriptionStatus.ACTIVE,
          expiresAt: IsNull(),
        },
      ],
      order: { id: 'DESC' },
      relations: ['plan'],
    });

    if (existing) return existing;

    const previousTrial = await this.subscriptionRepo.findOne({
      where: {
        ownerUserCode,
        rentalClass: RentalClass.LONG_TERM,
        planCode: 'LONG_FREE',
      },
      order: { id: 'DESC' },
    });
    if (previousTrial) {
      throw new Error('FREE_TRIAL_ALREADY_USED');
    }

    const freePlan = await this.planRepo.findOneBy({ planCode: 'LONG_FREE' });
    const startsAt = now;
    const durationDays = freePlan?.durationDays ?? 30;
    const expiresAt = new Date(
      startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000,
    );

    return this.subscriptionRepo.save(
      this.subscriptionRepo.create({
        ownerUserCode,
        planCode: freePlan?.planCode ?? 'LONG_FREE',
        rentalClass: RentalClass.LONG_TERM,
        startsAt,
        expiresAt,
        status: OwnerPackageSubscriptionStatus.ACTIVE,
        plan: freePlan ?? undefined,
      }),
    );
  }

  public async getActiveLongTermSubscription(
    ownerUserCode: string,
  ): Promise<TbOwnerPackageSubscription> {
    return this.getActiveListingSubscription(ownerUserCode);
  }

  public async countActiveListings(
    ownerUserCode: string,
    excludeLocationCode?: string,
  ): Promise<number> {
    const qb = this.entityManager
      .getRepository(TbLocation)
      .createQueryBuilder('location')
      .where('location.ownerCode = :ownerUserCode', { ownerUserCode })
      .andWhere('location.locationStatus = :locationStatus', {
        locationStatus: 1,
      });

    if (excludeLocationCode) {
      qb.andWhere('location.locationCode != :excludeLocationCode', {
        excludeLocationCode,
      });
    }

    return qb.getCount();
  }

  public async countActiveLongTermListings(
    ownerUserCode: string,
    excludeLocationCode?: string,
  ): Promise<number> {
    return this.countActiveListings(ownerUserCode, excludeLocationCode);
  }

  public async hasActivePaidListingSubscription(
    ownerUserCode: string,
  ): Promise<boolean> {
    const now = new Date();
    const count = await this.subscriptionRepo.count({
      where: [
        {
          ownerUserCode,
          rentalClass: RentalClass.LONG_TERM,
          status: OwnerPackageSubscriptionStatus.ACTIVE,
          expiresAt: MoreThan(now),
        },
        {
          ownerUserCode,
          rentalClass: RentalClass.LONG_TERM,
          status: OwnerPackageSubscriptionStatus.ACTIVE,
          expiresAt: IsNull(),
        },
      ],
    });

    const paid = await this.subscriptionRepo
      .createQueryBuilder('subscription')
      .innerJoin(
        TbOwnerPackagePlan,
        'plan',
        'plan.planCode = subscription.planCode AND plan.price > 0',
      )
      .where('subscription.ownerUserCode = :ownerUserCode', { ownerUserCode })
      .andWhere('subscription.rentalClass = :rentalClass', {
        rentalClass: RentalClass.LONG_TERM,
      })
      .andWhere('subscription.status = :status', {
        status: OwnerPackageSubscriptionStatus.ACTIVE,
      })
      .andWhere(
        '(subscription.expiresAt > :now OR subscription.expiresAt IS NULL)',
        { now },
      )
      .getCount();

    return count > 0 && paid > 0;
  }

  public async findTrialSubscriptionsDueForReminder(
    reminderDaysBeforeExpiry: number,
  ): Promise<TbOwnerPackageSubscription[]> {
    const now = new Date();
    const reminderUntil = new Date(
      now.getTime() + reminderDaysBeforeExpiry * 24 * 60 * 60 * 1000,
    );

    return this.subscriptionRepo
      .createQueryBuilder('subscription')
      .where('subscription.planCode = :planCode', { planCode: 'LONG_FREE' })
      .andWhere('subscription.status = :status', {
        status: OwnerPackageSubscriptionStatus.ACTIVE,
      })
      .andWhere('subscription.expiresAt IS NOT NULL')
      .andWhere('subscription.expiresAt > :now', { now })
      .andWhere('subscription.expiresAt <= :reminderUntil', {
        reminderUntil,
      })
      .andWhere('subscription.trialReminderSentAt IS NULL')
      .getMany();
  }

  public async findExpiredTrialSubscriptions(): Promise<
    TbOwnerPackageSubscription[]
  > {
    const now = new Date();
    return this.subscriptionRepo.find({
      where: {
        planCode: 'LONG_FREE',
        status: OwnerPackageSubscriptionStatus.ACTIVE,
        expiresAt: MoreThan(new Date(0)),
      },
    }).then((subscriptions) =>
      subscriptions.filter(
        (subscription) =>
          subscription.expiresAt !== null && subscription.expiresAt <= now,
      ),
    );
  }

  public async markTrialReminderSent(subscriptionId: number): Promise<void> {
    await this.subscriptionRepo.update(
      { id: subscriptionId },
      { trialReminderSentAt: new Date() },
    );
  }

  public async expireTrialSubscription(subscriptionId: number): Promise<void> {
    await this.subscriptionRepo.update(
      { id: subscriptionId },
      { status: OwnerPackageSubscriptionStatus.EXPIRED },
    );
  }

  public async softDeleteOwnerListings(ownerUserCode: string): Promise<void> {
    await this.entityManager.softDelete(TbLocation, { ownerCode: ownerUserCode });
  }

  public async getOwnerEmail(ownerUserCode: string): Promise<string | null> {
    const row = await this.entityManager
      .createQueryBuilder()
      .select('user.email', 'email')
      .from('tb_user_default', 'user')
      .where('user.userCode = :ownerUserCode', { ownerUserCode })
      .getRawOne<{ email?: string }>();

    return row?.email ?? null;
  }
}
