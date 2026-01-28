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

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly otpStorage: OtpStorageService,
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
        throw new HttpException(
          MailErrorMessage.SEND_EMAIL_FAILED.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data;
    } catch (error) {
      console.log('Error sending email:', error);
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
      const otp = OtpHelper.generate();

      this.storeOtp(to, otp);

      await this.sendEmail({
        to,
        subject: 'Mã OTP xác thực tài khoản',
        html: SendOtpTemplate(otp),
      });
      return { message: MailSuccessMessage.OTP_SENT.toString() };
    } catch (error) {
      console.log('Error in sendOTP:', error);
      throw new HttpException(
        MailErrorMessage.SEND_EMAIL_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public verifyOTP(email: string, otp: string): boolean {
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
      return true;
    } catch (error) {
      console.log('Error in verifyOTP:', error);
      throw new HttpException(
        MailErrorMessage.OTP_INVALID.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public cleanExpiredOTPs(): void {
    try {
      this.otpStorage.cleanExpired();
    } catch (error) {
      console.log('Error cleaning expired OTPs:', error);
    }
  }
}
