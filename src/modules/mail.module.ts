import { Module } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { ConfigModule } from '@nestjs/config';
import { OtpStorageModule } from './otp.module';
import { AuthRepository } from '../repositories/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUserDefault } from '../entities/user/user_default.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([TbUserDefault]),
    ConfigModule,
    OtpStorageModule,
  ],
  providers: [MailService, AuthRepository],
  exports: [MailService],
})
export class MailModule {}
