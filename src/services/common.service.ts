import { Injectable } from '@nestjs/common';
import {
  LOCATION_RENT_STATUS,
  RESOURCE_TYPE,
} from '../assests/constants/constants';
import {
  CommonMetadataListResponseDto,
  CommonMetadataOptionDto,
  LocationFilterDefaultsDto,
  LocationFilterDefaultsResponseDto,
  NumericMetadataListResponseDto,
  UploadMetadataDto,
  UploadMetadataResponseDto,
} from '../dtos/common/common.dto';
import { UserRole } from '../dtos/user/user.dto';
import { LocationService } from './location.service';
import { ServiceService } from './service.service';

@Injectable()
export class CommonService {
  private readonly defaultPriceMarkers = [0, 250000, 500000, 750000, 1000000];
  private readonly defaultAreaMarkers = [0, 25, 50, 75, 100];

  constructor(
    private readonly locationService: LocationService,
    private readonly serviceService: ServiceService,
  ) {}

  private mapOption(
    key: string,
    label: string,
    value: string | number,
    order: number,
    isDefault = false,
    extra: Partial<CommonMetadataOptionDto> = {},
  ): CommonMetadataOptionDto {
    return {
      key,
      label,
      value,
      isDefault,
      isActive: true,
      order,
      ...extra,
    };
  }

  private normalizeMarkerValue(value: number): number {
    return Number(value.toFixed(2));
  }

  private buildMarkers(
    minValue: number | null,
    maxValue: number | null,
    fallback: number[],
  ): number[] {
    if (
      minValue === null ||
      maxValue === null ||
      !Number.isFinite(minValue) ||
      !Number.isFinite(maxValue)
    ) {
      return [...fallback];
    }

    if (minValue > maxValue) {
      return this.buildMarkers(maxValue, minValue, fallback);
    }

    if (minValue === maxValue) {
      const step = Math.max(Math.abs(minValue) * 0.1, 1);
      const start = Math.max(minValue - step * 2, 0);

      return Array.from({ length: 5 }, (_, index) =>
        this.normalizeMarkerValue(start + step * index),
      );
    }

    const step = (maxValue - minValue) / 4;

    return Array.from({ length: 5 }, (_, index) =>
      this.normalizeMarkerValue(minValue + step * index),
    );
  }

  public async GetLocationFilterTypesData(): Promise<CommonMetadataOptionDto[]> {
    const locationTypes = await this.locationService.GetAllLocationType();

    return locationTypes.map((item, index) =>
      this.mapOption(item.typeCode, item.typeName, item.typeCode, index + 1),
    );
  }

  public async GetLocationFilterServicesData(): Promise<CommonMetadataOptionDto[]> {
    const services = await this.serviceService.GetAllService();
    const amenityKeyByServiceCode: Record<string, string> = {
      SRV_FREE_WIFI: 'wifi',
      SRV_FREE_AC: 'ac',
      SRV_FREE_PARKING: 'parking',
      SRV_FREE_SECURITY: 'security',
      SRV_POOL: 'pool',
      SRV_GYM: 'gym',
      SRV_LAUNDRY: 'laundry',
    };

    return services.map((item, index) =>
      this.mapOption(
        amenityKeyByServiceCode[item.serviceCode] ?? item.serviceCode,
        item.serviceName,
        item.serviceCode,
        index + 1,
      ),
    );
  }

  public GetLocationFilterRentStatusesData(): CommonMetadataOptionDto[] {
    return [
      this.mapOption(
        'ready',
        'Sẵn sàng cho thuê',
        LOCATION_RENT_STATUS.READY,
        1,
      ),
      this.mapOption(
        'has_rent',
        'Đang được thuê',
        LOCATION_RENT_STATUS.HAS_RENT,
        2,
      ),
    ];
  }

