import { Inject, Injectable } from '@nestjs/common';
import { Video, VideoDto } from 'src/shared/models';
import { VideoRepository } from 'src/infrastructure/repositories/video';

@Injectable()
export class EditVideoUseCase {
  constructor(
    @Inject(VideoRepository.providerName)
    private readonly videoRepository: VideoRepository,
  ) {}

  edit(videoDto: VideoDto): Promise<Video> {
    const video: Video = {
      uuid: videoDto.uuid,
      userId: videoDto.userId,
      name: videoDto.name,
      extension: videoDto.extension,
      path: videoDto.path,
      status: videoDto.status,
    };
    return this.videoRepository.edit(video);
  }
}
