import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from '../controllers/payment.controller';
import { TbBooking } from '../entities/booking/booking.entity';
import { TbLocation } from '../entities/location/location.entity';
import { TbOwnerPackagePlan } from '../entities/payment/owner-package-plan.entity';
import { TbOwnerPackageSubscription } from '../entities/payment/owner-package-subscription.entity';
import { TbPaymentTransaction } from '../entities/payment/payment-transaction.entity';
import { PaymentRepository } from '../repositories/payment.repository';
import { ListingTrialService } from '../services/listing-trial.service';
import { PaymentService } from '../services/payment.service';
import { SePayService } from '../services/sepay.service';
import { MailModule } from './mail.module';

@Module({
  imports: [
    ConfigModule,
    MailModule,
    TypeOrmModule.forFeature([
      TbPaymentTransaction,
      TbOwnerPackagePlan,
      TbOwnerPackageSubscription,
      TbBooking,
      TbLocation,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    SePayService,
    ListingTrialService,
  ],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
