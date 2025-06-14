import { Inject, Injectable } from '@nestjs/common';
import { Video, VideoDto } from 'src/shared/models';
import { VideoRepository } from 'src/infrastructure/repositories/video';

@Injectable()
export class CreateVideoUseCase {
  constructor(
    @Inject(VideoRepository.providerName)
    private readonly videoRepository: VideoRepository,
  ) {}

  create(videoDto: VideoDto): Promise<Video> {
    const video: Video = new Video(videoDto);
    return this.videoRepository.create(video);
  }
}
