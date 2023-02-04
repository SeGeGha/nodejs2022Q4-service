import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  async findAll(): Promise<Track[]> {
    return this.tracks;
  }

  async findOne(id: string): Promise<Track | null> {
    return this.tracks.find((track) => track.id === id) ?? null;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = {
      ...createTrackDto,
      id: v4(),
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  async remove(id: string): Promise<Track | null> {
    const idx = this.tracks.findIndex((track) => track.id === id);
    if (idx === -1) return null;

    const [removedTrack] = this.tracks.splice(idx, 1);

    return removedTrack;
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track | null> {
    const idx = this.tracks.findIndex((track) => track.id === id);
    if (idx === -1) return null;

    this.tracks[idx] = {
      ...this.tracks[idx],
      ...updateTrackDto,
    };

    return this.tracks[idx];
  }
}
