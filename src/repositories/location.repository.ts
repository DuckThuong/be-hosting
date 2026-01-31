import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
  ErrorLocationMessage,
  SuccessLocationMessage,
} from '../assests/messages/location.message';
import { randomString } from '../common/helpers/common.helper';
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
  LocationTypeDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationType.dto';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { LOCATION_RENT_STATUS } from '../assests/constants/constants';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(TbLocation)
    private readonly location: Repository<TbLocation>,

    @InjectRepository(TbLocationService)
    private readonly locationService: Repository<TbLocationService>,

    @InjectRepository(TbLocationType)
    private readonly locationType: Repository<TbLocationType>,

    @InjectRepository(TbLocationAddress)
    private readonly locationAddress: Repository<TbLocationAddress>,
  ) {}

  public async createLocationType(
    data: CreateLocationTypePayloadDto,
  ): Promise<CreateLocationTypeResponseDto> {
    const Type = this.locationType.create({
      typeCode: randomString(),
      typeName: data.name,
      typeDescription: data.description,
      typeLogo: data.logo,
      typeBackGround: data.backgroundUrl,
    });
    const savedType = await this.locationType.save(Type);
    return {
      message: SuccessLocationMessage.CREATE_SUCCESS,
      data: plainToInstance(LocationTypeDto, savedType),
    };
  }

  public async updateLocationType(
    existType: TbLocationType,
    payload: UpdateLocationTypePayloadDto,
  ): Promise<UpdateLocationTypeResponseDto> {
    const updatedEntity = this.locationType.merge(existType, {
      typeCode: existType.typeCode,
      typeName: payload.name ?? existType.typeName,
      typeDescription: payload.description ?? existType.typeDescription,
      typeLogo: payload.logo ?? existType.typeLogo,
      typeBackGround: payload.backgroundUrl ?? existType.typeBackGround,
    });
    const savedType = await this.locationType.save(updatedEntity);
    return {
      message: SuccessLocationMessage.UPDATE_SUCCESS,
      data: plainToInstance(LocationTypeDto, savedType),
    };
  }

  public async findLocationTypeById(
    id: number,
  ): Promise<TbLocationType | null> {
    return await this.locationType.findOne({
      where: { id },
    });
  }

  public async getAllLocationType(): Promise<TbLocationType[]> {
    return await this.locationType.find();
  }

  public async AddNewLocationService(
    location: TbLocation,
    payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    const validData = new Array<LocationServiceData>();
    for (const item of payload.data) {
      const isExist = await this.locationService.findBy({
        serviceCode: item.serviceCode,
        locationCode: location.locationCode,
      });
      if (isExist) {
        continue;
      } else {
        validData.push(item);
      }
    }

    if (validData.length > 0) {
      for (const data of validData) {
        const newService = this.locationService.create({
          locationCode: location.locationCode,
          serviceCode: data.serviceCode,
          isActive: data.isActive,
          serviceNote: data.note ?? '',
        });

        await this.locationService.save(newService);
      }
    }
    return {
      message: SuccessLocationMessage.ADD_SERVICE_SUCCESS,
    };
  }

  public async PauseServiceProvide(
    location: TbLocation,
    payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    for (const item of payload.data) {
      if (item.isActive !== false) continue;

      await this.locationService.update(
        {
          locationCode: location.locationCode,
          serviceCode: item.serviceCode,
        },
        {
          isActive: false,
          serviceNote: item.note ?? '',
        },
      );
    }

    return {
      message: SuccessLocationMessage.PAUSE_SERVICE_SUCCESS,
    };
  }

  public async RemoveLocationService(
    location: TbLocation,
    payload: AddLocationServicePayload,
  ): Promise<LocationServiceResponse> {
    for (const item of payload.data) {
      await this.locationService.delete({
        locationCode: location.locationCode,
        serviceCode: item.serviceCode,
      });
    }

    return {
      message: SuccessLocationMessage.REMOVE_SERVICE_SUCCESS,
    };
  }

  public async FindLocationByCode(code: string): Promise<TbLocation | null> {
    return await this.location.findOneBy({ locationCode: code });
  }

  public async CreateLocation(
    payload: CreateLocationDto,
  ): Promise<LocationResponseDto> {
    const location = this.location.create({
      locationCode: randomString(),
      typeCode: payload.typeCode,
      locationName: payload.locationName,
      ownerCode: payload.ownerCode,
      minTimeLimit: payload.minTimeLimit,
      maxTimeLimit: payload.maxTimeLimit,
      hasRent: payload.hasRent ?? 0,
      userRentCd: payload.userRentCd,
      locationDescription: payload.locationDescription,
      locationNote: payload.locationNote,
      locationStatus: payload.locationStatus,
      locationRate: payload.locationRate,
    });

    const savedLocation = await this.location.save(location);

    return {
      message: 'Tạo địa điểm cho thuê thành công',
      data: savedLocation,
    };
  }

  public async UpdateLocation(
    payload: UpdatelocationPayloadDto,
  ): Promise<LocationResponseDto> {
    const existingLocation = await this.location.findOneBy({
      locationCode: payload.locationCode,
    });

    if (existingLocation) {
      const updateData: Partial<TbLocation> = {
        typeCode: payload.data.typeCode,
        locationName: payload.data.locationName,
        locationStatus: payload.data.locationStatus,
      };

      if (payload.data.minTimeLimit !== undefined) {
        updateData.minTimeLimit = payload.data.minTimeLimit;
      }
      if (payload.data.maxTimeLimit !== undefined) {
        updateData.maxTimeLimit = payload.data.maxTimeLimit;
      }
      if (payload.data.hasRent !== undefined) {
        updateData.hasRent = payload.data.hasRent;
      }
      if (payload.data.userRentCd !== undefined) {
        updateData.userRentCd = payload.data.userRentCd;
      }
      if (payload.data.locationDescription !== undefined) {
        updateData.locationDescription = payload.data.locationDescription;
      }
      if (payload.data.locationNote !== undefined) {
        updateData.locationNote = payload.data.locationNote;
      }
      if (payload.data.locationRate !== undefined) {
        updateData.locationRate = payload.data.locationRate;
      }

      const updatedEntity = this.location.merge(existingLocation, updateData);

      const savedLocation = await this.location.save(updatedEntity);

      return {
        message: SuccessLocationMessage.UPDATE_SUCCESS,
        data: savedLocation,
      };
    } else {
      return {
        message: ErrorLocationMessage.LOCATION_NOT_FOUND,
      };
    }
  }

  public async DeleteLocation(
    payload: DeleteLocationDto,
  ): Promise<DeleteLocationResponseDto> {
    const existingLocation = await this.location.findOneBy({
      locationCode: payload.locationCode,
    });
    if (existingLocation) {
      if (
        existingLocation.hasRent === LOCATION_RENT_STATUS.HAS_RENT ||
        existingLocation.userRentCd
      ) {
        return {
          message: ErrorLocationMessage.LOCATION_IN_USE,
          data: { deleted: false },
        };
      } else {
        await this.location.delete({ locationCode: payload.locationCode });
        return {
          message: SuccessLocationMessage.DELETE_SUCCESS,
          data: { deleted: true },
        };
      }
    } else {
      return {
        message: ErrorLocationMessage.LOCATION_NOT_FOUND,
        data: { deleted: false },
      };
    }
  }

  public async UpdateRentStatus(
    payload: UpdateRentStatusDto,
  ): Promise<UpdateRentStatusResponseDto> {
    const existingLocation = await this.location.findOneBy({
      locationCode: payload.locationCode,
    });
    if (existingLocation) {
      const updatedEntity = this.location.merge(existingLocation, {
        hasRent: payload.hasRent,
        userRentCd: payload.userRentCd,
      });

      const savedLocation = await this.location.save(updatedEntity);

      return {
        message: SuccessLocationMessage.UPDATE_SUCCESS,
        data: savedLocation,
      };
    } else {
      return {
        message: ErrorLocationMessage.LOCATION_NOT_FOUND,
        data: {},
      };
    }
  }
}
