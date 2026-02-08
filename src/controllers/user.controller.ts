import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  UpdateUserProfileInformationPayload,
  UserDecoratorDtoResponse,
  UserResponseDto,
} from '../dtos/user/user.dto';
import { UserService } from '../services/user.service';
import { User } from '../user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Lấy thông tin người dùng' })
  @Get('get-user-information')
  public async getUserInformation(
    @User() user: UserDecoratorDtoResponse,
  ): Promise<UserResponseDto> {
    return this.userService.GetUserInfomation(user);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin người dùng.' })
  @Put('update-user-profile')
  public async UpdateUserProfile(
    @Body() payload: UpdateUserProfileInformationPayload,
  ): Promise<UserResponseDto> {
    return this.userService.UpdateUserProfile(payload);
  }
}
