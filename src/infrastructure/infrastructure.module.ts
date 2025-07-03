import { Global, Module } from '@nestjs/common';
import { RepositoryModule } from './repositories/repository.module';
import { MulterModule } from '@nestjs/platform-express';
import { MicroserviceModule } from './microservices/microservice.module';

@Global()
@Module({
  imports: [
    MicroserviceModule,
    RepositoryModule.forFeature(),
    MulterModule.register({
      dest: './files',
    }),
  ],
  exports: [RepositoryModule.forFeature()],
})
export class InfrastructureModule {}
