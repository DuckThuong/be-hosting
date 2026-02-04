import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
