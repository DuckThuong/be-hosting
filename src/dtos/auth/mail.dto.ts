import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'Email nhận OTP',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Email nhận OTP',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @ApiProperty({
    description: 'Mã OTP gồm 4 chữ số',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty({ message: 'OTP không được để trống' })
  @Length(4, 4, { message: 'OTP phải có 4 số' })
  otp: string;
}

export interface SendEmailDto {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface OtpData {
  otp: string;
  expiresAt: number;
}

export interface OtpVerificationResult {
  isValid: boolean;
  error?: string;
}

export interface SendOtpResponse {
  message: string;
}
