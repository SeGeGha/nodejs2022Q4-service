import { v4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { Track } from '../tracks/entities/track.entity';
import { Album } from '../albums/entities/album.entity';

@Injectable()
export class ArtistsService implements OnModuleInit {
  private albumsService: AlbumsService;
  private tracksService: TracksService;
  private favoritesService: FavoritesService;
  private artists: Artist[] = [];

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.albumsService = this.moduleRef.get(AlbumsService, { strict: false });
    this.tracksService = this.moduleRef.get(TracksService, { strict: false });
    this.favoritesService = this.moduleRef.get(FavoritesService, {
      strict: false,
    });
  }

  async findAll(): Promise<Artist[]> {
    return this.artists;
  }

  async findManyByIds(ids: string[]): Promise<Artist[]> {
    return this.artists.filter((artist) => ids.includes(artist.id));
  }

  async findOne(id: string): Promise<Artist | null> {
    return this.artists.find((artist) => artist.id === id) ?? null;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = {
      ...createArtistDto,
      id: v4(),
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  async remove(id: string): Promise<Artist | null> {
    const idx = this.artists.findIndex((user) => user.id === id);
    if (idx === -1) return null;

    try {
      const tracks = await this.tracksService.findAll();
      const albums = await this.albumsService.findAll();

      await Promise.all(
        tracks.reduce((acc, track) => {
          if (track.artistId === id) {
            acc.push(this.tracksService.update(track.id, { artistId: null }));
          }

          return acc;
        }, [] as Promise<Track>[]),
      );

      await Promise.all(
        albums.reduce((acc, album) => {
          if (album.artistId === id) {
            acc.push(this.albumsService.update(album.id, { artistId: null }));
          }

          return acc;
        }, [] as Promise<Album>[]),
      );

      await this.favoritesService.removeArtist(id);
    } catch (error) {
    } finally {
      const [removedUser] = this.artists.splice(idx, 1);

      return removedUser;
    }
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | null> {
    const idx = this.artists.findIndex((artist) => artist.id === id);
    if (idx === -1) return null;

    this.artists[idx] = {
      ...this.artists[idx],
      ...updateArtistDto,
    };

    return this.artists[idx];
  }
}
