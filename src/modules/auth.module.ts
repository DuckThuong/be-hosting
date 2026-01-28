import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../common/jwt/jwt.strategy';
import { AuthController } from '../controllers/auth.controller';
import { TbUserDefault } from '../entities/user/user_default.entity';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { MailModule } from './mail.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([TbUserDefault]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    MailModule,
  ],
  providers: [AuthService, JwtStrategy, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
