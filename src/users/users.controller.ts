import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Delete,
  Put,
  NotFoundException,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { MESSAGES } from '../constants';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id): Promise<User> {
    const user = await this.usersService.findOne(id);

    if (user) {
      return user;
    } else {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    const removedUser = await this.usersService.remove(id);

    if (!removedUser) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<User> {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);

      if (updatedUser) {
        return updatedUser;
      } else {
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
