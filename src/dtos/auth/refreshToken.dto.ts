import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenPayload {
  @ApiProperty({
    description: 'Refresh token nhận được khi đăng nhập với rememberMe=true',
    required: true,
  })
  refresh_token: string;
}

export class RefreshTokenResponse {
  message: string;
  access_token: string;
}
