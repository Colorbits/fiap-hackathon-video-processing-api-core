import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from 'src/infrastructure/repositories/auth';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AuthRepository.providerName)
    private readonly authRepository: AuthRepository,
  ) {}

  async logout(token: string): Promise<void> {
    await this.authRepository.invalidateToken(token);
  }

  async logoutAll(userId: number): Promise<void> {
    await this.authRepository.invalidateAllUserTokens(userId);
  }
}
