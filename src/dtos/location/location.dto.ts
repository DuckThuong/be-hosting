import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TbLocation } from '../../entities/location/location.entity';
import { LocationMediaType } from '../../entities/location/locationMedia.entity';
import { LocationAddressUpdateDto } from './locationAddress.dto';

export class CreateLocationDto {
  @ApiProperty({
    description: 'Mã loại địa điểm',
    example: 'TYPE001',
    required: true,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  typeCode: string;

  @ApiProperty({
    description: 'Danh sách dịch vụ',
    type: () => ServicePayloadDto,
    isArray: true,
  })
  @IsNotEmpty()
  serviceCode: ServicePayloadDto[];

  @ApiProperty({
    description: 'Danh sách cơ sở',
    type: () => LocationAddressUpdateDto,
    isArray: true,
  })
  locationAddress: LocationAddressUpdateDto[];

  @ApiProperty({
    description: 'Tên địa điểm',
    example: 'Kho A - Tầng 1',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  locationName: string;

  @ApiProperty({
    description: 'Ảnh',
    example: 'Kho A - Tầng 1',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  locationLogo: string;

  ownerCode: string;

  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC001',
    required: true,
    maxLength: 25,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  locationCode: string;

  @ApiProperty({
    description: 'Giới hạn thời gian tối thiểu ',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  minTimeLimit?: string;

  @ApiProperty({
    description: 'Giới hạn thời gian tối đa ',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsInt()
  maxTimeLimit?: string;

  @ApiProperty({
    description: 'Giá bắt đầu',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  locationPriceStart?: number;

  @ApiProperty({
    description: 'Giá cuối',
    example: 30,
    required: false,
  })
  @IsInt()
  locationPriceEnd?: number;

  @ApiProperty({
    description: 'Giá sau thương lượng',
    example: 30,
    required: false,
  })
  @IsInt()
  locationPriceAfterDeal?: number;

  @ApiProperty({
    description: 'Diện tích khu vực',
    example: 35.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  locationArea?: number;

  @ApiProperty({
    description: 'Trạng thái cho thuê (0: Không, 1: Có)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  hasRent?: number;

  @ApiProperty({
    description: 'Mã người thuê',
    example: 'USER001',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userRentCd?: string;

  @ApiProperty({
    description: 'Mô tả địa điểm',
    example: 'Kho chứa hàng điện tử, có hệ thống điều hòa',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  locationDescription?: string;

  @ApiProperty({
    description: 'Ghi chú về địa điểm',
    example: 'Cần kiểm tra định kỳ hàng tuần',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  locationNote?: string;

  @ApiProperty({
    description: 'Trạng thái địa điểm (0: Inactive, 1: Active)',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  locationStatus: number;

  @ApiProperty({
    description: 'Đánh giá địa điểm (1-5 sao)',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  locationRate?: number;
}

export class UpdateLocationDto {
  @ApiProperty({
    description: 'Mã loại địa điểm',
    example: 'TYPE001',
    required: true,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  typeCode: string;

  @ApiProperty({
    description: 'Danh sách dịch vụ',
    type: () => ServicePayloadDto,
    isArray: true,
  })
  @IsNotEmpty()
  serviceCode: ServicePayloadDto[];

  @ApiProperty({
    description: 'Danh sách cơ sở',
    type: () => LocationAddressUpdateDto,
    isArray: true,
  })
  locationAddress: LocationAddressUpdateDto[];

  @ApiProperty({
    description: 'Tên địa điểm',
    example: 'Kho A - Tầng 1',
    required: true,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  locationName: string;

  @ApiProperty({
    description: 'Giá bắt đầu',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  locationPriceStart?: number;

  @ApiProperty({
    description: 'Giá cuối',
    example: 30,
    required: false,
  })
  @IsInt()
  locationPriceEnd?: number;

  @ApiProperty({
    description: 'Giá sau thương lượng',
    example: 30,
    required: false,
  })
  @IsInt()
  locationPriceAfterDeal?: number;

  @ApiProperty({
    description: 'Diện tích khu vực',
    example: 35.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  locationArea?: number;

  @ApiProperty({
    description: 'Giới hạn thời gian tối thiểu ',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  minTimeLimit?: string;

  @ApiProperty({
    description: 'Giới hạn thời gian tối đa ',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsInt()
  maxTimeLimit?: string;

  @ApiProperty({
    description: 'Trạng thái cho thuê (0: Không, 1: Có)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  hasRent?: number;

  @ApiProperty({
    description: 'Mã người thuê',
    example: 'USER001',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userRentCd?: string;

  @ApiProperty({
    description: 'Mô tả địa điểm',
    example: 'Kho chứa hàng điện tử, có hệ thống điều hòa',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  locationDescription?: string;

  @ApiProperty({
    description: 'Ghi chú về địa điểm',
    example: 'Cần kiểm tra định kỳ hàng tuần',
    required: false,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  locationNote?: string;

  @ApiProperty({
    description: 'Trạng thái địa điểm (0: Inactive, 1: Active)',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  locationStatus: number;

  @ApiProperty({
    description: 'Đánh giá địa điểm (1-5 sao)',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  locationRate?: number;
}

export class UpdatelocationPayloadDto {
  @ApiProperty({
    description: 'locationCode',
    example: 'locationCode',
  })
  locationCode: string;

  @ApiProperty({
    description: 'data',
    type: () => UpdateLocationDto,
  })
  data: UpdateLocationDto;
}

export class DeleteLocationDto {
  @ApiProperty({
    description: 'Mã địa điểm cần xóa',
    example: 'LOC001',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  locationCode: string;
}

export class UpdateRentStatusDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC001',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  locationCode: string;

  @ApiProperty({
    description: 'Trạng thái cho thuê (0: Không, 1: Có)',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  hasRent: number;

  @ApiProperty({
    description: 'Mã người thuê (bắt buộc nếu hasRent = 1)',
    example: 'USER001',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userRentCd?: string;
}

export class ServicePayloadDto {
  @ApiProperty({
    description: 'Mã dịch vụ',
    required: true,
    maxLength: 50,
  })
  @IsNotEmpty()
  serviceCode: string;
}
export class LocationResponseDto {
  message: string;
  data?: TbLocation;
}

export class UpdateLocationResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Cập nhật địa điểm thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Dữ liệu địa điểm đã cập nhật',
  })
  data: any;
}

export class DeleteLocationResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Xóa địa điểm thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Kết quả xóa',
  })
  data: {
    deleted: boolean;
  };
}

export class UpdateRentStatusResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Cập nhật trạng thái cho thuê thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Dữ liệu địa điểm đã cập nhật',
  })
  data: any;
}

export class LocationServiceDto {
  @ApiProperty({
    description: 'Mã dịch vụ',
    example: 'SRV001',
  })
  serviceCode: string;

  @ApiProperty({
    description: 'Logo dịch vụ',
    example: 'https://cdn.example.com/service-logo.png',
    required: false,
  })
  serviceLogo?: string;

  @ApiProperty({
    description: 'Hình nền dịch vụ',
    example: 'https://cdn.example.com/service-bg.png',
    required: false,
  })
  serviceBackGround?: string;

  @ApiProperty({
    description: 'Tên dịch vụ',
    example: 'Wifi miễn phí',
  })
  serviceName: string;

  @ApiProperty({
    description: 'Giá dịch vụ',
    example: 50000,
  })
  servicePrice: number;

  @ApiProperty({
    description: 'Mô tả dịch vụ',
    example: 'Wifi tốc độ cao 100Mbps',
    required: false,
  })
  serviceDescription?: string;

  @ApiProperty({
    description: 'Ghi chú dịch vụ',
    example: 'Miễn phí cho khách thuê dài hạn',
    required: false,
  })
  serviceNote?: string;
}

export class LocationAddressItemDto {
  @ApiProperty({ description: 'addressCode' }) addressCode: string;
  @ApiProperty({ description: 'addressName' }) addressName: string;
  @ApiProperty({ description: 'fullAddress' }) fullAddress: string;
  @ApiProperty({ description: 'addressWard' }) addressWard: string;
  @ApiProperty({ description: 'addressDistrict' }) addressDistrict: string;
  @ApiProperty({ description: 'addressCity' }) addressCity: string;
  @ApiProperty({ description: 'addressProvince' }) addressProvince: string;
  @ApiProperty({ description: 'addressCountry' }) addressCountry: string;
  @ApiProperty({ description: 'addressPortal' }) addressPortal: string;
  @ApiProperty({ description: 'addressLat' }) addressLat: number;
  @ApiProperty({ description: 'addressLong' }) addressLong: number;
  @ApiProperty({ description: 'addressRegion' }) addressRegion: string;
  @ApiProperty({ description: 'addressStatus' }) addressStatus: string;
  @ApiProperty({ description: 'addressDescription' })
  addressDescription: string;
  @ApiProperty({ description: 'addressNote' }) addressNote: string;
  @ApiProperty({ description: 'addressType' }) addressType: string;
}
export class LocationServiceDataDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC001',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Danh sách dịch vụ của địa điểm',
    type: [LocationServiceDto],
    required: false,
  })
  services?: LocationServiceDto[];
}

export class LocationMediaDto {
  @ApiProperty({ description: 'Mã media', example: 'MEDIA_00000001' })
  mediaCode: string;

  @ApiProperty({
    description: 'URL media',
    example: 'https://cdn.example.com/location/media-1.jpg',
  })
  mediaUrl: string;

  @ApiProperty({
    description: 'Loại media',
    enum: LocationMediaType,
    example: LocationMediaType.IMAGE,
  })
  mediaType: LocationMediaType;

  @ApiProperty({ description: 'Thứ tự hiển thị', example: 1 })
  displayOrder: number;

  @ApiProperty({ description: 'Có phải logo hay không', example: true })
  isLogo: boolean;
}

export class LocationListDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC001',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Tên địa điểm',
    example: 'Tòa nhà A',
  })
  locationName: string;

  @ApiProperty({
    description: 'Mô tả địa điểm',
    example: 'Địa điểm cho thuê văn phòng',
    required: false,
  })
  locationDescription?: string;

  @ApiProperty({
    description: 'Ghi chú địa điểm',
    example: 'Gần trung tâm',
    required: false,
  })
  locationNote?: string;

  @ApiProperty({
    description: 'Logo địa điểm',
    example: 'https://cdn.example.com/location-logo.png',
    required: false,
  })
  locationLogo?: string;

  @ApiProperty({
    description: 'Giá thuê bắt đầu',
    example: 100000,
  })
  locationPriceStart: number;

  @ApiProperty({
    description: 'Giá thuê kết thúc',
    example: 500000,
  })
  locationPriceEnd: number;

  @ApiProperty({
    description: 'Giá thuê sau khi thỏa thuận',
    example: 450000,
    required: false,
  })
  locationPriceAfterDeal?: number;

  @ApiProperty({
    description: 'Diện tích khu vực',
    example: 35.5,
    required: false,
  })
  locationArea?: number;

  @ApiProperty({
    description: 'Thời gian thuê tối thiểu (giờ)',
    example: 1,
  })
  minTime: number;

  @ApiProperty({
    description: 'Thời gian thuê tối đa (giờ)',
    example: 24,
  })
  maxTime: number;

  @ApiProperty({
    description: 'Có cho thuê hay không',
    example: true,
  })
  hasRent: boolean;

  @ApiProperty({
    description: 'Đánh giá địa điểm',
    example: 4.5,
  })
  locationRate: number;

  @ApiProperty({
    description: 'Mã loại địa điểm',
    example: 'TYPE001',
  })
  typeCode: string;

  @ApiProperty({
    description: 'Tên loại địa điểm',
    example: 'Văn phòng',
    required: false,
  })
  typeName?: string;

  @ApiProperty({
    description: 'Mô tả loại địa điểm',
    example: 'Không gian làm việc',
    required: false,
  })
  typeDescription?: string;

  @ApiProperty({
    description: 'Logo loại địa điểm',
    example: 'https://cdn.example.com/logo.png',
    required: false,
  })
  typeLogo?: string;

  @ApiProperty({
    description: 'Hình nền loại địa điểm',
    example: 'https://cdn.example.com/bg.png',
    required: false,
  })
  typeBackGround?: string;

  @ApiProperty({
    description: 'Mã chủ sở hữu',
    example: 'USR001',
  })
  ownerCode: string;

  @ApiProperty({
    description: 'Tên chủ sở hữu',
    example: 'Nguyễn Văn A',
    required: false,
  })
  ownerName?: string;

  @ApiProperty({
    description: 'Email chủ sở hữu',
    example: 'owner@example.com',
    required: false,
  })
  ownerEmail?: string;

  @ApiProperty({
    description: 'Avatar chủ sở hữu',
    example: 'https://cdn.example.com/avatar.jpg',
    required: false,
  })
  ownerAvatar?: string;

  @ApiProperty({
    description: 'Ảnh bìa chủ sở hữu',
    example: 'https://cdn.example.com/cover.jpg',
    required: false,
  })
  ownerCover?: string;

  @ApiProperty({
    description: 'Số điện thoại chủ sở hữu',
    example: '0901234567',
    required: false,
  })
  ownerPhone?: string;

  @ApiProperty({
    description: 'Địa chỉ chủ sở hữu',
    example: '123 Nguyễn Huệ, Q1',
    required: false,
  })
  ownerAddress?: string;

  @ApiProperty({
    description: 'Thành phố chủ sở hữu',
    example: 'Hồ Chí Minh',
    required: false,
  })
  ownerCity?: string;

  @ApiProperty({
    description: 'Mã người thuê',
    example: 'USR002',
    required: false,
  })
  renterCode?: string;

  @ApiProperty({
    description: 'Tên người thuê',
    example: 'Trần Thị B',
    required: false,
  })
  renterName?: string;

  @ApiProperty({
    description: 'Email người thuê',
    example: 'renter@example.com',
    required: false,
  })
  renterEmail?: string;

  @ApiProperty({
    description: 'Avatar người thuê',
    example: 'https://cdn.example.com/renter-avatar.jpg',
    required: false,
  })
  renterAvatar?: string;

  @ApiProperty({
    description: 'Ảnh bìa người thuê',
    example: 'https://cdn.example.com/renter-cover.jpg',
    required: false,
  })
  renterCover?: string;

  @ApiProperty({
    description: 'Số điện thoại người thuê',
    example: '0907654321',
    required: false,
  })
  renterPhone?: string;

  @ApiProperty({
    description: 'Địa chỉ người thuê',
    example: '456 Lê Lợi, Q1',
    required: false,
  })
  renterAddress?: string;

  @ApiProperty({
    description: 'Thành phố người thuê',
    example: 'Hà Nội',
    required: false,
  })
  renterCity?: string;

  @ApiProperty({
    description: 'Danh sách dịch vụ của địa điểm',
    type: [LocationServiceDto],
    required: false,
  })
  services?: LocationServiceDto[];

  @ApiProperty({
    description: 'Danh sách cơ sở của địa điểm',
    type: [LocationAddressItemDto],
    required: false,
  })
  address?: LocationAddressItemDto[];

  @ApiProperty({
    description: 'Trạng thái yêu thích của người dùng hiện tại',
    example: true,
    required: false,
  })
  isFavorite?: boolean;

  @ApiProperty({
    description: 'Danh sách media của địa điểm',
    type: [LocationMediaDto],
    required: false,
    example: [
      {
        mediaCode: 'MEDIA_00000001',
        mediaUrl: 'https://cdn.example.com/location/media-1.jpg',
        mediaType: LocationMediaType.IMAGE,
        displayOrder: 1,
        isLogo: true,
      },
      {
        mediaCode: 'MEDIA_00000002',
        mediaUrl: 'https://cdn.example.com/location/media-2.mp4',
        mediaType: LocationMediaType.VIDEO,
        displayOrder: 2,
        isLogo: false,
      },
    ],
  })
  media?: LocationMediaDto[];
}

export class ToggleFavoriteRequestDto {
  @ApiProperty({
    description: 'Mã location cần toggle favorite',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;
}

export class ToggleFavoriteResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Cập nhật yêu thích thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Mã location',
    example: 'UWUi9ZXl',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Trạng thái favorite sau khi toggle',
    example: true,
  })
  isFavorite: boolean;
}

export class FavoriteLocationSummaryDto {
  @ApiProperty({
    description: 'Mã location',
    example: 'UWUi9ZXl',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Tên phòng',
    example: 'Kho A - Tang 1',
  })
  locationName: string;

  @ApiProperty({
    description: 'Ảnh đại diện phòng',
    example: 'https://cdn.example.com/location/logo.png',
  })
  locationLogo: string;

  @ApiProperty({
    description: 'Địa chỉ đại diện để hiển thị trên danh sách',
    example: '123 Nguyen Hue, Ben Nghe, Quan 1, Ho Chi Minh City',
    required: false,
  })
  fullAddress?: string;

  @ApiProperty({
    description: 'Giá bắt đầu',
    example: 3000000,
    required: false,
  })
  locationPriceStart?: number;

  @ApiProperty({
    description: 'Giá kết thúc',
    example: 5000000,
    required: false,
  })
  locationPriceEnd?: number;

  @ApiProperty({
    description: 'Diện tích khu vực',
    example: 35.5,
    required: false,
  })
  locationArea?: number;

  @ApiProperty({
    description: 'Mã loại phòng',
    example: 'TYPE001',
    required: false,
  })
  typeCode?: string;

  @ApiProperty({
    description: 'Tên loại phòng',
    example: 'Phòng trọ',
    required: false,
  })
  typeName?: string;

  @ApiProperty({
    description: 'Trạng thái cho thuê (0: Không, 1: Có)',
    example: 1,
    required: false,
  })
  hasRent?: number;

  @ApiProperty({
    description: 'Trạng thái yêu thích của người dùng hiện tại',
    example: true,
  })
  isFavorite: boolean;
}

export class FavoriteLocationListResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Lấy danh sách yêu thích thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Danh sách location yêu thích',
    type: [FavoriteLocationSummaryDto],
  })
  data: FavoriteLocationSummaryDto[];
}

export class GetShareLinkQueryDto {
  @ApiProperty({
    description: 'Mã location cần tạo link chia sẻ',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;
}

export class GetShareLinkResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Tạo link chia sẻ thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Mã location',
    example: 'UWUi9ZXl',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Link chia sẻ full frontend',
    example: 'https://frontend.example.com/room-detail?locationCode=UWUi9ZXl',
  })
  shareUrl: string;
}

export class UpdateLocationLogoRequestDto {
  @ApiProperty({
    description: 'Mã location cần cập nhật logo',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;

  @ApiProperty({
    description: 'Mã media được chọn làm logo',
    example: 'MEDIA_00000001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  mediaCode: string;
}

export class UpdateLocationLogoResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Cập nhật logo thành công.',
  })
  message: string;

  @ApiProperty({ description: 'Mã location', example: 'UWUi9ZXl' })
  locationCode: string;

  @ApiProperty({
    description: 'Mã media đang được đặt làm logo',
    example: 'MEDIA_00000001',
  })
  mediaCode: string;

  @ApiProperty({
    description: 'URL logo mới của location sau khi cập nhật',
    example: 'https://cdn.example.com/location/media-1.jpg',
  })
  locationLogo: string;
}

export class AddLocationMediaRequestDto {
  @ApiProperty({
    description: 'Mã location cần thêm media',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;

  @ApiProperty({
    description: 'Loại media',
    enum: LocationMediaType,
    example: LocationMediaType.IMAGE,
  })
  @IsString()
  @IsNotEmpty()
  mediaType: LocationMediaType;

  @ApiProperty({
    description: 'Thứ tự hiển thị',
    example: 1,
    required: false,
  })
  @IsOptional()
  displayOrder?: string | number;

  @ApiProperty({
    description: 'Có đặt làm logo hay không',
    example: false,
    required: false,
  })
  @IsOptional()
  isLogo?: string | boolean | number;
}

export class UpdateLocationMediaRequestDto {
  @ApiProperty({
    description: 'Mã location chứa media',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;

  @ApiProperty({
    description: 'Mã media cần cập nhật',
    example: 'MEDIA_00000001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  mediaCode: string;

  @ApiProperty({
    description: 'Loại media mới',
    enum: LocationMediaType,
    example: LocationMediaType.VIDEO,
    required: false,
  })
  @IsOptional()
  @IsString()
  mediaType?: LocationMediaType;

  @ApiProperty({
    description: 'Thứ tự hiển thị mới',
    example: 2,
    required: false,
  })
  @IsOptional()
  displayOrder?: string | number;

  @ApiProperty({
    description: 'Có đặt làm logo hay không',
    example: false,
    required: false,
  })
  @IsOptional()
  isLogo?: string | boolean | number;
}

export class DeleteLocationMediaRequestDto {
  @ApiProperty({
    description: 'Mã location chứa media',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;

  @ApiProperty({
    description: 'Mã media cần xóa',
    example: 'MEDIA_00000001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  mediaCode: string;
}

export class ReorderLocationMediaItemDto {
  @ApiProperty({
    description: 'Mã media',
    example: 'MEDIA_00000001',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  mediaCode: string;

  @ApiProperty({
    description: 'Thứ tự hiển thị mới',
    example: 1,
  })
  @IsInt()
  displayOrder: number;
}

export class ReorderLocationMediaRequestDto {
  @ApiProperty({
    description: 'Mã location cần cập nhật thứ tự media',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;

  @ApiProperty({
    description: 'Danh sách media và thứ tự mới',
    type: [ReorderLocationMediaItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderLocationMediaItemDto)
  data: ReorderLocationMediaItemDto[];
}

export class LocationMediaResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Them media thanh cong.',
  })
  message: string;

  @ApiProperty({
    description: 'Media sau khi xử lý',
    type: () => LocationMediaDto,
  })
  data: LocationMediaDto;
}

export class LocationMediaListResponseDto {
  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Cap nhat thu tu media thanh cong.',
  })
  message: string;

  @ApiProperty({
    description: 'Danh sách media của location',
    type: [LocationMediaDto],
  })
  data: LocationMediaDto[];
}

export class GetLocationAddressByLocationCodePayloadDto {
  @ApiProperty({
    description: 'Mã location',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  locationCode: string;
}

export class GetLocationAddressByLocationCodeResponseDto {
  @ApiProperty({
    type: [LocationAddressItemDto],
  })
  data: LocationAddressItemDto[];
}

export class GetRelatedLocationQueryDto {
  @ApiProperty({
    description: 'Mã location hiện tại',
    example: 'UWUi9ZXl',
  })
  @IsString()
  @IsNotEmpty()
  locationCode: string;

  @ApiProperty({
    description: 'Trang hiện tại',
    example: '1',
    required: false,
  })
  page?: string;

  @ApiProperty({
    description: 'Số lượng mỗi trang',
    example: '8',
    required: false,
  })
  limit?: string;
}

export class GetLocationByFillterDto {
  @ApiProperty({
    description: 'searchValue',
    example: '',
    required: false,
  })
  searchValue?: string;

  @ApiProperty({
    description: 'locationName',
    example: '',
    required: false,
  })
  locationName?: string;

  @ApiProperty({
    description: 'ownerName',
    example: '',
    required: false,
  })
  ownerName?: string;

  @ApiProperty({
    description: 'ownerEmail',
    example: '',
    required: false,
  })
  ownerEmail?: string;

  @ApiProperty({
    description: 'hasRent',
    example: '',
    required: false,
  })
  hasRent?: number;

  @ApiProperty({
    description: 'renderName',
    example: '',
    required: false,
  })
  renderName?: string;

  @ApiProperty({
    description: 'renderEmail',
    example: '',
    required: false,
  })
  renderEmail?: string;

  @ApiProperty({
    description: 'locationRate',
    example: '',
    required: false,
  })
  locationRate?: number;

  @ApiProperty({
    description: 'locationType',
    example: '',
    required: false,
  })
  locationType?: string;

  @ApiProperty({
    description: 'typeName',
    example: '',
    required: false,
  })
  typeName?: string;

  @ApiProperty({
    description: 'addressLong',
    example: '',
    required: false,
  })
  addressLong?: string;

  @ApiProperty({
    description: 'addressLat',
    example: '',
    required: false,
  })
  addressLat?: string;

  @ApiProperty({
    description: 'fullAddress',
    example: '',
    required: false,
  })
  fullAddress?: string;

  @ApiProperty({
    description: 'addressName',
    example: '',
    required: false,
  })
  addressName?: string;

  @ApiProperty({
    description: 'addressWard',
    example: '',
    required: false,
  })
  addressWard?: string;

  @ApiProperty({
    description: 'addressDistrict',
    example: '',
    required: false,
  })
  addressDistrict?: string;

  @ApiProperty({
    description: 'addressCity',
    example: '',
    required: false,
  })
  addressCity?: string;

  @ApiProperty({
    description: 'addressProvince',
    example: '',
    required: false,
  })
  addressProvince?: string;

  @ApiProperty({
    description: 'addressCountry',
    example: '',
    required: false,
  })
  addressCountry?: string;

  @ApiProperty({
    description: 'addressRegion',
    example: '',
    required: false,
  })
  addressRegion?: string;

  @ApiProperty({
    description: 'addressType',
    example: '',
    required: false,
  })
  addressType?: string;

  @ApiProperty({
    description: 'addressType',
    example: '',
    required: false,
  })
  page?: string;

  @ApiProperty({
    description: 'addressType',
    example: '',
    required: false,
  })
  limit?: string;
}

export class PaginatedLocationListDto {
  data: LocationListDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
