import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationServicePayloadDto {
  @ApiProperty({
    description: 'Code',
    example: '......',
    required: true,
  })
  code: string;

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

export class CreateLocationServiceResponseDto {
  message: string;
  data: LocationServiceDto;
}

export class LocationServiceDto {
  id: string;
  typeCode: string;
  typeName: string;
  typeDescription: string;
  typeLogo: string;
  typeBackGround: string;
}
