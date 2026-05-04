import { ApiProperty } from '@nestjs/swagger';

export class AddLocationServicePayload {
  @ApiProperty({
    description: 'locationCode',
    example: '......',
    required: true,
  })
  locationCode: string;

  @ApiProperty({
    description: 'data',
    example: '......',
    required: true,
    type: () => LocationServiceData,
  })
  data: LocationServiceData[];
}

export class LocationServiceData {
  @ApiProperty({
    description: 'serviceCode',
    example: '......',
    required: true,
  })
  serviceCode: string;

  @ApiProperty({
    description: 'description',
    example: 'Wifi toc do cao',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'isFree',
    example: true,
    required: false,
  })
  isFree?: boolean;

  @ApiProperty({
    description: 'basePrice',
    example: 0,
    required: false,
  })
  basePrice?: number;

  @ApiProperty({
    description: 'unit',
    example: 'FULL',
    required: false,
  })
  unit?: string;

  @ApiProperty({
    description: 'quantity',
    example: 1,
    required: false,
  })
  quantity?: number;

  @ApiProperty({
    description: 'isActive',
    example: true,
    required: false,
  })
  isActive?: boolean;
}

export class LocationServiceResponse {
  message: string;
}
