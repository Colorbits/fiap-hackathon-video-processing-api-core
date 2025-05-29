import { Module } from '@nestjs/common';
import { UserProviders, UserService } from './user';

@Module({
  providers: [...UserProviders],
  exports: [{ provide: 'IService<User>', useClass: UserService }],
})
export class ApplicationModule {}
