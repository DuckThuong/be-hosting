import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDtoResponse, SignInPayload } from '../dtos/auth/signIn.dto';
import { ErrorLoginMessage } from '../assests/messages/login.message';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public async SignIn(payload: SignInPayload): Promise<SignInDtoResponse> {
    try {
      return {
        access_token: this.jwtService.sign({ email: payload.email }),
      };
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw new HttpException(
        ErrorLoginMessage.LOGIN_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
