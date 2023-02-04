import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { MESSAGES } from '../constants';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) { }

  @Get()
  async findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    const track = await this.tracksService.findOne(id);

    if (track) {
      return track;
    } else {
      throw new NotFoundException(MESSAGES.TRACK_NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.create(createTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    const removedTrack = await this.tracksService.remove(id);

    if (!removedTrack) {
      throw new NotFoundException(MESSAGES.TRACK_NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const updatedTrack = await this.tracksService.update(id, updateTrackDto);

    if (updatedTrack) {
      return updatedTrack;
    } else {
      throw new NotFoundException(MESSAGES.TRACK_NOT_FOUND);
    }
  }
}
