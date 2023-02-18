import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteResponse } from './entities/favorite.entity';
import { ENTITIES } from '../constants';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  async findAll(): Promise<FavoriteResponse> {
    return this.favoritesService.findAll();
  }

  @Post('artist/:id')
  async addArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FavoriteResponse> {
    return this.favoritesService.add(ENTITIES.ARTISTS, id);
  }

  @Post('album/:id')
  async addAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FavoriteResponse> {
    return this.favoritesService.add(ENTITIES.ALBUMS, id);
  }

  @Post('track/:id')
  async addTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<FavoriteResponse> {
    return this.favoritesService.add(ENTITIES.TRACKS, id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.remove(ENTITIES.ARTISTS, id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.remove(ENTITIES.ALBUMS, id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.favoritesService.remove(ENTITIES.TRACKS, id);
  }
}
