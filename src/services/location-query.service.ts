import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorLocationMessage } from '../assets/messages/location.message';
import {
  LocationDetailResponseDto,
  LocationListQueryDto,
  LocationSummaryResponseDto,
  PaginatedLocationResponseDto,
} from '../dtos/location/location-v2.dto';
import { LocationReadRepository } from '../repositories/location/location-read.repository';

@Injectable()
export class LocationQueryService {
  constructor(
    private readonly locationReadRepository: LocationReadRepository,
  ) {}

  public async getLocations(
    payload: LocationListQueryDto,
  ): Promise<PaginatedLocationResponseDto> {
    return this.locationReadRepository.searchLocations(payload);
  }

  public async getLocationByCode(
    locationCode: string,
  ): Promise<LocationDetailResponseDto> {
    const location =
      await this.locationReadRepository.getLocationByCode(locationCode);

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    return location;
  }

  public async getLocationsByOwner(
    ownerCode: string,
  ): Promise<LocationSummaryResponseDto[]> {
    return this.locationReadRepository.getLocationsByOwner(ownerCode);
  }

  public async getRelatedLocations(
    locationCode: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedLocationResponseDto> {
    const current =
      await this.locationReadRepository.getLocationByCode(locationCode);

    if (!current) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.locationReadRepository.getRelatedLocations(
      locationCode,
      page,
      limit,
    );
  }
}
