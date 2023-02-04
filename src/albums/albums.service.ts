import { v4 } from 'uuid';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ArtistsService } from '../artists/artists.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { MESSAGES } from '../constants';

@Injectable()
export class AlbumsService implements OnModuleInit {
  private artistsService: ArtistsService;
  private albums: Album[] = [];

  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    this.artistsService = this.moduleRef.get(ArtistsService, { strict: false });
  }

  async findAll(): Promise<Album[]> {
    return this.albums;
  }

  async findMany(artistId: string): Promise<Album[]> {
    return this.albums.filter((album) => album.artistId === artistId);
  }

  async findOne(id: string): Promise<Album | null> {
    return this.albums.find((album) => album.id === id) ?? null;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const artist = await this.artistsService.findOne(createAlbumDto.artistId);
    if (!artist) {
      throw new Error(MESSAGES.ARTIST_NOT_FOUND);
    }

    const newAlbum = {
      ...createAlbumDto,
      id: v4(),
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  async remove(id: string): Promise<Album> {
    const idx = this.albums.findIndex((album) => album.id === id);
    if (idx === -1) return null;

    const [removedAlbum] = this.albums.splice(idx, 1);

    return removedAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const idx = this.albums.findIndex((album) => album.id === id);
    if (idx === -1) return null;

    if (updateAlbumDto.artistId) {
      const artist = await this.artistsService.findOne(updateAlbumDto.artistId);
      if (!artist) {
        throw new Error(MESSAGES.ARTIST_NOT_FOUND);
      }
    }

    this.albums[idx] = {
      ...this.albums[idx],
      ...updateAlbumDto,
    };

    return this.albums[idx];
  }
}
