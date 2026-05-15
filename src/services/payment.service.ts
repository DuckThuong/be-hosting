import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RentalClass } from '../common/rental-classification';
import {
  BuyOwnerPackageRequestDto,
  OwnerPackagePlanResponseDto,
  OwnerPackageSubscriptionResponseDto,
  PaymentUrlResponseDto,
  SelectOwnerPackageRequestDto,
  SelectOwnerPackageResponseDto,
} from '../dtos/payment/payment.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import {
  PaymentPurpose,
  PaymentTransactionStatus,
  TbPaymentTransaction,
} from '../entities/payment/payment-transaction.entity';
import { PaymentRepository } from '../repositories/payment.repository';
import { SePayService } from './sepay.service';

type SePayWebhookBody = {
  id?: number | string;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  code?: string;
  content?: string;
  transferType?: string;
  transferAmount?: number | string;
  referenceCode?: string;
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly sepayService: SePayService,
    private readonly configService: ConfigService,
  ) {}

  public async getOwnerPackagePlans(): Promise<OwnerPackagePlanResponseDto[]> {
    const plans = await this.paymentRepository.getActivePlans();
    return plans.map((plan) => ({
      planCode: plan.planCode,
      name: plan.name,
      price: Number(plan.price),
      durationDays: plan.durationDays,
      maxActiveListings: plan.maxActiveListings,
    }));
  }

  public async getMyLongTermSubscription(
    user: UserDecoratorDtoResponse,
  ): Promise<OwnerPackageSubscriptionResponseDto> {
    let subscription;
    try {
      subscription =
        await this.paymentRepository.getActiveListingSubscription(user.userCode);
    } catch (error: any) {
      if (error.message === 'LISTING_PACKAGE_REQUIRED') {
        throw new HttpException(
          'Ban chua chon goi dang tin.',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
      throw error;
    }

    return this.toSubscriptionResponse(user.userCode, subscription);
  }

  public async selectOwnerPackage(
    user: UserDecoratorDtoResponse,
    dto: SelectOwnerPackageRequestDto,
    request: Request,
  ): Promise<SelectOwnerPackageResponseDto> {
    const plan = await this.paymentRepository.findPlan(dto.planCode);
    if (!plan || plan.rentalClass !== RentalClass.LONG_TERM) {
      throw new NotFoundException('Goi dang tin khong ton tai.');
    }

    if (Number(plan.price) <= 0) {
      try {
        const subscription =
          await this.paymentRepository.activateFreeListingSubscription(
            user.userCode,
          );
        return {
          planCode: plan.planCode,
          paymentRequired: false,
          subscription: await this.toSubscriptionResponse(
            user.userCode,
            subscription,
          ),
        };
      } catch (error: any) {
        if (error.message === 'FREE_TRIAL_ALREADY_USED') {
          throw new BadRequestException(
            'Ban da su dung goi mien phi. Vui long chon Basic hoac Pro.',
          );
        }
        throw error;
      }
    }

    const payment = await this.buyOwnerPackage(user, dto, request);
    return {
      planCode: plan.planCode,
      paymentRequired: true,
      payment,
    };
  }

  public async buyOwnerPackage(
    user: UserDecoratorDtoResponse,
    dto: BuyOwnerPackageRequestDto,
    _request: Request,
  ): Promise<PaymentUrlResponseDto> {
    const plan = await this.paymentRepository.findPlan(dto.planCode);
    if (!plan || plan.rentalClass !== RentalClass.LONG_TERM) {
      throw new NotFoundException('Goi dang tin khong ton tai.');
    }

    if (Number(plan.price) <= 0) {
      throw new BadRequestException(
        'Vui long chon goi mien phi qua endpoint chon goi.',
      );
    }

    const payment = await this.paymentRepository.createPayment({
      purpose: PaymentPurpose.OWNER_PACKAGE,
      amount: Number(plan.price),
      ownerUserCode: user.userCode,
      planCode: plan.planCode,
      expiredAt: this.getPaymentExpireAt(),
    });

    return this.toSePayPaymentResponse(payment);
  }

  public async createBookingDepositPayment(data: {
    bookingCode: string;
    amount: number;
    request: Request;
    expiredAt: Date;
  }): Promise<PaymentUrlResponseDto> {
    const payment = await this.paymentRepository.createPayment({
      purpose: PaymentPurpose.BOOKING_DEPOSIT,
      amount: data.amount,
      bookingCode: data.bookingCode,
      expiredAt: data.expiredAt,
    });

    return this.toSePayPaymentResponse(payment);
  }

  public async generatePaymentQr(
    user: UserDecoratorDtoResponse,
    transactionCode: string,
    _request: Request,
  ): Promise<PaymentUrlResponseDto> {
    const payment =
      await this.paymentRepository.findPaymentByTransactionCode(
        transactionCode,
      );
    if (!payment) {
      throw new NotFoundException('Giao dich thanh toan khong ton tai.');
    }

    if (payment.status !== PaymentTransactionStatus.PENDING) {
      throw new BadRequestException('Giao dich khong con cho thanh toan.');
    }

    await this.ensurePaymentOwner(user, payment);
    return this.toSePayPaymentResponse(payment);
  }

  public async handleSePayWebhook(
    body: SePayWebhookBody,
    authorization?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!this.sepayService.verifyWebhookAuthorization(authorization)) {
      throw new UnauthorizedException('Invalid SePay webhook authorization.');
    }

    if (String(body.transferType).toLowerCase() !== 'in') {
      return { success: true, message: 'Ignored non-incoming transaction.' };
    }

    const transactionCode = this.extractTransactionCode(body);
    if (!transactionCode) {
      return { success: true, message: 'No matching payment code.' };
    }

    const payment =
      await this.paymentRepository.findPaymentByTransactionCode(
        transactionCode,
      );
    if (!payment) {
      return { success: true, message: 'Payment transaction not found.' };
    }

    if (payment.status === PaymentTransactionStatus.PAID) {
      return { success: true, message: 'Payment already confirmed.' };
    }

    const transferAmount = Number(body.transferAmount);
    if (
      !Number.isFinite(transferAmount) ||
      transferAmount < Number(payment.amount)
    ) {
      return { success: true, message: 'Transfer amount is not enough.' };
    }

    await this.paymentRepository.confirmPayment({
      payment,
      vnpayTransactionNo:
        body.referenceCode !== undefined || body.id !== undefined
          ? String(body.referenceCode ?? body.id)
          : null,
      bankCode: body.gateway ?? null,
      payDate: body.transactionDate ?? null,
    });

    return { success: true, message: 'Payment confirmed.' };
  }

  private async ensurePaymentOwner(
    user: UserDecoratorDtoResponse,
    payment: TbPaymentTransaction,
  ): Promise<void> {
    if (payment.purpose === PaymentPurpose.OWNER_PACKAGE) {
      if (payment.ownerUserCode !== user.userCode) {
        throw new ForbiddenException('Ban khong co quyen xem giao dich nay.');
      }
      return;
    }

    if (!payment.bookingCode) {
      throw new NotFoundException('Booking cua giao dich khong ton tai.');
    }

    const booking = await this.paymentRepository.findBookingByCode(
      payment.bookingCode,
    );
    if (!booking) {
      throw new NotFoundException('Booking cua giao dich khong ton tai.');
    }

    if (booking.guestUserCode !== user.userCode) {
      throw new ForbiddenException('Ban khong co quyen xem giao dich nay.');
    }
  }

  private async toSubscriptionResponse(
    ownerUserCode: string,
    subscription: Awaited<
      ReturnType<PaymentRepository['getActiveListingSubscription']>
    >,
  ): Promise<OwnerPackageSubscriptionResponseDto> {
    const activeListings =
      await this.paymentRepository.countActiveListings(ownerUserCode);
    const maxActiveListings = subscription.plan?.maxActiveListings ?? 0;

    return {
      planCode: subscription.planCode,
      rentalClass: subscription.rentalClass,
      maxActiveListings,
      activeListings,
      remainingListings: Math.max(maxActiveListings - activeListings, 0),
      expiresAt: subscription.expiresAt,
    };
  }

  private toSePayPaymentResponse(
    payment: TbPaymentTransaction,
  ): PaymentUrlResponseDto {
    const qrUrl = this.sepayService.createQrUrl({
      amount: Number(payment.amount),
      transactionCode: payment.transactionCode,
    });
    const bankInfo = this.sepayService.getBankInfo();

    return {
      transactionCode: payment.transactionCode,
      purpose: payment.purpose,
      amount: Number(payment.amount),
      paymentUrl: qrUrl,
      qrContent: qrUrl,
      qrMessage: 'SePay VietQR image URL',
      transferContent: this.sepayService.getTransferContent(
        payment.transactionCode,
      ),
      ...bankInfo,
    };
  }

  private extractTransactionCode(body: SePayWebhookBody): string | null {
    const directCode = body.code?.trim();
    if (directCode) {
      return directCode;
    }

    const content = body.content ?? '';
    const match = content.match(/\b(?:DEP|PKG)-[A-Z0-9]{12}\b/i);
    return match?.[0]?.toUpperCase() ?? null;
  }

  private getPaymentExpireAt(): Date {
    const minutes = Number(
      this.configService.get<string>('SEPAY_PAYMENT_EXPIRE_MINUTES') || 15,
    );
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}
