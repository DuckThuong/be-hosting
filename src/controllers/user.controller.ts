import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import {
  UserDecoratorDtoResponse,
  UserProfileInformationDto,
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
    @User() user: UserDecoratorDtoResponse,
    @Body() payload: UserProfileInformationDto,
  ): Promise<UserResponseDto> {
    return this.userService.UpdateUserProfile(user, payload);
  }
}
