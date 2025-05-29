import { Repository as TypeOrmRepository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/models';
import { UserEntity } from 'src/entities';
import { Repository } from '../Repository';

const providerName = 'IRepository<User>';

@Injectable()
export class UserRepository implements Repository<User> {
  constructor(
    @InjectRepository(UserEntity)
    private repository: TypeOrmRepository<UserEntity>,
  ) {}

  static get providerName(): string {
    return providerName;
  }

  findById(id: number): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne()
      .catch((error) => {
        throw new HttpException(
          `An error occurred while searching the category in the database: '${JSON.stringify(id)}': ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  create(user: User): Promise<User> {
    return this.repository.save(user).catch((error) => {
      throw new HttpException(
        `An error occurred while creating the user to the database: '${JSON.stringify(user)}': ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }

  findAll(): Promise<User[]> {
    return this.repository
      .find()
      .then((userEntities) => {
        return userEntities.map((u) => new User(u));
      })
      .catch((error) => {
        throw new HttpException(
          `An error occurred while searching the user in the database: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  find(id: number): Promise<User[]> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getMany()
      .catch((error) => {
        throw new HttpException(
          `An error occurred while searching the user in the database: '${JSON.stringify(id)}': ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  async delete(categoryId): Promise<void> {
    await this.repository.delete(categoryId);
  }

  edit(category): Promise<User> {
    return this.repository
      .update(category.id, category)
      .then(() => category)
      .catch((error) => {
        throw new HttpException(
          `An error occurred while editing the user to the database: '${JSON.stringify(category)}': ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
