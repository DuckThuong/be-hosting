import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorLocationMessage } from '../assests/messages/location.message';
import {
  AddLocationServicePayload,
  LocationServiceResponse,
} from '../dtos/location/locationService.dto';
import {
  CreateLocationTypePayloadDto,
  CreateLocationTypeResponseDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationType.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationRepository } from '../repositories/location.repository';
import { ErrorServiceMessage } from '../assests/messages/service.message';

@Injectable()
export class LocationService {
  constructor(private locationRepo: LocationRepository) {}

  public async CreateLocationType(
    payload: CreateLocationTypePayloadDto,
  ): Promise<CreateLocationTypeResponseDto> {
    if (!payload) {
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.code || payload.code.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.TYPE_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.code.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.name || payload.name.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.TYPE_NAME_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.name.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.description && payload.description.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_DESCRIPTION_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.logo && payload.logo.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_LOGO_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.backgroundUrl && payload.backgroundUrl.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_BACKGROUND_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.locationRepo.createLocationType(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during create location type:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async UpdateLocationType(
    payload: UpdateLocationTypePayloadDto,
  ): Promise<UpdateLocationTypeResponseDto> {
    if (!payload.id) {
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.name && payload.name.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.description && payload.description.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_DESCRIPTION_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.logo && payload.logo.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_LOGO_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.backgroundUrl && payload.backgroundUrl.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_BACKGROUND_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const existType = await this.locationRepo.findLocationTypeById(payload.id);

    if (!existType) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_NOT_EXIST.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.locationRepo.updateLocationType(existType, payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during update location type:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetAllLocationType(): Promise<TbLocationType[]> {
    try {
      return await this.locationRepo.getAllLocationType();
    } catch (error) {
      console.error('Error during get all location type:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async AddNewLocationService(
    payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const location = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    if (payload.data && payload.data.length > 0) {
      for (const item of payload.data) {
        if (!item.serviceCode || item.serviceCode.trim() === '') {
          throw new HttpException(
            ErrorServiceMessage.SERVICE_CODE_NOTEMPTY.toString(),
            HttpStatus.BAD_REQUEST,
          );
        }

        if (item.serviceCode.length > 50) {
          throw new HttpException(
            ErrorServiceMessage.SERVICE_CODE_INVALID.toString(),
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    try {
      return await this.locationRepo.AddNewLocationService(location, payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during add location service:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async PauseLocationService(
    payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const location = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    if (payload.data && payload.data.length > 0) {
      for (const item of payload.data) {
        if (!item.serviceCode || item.serviceCode.trim() === '') {
          throw new HttpException(
            ErrorServiceMessage.SERVICE_CODE_NOTEMPTY.toString(),
            HttpStatus.BAD_REQUEST,
          );
        }

        if (item.serviceCode.length > 50) {
          throw new HttpException(
            ErrorServiceMessage.SERVICE_CODE_INVALID.toString(),
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    try {
      return await this.locationRepo.PauseServiceProvide(location, payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during pause location service:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async RemoveLocationService(
    payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const location = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    if (payload.data && payload.data.length > 0) {
      for (const item of payload.data) {
        if (!item.serviceCode || item.serviceCode.trim() === '') {
          throw new HttpException(
            ErrorServiceMessage.SERVICE_CODE_NOTEMPTY.toString(),
            HttpStatus.BAD_REQUEST,
          );
        }

        if (item.serviceCode.length > 50) {
          throw new HttpException(
            ErrorServiceMessage.SERVICE_CODE_INVALID.toString(),
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }

    try {
      return await this.locationRepo.RemoveLocationService(location, payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during remove location service:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
