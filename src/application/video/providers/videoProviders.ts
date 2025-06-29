import { Provider } from '@nestjs/common';
import { VideoService } from '../service/videoService';
import { VideoRepository } from '../../../infrastructure/repositories/video';
import { FindVideoUseCase } from '../useCases/findVideoUsecase';
import { DeleteVideoUseCase } from '../useCases/deleteVideoUsecase';
import { EditVideoUseCase } from '../useCases/editVideoUsecase';
import { FindAllVideoUseCase } from '../useCases/findAllVideoUsecase';
import { CreateVideoUseCase } from '../useCases/createVideoUsecase';
import { ImageUploadHttpService } from '../../../infrastructure/microservices/image-upload/imageUploadHttpService';

export const VideoProviders: Provider[] = [
  { provide: 'IService<Video>', useClass: VideoService },
  {
    provide: ImageUploadHttpService.providerName,
    useClass: ImageUploadHttpService,
  },
  {
    provide: 'FindVideoUseCase',
    inject: [VideoRepository.providerName],
    useFactory: (repository: VideoRepository): FindVideoUseCase =>
      new FindVideoUseCase(repository),
  },
  {
    provide: 'FindAllVideoUseCase',
    inject: [VideoRepository.providerName],
    useFactory: (repository: VideoRepository): FindAllVideoUseCase =>
      new FindAllVideoUseCase(repository),
  },
  {
    provide: 'CreateVideoUseCase',
    inject: [VideoRepository.providerName],
    useFactory: (repository: VideoRepository): CreateVideoUseCase =>
      new CreateVideoUseCase(repository),
  },
  {
    provide: 'EditVideoUseCase',
    inject: [VideoRepository.providerName],
    useFactory: (repository: VideoRepository): EditVideoUseCase =>
      new EditVideoUseCase(repository),
  },
  {
    provide: 'DeleteVideoUseCase',
    inject: [VideoRepository.providerName],
    useFactory: (repository: VideoRepository): DeleteVideoUseCase =>
      new DeleteVideoUseCase(repository),
  },
];
