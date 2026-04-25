import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ADDRESS_STATUS,
  ADDRESS_TYPE,
  LOCATION_RENT_STATUS,
} from '../../assests/constants/constants';
import { randomString } from '../../common/helpers/common.helper';
import {
  CreateLocationRequestDto,
  LocationServiceSelectionDto,
  UpdateLocationRequestDto,
} from '../../dtos/location/location-v2.dto';
import { UserRole } from '../../dtos/user/user.dto';
import { TbLocation } from '../../entities/location/location.entity';
import { TbLocationAddress } from '../../entities/location/locationAddress.entity';
import { TbLocationMedia } from '../../entities/location/locationMedia.entity';
import { TbLocationService } from '../../entities/location/locationService.entity';
import { TbLocationType } from '../../entities/location/locationType.entity';
import { ServicePricingType, TbService } from '../../entities/service/service.entity';
import { TbUserDefault } from '../../entities/user/user_default.entity';

@Injectable()
export class LocationWriteRepository {
  constructor(
    @InjectRepository(TbLocation)
    private readonly locationRepo: Repository<TbLocation>,
    @InjectRepository(TbLocationAddress)
    private readonly addressRepo: Repository<TbLocationAddress>,
    @InjectRepository(TbLocationService)
    private readonly locationServiceRepo: Repository<TbLocationService>,
    @InjectRepository(TbLocationMedia)
    private readonly locationMediaRepo: Repository<TbLocationMedia>,
    @InjectRepository(TbLocationType)
    private readonly locationTypeRepo: Repository<TbLocationType>,
    @InjectRepository(TbService)
    private readonly serviceRepo: Repository<TbService>,
    @InjectRepository(TbUserDefault)
    private readonly userRepo: Repository<TbUserDefault>,
  ) {}

  public async findLocationByCode(locationCode: string): Promise<TbLocation | null> {
    return this.locationRepo.findOneBy({ locationCode });
  }

  public async findLocationTypeByCode(typeCode: string): Promise<TbLocationType | null> {
    return this.locationTypeRepo.findOneBy({ typeCode });
  }

  public async findServicesByCodes(serviceCodes: string[]): Promise<TbService[]> {
    if (serviceCodes.length === 0) {
      return [];
    }

    return this.serviceRepo
      .createQueryBuilder('service')
      .where('service.serviceCode IN (:...serviceCodes)', { serviceCodes })
      .getMany();
  }

  private async resolveServiceCode(
    service: LocationServiceSelectionDto,
    ownerCode: string,
    queryRunner: any,
  ): Promise<string> {
    if (service.serviceCode) {
      return service.serviceCode;
    }

    const created = queryRunner.manager.create(TbService, {
      serviceCode: randomString(),
      serviceName: service.name,
      serviceDescription: service.description ?? '',
      serviceLogo: null,
      serviceBackGround: null,
      servicePrice: service.customPrice ?? 0,
      serviceDiscount: 0,
      pricingType: service.pricingType ?? ServicePricingType.FULL,
      isCustom: 1,
      createdByUserCode: ownerCode,
    });

    const saved = await queryRunner.manager.save(created);
    return saved.serviceCode;
  }

