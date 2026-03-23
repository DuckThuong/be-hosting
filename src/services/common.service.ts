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
  UploadMetadataDto,
  UploadMetadataResponseDto,
} from '../dtos/common/common.dto';
import { UserRole } from '../dtos/user/user.dto';
import { LocationService } from './location.service';
import { ServiceService } from './service.service';

@Injectable()
export class CommonService {
  private readonly priceRanges = [
    { key: 'under-300', label: 'Dưới 300k', minValue: 0, maxValue: 300 },
    { key: '300-500', label: '300k - 500k', minValue: 300, maxValue: 500 },
    { key: '500-800', label: '500k - 800k', minValue: 500, maxValue: 800 },
    { key: '800-1200', label: '800k - 1200k', minValue: 800, maxValue: 1200 },
    { key: '1200-2000', label: '1200k - 2000k', minValue: 1200, maxValue: 2000 },
    { key: 'over-2000', label: 'Trên 2000k', minValue: 2000, maxValue: null },
  ];

  private readonly areaRanges = [
    { key: 'under-20', label: 'Dưới 20m²', minValue: 0, maxValue: 20 },
    { key: '20-50', label: '20m² - 50m²', minValue: 20, maxValue: 50 },
    { key: '50-100', label: '50m² - 100m²', minValue: 50, maxValue: 100 },
    { key: '100-200', label: '100m² - 200m²', minValue: 100, maxValue: 200 },
    { key: 'over-200', label: 'Trên 200m²', minValue: 200, maxValue: null },
  ];

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
      this.mapOption('ready', 'Sẵn sàng cho thuê', LOCATION_RENT_STATUS.READY, 1),
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

  public GetLocationFilterPriceRangesData(): CommonMetadataOptionDto[] {
    return this.priceRanges.map((item, index) =>
      this.mapOption(item.key, item.label, item.key, index + 1, false, {
        minValue: item.minValue,
        maxValue: item.maxValue,
      }),
    );
  }

  public GetLocationFilterAreaRangesData(): CommonMetadataOptionDto[] {
    return this.areaRanges.map((item, index) =>
      this.mapOption(item.key, item.label, item.key, index + 1, false, {
        minValue: item.minValue,
        maxValue: item.maxValue,
      }),
    );
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
        this.mapOption(RESOURCE_TYPE, 'Tự động nhận diện', RESOURCE_TYPE, 1, true),
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

  public GetLocationFilterPriceRanges(): CommonMetadataListResponseDto {
    return {
      message: 'Lấy metadata khoảng giá thành công.',
      data: this.GetLocationFilterPriceRangesData(),
    };
  }

  public GetLocationFilterAreaRanges(): CommonMetadataListResponseDto {
    return {
      message: 'Lấy metadata khoảng diện tích thành công.',
      data: this.GetLocationFilterAreaRangesData(),
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
