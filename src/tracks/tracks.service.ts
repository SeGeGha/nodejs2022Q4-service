import { v4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { FavoritesService } from '../favorites/favorites.service';
import { MESSAGES } from '../constants';

@Injectable()
export class TracksService implements OnModuleInit {
  private albumsService: AlbumsService;
  private artistsService: ArtistsService;
  private favoritesService: FavoritesService;
  private tracks: Track[] = [];

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.albumsService = this.moduleRef.get(AlbumsService, { strict: false });
    this.artistsService = this.moduleRef.get(ArtistsService, { strict: false });
    this.favoritesService = this.moduleRef.get(FavoritesService, {
      strict: false,
    });
  }

  async findAll(): Promise<Track[]> {
    return this.tracks;
  }

  async findManyByIds(ids: string[]): Promise<Track[]> {
    return this.tracks.filter((track) => ids.includes(track.id));
  }

  async findOne(id: string): Promise<Track | null> {
    return this.tracks.find((track) => track.id === id) ?? null;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto.artistId) {
      const artist = await this.artistsService.findOne(createTrackDto.artistId);

      if (!artist) throw new Error(MESSAGES.ARTIST_NOT_FOUND);
    }

    if (createTrackDto.albumId) {
      const albumId = await this.albumsService.findOne(createTrackDto.albumId);

      if (!albumId) throw new Error(MESSAGES.ALBUM_NOT_FOUND);
    }

    const newTrack = {
      ...createTrackDto,
      id: v4(),
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  async remove(id: string): Promise<Track | null> {
    const idx = this.tracks.findIndex((track) => track.id === id);
    if (idx === -1) return null;

    try {
      await this.favoritesService.removeTrack(id);
    } catch (error) {
    } finally {
      const [removedTrack] = this.tracks.splice(idx, 1);

      return removedTrack;
    }
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track | null> {
    const idx = this.tracks.findIndex((track) => track.id === id);
    if (idx === -1) return null;

    if (updateTrackDto.artistId) {
      const artist = await this.artistsService.findOne(updateTrackDto.artistId);

      if (!artist) throw new Error(MESSAGES.ARTIST_NOT_FOUND);
    }

    if (updateTrackDto.albumId) {
      const albumId = await this.albumsService.findOne(updateTrackDto.albumId);

      if (!albumId) throw new Error(MESSAGES.ALBUM_NOT_FOUND);
    }

    this.tracks[idx] = {
      ...this.tracks[idx],
      ...updateTrackDto,
    };

    return this.tracks[idx];
  }
}
