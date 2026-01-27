import { ApiProperty } from '@nestjs/swagger';

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
}

export class SignInDtoResponse {
  access_token: string;
}
