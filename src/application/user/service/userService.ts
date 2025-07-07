import { Inject, Injectable } from '@nestjs/common';
import { User, UserDto } from 'src/shared/models';
import { IService } from 'src/application/iService';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  EditUserUseCase,
  FindAllUserUseCase,
  FindUserUseCase,
} from '../useCases';

@Injectable()
export class UserService implements IService<User> {
  constructor(
    @Inject('FindUserUseCase')
    private findUserUseCase: FindUserUseCase,
    @Inject('FindAllUserUseCase')
    private findAllUserUseCase: FindAllUserUseCase,
    @Inject('CreateUserUseCase')
    private createUserUseCase: CreateUserUseCase,
    @Inject('EditUserUseCase')
    private editUserUseCase: EditUserUseCase,
    @Inject('DeleteUserUseCase')
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async findById(id: number): Promise<User> {
    const users = await this.findUserUseCase.find(id);
    return users[0];
  }

  create(userDto: UserDto): Promise<User> {
    return this.createUserUseCase.create(userDto);
  }

  find(id?: number): Promise<User[]> {
    if (id) {
      return this.findUserUseCase.find(id);
    }
    return this.findAllUserUseCase.findAll();
  }

  findAll(): Promise<User[]> {
    return this.findAllUserUseCase.findAll();
  }

  edit(userDto: UserDto): Promise<User> {
    return this.editUserUseCase.edit(userDto);
  }

  delete(id: number): Promise<void> {
    return this.deleteUserUseCase.delete(id);
  }
}
