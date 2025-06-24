import { IsNotEmpty, IsOptional } from 'class-validator';

export class VideoDto {
  @IsOptional()
  uuid?: string;

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
  uuid?: string;

  @IsOptional()
  userId?: number;

  @IsOptional()
  status?: string;
}

export class Video {
  uuid?: string;
  userId: number;
  name: string;
  extension: string;
  path: string;
  status: string;

  constructor(videoDto: VideoDto) {
    if (videoDto) {
      this.uuid = videoDto.uuid;
      this.userId = videoDto.userId;
      this.name = videoDto.name;
      this.extension = videoDto.extension;
      this.path = videoDto.path;
      this.status = videoDto.status;
    }
  }
}
