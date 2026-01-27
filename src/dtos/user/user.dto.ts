import { ApiProperty } from '@nestjs/swagger';

export class GetUserByUserCdDtoParam {
  @ApiProperty({
    description: 'Mã người dùng',
    example: 'U1234567890',
    required: true,
  })
  userCd: string;
}

export class GetUserByUserInfoDtoParam {
  @ApiProperty({
    description: 'Mã người dùng',
    example: 'U1234567890',
    required: false,
  })
  userCd: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'john.doe@example.com',
    required: false,
  })
  userEmail: string;

  @ApiProperty({
    description: 'Số điện thoại người dùng',
    example: '1234567890',
    required: false,
  })
  userPhone: string;

  @ApiProperty({
    description: 'Địa chỉ người dùng',
    example: '1234567890',
    required: false,
  })
  userAddress: string;

  @ApiProperty({
    description: 'Thành phố người dùng',
    example: 'Hà Nội',
    required: false,
  })
  userCity: string;

  @ApiProperty({
    description: 'Quốc gia người dùng',
    example: 'Việt Nam',
    required: false,
  })
  userCountry: string;
}

export class UserDecoratorDtoResponse {
  @ApiProperty({
    description: 'Ảnh đại diện người dùng',
    example: 'https://example.com/avatar.jpg',
    required: true,
  })
  userAvatar: string;

  @ApiProperty({
    description: 'Mã người dùng',
    example: 'U1234567890',
    required: true,
  })
  userCd: string;
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'John Doe',
    required: true,
  })
  userName: string;

  @ApiProperty({
    description: 'Tên đầy đủ người dùng',
    example: 'John Doe',
    required: true,
  })
  userFullName: string;

  @ApiProperty({
    description: 'Giới tính người dùng',
    example: '1',
    required: true,
  })
  userGender: number;

  @ApiProperty({
    description: 'Ngày sinh người dùng',
    example: '2000-01-01',
    required: true,
  })
  userDob: Date;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'john.doe@example.com',
    required: true,
  })
  userEmail: string;
  @ApiProperty({
    description: 'Số điện thoại người dùng',
    example: '1234567890',
    required: true,
  })
  userPhone: string;

  @ApiProperty({
    description: 'Địa chỉ người dùng',
    example: '1234567890',
    required: true,
  })
  userAddress: string;
  @ApiProperty({
    description: 'Thành phố người dùng',
    example: 'Hà Nội',
    required: true,
  })
  userCity: string;
  @ApiProperty({
    description: 'Quốc gia người dùng',
    example: 'Việt Nam',
    required: true,
  })
  userCountry: string;

  @ApiProperty({
    description: 'Công việc người dùng',
    example: 'Developer',
    required: true,
  })
  userJob: string;

  @ApiProperty({
    description: 'Bio người dùng',
    example: 'I am a developer',
    required: true,
  })
  userBio: string;

  @ApiProperty({
    description: 'Quyền người dùng',
    example: 1,
    required: true,
  })
  userRole: number;
}

// New

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
