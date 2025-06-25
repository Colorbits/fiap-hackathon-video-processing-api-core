import { ImageDto, VideoZipDto } from '../../../shared';

export interface IImageUploadHttpService {
  createVideoZip(videoZipDto: VideoZipDto): Promise<VideoZipDto>;
  updateVideoZip(videoZipDto: VideoZipDto): Promise<VideoZipDto>;
  getVideoZip(videoZipUuid: string): Promise<VideoZipDto>;
  getImagesByVideoUuid(videoZipUuid: string): Promise<ImageDto[]>;
  uploadImage(
    videoUuid: string,
    filename: string,
    image: Blob,
  ): Promise<ImageDto>;
}
