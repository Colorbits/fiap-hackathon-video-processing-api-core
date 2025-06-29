import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { videoStatusEnum } from '../../shared/models';

@Entity({ name: 'Video' })
export class VideoEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'extension' })
  extension: string;

  @Column({ name: 'path' })
  path: string;

  @Column({ name: 'status' })
  status: videoStatusEnum;
}
