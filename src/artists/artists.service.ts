import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { FavoritesService } from '../favorites/favorites.service';
import { MESSAGES } from '../constants';

@Injectable()
export class ArtistsService implements OnModuleInit {
  private favoritesService: FavoritesService;

  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    private moduleRef: ModuleRef,
  ) { }

  onModuleInit() {
    this.favoritesService = this.moduleRef.get(FavoritesService, {
      strict: false,
    });
  }

  async findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  async findManyByIds(ids: string[]): Promise<Artist[]> {
    return this.artistsRepository.findBy({ id: In(ids) });
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });

    if (artist) return artist;

    throw new NotFoundException(MESSAGES.ARTIST_NOT_FOUND);
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const createdArtist = await this.artistsRepository.create(createArtistDto);

    return this.artistsRepository.save(createdArtist);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistsRepository.delete(id);

    if (!artist.affected) {
      throw new NotFoundException(MESSAGES.ARTIST_NOT_FOUND);
    }

    try {
      await this.favoritesService.removeArtist(id);
    } catch (error) { }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });

    if (!artist) throw new NotFoundException(MESSAGES.ARTIST_NOT_FOUND);

    const updatedArtist = {
      ...artist,
      ...updateArtistDto,
    };

    return this.artistsRepository.save(updatedArtist);
  }
}
