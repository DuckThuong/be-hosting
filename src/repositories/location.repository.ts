import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { SuccessLocationMessage } from '../assests/messages/location.message';
import {
  CreateLocationTypePayloadDto,
  CreateLocationTypeResponseDto,
  LocationTypeDto,
  UpdateLocationTypePayloadDto,
  UpdateLocationTypeResponseDto,
} from '../dtos/location/locationType.dto';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import {
  AddLocationServicePayload,
  LocationServiceData,
  LocationServiceResponse,
} from '../dtos/location/locationService.dto';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(TbLocation)
    private readonly location: Repository<TbLocation>,

    @InjectRepository(TbLocationService)
    private readonly locationService: Repository<TbLocationService>,

    @InjectRepository(TbLocationType)
    private readonly locationType: Repository<TbLocationType>,

    @InjectRepository(TbLocationType)
    private readonly locationAddress: Repository<TbLocationAddress>,
  ) {}

  public async createLocationType(
    data: CreateLocationTypePayloadDto,
  ): Promise<CreateLocationTypeResponseDto> {
    const Type = this.locationType.create({
      typeCode: data.code,
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
}
