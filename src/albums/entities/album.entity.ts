import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from '../../artists/entities/artist.entity';
import { Track } from '../../tracks/entities/track.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ name: 'artist_id', nullable: true })
  artistId: string | null;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];

  @ManyToOne(() => Favorite, (favorite) => favorite.albums)
  favorite: Favorite;
}
