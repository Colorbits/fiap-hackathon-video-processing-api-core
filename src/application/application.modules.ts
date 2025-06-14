import { Module } from '@nestjs/common';
import { UserProviders, UserService } from './user';
import { VideoProviders, VideoService } from './video';

@Module({
  providers: [...UserProviders, ...VideoProviders],
  exports: [
    { provide: 'IService<User>', useClass: UserService },
    { provide: 'IService<Video>', useClass: VideoService },
  ],
})
export class ApplicationModule {}
