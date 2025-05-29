import { User } from 'src/shared/models';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/user';
import { Repository } from 'src/infrastructure/repositories/Repository';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: Repository<User>,
  ) {}
  find(id: number): Promise<User[]> {
    return this.userRepository.find(id);
  }
}
