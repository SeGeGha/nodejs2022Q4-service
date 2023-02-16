import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ name: 'artist_id', nullable: true })
  artistId: string | null;

  @Column({ name: 'album_id', nullable: true })
  albumId: string | null;

  @Column()
  duration: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @ManyToOne(() => Favorite, (favorite) => favorite.albums)
  favorite: Favorite;
}
