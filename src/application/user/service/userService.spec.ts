import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './userService';
import { User, UserDto } from 'src/shared/models';

// Mock dos casos de uso
const mockFindUserUseCase = {
  find: jest.fn(),
};

const mockFindAllUserUseCase = {
  findAll: jest.fn(),
};

const mockCreateUserUseCase = {
  create: jest.fn(),
};

const mockEditUserUseCase = {
  edit: jest.fn(),
};

const mockDeleteUserUseCase = {
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'FindUserUseCase',
          useValue: mockFindUserUseCase,
        },
        {
          provide: 'FindAllUserUseCase',
          useValue: mockFindAllUserUseCase,
        },
        {
          provide: 'CreateUserUseCase',
          useValue: mockCreateUserUseCase,
        },
        {
          provide: 'EditUserUseCase',
          useValue: mockEditUserUseCase,
        },
        {
          provide: 'DeleteUserUseCase',
          useValue: mockDeleteUserUseCase,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('deve chamar o caso de uso FindUserUseCase e retornar o primeiro usuário encontrado', async () => {
      // Arrange
      const userId = 1;
      const mockUser: User = { 
        id: userId, 
        name: 'Usuário Teste', 
        email: 'usuario@teste.com', 
        password: '123456', 
      };
      mockFindUserUseCase.find.mockResolvedValue([mockUser]);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(mockFindUserUseCase.find).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('deve retornar undefined quando não encontrar o usuário', async () => {
      // Arrange
      const userId = 999;
      mockFindUserUseCase.find.mockResolvedValue([]);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(mockFindUserUseCase.find).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('deve chamar o caso de uso CreateUserUseCase com os dados do usuário', async () => {
      // Arrange
      const userDto: UserDto = { 
        name: 'Novo Usuário', 
        email: 'novo@usuario.com', 
        password: 'senha123', 
      };
      const createdUser: User = { id: 1, ...userDto };
      mockCreateUserUseCase.create.mockResolvedValue(createdUser);

      // Act
      const result = await service.create(userDto);

      // Assert
      expect(mockCreateUserUseCase.create).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('find', () => {
    it('deve chamar FindUserUseCase quando um ID é fornecido', async () => {
      // Arrange
      const userId = 1;
      const mockUser: User = { 
        id: userId, 
        name: 'Usuário Teste', 
        email: 'usuario@teste.com', 
        password: '123456', 
      };
      mockFindUserUseCase.find.mockResolvedValue([mockUser]);

      // Act
      const result = await service.find(userId);

      // Assert
      expect(mockFindUserUseCase.find).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockUser]);
    });

    it('deve chamar FindAllUserUseCase quando nenhum ID é fornecido', async () => {
      // Arrange
      const mockUsers: User[] = [
        { 
          id: 1, 
          name: 'Usuário 1', 
          email: 'usuario1@teste.com', 
          password: '123456', 
        },
        { 
          id: 2, 
          name: 'Usuário 2', 
          email: 'usuario2@teste.com', 
          password: '123456', 
        },
      ];
      mockFindAllUserUseCase.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await service.find();

      // Assert
      expect(mockFindAllUserUseCase.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findAll', () => {
    it('deve chamar o caso de uso FindAllUserUseCase e retornar todos os usuários', async () => {
      // Arrange
      const mockUsers: User[] = [
        { 
          id: 1, 
          name: 'Usuário 1', 
          email: 'usuario1@teste.com', 
          password: '123456', 
        },
        { 
          id: 2, 
          name: 'Usuário 2', 
          email: 'usuario2@teste.com', 
          password: '123456', 
        },
      ];
      mockFindAllUserUseCase.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockFindAllUserUseCase.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('edit', () => {
    it('deve chamar o caso de uso EditUserUseCase com os dados atualizados do usuário', async () => {
      // Arrange
      const userDto: UserDto = { 
        id: 1, 
        name: 'Usuário Atualizado', 
        email: 'atualizado@usuario.com', 
        password: 'novaSenha123', 
      };
      const updatedUser: User = { ...userDto };
      mockEditUserUseCase.edit.mockResolvedValue(updatedUser);

      // Act
      const result = await service.edit(userDto);

      // Assert
      expect(mockEditUserUseCase.edit).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('deve chamar o caso de uso DeleteUserUseCase com o ID correto', async () => {
      // Arrange
      const userId = 1;
      mockDeleteUserUseCase.delete.mockResolvedValue(undefined);

      // Act
      await service.delete(userId);

      // Assert
      expect(mockDeleteUserUseCase.delete).toHaveBeenCalledWith(userId);
    });
  });

  describe('error handling', () => {
    it('deve propagar erros lançados pelo caso de uso findById', async () => {
      // Arrange
      const userId = 1;
      const errorMessage = 'Erro ao buscar usuário';
      mockFindUserUseCase.find.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.findById(userId)).rejects.toThrow(errorMessage);
      expect(mockFindUserUseCase.find).toHaveBeenCalledWith(userId);
    });

    it('deve propagar erros lançados pelo caso de uso create', async () => {
      // Arrange
      const userDto: UserDto = { 
        name: 'Novo Usuário', 
        email: 'novo@usuario.com', 
        password: 'senha123', 
      };
      const errorMessage = 'Erro ao criar usuário';
      mockCreateUserUseCase.create.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.create(userDto)).rejects.toThrow(errorMessage);
      expect(mockCreateUserUseCase.create).toHaveBeenCalledWith(userDto);
    });

    it('deve propagar erros lançados pelo caso de uso edit', async () => {
      // Arrange
      const userDto: UserDto = { 
        id: 1, 
        name: 'Usuário Atualizado', 
        email: 'atualizado@usuario.com', 
        password: 'novaSenha123', 
      };
      const errorMessage = 'Erro ao atualizar usuário';
      mockEditUserUseCase.edit.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.edit(userDto)).rejects.toThrow(errorMessage);
      expect(mockEditUserUseCase.edit).toHaveBeenCalledWith(userDto);
    });

    it('deve propagar erros lançados pelo caso de uso delete', async () => {
      // Arrange
      const userId = 1;
      const errorMessage = 'Erro ao excluir usuário';
      mockDeleteUserUseCase.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(service.delete(userId)).rejects.toThrow(errorMessage);
      expect(mockDeleteUserUseCase.delete).toHaveBeenCalledWith(userId);
    });
  });
});
