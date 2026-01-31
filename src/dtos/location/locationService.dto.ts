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
    description: 'isActive',
    example: '......',
    required: true,
  })
  isActive: boolean;
  @ApiProperty({
    description: 'note',
    example: '......',
    required: false,
  })
  note?: string;
}

export class LocationServiceResponse {
  message: string;
}
