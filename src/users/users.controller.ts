import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id): Promise<UserResponse> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponse> {
    return this.usersService.update(id, updateUserDto);
  }
}
