import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../dtos/jwt/jwt.dto';
import { UserDecoratorDtoResponse } from '../../dtos/user/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): UserDecoratorDtoResponse {
    return {
      id: payload.sub,
      userCode: payload.userCode,
      username: payload.username,
      email: payload.email,
      password: '',
      fullName: payload.fullName,
      dateOfBirth: payload.dateOfBirth,
      status: payload.status,
      role: payload.role,
      isEmailVerified: payload.isEmailVerified,
    };
  }
}
