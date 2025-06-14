import { Inject, Injectable } from '@nestjs/common';
import { Video } from 'src/shared/models';
import { VideoRepository } from 'src/infrastructure/repositories/video';

@Injectable()
export class FindAllVideoUseCase {
  constructor(
    @Inject(VideoRepository.providerName)
    private readonly videoRepository: VideoRepository,
  ) {}

  findAll(): Promise<Video[]> {
    return this.videoRepository.findAll();
  }
}
