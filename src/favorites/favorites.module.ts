import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Favorite } from './entities/favorite.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Album } from '../albums/entities/album.entity';
import { Track } from '../tracks/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Artist, Album, Track])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
