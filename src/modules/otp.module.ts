import { Module } from '@nestjs/common';
import { OtpStorageService } from '../services/otp.service';

@Module({
  providers: [OtpStorageService],
  exports: [OtpStorageService],
})
export class OtpStorageModule {}
