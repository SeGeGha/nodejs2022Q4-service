import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/common/guards/jwt-auth.guard';
import { dataSourceOptions } from '../db/data-source';

@Module({
  imports: [
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
    AuthModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
