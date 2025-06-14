import { Repository as TypeOrmRepository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/shared/models';
import { VideoEntity } from 'src/entities';
import { Repository } from '../Repository';

const providerName = 'IRepository<Video>';

@Injectable()
export class VideoRepository implements Repository<Video> {
  constructor(
    @InjectRepository(VideoEntity)
    private repository: TypeOrmRepository<VideoEntity>,
  ) {}

  static get providerName(): string {
    return providerName;
  }

  findById(id: number): Promise<Video> {
    return this.repository
      .createQueryBuilder('video')
      .where('video.id = :id', { id: id })
      .getOne()
      .catch((error) => {
        throw new HttpException(
          `An error occurred while searching the video in the database: '${JSON.stringify(id)}': ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  create(video: Video): Promise<Video> {
    return this.repository.save(video).catch((error) => {
      throw new HttpException(
        `An error occurred while creating the video to the database: '${JSON.stringify(video)}': ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  findAll(): Promise<Video[]> {
    return this.repository
      .find()
      .then((videoEntities) => {
        return videoEntities.map((v) => new Video(v));
      })
      .catch((error) => {
        throw new HttpException(
          `An error occurred while searching videos in the database: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  find(id?: number, status?: string): Promise<Video[]> {
    const queryBuilder = this.repository.createQueryBuilder('video');

    if (id) {
      queryBuilder.andWhere('video.id = :id', { id });
    }

    if (status) {
      queryBuilder.andWhere('video.status = :status', { status });
    }

    return queryBuilder.getMany().catch((error) => {
      throw new HttpException(
        `An error occurred while searching the video in the database: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  async delete(videoId: number): Promise<void> {
    await this.repository.delete(videoId);
  }

  edit(video: Video): Promise<Video> {
    return this.repository
      .update(video.id, video)
      .then(() => video)
      .catch((error) => {
        throw new HttpException(
          `An error occurred while editing the video in the database: '${JSON.stringify(video)}': ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
