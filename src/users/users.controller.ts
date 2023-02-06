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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { MESSAGES } from '../constants';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll(): Promise<User[]> {
    const userEntities = await this.usersService.findAll();

    return userEntities.map((userEntity) => new User(userEntity));
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id): Promise<User> {
    const userEntity = await this.usersService.findOne(id);

    if (userEntity) {
      return new User(userEntity);
    } else {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const userEntity = await this.usersService.create(createUserDto);

    return new User(userEntity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    const removedUserEntity = await this.usersService.remove(id);

    if (!removedUserEntity) {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<User> {
    let updatedUserEntity;

    try {
      updatedUserEntity = await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }

    if (updatedUserEntity) {
      return new User(updatedUserEntity);
    } else {
      throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }
  }
}
