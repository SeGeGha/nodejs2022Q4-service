import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './common/decorators/public.decorator';
import { Tokens } from './types/tokens';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponse } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.login(userDto);
  }

  @Post('refresh')
  refresh(@Body('token') token: string): Promise<Tokens> {
    return this.authService.refresh(token);
  }
}