  public async createLocation(
    ownerCode: string,
    payload: CreateLocationRequestDto,
  ): Promise<string> {
    const queryRunner = this.locationRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const mediaInputs = payload.media ?? [];
      const logoMedia = mediaInputs.find((item) => item.isLogo) ?? mediaInputs[0];
      const locationCode = randomString();
      const locationPayload: Partial<TbLocation> = {
        locationCode,
        ownerCode,
        typeCode: payload.typeCode,
        locationName: payload.name,
        locationLogo: logoMedia?.url ?? '',
        locationPriceStart: payload.pricing.priceStart,
        locationPriceEnd: payload.pricing.priceEnd ?? payload.pricing.priceStart,
        locationPriceAfterDeal: payload.pricing.priceAfterDeal,
        locationArea: payload.area,
        minTimeLimit:
          payload.availability?.hasTimeLimit === true
            ? payload.availability.availableFrom
            : undefined,
        maxTimeLimit:
          payload.availability?.hasTimeLimit === true
            ? payload.availability.availableTo
            : undefined,
        hasRent: payload.availability?.isRented
          ? LOCATION_RENT_STATUS.HAS_RENT
          : LOCATION_RENT_STATUS.READY,
        userRentCd: undefined,
        locationDescription: payload.description,
        locationNote: payload.note,
        locationStatus: 1,
        locationRate: 0,
      };

      const location = queryRunner.manager.create(TbLocation, locationPayload);

      await queryRunner.manager.save(location);

      const owner = await queryRunner.manager.findOneBy(TbUserDefault, { userCode: ownerCode });
      if (owner && owner.role !== UserRole.OWNER) {
        owner.role = UserRole.OWNER;
        await queryRunner.manager.save(owner);
      }

      await queryRunner.manager.save(
        queryRunner.manager.create(TbLocationAddress, {
          locationCode,
          addressCode: randomString(),
          addressName: payload.primaryAddress.addressDetail,
          fullAddress: payload.primaryAddress.fullAddress,
          addressWard: payload.primaryAddress.ward,
          addressDistrict: payload.primaryAddress.ward,
          addressCity: payload.primaryAddress.city,
          addressProvince: payload.primaryAddress.city,
          addressCountry: payload.primaryAddress.country,
          addressPortal: '',
          addressLat: String(payload.primaryAddress.latitude),
          addressLong: String(payload.primaryAddress.longitude),
          addressRegion: payload.primaryAddress.region,
          addressStatus: String(ADDRESS_STATUS.ACTIVE),
          addressDescription: payload.primaryAddress.description ?? '',
          addressNote: payload.primaryAddress.note ?? '',
          addressType: String(ADDRESS_TYPE.MAIN_ADDRESS),
        }),
      );

      if ((payload.services ?? []).length > 0) {
        const locationServices: TbLocationService[] = [];
        for (const service of payload.services ?? []) {
          const serviceCode = await this.resolveServiceCode(
            service,
            ownerCode,
            queryRunner,
          );
          locationServices.push(
            queryRunner.manager.create(TbLocationService, {
              locationCode,
              serviceCode,
              customPrice: service.customPrice ?? null,
              pricingType: service.pricingType ?? ServicePricingType.FULL,
            }),
          );
        }
        await queryRunner.manager.save(
          TbLocationService,
          locationServices,
        );
      }

      if (mediaInputs.length > 0) {
        await queryRunner.manager.save(
          TbLocationMedia,
          mediaInputs.map((item, index) =>
            queryRunner.manager.create(TbLocationMedia, {
              mediaCode: randomString(),
              locationCode,
              mediaUrl: item.url,
              mediaType: item.type,
              displayOrder: item.displayOrder ?? index + 1,
              isLogo: item.isLogo || (!item.isLogo && index === 0) ? 1 : 0,
            }),
          ),
        );
      }

      await queryRunner.commitTransaction();
      return locationCode;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async updateLocation(
    location: TbLocation,
    payload: UpdateLocationRequestDto,
  ): Promise<void> {
    const queryRunner = this.locationRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const nextTypeCode = payload.typeCode ?? location.typeCode;
      const mediaInputs = payload.media;
      const logoMedia =
        mediaInputs?.find((item) => item.isLogo) ??
        mediaInputs?.[0] ??
        (location.locationLogo ? { url: location.locationLogo } : undefined);

      await queryRunner.manager.update(
        TbLocation,
        { locationCode: location.locationCode },
        {
          typeCode: nextTypeCode,
          locationName: payload.name ?? location.locationName,
          locationLogo: logoMedia?.url ?? location.locationLogo,
          locationPriceStart: payload.pricing?.priceStart ?? location.locationPriceStart,
          locationPriceEnd:
            payload.pricing?.priceEnd ??
            payload.pricing?.priceStart ??
            location.locationPriceEnd,
          locationPriceAfterDeal:
            payload.pricing?.priceAfterDeal ?? location.locationPriceAfterDeal,
          locationArea: payload.area ?? location.locationArea,
          minTimeLimit:
            payload.availability?.hasTimeLimit === true
              ? payload.availability.availableFrom ?? location.minTimeLimit
              : payload.availability?.hasTimeLimit === false
                ? undefined
                : location.minTimeLimit,
          maxTimeLimit:
            payload.availability?.hasTimeLimit === true
              ? payload.availability.availableTo ?? location.maxTimeLimit
              : payload.availability?.hasTimeLimit === false
                ? undefined
                : location.maxTimeLimit,
          hasRent:
            payload.availability?.isRented === undefined
              ? location.hasRent
              : payload.availability.isRented
                ? LOCATION_RENT_STATUS.HAS_RENT
                : LOCATION_RENT_STATUS.READY,
          locationDescription: payload.description ?? location.locationDescription,
          locationNote: payload.note ?? location.locationNote,
        },
      );

      if (payload.primaryAddress) {
        await queryRunner.manager.delete(TbLocationAddress, {
          locationCode: location.locationCode,
        });

        await queryRunner.manager.save(
          queryRunner.manager.create(TbLocationAddress, {
            locationCode: location.locationCode,
            addressCode: randomString(),
            addressName: payload.primaryAddress.addressDetail,
            fullAddress: payload.primaryAddress.fullAddress,
            addressWard: payload.primaryAddress.ward,
            addressDistrict: payload.primaryAddress.ward,
            addressCity: payload.primaryAddress.city,
            addressProvince: payload.primaryAddress.city,
            addressCountry: payload.primaryAddress.country,
            addressPortal: '',
            addressLat: String(payload.primaryAddress.latitude),
            addressLong: String(payload.primaryAddress.longitude),
            addressRegion: payload.primaryAddress.region,
            addressStatus: String(ADDRESS_STATUS.ACTIVE),
            addressDescription: payload.primaryAddress.description ?? '',
            addressNote: payload.primaryAddress.note ?? '',
            addressType: String(ADDRESS_TYPE.MAIN_ADDRESS),
          }),
        );
      }

      if (payload.services) {
        await queryRunner.manager.delete(TbLocationService, {
          locationCode: location.locationCode,
        });

        if (payload.services.length > 0) {
          const locationServices: TbLocationService[] = [];
          for (const service of payload.services) {
            const serviceCode = await this.resolveServiceCode(
              service,
              location.ownerCode,
              queryRunner,
            );
            locationServices.push(
              queryRunner.manager.create(TbLocationService, {
                locationCode: location.locationCode,
                serviceCode,
                customPrice: service.customPrice ?? null,
                pricingType: service.pricingType ?? ServicePricingType.FULL,
              }),
            );
          }
          await queryRunner.manager.save(
            TbLocationService,
            locationServices,
          );
        }
      }

      if (payload.media) {
        await queryRunner.manager.delete(TbLocationMedia, {
          locationCode: location.locationCode,
        });

        if (payload.media.length > 0) {
          await queryRunner.manager.save(
            TbLocationMedia,
            payload.media.map((item, index) =>
              queryRunner.manager.create(TbLocationMedia, {
                mediaCode: randomString(),
                locationCode: location.locationCode,
                mediaUrl: item.url,
                mediaType: item.type,
                displayOrder: item.displayOrder ?? index + 1,
                isLogo: item.isLogo || (!item.isLogo && index === 0) ? 1 : 0,
              }),
            ),
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
