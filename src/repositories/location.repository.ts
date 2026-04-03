import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Brackets, Like, Repository } from 'typeorm';
import {
  ADDRESS_STATUS,
  ADDRESS_TYPE,
  LOCATION_RENT_STATUS,
} from '../assests/constants/constants';
import {
  ErrorLocationMessage,
  SuccessLocationMessage,
} from '../assests/messages/location.message';
import { randomString, validString } from '../common/helpers/common.helper';
import {
  CreateLocationDto,
  DeleteLocationDto,
  DeleteLocationResponseDto,
  FavoriteLocationSummaryDto,
  GetLocationAddressByLocationCodeResponseDto,
  GetLocationByFillterDto,
  LocationAddressItemDto,
  LocationListDto,
  LocationMediaDto,
  LocationResponseDto,
  LocationServiceDto,
  PaginatedLocationListDto,
  ToggleFavoriteResponseDto,
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
import { UserDecoratorDtoResponse, UserRole } from '../dtos/user/user.dto';
import { TbLocation } from '../entities/location/location.entity';
import { TbLocationAddress } from '../entities/location/locationAddress.entity';
import { TbLocationFavorite } from '../entities/location/locationFavorite.entity';
import {
  LocationMediaType,
  TbLocationMedia,
} from '../entities/location/locationMedia.entity';
import { TbLocationService } from '../entities/location/locationService.entity';
import { TbLocationType } from '../entities/location/locationType.entity';
import { TbUserDefault } from '../entities/user/user_default.entity';

type RangeBounds = {
  minValue: number | null;
  maxValue: number | null;
};

@Injectable()
export class LocationRepository {
  constructor(
    @InjectRepository(TbLocation)
    private readonly location: Repository<TbLocation>,

    @InjectRepository(TbLocationService)
    private readonly locationService: Repository<TbLocationService>,

    @InjectRepository(TbLocationFavorite)
    private readonly locationFavorite: Repository<TbLocationFavorite>,

    @InjectRepository(TbLocationMedia)
    private readonly locationMedia: Repository<TbLocationMedia>,

    @InjectRepository(TbLocationType)
    private readonly locationType: Repository<TbLocationType>,

    @InjectRepository(TbLocationAddress)
    private readonly locationAddress: Repository<TbLocationAddress>,

    @InjectRepository(TbUserDefault)
    private readonly user: Repository<TbUserDefault>,
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
      await this.locationService.delete({
        locationCode: location.locationCode,
        serviceCode: item.serviceCode,
      });
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
      const addressLength = await this.locationAddress.findBy({
        locationCode: payload.locationCode,
      });

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
          addressPortal: addressData.addressPortal,
          addressLat: addressData.addressLat,
          addressLong: addressData.addressLong,
          addressRegion: addressData.addressRegion,
          addressStatus: ADDRESS_STATUS.ACTIVE.toString(),
          addressDescription: addressData.addressDescription ?? '',
          addressNote: addressData.addressNote ?? '',
          addressType:
            addressLength.length === 0
              ? ADDRESS_TYPE.MAIN_ADDRESS.toString()
              : ADDRESS_TYPE.SUB_ADDRESS.toString(),
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
      const addressLength = await this.locationAddress.findBy({
        locationCode: payload.locationCode,
      });
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
            addressPortal: address.addressPortal,
            addressLat: address.addressLat,
            addressLong: address.addressLong,
            addressRegion: address.addressRegion,
            addressStatus: ADDRESS_STATUS.ACTIVE.toString(),
            addressDescription: address.addressDescription ?? '',
            addressNote: address.addressNote ?? '',
            addressType:
              addressLength.length === 0
                ? ADDRESS_TYPE.MAIN_ADDRESS.toString()
                : ADDRESS_TYPE.SUB_ADDRESS.toString(),
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
          if (address.addressPortal !== undefined) {
            updateData.addressPortal = address.addressPortal;
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
          if (addressLength.length === 0) {
            updateData.addressType = ADDRESS_TYPE.MAIN_ADDRESS.toString();
          } else {
            updateData.addressType = ADDRESS_TYPE.SUB_ADDRESS.toString();
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
      locationLogo: payload.locationLogo,
      ownerCode: payload.ownerCode,
      locationPriceStart: payload.locationPriceStart,
      locationPriceEnd: payload.locationPriceEnd,
      locationPriceAfterDeal: payload.locationPriceAfterDeal,
      locationArea: payload.locationArea,
      minTimeLimit: payload.minTimeLimit,
      maxTimeLimit: payload.maxTimeLimit,
      hasRent: payload.hasRent ?? 0,
      userRentCd: payload.userRentCd,
      locationDescription: payload.locationDescription,
      locationNote: payload.locationNote,
      locationStatus: payload.locationStatus,
      locationRate: payload.locationRate || 0,
    });
    const user = await this.user.findOneBy({ userCode: payload.ownerCode });
    if (user) {
      user.role = UserRole.OWNER;
      await this.user.save(user);
    }
    const savedLocation = await this.location.save(location);

    return {
      message: 'Táº¡o Ä‘á»‹a Ä‘iá»ƒm cho thuÃª thÃ nh cÃ´ng',
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

      if (payload.data.locationPriceStart !== undefined) {
        updateData.locationPriceStart = payload.data.locationPriceStart;
      }
      if (payload.data.locationPriceEnd !== undefined) {
        updateData.locationPriceEnd = payload.data.locationPriceEnd;
      }
      if (payload.data.locationPriceAfterDeal !== undefined) {
        updateData.locationPriceAfterDeal = payload.data.locationPriceAfterDeal;
      }
      if (payload.data.locationArea !== undefined) {
        updateData.locationArea = payload.data.locationArea;
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

        await this.locationMedia.delete({
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
      .leftJoin('tb_location-type', 'TLT', 'TLT.typeCode = TL.typeCode')
      .leftJoin('tb_user_default', 'TUDO', 'TUDO.userCode = TL.ownerCode')
      .leftJoin('tb_user_profile', 'TUPO', 'TUPO.user_id = TUDO.id')
      .leftJoin('tb_user_default', 'TUDR', 'TUDR.userCode = TL.userRentCd')
      .leftJoin('tb_user_profile', 'TUPR', 'TUPR.user_id = TUDR.id')
      .select('TL.locationCode', 'locationCode')
      .addSelect('TL.locationName', 'locationName')
      .addSelect('TL.locationDescription', 'locationDescription')
      .addSelect('TL.locationNote', 'locationNote')
      .addSelect('TL.locationLogo', 'locationLogo')
      .addSelect('TL.locationPriceStart', 'locationPriceStart')
      .addSelect('TL.locationPriceEnd', 'locationPriceEnd')
      .addSelect('TL.locationPriceAfterDeal', 'locationPriceAfterDeal')
      .addSelect('TL.locationArea', 'locationArea')
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

  public async GetAllLocationOnUserOwner(
    user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    const locations = await this.location
      .createQueryBuilder('TL')
      .leftJoin('tb_location-type', 'TLT', 'TLT.typeCode = TL.typeCode')
      .leftJoin('tb_user_default', 'TUDO', 'TUDO.userCode = TL.ownerCode')
      .leftJoin('tb_user_profile', 'TUPO', 'TUPO.user_id = TUDO.id')
      .leftJoin('tb_user_default', 'TUDR', 'TUDR.userCode = TL.userRentCd')
      .leftJoin('tb_user_profile', 'TUPR', 'TUPR.user_id = TUDR.id')
      .select('TL.locationCode', 'locationCode')
      .addSelect('TL.locationName', 'locationName')
      .addSelect('TL.locationDescription', 'locationDescription')
      .addSelect('TL.locationLogo', 'locationLogo')
      .addSelect('TL.locationNote', 'locationNote')
      .addSelect('TL.locationPriceStart', 'locationPriceStart')
      .addSelect('TL.locationPriceEnd', 'locationPriceEnd')
      .addSelect('TL.locationPriceAfterDeal', 'locationPriceAfterDeal')
      .addSelect('TL.locationArea', 'locationArea')
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
      .where('TL.ownerCode = :ownerCode', { ownerCode: user.userCode })
      .getRawMany<LocationListDto>();

    return locations;
  }

  public async GetAllLocationOnUserRenter(
    user: UserDecoratorDtoResponse,
  ): Promise<LocationListDto[]> {
    const locations = await this.location
      .createQueryBuilder('TL')
      .leftJoin('tb_location-type', 'TLT', 'TLT.typeCode = TL.typeCode')
      .leftJoin('tb_user_default', 'TUDO', 'TUDO.userCode = TL.ownerCode')
      .leftJoin('tb_user_profile', 'TUPO', 'TUPO.user_id = TUDO.id')
      .leftJoin('tb_user_default', 'TUDR', 'TUDR.userCode = TL.userRentCd')
      .leftJoin('tb_user_profile', 'TUPR', 'TUPR.user_id = TUDR.id')
      .select('TL.locationCode', 'locationCode')
      .addSelect('TL.locationName', 'locationName')
      .addSelect('TL.locationDescription', 'locationDescription')
      .addSelect('TL.locationLogo', 'locationLogo')
      .addSelect('TL.locationNote', 'locationNote')
      .addSelect('TL.locationPriceStart', 'locationPriceStart')
      .addSelect('TL.locationPriceEnd', 'locationPriceEnd')
      .addSelect('TL.locationPriceAfterDeal', 'locationPriceAfterDeal')
      .addSelect('TL.locationArea', 'locationArea')
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
      .where('TL.userRentCd = :userRentCd', { userRentCd: user.userCode })
      .getRawMany<LocationListDto>();

    return locations;
  }

  public async GetLocationByCode(
    locationCode: string,
  ): Promise<LocationListDto> {
    const location = await this.location
      .createQueryBuilder('TL')
      .leftJoin('tb_location-type', 'TLT', 'TLT.typeCode = TL.typeCode')
      .leftJoin('tb_user_default', 'TUDO', 'TUDO.userCode = TL.ownerCode')
      .leftJoin('tb_user_profile', 'TUPO', 'TUPO.user_id = TUDO.id')
      .leftJoin('tb_user_default', 'TUDR', 'TUDR.userCode = TL.userRentCd')
      .leftJoin('tb_user_profile', 'TUPR', 'TUPR.user_id = TUDR.id')
      .select('TL.locationCode', 'locationCode')
      .addSelect('TL.locationName', 'locationName')
      .addSelect('TL.locationDescription', 'locationDescription')
      .addSelect('TL.locationLogo', 'locationLogo')
      .addSelect('TL.locationNote', 'locationNote')
      .addSelect('TL.locationPriceStart', 'locationPriceStart')
      .addSelect('TL.locationPriceEnd', 'locationPriceEnd')
      .addSelect('TL.locationPriceAfterDeal', 'locationPriceAfterDeal')
      .addSelect('TL.locationArea', 'locationArea')
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
      .where('TL.locationCode = :locationCode', { locationCode })
      .getRawOne<LocationListDto>();

    return location as LocationListDto;
  }

  public async ToggleFavorite(
    userCode: string,
    location: TbLocation,
  ): Promise<ToggleFavoriteResponseDto> {
    const existingFavorite = await this.locationFavorite.findOneBy({
      locationCode: location.locationCode,
      userCode,
    });

    if (existingFavorite) {
      await this.locationFavorite.delete({
        locationCode: location.locationCode,
        userCode,
      });

      return {
        message: SuccessLocationMessage.FAVORITE_REMOVED_SUCCESS,
        locationCode: location.locationCode,
        isFavorite: false,
      };
    }

    const favorite = this.locationFavorite.create({
      locationCode: location.locationCode,
      userCode,
    });

    await this.locationFavorite.save(favorite);

    return {
      message: SuccessLocationMessage.FAVORITE_ADDED_SUCCESS,
      locationCode: location.locationCode,
      isFavorite: true,
    };
  }

  public async GetMyFavoriteLocation(
    userCode: string,
  ): Promise<FavoriteLocationSummaryDto[]> {
    const locations = await this.location
      .createQueryBuilder('TL')
      .innerJoin(
        'tb_location-favorite',
        'TLF',
        'TLF.locationCode = TL.locationCode AND TLF.userCode = :userCode',
        { userCode },
      )
      .leftJoin('tb_location-type', 'TLT', 'TLT.typeCode = TL.typeCode')
      .select('TL.locationCode', 'locationCode')
      .addSelect('TL.locationName', 'locationName')
      .addSelect('TL.locationLogo', 'locationLogo')
      .addSelect('TL.locationPriceStart', 'locationPriceStart')
      .addSelect('TL.locationPriceEnd', 'locationPriceEnd')
      .addSelect('TL.locationArea', 'locationArea')
      .addSelect('TL.hasRent', 'hasRent')
      .addSelect('TL.typeCode', 'typeCode')
      .addSelect('TLT.typeName', 'typeName')
      .addSelect(
        `(SELECT tla.fullAddress FROM \`tb_location-address\` tla WHERE tla.locationCode = TL.locationCode ORDER BY tla.id ASC LIMIT 1)`,
        'fullAddress',
      )
      .addSelect('1', 'isFavorite')
      .orderBy('TL.id', 'DESC')
      .getRawMany<FavoriteLocationSummaryDto>();

    return locations;
  }

  public async GetLocationByFilter(
    user: UserDecoratorDtoResponse,
    payload: GetLocationByFillterDto,
  ): Promise<PaginatedLocationListDto> {
    const qb = this.location
      .createQueryBuilder('TL')
      .leftJoin('tb_location-type', 'TLT', 'TLT.typeCode = TL.typeCode')
      .leftJoin('tb_user_default', 'TUDO', 'TUDO.userCode = TL.ownerCode')
      .leftJoin('tb_user_profile', 'TUPO', 'TUPO.user_id = TUDO.id')
      .leftJoin('tb_user_default', 'TUDR', 'TUDR.userCode = TL.userRentCd')
      .leftJoin('tb_user_profile', 'TUPR', 'TUPR.user_id = TUDR.id')
      .select([
        'TL.locationCode AS locationCode',
        'TL.locationName AS locationName',
        'TL.locationDescription AS locationDescription',
        'TL.locationNote AS locationNote',
        'TL.locationLogo AS locationLogo',
        'TL.minTimeLimit AS minTime',
        'TL.maxTimeLimit AS maxTime',
        'TL.hasRent AS hasRent',
        'TL.locationRate AS locationRate',
        'TL.typeCode AS typeCode',
        'TL.locationPriceStart AS locationPriceStart',
        'TL.locationPriceEnd AS locationPriceEnd',
        'TL.locationPriceAfterDeal AS locationPriceAfterDeal',
        'TL.locationArea AS locationArea',

        'TLT.typeName AS typeName',
        'TLT.typeDescription AS typeDescription',
        'TLT.typeLogo AS typeLogo',
        'TLT.typeBackGround AS typeBackGround',

        'TL.ownerCode AS ownerCode',
        'TUDO.userName AS ownerName',
        'TUDO.email AS ownerEmail',
        'TUPO.avatarUrl AS ownerAvatar',
        'TUPO.coverUrl AS ownerCover',
        'TUPO.phone AS ownerPhone',
        'TUPO.fullAddress AS ownerAddress',
        'TUPO.userCity AS ownerCity',

        'TL.userRentCd AS renterCode',
        'TUDR.userName AS renterName',
        'TUDR.email AS renterEmail',
        'TUPR.avatarUrl AS renterAvatar',
        'TUPR.coverUrl AS renterCover',
        'TUPR.phone AS renterPhone',
        'TUPR.fullAddress AS renterAddress',
        'TUPR.userCity AS renterCity',
      ]);

    if (validString(payload.locationName)) {
      qb.andWhere('TL.locationName LIKE :locationName', {
        locationName: `%${payload.locationName}%`,
      });
    }

    if (validString(payload.locationType)) {
      qb.andWhere('TL.typeCode LIKE :locationType', {
        locationType: `%${payload.locationType}%`,
      });
    }

    if (validString(payload.typeName)) {
      const type = await this.locationType.findOneBy({
        typeName: Like(`%${payload.typeName}%`),
      });
      if (type) {
        qb.andWhere('TL.typeCode LIKE :locationType', {
          locationType: `%${type.typeCode}%`,
        });
      }
    }

    if (validString(payload.ownerEmail) && validString(payload.ownerName)) {
      const user = await this.user
        .createQueryBuilder('u')
        .where('u.email = :email', { email: payload.ownerEmail })
        .andWhere('u.username LIKE :username', {
          username: `%${payload.ownerName}%`,
        })
        .getOne();

      if (user) {
        qb.andWhere('TL.ownerCode LIKE :ownerCode', {
          ownerCode: `%${user.userCode}%`,
        });
      }
    }

    if (payload.hasRent) {
      qb.andWhere('TL.hasRent LIKE :hasRent', {
        hasRent: `%${payload.hasRent}%`,
      });
    }

    if (validString(payload.renderEmail) && validString(payload.renderName)) {
      const user = await this.user
        .createQueryBuilder('u')
        .where('u.email = :email', { email: payload.renderEmail })
        .andWhere('u.username LIKE :username', {
          username: `%${payload.renderName}%`,
        })
        .getOne();

      if (user) {
        qb.andWhere('TL.userRentCd LIKE :userRentCd', {
          userRentCd: `%${user.userCode}%`,
        });
      }
    }

    if (payload.locationRate) {
      qb.andWhere('TL.locationRate LIKE :locationRate', {
        locationRate: `%${payload.locationRate}%`,
      });
    }

    const locationCodes = await this.getLocationCodesByAddress(payload);
    if (locationCodes && locationCodes.length > 0) {
      qb.andWhere('TL.locationCode IN (:...locationCodes)', {
        locationCodes,
      });
    }

    if (validString(payload.searchValue)) {
      const sv = `%${payload.searchValue}%`;

      const addressMatchedCodes = await this.getLocationCodesByAddress({
        ...payload,
        fullAddress: payload.searchValue,
      });

      if (addressMatchedCodes && addressMatchedCodes.length > 0) {
        qb.andWhere(
          new Brackets((qb2) => {
            qb2
              .where('TL.locationName LIKE :sv', { sv })
              .orWhere('TLT.typeName LIKE :sv', { sv })
              .orWhere('TL.locationCode IN (:...addressMatchedCodes)', {
                addressMatchedCodes,
              });
          }),
        );
      } else {
        qb.andWhere(
          new Brackets((qb2) => {
            qb2
              .where('TL.locationName LIKE :sv', { sv })
              .orWhere('TLT.typeName LIKE :sv', { sv });
          }),
        );
      }
    }

    qb.andWhere('TL.ownerCode NOT LIKE :ownerCodeLogin', {
      ownerCodeLogin: `%${user.userCode}%`,
    });

    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 10;
    const offset = (page - 1) * limit;

    const total = await qb.clone().getCount();

    const data = await qb
      .orderBy('TL.locationCode', 'ASC')
      .offset(offset)
      .limit(limit)
      .getRawMany<LocationListDto>();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async getLocationCodesByAddress(
    payload: GetLocationByFillterDto,
  ): Promise<string[] | []> {
    const hasAddressFilter =
      validString(payload.addressName) ||
      validString(payload.fullAddress) ||
      validString(payload.addressWard) ||
      validString(payload.addressDistrict) ||
      validString(payload.addressCity) ||
      validString(payload.addressProvince) ||
      validString(payload.addressCountry) ||
      validString(payload.addressRegion) ||
      validString(payload.addressType) ||
      (validString(payload.addressLat) && validString(payload.addressLong));

    if (!hasAddressFilter) {
      return [];
    }

    const qb = this.locationAddress
      .createQueryBuilder('TLA')
      .select('DISTINCT TLA.locationCode', 'locationCode');

    if (validString(payload.addressName)) {
      qb.andWhere('TLA.addressName LIKE :addressName', {
        addressName: `%${payload.addressName}%`,
      });
    }

    if (validString(payload.fullAddress)) {
      qb.andWhere('TLA.fullAddress LIKE :fullAddress', {
        fullAddress: `%${payload.fullAddress}%`,
      });
    }

    if (validString(payload.addressWard)) {
      qb.andWhere('TLA.addressWard LIKE :addressWard', {
        addressWard: `%${payload.addressWard}%`,
      });
    }

    if (validString(payload.addressDistrict)) {
      qb.andWhere('TLA.addressDistrict LIKE :addressDistrict', {
        addressDistrict: `%${payload.addressDistrict}%`,
      });
    }

    if (validString(payload.addressCity)) {
      qb.andWhere('TLA.addressCity LIKE :addressCity', {
        addressCity: `%${payload.addressCity}%`,
      });
    }

    if (validString(payload.addressProvince)) {
      qb.andWhere('TLA.addressProvince LIKE :addressProvince', {
        addressProvince: `%${payload.addressProvince}%`,
      });
    }

    if (validString(payload.addressCountry)) {
      qb.andWhere('TLA.addressCountry LIKE :addressCountry', {
        addressCountry: `%${payload.addressCountry}%`,
      });
    }

    if (validString(payload.addressRegion)) {
      qb.andWhere('TLA.addressRegion LIKE :addressRegion', {
        addressRegion: `%${payload.addressRegion}%`,
      });
    }

    if (validString(payload.addressType)) {
      qb.andWhere('TLA.addressType LIKE :addressType', {
        addressType: `%${payload.addressType}%`,
      });
    }

    if (validString(payload.addressLat) && validString(payload.addressLong)) {
      qb.andWhere('TLA.addressLat LIKE :addressLat', {
        addressLat: `%${payload.addressLat}%`,
      });
      qb.andWhere('TLA.addressLong LIKE :addressLong', {
        addressLong: `%${payload.addressLong}%`,
      });
    }

    const results = await qb.getRawMany<{ locationCode: string }>();
    return results.map((r) => r.locationCode);
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
      .addSelect('ts.serviceDescription', 'serviceNote')
      .where('tls.locationCode = :locationCode', { locationCode })
      .getRawMany<LocationServiceDto>();

    return result;
  }

  public async GetLocationMedia(
    locationCode: string,
  ): Promise<LocationMediaDto[]> {
    return this.locationMedia
      .createQueryBuilder('tlm')
      .select('tlm.mediaCode', 'mediaCode')
      .addSelect('tlm.mediaUrl', 'mediaUrl')
      .addSelect('tlm.mediaType', 'mediaType')
      .addSelect('tlm.displayOrder', 'displayOrder')
      .addSelect('tlm.isLogo', 'isLogo')
      .where('tlm.locationCode = :locationCode', { locationCode })
      .orderBy('tlm.displayOrder', 'ASC')
      .addOrderBy('tlm.id', 'ASC')
      .getRawMany<LocationMediaDto>();
  }

  public async GetLocationPriceRangeBounds(): Promise<RangeBounds> {
    const raw = await this.location
      .createQueryBuilder('TL')
      .select(
        `MIN(LEAST(COALESCE(TL.locationPriceStart, TL.locationPriceEnd), COALESCE(TL.locationPriceEnd, TL.locationPriceStart)))`,
        'minValue',
      )
      .addSelect(
        `MAX(GREATEST(COALESCE(TL.locationPriceStart, TL.locationPriceEnd), COALESCE(TL.locationPriceEnd, TL.locationPriceStart)))`,
        'maxValue',
      )
      .where(
        'TL.locationPriceStart IS NOT NULL OR TL.locationPriceEnd IS NOT NULL',
      )
      .getRawOne<{
        minValue: string | number | null;
        maxValue: string | number | null;
      }>();

    return {
      minValue:
        raw?.minValue === null || raw?.minValue === undefined
          ? null
          : Number(raw.minValue),
      maxValue:
        raw?.maxValue === null || raw?.maxValue === undefined
          ? null
          : Number(raw.maxValue),
    };
  }

  public async GetLocationAreaRangeBounds(): Promise<RangeBounds> {
    const raw = await this.location
      .createQueryBuilder('TL')
      .select('MIN(TL.locationArea)', 'minValue')
      .addSelect('MAX(TL.locationArea)', 'maxValue')
      .where('TL.locationArea IS NOT NULL')
      .getRawOne<{
        minValue: string | number | null;
        maxValue: string | number | null;
      }>();

    return {
      minValue:
        raw?.minValue === null || raw?.minValue === undefined
          ? null
          : Number(raw.minValue),
      maxValue:
        raw?.maxValue === null || raw?.maxValue === undefined
          ? null
          : Number(raw.maxValue),
    };
  }

  public async FindLocationMediaDtoByCode(
    mediaCode: string,
  ): Promise<LocationMediaDto | null> {
    const media = await this.locationMedia
      .createQueryBuilder('tlm')
      .select('tlm.mediaCode', 'mediaCode')
      .addSelect('tlm.mediaUrl', 'mediaUrl')
      .addSelect('tlm.mediaType', 'mediaType')
      .addSelect('tlm.displayOrder', 'displayOrder')
      .addSelect('tlm.isLogo', 'isLogo')
      .where('tlm.mediaCode = :mediaCode', { mediaCode })
      .getRawOne<LocationMediaDto>();

    return media ?? null;
  }

  public async FindLocationMediaByCode(
    mediaCode: string,
  ): Promise<TbLocationMedia | null> {
    return this.locationMedia.findOneBy({ mediaCode });
  }

  public async CreateLocationMedia(data: {
    locationCode: string;
    mediaUrl: string;
    mediaType: LocationMediaType;
    displayOrder?: number;
    isLogo?: boolean;
  }): Promise<TbLocationMedia> {
    const lastMedia = await this.locationMedia
      .createQueryBuilder('tlm')
      .select('MAX(tlm.displayOrder)', 'maxDisplayOrder')
      .where('tlm.locationCode = :locationCode', {
        locationCode: data.locationCode,
      })
      .getRawOne<{ maxDisplayOrder: string | null }>();

    const media = this.locationMedia.create({
      mediaCode: randomString(),
      locationCode: data.locationCode,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      displayOrder:
        data.displayOrder ??
        (lastMedia?.maxDisplayOrder
          ? Number(lastMedia.maxDisplayOrder) + 1
          : 1),
      isLogo: data.isLogo ? 1 : 0,
    });

    return this.locationMedia.save(media);
  }

  public async UpdateLocationMediaRecord(
    media: TbLocationMedia,
    data: {
      mediaUrl?: string;
      mediaType?: LocationMediaType;
      displayOrder?: number;
    },
  ): Promise<TbLocationMedia> {
    const updatedEntity = this.locationMedia.merge(media, {
      mediaUrl: data.mediaUrl ?? media.mediaUrl,
      mediaType: data.mediaType ?? media.mediaType,
      displayOrder: data.displayOrder ?? media.displayOrder,
    });

    return this.locationMedia.save(updatedEntity);
  }

  public async DeleteLocationMediaByCode(mediaCode: string): Promise<void> {
    await this.locationMedia.delete({ mediaCode });
  }

  public async ReorderLocationMedia(
    locationCode: string,
    items: Array<{ mediaCode: string; displayOrder: number }>,
  ): Promise<void> {
    for (const item of items) {
      await this.locationMedia.update(
        { locationCode, mediaCode: item.mediaCode },
        { displayOrder: item.displayOrder },
      );
    }
  }

  public async UpdateLocationLogo(
    location: TbLocation,
    selectedMedia: TbLocationMedia,
  ): Promise<{
    locationCode: string;
    mediaCode: string;
    locationLogo: string;
  }> {
    await this.locationMedia.update(
      { locationCode: location.locationCode },
      { isLogo: 0 },
    );

    await this.locationMedia.update(
      { mediaCode: selectedMedia.mediaCode },
      { isLogo: 1 },
    );

    await this.location.update(
      { locationCode: location.locationCode },
      { locationLogo: selectedMedia.mediaUrl },
    );

    return {
      locationCode: location.locationCode,
      mediaCode: selectedMedia.mediaCode,
      locationLogo: selectedMedia.mediaUrl,
    };
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
        'tla.addressPortal AS addressPortal',
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
