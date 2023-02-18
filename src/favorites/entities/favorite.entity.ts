import { v4 } from 'uuid';
import { Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryColumn({ default: v4() })
  readonly id: string;

  @OneToMany(() => Artist, (artist) => artist.favorite)
  @JoinColumn()
  artists: Artist[];

  @OneToMany(() => Album, (album) => album.favorite)
  @JoinColumn()
  albums: Album[];

  @OneToMany(() => Track, (track) => track.favorite)
  @JoinColumn()
  tracks: Track[];

  toResponse() {
    const { artists, albums, tracks } = this;

    return { artists, albums, tracks };
  }
}

export type FavoriteResponse = Omit<Favorite, 'id' | 'toResponse'>;
