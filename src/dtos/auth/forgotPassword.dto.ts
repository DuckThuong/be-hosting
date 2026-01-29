import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordPayload {
  @ApiProperty({
    description: 'Email',
    example: '...@gmail.com',
    required: true,
  })
  email: string;
}

export class ForgotPasswordResponse {
  message: string;
}
