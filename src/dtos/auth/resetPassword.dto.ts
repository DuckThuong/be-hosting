import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordPayload {
  @ApiProperty({
    description: 'Mật khẩu cũ',
    example: 'P@ssw0rd!',
    required: true,
  })
  oldPassword: string;

  @ApiProperty({
    description: 'Mật khẩu mới',
    example: 'P@ssw0rd!',
    required: true,
  })
  newPassword: string;
}

export class ResetPasswordResponse {
  message: string;
}
