import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  async findAll(): Promise<Album[]> {
    return this.albums;
  }

  async findOne(id: string): Promise<Album | null> {
    return this.albums.find((album) => album.id === id) ?? null;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
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

    this.albums[idx] = {
      ...this.albums[idx],
      ...updateAlbumDto,
    };

    return this.albums[idx];
  }
}
