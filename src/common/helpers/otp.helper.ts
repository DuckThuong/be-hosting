import { MAIL_CONFIG } from './../../assests/constants/mail.constant';

export class OtpHelper {
  static generate(): string {
    const { OTP_MIN_VALUE, OTP_MAX_VALUE } = MAIL_CONFIG;

    return Math.floor(
      OTP_MIN_VALUE + Math.random() * (OTP_MAX_VALUE - OTP_MIN_VALUE + 1),
    ).toString();
  }

  static calculateExpiryTime(): number {
    return Date.now() + MAIL_CONFIG.OTP_EXPIRY_MINUTES * 60 * 1000;
  }

  static isExpired(expiresAt: number): boolean {
    return Date.now() > expiresAt;
  }
}
