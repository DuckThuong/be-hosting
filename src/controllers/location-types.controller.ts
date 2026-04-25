import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationTypeSummaryDto } from '../dtos/location/location-v2.dto';
import { LocationReadRepository } from '../repositories/location/location-read.repository';

@ApiTags('location-types')
@Controller('location-types')
export class LocationTypesController {
  constructor(private readonly locationReadRepository: LocationReadRepository) {}

  @ApiOperation({ summary: 'List location types' })
  @Get()
  public async getLocationTypes(): Promise<LocationTypeSummaryDto[]> {
    return this.locationReadRepository.getLocationTypes();
  }
}
