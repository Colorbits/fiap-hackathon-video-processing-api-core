import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from 'src/infrastructure/repositories/auth';
import { User } from 'src/shared/models';

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    @Inject(AuthRepository.providerName)
    private readonly authRepository: AuthRepository,
  ) {}

  async validate(token: string): Promise<User> {
    const authSession = await this.authRepository.findByToken(token);

    if (!authSession) {
      throw new UnauthorizedException('Token inválido');
    }

    // Verificar se o token está expirado
    if (new Date() > authSession.expiresAt) {
      // Invalidar token expirado
      authSession.isActive = false;
      await this.authRepository.edit(authSession);
      throw new UnauthorizedException('Sessão expirada');
    }

    // Atualizar último acesso
    authSession.lastAccess = new Date();
    await this.authRepository.edit(authSession);

    return authSession.user;
  }
}
