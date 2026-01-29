import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  CreateLocationServicePayloadDto,
  CreateLocationServiceResponseDto,
} from '../dtos/location/locationService.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationService } from '../services/location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'User Sign Up' })
  @Post('create-location-type')
  public async createLocationType(
    @Body() payload: CreateLocationServicePayloadDto,
  ): Promise<CreateLocationServiceResponseDto> {
    return this.locationService.CreateLocationType(payload);
  }

  @ApiOperation({ summary: 'User Sign Up' })
  @Get('get-all-location-type')
  public async getAllLocationType(): Promise<TbLocationType[]> {
    return this.locationService.GetAllLocationType();
  }
}
