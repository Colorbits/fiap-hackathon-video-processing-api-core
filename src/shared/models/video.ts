import { randomInt } from 'crypto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class VideoDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  extension: string;

  @IsNotEmpty()
  path: string;

  @IsNotEmpty()
  status: string;
}

export class FilterVideoDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  userId?: number;

  @IsOptional()
  status?: string;
}

export class Video {
  id?: number;
  userId: number;
  name: string;
  extension: string;
  path: string;
  status: string;

  constructor(videoDto: VideoDto) {
    if (videoDto) {
      this.id = videoDto.id || randomInt(999);
      this.userId = videoDto.userId;
      this.name = videoDto.name;
      this.extension = videoDto.extension;
      this.path = videoDto.path;
      this.status = videoDto.status;
    }
  }
}
