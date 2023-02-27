import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { MESSAGES } from '../constants';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });

    if (artist) return artist;

    throw new NotFoundException(MESSAGES.ARTIST_NOT_FOUND);
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const createdArtist = this.artistsRepository.create(createArtistDto);

    return this.artistsRepository.save(createdArtist);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistsRepository.delete(id);

    if (!artist.affected) {
      throw new NotFoundException(MESSAGES.ARTIST_NOT_FOUND);
    }
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
