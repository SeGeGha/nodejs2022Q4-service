import * as bcrypt from 'bcryptjs';
import { ModuleRef } from '@nestjs/core';
import {
  ForbiddenException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User, UserResponse } from '../users/entities/user.entity';
import { MESSAGES } from '../constants';

@Injectable()
export class AuthService implements OnModuleInit {
  private usersService: UsersService;

  constructor(private moduleRef: ModuleRef, private jwtService: JwtService) { }

  onModuleInit() {
    this.usersService = this.moduleRef.get(UsersService, { strict: false });
  }

  async register(userDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(userDto);
  }

  async login(userDto: CreateUserDto): Promise<Tokens> {
    const user = await this.validateUser(userDto);

    return this.getTokens(user);
  }

  async refresh(token: string): Promise<Tokens> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException(MESSAGES.UNCORRECT_REFRESH_TOKEN);
    }

    const { login } = this.jwtService.decode(token) as Record<string, string>;

    const user = await this.usersService.findByLogin(login);

    if (!user) throw new ForbiddenException(MESSAGES.USER_NOT_FOUND);

    const refreshMatch = await bcrypt.compare(token, user.hashedRefresh);

    if (!refreshMatch) throw new ForbiddenException(MESSAGES.ACCEPT_DENIED);

    return this.getTokens(user);
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.findByLogin(userDto.login);

    if (!user) throw new ForbiddenException(MESSAGES.USER_NOT_FOUND);

    const passwordMatch = await this.usersService.isPasswordsEquals(
      userDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new ForbiddenException(MESSAGES.WRONG_PASSWORD);
    }

    return user;
  }

  private async getTokens(user: User): Promise<Tokens> {
    const tokens = await this.generateTokens(user);

    await this.usersService.updateRefreshTokenHash(
      user.id,
      tokens.refreshToken,
    );

    return tokens;
  }

  private async generateTokens({ id, login }: User): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          login,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          id,
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
