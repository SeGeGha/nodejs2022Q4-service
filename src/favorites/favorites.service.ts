import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Favorite } from './entities/favorite.entity';
import { FavoriteOutput } from './entities/favorite-output.entity';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { ArtistsService } from '../artists/artists.service';
import { MESSAGES, ENTITIES } from '../constants';

type ServicesRef = ArtistsService | AlbumsService | TracksService;

@Injectable()
export class FavoritesService implements OnModuleInit {
  private artistsService: ArtistsService;
  private albumsService: AlbumsService;
  private tracksService: TracksService;
  private favorites = new Favorite();

  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    this.artistsService = this.moduleRef.get(ArtistsService, { strict: false });
    this.albumsService = this.moduleRef.get(AlbumsService, { strict: false });
    this.tracksService = this.moduleRef.get(TracksService, { strict: false });
  }

  async findAll(): Promise<FavoriteOutput> {
    const favsMap = Object.entries(this.favorites);
    const favsModels = await Promise.all(
      favsMap.map(([fieldName, ids]) => {
        const service: ServicesRef = this[`${fieldName}Service`];

        return service.findManyByIds(ids);
      }),
    );

    return favsMap.reduce((acc, [fieldName], id) => {
      acc[fieldName] = favsModels[id];

      return acc;
    }, {} as FavoriteOutput);
  }

  async add(entityType: string, id: string): Promise<Favorite | null> {
    if (this.favorites[entityType].includes(id)) return null;

    const service: ServicesRef = this[`${entityType}Service`];
    const resource = await service.findOne(id);
    if (!resource) {
      throw new Error(MESSAGES[`${entityType.slice(0, -1)}_NOT_FOUND`]);
    }

    this.favorites[entityType].push(id);

    return this.favorites;
  }

  async addArtist(id: string): Promise<Favorite | null> {
    return this.add(ENTITIES.ARTISTS, id);
  }

  async addAlbum(id: string): Promise<Favorite | null> {
    return this.add(ENTITIES.ALBUMS, id);
  }

  async addTrack(id: string): Promise<Favorite | null> {
    return this.add(ENTITIES.TRACKS, id);
  }

  async remove(entityType: string, id: string): Promise<Favorite> {
    const idx: number = this.favorites[entityType].findIndex(
      (resourceId) => resourceId === id,
    );
    if (idx === -1) {
      throw new Error(MESSAGES[`${entityType.slice(0, -1)}_NOT_FOUND`]);
    }

    this.favorites[entityType].splice(idx, 1);

    return this.favorites;
  }

  async removeArtist(id: string): Promise<Favorite> {
    return this.remove(ENTITIES.ARTISTS, id);
  }

  async removeAlbum(id: string): Promise<Favorite> {
    return this.remove(ENTITIES.ALBUMS, id);
  }

  async removeTrack(id: string): Promise<Favorite> {
    return this.remove(ENTITIES.TRACKS, id);
  }
}
