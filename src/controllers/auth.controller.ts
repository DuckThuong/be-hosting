import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SignInDtoResponse } from '../dtos/auth/signIn.dto';
import { SignUpDtoResponse, SignUpPayload } from '../dtos/auth/signUp.dto';
import { AuthService } from '../services/auth.service';
import { MailService } from '../services/mail.service';
import { SendOtpDto, VerifyOtpDto } from '../dtos/auth/mail.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'User Sign Up' })
  @Post('signup')
  public async signUp(
    @Body() payload: SignUpPayload,
  ): Promise<SignUpDtoResponse> {
    return this.authService.SignUp(payload);
  }

  @ApiOperation({ summary: 'User Sign In' })
  @Post('signin')
  public async signIn(
    @Body() payload: SignUpPayload,
  ): Promise<SignInDtoResponse> {
    return this.authService.SignIn(payload);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to Email' })
  @HttpCode(HttpStatus.OK)
  public async sendOTP(@Body() dto: SendOtpDto) {
    return await this.mailService.sendOTP(dto.email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP from Email' })
  @HttpCode(HttpStatus.OK)
  public verifyOTP(@Body() dto: VerifyOtpDto) {
    const isValid = this.mailService.verifyOTP(dto.email, dto.otp);
    return { success: isValid, message: 'OTP xác thực thành công' };
  }
}
