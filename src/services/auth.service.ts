import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ROUND } from '../assests/constants/constants';
import { isEmail } from '../common/validators/validator';
import { SignInDtoResponse, SignInPayload } from '../dtos/auth/signIn.dto';
import { SignUpDtoResponse, SignUpPayload } from '../dtos/auth/signUp.dto';
import {
  UserDecoratorDtoResponse,
  UserRole,
  UserStatus,
} from '../dtos/user/user.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { MailService } from './mail.service';
import {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from '../dtos/auth/resetPassword.dto';
import {
  ErrorForgotPasswordMessage,
  ErrorLoginMessage,
  ErrorRegisterMessage,
  ErrorResetPasswordMessage,
  SuccessForgotPasswordMessage,
  SuccessRegisterMessage,
  SuccessResetPasswordMessage,
} from '../assests/messages/auth.message';
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from '../dtos/auth/forgotPassword.dto';
import { SendOtpDto } from '../dtos/auth/mail.dto';
import { randomString } from '../common/helpers/common.helper';
import { JwtPayload } from '../dtos/jwt/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private mailService: MailService,
  ) {}

  public async SignIn(payload: SignInPayload): Promise<SignInDtoResponse> {
    if (!payload.email || payload.email.trim() === '') {
      throw new HttpException(
        ErrorLoginMessage.LOGIN_FAILED.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.password || payload.password.trim() === '') {
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

    const user = await this.authRepository.findByEmail(payload.email);

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

    if (!user.isEmailVerified) {
      const otpPayload: SendOtpDto = {
        email: user.email,
      };
      await this.mailService.sendOTP(otpPayload);
      throw new HttpException(
        ErrorLoginMessage.USER_NOT_VERIFIED.toString(),
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload: JwtPayload = {
        sub: user.id,
        userCode: user.userCode,
        username: user.username,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        status: user.status,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      };

      return {
        message: 'Đăng nhập thành công',
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error('Error during JWT signing:', error);
      throw new HttpException(
        ErrorLoginMessage.LOGIN_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async SignUp(payload: SignUpPayload): Promise<SignUpDtoResponse> {
    if (!payload.email || payload.email.trim() === '') {
      throw new HttpException(
        ErrorRegisterMessage.REGISTER_FAILED.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.password || payload.password.trim() === '') {
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

    const existingUser = await this.authRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new HttpException(
        ErrorRegisterMessage.EMAIL_ALREADY_EXISTS.toString(),
        HttpStatus.CONFLICT,
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(payload.password, ROUND);

      const newUser = await this.authRepository.createUser({
        userCode: randomString(),
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
      }

      const otpPayload: SendOtpDto = {
        email: newUser.email,
      };
      await this.mailService.sendOTP(otpPayload);

      return { message: SuccessRegisterMessage.REGISTER_SUCCESS.toString() };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Only catch unexpected errors
      console.error('Error during sign-up:', error);
      throw new HttpException(
        ErrorRegisterMessage.REGISTER_FAILED.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async ForgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<ForgotPasswordResponse> {
    if (!payload.email || payload.email.trim() === '') {
      throw new HttpException(
        ErrorLoginMessage.EMAIL_NOT_VALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isEmail(payload.email)) {
      throw new HttpException(
        ErrorLoginMessage.EMAIL_NOT_VALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.authRepository.findByEmail(payload.email);

    if (!user) {
      throw new HttpException(
        ErrorLoginMessage.USER_NOT_FOUND.toString(),
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const otpPayload: SendOtpDto = {
        email: user.email,
      };
      await this.mailService.sendOTP(otpPayload);

      return {
        message: SuccessForgotPasswordMessage.VERIFY_SUCCESS.toString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error during forgot password:', error);
      throw new HttpException(
        ErrorForgotPasswordMessage.FORGOT_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async ResetPassword(
    payload: ResetPasswordPayload,
    user: UserDecoratorDtoResponse,
  ): Promise<ResetPasswordResponse> {
    if (!payload.newPassword || payload.newPassword.trim() === '') {
      throw new HttpException(
        ErrorResetPasswordMessage.PASSWORD_NOT_VALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!payload.oldPassword || payload.oldPassword.trim() === '') {
      throw new HttpException(
        ErrorResetPasswordMessage.PASSWORD_NOT_VALID.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValid = await bcrypt.compare(payload.oldPassword, user.password);

    if (!isValid) {
      throw new HttpException(
        ErrorLoginMessage.PASSWORD_INCORRECT.toString(),
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (payload.newPassword === payload.oldPassword) {
      throw new HttpException(
        ErrorResetPasswordMessage.PASSWORD_IS_EQUAL.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(payload.newPassword, ROUND);
      await this.authRepository.updatePassword(user.id, hashedPassword);

      return {
        message: SuccessResetPasswordMessage.RESET_SUCCESS.toString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error during reset password:', error);
      throw new HttpException(
        ErrorResetPasswordMessage.RESET_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
