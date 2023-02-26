import { ModuleRef } from '@nestjs/core';
import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Tokens } from './types/tokens';
import { BaseResponse } from './types/base-response';
import { MESSAGES } from '../constants';

@Injectable()
export class AuthService implements OnModuleInit {
  private usersService: UsersService;

  constructor(private moduleRef: ModuleRef, private jwtService: JwtService) { }

  onModuleInit() {
    this.usersService = this.moduleRef.get(UsersService, { strict: false });
  }

  async register(userDto: CreateUserDto): Promise<BaseResponse> {
    await this.usersService.create(userDto);

    return {
      message: MESSAGES.SUCCESS_USER_SIGNUP,
    };
  }

  async login(userDto: CreateUserDto): Promise<Tokens> {
    const user = await this.usersService.findByLogin(userDto.login);

    if (!user) throw new ForbiddenException(MESSAGES.USER_NOT_FOUND);

    const passwordMatch = await this.usersService.isPasswordsEquals(
      userDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new ForbiddenException(MESSAGES.WRONG_PASSWORD);
    }

    const tokens = await this.generateTokens(user.id, user.login);
    // await this.updateRefreshHash(data.id, tokens.refreshToken);
    return tokens;
  }

  private async generateTokens(userId: string, login: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          login,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          login,
        },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
