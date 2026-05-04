import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole, UserStatus } from '../../assets/enums/user.enum';
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

// Re-export enums from entity layer (source of truth)
export { UserStatus, UserRole };

export class UserProfileInformationDto {
  @ApiProperty({
    description: 'userName',
    example: 'john_doe_2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  userName?: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Nguyễn Văn A',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @ApiProperty({
    description: 'Date of birth',
    example: '1990-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiProperty({
    description: 'User biography',
    example: 'Software developer passionate about web technologies',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+84901234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Full address',
    example: '123 Nguyễn Huệ, Phường Bến Nghé',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullAddress?: string;

  @ApiProperty({
    description: 'Ward/Commune',
    example: 'Phường Bến Nghé',
    required: false,
  })
  @IsOptional()
  @IsString()
  userWard?: string;

  @ApiProperty({
    description: 'District',
    example: 'Quận 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  userDistrict?: string;

  @ApiProperty({
    description: 'City',
    example: 'Thành phố Hồ Chí Minh',
    required: false,
  })
  @IsOptional()
  @IsString()
  userCity?: string;

  @ApiProperty({
    description: 'Province',
    example: 'Hồ Chí Minh',
    required: false,
  })
  @IsOptional()
  @IsString()
  userProvince?: string;

  @ApiProperty({
    description: 'Country',
    example: 'Vietnam',
    required: false,
  })
  @IsOptional()
  @IsString()
  userCountry?: string;

  @ApiProperty({
    description: 'Postal code',
    example: '700000',
    required: false,
  })
  @IsOptional()
  @IsString()
  userPortal?: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: '10.762622',
    required: false,
  })
  @IsOptional()
  @IsString()
  userLat?: string;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: '106.660172',
    required: false,
  })
  @IsOptional()
  @IsString()
  userLong?: string;

  @ApiProperty({
    description: 'User description',
    example: 'Experienced developer with 5+ years in NestJS and TypeScript',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  userDescription?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Prefer communication via email',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  userNote?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'id',
    example: '',
    required: false,
  })
  id?: number;

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
    description: 'avatarUrl',
    example: '',
    required: false,
  })
  avatarUrl?: string;

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
