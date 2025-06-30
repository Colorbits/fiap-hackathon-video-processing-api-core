import { Inject, Injectable } from '@nestjs/common';
import { User, UserDto } from 'src/shared';
import { UserRepository } from 'src/infrastructure/repositories/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EditUserUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: UserRepository,
  ) {}

  async edit(userDto: UserDto): Promise<User> {
    // Buscar o usuário existente para verificar se a senha foi alterada
    const existingUsers = await this.userRepository.find(userDto.id, null);
    const existingUser = existingUsers[0];

    let password = userDto.password;

    // Se a senha foi fornecida e é diferente da anterior, criptografar a nova senha
    if (password && (!existingUser || password !== existingUser.password)) {
      password = await bcrypt.hash(password, 10);
    } else if (existingUser) {
      // Se a senha não foi alterada, manter a senha existente
      password = existingUser.password;
    }

    const user: User = {
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
      password: password,
    };

    return this.userRepository.edit(user);
  }
}
