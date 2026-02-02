import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─── Create ──────────────────────────────────────────────────────────────────
export class LocationAddressDto {
  @ApiProperty({
    description: 'ID tự tăng',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC_abc123',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Mã địa chỉ',
    example: 'ADR_abc123',
  })
  addressCode: string;

  @ApiProperty({
    description: 'Tên địa chỉ',
    example: 'Tòa nhà A - Lầu 3',
  })
  addressName: string;

  @ApiProperty({
    description: 'Địa chỉ chi tiết',
    example: '123 Nguyễn Huệ, P. Bến Nghé',
  })
  fullAddress: string;

  @ApiProperty({
    description: 'Phường / Xã',
    example: 'Phường Bến Nghé',
  })
  addressWard: string;

  @ApiProperty({
    description: 'Quận / Huyện',
    example: 'Quận 1',
  })
  addressDistrict: string;

  @ApiProperty({
    description: 'Thành phố',
    example: 'Ho Chi Minh City',
  })
  addressCity: string;

  @ApiProperty({
    description: 'Tỉnh',
    example: 'Thành phố Hồ Chí Minh',
  })
  addressProvince: string;

  @ApiProperty({
    description: 'Quốc gia',
    example: 'Vietnam',
  })
  addressCountry: string;

  @ApiProperty({
    description: 'Mã bưu chính',
    example: '700000',
  })
  addRessPortal: string;

  @ApiProperty({
    description: 'Vĩ độ',
    example: '10.7769',
  })
  addressLat: string;

  @ApiProperty({
    description: 'Kinh độ',
    example: '106.7009',
  })
  addressLong: string;

  @ApiProperty({
    description: 'Vùng',
    example: 'Miền Nam',
  })
  addressRegion: string;

  @ApiProperty({
    description: 'Trạng thái',
    example: 'ACTIVE',
  })
  addressStatus: string;

  @ApiProperty({
    description: 'Mô tả',
    example: 'Địa chỉ chính của tòa nhà',
  })
  addressDescription: string;

  @ApiProperty({
    description: 'Ghi chú',
    example: 'Lên lầu 3, phòng 301',
  })
  addressNote: string;

  @ApiProperty({
    description: 'Phân loại',
    example: 'OFFICE',
  })
  addressType: string;
}

export class CreateLocationAddressPayloadDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC_abc123',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Tên địa chỉ',
    example: 'Tòa nhà A - Lầu 3',
  })
  addressName: string;

  @ApiProperty({
    description: 'Địa chỉ chi tiết',
    example: '123 Nguyễn Huệ, P. Bến Nghé',
  })
  fullAddress: string;

  @ApiProperty({
    description: 'Phường / Xã',
    example: 'Phường Bến Nghé',
  })
  addressWard: string;

  @ApiProperty({
    description: 'Quận / Huyện',
    example: 'Quận 1',
  })
  addressDistrict: string;

  @ApiProperty({
    description: 'Thành phố',
    example: 'Ho Chi Minh City',
  })
  addressCity: string;

  @ApiProperty({
    description: 'Tỉnh',
    example: 'Thành phố Hồ Chí Minh',
  })
  addressProvince: string;

  @ApiProperty({
    description: 'Quốc gia',
    example: 'Vietnam',
  })
  addressCountry: string;

  @ApiProperty({
    description: 'Mã bưu chính',
    example: '700000',
  })
  addRessPortal: string;

  @ApiProperty({
    description: 'Vĩ độ',
    example: '10.7769',
  })
  addressLat: string;

  @ApiProperty({
    description: 'Kinh độ',
    example: '106.7009',
  })
  addressLong: string;

  @ApiProperty({
    description: 'Vùng',
    example: 'Miền Nam',
  })
  addressRegion: string;

  @ApiProperty({
    description: 'Trạng thái',
    example: 'ACTIVE',
  })
  addressStatus: string;

  @ApiPropertyOptional({
    description: 'Mô tả',
    example: 'Địa chỉ chính của tòa nhà',
  })
  addressDescription?: string;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Lên lầu 3, phòng 301',
  })
  addressNote?: string;

  @ApiProperty({
    description: 'Phân loại',
    example: 'OFFICE',
  })
  addressType: string;
}

export class CreateLocationAddressResponseDto {
  @ApiProperty({
    description: 'Thông điệp kết quả',
    example: 'Tạo địa chỉ thành công.',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Dữ liệu địa chỉ vừa tạo',
    type: () => LocationAddressDto,
  })
  data?: LocationAddressDto;
}

export class UpdateLocationAddressPayloadDto {
  @ApiProperty({
    description: 'Mã địa chỉ cần cập nhật',
    example: 'ADR_abc123',
  })
  addressCode: string;

  @ApiPropertyOptional({
    description: 'Tên địa chỉ',
    example: 'Tòa nhà A - Lầu 5',
  })
  addressName?: string;

  @ApiPropertyOptional({
    description: 'Địa chỉ chi tiết',
    example: '456 Lê Lợi, P. Bến Hoa',
  })
  fullAddress?: string;

  @ApiPropertyOptional({
    description: 'Phường / Xã',
    example: 'Phường Bến Hoa',
  })
  addressWard?: string;

  @ApiPropertyOptional({
    description: 'Quận / Huyện',
    example: 'Quận 2',
  })
  addressDistrict?: string;

  @ApiPropertyOptional({
    description: 'Thành phố',
    example: 'Ho Chi Minh City',
  })
  addressCity?: string;

  @ApiPropertyOptional({
    description: 'Tỉnh',
    example: 'Thành phố Hồ Chí Minh',
  })
  addressProvince?: string;

  @ApiPropertyOptional({
    description: 'Quốc gia',
    example: 'Vietnam',
  })
  addressCountry?: string;

  @ApiPropertyOptional({
    description: 'Mã bưu chính',
    example: '700200',
  })
  addRessPortal?: string;

  @ApiPropertyOptional({
    description: 'Vĩ độ',
    example: '10.7800',
  })
  addressLat?: string;

  @ApiPropertyOptional({
    description: 'Kinh độ',
    example: '106.7050',
  })
  addressLong?: string;

  @ApiPropertyOptional({
    description: 'Vùng',
    example: 'Miền Nam',
  })
  addressRegion?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái',
    example: 'INACTIVE',
  })
  addressStatus?: string;

  @ApiPropertyOptional({
    description: 'Mô tả',
    example: 'Đã di dời sang tòa nhà mới',
  })
  addressDescription?: string;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Cập nhật ngày 2024-01-15',
  })
  addressNote?: string;

  @ApiPropertyOptional({
    description: 'Phân loại',
    example: 'WAREHOUSE',
  })
  addressType?: string;
}

export class UpdateLocationAddressResponseDto {
  @ApiProperty({
    description: 'Thông điệp kết quả',
    example: 'Cập nhật địa chỉ thành công.',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Dữ liệu địa chỉ sau khi cập nhật',
    type: () => LocationAddressDto,
  })
  data?: LocationAddressDto;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export class DeleteLocationAddressPayloadDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC_abc123',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Mã địa chỉ cần xóa',
    example: 'ADR_abc123',
  })
  addressCode: string;
}

export class DeleteLocationAddressResponseDto {
  @ApiProperty({
    description: 'Thông điệp kết quả',
    example: 'Xóa địa chỉ thành công.',
  })
  message: string;

  @ApiProperty({
    description: 'Kết quả xóa',
    example: { deleted: true },
  })
  data: { deleted: boolean };
}

// ─── Response DTO ────────────────────────────────────────────────────────────
