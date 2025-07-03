import { Module } from '@nestjs/common';
import { UserProviders, UserService } from './user';
import { VideoProviders, VideoService } from './video';
import { AuthProviders, AuthService } from './auth';

@Module({
  providers: [...UserProviders, ...VideoProviders, ...AuthProviders],
  exports: [
    { provide: 'IService<User>', useClass: UserService },
    { provide: 'IService<Video>', useClass: VideoService },
    { provide: 'AuthService', useClass: AuthService },
  ],
})
export class ApplicationModule {}
