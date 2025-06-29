import { Module } from '@nestjs/common';
import { ImageUploadHttpService } from './image-upload/imageUploadHttpService';

@Module({
  providers: [
    {
      provide: 'IImageUploadHttpService',
      useClass: ImageUploadHttpService,
    },
  ],
  exports: [
    {
      provide: 'IImageUploadHttpService',
      useClass: ImageUploadHttpService,
    },
  ],
})
export class MicroserviceModule {}
