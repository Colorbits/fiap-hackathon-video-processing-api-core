import { Provider } from '@nestjs/common';
import { UserService } from '../service/userService';
import {
  FindUserUseCase,
  DeleteUserUseCase,
  EditUserUseCase,
  FindAllUserUseCase,
  CreateUserUseCase,
} from '../useCases';
import { UserRepository } from '../../../infrastructure/repositories/user';

export const UserProviders: Provider[] = [
  { provide: 'IService<User>', useClass: UserService },
  {
    provide: 'FindUserUseCase',
    inject: [UserRepository.providerName],
    useFactory: (repository: UserRepository): FindUserUseCase =>
      new FindUserUseCase(repository),
  },
  {
    provide: 'FindAllUserUseCase',
    inject: [UserRepository.providerName],
    useFactory: (repository: UserRepository): FindAllUserUseCase =>
      new FindAllUserUseCase(repository),
  },
  {
    provide: 'CreateUserUseCase',
    inject: [UserRepository.providerName],
    useFactory: (repository: UserRepository): CreateUserUseCase =>
      new CreateUserUseCase(repository),
  },
  {
    provide: 'EditUserUseCase',
    inject: [UserRepository.providerName],
    useFactory: (repository: UserRepository): EditUserUseCase =>
      new EditUserUseCase(repository),
  },
  {
    provide: 'DeleteUserUseCase',
    inject: [UserRepository.providerName],
    useFactory: (repository: UserRepository): DeleteUserUseCase =>
      new DeleteUserUseCase(repository),
  },
];
