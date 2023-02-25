import * as bcrypt from 'bcrypt';
import { ModuleRef } from '@nestjs/core';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private usersService: UsersService;

  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    this.usersService = this.moduleRef.get(UsersService, { strict: false });
  }

  async register({ login, password }: CreateUserDto): Promise<void> {
    const hashedPassword = await this.hash(password);

    await this.usersService.create({
      login,
      password: hashedPassword,
    });

    // TODO: return message
  }

  private async hash(data: string) {
    return bcrypt.hash(data, Number(process.env.CRYPT_SALT));
  }
}
