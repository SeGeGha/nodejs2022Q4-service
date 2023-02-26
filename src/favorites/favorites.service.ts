import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite, FavoriteResponse } from './entities/favorite.entity';
import { MESSAGES, ENTITIES } from '../constants';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';

type RepositoryRef = Repository<Artist | Album | Track>;
type Entity = ENTITIES.ARTISTS | ENTITIES.ALBUMS | ENTITIES.TRACKS;

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
  ) { }

  async findAll(): Promise<FavoriteResponse> {
    const favorite = await this.getFavorite();

    return favorite.toResponse();
  }

  async add(entityType: Entity, id: string): Promise<FavoriteResponse> {
    const repository: RepositoryRef = this[`${entityType}Repository`];
    const entity = await repository.findOne({ where: { id } });

    if (!entity) {
      throw new UnprocessableEntityException(
        MESSAGES[`${entityType.slice(0, -1).toUpperCase()}_NOT_FOUND`],
      );
    }

    const favorite = await this.getFavorite();
    const idx = favorite[entityType].findIndex((entity) => entity.id === id);

    if (idx === -1) {
      favorite[entityType as string].push(entity);

      await this.favoritesRepository.save(favorite);
    }

    return favorite.toResponse();
  }

  async remove(entityType: Entity, id: string): Promise<void> {
    const favorite = await this.getFavorite();
    const idx = favorite[entityType].findIndex((entity) => entity.id === id);

    if (idx >= 0) {
      favorite[entityType].splice(idx, 1);

      await this.favoritesRepository.save(favorite);
    } else {
      throw new NotFoundException(
        MESSAGES[`${entityType.slice(0, -1).toUpperCase()}_NOT_FOUND`],
      );
    }
  }

  private async getFavorite(): Promise<Favorite> {
    let [favorite] = await this.favoritesRepository.find({
      relations: [ENTITIES.ARTISTS, ENTITIES.ALBUMS, ENTITIES.TRACKS],
    });

    if (!favorite) {
      favorite = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });

      await this.favoritesRepository.save(favorite);
    }

    return favorite;
  }
}
