import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from './user';

export class LoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  deviceInfo?: string;

  @IsOptional()
  ipAddress?: string;
}

export class TokenResponseDto {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}

export class Auth {
  id?: number;
  token: string;
  refreshToken: string;
  user: User;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  deviceInfo?: string;
  ipAddress?: string;
  lastAccess: Date;

  constructor(partial: Partial<Auth>) {
    Object.assign(this, partial);
  }
}
