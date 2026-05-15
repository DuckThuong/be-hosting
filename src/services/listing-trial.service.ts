import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { MailService } from './mail.service';

const REMINDER_DAYS_BEFORE_EXPIRY = 5;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class ListingTrialService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ListingTrialService.name);
  private interval: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly mailService: MailService,
  ) {}

  onModuleInit() {
    void this.runTrialMaintenance();
    this.interval = setInterval(() => {
      void this.runTrialMaintenance();
    }, ONE_DAY_MS);
  }

  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private async runTrialMaintenance(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;
    try {
      await this.sendTrialReminders();
      await this.softDeleteExpiredTrialListings();
    } catch (error) {
      this.logger.error('Listing trial maintenance failed', error);
    } finally {
      this.running = false;
    }
  }

  private async sendTrialReminders(): Promise<void> {
    const subscriptions =
      await this.paymentRepository.findTrialSubscriptionsDueForReminder(
        REMINDER_DAYS_BEFORE_EXPIRY,
      );

    for (const subscription of subscriptions) {
      const hasPaidSubscription =
        await this.paymentRepository.hasActivePaidListingSubscription(
          subscription.ownerUserCode,
        );
      if (hasPaidSubscription || !subscription.expiresAt) {
        await this.paymentRepository.markTrialReminderSent(subscription.id);
        continue;
      }

      const email = await this.paymentRepository.getOwnerEmail(
        subscription.ownerUserCode,
      );
      if (!email) {
        this.logger.warn(
          `Owner ${subscription.ownerUserCode} has no email for trial reminder.`,
        );
        await this.paymentRepository.markTrialReminderSent(subscription.id);
        continue;
      }

      try {
        await this.mailService.sendListingTrialReminder(
          email,
          subscription.expiresAt,
        );
        await this.paymentRepository.markTrialReminderSent(subscription.id);
      } catch (error) {
        this.logger.error(
          `Failed to send trial reminder to owner ${subscription.ownerUserCode}`,
          error,
        );
      }
    }
  }

  private async softDeleteExpiredTrialListings(): Promise<void> {
    const subscriptions =
      await this.paymentRepository.findExpiredTrialSubscriptions();

    for (const subscription of subscriptions) {
      const hasPaidSubscription =
        await this.paymentRepository.hasActivePaidListingSubscription(
          subscription.ownerUserCode,
        );
      if (!hasPaidSubscription) {
        await this.paymentRepository.softDeleteOwnerListings(
          subscription.ownerUserCode,
        );
      }

      await this.paymentRepository.expireTrialSubscription(subscription.id);
    }
  }
}
