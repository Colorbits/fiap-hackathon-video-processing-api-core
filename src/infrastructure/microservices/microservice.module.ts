import { Module } from '@nestjs/common';
import { ImageUploadHttpService } from './image-upload';
import { NotificationHttpService } from './notification';

@Module({
  providers: [
    {
      provide: 'IImageUploadHttpService',
      useClass: ImageUploadHttpService,
    },
    {
      provide: 'INotificationHttpService',
      useClass: NotificationHttpService,
    },
  ],
  exports: [
    {
      provide: 'IImageUploadHttpService',
      useClass: ImageUploadHttpService,
    },
    {
      provide: 'INotificationHttpService',
      useClass: NotificationHttpService,
    },
  ],
})
export class MicroserviceModule {}
