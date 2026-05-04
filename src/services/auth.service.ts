import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ROUND } from '../assets/constants/constants';
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
} from '../assets/messages/auth.message';
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

    try {
      const payload: JwtPayload = {
        sub: user.id,
        userCode: user.userCode,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
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

      // Tạo username ngẫu nhiên từ tiền tố email để tránh trùng lặp
      // Vì FE truyền họ tên khách vào field userName
      const generatedUsername = `${payload.email.split('@')[0]}_${Math.floor(Math.random() * 100000)}`;

      const newUser = await this.authRepository.createUser({
        userCode: randomString(),
        username: generatedUsername, // Tự sinh username duy nhất
        fullName: payload.userName,  // Lưu họ tên vào trường fullName
        email: payload.email,
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      });

      if (!newUser) {
        throw new HttpException(
          ErrorRegisterMessage.REGISTER_FAILED.toString(),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Khởi tạo profile và lưu thêm số điện thoại, ngày sinh
      await this.authRepository.createUserProfile(
        newUser.id, 
        payload.phoneNumber, 
        payload.dateOfBirth
      );

      // Temporarily disable mandatory OTP flow after sign up.
      // const otpPayload: SendOtpDto = {
      //   email: newUser.email,
      // };
      // await this.mailService.sendOTP(otpPayload);

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

    // Query DB to get actual hashed password (JWT decorator has empty password)
    const dbUser = await this.authRepository.findById(user.id);
    if (!dbUser) {
      throw new HttpException(
        ErrorLoginMessage.USER_NOT_FOUND.toString(),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValid = await bcrypt.compare(payload.oldPassword, dbUser.password);

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
