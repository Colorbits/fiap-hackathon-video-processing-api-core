import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  // UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IService } from '../../application/iService';
import { User, UserDto } from '../../shared/models';
// import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Usuários')
@Controller('users')
export class UserApi {
  private readonly logger = new Logger(UserApi.name);

  constructor(@Inject('IService<User>') private userService: IService<User>) {}

  @ApiOperation({
    summary: 'Obter todos os usuários',
    description:
      'Retorna uma lista de todos os usuários disponíveis no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
  })
  @ApiResponse({ status: 500, description: 'Erro ao buscar usuários.' })
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Buscar usuários por filtro',
    description:
      'Busca um usuário específico com base no ID ou email do usuário.',
  })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description: 'ID do usuário a ser buscado',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Email do usuário a ser buscado',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário(s) encontrado(s) com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar o usuário.' })
  @Get(':id')
  // @UseInterceptors(CacheInterceptor)
  find(@Param('id') id?: number): Promise<User[]> {
    return this.userService.find(id);
  }

  @ApiOperation({
    summary: 'Criar um novo usuário',
    description: 'Cria um novo usuário com base nos dados fornecidos.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos para criação do usuário.',
  })
  @ApiResponse({ status: 500, description: 'Erro ao criar o usuário.' })
  @Post()
  async create(@Body() userDto: UserDto): Promise<User> {
    const user = await this.userService.create(userDto);
    this.logger.debug(`Created user: ${JSON.stringify(user)}`);
    return user;
  }

  @ApiOperation({
    summary: 'Editar um usuário existente',
    description:
      'Atualiza os dados de um usuário específico com base no ID fornecido.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos para atualização do usuário.',
  })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar o usuário.' })
  @Put(':id')
  async edit(@Param('id') id: number, @Body() userDto: UserDto): Promise<User> {
    const updatedUser = await this.userService.edit({
      ...userDto,
      id,
    });
    this.logger.debug(`Updated user: ${JSON.stringify(updatedUser)}`);
    return updatedUser;
  }

  @ApiOperation({
    summary: 'Remover um usuário',
    description: 'Exclui um usuário específico com base no ID fornecido.',
  })
  @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao remover o usuário.' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.userService.delete(id);
    this.logger.debug(`Deleted user with id: ${id}`);
  }
}
