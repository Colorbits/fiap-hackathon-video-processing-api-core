import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/userEntity';

@Entity({ name: 'Auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'token', length: 255 })
  token: string;

  @Column({ name: 'refresh_token', length: 255, nullable: true })
  refreshToken: string;

  @ManyToOne(() => UserEntity, (user) => user, {
    cascade: true,
  })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'device_info', nullable: true })
  deviceInfo: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'last_access', nullable: true })
  lastAccess: Date;
}
