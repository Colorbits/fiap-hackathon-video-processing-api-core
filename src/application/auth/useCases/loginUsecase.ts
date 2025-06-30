import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Auth, LoginDto, TokenResponseDto } from 'src/shared/models';
import { UserRepository } from 'src/infrastructure/repositories/user';
import { AuthRepository } from 'src/infrastructure/repositories/auth';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: UserRepository,
    @Inject(AuthRepository.providerName)
    private readonly authRepository: AuthRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    // Buscar usuário por email
    const users = await this.userRepository.find(null, loginDto.email);

    if (!users || users.length === 0) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const user = users[0];

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar tokens
    const token = randomBytes(32).toString('hex');
    const refreshToken = randomBytes(32).toString('hex');

    // Calcular data de expiração (1 dia)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const auth: Auth = {
      user,
      token,
      refreshToken,
      expiresAt,
      isActive: true,
      deviceInfo: loginDto.deviceInfo,
      ipAddress: loginDto.ipAddress,
      lastAccess: new Date(),
      createdAt: new Date(),
    };

    // Criar registro de autenticação
    const response = await this.authRepository.create(auth);

    return response as TokenResponseDto;
  }
}
