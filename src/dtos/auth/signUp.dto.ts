import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpPayload {
  @ApiProperty({
    description: 'Họ và tên',
    example: 'User ....',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu người dùng',
    example: 'P@ssw0rd!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0912345678',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '2000-01-01',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;
}

export class SignUpDtoResponse {
  message: string;
}
