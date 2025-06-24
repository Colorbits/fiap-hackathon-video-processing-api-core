import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { VideoRepository } from 'src/infrastructure/repositories/video';

@Injectable()
export class DeleteVideoUseCase {
  constructor(
    @Inject(VideoRepository.providerName)
    private readonly videoRepository: VideoRepository,
  ) {}

  async delete(videoUuid: string): Promise<void> {
    const video = await this.videoRepository.findById(videoUuid);
    if (!video) {
      throw new HttpException(
        `Video not found with id: ${videoUuid}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.videoRepository.delete(videoUuid);
  }
}
