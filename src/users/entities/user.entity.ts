import { Exclude } from 'class-transformer';

export class User {
  readonly id: string;
  readonly login: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
