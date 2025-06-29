import axios from 'axios';
import { IImageUploadHttpService } from './IImageUploadHttpService';
import { VideoZipDto, ImageDto } from '../../../shared';
import { Logger } from '@nestjs/common';

const imageUploadMicroserviceEndpoint = process.env.IMAGE_UPLOAD_SERVICE_URL;

const providerName = 'IImageUploadHttpService';

export class ImageUploadHttpService implements IImageUploadHttpService {
  private readonly logger = new Logger(ImageUploadHttpService.name);

  static get providerName(): string {
    return providerName;
  }

  async createVideoZip(videoZipDto: VideoZipDto): Promise<VideoZipDto> {
    const response = await axios.post<VideoZipDto>(
      `${imageUploadMicroserviceEndpoint}/video-zip`,
      videoZipDto,
    );
    return response.data;
  }

  async updateVideoZip(videoZipDto: VideoZipDto): Promise<VideoZipDto> {
    const response = await axios.put<VideoZipDto>(
      `${imageUploadMicroserviceEndpoint}/video-zip/${videoZipDto.uuid}`,
      videoZipDto,
    );
    return response.data;
  }

  async getVideoZip(videoZipUuid: string): Promise<VideoZipDto> {
    const response = await axios.get<VideoZipDto>(
      `${imageUploadMicroserviceEndpoint}/video-zip/${videoZipUuid}`,
    );
    return response.data;
  }

  async getImagesByVideoUuid(videoZipUuid: string): Promise<ImageDto[]> {
    const response = await axios.get<ImageDto[]>(
      `${imageUploadMicroserviceEndpoint}/video-zip/${videoZipUuid}/images`,
    );
    return response.data;
  }

  async uploadImage(
    videoUuid: string,
    filename: string,
    image: Blob,
  ): Promise<ImageDto> {
    const formData = new FormData();
    formData.append('file', image, `${filename}`);
    try {
      const response = await axios.post<ImageDto>(
        `${imageUploadMicroserviceEndpoint}/images/${videoUuid}`,
        formData,
      );
      this.logger.log('video enviado com sucesso');
      return response.data;
    } catch (error) {
      this.logger.error(`erro ao enviar video:, ${error.message}`);
    }
  }
}
