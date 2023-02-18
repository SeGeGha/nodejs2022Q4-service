import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Album } from '../albums/entities/album.entity';
import { Artist } from '../artists/entities/artist.entity';
import { MESSAGES } from '../constants';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) { }

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track | null> {
    const track = await this.tracksRepository.findOne({ where: { id } });

    if (track) return track;

    throw new NotFoundException(MESSAGES.TRACK_NOT_FOUND);
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const { artistId, albumId } = createTrackDto;

    if (artistId) await this.isArtistExists(artistId);
    if (albumId) await this.isAlbumExists(albumId);

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

    const { artistId, albumId } = updateTrackDto;

    if (artistId) await this.isArtistExists(artistId);
    if (albumId) await this.isAlbumExists(albumId);

    const updatedTrack = {
      ...track,
      ...updateTrackDto,
    };

    return this.tracksRepository.save(updatedTrack);
  }

  private async isAlbumExists(id: string) {
    try {
      return await this.albumsRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new BadRequestException(MESSAGES.ALBUM_NOT_FOUND);
    }
  }

  private async isArtistExists(id: string) {
    try {
      return await this.artistsRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new BadRequestException(MESSAGES.ARTIST_NOT_FOUND);
    }
  }
}
