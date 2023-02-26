import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tokens } from './types/tokens';
import { BaseResponse } from './types/base-response';
import { LoginUser } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<BaseResponse> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() user: LoginUser): Promise<Tokens> {
    return this.authService.login(user);
  }
}