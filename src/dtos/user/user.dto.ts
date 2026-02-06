import { ApiProperty } from '@nestjs/swagger';

export class UserDecoratorDtoResponse {
  id: number;
  userCode: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  fullName?: string;
  dateOfBirth?: Date;
  status: UserStatus;
  role: UserRole;
  isEmailVerified: boolean;
}

export enum UserStatus {
  ACTIVE = 0,
  INACTIVE = 1,
  BLOCKED = 2,
}

export enum UserRole {
  ADMIN = 0,
  USER = 1,
  CUSTOMER = 2,
}

export class UserProfileInformationDto {
  @ApiProperty({
    description: 'userName',
    example: '',
    required: false,
  })
  userName?: string;

  @ApiProperty({
    description: 'fullName',
    example: '',
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    description: 'dateOfBirth',
    example: '',
    required: false,
  })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'avartar',
    example: '',
    required: false,
  })
  avartar?: string;

  @ApiProperty({
    description: 'coverUrl',
    example: '',
    required: false,
  })
  coverUrl?: string;

  @ApiProperty({
    description: 'bio',
    example: '',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'phone',
    example: '',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'fullAddress',
    example: '',
    required: false,
  })
  fullAddress?: string;

  @ApiProperty({
    description: 'userWard',
    example: '',
    required: false,
  })
  userWard?: string;

  @ApiProperty({
    description: 'userDistrict',
    example: '',
    required: false,
  })
  userDistrict?: string;

  @ApiProperty({
    description: 'userCity',
    example: '',
    required: false,
  })
  userCity?: string;

  @ApiProperty({
    description: 'userProvince',
    example: '',
    required: false,
  })
  userProvince?: string;

  @ApiProperty({
    description: 'userCountry',
    example: '',
    required: false,
  })
  userCountry?: string;

  @ApiProperty({
    description: 'userPortal',
    example: '',
    required: false,
  })
  userPortal?: string;

  @ApiProperty({
    description: 'userLat',
    example: '',
    required: false,
  })
  userLat?: string;

  @ApiProperty({
    description: 'userLong',
    example: '',
    required: false,
  })
  userLong?: string;

  @ApiProperty({
    description: 'userDescription',
    example: '',
    required: false,
  })
  userDescription?: string;

  @ApiProperty({
    description: 'userNote',
    example: '',
    required: false,
  })
  userNote?: string;
}

export class UpdateUserProfileInformationPayload {
  @ApiProperty({
    description: 'userCode',
    example: '',
    required: false,
  })
  userCode?: string;

  @ApiProperty({
    description: 'Danh sách cơ sở của địa điểm',
    type: [UserProfileInformationDto],
    required: false,
  })
  data?: UserProfileInformationDto;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'userName',
    example: '',
    required: false,
  })
  userName?: string;

  @ApiProperty({
    description: 'userEmail',
    example: '',
    required: false,
  })
  userEmail?: string;

  @ApiProperty({
    description: 'fullName',
    example: '',
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    description: 'dateOfBirth',
    example: '',
    required: false,
  })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'avartar',
    example: '',
    required: false,
  })
  avartar?: string;

  @ApiProperty({
    description: 'coverUrl',
    example: '',
    required: false,
  })
  coverUrl?: string;

  @ApiProperty({
    description: 'bio',
    example: '',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'phone',
    example: '',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'fullAddress',
    example: '',
    required: false,
  })
  fullAddress?: string;

  @ApiProperty({
    description: 'userWard',
    example: '',
    required: false,
  })
  userWard?: string;

  @ApiProperty({
    description: 'userDistrict',
    example: '',
    required: false,
  })
  userDistrict?: string;

  @ApiProperty({
    description: 'userCity',
    example: '',
    required: false,
  })
  userCity?: string;

  @ApiProperty({
    description: 'userProvince',
    example: '',
    required: false,
  })
  userProvince?: string;

  @ApiProperty({
    description: 'userCountry',
    example: '',
    required: false,
  })
  userCountry?: string;

  @ApiProperty({
    description: 'userPortal',
    example: '',
    required: false,
  })
  userPortal?: string;

  @ApiProperty({
    description: 'userLat',
    example: '',
    required: false,
  })
  userLat?: string;

  @ApiProperty({
    description: 'userLong',
    example: '',
    required: false,
  })
  userLong?: string;

  @ApiProperty({
    description: 'userDescription',
    example: '',
    required: false,
  })
  userDescription?: string;

  @ApiProperty({
    description: 'userNote',
    example: '',
    required: false,
  })
  userNote?: string;
}
