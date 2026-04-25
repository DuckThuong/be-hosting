import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ADDRESS_TYPE, LOCATION_RENT_STATUS } from '../../assests/constants/constants';
import {
  LocationAddressResponseDto,
  LocationAvailabilityDto,
  LocationDetailResponseDto,
  LocationListQueryDto,
  LocationMediaResponseItemDto,
  LocationPricingDto,
  LocationSummaryResponseDto,
  PaginatedLocationResponseDto,
  ServiceCatalogItemDto,
} from '../../dtos/location/location-v2.dto';
import { TbLocation } from '../../entities/location/location.entity';
import { TbLocationAddress } from '../../entities/location/locationAddress.entity';
import { TbLocationMedia } from '../../entities/location/locationMedia.entity';
import { TbLocationService } from '../../entities/location/locationService.entity';
import { TbLocationType } from '../../entities/location/locationType.entity';
import { ServicePricingType, TbService } from '../../entities/service/service.entity';

type BaseLocationRow = {
  locationCode: string;
  name: string;
  description?: string | null;
  note?: string | null;
  logo?: string | null;
  area?: string | number | null;
  rating?: string | number | null;
  priceStart?: string | number | null;
  priceEnd?: string | number | null;
  priceAfterDeal?: string | number | null;
  minTimeLimit?: string | null;
  maxTimeLimit?: string | null;
  hasRent?: number | string | null;
  typeCode: string;
  typeName?: string | null;
  typeDescription?: string | null;
  typeLogo?: string | null;
  typeBackGround?: string | null;
  ownerCode: string;
  ownerUsername: string;
  ownerEmail: string;
  ownerAvatar?: string | null;
  ownerPhone?: string | null;
  ownerFullAddress?: string | null;
  ownerCity?: string | null;
  primaryAddressCode?: string | null;
  primaryAddressName?: string | null;
  primaryFullAddress?: string | null;
  primaryWard?: string | null;
  primaryDistrict?: string | null;
  primaryCity?: string | null;
  primaryProvince?: string | null;
  primaryCountry?: string | null;
  primaryPostalCode?: string | null;
  primaryRegion?: string | null;
  primaryLatitude?: string | number | null;
  primaryLongitude?: string | number | null;
  primaryDescription?: string | null;
  primaryNote?: string | null;
};

@Injectable()
export class LocationReadRepository {
  constructor(
    @InjectRepository(TbLocation)
    private readonly locationRepo: Repository<TbLocation>,
    @InjectRepository(TbLocationAddress)
    private readonly addressRepo: Repository<TbLocationAddress>,
    @InjectRepository(TbLocationService)
    private readonly locationServiceRepo: Repository<TbLocationService>,
    @InjectRepository(TbLocationMedia)
    private readonly mediaRepo: Repository<TbLocationMedia>,
    @InjectRepository(TbLocationType)
    private readonly typeRepo: Repository<TbLocationType>,
    @InjectRepository(TbService)
    private readonly serviceRepo: Repository<TbService>,
  ) {}

  public async getLocationTypes() {
    return this.typeRepo.find({ order: { typeName: 'ASC' } });
  }

  public async getServices() {
    return this.serviceRepo.find({
      where: {
        isCustom: 0,
        servicePrice: 0 as any,
      },
      order: { serviceName: 'ASC' },
    });
  }

  public async getLocationByCode(locationCode: string): Promise<LocationDetailResponseDto | null> {
    const row = await this.createBaseQuery()
      .where('location.locationCode = :locationCode', { locationCode })
      .getRawOne<BaseLocationRow>();

    if (!row) {
      return null;
    }

    return this.toLocationDetail(row);
  }

