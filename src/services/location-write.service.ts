import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ErrorLocationMessage,
  SuccessLocationMessage,
} from '../assets/messages/location.message';
import { ErrorServiceMessage } from '../assets/messages/service.message';
import {
  CreateLocationRequestDto,
  LocationMutationResponseDto,
  UpdateLocationRequestDto,
} from '../dtos/location/location-v2.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { LocationReadRepository } from '../repositories/location/location-read.repository';
import { LocationWriteRepository } from '../repositories/location/location-write.repository';

@Injectable()
export class LocationWriteService {
  constructor(
    private readonly locationWriteRepository: LocationWriteRepository,
    private readonly locationReadRepository: LocationReadRepository,
  ) {}

  public async createLocation(
    user: UserDecoratorDtoResponse,
    payload: CreateLocationRequestDto,
  ): Promise<LocationMutationResponseDto> {
    await this.ensureValidPayload(payload);

    const locationCode = await this.locationWriteRepository.createLocation(
      user.userCode,
      payload,
    );
    const location =
      await this.locationReadRepository.getLocationByCode(locationCode);

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: SuccessLocationMessage.CREATE_SUCCESS.toString(),
      data: location,
    };
  }

  public async updateLocation(
    user: UserDecoratorDtoResponse,
    locationCode: string,
    payload: UpdateLocationRequestDto,
  ): Promise<LocationMutationResponseDto> {
    const location =
      await this.locationWriteRepository.findLocationByCode(locationCode);

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    if (location.ownerCode !== user.userCode) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_PERMISSION_DENIED.toString(),
        HttpStatus.FORBIDDEN,
      );
    }

    await this.ensureValidPayload(payload);
    await this.locationWriteRepository.updateLocation(location, payload);

    const updated =
      await this.locationReadRepository.getLocationByCode(locationCode);
    if (!updated) {
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: SuccessLocationMessage.UPDATE_SUCCESS.toString(),
      data: updated,
    };
  }

  private async ensureValidPayload(
    payload: Partial<
      Pick<
        CreateLocationRequestDto,
        'typeCode' | 'pricing' | 'availability' | 'services'
      >
    >,
  ): Promise<void> {
    if (!payload.typeCode) {
      if (payload.pricing || payload.availability || payload.services) {
        // Continue validating partial updates without type changes.
      } else {
        return;
      }
    }

    if (payload.typeCode) {
      const locationType =
        await this.locationWriteRepository.findLocationTypeByCode(
          payload.typeCode,
        );

      if (!locationType) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_NOT_EXIST.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      payload.pricing &&
      payload.pricing.priceAfterDeal >
        (payload.pricing.priceEnd ?? payload.pricing.priceStart)
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_PRICE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.availability?.hasTimeLimit &&
      payload.availability.availableFrom &&
      payload.availability.availableTo &&
      new Date(payload.availability.availableFrom) >
        new Date(payload.availability.availableTo)
    ) {
      throw new HttpException(
        ErrorLocationMessage.TIME_LIMIT_RANGE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const serviceItems = payload.services ?? [];
    const existingServiceCodes = serviceItems
      .map((service) => service.serviceCode)
      .filter((serviceCode): serviceCode is string => Boolean(serviceCode));

    if (existingServiceCodes.length > 0) {
      const services =
        await this.locationWriteRepository.findServicesByCodes(
          existingServiceCodes,
        );
      if (services.length !== existingServiceCodes.length) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_CODE_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    for (const service of serviceItems) {
      if (!service.serviceCode && !service.name?.trim()) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_NAME_NOTEMPTY.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (service.basePrice !== undefined && service.basePrice < 0) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_PRICE_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (service.quantity !== undefined && service.quantity < 1) {
        throw new HttpException(
          ErrorServiceMessage.SERVICE_PRICE_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
