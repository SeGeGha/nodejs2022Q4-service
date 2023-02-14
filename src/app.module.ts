import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { TracksModule } from './tracks/tracks.module';
import { FavoritesModule } from './favorites/favorites.module';
import { User } from './users/entities/user.entity';
import { Artist } from './artists/entities/artist.entity';
import { Album } from './albums/entities/album.entity';

@Module({
  imports: [
    UsersModule,
    ArtistsModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Artist, Album],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule { }
