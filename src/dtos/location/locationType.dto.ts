import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationTypePayloadDto {
  @ApiProperty({
    description: 'name',
    example: '......',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'description',
    example: '......',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'logo',
    example: '......',
    required: true,
  })
  logo: string;

  @ApiProperty({
    description: 'backgroundUrl',
    example: '......',
    required: true,
  })
  backgroundUrl: string;
}

export class UpdateLocationTypePayloadDto {
  @ApiProperty({
    description: 'id',
    example: '......',
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'name',
    example: '......',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'description',
    example: '......',
    required: true,
  })
  description: string;

  @ApiProperty({
    description: 'logo',
    example: '......',
    required: true,
  })
  logo: string;

  @ApiProperty({
    description: 'backgroundUrl',
    example: '......',
    required: true,
  })
  backgroundUrl: string;
}

export class CreateLocationTypeResponseDto {
  message: string;
  data: LocationTypeDto;
}

export class UpdateLocationTypeResponseDto {
  message: string;
  data: LocationTypeDto;
}

export class LocationTypeDto {
  id: string;
  typeCode: string;
  typeName: string;
  typeDescription: string;
  typeLogo: string;
  typeBackGround: string;
}
