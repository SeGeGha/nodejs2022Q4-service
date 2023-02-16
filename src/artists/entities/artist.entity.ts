import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Track } from '../../tracks/entities/track.entity';

@Entity('artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ default: false })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];

  @ManyToOne(() => Favorite, (favorite) => favorite.artists)
  favorite: Favorite;
}
