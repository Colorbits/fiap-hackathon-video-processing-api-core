import { Inject, Injectable } from '@nestjs/common';
import { User, UserDto } from 'src/shared';
import { UserRepository } from 'src/infrastructure/repositories/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: UserRepository,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const user: User = {
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
    };
    return this.userRepository.create(user);
  }
}
