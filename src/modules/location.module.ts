import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceController } from '../controllers/service.controller';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationService } from '../services/location.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TbLocation, TbLocationService, TbLocationType]),
  ],
  providers: [LocationService],
  controllers: [ServiceController],
  exports: [LocationService],
})
export class LocationModule {}
