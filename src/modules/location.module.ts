import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from '../controllers/location.controller';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationFavorite } from '../entities/location/locationFavorite.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationRepository } from '../repositories/location.repository';
import { LocationService } from '../services/location.service';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbLocationMedia } from '../entities/location/locationMedia.entity';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([
      TbLocation,
      TbLocationFavorite,
      TbLocationType,
      TbLocationAddress,
      TbLocationService,
      TbUserDefault,
      TbLocationMedia,
    ]),
  ],
  providers: [LocationService, LocationRepository],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
