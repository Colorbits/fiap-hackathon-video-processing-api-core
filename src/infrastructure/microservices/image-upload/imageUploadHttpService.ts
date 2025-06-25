import axios from 'axios';
import { IImageUploadHttpService } from './IImageUploadHttpService';
import { VideoZipDto, ImageDto } from '../../../shared';

const imageUploadMicroserviceEndpoint =
  process.env.PRODUCT_IMAGE_MICROSERVICE_URL;

export class ImageUploadHttpService implements IImageUploadHttpService {
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
    formData.append('images', image, `${filename}.jpg`);

    const response = await axios.post<ImageDto>(
      `${imageUploadMicroserviceEndpoint}/video-zip/${videoUuid}/images`,
      formData,
    );
    return response.data;
  }
}
