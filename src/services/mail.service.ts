import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendOtpTemplate } from './../templates/mail.template';

export interface SendEmailDto {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly defaultFrom: string;
  private otpStorage: Map<string, { otp: string; expiresAt: number }> =
    new Map();

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not defined');
    }

    this.resend = new Resend(apiKey);
    this.defaultFrom = 'Your App <onboarding@resend.dev>';
  }

  private async sendEmail(emailData: SendEmailDto) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: emailData.from || this.defaultFrom,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      });

      if (error) {
        this.logger.error('Error sending email:', error);
        throw new Error(error.message);
      }

      this.logger.log(`Email sent successfully to ${emailData.to}`);
      return data;
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }

  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  public async sendOTP(to: string) {
    const otp = this.generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.otpStorage.set(to, { otp, expiresAt });

    await this.sendEmail({
      to,
      subject: 'Mã OTP xác thực tài khoản',
      html: SendOtpTemplate(otp),
    });

    this.logger.log(`OTP sent to ${to}, expires in 5 minutes`);
    return { message: 'OTP đã được gửi đến email của bạn' };
  }

  public async verifyOTP(email: string, otp: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const stored = this.otpStorage.get(email);

      if (!stored) {
        reject(new BadRequestException('OTP không tồn tại hoặc đã hết hạn'));
        return;
      }

      if (Date.now() > stored.expiresAt) {
        this.otpStorage.delete(email);
        reject(new BadRequestException('OTP đã hết hạn'));
        return;
      }

      if (stored.otp !== otp) {
        reject(new BadRequestException('OTP không chính xác'));
        return;
      }

      this.otpStorage.delete(email);
      this.logger.log(`OTP verified successfully for ${email}`);
      resolve(true);
    });
  }

  cleanExpiredOTPs() {
    const now = Date.now();
    for (const [email, data] of this.otpStorage.entries()) {
      if (now > data.expiresAt) {
        this.otpStorage.delete(email);
        this.logger.log(`Cleaned expired OTP for ${email}`);
      }
    }
  }
}
