import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LOCATION_RENT_STATUS } from '../assests/constants/constants';
import { ErrorLocationMessage } from '../assests/messages/location.message';
import { ErrorServiceMessage } from '../assests/messages/service.message';
import {
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationResponseDto,
  LocationResponseDto,
  UpdatelocationPayloadDto,
  UpdateRentStatusDto,
  UpdateRentStatusResponseDto,
} from '../dtos/location/location.dto';
import {
  AddLocationServicePayload,
  LocationServiceData,
  LocationServiceResponse,
} from '../dtos/location/locationService.dto';
import {
  CreateLocationTypePayloadDto,
  CreateLocationTypeResponseDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationType.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationRepository } from '../repositories/location.repository';
import {
  DeleteLocationAddressesDto,
  DeleteLocationAddressResponseDto,
  UpdateLocationAddressPayloadDto,
} from '../dtos/location/locationAddress.dto';

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
        console.log(payload.data);
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

  public async CreateLocation(
    user: UserDecoratorDtoResponse,
    payload: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    if (!payload.typeCode || payload.typeCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.TYPE_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.typeCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.locationName || payload.locationName.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NAME_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationName.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.minTimeLimit !== undefined && payload.minTimeLimit < 0) {
      throw new HttpException(
        ErrorLocationMessage.MIN_TIME_LIMIT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.maxTimeLimit !== undefined && payload.maxTimeLimit < 0) {
      throw new HttpException(
        ErrorLocationMessage.MAX_TIME_LIMIT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.minTimeLimit !== undefined &&
      payload.maxTimeLimit !== undefined &&
      payload.minTimeLimit > payload.maxTimeLimit
    ) {
      throw new HttpException(
        ErrorLocationMessage.TIME_LIMIT_RANGE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.locationDescription &&
      payload.locationDescription.length > 2000
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_DESCRIPTION_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationNote && payload.locationNote.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOTE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.hasRent === LOCATION_RENT_STATUS.HAS_RENT) {
      if (!payload.userRentCd || payload.userRentCd.trim() === '') {
        throw new HttpException(
          ErrorLocationMessage.USER_RENT_CODE_REQUIRED.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (payload.userRentCd && payload.userRentCd.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.USER_RENT_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.locationRate !== undefined &&
      (payload.locationRate < 0 || payload.locationRate > 5)
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_RATE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.serviceCode.length > 0) {
      for (const item of payload.serviceCode) {
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
      const dataPayload: CreateLocationDto = {
        ...payload,
        ownerCode: user.userCode,
      };
      const location = await this.locationRepo.CreateLocation(dataPayload);
      if (payload.serviceCode.length > 0 && location.data) {
        const serviceData: LocationServiceData[] = [];
        for (const item of payload.serviceCode) {
          serviceData.push({
            serviceCode: item.serviceCode,
            isActive: true,
            note: '',
          });
        }
        const servicePayload: AddLocationServicePayload = {
          locationCode: location.data.locationCode,
          data: serviceData,
        };

        await this.AddNewLocationService(servicePayload);
      }

      if (
        payload.locationAddress &&
        payload.locationAddress.length > 0 &&
        location.data
      ) {
        const addressData = new UpdateLocationAddressPayloadDto();
        addressData.locationCode = location.data.locationCode;
        for (const data of payload.locationAddress) {
          addressData.data.push({
            addressCode: data.addressCode,
            addressName: data.addressName,
            fullAddress: data.fullAddress,
            addressWard: data.addressWard,
            addressDistrict: data.addressDistrict,
            addressCity: data.addressCity,
            addressProvince: data.addressProvince,
            addressCountry: data.addressCountry,
            addRessPortal: data.addRessPortal,
            addressLat: data.addressLat,
            addressLong: data.addressLong,
            addressRegion: data.addressRegion,
            addressStatus: data.addressStatus,
            addressDescription: data.addressDescription ?? '',
            addressNote: data.addressNote ?? '',
            addressType: data.addressType,
          });
        }
        await this.locationRepo.UpdateLocationAddress(addressData);
      }
      return location;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during create location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async UpdateLocation(
    payload: UpdatelocationPayloadDto,
  ): Promise<LocationResponseDto> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingLocation = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!existingLocation) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate update data
    if (payload.data.typeCode && payload.data.typeCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.data.locationName && payload.data.locationName.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NAME_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.data.locationName && payload.data.locationName.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate time limits
    if (
      payload.data.minTimeLimit !== undefined &&
      payload.data.minTimeLimit < 0
    ) {
      throw new HttpException(
        ErrorLocationMessage.MIN_TIME_LIMIT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.data.maxTimeLimit !== undefined &&
      payload.data.maxTimeLimit < 0
    ) {
      throw new HttpException(
        ErrorLocationMessage.MAX_TIME_LIMIT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const minTime = payload.data.minTimeLimit ?? existingLocation.minTimeLimit;
    const maxTime = payload.data.maxTimeLimit ?? existingLocation.maxTimeLimit;

    if (minTime !== undefined && maxTime !== undefined && minTime > maxTime) {
      throw new HttpException(
        ErrorLocationMessage.TIME_LIMIT_RANGE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate descriptions and notes
    if (
      payload.data.locationDescription &&
      payload.data.locationDescription.length > 2000
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_DESCRIPTION_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.data.locationNote && payload.data.locationNote.length > 2000) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOTE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.data.hasRent === LOCATION_RENT_STATUS.HAS_RENT) {
      const userRentCd = payload.data.userRentCd ?? existingLocation.userRentCd;
      if (!userRentCd || userRentCd.trim() === '') {
        throw new HttpException(
          ErrorLocationMessage.USER_RENT_CODE_REQUIRED.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (payload.data.userRentCd && payload.data.userRentCd.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.USER_RENT_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate locationRate
    if (
      payload.data.locationRate !== undefined &&
      (payload.data.locationRate < 0 || payload.data.locationRate > 5)
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_RATE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const location = await this.locationRepo.UpdateLocation(payload);

      if (payload.data.serviceCode.length > 0 && location.data) {
        const serviceData: LocationServiceData[] = [];
        for (const item of payload.data.serviceCode) {
          serviceData.push({
            serviceCode: item.serviceCode,
            isActive: true,
            note: '',
          });
        }
        const servicePayload: AddLocationServicePayload = {
          locationCode: location.data.locationCode,
          data: serviceData,
        };

        await this.AddNewLocationService(servicePayload);
      }

      if (
        payload.data.locationAddress &&
        payload.data.locationAddress.length > 0 &&
        location.data
      ) {
        const addressData = new UpdateLocationAddressPayloadDto();
        addressData.locationCode = location.data.locationCode;
        for (const data of payload.data.locationAddress) {
          addressData.data.push({
            addressCode: data.addressCode,
            addressName: data.addressName,
            fullAddress: data.fullAddress,
            addressWard: data.addressWard,
            addressDistrict: data.addressDistrict,
            addressCity: data.addressCity,
            addressProvince: data.addressProvince,
            addressCountry: data.addressCountry,
            addRessPortal: data.addRessPortal,
            addressLat: data.addressLat,
            addressLong: data.addressLong,
            addressRegion: data.addressRegion,
            addressStatus: data.addressStatus,
            addressDescription: data.addressDescription ?? '',
            addressNote: data.addressNote ?? '',
            addressType: data.addressType,
          });
        }
        await this.locationRepo.UpdateLocationAddress(addressData);
      }
      return location;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during update location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async DeleteLocation(
    payload: DeleteLocationDto,
  ): Promise<DeleteLocationResponseDto> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.locationRepo.DeleteLocation(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during delete location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async UpdateRentStatus(
    payload: UpdateRentStatusDto,
  ): Promise<UpdateRentStatusResponseDto> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingLocation = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!existingLocation) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    if (payload.hasRent === undefined) {
      throw new HttpException(
        ErrorLocationMessage.RENT_STATUS_REQUIRED.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.hasRent === LOCATION_RENT_STATUS.HAS_RENT) {
      if (!payload.userRentCd || payload.userRentCd.trim() === '') {
        throw new HttpException(
          ErrorLocationMessage.USER_RENT_CODE_REQUIRED.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (payload.userRentCd && payload.userRentCd.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.USER_RENT_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.locationRepo.UpdateRentStatus(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during update rent status:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async DeleteLocationAddressByCode(
    payload: DeleteLocationAddressesDto,
  ): Promise<DeleteLocationAddressResponseDto> {
    if (!payload.addressCode && payload.addressCode === '') {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.locationRepo.DeleteLocationAddress(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during delete location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
