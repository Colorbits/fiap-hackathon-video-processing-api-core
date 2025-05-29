import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/user';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(UserRepository.providerName)
    private readonly userRepository: UserRepository,
  ) {}

  async delete(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpException(
        `User not found with id: ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.userRepository.delete(userId);
  }
}
