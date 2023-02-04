import { v4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class ArtistsService implements OnModuleInit {
  private albumsService: AlbumsService;
  private artists: Artist[] = [];

  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    this.albumsService = this.moduleRef.get(AlbumsService, { strict: false });
  }

  async findAll(): Promise<Artist[]> {
    return this.artists;
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

    const albums = await this.albumsService.findMany(id);

    await Promise.all(
      albums.map((album) => {
        return this.albumsService.update(album.id, { artistId: null });
      }),
    );

    const [removedUser] = this.artists.splice(idx, 1);

    return removedUser;
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
