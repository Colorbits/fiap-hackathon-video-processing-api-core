import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth, RefreshTokenDto } from 'src/shared/models';
import { AuthRepository } from 'src/infrastructure/repositories/auth';
import { randomBytes } from 'crypto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AuthRepository.providerName)
    private readonly authRepository: AuthRepository,
  ) {}

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<Auth> {
    // Buscar autenticação pelo refresh token
    const authSessions = await this.authRepository.find();
    const authSession = authSessions.find(
      (auth) =>
        auth.refreshToken === refreshTokenDto.refreshToken && auth.isActive,
    );

    if (!authSession) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Verificar se o token está expirado
    if (new Date() > authSession.expiresAt) {
      // Invalidar token expirado
      authSession.isActive = false;
      await this.authRepository.edit(authSession);
      throw new UnauthorizedException('Sessão expirada');
    }

    // Gerar novos tokens
    const token = randomBytes(32).toString('hex');
    const refreshToken = randomBytes(32).toString('hex');

    // Calcular nova data de expiração (1 dia)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // Invalidar token anterior
    authSession.isActive = false;
    await this.authRepository.edit(authSession);

    // Criar novo registro de autenticação
    const newAuth = new Auth({
      token,
      refreshToken,
      expiresAt,
      isActive: true,
      user: authSession.user,
      deviceInfo: authSession.deviceInfo,
      ipAddress: authSession.ipAddress,
      lastAccess: new Date(),
    });

    return this.authRepository.create(newAuth).then((response) => response);
  }
}
