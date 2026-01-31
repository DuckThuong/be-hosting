// mail.service.ts
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { MAIL_CONFIG } from '../assests/constants/mail.constant';

import { isEmail } from 'class-validator';
import {
  MailErrorMessage,
  MailSuccessMessage,
} from '../assests/messages/auth.message';
import { OtpHelper } from '../common/helpers/otp.helper';
import {
  OtpData,
  SendEmailDto,
  SendOtpDto,
  SendOtpResponse,
} from '../dtos/auth/mail.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { SendOtpTemplate } from './../templates/mail.template';
import { OtpStorageService } from './otp.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly otpStorage: OtpStorageService,
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {
    this.initializeResend();
  }

  private initializeResend(): void {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new HttpException(
        MailErrorMessage.RESEND_API_KEY_MISSING.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.resend = new Resend(apiKey);
  }

  private async sendEmail(emailData: SendEmailDto): Promise<any> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: emailData.from || MAIL_CONFIG.DEFAULT_FROM,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      });

      if (error) {
        this.logger.error('❌ Resend API trả về lỗi:', {
          errorMessage: error.message,
          errorName: error.name,
          fullError: error,
        });
        throw new HttpException(
          MailErrorMessage.SEND_EMAIL_FAILED.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data;
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new HttpException(
        MailErrorMessage.SEND_EMAIL_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private storeOtp(email: string, otp: string): void {
    const otpData: OtpData = {
      otp,
      expiresAt: OtpHelper.calculateExpiryTime(),
    };

    this.otpStorage.set(email, otpData);
  }

  public async sendOTP(payload: SendOtpDto): Promise<SendOtpResponse> {
    try {
      this.cleanExpiredOTPs();

      if (payload.email === '') {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!isEmail(payload.email)) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const hasExist = await this.authRepository.findByEmail(payload.email);
      if (!hasExist) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_EXIST.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const otp = OtpHelper.generate();

      this.storeOtp(payload.email, otp);

      //fix cứng
      const testEmail = 'trinhthuong26022003@gmail.com';
      await this.sendEmail({
        to: testEmail,
        subject: 'Mã OTP xác thực tài khoản',
        html: SendOtpTemplate(otp),
      });

      this.logger.log(`OTP sent to ${payload.email}`);
      return { message: MailSuccessMessage.OTP_SENT.toString() };
    } catch (error) {
      this.logger.error('Error in sendOTP:', error);
      throw new HttpException(
        MailErrorMessage.SEND_EMAIL_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async resendOTP(payload: SendOtpDto): Promise<SendOtpResponse> {
    try {
      if (payload.email === '') {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!isEmail(payload.email)) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const hasExist = await this.authRepository.findByEmail(payload.email);
      if (!hasExist) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_EXIST.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.otpStorage.delete(payload.email);
      this.cleanExpiredOTPs();
      return await this.sendOTP(payload);
    } catch (error) {
      this.logger.error('Error in resendOTP:', error);
      throw new HttpException(
        MailErrorMessage.SEND_EMAIL_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async verifyOTP(
    email: string,
    otp: string,
  ): Promise<{ access_token: string }> {
    try {
      const stored = this.otpStorage.get(email);

      if (!stored) {
        throw new HttpException(
          MailErrorMessage.OTP_NOT_FOUND.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (OtpHelper.isExpired(stored.expiresAt)) {
        this.otpStorage.delete(email);
        throw new HttpException(
          MailErrorMessage.OTP_EXPIRED.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (stored.otp !== otp) {
        throw new HttpException(
          MailErrorMessage.OTP_INVALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.authRepository.verifyEmail(email);
      this.logger.log(`OTP verified for ${email}`);
      return {
        access_token: this.jwtService.sign({ email: email }),
      };
    } catch (error) {
      this.logger.error('Error in verifyOTP:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        MailErrorMessage.OTP_INVALID.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public cleanExpiredOTPs(): void {
    try {
      const countBefore = this.otpStorage.getAll().size;
      this.otpStorage.cleanExpired();
      const countAfter = this.otpStorage.getAll().size;

      if (countBefore > countAfter) {
        this.logger.log(`Cleaned ${countBefore - countAfter} expired OTPs`);
      }
    } catch (error) {
      this.logger.error('Error cleaning expired OTPs:', error);
    }
  }
}
