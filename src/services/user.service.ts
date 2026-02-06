import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ErrorUserMessage } from '../assests/messages/user.message';
import { validString } from '../common/helpers/common.helper';
import {
  UpdateUserProfileInformationPayload,
  UserDecoratorDtoResponse,
  UserResponseDto,
} from '../dtos/user/user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async UpdateUserProfile(
    payload: UpdateUserProfileInformationPayload,
  ): Promise<UserResponseDto> {
    if (!validString(payload.userCode)) {
      throw new HttpException(
        ErrorUserMessage.USER_CD_EMPTY.toString(),
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return await this.userRepository.UpdateUserProfile(payload);
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
      console.log(error);
      throw new HttpException(
        ErrorUserMessage.CATCH_ERROR.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
