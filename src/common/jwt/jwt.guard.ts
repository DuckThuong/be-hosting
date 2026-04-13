import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.log('===== JWT AUTH GUARD (PUBLIC ROUTE) =====');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    this.logger.log('===== JWT AUTH GUARD =====');
    this.logger.log(
      `Authorization Header: ${request.headers.authorization ?? 'None'}`,
    );
    this.logger.log(`Request URL: ${request.url}`);
    this.logger.log(`Request Method: ${request.method}`);

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    this.logger.log('===== HANDLE REQUEST =====');
    this.logger.error('Error: ' + (err ? JSON.stringify(err) : 'None'));
    this.logger.log('User: ' + JSON.stringify(user));
    this.logger.warn('Info: ' + JSON.stringify(info));

    if (err || !user) {
      this.logger.error('Authentication failed!');
      throw err ?? new UnauthorizedException('Authentication failed');
    }

    this.logger.log('✅ Authentication successful!');
    return user as TUser;
  }
}
