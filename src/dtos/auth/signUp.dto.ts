import { ApiProperty } from '@nestjs/swagger';

export class SignUpPayload {
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'User ....',
    required: true,
  })
  userName: string;

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

export class SignUpDtoResponse {
  message: string;
}
