import { Global, Module } from '@nestjs/common';
import { RepositoryModule } from './repositories/repository.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from './multer/file-upload.config';

@Global()
@Module({
  imports: [
    RepositoryModule.forFeature(),
    MulterModule.register(multerOptionsFactory()),
  ],
  exports: [RepositoryModule.forFeature()],
})
export class InfrastructureModule {}
