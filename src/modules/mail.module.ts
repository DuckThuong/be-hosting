import { Module } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { ConfigModule } from '@nestjs/config';
import { OtpStorageModule } from './otp.module';

@Module({
  imports: [ConfigModule, OtpStorageModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
