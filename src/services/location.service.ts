import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  COMMENT_TYPE,
  LOCATION_RENT_STATUS,
} from '../assests/constants/constants';
import { ErrorLocationMessage } from '../assests/messages/location.message';
import { ErrorServiceMessage } from '../assests/messages/service.message';
import {
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationResponseDto,
  GetLocationAddressByLocationCodePayloadDto,
  GetLocationByFillterDto,
  LocationListDto,
  LocationResponseDto,
  PaginatedLocationListDto,
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
import { LocationRepository } from '../repositories/location/location.repository';
import {
  DeleteLocationAddressesDto,
  DeleteLocationAddressResponseDto,
  UpdateLocationAddressPayloadDto,
} from '../dtos/location/locationAddress.dto';
import { validString } from '../common/helpers/common.helper';
import { LocationCommentRepository } from '../repositories/location/locationComment.repository';
import {
  GetAllCommentDto,
  GetAllCommentResponseDto,
  LocationCommentPayloadDto,
} from '../dtos/location/locationComment.dto';

@Injectable()
export class LocationService {
  constructor(
    private locationRepo: LocationRepository,

    private readonly commentRepo: LocationCommentRepository,
  ) {}

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

    if (payload.minTimeLimit && isNaN(Date.parse(payload.minTimeLimit))) {
      throw new HttpException(
        ErrorLocationMessage.MAX_TIME_LIMIT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.maxTimeLimit && isNaN(Date.parse(payload.maxTimeLimit))) {
      throw new HttpException(
        ErrorLocationMessage.MAX_TIME_LIMIT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.minTimeLimit &&
      payload.maxTimeLimit &&
      new Date(payload.minTimeLimit) > new Date(payload.maxTimeLimit)
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
        const addressData: UpdateLocationAddressPayloadDto = {
          locationCode: location.data.locationCode,
          data: payload.locationAddress.map((item) => ({
            addressCode: item.addressCode,
            addressName: item.addressName,
            fullAddress: item.fullAddress,
            addressWard: item.addressWard,
            addressDistrict: item.addressDistrict,
            addressCity: item.addressCity,
            addressProvince: item.addressProvince,
            addressCountry: item.addressCountry,
            addressPortal: item.addressPortal,
            addressLat: item.addressLat,
            addressLong: item.addressLong,
            addressRegion: item.addressRegion,
            addressStatus: item.addressStatus,
            addressDescription: item.addressDescription ?? '',
            addressNote: item.addressNote ?? '',
            addressType: item.addressType,
          })),
        };
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
    if (validString(payload.data.minTimeLimit)) {
      throw new HttpException(
        ErrorLocationMessage.MIN_TIME_LIMIT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (validString(payload.data.maxTimeLimit)) {
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

      if (payload.data.serviceCode?.length > 0 && location.data) {
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
        const addressData: UpdateLocationAddressPayloadDto = {
          locationCode: payload.locationCode,
          data: payload.data.locationAddress.map((item) => ({
            addressCode: item.addressCode,
            addressName: item.addressName,
            fullAddress: item.fullAddress,
            addressWard: item.addressWard,
            addressDistrict: item.addressDistrict,
            addressCity: item.addressCity,
            addressProvince: item.addressProvince,
            addressCountry: item.addressCountry,
            addressPortal: item.addressPortal,
            addressLat: item.addressLat,
            addressLong: item.addressLong,
            addressRegion: item.addressRegion,
            addressStatus: item.addressStatus,
            addressDescription: item.addressDescription ?? '',
            addressNote: item.addressNote ?? '',
            addressType: item.addressType,
          })),
        };
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

  public async GetAllLocation(): Promise<LocationListDto[]> {
    try {
      const location = await this.locationRepo.GetAllLocation();

      for (const item of location) {
        if (item.locationCode) {
          const service = await this.locationRepo.GetLocationServices(
            item.locationCode,
          );
          item.services = service;

          const address =
            await this.locationRepo.GetLocationAddressByLocationCode(
              item.locationCode,
            );

          item.address = address.data;
        }
      }
      return location;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get all location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetAllLocationOnOwner(
    user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    try {
      const location = await this.locationRepo.GetAllLocationOnUserOwner(user);

      for (const item of location) {
        if (item.locationCode) {
          const service = await this.locationRepo.GetLocationServices(
            item.locationCode,
          );
          item.services = service;

          const address =
            await this.locationRepo.GetLocationAddressByLocationCode(
              item.locationCode,
            );

          item.address = address.data;
        }
      }
      return location;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get all location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetAllLocationOnRenter(
    user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    try {
      const location = await this.locationRepo.GetAllLocationOnUserRenter(user);

      for (const item of location) {
        if (item.locationCode) {
          const service = await this.locationRepo.GetLocationServices(
            item.locationCode,
          );
          item.services = service;

          const address =
            await this.locationRepo.GetLocationAddressByLocationCode(
              item.locationCode,
            );

          item.address = address.data;
        }
      }
      return location;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get all location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetLocationByLocationCode(
    payload: GetLocationAddressByLocationCodePayloadDto,
  ): Promise<LocationListDto> {
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
      const location = await this.locationRepo.GetLocationByCode(
        payload.locationCode,
      );

      if (!location) {
        throw new HttpException(
          ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
          HttpStatus.NOT_FOUND,
        );
      }

      if (location.locationCode) {
        const service = await this.locationRepo.GetLocationServices(
          location.locationCode,
        );
        location.services = service;

        const address =
          await this.locationRepo.GetLocationAddressByLocationCode(
            location.locationCode,
          );

        location.address = address.data;
      }
      return location;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get location by code:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetLocationByFilter(
    user: UserDecoratorDtoResponse,
    payload: GetLocationByFillterDto,
  ): Promise<PaginatedLocationListDto> {
    if (payload.locationName && payload.locationName.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationType && payload.locationType.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.typeName && payload.typeName.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.TYPE_NAME_INVALID.toString(),
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

    if (payload.ownerName && payload.ownerName.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.OWNER_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.ownerEmail && payload.ownerEmail.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.OWNER_EMAIL_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.renderName && payload.renderName.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.RENDER_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.renderEmail && payload.renderEmail.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.RENDER_EMAIL_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payload.hasRent !== undefined &&
      payload.hasRent !== 0 &&
      payload.hasRent !== 1
    ) {
      throw new HttpException(
        ErrorLocationMessage.RENT_STATUS_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressName && payload.addressName.length > 200) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_NAME_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.fullAddress && payload.fullAddress.length > 500) {
      throw new HttpException(
        ErrorLocationMessage.FULL_ADDRESS_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressWard && payload.addressWard.length > 100) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_WARD_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressDistrict && payload.addressDistrict.length > 100) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_DISTRICT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressCity && payload.addressCity.length > 100) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_CITY_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressProvince && payload.addressProvince.length > 100) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_PROVINCE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressCountry && payload.addressCountry.length > 100) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_COUNTRY_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressRegion && payload.addressRegion.length > 100) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_REGION_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressType && payload.addressType.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_TYPE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressLat && payload.addressLat.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_LAT_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.addressLong && payload.addressLong.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.ADDRESS_LONG_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.locationRepo.GetLocationByFilter(user, payload);
      for (const item of result.data) {
        if (item.locationCode) {
          const service = await this.locationRepo.GetLocationServices(
            item.locationCode,
          );
          item.services = service;

          const address =
            await this.locationRepo.GetLocationAddressByLocationCode(
              item.locationCode,
            );

          item.address = address.data;
        }
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get location by filter:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createNewComment(
    user: UserDecoratorDtoResponse,
    payload: LocationCommentPayloadDto,
  ): Promise<any> {
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

    if (payload.commentId !== null) {
      payload.type = COMMENT_TYPE.REPLY;
    } else {
      payload.type = COMMENT_TYPE.COMMENT;
    }

    try {
      const location = await this.locationRepo.GetLocationByCode(
        payload.locationCode,
      );

      if (!location) {
        throw new HttpException(
          ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.commentRepo.createComment(user.userCode, payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get location by code:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getComment(
    payload: GetAllCommentDto,
  ): Promise<GetAllCommentResponseDto> {
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
      return await this.commentRepo.getAllComment(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get location by code:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
