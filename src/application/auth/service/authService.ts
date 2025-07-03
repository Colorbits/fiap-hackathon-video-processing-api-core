import { Inject, Injectable } from '@nestjs/common';
import {
  Auth,
  LoginDto,
  RefreshTokenDto,
  TokenResponseDto,
  User,
} from 'src/shared/models';
import {
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  ValidateTokenUseCase,
} from '../useCases';

@Injectable()
export class AuthService {
  constructor(
    @Inject('LoginUseCase')
    private loginUseCase: LoginUseCase,
    @Inject('LogoutUseCase')
    private logoutUseCase: LogoutUseCase,
    @Inject('RefreshTokenUseCase')
    private refreshTokenUseCase: RefreshTokenUseCase,
    @Inject('ValidateTokenUseCase')
    private validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  login(loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.loginUseCase.login(loginDto);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<Auth> {
    return this.refreshTokenUseCase.refreshToken(refreshTokenDto);
  }

  logout(token: string): Promise<void> {
    return this.logoutUseCase.logout(token);
  }

  logoutAll(userId: number): Promise<void> {
    return this.logoutUseCase.logoutAll(userId);
  }

  validateToken(token: string): Promise<User> {
    return this.validateTokenUseCase.validate(token);
  }
}
