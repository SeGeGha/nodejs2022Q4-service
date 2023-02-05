import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { MESSAGES } from '../constants';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    const album = await this.albumsService.findOne(id);

    if (album) {
      return album;
    } else {
      throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    try {
      const newAlbum = await this.albumsService.create(createAlbumDto);
      return newAlbum;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    const removedAlbum = await this.albumsService.remove(id);

    if (!removedAlbum) {
      throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    let updatedAlbum;

    try {
      updatedAlbum = await this.albumsService.update(id, updateAlbumDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    if (updatedAlbum) {
      return updatedAlbum;
    } else {
      throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);
    }
  }
}
