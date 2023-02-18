import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { Artist } from '../artists/entities/artist.entity';
import { MESSAGES } from '../constants';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) { }

  async findAll(): Promise<Album[]> {
    return this.albumsRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumsRepository.findOne({ where: { id } });

    if (album) return album;

    throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const { artistId } = createAlbumDto;

    if (artistId) await this.isArtistExists(artistId);

    const createdAlbum = await this.albumsRepository.create(createAlbumDto);

    return this.albumsRepository.save(createdAlbum);
  }

  async remove(id: string): Promise<void> {
    const removedAlbum = await this.albumsRepository.delete(id);

    if (!removedAlbum.affected) {
      throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumsRepository.findOne({ where: { id } });
    const { artistId } = updateAlbumDto;

    if (!album) throw new NotFoundException(MESSAGES.ALBUM_NOT_FOUND);

    if (artistId) await this.isArtistExists(artistId);

    const updatedAlbum = {
      ...album,
      ...updateAlbumDto,
    };

    return this.albumsRepository.save(updatedAlbum);
  }

  private async isArtistExists(id: string) {
    try {
      return await this.artistsRepository.findOneOrFail({ where: { id } });
    } catch {
      throw new BadRequestException(MESSAGES.ARTIST_NOT_FOUND);
    }
  }
}
