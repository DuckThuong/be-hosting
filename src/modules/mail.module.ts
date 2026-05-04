import { Module } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OtpStorageModule } from './otp.module';
import { AuthRepository } from '../repositories/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { TbUserProfile } from '../entities/user/user_profile.entity';
import { JwtStrategy } from '../common/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TbUserDefault, TbUserProfile]),
    ConfigModule,
    OtpStorageModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  providers: [MailService, AuthRepository, JwtStrategy],
  exports: [MailService],
})
export class MailModule {}
