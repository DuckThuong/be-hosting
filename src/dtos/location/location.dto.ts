import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { TbLocation } from '../../entities/location/location.entity';

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
    required: true,
    maxLength: 50,
  })
  @IsNotEmpty()
  serviceCode: ServicePayloadDto[];

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
    description: 'Giới hạn thời gian tối thiểu (phút)',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  minTimeLimit?: number;

  @ApiProperty({
    description: 'Giới hạn thời gian tối đa (phút)',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsInt()
  maxTimeLimit?: number;

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
  locationCode: string;
  data: UpdateLocationDto;
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
    example: '______',
    required: true,
    maxLength: 50,
  })
  @IsNotEmpty()
  serviceCode: ServicePayloadDto[];

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
    description: 'Giới hạn thời gian tối thiểu (phút)',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  minTimeLimit?: number;

  @ApiProperty({
    description: 'Giới hạn thời gian tối đa (phút)',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsInt()
  maxTimeLimit?: number;

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
