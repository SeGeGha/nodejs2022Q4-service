import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';
import { MESSAGES } from '../constants';

@Injectable()
export class AlbumsService implements OnModuleInit {
  private artistsService: ArtistsService;
  private favoritesService: FavoritesService;

  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private moduleRef: ModuleRef,
  ) { }

  onModuleInit() {
    this.artistsService = this.moduleRef.get(ArtistsService, { strict: false });
    this.favoritesService = this.moduleRef.get(FavoritesService, {
      strict: false,
    });
  }

  async findAll(): Promise<Album[]> {
    return this.albumsRepository.find();
  }

  async findManyByIds(ids: string[]): Promise<Album[]> {
    return this.albumsRepository.findBy({ id: In(ids) });
  }

  async findOne(id: string): Promise<Album | null> {
    const album = await this.albumsRepository.findOne({ where: { id } });

    if (album) return album;

    throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto.artistId) {
      try {
        await this.artistsService.findOne(createAlbumDto.artistId);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    const createdAlbum = await this.albumsRepository.create(createAlbumDto);

    return this.albumsRepository.save(createdAlbum);
  }

  async remove(id: string): Promise<void> {
    const removedAlbum = await this.albumsRepository.delete(id);

    if (!removedAlbum.affected) {
      throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);
    }

    try {
      await this.favoritesService.removeAlbum(id);
    } catch (error) { }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumsRepository.findOne({ where: { id } });

    if (!album) throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);

    if (updateAlbumDto.artistId) {
      try {
        await this.artistsService.findOne(updateAlbumDto.artistId);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    const updatedAlbum = {
      ...album,
      ...updateAlbumDto,
    };

    return this.albumsRepository.save(updatedAlbum);
  }
}
