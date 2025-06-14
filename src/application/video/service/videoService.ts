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

  async findById(id: number): Promise<Video> {
    const videos = await this.findVideoUseCase.find(id);
    return videos[0];
  }

  create(videoDto: VideoDto): Promise<Video> {
    return this.createVideoUseCase.create(videoDto);
  }

  find(id?: number, status?: string): Promise<Video[]> {
    if (id || status) {
      return this.findVideoUseCase.find(id, status);
    }
    return this.findAllVideoUseCase.findAll();
  }

  findAll(): Promise<Video[]> {
    return this.findAllVideoUseCase.findAll();
  }

  edit(videoDto: VideoDto): Promise<Video> {
    return this.editVideoUseCase.edit(videoDto);
  }

  delete(id: number): Promise<void> {
    return this.deleteVideoUseCase.delete(id);
  }
}
