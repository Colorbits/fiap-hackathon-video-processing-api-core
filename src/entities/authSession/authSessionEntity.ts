import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/userEntity';

@Entity({ name: 'AuthSession' })
export class AutSessionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => UserEntity, (user) => user, {
    cascade: true,
  })
  user: UserEntity;

  @Column({ name: 'token', length: 255 })
  token: string;

  @Column({ name: 'expiresAt' })
  expiresAt: Date;

  @Column({ name: 'refreshToken', length: 255, nullable: true })
  refreshToken: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'isActive', default: true })
  isActive: boolean;

  @Column({ name: 'deviceInfo', nullable: true })
  deviceInfo: string;

  @Column({ name: 'ipAddress', nullable: true })
  ipAddress: string;

  @Column({ name: 'lastAccess', nullable: true })
  lastAccess: Date;
}
