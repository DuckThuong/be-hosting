import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from '../controllers/booking.controller';
import { TbBooking } from '../entities/booking/booking.entity';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbLocationMedia } from '../entities/location/locationMedia.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { TbService } from '../entities/service/service.entity';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { BookingRepository } from '../repositories/booking.repository';
import { LocationReadRepository } from '../repositories/location/location-read.repository';
import { BookingService } from '../services/booking.service';
import { PaymentModule } from './payment.module';

@Module({
  imports: [
    PaymentModule,
    TypeOrmModule.forFeature([
      TbBooking,
      TbLocation,
      TbLocationAddress,
      TbLocationService,
      TbLocationMedia,
      TbLocationType,
      TbService,
      TbUserDefault,
    ]),
  ],
  providers: [
    BookingService,
    BookingRepository,
    LocationReadRepository,
  ],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
