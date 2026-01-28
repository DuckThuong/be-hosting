import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SendOtpDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}

export class VerifyOtpDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

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
