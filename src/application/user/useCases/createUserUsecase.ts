import { Inject, Injectable } from '@nestjs/common';
import { User, UserDto } from 'src/shared';
import { UserRepository } from 'src/infrastructure/repositories/user';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: UserRepository,
  ) {}
  create(userDto: UserDto): Promise<User> {
    const user: User = {
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
    };
    return this.userRepository.create(user);
  }
}
