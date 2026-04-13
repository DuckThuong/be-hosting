import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from '../controllers/location.controller';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationFavorite } from '../entities/location/locationFavorite.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationRepository } from '../repositories/location/location.repository';
import { LocationService } from '../services/location.service';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbUserDefault } from '../entities/user/user_default.entity';
import {
  TbLocationComment,
  TbLocationCommentReply,
} from '../entities/location/locationComment.entity';
import { LocationCommentRepository } from '../repositories/location/locationComment.repository';
import { CloudinaryModule } from './cloudinary.module';
import { TbLocationMedia } from '../entities/location/locationMedia.entity';

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
      TbLocationComment,
      TbLocationCommentReply,
      TbLocationMedia,
    ]),
  ],
  providers: [LocationService, LocationRepository, LocationCommentRepository],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
