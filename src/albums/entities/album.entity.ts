import { Artist } from 'src/artists/entities/artist.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
