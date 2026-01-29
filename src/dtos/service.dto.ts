import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'serviceCode',
    example: '......',
    required: true,
  })
  serviceCode: string;

  @ApiProperty({
    description: 'serviceName',
    example: '......',
    required: true,
  })
  serviceName: string;

  @ApiProperty({
    description: 'serviceDescription',
    example: '......',
    required: true,
  })
  serviceDescription: string;

  @ApiProperty({
    description: 'serviceLogo',
    example: '......',
    required: true,
  })
  serviceLogo: string;

  @ApiProperty({
    description: 'serviceBackGround',
    example: '......',
    required: true,
  })
  serviceBackGround: string;

  @ApiProperty({
    description: 'servicePrice',
    example: '......',
    required: true,
  })
  servicePrice: number;

  @ApiProperty({
    description: 'serviceDiscount',
    example: '......',
    required: true,
  })
  serviceDiscount: number;
}

export class CreateServiceResponseDto {
  message: string;
  data: ServiceDto;
}

export class ServiceDto {
  id: number;
  serviceCode: string;
  serviceName: string;
  serviceDescription: string;
  serviceLogo: string;
  serviceBackGround: string;
  servicePrice: number;
  serviceDiscount: number;
}
