import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  UnprocessableEntityException,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteOutput } from './entities/favorite-output.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  async findAll(): Promise<FavoriteOutput> {
    return this.favoritesService.findAll();
  }

  @Post('artist/:id')
  async addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.favoritesService.addArtist(id);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Post('album/:id')
  async addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.favoritesService.addAlbum(id);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Post('track/:id')
  async addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.favoritesService.addTrack(id);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.favoritesService.removeArtist(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.favoritesService.removeAlbum(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.favoritesService.removeTrack(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
