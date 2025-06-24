import { Inject, Injectable } from '@nestjs/common';
import { Video, VideoDto } from 'src/shared/models';
import { IService } from 'src/application/iService';
import { FindVideoUseCase } from '../useCases/findVideoUsecase';
import { FindAllVideoUseCase } from '../useCases/findAllVideoUsecase';
import { CreateVideoUseCase } from '../useCases/createVideoUsecase';
import { EditVideoUseCase } from '../useCases/editVideoUsecase';
import { DeleteVideoUseCase } from '../useCases/deleteVideoUsecase';

@Injectable()
export class VideoService implements IService<Video> {
  constructor(
    @Inject('FindVideoUseCase')
    private findVideoUseCase: FindVideoUseCase,
    @Inject('FindAllVideoUseCase')
    private findAllVideoUseCase: FindAllVideoUseCase,
    @Inject('CreateVideoUseCase')
    private createVideoUseCase: CreateVideoUseCase,
    @Inject('EditVideoUseCase')
    private editVideoUseCase: EditVideoUseCase,
    @Inject('DeleteVideoUseCase')
    private deleteVideoUseCase: DeleteVideoUseCase,
  ) {}

  async findById(uuid: string): Promise<Video> {
    const videos = await this.findVideoUseCase.find(uuid);
    return videos[0];
  }

  create(videoDto: VideoDto): Promise<Video> {
    return this.createVideoUseCase.create(videoDto);
  }

  find(uuid?: string, status?: string): Promise<Video[]> {
    if (uuid || status) {
      return this.findVideoUseCase.find(uuid, status);
    }
    return this.findAllVideoUseCase.findAll();
  }

  findAll(): Promise<Video[]> {
    return this.findAllVideoUseCase.findAll();
  }

  edit(videoDto: VideoDto): Promise<Video> {
    return this.editVideoUseCase.edit(videoDto);
  }

  delete(uuid: string): Promise<void> {
    return this.deleteVideoUseCase.delete(uuid);
  }
}
