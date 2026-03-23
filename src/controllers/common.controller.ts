import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/jwt/public.decorator';
import {
  CommonMetadataListResponseDto,
  LocationFilterDefaultsResponseDto,
  UploadMetadataResponseDto,
} from '../dtos/common/common.dto';
import { CommonService } from '../services/common.service';

@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Public()
  @Get('location-filter-types')
  @ApiOperation({ summary: 'Lấy loại địa điểm' })
  public async getLocationFilterTypes(): Promise<CommonMetadataListResponseDto> {
    return this.commonService.GetLocationFilterTypes();
  }

  @Public()
  @Get('location-filter-services')
  @ApiOperation({ summary: 'Lấy dịch vụ địa điểm' })
  public async getLocationFilterServices(): Promise<CommonMetadataListResponseDto> {
    return this.commonService.GetLocationFilterServices();
  }

  @Public()
  @Get('location-filter-rent-statuses')
  @ApiOperation({ summary: 'Lấy trạng thái thuê' })
  public getLocationFilterRentStatuses(): CommonMetadataListResponseDto {
    return this.commonService.GetLocationFilterRentStatuses();
  }

  @Public()
  @Get('location-filter-sorts')
  @ApiOperation({ summary: 'Lấy metadata sắp xếp địa điểm' })
  public getLocationFilterSorts(): CommonMetadataListResponseDto {
    return this.commonService.GetLocationFilterSorts();
  }

  @Public()
  @Get('location-filter-price-ranges')
  @ApiOperation({ summary: 'Lấy metadata khoảng giá' })
  public getLocationFilterPriceRanges(): CommonMetadataListResponseDto {
    return this.commonService.GetLocationFilterPriceRanges();
  }

  @Public()
  @Get('location-filter-area-ranges')
  @ApiOperation({ summary: 'Lấy metadata khoảng diện tích' })
  public getLocationFilterAreaRanges(): CommonMetadataListResponseDto {
    return this.commonService.GetLocationFilterAreaRanges();
  }

  @Public()
  @Get('location-filter-defaults')
  @ApiOperation({ summary: 'Lấy cấu hình mặc định bộ lọc địa điểm' })
  public getLocationFilterDefaults(): LocationFilterDefaultsResponseDto {
    return this.commonService.GetLocationFilterDefaults();
  }

  @Public()
  @Get('user-roles')
  @ApiOperation({ summary: 'Lấy metadata vai trò người dùng' })
  public getUserRoles(): CommonMetadataListResponseDto {
    return this.commonService.GetUserRoles();
  }

  @Public()
  @Get('upload')
  @ApiOperation({ summary: 'Lấy metadata upload' })
  public getUploadMetadata(): UploadMetadataResponseDto {
    return this.commonService.GetUploadMetadata();
  }
}
