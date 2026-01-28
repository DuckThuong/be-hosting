// mail.service.ts
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { MAIL_CONFIG } from '../assests/constants/mail.constant';
import {
  MailErrorMessage,
  MailSuccessMessage,
} from '../assests/messages/mail.message';
import { OtpHelper } from '../common/helpers/otp.helper';
import { OtpData, SendEmailDto, SendOtpResponse } from '../dtos/auth/mail.dto';
import { SendOtpTemplate } from './../templates/mail.template';
import { OtpStorageService } from './otp.service';
import { AuthRepository } from '../repositories/auth.repository';
import { isEmail } from 'class-validator';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly otpStorage: OtpStorageService,
    private readonly authRepository: AuthRepository,
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

  public async sendOTP(to: string): Promise<SendOtpResponse> {
    try {
      this.cleanExpiredOTPs();

      if (to === '') {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!isEmail(to)) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const hasExist = await this.authRepository.findByEmail(to);
      if (!hasExist) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_EXIST.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const otp = OtpHelper.generate();

      this.storeOtp(to, otp);

      //fix cứng
      const testEmail = 'trinhthuong26022003@gmail.com';
      await this.sendEmail({
        to: testEmail,
        subject: 'Mã OTP xác thực tài khoản',
        html: SendOtpTemplate(otp),
      });

      this.logger.log(`OTP sent to ${to}`);
      return { message: MailSuccessMessage.OTP_SENT.toString() };
    } catch (error) {
      this.logger.error('Error in sendOTP:', error);
      throw new HttpException(
        MailErrorMessage.SEND_EMAIL_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async resendOTP(to: string): Promise<SendOtpResponse> {
    try {
      if (to === '') {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!isEmail(to)) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_VALID.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const hasExist = await this.authRepository.findByEmail(to);
      if (!hasExist) {
        throw new HttpException(
          MailErrorMessage.MAIL_IS_NOT_EXIST.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.otpStorage.delete(to);
      this.cleanExpiredOTPs();
      return await this.sendOTP(to);
    } catch (error) {
      this.logger.error('Error in resendOTP:', error);
      throw new HttpException(
        MailErrorMessage.SEND_EMAIL_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async verifyOTP(email: string, otp: string): Promise<boolean> {
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

      this.otpStorage.delete(email);
      await this.authRepository.verifyEmail(email);
      this.logger.log(`OTP verified for ${email}`);
      return true;
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
