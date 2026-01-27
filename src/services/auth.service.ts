import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // public async login(user: any) {
  //   const payload = { email: user.email, sub: user.id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  // private async generateToken(user: JwtPayload): Promise<string> {
  //   return this.jwtService.signAsync({ email: user.email, sub: user.id });
  // }
}
