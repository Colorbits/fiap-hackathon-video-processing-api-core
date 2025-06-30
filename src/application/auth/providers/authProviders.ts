import { Provider } from '@nestjs/common';
import { AuthService } from '../service/authService';
import {
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  ValidateTokenUseCase,
} from '../useCases';
import { AuthRepository } from '../../../infrastructure/repositories/auth';
import { UserRepository } from '../../../infrastructure/repositories/user';

export const AuthProviders: Provider[] = [
  { provide: 'AuthService', useClass: AuthService },
  {
    provide: 'LoginUseCase',
    inject: [AuthRepository.providerName, UserRepository.providerName],
    useFactory: (
      authRepository: AuthRepository,
      userRepository: UserRepository,
    ): LoginUseCase => new LoginUseCase(userRepository, authRepository),
  },
  {
    provide: 'LogoutUseCase',
    inject: [AuthRepository.providerName],
    useFactory: (repository: AuthRepository): LogoutUseCase =>
      new LogoutUseCase(repository),
  },
  {
    provide: 'RefreshTokenUseCase',
    inject: [AuthRepository.providerName],
    useFactory: (repository: AuthRepository): RefreshTokenUseCase =>
      new RefreshTokenUseCase(repository),
  },
  {
    provide: 'ValidateTokenUseCase',
    inject: [AuthRepository.providerName],
    useFactory: (repository: AuthRepository): ValidateTokenUseCase =>
      new ValidateTokenUseCase(repository),
  },
];
