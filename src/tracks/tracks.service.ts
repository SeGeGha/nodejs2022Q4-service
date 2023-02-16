import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { MESSAGES } from '../constants';

@Injectable()
export class TracksService implements OnModuleInit {
  private albumsService: AlbumsService;
  private artistsService: ArtistsService;

  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private moduleRef: ModuleRef,
  ) { }

  onModuleInit() {
    this.albumsService = this.moduleRef.get(AlbumsService, { strict: false });
    this.artistsService = this.moduleRef.get(ArtistsService, { strict: false });
  }

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  async findManyByIds(ids: string[]): Promise<Track[]> {
    return this.tracksRepository.findBy({ id: In(ids) });
  }

  async findOne(id: string): Promise<Track | null> {
    const track = await this.tracksRepository.findOne({ where: { id } });

    if (track) return track;

    throw new NotFoundException(MESSAGES.TRACK_NOT_FOUND);
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto.artistId) {
      const artist = await this.artistsService.findOne(createTrackDto.artistId);

      if (!artist) throw new BadRequestException(MESSAGES.ARTIST_NOT_FOUND);
    }

    if (createTrackDto.albumId) {
      const albumId = await this.albumsService.findOne(createTrackDto.albumId);

      if (!albumId) throw new BadRequestException(MESSAGES.ALBUM_NOT_FOUND);
    }

    const newTrack = await this.tracksRepository.create(createTrackDto);

    return this.tracksRepository.save(newTrack);
  }

  async remove(id: string): Promise<void> {
    const removedTrack = await this.tracksRepository.delete(id);

    if (!removedTrack.affected) {
      throw new NotFoundException(MESSAGES.TRACK_NOT_FOUND);
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.tracksRepository.findOne({ where: { id } });

    if (!track) throw new NotFoundException(MESSAGES.TRACK_NOT_FOUND);

    if (updateTrackDto.artistId) {
      const artist = await this.artistsService.findOne(updateTrackDto.artistId);

      if (!artist) throw new BadRequestException(MESSAGES.ARTIST_NOT_FOUND);
    }

    if (updateTrackDto.albumId) {
      const albumId = await this.albumsService.findOne(updateTrackDto.albumId);

      if (!albumId) throw new BadRequestException(MESSAGES.ALBUM_NOT_FOUND);
    }

    const updatedTrack = {
      ...track,
      ...updateTrackDto,
    };

    return this.tracksRepository.save(updatedTrack);
  }
}
