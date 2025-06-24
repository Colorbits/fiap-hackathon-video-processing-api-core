import { Inject, Injectable } from '@nestjs/common';
import { Video } from 'src/shared/models';
import { VideoRepository } from 'src/infrastructure/repositories/video';

@Injectable()
export class FindVideoUseCase {
  constructor(
    @Inject(VideoRepository.providerName)
    private readonly videoRepository: VideoRepository,
  ) {}

  find(uuid?: string, status?: string): Promise<Video[]> {
    return this.videoRepository.find(uuid, status);
  }
}
