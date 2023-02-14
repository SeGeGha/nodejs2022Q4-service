import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ default: false })
  grammy: boolean;
}
