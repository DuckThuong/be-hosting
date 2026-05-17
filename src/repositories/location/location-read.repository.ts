import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {
  ADDRESS_TYPE,
  LOCATION_RENT_STATUS,
} from '../../assets/constants/constants';
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
import { TbService } from '../../entities/service/service.entity';
import { LocationStatus } from '../../assets/enums/location.enum';
import { OwnerPackageSubscriptionStatus } from '../../entities/payment/owner-package-subscription.entity';
import { RentalClass } from '../../common/rental-classification';

type BaseLocationRow = {
  locationCode: string;
  name: string;
  description?: string | null;
  note?: string | null;
  logo?: string | null;
  area?: string | number | null;
  rating?: string | number | null;
  price?: string | number | null;
  priceUnit?: string | null;
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
  distanceKm?: string | number | null;
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
      order: { name: 'ASC' },
    });
  }

  /**
   * Returns the raw TbLocation entity for booking/payment validation.
   */
  public async getLocationRaw(
    locationCode: string,
  ): Promise<TbLocation | null> {
    return this.locationRepo.findOne({
      where: { locationCode },
      relations: ['type', 'owner', 'owner.profile'],
    });
  }

  public async getLocationByCode(
    locationCode: string,
  ): Promise<LocationDetailResponseDto | null> {
    const qb = this.createBaseQuery().where(
      'location.locationCode = :locationCode',
      { locationCode },
    );
    this.applyPublicVisibilityFilter(qb);
    const row = await qb.getRawOne<BaseLocationRow>();

    if (!row) {
      return null;
    }

    return this.toLocationDetail(row);
  }

  public async searchLocations(
    payload: LocationListQueryDto,
  ): Promise<PaginatedLocationResponseDto> {
    const normalizedPayload = this.normalizeListQuery(payload);
    const page = normalizedPayload.page ?? 1;
    const limit = normalizedPayload.limit ?? 20;
    const offset = (page - 1) * limit;

    const qb = this.createBaseQuery();
    this.applyPublicVisibilityFilter(qb);

    this.applyLocationSearchFilters(qb, normalizedPayload);
    const hasRadiusSearch = this.applyRadiusSearch(qb, normalizedPayload);
    const distanceSelect = this.getDistanceSelectExpression();

    const total = await qb
      .clone()
      .select('COUNT(DISTINCT location.locationCode)', 'count')
      .getRawOne()
      .then((row) => Number(row?.count ?? 0));
    const rows = await qb
      .orderBy(
        hasRadiusSearch ? distanceSelect : 'location.locationCode',
        hasRadiusSearch ? 'ASC' : 'DESC',
      )
      .addOrderBy('location.locationCode', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany<BaseLocationRow>();

    // Deduplicate rows — LEFT JOIN on primaryAddress can produce
    // multiple rows per location when duplicate addresses exist.
    const uniqueMap = new Map<string, BaseLocationRow>();
    for (const row of rows) {
      if (!uniqueMap.has(row.locationCode)) {
        uniqueMap.set(row.locationCode, row);
      }
    }
    const data = Array.from(uniqueMap.values()).map((row) =>
      this.toLocationSummary(row),
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private applyLocationSearchFilters(
    qb: SelectQueryBuilder<TbLocation>,
    payload: LocationListQueryDto,
  ) {
    this.applyGeographicKeywordFilter(qb, payload.keyword);
    this.applyTypeCodeFilter(qb, payload.typeCode);
    this.applyTypeNameFilter(qb, payload.typeName);
    this.applyAddressCityFilter(qb, payload.addressCity);
    this.applyAddressRegionFilter(qb, payload.addressRegion);
    this.applyMinPriceFilter(qb, payload.minPrice);
    this.applyMaxPriceFilter(qb, payload.maxPrice);
    this.applyMinAreaFilter(qb, payload.minArea);
    this.applyMaxAreaFilter(qb, payload.maxArea);
    this.applyRentFilter(qb, payload.isRented);
  }

  private normalizeListQuery(
    payload: LocationListQueryDto,
  ): LocationListQueryDto {
    return {
      ...payload,
      minPrice: this.toOptionalNumber(payload.minPrice),
      maxPrice: this.toOptionalNumber(payload.maxPrice),
      minArea: this.toOptionalNumber(payload.minArea),
      maxArea: this.toOptionalNumber(payload.maxArea),
      isRented: this.toOptionalBoolean(payload.isRented),
      page: this.toOptionalInteger(payload.page, 1, Number.MAX_SAFE_INTEGER),
      limit: this.toOptionalInteger(payload.limit, 1, 100),
      lat: this.toOptionalNumber(payload.lat, -90, 90),
      lng: this.toOptionalNumber(payload.lng, -180, 180),
      radiusKm: this.toOptionalNumber(payload.radiusKm, 0.1, 100),
    };
  }

  private toOptionalNumber(
    value: unknown,
    min?: number,
    max?: number,
  ): number | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const numberValue =
      typeof value === 'number' ? value : Number(String(value).trim());

    if (!Number.isFinite(numberValue)) {
      return undefined;
    }

    if (min !== undefined && numberValue < min) {
      return undefined;
    }

    if (max !== undefined && numberValue > max) {
      return undefined;
    }

    return numberValue;
  }

  private toOptionalInteger(
    value: unknown,
    min: number,
    max: number,
  ): number | undefined {
    const numberValue = this.toOptionalNumber(value, min, max);
    return numberValue === undefined ? undefined : Math.trunc(numberValue);
  }

  private toOptionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    const normalizedValue = String(value).trim().toLowerCase();

    if (['true', '1'].includes(normalizedValue)) {
      return true;
    }

    if (['false', '0'].includes(normalizedValue)) {
      return false;
    }

    return undefined;
  }

  private hasRadiusSearch(
    payload: LocationListQueryDto,
  ): payload is LocationListQueryDto & {
    lat: number;
    lng: number;
    radiusKm: number;
  } {
    return (
      typeof payload.lat === 'number' &&
      typeof payload.lng === 'number' &&
      typeof payload.radiusKm === 'number'
    );
  }

  private getDistanceSelectExpression(): string {
    return `(
      6371 * ACOS(
        LEAST(
          1,
          GREATEST(
            -1,
            COS(RADIANS(:searchLat)) * COS(RADIANS(CAST(primaryAddress.addressLat AS DECIMAL(10, 7)))) *
            COS(RADIANS(CAST(primaryAddress.addressLong AS DECIMAL(10, 7))) - RADIANS(:searchLng)) +
            SIN(RADIANS(:searchLat)) * SIN(RADIANS(CAST(primaryAddress.addressLat AS DECIMAL(10, 7))))
          )
        )
      )
    )`;
  }

  private applyRadiusSearch(
    qb: SelectQueryBuilder<TbLocation>,
    payload: LocationListQueryDto,
  ): boolean {
    if (!this.hasRadiusSearch(payload)) {
      return false;
    }

    const distanceSelect = this.getDistanceSelectExpression();
    qb.addSelect(distanceSelect, 'distanceKm')
      .andWhere('primaryAddress.addressLat IS NOT NULL')
      .andWhere('primaryAddress.addressLong IS NOT NULL')
      .andWhere(`${distanceSelect} <= :radiusKm`)
      .setParameters({
        searchLat: payload.lat,
        searchLng: payload.lng,
        radiusKm: payload.radiusKm,
      });

    return true;
  }

  private applyGeographicKeywordFilter(
    qb: SelectQueryBuilder<TbLocation>,
    keywordInput?: string,
  ) {
    if (!keywordInput) {
      return;
    }

    const normalizedKeyword = this.normalizeGeographicInput(keywordInput);

    if (!normalizedKeyword) {
      return;
    }

    const regionFilterValues =
      this.resolveRegionFilterValues(normalizedKeyword);

    if (regionFilterValues) {
      qb.andWhere(
        new Brackets((inner) => {
          inner.where(
            'LOWER(TRIM(primaryAddress.addressRegion)) IN (:...regionFilterValues)',
            {
              regionFilterValues,
            },
          );
        }),
      );
      return;
    }

    if (this.isForbiddenLegacyRegionTerm(normalizedKeyword)) {
      qb.andWhere('1 = 0');
      return;
    }

    const keyword = `%${normalizedKeyword}%`;

    qb.andWhere(
      new Brackets((inner) => {
        inner
          .where('LOWER(TRIM(primaryAddress.addressCity)) LIKE :keyword', {
            keyword,
          })
          .orWhere(
            'LOWER(TRIM(primaryAddress.addressProvince)) LIKE :keyword',
            {
              keyword,
            },
          )
          .orWhere(
            'LOWER(TRIM(primaryAddress.addressDistrict)) LIKE :keyword',
            {
              keyword,
            },
          )
          .orWhere('LOWER(TRIM(primaryAddress.addressWard)) LIKE :keyword', {
            keyword,
          })
          .orWhere('LOWER(TRIM(primaryAddress.fullAddress)) LIKE :keyword', {
            keyword,
          })
          .orWhere('LOWER(TRIM(primaryAddress.addressName)) LIKE :keyword', {
            keyword,
          });
      }),
    );
  }

  private applyTypeCodeFilter(
    qb: SelectQueryBuilder<TbLocation>,
    typeCode?: string,
  ) {
    if (!typeCode) {
      return;
    }

    const typeCodes = typeCode
      .split(',')
      .map((code) => code.trim())
      .filter(Boolean);

    if (typeCodes.length > 0) {
      qb.andWhere('location.typeCode IN (:...typeCodes)', {
        typeCodes,
      });
    }
  }

  private applyTypeNameFilter(
    qb: SelectQueryBuilder<TbLocation>,
    typeName?: string,
  ) {
    if (!typeName) {
      return;
    }

    qb.andWhere('LOWER(TRIM(locationType.typeName)) LIKE :typeName', {
      typeName: `%${typeName.trim().toLowerCase()}%`,
    });
  }

  private applyAddressCityFilter(
    qb: SelectQueryBuilder<TbLocation>,
    addressCity?: string,
  ) {
    if (!addressCity) {
      return;
    }

    qb.andWhere('LOWER(TRIM(primaryAddress.addressCity)) LIKE :addressCity', {
      addressCity: `%${addressCity.trim().toLowerCase()}%`,
    });
  }

  private applyAddressRegionFilter(
    qb: SelectQueryBuilder<TbLocation>,
    addressRegion?: string,
  ) {
    if (!addressRegion) {
      return;
    }

    const normalizedRegion = this.normalizeGeographicInput(addressRegion);
    if (!normalizedRegion) {
      return;
    }

    const regionFilterValues = this.resolveRegionFilterValues(normalizedRegion);
    if (!regionFilterValues) {
      qb.andWhere('1 = 0');
      return;
    }

    qb.andWhere(
      'LOWER(TRIM(primaryAddress.addressRegion)) IN (:...regionFilterValues)',
      {
        regionFilterValues,
      },
    );
  }

  private normalizeGeographicInput(value: string): string {
    return value.trim().toLowerCase();
  }

  private resolveRegionFilterValues(normalizedInput: string): string[] | null {
    switch (normalizedInput) {
      case 'north':
      case 'miền bắc':
        return ['north', 'miền bắc'];
      case 'central':
      case 'miền trung':
        return ['central', 'miền trung'];
      case 'south':
      case 'miền nam':
        return ['south', 'miền nam'];
      default:
        return null;
    }
  }

  private isForbiddenLegacyRegionTerm(normalizedInput: string): boolean {
    return normalizedInput === 'nội thành';
  }

  private applyMinPriceFilter(
    qb: SelectQueryBuilder<TbLocation>,
    minPrice?: number,
  ) {
    if (minPrice === undefined) {
      return;
    }

    qb.andWhere('location.locationPriceAfterDeal >= :minPrice', {
      minPrice,
    });
  }

  private applyMaxPriceFilter(
    qb: SelectQueryBuilder<TbLocation>,
    maxPrice?: number,
  ) {
    if (maxPrice === undefined) {
      return;
    }

    qb.andWhere('location.locationPriceAfterDeal <= :maxPrice', {
      maxPrice,
    });
  }

  private applyMinAreaFilter(
    qb: SelectQueryBuilder<TbLocation>,
    minArea?: number,
  ) {
    if (minArea === undefined) {
      return;
    }

    qb.andWhere('location.locationArea >= :minArea', {
      minArea,
    });
  }

  private applyMaxAreaFilter(
    qb: SelectQueryBuilder<TbLocation>,
    maxArea?: number,
  ) {
    if (maxArea === undefined) {
      return;
    }

    qb.andWhere('location.locationArea <= :maxArea', {
      maxArea,
    });
  }

  private applyRentFilter(
    qb: SelectQueryBuilder<TbLocation>,
    isRented?: boolean,
  ) {
    if (isRented === undefined) {
      return;
    }

    qb.andWhere('location.hasRent = :hasRent', {
      hasRent: isRented
        ? LOCATION_RENT_STATUS.HAS_RENT
        : LOCATION_RENT_STATUS.READY,
    });
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
      .andWhere(
        new Brackets((inner) => {
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
        }),
      );
    this.applyPublicVisibilityFilter(qb);

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

  public async getLocationsByOwner(
    ownerCode: string,
  ): Promise<LocationSummaryResponseDto[]> {
    const rows = await this.createBaseQuery()
      .where('location.ownerCode = :ownerCode', { ownerCode })
      .orderBy('location.locationCode', 'DESC')
      .getRawMany<BaseLocationRow>();

    return rows.map((row) => this.toLocationSummary(row));
  }

  private createBaseQuery() {
    const qb = this.locationRepo
      .createQueryBuilder('location')
      .leftJoin(
        TbLocationType,
        'locationType',
        'locationType.typeCode = location.typeCode',
      )
      .leftJoin(
        'tb_user_default',
        'ownerUser',
        'ownerUser.userCode = location.ownerCode',
      )
      .leftJoin(
        'tb_user_profile',
        'ownerProfile',
        'ownerProfile.user_id = ownerUser.id',
      )
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
        'location.locationPrice AS price',
        'location.locationPriceUnit AS priceUnit',
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

    return qb;
  }

  private applyPublicVisibilityFilter(qb: SelectQueryBuilder<TbLocation>) {
    qb.andWhere('location.locationStatus = :activeLocationStatus', {
      activeLocationStatus: LocationStatus.ACTIVE,
    }).andWhere((builder) => {
      const subQuery = builder
        .subQuery()
        .select('1')
        .from('tb_owner_package_subscription', 'subscription')
        .where('subscription.ownerUserCode = location.ownerCode')
        .andWhere('subscription.rentalClass = :listingRentalClass')
        .andWhere('subscription.status = :activeSubscriptionStatus')
        .andWhere(
          '(subscription.expiresAt > CURRENT_TIMESTAMP OR subscription.expiresAt IS NULL)',
        )
        .getQuery();

      return `EXISTS ${subQuery}`;
    });

    qb.setParameters({
      listingRentalClass: RentalClass.LONG_TERM,
      activeSubscriptionStatus: OwnerPackageSubscriptionStatus.ACTIVE,
    });
  }

  private async toLocationDetail(
    row: BaseLocationRow,
  ): Promise<LocationDetailResponseDto> {
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
      area:
        row.area === null || row.area === undefined ? null : Number(row.area),
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
      distanceKm:
        row.distanceKm === null || row.distanceKm === undefined
          ? undefined
          : Number(row.distanceKm),
    };
  }

  private toPricing(row: BaseLocationRow): LocationPricingDto {
    return {
      price: Number(row.price ?? 0),
      priceUnit: row.priceUnit ?? '',
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

  private toPrimaryAddress(
    row: BaseLocationRow,
  ): LocationAddressResponseDto | null {
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

  private async getAddresses(
    locationCode: string,
  ): Promise<LocationAddressResponseDto[]> {
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

  private async getServicesForLocation(
    locationCode: string,
  ): Promise<ServiceCatalogItemDto[]> {
    const rows = await this.locationServiceRepo
      .createQueryBuilder('locationService')
      .innerJoin(
        TbService,
        'service',
        'service.code = locationService.serviceCode',
      )
      .select([
        'service.code AS serviceCode',
        'service.name AS serviceName',
        'locationService.description AS description',
        'service.category AS category',
        'locationService.isActive AS isActive',
        'locationService.isFree AS isFree',
        'locationService.basePrice AS basePrice',
        'locationService.unit AS unit',
        'locationService.quantity AS quantity',
      ])
      .where('locationService.locationCode = :locationCode', { locationCode })
      .getRawMany<ServiceCatalogItemDto>();

    return rows.map((row) => ({
      ...row,
      isActive: Boolean(Number((row as any).isActive ?? 1)),
      isFree: Boolean(Number((row as any).isFree ?? 0)),
      basePrice: Number((row as any).basePrice ?? 0),
      unit: (row as any).unit ?? 'FULL',
      quantity: Number((row as any).quantity ?? 1),
    }));
  }

  private async getMediaForLocation(
    locationCode: string,
  ): Promise<LocationMediaResponseItemDto[]> {
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
