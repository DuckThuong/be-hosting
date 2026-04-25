import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationTypesController } from '../controllers/location-types.controller';
import { LocationController } from '../controllers/location.controller';
import { LocationsController } from '../controllers/locations.controller';
import { ServicesV2Controller } from '../controllers/services-v2.controller';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationFavorite } from '../entities/location/locationFavorite.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { TbService } from '../entities/service/service.entity';
import { LocationRepository } from '../repositories/location/location.repository';
import { LocationReadRepository } from '../repositories/location/location-read.repository';
import { LocationService } from '../services/location.service';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbUserDefault } from '../entities/user/user_default.entity';
import {
  TbLocationComment,
  TbLocationCommentReply,
} from '../entities/location/locationComment.entity';
import { LocationCommentRepository } from '../repositories/location/locationComment.repository';
import { LocationWriteRepository } from '../repositories/location/location-write.repository';
import { CloudinaryModule } from './cloudinary.module';
import { TbLocationMedia } from '../entities/location/locationMedia.entity';
import { LocationQueryService } from '../services/location-query.service';
import { LocationWriteService } from '../services/location-write.service';

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
      TbService,
    ]),
  ],
  providers: [
    LocationService,
    LocationRepository,
    LocationCommentRepository,
    LocationReadRepository,
    LocationWriteRepository,
    LocationQueryService,
    LocationWriteService,
  ],
  controllers: [
    LocationController,
    LocationsController,
    LocationTypesController,
    ServicesV2Controller,
  ],
  exports: [LocationService, LocationQueryService, LocationWriteService],
})
export class LocationModule {}
