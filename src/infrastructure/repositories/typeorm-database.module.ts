import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConstants } from '../postgres/postgres.constants';
import { PostgresConfg } from '../postgres/postgres.config';
import { UserRepository } from './user';
import { UserEntity } from 'src/entities';

@Module({
  imports: [
    DatabaseConstants,
    TypeOrmModule.forFeature([UserEntity]),
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
  ],
  exports: [
    {
      provide: UserRepository.providerName,
      useClass: UserRepository,
    },
  ],
})
export class TypeormDatabaseModule {}
