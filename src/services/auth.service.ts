import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ErrorLoginMessage } from '../assests/messages/login.message';
import { isEmail } from '../common/validators/validator';
import { SignInDtoResponse, SignInPayload } from '../dtos/auth/signIn.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { SignUpDtoResponse, SignUpPayload } from '../dtos/auth/signUp.dto';
import {
  ErrorRegisterMessage,
  SuccessRegisterMessage,
} from '../assests/messages/register.message';
import { ROUND } from '../assests/constants/constants';
import { UserRole, UserStatus } from '../dtos/user/user.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  public async SignIn(payload: SignInPayload): Promise<SignInDtoResponse> {
    try {
      if (
        (!payload.email && payload.email === '') ||
        (!payload.password && payload.password === '')
      ) {
        throw new HttpException(
          ErrorLoginMessage.LOGIN_FAILED.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!isEmail(payload.email)) {
        throw new HttpException(
          ErrorLoginMessage.EMAIL_NOT_VALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.authRepository.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new HttpException(
          ErrorLoginMessage.USER_NOT_FOUND.toString(),
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isValid = await bcrypt.compare(payload.password, user.password);

      if (!isValid) {
        throw new HttpException(
          ErrorLoginMessage.PASSWORD_INCORRECT.toString(),
          HttpStatus.UNAUTHORIZED,
        );
      }

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

  public async SignUp(payload: SignUpPayload): Promise<SignUpDtoResponse> {
    try {
      if (
        (!payload.email && payload.email === '') ||
        (!payload.password && payload.password === '')
      ) {
        throw new HttpException(
          ErrorRegisterMessage.REGISTER_FAILED.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!isEmail(payload.email)) {
        throw new HttpException(
          ErrorRegisterMessage.EMAIL_NOT_VALID.toString(),
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingUser = await this.authRepository.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new HttpException(
          ErrorRegisterMessage.EMAIL_ALREADY_EXISTS.toString(),
          HttpStatus.CONFLICT,
        );
      }

      const hashedPassword = await bcrypt.hash(payload.password, ROUND);

      const newUser = this.authRepository.create({
        username: payload.userName,
        email: payload.email,
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        isEmailVerified: false,
      });

      if (!newUser) {
        throw new HttpException(
          ErrorRegisterMessage.REGISTER_FAILED.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        await this.authRepository.save(newUser);
        return { message: SuccessRegisterMessage.REGISTER_SUCCESS.toString() };
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw new HttpException(
        ErrorRegisterMessage.REGISTER_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
