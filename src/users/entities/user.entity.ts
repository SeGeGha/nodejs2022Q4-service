import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ update: false })
  readonly login: string;

  @Column()
  password: string;

  @VersionColumn({ default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toResponse(): UserResponse {
    const { id, login, version, createdAt, updatedAt } = this;

    return {
      id,
      login,
      version,
      createdAt: new Date(createdAt).getTime(),
      updatedAt: new Date(updatedAt).getTime(),
    };
  }
}

export type UserResponse = {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
};
