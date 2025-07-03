import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { AuthService } from 'src/application/auth/service/authService';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject('AuthService')
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('Acesso negado - Token não fornecido');
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = this.extractTokenFromHeader(authHeader);
    if (!token) {
      this.logger.warn('Acesso negado - Token inválido');
      throw new UnauthorizedException('Token inválido');
    }

    try {
      const user = await this.authService.validateToken(token);
      // Adiciona o usuário ao request para acesso no controlador, se necessário
      request.user = user;
      this.logger.log(`Acesso autorizado para usuário ${user.id}`);
      return true;
    } catch (error) {
      this.logger.warn(`Acesso negado - ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }

  private extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
