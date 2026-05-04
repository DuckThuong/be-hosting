import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiPropertyOptional({
    description: 'Service code',
    example: 'SRV_FREE_WIFI',
  })
  code?: string;

  @ApiProperty({
    description: 'Service name',
    example: 'Wifi mien phi',
    required: true,
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Service category',
    example: 'GENERAL',
  })
  category?: string;
}

export class UpdateServiceDto {
  @ApiProperty({
    description: 'Service id',
    example: 1,
    required: true,
  })
  id: number;

  @ApiPropertyOptional({
    description: 'Service code',
    example: 'SRV_FREE_WIFI',
  })
  code?: string;

  @ApiPropertyOptional({
    description: 'Service name',
    example: 'Wifi mien phi',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Service category',
    example: 'GENERAL',
  })
  category?: string;
}

export class CreateServiceResponseDto {
  message: string;
  data: ServiceDto;
}

export class UpdateServiceResponseDto {
  message: string;
  data: ServiceDto;
}

export class ServiceDto {
  id: number;
  code: string;
  name: string;
  category: string;
}
