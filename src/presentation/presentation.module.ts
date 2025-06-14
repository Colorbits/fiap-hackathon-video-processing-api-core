import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { HealthApi, UserApi, VideoApi } from './api';
import { ApplicationModule } from '../application';

@Module({
  imports: [InfrastructureModule, ApplicationModule],
  controllers: [HealthApi, UserApi, VideoApi],
})
export class PresentationModule {}
