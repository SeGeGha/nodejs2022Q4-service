import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { INITIAL_VERSION, MESSAGES } from '../constants';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const timestamp = new Date().getTime();
    const newUser = {
      ...userDto,
      id: v4(),
      version: INITIAL_VERSION,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.users.push(newUser);

    return newUser;
  }

  async remove(id: string): Promise<User | null> {
    const idx = this.users.findIndex((user) => user.id === id);
    if (idx === -1) return null;

    const [removedUser] = this.users.splice(idx, 1);

    return removedUser;
  }

  async update(id: string, userDto: UpdateUserDto): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    if (!user) return null;

    if (userDto.newPassword === userDto.oldPassword) {
      throw new Error(MESSAGES.SAME_PASSWORDS);
    }
    if (user.password !== userDto.oldPassword) {
      throw new Error(MESSAGES.WRONG_PASSWORD);
    }

    ++user.version;
    user.password = userDto.newPassword;
    user.updatedAt = new Date().getTime();

    return user;
  }
}
