import { ApiProperty } from '@nestjs/swagger';

export class CommonMetadataOptionDto {
  @ApiProperty({ example: 'ROOM' })
  key: string;

  @ApiProperty({ example: 'Phòng trọ' })
  label: string;

  @ApiProperty({ example: 'ROOM' })
  value: string | number;

  @ApiProperty({ example: false })
  isDefault: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 0, required: false, nullable: true })
  minValue?: number | null;

  @ApiProperty({ example: 300, required: false, nullable: true })
  maxValue?: number | null;

  @ApiProperty({ example: 'price', required: false })
  field?: string;

  @ApiProperty({ example: 'asc', required: false })
  direction?: string;
}

export class LocationFilterDefaultsDto {
  @ApiProperty({ example: [] })
  selectedTypeCodes: string[];

  @ApiProperty({ example: [] })
  selectedServiceCodes: string[];

  @ApiProperty({ example: null, nullable: true })
  rentStatus: number | null;

  @ApiProperty({ example: 'newest' })
  sortBy: string;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}

export class UploadMetadataDto {
  @ApiProperty({ type: [CommonMetadataOptionDto] })
  resourceTypes: CommonMetadataOptionDto[];
}

export class CommonMetadataListResponseDto {
  @ApiProperty({ example: 'Lấy danh sách metadata thành công.' })
  message: string;

  @ApiProperty({ type: [CommonMetadataOptionDto] })
  data: CommonMetadataOptionDto[];
}

export class NumericMetadataListResponseDto {
  @ApiProperty({ example: 'Lấy metadata khoảng giá thành công.' })
  message: string;

  @ApiProperty({ type: [Number], example: [0, 25, 50, 75, 100] })
  data: number[];
}

export class LocationFilterDefaultsResponseDto {
  @ApiProperty({ example: 'Lấy cấu hình mặc định bộ lọc địa điểm thành công.' })
  message: string;

  @ApiProperty({ type: () => LocationFilterDefaultsDto })
  data: LocationFilterDefaultsDto;
}

export class UploadMetadataResponseDto {
  @ApiProperty({ example: 'Lấy metadata upload thành công.' })
  message: string;

  @ApiProperty({ type: () => UploadMetadataDto })
  data: UploadMetadataDto;
}
