import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as IRepository } from '../Repository';
import { AuthEntity } from 'src/entities';
import { Auth } from 'src/shared';

@Injectable()
export class AuthRepository implements IRepository<Auth> {
  static readonly providerName = 'AuthRepository';

  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async findAll(): Promise<Auth[]> {
    return await this.authRepository.find();
  }

  async find(id?: string, status?: string): Promise<Auth[]> {
    const where: any = {};
    if (id) where.id = id;
    if (status) where.isActive = status === 'active';

    return await this.authRepository.find({
      where,
      relations: ['user'],
    });
  }

  async findById(id: number): Promise<Auth> {
    return await this.authRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByToken(token: string): Promise<Auth> {
    return await this.authRepository.findOne({
      where: { token, isActive: true },
      relations: ['user'],
    });
  }

  findByUserId(id: number): Promise<Auth[]> {
    return this.authRepository.find({
      where: { id, isActive: true },
      relations: ['user'],
    });
  }

  create(auth: Auth): Promise<Auth> {
    return this.authRepository.save(auth);
  }

  edit(auth: Auth): Promise<Auth> {
    return this.authRepository.update(auth.id, auth).then(() => auth);
  }

  async delete(id: string): Promise<void> {
    await this.authRepository.delete(id);
  }

  async invalidateToken(token: string): Promise<void> {
    await this.authRepository.update({ token }, { isActive: false });
  }

  async invalidateAllUserTokens(id: number): Promise<void> {
    await this.authRepository.update({ id }, { isActive: false });
  }
}
