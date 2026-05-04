import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorUserMessage } from '../assets/messages/user.message';
import {
  UserDecoratorDtoResponse,
  UserProfileInformationDto,
  UserResponseDto,
} from '../dtos/user/user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async UpdateUserProfile(
    user: UserDecoratorDtoResponse,
    payload: UserProfileInformationDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.userRepository.UpdateUserProfile(
        user.userCode,
        payload,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        ErrorUserMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async GetUserInfomation(
    userRef: UserDecoratorDtoResponse,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.GetUserInfomation(
        userRef.userCode,
      );
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        ErrorUserMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