  public GetLocationFilterSortsData(): CommonMetadataOptionDto[] {
    return [
      this.mapOption('price-asc', 'Giá tăng dần', 'price-asc', 1, false, {
        field: 'price',
        direction: 'asc',
      }),
      this.mapOption('price-desc', 'Giá giảm dần', 'price-desc', 2, false, {
        field: 'price',
        direction: 'desc',
      }),
      this.mapOption('rating-desc', 'Đánh giá cao', 'rating-desc', 3, false, {
        field: 'rating',
        direction: 'desc',
      }),
      this.mapOption('area-desc', 'Diện tích lớn', 'area-desc', 4, false, {
        field: 'area',
        direction: 'desc',
      }),
      this.mapOption('newest', 'Mới nhất', 'newest', 5, true, {
        field: 'id',
        direction: 'desc',
      }),
    ];
  }

  public GetLocationFilterDefaultsData(): LocationFilterDefaultsDto {
    return {
      selectedTypeCodes: [],
      selectedServiceCodes: [],
      rentStatus: null,
      sortBy: 'newest',
      page: 1,
      limit: 10,
    };
  }

  public GetUserRolesData(): CommonMetadataOptionDto[] {
    return [
      this.mapOption('admin', 'Admin', UserRole.ADMIN, 1),
      this.mapOption('owner', 'Owner', UserRole.OWNER, 2),
      this.mapOption('user', 'User', UserRole.USER, 3),
    ];
  }

  public GetUploadMetadataData(): UploadMetadataDto {
    return {
      resourceTypes: [
        this.mapOption(
          RESOURCE_TYPE,
          'Tự động nhận diện',
          RESOURCE_TYPE,
          1,
          true,
        ),
      ],
    };
  }

  public async GetLocationFilterTypes(): Promise<CommonMetadataListResponseDto> {
    return {
      message: 'Lấy metadata loại địa điểm thành công.',
      data: await this.GetLocationFilterTypesData(),
    };
  }

  public async GetLocationFilterServices(): Promise<CommonMetadataListResponseDto> {
    return {
      message: 'Lấy metadata dịch vụ địa điểm thành công.',
      data: await this.GetLocationFilterServicesData(),
    };
  }

  public GetLocationFilterRentStatuses(): CommonMetadataListResponseDto {
    return {
      message: 'Lấy metadata trạng thái thuê thành công.',
      data: this.GetLocationFilterRentStatusesData(),
    };
  }

  public GetLocationFilterSorts(): CommonMetadataListResponseDto {
    return {
      message: 'Lấy metadata sắp xếp địa điểm thành công.',
      data: this.GetLocationFilterSortsData(),
    };
  }

  public async GetLocationFilterPriceRanges(): Promise<NumericMetadataListResponseDto> {
    const { minValue, maxValue } =
      await this.locationService.GetLocationPriceRangeBounds();

    return {
      message: 'Lấy metadata khoảng giá thành công.',
      data: this.buildMarkers(
        minValue,
        maxValue,
        this.defaultPriceMarkers,
      ),
    };
  }

  public async GetLocationFilterAreaRanges(): Promise<NumericMetadataListResponseDto> {
    const { minValue, maxValue } =
      await this.locationService.GetLocationAreaRangeBounds();

    return {
      message: 'Lấy metadata khoảng diện tích thành công.',
      data: this.buildMarkers(minValue, maxValue, this.defaultAreaMarkers),
    };
  }

  public GetLocationFilterDefaults(): LocationFilterDefaultsResponseDto {
    return {
      message: 'Lấy cấu hình mặc định bộ lọc địa điểm thành công.',
      data: this.GetLocationFilterDefaultsData(),
    };
  }

  public GetUserRoles(): CommonMetadataListResponseDto {
    return {
      message: 'Lấy metadata vai trò người dùng thành công.',
      data: this.GetUserRolesData(),
    };
  }

  public GetUploadMetadata(): UploadMetadataResponseDto {
    return {
      message: 'Lấy metadata upload thành công.',
      data: this.GetUploadMetadataData(),
    };
  }
}
