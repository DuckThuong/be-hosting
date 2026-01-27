import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SignInDtoResponse } from '../dtos/auth/signIn.dto';
import { SignUpDtoResponse, SignUpPayload } from '../dtos/auth/signUp.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Sign Up' })
  @Post('signup')
  public async signUp(
    @Body() payload: SignUpPayload,
  ): Promise<SignUpDtoResponse> {
    return this.authService.SignUp(payload);
  }

  @ApiOperation({ summary: 'User Sign In' })
  @Post('signin')
  public async signIn(
    @Body() payload: SignUpPayload,
  ): Promise<SignInDtoResponse> {
    return this.authService.SignIn(payload);
  }
}
