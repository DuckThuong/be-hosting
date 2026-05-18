import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationMediaType } from '../../entities/location/locationMedia.entity';

export class LocationPricingDto {
  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: '/tháng' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  priceUnit: string;

  @ApiProperty({ example: 900000 })
  @IsNumber()
  @Min(0)
  priceAfterDeal: number;
}

export class LocationAvailabilityDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hasTimeLimit?: boolean;

  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsOptional()
  @IsDateString()
  availableFrom?: string;

  @ApiPropertyOptional({ example: '2026-05-31' })
  @IsOptional()
  @IsDateString()
  availableTo?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isRented?: boolean;
}

export class LocationPrimaryAddressDto {
  @ApiProperty({ example: '123 Nguyen Hue, toa A, can 501' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  addressDetail: string;

  @ApiProperty({ example: '123 Nguyen Hue, Ben Nghe, Quan 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullAddress: string;

  @ApiProperty({ example: 'Ben Nghe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  ward: string;

  @ApiProperty({ example: 'Ho Chi Minh City' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  city: string;

  @ApiProperty({ example: 'Vietnam' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  country: string;

  @ApiProperty({ example: 'District 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  region: string;

  @ApiProperty({ example: 10.7769 })
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 106.7009 })
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 'Gan pho di bo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ example: 'Co cho dau xe may' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}

export class LocationMediaInputDto {
  @ApiProperty({ example: 'https://cdn.example.com/location-1.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  url: string;

  @ApiProperty({ enum: LocationMediaType, example: LocationMediaType.IMAGE })
  @IsEnum(LocationMediaType)
  type: LocationMediaType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isLogo?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  displayOrder?: number;
}

export class LocationServiceSelectionDto {
  @ApiPropertyOptional({ example: 'SRV_FREE_WIFI' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  serviceCode?: string;

  @ApiPropertyOptional({ example: 'Thu gom rac' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Thu gom rac moi ngay' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ example: 'FULL' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  unit?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class CreateLocationRequestDto {
  @ApiProperty({ example: 'ROOM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  typeCode: string;

  @ApiProperty({ example: 'Phong tro Quan 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Phong gan trung tam, co gac.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'Lien he truoc 30 phut.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiProperty({ type: () => LocationPricingDto })
  @ValidateNested()
  @Type(() => LocationPricingDto)
  pricing: LocationPricingDto;

  @ApiPropertyOptional({ type: () => LocationAvailabilityDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationAvailabilityDto)
  availability?: LocationAvailabilityDto;

  @ApiProperty({ type: () => LocationPrimaryAddressDto })
  @ValidateNested()
  @Type(() => LocationPrimaryAddressDto)
  primaryAddress: LocationPrimaryAddressDto;

  @ApiPropertyOptional({ type: [LocationServiceSelectionDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => LocationServiceSelectionDto)
  services?: LocationServiceSelectionDto[];

  @ApiPropertyOptional({ type: [LocationMediaInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationMediaInputDto)
  media?: LocationMediaInputDto[];
}

export class UpdateLocationRequestDto {
  @ApiPropertyOptional({ example: 'ROOM' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  typeCode?: string;

  @ApiPropertyOptional({ example: 'Phong tro Quan 1' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Phong gan trung tam, co gac.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'Lien he truoc 30 phut.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiPropertyOptional({ type: () => LocationPricingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationPricingDto)
  pricing?: LocationPricingDto;

  @ApiPropertyOptional({ type: () => LocationAvailabilityDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationAvailabilityDto)
  availability?: LocationAvailabilityDto;

  @ApiPropertyOptional({ type: () => LocationPrimaryAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationPrimaryAddressDto)
  primaryAddress?: LocationPrimaryAddressDto;

  @ApiPropertyOptional({ type: [LocationServiceSelectionDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => LocationServiceSelectionDto)
  services?: LocationServiceSelectionDto[];

  @ApiPropertyOptional({ type: [LocationMediaInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationMediaInputDto)
  media?: LocationMediaInputDto[];
}

export class LocationListQueryDto {
  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm theo vị trí địa lý',
    example: 'q1 phong tro',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: 'ROOM' })
  @IsOptional()
  @IsString()
  typeCode?: string;

  @ApiPropertyOptional({ example: 'Phong tro' })
  @IsOptional()
  @IsString()
  typeName?: string;

  @ApiPropertyOptional({ example: 'Ho Chi Minh City' })
  @IsOptional()
  @IsString()
  addressCity?: string;

  @ApiPropertyOptional({
    example: 'Miền Bắc',
    description: 'Chỉ nhận giá trị chuẩn: Miền Bắc, Miền Trung, Miền Nam.',
  })
  @IsOptional()
  @IsString()
  addressRegion?: string;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minArea?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxArea?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isRented?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 'locationPrice',
    description:
      'Field used for sorting. Supports locationPrice, locationPriceAfterDeal, locationArea, locationRate, locationCode.',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Sort direction. Supports ASC or DESC.',
  })
  @IsOptional()
  @IsString()
  sortOrder?: string;

  @ApiPropertyOptional({
    example: 21.0285,
    description: 'Latitude of the search center for radius search.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ApiPropertyOptional({
    example: 105.8542,
    description: 'Longitude of the search center for radius search.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Search radius in kilometers.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(100)
  radiusKm?: number;
}

export class RelatedLocationsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class LocationTypeSummaryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  typeCode: string;

  @ApiProperty()
  typeName: string;

  @ApiPropertyOptional()
  typeDescription?: string;

  @ApiPropertyOptional()
  typeLogo?: string;

  @ApiPropertyOptional()
  typeBackGround?: string;
}

export class ServiceCatalogItemDto {
  @ApiProperty()
  serviceCode: string;

  @ApiProperty()
  serviceName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiPropertyOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  isFree?: boolean;

  @ApiPropertyOptional()
  basePrice?: number;

  @ApiPropertyOptional()
  unit?: string;

  @ApiPropertyOptional()
  quantity?: number;
}

export class LocationAddressResponseDto {
  @ApiProperty()
  addressCode: string;

  @ApiProperty()
  addressDetail: string;

  @ApiProperty()
  fullAddress: string;

  @ApiProperty()
  ward: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  note?: string;
}

export class LocationMediaResponseItemDto {
  @ApiProperty()
  mediaCode: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ enum: LocationMediaType })
  type: LocationMediaType;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty()
  isLogo: boolean;
}

export class LocationOwnerSummaryDto {
  @ApiProperty()
  userCode: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  avatarUrl?: string | null;

  @ApiPropertyOptional()
  phone?: string | null;

  @ApiPropertyOptional()
  fullAddress?: string | null;

  @ApiPropertyOptional()
  city?: string | null;
}

export class LocationTypeNestedDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  background?: string;
}

export class LocationSummaryResponseDto {
  @ApiProperty()
  locationCode: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  area?: number | null;

  @ApiProperty()
  rating: number;

  @ApiProperty({ type: () => LocationPricingDto })
  pricing: LocationPricingDto;

  @ApiProperty({ type: () => LocationAvailabilityDto })
  availability: LocationAvailabilityDto;

  @ApiProperty({ type: () => LocationTypeNestedDto })
  type: LocationTypeNestedDto;

  @ApiProperty({ type: () => LocationAddressResponseDto, nullable: true })
  primaryAddress: LocationAddressResponseDto | null;

  @ApiProperty({ type: () => LocationOwnerSummaryDto })
  owner: LocationOwnerSummaryDto;

  @ApiPropertyOptional({
    example: 1.42,
    description: 'Distance from search center in kilometers.',
  })
  distanceKm?: number;
}

export class LocationDetailResponseDto extends LocationSummaryResponseDto {
  @ApiProperty({ type: [ServiceCatalogItemDto] })
  services: ServiceCatalogItemDto[];

  @ApiProperty({ type: [LocationAddressResponseDto] })
  addresses: LocationAddressResponseDto[];

  @ApiProperty({ type: [LocationMediaResponseItemDto] })
  media: LocationMediaResponseItemDto[];
}

export class LocationMutationResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: () => LocationDetailResponseDto })
  data: LocationDetailResponseDto;
}

export class PaginatedLocationResponseDto {
  @ApiProperty({ type: [LocationSummaryResponseDto] })
  data: LocationSummaryResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
