import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
