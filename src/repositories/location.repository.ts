import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { LOCATION_RENT_STATUS } from '../assests/constants/constants';
import {
  ErrorLocationMessage,
  SuccessLocationMessage,
} from '../assests/messages/location.message';
import { randomString } from '../common/helpers/common.helper';
import {
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationResponseDto,
  GetLocationAddressByLocationCodeResponseDto,
  LocationAddressItemDto,
  LocationListDto,
  LocationResponseDto,
  LocationServiceDto,
  UpdatelocationPayloadDto,
  UpdateRentStatusDto,
  UpdateRentStatusResponseDto,
} from '../dtos/location/location.dto';
import {
  CreateLocationAddressPayloadDto,
  CreateLocationAddressResponseDto,
  DeleteAllLocationAddressesDto,
  DeleteLocationAddressesDto,
  DeleteLocationAddressResponseDto,
  LocationAddressDto,
  UpdateLocationAddressPayloadDto,
  UpdateLocationAddressResponseDto,
} from '../dtos/location/locationAddress.dto';
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
      if (isExist.length > 0) {
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

  public async CreateLocationAddress(
    payload: CreateLocationAddressPayloadDto,
  ): Promise<CreateLocationAddressResponseDto> {
    const existingLocation = await this.location.findOneBy({
      locationCode: payload.locationCode,
    });

    if (!existingLocation) {
      return {
        message: ErrorLocationMessage.LOCATION_NOT_FOUND,
      };
    }

    if (!payload.data || payload.data.length === 0) {
      return {
        message: ErrorLocationMessage.ADDRESS_DATA_NOTEMPTY,
      };
    }

    const queryRunner =
      this.locationAddress.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedAddresses: LocationAddressDto[] = [];

      for (const addressData of payload.data) {
        const newAddress = this.locationAddress.create({
          locationCode: payload.locationCode,
          addressCode: randomString(),
          addressName: addressData.addressName,
          fullAddress: addressData.fullAddress,
          addressWard: addressData.addressWard,
          addressDistrict: addressData.addressDistrict,
          addressCity: addressData.addressCity,
          addressProvince: addressData.addressProvince,
          addressCountry: addressData.addressCountry,
          addRessPortal: addressData.addRessPortal,
          addressLat: addressData.addressLat,
          addressLong: addressData.addressLong,
          addressRegion: addressData.addressRegion,
          addressStatus: addressData.addressStatus,
          addressDescription: addressData.addressDescription ?? '',
          addressNote: addressData.addressNote ?? '',
          addressType: addressData.addressType,
        });

        const savedAddress = await queryRunner.manager.save(newAddress);
        savedAddresses.push(savedAddress);
      }

      await queryRunner.commitTransaction();

      return {
        message: SuccessLocationMessage.CREATE_ADDRESS_SUCCESS,
        data: plainToInstance(LocationAddressDto, savedAddresses),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async UpdateLocationAddress(
    payload: UpdateLocationAddressPayloadDto,
  ): Promise<UpdateLocationAddressResponseDto> {
    if (!payload.data || payload.data.length === 0) {
      return {
        message: ErrorLocationMessage.ADDRESS_DATA_NOTEMPTY,
      };
    }

    const queryRunner =
      this.locationAddress.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedAddresses: any[] = [];

      for (const address of payload.data) {
        const existingAddress = await queryRunner.manager.findOneBy(
          TbLocationAddress,
          {
            addressCode: address.addressCode,
            locationCode: payload.locationCode,
          },
        );

        if (!existingAddress) {
          const newAddress = queryRunner.manager.create(TbLocationAddress, {
            locationCode: payload.locationCode,
            addressCode: randomString(),
            addressName: address.addressName,
            fullAddress: address.fullAddress,
            addressWard: address.addressWard,
            addressDistrict: address.addressDistrict,
            addressCity: address.addressCity,
            addressProvince: address.addressProvince,
            addressCountry: address.addressCountry,
            addRessPortal: address.addRessPortal,
            addressLat: address.addressLat,
            addressLong: address.addressLong,
            addressRegion: address.addressRegion,
            addressStatus: address.addressStatus,
            addressDescription: address.addressDescription ?? '',
            addressNote: address.addressNote ?? '',
            addressType: address.addressType,
          });

          const savedAddress = await queryRunner.manager.save(newAddress);
          updatedAddresses.push(savedAddress);
        } else {
          const updateData: Partial<TbLocationAddress> = {};

          if (address.addressName !== undefined) {
            updateData.addressName = address.addressName;
          }
          if (address.fullAddress !== undefined) {
            updateData.fullAddress = address.fullAddress;
          }
          if (address.addressWard !== undefined) {
            updateData.addressWard = address.addressWard;
          }
          if (address.addressDistrict !== undefined) {
            updateData.addressDistrict = address.addressDistrict;
          }
          if (address.addressCity !== undefined) {
            updateData.addressCity = address.addressCity;
          }
          if (address.addressProvince !== undefined) {
            updateData.addressProvince = address.addressProvince;
          }
          if (address.addressCountry !== undefined) {
            updateData.addressCountry = address.addressCountry;
          }
          if (address.addRessPortal !== undefined) {
            updateData.addRessPortal = address.addRessPortal;
          }
          if (address.addressLat !== undefined) {
            updateData.addressLat = address.addressLat;
          }
          if (address.addressLong !== undefined) {
            updateData.addressLong = address.addressLong;
          }
          if (address.addressRegion !== undefined) {
            updateData.addressRegion = address.addressRegion;
          }
          if (address.addressStatus !== undefined) {
            updateData.addressStatus = address.addressStatus;
          }
          if (address.addressDescription !== undefined) {
            updateData.addressDescription = address.addressDescription;
          }
          if (address.addressNote !== undefined) {
            updateData.addressNote = address.addressNote;
          }
          if (address.addressType !== undefined) {
            updateData.addressType = address.addressType;
          }

          const updatedEntity = queryRunner.manager.merge(
            TbLocationAddress,
            existingAddress,
            updateData,
          );

          const savedAddress = await queryRunner.manager.save(updatedEntity);
          updatedAddresses.push(savedAddress);
        }
      }

      await queryRunner.commitTransaction();

      return {
        message: SuccessLocationMessage.CREATE_SUCCESS,
        data: plainToInstance(LocationAddressDto, updatedAddresses),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async DeleteLocationAddress(
    payload: DeleteLocationAddressesDto,
  ): Promise<DeleteLocationAddressResponseDto> {
    const existingAddress = await this.locationAddress.findOneBy({
      addressCode: payload.addressCode,
    });

    if (!existingAddress) {
      return {
        message: ErrorLocationMessage.ADDRESS_NOT_FOUND,
        data: { deleted: false },
      };
    }

    await this.locationAddress.delete({
      addressCode: payload.addressCode,
    });

    return {
      message: SuccessLocationMessage.DELETE_ADDRESS_SUCCESS,
      data: { deleted: true },
    };
  }

  public async DeleteAllLocationAddresses(
    payload: DeleteAllLocationAddressesDto,
  ): Promise<DeleteLocationAddressResponseDto> {
    const existingAddresses = await this.locationAddress.find({
      where: { locationCode: payload.locationCode },
    });

    if (existingAddresses.length === 0) {
      return {
        message: ErrorLocationMessage.ADDRESS_NOT_FOUND as string,
        data: { deleted: false },
      };
    }

    await this.locationAddress.delete({
      locationCode: payload.locationCode,
    });

    return {
      message: SuccessLocationMessage.DELETE_ADDRESS_SUCCESS as string,
      data: {
        deleted: true,
      },
    };
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
        await this.DeleteAllLocationAddresses({
          locationCode: existingLocation.locationCode,
        });

        await this.locationService.delete({
          locationCode: existingLocation.locationCode,
        });
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

  public async GetAllLocation(): Promise<LocationListDto[]> {
    const locations = await this.location
      .createQueryBuilder('TL')
      .leftJoin('TB_LOCATION-TYPE', 'TLT', 'TLT.typeCode = TL.typeCode')
      .leftJoin('TB_USER_DEFAULT', 'TUDO', 'TUDO.userCode = TL.ownerCode')
      .leftJoin('TB_USER_PROFILE', 'TUPO', 'TUPO.user_id = TUDO.id')
      .leftJoin('TB_USER_DEFAULT', 'TUDR', 'TUDR.userCode = TL.userRentCd')
      .leftJoin('TB_USER_PROFILE', 'TUPR', 'TUPR.user_id = TUDR.id')
      .select('TL.locationCode', 'locationCode')
      .addSelect('TL.locationName', 'locationName')
      .addSelect('TL.locationDescription', 'locationDescription')
      .addSelect('TL.locationNote', 'locationNote')
      .addSelect('TL.minTimeLimit', 'minTime')
      .addSelect('TL.maxTimeLimit', 'maxTime')
      .addSelect('TL.hasRent', 'hasRent')
      .addSelect('TL.locationRate', 'locationRate')
      .addSelect('TL.typeCode', 'typeCode')
      .addSelect('TLT.typeName', 'typeName')
      .addSelect('TLT.typeDescription', 'typeDescription')
      .addSelect('TLT.typeLogo', 'typeLogo')
      .addSelect('TLT.typeBackGround', 'typeBackGround')
      .addSelect('TL.ownerCode', 'ownerCode')
      .addSelect('TUDO.userName', 'ownerName')
      .addSelect('TUDO.email', 'ownerEmail')
      .addSelect('TUPO.avatarUrl', 'ownerAvatar')
      .addSelect('TUPO.coverUrl', 'ownerCover')
      .addSelect('TUPO.phone', 'ownerPhone')
      .addSelect('TUPO.fullAddress', 'ownerAddress')
      .addSelect('TUPO.userCity', 'ownerCity')
      .addSelect('TL.userRentCd', 'renterCode')
      .addSelect('TUDR.userName', 'renterName')
      .addSelect('TUDR.email', 'renterEmail')
      .addSelect('TUPR.avatarUrl', 'renterAvatar')
      .addSelect('TUPR.coverUrl', 'renterCover')
      .addSelect('TUPR.phone', 'renterPhone')
      .addSelect('TUPR.fullAddress', 'renterAddress')
      .addSelect('TUPR.userCity', 'renterCity')
      .getRawMany<LocationListDto>();

    return locations;
  }

  public async GetLocationServices(
    locationCode: string,
  ): Promise<LocationServiceDto[]> {
    const result = await this.locationService
      .createQueryBuilder('tls')
      .leftJoin('tb_service', 'ts', 'tls.serviceCode = ts.serviceCode')
      .select('ts.serviceCode', 'serviceCode')
      .addSelect('ts.serviceLogo', 'serviceLogo')
      .addSelect('ts.serviceBackGround', 'serviceBackGround')
      .addSelect('ts.serviceName', 'serviceName')
      .addSelect('ts.servicePrice', 'servicePrice')
      .addSelect('ts.serviceDescription', 'serviceDescription')
      .addSelect('tls.serviceNote', 'serviceNote')
      .addSelect('tls.isActive', 'isActive')
      .where('tls.locationCode = :locationCode', { locationCode })
      .getRawMany<LocationServiceDto>();

    return result;
  }

  public async GetLocationAddressByLocationCode(
    locationCode: string,
  ): Promise<GetLocationAddressByLocationCodeResponseDto> {
    const result = await this.locationAddress
      .createQueryBuilder('tla')
      .select([
        'tla.addressCode AS addressCode',
        'tla.addressName AS addressName',
        'tla.fullAddress AS fullAddress',
        'tla.addressWard AS addressWard',
        'tla.addressDistrict AS addressDistrict',
        'tla.addressCity AS addressCity',
        'tla.addressProvince AS addressProvince',
        'tla.addressCountry AS addressCountry',
        'tla.addRessPortal AS addRessPortal',
        'tla.addressLat AS addressLat',
        'tla.addressLong AS addressLong',
        'tla.addressRegion AS addressRegion',
        'tla.addressStatus AS addressStatus',
        'tla.addressDescription AS addressDescription',
        'tla.addressNote AS addressNote',
        'tla.addressType AS addressType',
      ])
      .where('tla.locationCode = :locationCode', { locationCode })
      .getRawMany<LocationAddressItemDto>();

    return {
      data: result,
    };
  }
}
