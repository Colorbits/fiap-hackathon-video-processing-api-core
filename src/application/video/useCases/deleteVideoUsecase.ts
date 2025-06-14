import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { VideoRepository } from 'src/infrastructure/repositories/video';

@Injectable()
export class DeleteVideoUseCase {
  constructor(
    @Inject(VideoRepository.providerName)
    private readonly videoRepository: VideoRepository,
  ) {}

  async delete(videoId: number): Promise<void> {
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new HttpException(
        `Video not found with id: ${videoId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.videoRepository.delete(videoId);
  }
}
