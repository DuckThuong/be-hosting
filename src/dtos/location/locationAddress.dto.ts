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

export class LocationAddressPayloadDto {
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

export class LocationAddressUpdateDto {
  @ApiProperty({
    description: 'Mã địa chỉ',
    example: 'Tòa nhà A - Lầu 3',
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

export class CreateLocationAddressPayloadDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC_abc123',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Dữ liệu địa điểm',
    type: () => LocationAddressPayloadDto,
  })
  data: LocationAddressPayloadDto[];
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
  data?: LocationAddressDto[];
}

export class UpdateLocationAddressPayloadDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC_abc123',
  })
  locationCode: string;

  @ApiProperty({
    description: 'Dữ liệu địa điểm',
    type: () => LocationAddressUpdateDto,
  })
  data: LocationAddressUpdateDto[];
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
  data?: LocationAddressDto[];
}

export class DeleteAllLocationAddressesDto {
  @ApiProperty({
    description: 'Mã địa điểm',
    example: 'LOC_abc123',
  })
  locationCode: string;
}

export class DeleteLocationAddressesDto {
  @ApiProperty({
    description: 'Mã địa chỉ',
    example: 'LOC_abc123',
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
