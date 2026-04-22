import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  COMMENT_TYPE,
  LOCATION_RENT_STATUS,
} from '../assests/constants/constants';
import {
  ErrorLocationMessage,
  SuccessLocationMessage,
} from '../assests/messages/location.message';
import { ErrorServiceMessage } from '../assests/messages/service.message';
import { validString } from '../common/helpers/common.helper';
import {
  AddLocationMediaRequestDto,
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationMediaRequestDto,
  DeleteLocationResponseDto,
  FavoriteLocationListResponseDto,
  FavoriteLocationSummaryDto,
  GetLocationAddressByLocationCodePayloadDto,
  GetLocationByFillterDto,
  GetRelatedLocationQueryDto,
  GetShareLinkQueryDto,
  GetShareLinkResponseDto,
  LocationListDto,
  LocationMediaListResponseDto,
  LocationMediaResponseDto,
  LocationResponseDto,
  PaginatedLocationListDto,
  ReorderLocationMediaRequestDto,
  ToggleFavoriteRequestDto,
  ToggleFavoriteResponseDto,
  UpdateLocationLogoRequestDto,
  UpdateLocationLogoResponseDto,
  UpdateLocationMediaRequestDto,
  UpdatelocationPayloadDto,
  UpdateRentStatusDto,
  UpdateRentStatusResponseDto,
} from '../dtos/location/location.dto';
import {
  DeleteLocationAddressesDto,
  DeleteLocationAddressResponseDto,
  UpdateLocationAddressPayloadDto,
} from '../dtos/location/locationAddress.dto';
import {
  GetAllCommentDto,
  GetAllCommentResponseDto,
  LocationCommentPayloadDto,
} from '../dtos/location/locationComment.dto';
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
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import {
  LocationMediaType,
  TbLocationMedia,
} from '../entities/location/locationMedia.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LocationRepository } from '../repositories/location/location.repository';
import { LocationCommentRepository } from '../repositories/location/locationComment.repository';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepo: LocationRepository,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly commentRepo: LocationCommentRepository,
  ) {}

  private async enrichLocationDetails(
    location: LocationListDto,
  ): Promise<void> {
    if (!location.locationCode) {
      return;
    }

    const service = await this.locationRepo.GetLocationServices(
      location.locationCode,
    );
    location.services = service;

    const address = await this.locationRepo.GetLocationAddressByLocationCode(
      location.locationCode,
    );
    location.address = address.data;

    const media = await this.locationRepo.GetLocationMedia(
      location.locationCode,
    );
    location.media = media;
  }

  private parseMediaType(mediaType?: string): LocationMediaType | undefined {
    if (!mediaType) {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (mediaType === LocationMediaType.IMAGE) {
      return LocationMediaType.IMAGE;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (mediaType === LocationMediaType.VIDEO) {
      return LocationMediaType.VIDEO;
    }

    return undefined;
  }

  private parseOptionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      if (value === 1) return true;
      if (value === 0) return false;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1') return true;
      if (normalized === 'false' || normalized === '0') return false;
    }

    return undefined;
  }

  private parseOptionalDisplayOrder(value: unknown): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      return undefined;
    }

    return parsed;
  }

  private ensureMediaMatchesFileType(
    file: Express.Multer.File,
    mediaType: LocationMediaType,
  ): void {
    if (!file?.mimetype) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_FILE_REQUIRED.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      mediaType === LocationMediaType.IMAGE &&
      !file.mimetype.startsWith('image/')
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_TYPE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      mediaType === LocationMediaType.VIDEO &&
      !file.mimetype.startsWith('video/')
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_TYPE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getOwnedLocation(
    user: UserDecoratorDtoResponse,
    locationCode: string,
  ) {
    const location = await this.locationRepo.FindLocationByCode(locationCode);

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

    return location;
  }

  private async getLocationMediaOrFail(
    locationCode: string,
    mediaCode: string,
  ): Promise<TbLocationMedia> {
    const media = await this.locationRepo.FindLocationMediaByCode(mediaCode);

    if (!media) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    if (media.locationCode !== locationCode) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_NOT_BELONG_TO_LOCATION.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return media;
  }

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

    if (
      payload.locationArea !== undefined &&
      (!Number.isFinite(payload.locationArea) || payload.locationArea < 0)
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_AREA_INVALID.toString(),
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
        const serviceData: Array<{ serviceCode: string }> = [];
        for (const item of payload.serviceCode) {
          serviceData.push({
            serviceCode: item.serviceCode,
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

    if (
      payload.data.locationArea !== undefined &&
      (!Number.isFinite(payload.data.locationArea) ||
        payload.data.locationArea < 0)
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_AREA_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const location = await this.locationRepo.UpdateLocation(payload);

      if (payload.data.serviceCode?.length > 0 && location.data) {
        const serviceData: Array<{ serviceCode: string }> = [];
        for (const item of payload.data.serviceCode) {
          serviceData.push({
            serviceCode: item.serviceCode,
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
          await this.enrichLocationDetails(item);
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
          await this.enrichLocationDetails(item);
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
          await this.enrichLocationDetails(item);
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

      await this.enrichLocationDetails(location);
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
    user: UserDecoratorDtoResponse | undefined,
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
          await this.enrichLocationDetails(item);
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

  public async GetRelatedLocation(
    payload: GetRelatedLocationQueryDto,
  ): Promise<PaginatedLocationListDto> {
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

    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 8;

    if (!Number.isInteger(page) || page <= 0) {
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentLocation = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!currentLocation) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    const currentAddress = await this.locationRepo.GetPrimaryAddressByLocationCode(
      payload.locationCode,
    );
    const scopedRegion = currentAddress?.addressRegion?.trim();
    const scopedCity = scopedRegion ? undefined : currentAddress?.addressCity?.trim();

    try {
      const result = await this.locationRepo.GetRelatedLocation({
        locationCode: payload.locationCode,
        typeCode: currentLocation.typeCode,
        addressRegion: scopedRegion || undefined,
        addressCity: scopedCity || undefined,
        page,
        limit,
      });

      for (const item of result.data) {
        if (item.locationCode) {
          await this.enrichLocationDetails(item);
        }
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error during get related location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async ToggleFavorite(
    user: UserDecoratorDtoResponse,
    payload: ToggleFavoriteRequestDto,
  ): Promise<ToggleFavoriteResponseDto> {
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

    const location = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.locationRepo.ToggleFavorite(user.userCode, location);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during toggle favorite location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetMyFavoriteLocation(
    user: UserDecoratorDtoResponse,
  ): Promise<FavoriteLocationListResponseDto> {
    try {
      const locations: FavoriteLocationSummaryDto[] =
        await this.locationRepo.GetMyFavoriteLocation(user.userCode);

      return {
        message: SuccessLocationMessage.GET_FAVORITE_LIST_SUCCESS,
        data: locations,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error during get my favorite location:', error);
      throw new HttpException(
        ErrorLocationMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetLocationPriceRangeBounds(): Promise<{
    minValue: number | null;
    maxValue: number | null;
  }> {
    return await this.locationRepo.GetLocationPriceRangeBounds();
  }

  public async GetLocationAreaRangeBounds(): Promise<{
    minValue: number | null;
    maxValue: number | null;
  }> {
    return await this.locationRepo.GetLocationAreaRangeBounds();
  }

  public async UpdateLocationLogo(
    user: UserDecoratorDtoResponse,
    payload: UpdateLocationLogoRequestDto,
  ): Promise<UpdateLocationLogoResponseDto> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.mediaCode || payload.mediaCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.mediaCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_CODE_INVALID.toString(),
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

    if (location.ownerCode !== user.userCode) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_PERMISSION_DENIED.toString(),
        HttpStatus.FORBIDDEN,
      );
    }

    const selectedMedia = await this.locationRepo.FindLocationMediaByCode(
      payload.mediaCode,
    );

    if (!selectedMedia) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    if (selectedMedia.locationCode !== payload.locationCode) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_NOT_BELONG_TO_LOCATION.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (selectedMedia.mediaType !== LocationMediaType.IMAGE) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_LOGO_MUST_BE_IMAGE.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.locationRepo.UpdateLocationLogo(
      location,
      selectedMedia,
    );

    return {
      message: SuccessLocationMessage.UPDATE_LOGO_SUCCESS,
      locationCode: result.locationCode,
      mediaCode: result.mediaCode,
      locationLogo: result.locationLogo,
    };
  }

  public async AddLocationMedia(
    user: UserDecoratorDtoResponse,
    payload: AddLocationMediaRequestDto,
    file: Express.Multer.File,
  ): Promise<LocationMediaResponseDto> {
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

    if (!file) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_FILE_REQUIRED.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const mediaType = this.parseMediaType(payload.mediaType);
    if (!mediaType) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_TYPE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const location = await this.getOwnedLocation(user, payload.locationCode);
    this.ensureMediaMatchesFileType(file, mediaType);

    const displayOrder = this.parseOptionalDisplayOrder(payload.displayOrder);
    if (payload.displayOrder !== undefined && displayOrder === undefined) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_DISPLAY_ORDER_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const isLogo = this.parseOptionalBoolean(payload.isLogo) ?? false;
    if (isLogo && mediaType !== LocationMediaType.IMAGE) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_LOGO_MUST_BE_IMAGE.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const mediaUrl = await this.cloudinaryService.uploadMedia(
      file,
      `location/${location.locationCode}`,
    );

    const createdMedia = await this.locationRepo.CreateLocationMedia({
      locationCode: location.locationCode,
      mediaUrl,
      mediaType,
      displayOrder,
      isLogo,
    });

    if (isLogo) {
      await this.locationRepo.UpdateLocationLogo(location, createdMedia);
    }

    const result = await this.locationRepo.FindLocationMediaDtoByCode(
      createdMedia.mediaCode,
    );

    if (!result) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_NOT_FOUND.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: SuccessLocationMessage.ADD_MEDIA_SUCCESS,
      data: result,
    };
  }

  public async UpdateLocationMedia(
    user: UserDecoratorDtoResponse,
    payload: UpdateLocationMediaRequestDto,
    file?: Express.Multer.File,
  ): Promise<LocationMediaResponseDto> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.mediaCode || payload.mediaCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.locationCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payload.mediaCode.length > 50) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_CODE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      file === undefined &&
      payload.mediaType === undefined &&
      payload.displayOrder === undefined &&
      payload.isLogo === undefined
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_UPDATE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const location = await this.getOwnedLocation(user, payload.locationCode);
    const existingMedia = await this.getLocationMediaOrFail(
      payload.locationCode,
      payload.mediaCode,
    );

    const nextMediaType =
      this.parseMediaType(payload.mediaType) ?? existingMedia.mediaType;
    if (
      payload.mediaType !== undefined &&
      !this.parseMediaType(payload.mediaType)
    ) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_TYPE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const displayOrder = this.parseOptionalDisplayOrder(payload.displayOrder);
    if (payload.displayOrder !== undefined && displayOrder === undefined) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_DISPLAY_ORDER_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const requestedIsLogo = this.parseOptionalBoolean(payload.isLogo);
    if (payload.isLogo !== undefined && requestedIsLogo === undefined) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_UPDATE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (file) {
      this.ensureMediaMatchesFileType(file, nextMediaType);
    }

    if (existingMedia.isLogo && requestedIsLogo === false) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_UPDATE_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const finalIsLogo = requestedIsLogo ?? Boolean(existingMedia.isLogo);
    if (finalIsLogo && nextMediaType !== LocationMediaType.IMAGE) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_LOGO_MUST_BE_IMAGE.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    let mediaUrl: string | undefined;
    if (file) {
      mediaUrl = await this.cloudinaryService.uploadMedia(
        file,
        `location/${location.locationCode}`,
      );
    }

    const updatedMedia = await this.locationRepo.UpdateLocationMediaRecord(
      existingMedia,
      {
        mediaUrl,
        mediaType: nextMediaType,
        displayOrder,
      },
    );

    if (finalIsLogo) {
      await this.locationRepo.UpdateLocationLogo(location, updatedMedia);
    }

    const result = await this.locationRepo.FindLocationMediaDtoByCode(
      updatedMedia.mediaCode,
    );

    if (!result) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_NOT_FOUND.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: SuccessLocationMessage.UPDATE_MEDIA_SUCCESS,
      data: result,
    };
  }

  public async DeleteLocationMedia(
    user: UserDecoratorDtoResponse,
    payload: DeleteLocationMediaRequestDto,
  ): Promise<LocationMediaResponseDto> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.mediaCode || payload.mediaCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.getOwnedLocation(user, payload.locationCode);
    const media = await this.getLocationMediaOrFail(
      payload.locationCode,
      payload.mediaCode,
    );

    if (media.isLogo) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_DELETE_LOGO_FORBIDDEN.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const mediaDto = await this.locationRepo.FindLocationMediaDtoByCode(
      media.mediaCode,
    );

    if (!mediaDto) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.locationRepo.DeleteLocationMediaByCode(media.mediaCode);

    return {
      message: SuccessLocationMessage.DELETE_MEDIA_SUCCESS,
      data: mediaDto,
    };
  }

  public async ReorderLocationMedia(
    user: UserDecoratorDtoResponse,
    payload: ReorderLocationMediaRequestDto,
  ): Promise<LocationMediaListResponseDto> {
    if (!payload.locationCode || payload.locationCode.trim() === '') {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_CODE_NOTEMPTY.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.data || payload.data.length === 0) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_MEDIA_REORDER_INVALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.getOwnedLocation(user, payload.locationCode);

    for (const item of payload.data) {
      if (!item.mediaCode || item.mediaCode.trim() === '') {
        throw new HttpException(
          ErrorLocationMessage.LOCATION_MEDIA_CODE_NOTEMPTY.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!Number.isInteger(item.displayOrder) || item.displayOrder < 1) {
        throw new HttpException(
          ErrorLocationMessage.LOCATION_MEDIA_DISPLAY_ORDER_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.getLocationMediaOrFail(payload.locationCode, item.mediaCode);
    }

    await this.locationRepo.ReorderLocationMedia(
      payload.locationCode,
      payload.data,
    );

    return {
      message: SuccessLocationMessage.REORDER_MEDIA_SUCCESS,
      data: await this.locationRepo.GetLocationMedia(payload.locationCode),
    };
  }

  public async GetShareLink(
    payload: GetShareLinkQueryDto,
  ): Promise<GetShareLinkResponseDto> {
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

    const location = await this.locationRepo.FindLocationByCode(
      payload.locationCode,
    );

    if (!location) {
      throw new HttpException(
        ErrorLocationMessage.LOCATION_NOT_FOUND.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    const rawBaseUrl =
      this.configService.get<string>('FRONTEND_BASE_URL') ||
      this.configService.get<string>('LOCAL_DOMAIN') ||
      'http://localhost:3001';
    const baseUrl = rawBaseUrl
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\/+$/, '');

    return {
      message: SuccessLocationMessage.GET_SHARE_LINK_SUCCESS,
      locationCode: payload.locationCode,
      shareUrl: `${baseUrl}/room-detail?locationCode=${encodeURIComponent(payload.locationCode)}`,
    };
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

    if (payload.content.ratevalue && payload.content.ratevalue === null) {
      payload.content.ratevalue = 0;
    }

    if (payload.commentId) {
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
