import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from '../dtos/auth/forgotPassword.dto';
import { SendOtpDto, VerifyOtpDto } from '../dtos/auth/mail.dto';
import {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from '../dtos/auth/resetPassword.dto';
import { SignInDtoResponse } from '../dtos/auth/signIn.dto';
import { SignUpDtoResponse, SignUpPayload } from '../dtos/auth/signUp.dto';
import { UserDecoratorDtoResponse } from '../dtos/user/user.dto';
import { AuthService } from '../services/auth.service';
import { MailService } from '../services/mail.service';
import { User } from '../user.decorator';

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

  @ApiOperation({ summary: 'User Forgot Password' })
  @Post('forgot-password')
  public async forgotPassword(
    @Body() payload: ForgotPasswordPayload,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.ForgotPassword(payload);
  }

  @ApiOperation({ summary: 'User Forgot Password' })
  @Put('reset-password')
  public async resetPassword(
    @Body() payload: ResetPasswordPayload,
    @User() user: UserDecoratorDtoResponse,
  ): Promise<ResetPasswordResponse> {
    return this.authService.ResetPassword(payload, user);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to Email' })
  @HttpCode(HttpStatus.OK)
  public async sendOTP(@Body() dto: SendOtpDto) {
    return await this.mailService.sendOTP(dto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP to Email' })
  @HttpCode(HttpStatus.OK)
  public async resendOtp(@Body() dto: SendOtpDto) {
    return await this.mailService.resendOTP(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP from Email' })
  @HttpCode(HttpStatus.OK)
  public verifyOTP(@Body() dto: VerifyOtpDto) {
    const isValid = this.mailService.verifyOTP(dto.email, dto.otp);
    return { success: isValid, message: 'OTP xác thực thành công' };
  }
}
