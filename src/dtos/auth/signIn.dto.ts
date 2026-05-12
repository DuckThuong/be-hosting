import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignInPayload {
  @ApiProperty({
    description: 'Email người dùng',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu người dùng',
    example: 'P@ssw0rd!',
    required: true,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Ghi nhớ đăng nhập — nếu true sẽ cấp thêm refresh token dài hạn',
    example: false,
  })
  rememberMe?: boolean;
}

export class SignInDtoResponse {
  message: string;
  access_token: string;
  refresh_token?: string;
}
