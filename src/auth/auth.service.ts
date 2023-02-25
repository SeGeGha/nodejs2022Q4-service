import * as bcrypt from 'bcrypt';
import { ModuleRef } from '@nestjs/core';
import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUser } from '../users/dto/login-user.dto';
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

  async register({ login, password }: CreateUserDto): Promise<BaseResponse> {
    const hashedPassword = await this.hash(password);

    await this.usersService.create({
      login,
      password: hashedPassword,
    });

    return {
      message: MESSAGES.SUCCESS_USER_SIGNUP,
    };
  }

  async login({ login, password }: LoginUser): Promise<Tokens> {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      throw new ForbiddenException(MESSAGES.USER_NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new ForbiddenException(MESSAGES.WRONG_PASSWORD);
    }

    const tokens = await this.generateTokens(user.id);

    return tokens;
  }

  private async hash(data: string) {
    return bcrypt.hash(data, Number(process.env.CRYPT_SALT));
  }

  private async generateTokens(userId: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
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
