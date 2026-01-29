import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorLocationMessage } from '../assests/messages/location.message';
import {
  CreateLocationTypePayloadDto,
  CreateLocationTypeResponseDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationService.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationRepository } from '../repositories/location.repository';

@Injectable()
export class LocationService {
  constructor(private locationRepo: LocationRepository) {}

  public async CreateLocationType(
    payload: CreateLocationTypePayloadDto,
  ): Promise<CreateLocationTypeResponseDto> {
    try {
      if (!payload) {
        throw new HttpException(
          ErrorLocationMessage.CATCH_ERROR.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.code === '') {
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

      if (payload.name === '') {
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

      if (payload.description.length > 2000) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_DESCRIPTION_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.logo.length > 2000) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_LOGO_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.backgroundUrl.length > 2000) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_BACKGROUND_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.locationRepo.createLocationType(payload);
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async UpdateLocationType(
    payload: UpdateLocationTypePayloadDto,
  ): Promise<UpdateLocationTypeResponseDto> {
    try {
      if (!payload.id) {
        throw new HttpException(
          ErrorLocationMessage.CATCH_ERROR.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (payload.name.length > 50) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_NAME_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.description.length > 2000) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_DESCRIPTION_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.logo.length > 2000) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_LOGO_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.backgroundUrl.length > 2000) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_BACKGROUND_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      const existType = await this.locationRepo.findLocationTypeById(
        payload.id,
      );

      if (!existType) {
        throw new HttpException(
          ErrorLocationMessage.TYPE_NOT_EXIST.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return this.locationRepo.updateLocationType(existType, payload);
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetAllLocationType(): Promise<TbLocationType[]> {
    return await this.locationRepo.getAllLocationType();
  }
}
