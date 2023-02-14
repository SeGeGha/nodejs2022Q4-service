import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';
import { Track } from '../tracks/entities/track.entity';
import { Album } from '../albums/entities/album.entity';
import { MESSAGES } from '../constants';

@Injectable()
export class ArtistsService implements OnModuleInit {
  private albumsService: AlbumsService;
  private tracksService: TracksService;
  private favoritesService: FavoritesService;

  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    private moduleRef: ModuleRef,
  ) { }

  onModuleInit() {
    this.albumsService = this.moduleRef.get(AlbumsService, { strict: false });
    this.tracksService = this.moduleRef.get(TracksService, { strict: false });
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

      // await Promise.all(
      //   albums.reduce((acc, album) => {
      //     if (album.artistId === id) {
      //       acc.push(this.albumsService.update(album.id, { artistId: null }));
      //     }

      //     return acc;
      //   }, [] as Promise<Album>[]),
      // );

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
