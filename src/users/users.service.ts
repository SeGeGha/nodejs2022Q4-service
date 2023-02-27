import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserResponse } from './entities/user.entity';
import { hash } from '../utils/hash';
import { MESSAGES } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.usersRepository.find();

    return users.map((user) => user.toResponse());
  }

  async findOne(id: string): Promise<UserResponse | null> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (user) return user.toResponse();

    throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
  }

  async findByLogin(login: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { login },
    });

    return user ?? null;
  }

  async create(userDto: CreateUserDto): Promise<UserResponse> {
    const hashPassword = await this.hashPassword(userDto.password);
    const createdUser = this.usersRepository.create({
      ...userDto,
      password: hashPassword,
    });

    return (await this.usersRepository.save(createdUser)).toResponse();
  }

  async remove(id: string): Promise<void> {
    const removedUser = await this.usersRepository.delete(id);

    if (!removedUser.affected) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
  }

  async update(id: string, userDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);

    if (userDto.newPassword === userDto.oldPassword) {
      throw new ForbiddenException(MESSAGES.SAME_PASSWORDS);
    }

    const passwordMatch = await this.isPasswordsEquals(
      userDto.oldPassword,
      user.password,
    );

    if (!passwordMatch) throw new ForbiddenException(MESSAGES.WRONG_PASSWORD);

    user.password = await this.hashPassword(userDto.newPassword);

    return (await this.usersRepository.save(user)).toResponse();
  }

  async isPasswordsEquals(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, Number(process.env.CRYPT_SALT));
  }
}