  public async searchLocations(payload: LocationListQueryDto): Promise<PaginatedLocationResponseDto> {
    const page = payload.page ?? 1;
    const limit = payload.limit ?? 20;
    const offset = (page - 1) * limit;

    const qb = this.createBaseQuery();

    if (payload.keyword) {
      const keyword = `%${payload.keyword}%`;
      qb.andWhere(
        new Brackets((inner) => {
          inner
            .where('location.locationName LIKE :keyword', { keyword })
            .orWhere('location.locationDescription LIKE :keyword', { keyword })
            .orWhere('locationType.typeName LIKE :keyword', { keyword })
            .orWhere('primaryAddress.fullAddress LIKE :keyword', { keyword });
        }),
      );
    }

    if (payload.typeCode) {
      qb.andWhere('location.typeCode = :typeCode', { typeCode: payload.typeCode });
    }

    if (payload.typeName) {
      qb.andWhere('locationType.typeName LIKE :typeName', {
        typeName: `%${payload.typeName}%`,
      });
    }

    if (payload.addressCity) {
      qb.andWhere('primaryAddress.addressCity LIKE :addressCity', {
        addressCity: `%${payload.addressCity}%`,
      });
    }

    if (payload.addressRegion) {
      qb.andWhere('primaryAddress.addressRegion LIKE :addressRegion', {
        addressRegion: `%${payload.addressRegion}%`,
      });
    }

    if (payload.minPrice !== undefined) {
      qb.andWhere('location.locationPriceAfterDeal >= :minPrice', {
        minPrice: payload.minPrice,
      });
    }

    if (payload.maxPrice !== undefined) {
      qb.andWhere('location.locationPriceAfterDeal <= :maxPrice', {
        maxPrice: payload.maxPrice,
      });
    }

    if (payload.minArea !== undefined) {
      qb.andWhere('location.locationArea >= :minArea', { minArea: payload.minArea });
    }

    if (payload.maxArea !== undefined) {
      qb.andWhere('location.locationArea <= :maxArea', { maxArea: payload.maxArea });
    }

    if (payload.isRented !== undefined) {
      qb.andWhere('location.hasRent = :hasRent', {
        hasRent: payload.isRented
          ? LOCATION_RENT_STATUS.HAS_RENT
          : LOCATION_RENT_STATUS.READY,
      });
    }

    const total = await qb.getCount();
    const rows = await qb
      .orderBy('location.locationCode', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany<BaseLocationRow>();

    const data = rows.map((row) => this.toLocationSummary(row));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getRelatedLocations(
    locationCode: string,
    page = 1,
    limit = 8,
  ): Promise<PaginatedLocationResponseDto> {
    const current = await this.getLocationByCode(locationCode);
    if (!current) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    const currentRegion = current.primaryAddress?.region?.trim();
    const currentCity = current.primaryAddress?.city?.trim();

    const qb = this.createBaseQuery()
      .where('location.locationCode <> :locationCode', { locationCode })
      .andWhere(new Brackets((inner) => {
        inner.where('location.typeCode = :typeCode', {
          typeCode: current.type.code,
        });

        if (currentRegion) {
          inner.orWhere(
            'LOWER(TRIM(primaryAddress.addressRegion)) LIKE LOWER(:region)',
            {
              region: `%${currentRegion}%`,
            },
          );
          return;
        }

        if (currentCity) {
          inner.orWhere(
            'LOWER(TRIM(primaryAddress.addressCity)) LIKE LOWER(:city)',
            {
              city: `%${currentCity}%`,
            },
          );
        }
      }));

    const total = await qb.getCount();
    const rows = await qb
      .orderBy('location.locationRate', 'DESC')
      .addOrderBy('location.locationCode', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<BaseLocationRow>();

    return {
      data: rows.map((row) => this.toLocationSummary(row)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getLocationsByOwner(ownerCode: string): Promise<LocationSummaryResponseDto[]> {
    const rows = await this.createBaseQuery()
      .where('location.ownerCode = :ownerCode', { ownerCode })
      .orderBy('location.locationCode', 'DESC')
      .getRawMany<BaseLocationRow>();

    return   rows.map((row) => this.toLocationSummary(row));
  }

  private createBaseQuery() {
    return this.locationRepo
      .createQueryBuilder('location')
      .leftJoin(TbLocationType, 'locationType', 'locationType.typeCode = location.typeCode')
      .leftJoin('tb_user_default', 'ownerUser', 'ownerUser.userCode = location.ownerCode')
      .leftJoin('tb_user_profile', 'ownerProfile', 'ownerProfile.user_id = ownerUser.id')
      .leftJoin(
        TbLocationAddress,
        'primaryAddress',
        'primaryAddress.locationCode = location.locationCode AND primaryAddress.addressType = :mainAddressType',
        { mainAddressType: String(ADDRESS_TYPE.MAIN_ADDRESS) },
      )
      .select([
        'location.locationCode AS locationCode',
        'location.locationName AS name',
        'location.locationDescription AS description',
        'location.locationNote AS note',
        'location.locationLogo AS logo',
        'location.locationArea AS area',
        'location.locationRate AS rating',
        'location.locationPriceStart AS priceStart',
        'location.locationPriceEnd AS priceEnd',
        'location.locationPriceAfterDeal AS priceAfterDeal',
        'location.minTimeLimit AS minTimeLimit',
        'location.maxTimeLimit AS maxTimeLimit',
        'location.hasRent AS hasRent',
        'location.typeCode AS typeCode',
        'locationType.typeName AS typeName',
        'locationType.typeDescription AS typeDescription',
        'locationType.typeLogo AS typeLogo',
        'locationType.typeBackGround AS typeBackGround',
        'ownerUser.userCode AS ownerCode',
        'ownerUser.username AS ownerUsername',
        'ownerUser.email AS ownerEmail',
        'ownerProfile.avatarUrl AS ownerAvatar',
        'ownerProfile.phone AS ownerPhone',
        'ownerProfile.fullAddress AS ownerFullAddress',
        'ownerProfile.userCity AS ownerCity',
        'primaryAddress.addressCode AS primaryAddressCode',
        'primaryAddress.addressName AS primaryAddressName',
        'primaryAddress.fullAddress AS primaryFullAddress',
        'primaryAddress.addressWard AS primaryWard',
        'primaryAddress.addressDistrict AS primaryDistrict',
        'primaryAddress.addressCity AS primaryCity',
        'primaryAddress.addressProvince AS primaryProvince',
        'primaryAddress.addressCountry AS primaryCountry',
        'primaryAddress.addressPortal AS primaryPostalCode',
        'primaryAddress.addressRegion AS primaryRegion',
        'primaryAddress.addressLat AS primaryLatitude',
        'primaryAddress.addressLong AS primaryLongitude',
        'primaryAddress.addressDescription AS primaryDescription',
        'primaryAddress.addressNote AS primaryNote',
      ]);
  }

  private async toLocationDetail(row: BaseLocationRow): Promise<LocationDetailResponseDto> {
    const [addresses, services, media] = await Promise.all([
      this.getAddresses(row.locationCode),
      this.getServicesForLocation(row.locationCode),
      this.getMediaForLocation(row.locationCode),
    ]);

    return {
      ...this.toLocationSummary(row),
      addresses,
      services,
      media,
    };
  }

  private toLocationSummary(row: BaseLocationRow): LocationSummaryResponseDto {
    const primaryAddress = this.toPrimaryAddress(row);
    return {
      locationCode: row.locationCode,
      name: row.name,
      description: row.description ?? undefined,
      note: row.note ?? undefined,
      logo: row.logo ?? undefined,
      area: row.area === null || row.area === undefined ? null : Number(row.area),
      rating: Number(row.rating ?? 0),
      pricing: this.toPricing(row),
      availability: this.toAvailability(row),
      type: {
        code: row.typeCode,
        name: row.typeName ?? '',
        description: row.typeDescription ?? undefined,
        logo: row.typeLogo ?? undefined,
        background: row.typeBackGround ?? undefined,
      },
      primaryAddress,
      owner: {
        userCode: row.ownerCode,
        username: row.ownerUsername,
        email: row.ownerEmail,
        avatarUrl: row.ownerAvatar ?? null,
        phone: row.ownerPhone ?? null,
        fullAddress: row.ownerFullAddress ?? null,
        city: row.ownerCity ?? null,
      },
    };
  }

  private toPricing(row: BaseLocationRow): LocationPricingDto {
    return {
      priceStart: Number(row.priceStart ?? 0),
      priceEnd: Number(row.priceEnd ?? row.priceStart ?? 0),
      priceAfterDeal: Number(row.priceAfterDeal ?? 0),
    };
  }

  private toAvailability(row: BaseLocationRow): LocationAvailabilityDto {
    return {
      hasTimeLimit: Boolean(row.minTimeLimit && row.maxTimeLimit),
      availableFrom: row.minTimeLimit ?? undefined,
      availableTo: row.maxTimeLimit ?? undefined,
      isRented: Number(row.hasRent ?? 0) === LOCATION_RENT_STATUS.HAS_RENT,
    };
  }

  private toPrimaryAddress(row: BaseLocationRow): LocationAddressResponseDto | null {
    if (!row.primaryAddressCode) {
      return null;
    }

    return {
      addressCode: row.primaryAddressCode,
      addressDetail: row.primaryAddressName ?? '',
      fullAddress: row.primaryFullAddress ?? '',
      ward: row.primaryWard ?? row.primaryDistrict ?? '',
      city: row.primaryCity ?? row.primaryProvince ?? '',
      country: row.primaryCountry ?? '',
      region: row.primaryRegion ?? row.primaryCity ?? row.primaryProvince ?? '',
      latitude: Number(row.primaryLatitude ?? 0),
      longitude: Number(row.primaryLongitude ?? 0),
      description: row.primaryDescription ?? undefined,
      note: row.primaryNote ?? undefined,
    };
  }

  private async getAddresses(locationCode: string): Promise<LocationAddressResponseDto[]> {
    const rows = await this.addressRepo.find({
      where: { locationCode },
      order: { id: 'ASC' },
    });

    return rows.map((row) => ({
      addressCode: row.addressCode,
      addressDetail: row.addressName,
      fullAddress: row.fullAddress,
      ward: row.addressWard || row.addressDistrict,
      city: row.addressCity || row.addressProvince,
      country: row.addressCountry,
      region: row.addressRegion || row.addressCity || row.addressProvince,
      latitude: Number(row.addressLat),
      longitude: Number(row.addressLong),
      description: row.addressDescription || undefined,
      note: row.addressNote || undefined,
    }));
  }

  private async getServicesForLocation(locationCode: string): Promise<ServiceCatalogItemDto[]> {
    const rows = await this.locationServiceRepo
      .createQueryBuilder('locationService')
      .innerJoin(TbService, 'service', 'service.serviceCode = locationService.serviceCode')
      .select([
        'service.serviceCode AS serviceCode',
        'service.serviceName AS serviceName',
        'service.serviceDescription AS serviceDescription',
        'service.serviceLogo AS serviceLogo',
        'service.serviceBackGround AS serviceBackGround',
        'service.servicePrice AS servicePrice',
        'service.serviceDiscount AS serviceDiscount',
        'locationService.customPrice AS customPrice',
        'locationService.pricingType AS pricingType',
        'service.isCustom AS isCustom',
      ])
      .where('locationService.locationCode = :locationCode', { locationCode })
      .getRawMany<ServiceCatalogItemDto>();

    return rows.map((row) => ({
      ...row,
      servicePrice: Number((row as any).customPrice ?? (row as any).servicePrice ?? 0),
      serviceDiscount: Number((row as any).serviceDiscount ?? 0),
      customPrice:
        (row as any).customPrice === null || (row as any).customPrice === undefined
          ? undefined
          : Number((row as any).customPrice),
      pricingType:
        ((row as any).pricingType as ServicePricingType | undefined) ??
        ServicePricingType.FULL,
      isCustom: Boolean(Number((row as any).isCustom ?? 0)),
    }));
  }

  private async getMediaForLocation(locationCode: string): Promise<LocationMediaResponseItemDto[]> {
    const rows = await this.mediaRepo.find({
      where: { locationCode },
      order: { displayOrder: 'ASC', id: 'ASC' },
    });

    return rows.map((row) => ({
      mediaCode: row.mediaCode,
      url: row.mediaUrl,
      type: row.mediaType,
      displayOrder: row.displayOrder,
      isLogo: Boolean(row.isLogo),
    }));
  }
}
