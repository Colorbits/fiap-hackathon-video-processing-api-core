import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConstants } from '../postgres/postgres.constants';
import { PostgresConfg } from '../postgres/postgres.config';
import { UserRepository } from './user';
import { VideoRepository } from './video';
import { AuthRepository } from './auth';
import { UserEntity, VideoEntity, AutSessionEntity } from 'src/entities';

@Module({
  imports: [
    DatabaseConstants,
    TypeOrmModule.forFeature([UserEntity, VideoEntity, AutSessionEntity]),
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfg],
      useFactory: async (config: TypeOrmModuleOptions) => config,
      inject: [DatabaseConstants.DATABASE_CONFIG_NAME],
    }),
  ],
  providers: [
    {
      provide: UserRepository.providerName,
      useClass: UserRepository,
    },
    {
      provide: VideoRepository.providerName,
      useClass: VideoRepository,
    },
    {
      provide: AuthRepository.providerName,
      useClass: AuthRepository,
    },
  ],
  exports: [
    {
      provide: UserRepository.providerName,
      useClass: UserRepository,
    },
    {
      provide: VideoRepository.providerName,
      useClass: VideoRepository,
    },
    {
      provide: AuthRepository.providerName,
      useClass: AuthRepository,
    },
  ],
})
export class TypeormDatabaseModule {}
