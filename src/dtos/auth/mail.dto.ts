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
