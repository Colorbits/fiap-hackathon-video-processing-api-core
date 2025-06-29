import { IsNotEmpty, IsOptional } from 'class-validator';
export enum videoStatusEnum {
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

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
  status: videoStatusEnum;
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
  status: videoStatusEnum;

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
