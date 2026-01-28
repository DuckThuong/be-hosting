import { Injectable, Logger } from '@nestjs/common';
import { OtpData } from '../dtos/auth/mail.dto';

@Injectable()
export class OtpStorageService {
  private readonly logger = new Logger(OtpStorageService.name);
  private storage: Map<string, OtpData> = new Map();

  set(email: string, otpData: OtpData): void {
    this.storage.set(email, otpData);
  }

  get(email: string): OtpData | undefined {
    return this.storage.get(email);
  }

  delete(email: string): boolean {
    return this.storage.delete(email);
  }

  cleanExpired(): void {
    const now = Date.now();
    for (const [email, data] of this.storage.entries()) {
      if (now > data.expiresAt) {
        this.storage.delete(email);
        this.logger.log(`Cleaned expired OTP for ${email}`);
      }
    }
  }

  getAll(): Map<string, OtpData> {
    return this.storage;
  }
}
