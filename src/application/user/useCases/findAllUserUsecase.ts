// filepath: /Users/gabrielumbelino/git/fiap/fiap-hackathon-video-processing-api-core/src/application/user/useCases/findAllUserUsecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/shared';
import { UserRepository } from 'src/infrastructure/repositories/user';

@Injectable()
export class FindAllUserUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: UserRepository,
  ) {}
  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
