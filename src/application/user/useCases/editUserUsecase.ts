import { Inject, Injectable } from '@nestjs/common';
import { User, UserDto } from 'src/shared';
import { UserRepository } from 'src/infrastructure/repositories/user';

@Injectable()
export class EditUserUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: UserRepository,
  ) {}
  edit(userDto: UserDto): Promise<User> {
    const user: User = {
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
    };
    return this.userRepository.edit(user);
  }
}
