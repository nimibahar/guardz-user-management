import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/user.entity';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.find.mockReset();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      company: 'Test Company',
    };

    it('should successfully create a user', async () => {
      const savedUser = { id: 1, ...createUserDto, createdAt: new Date() };
      
      mockRepository.findOne
        .mockResolvedValueOnce(null) // Email check - no conflict
        .mockResolvedValueOnce(null); // Phone check - no conflict
      mockRepository.create.mockReturnValue(savedUser);
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { phone: createUserDto.phone },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingUser = { id: 1, ...createUserDto, createdAt: new Date() };
      
      mockRepository.findOne
        .mockResolvedValueOnce(existingUser) // First call for email check
        .mockResolvedValueOnce(null); // Second call for phone check (won't be reached)

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when phone already exists', async () => {
      const existingPhoneUser = { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: createUserDto.phone, createdAt: new Date() };
      
      // First call (email check) returns null, second call (phone check) returns existing user
      mockRepository.findOne
        .mockResolvedValueOnce(null) // Email check - no conflict
        .mockResolvedValueOnce(existingPhoneUser); // Phone check - conflict found

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should create user when phone is not provided', async () => {
      const createUserDtoNoPhone = { ...createUserDto, phone: undefined };
      const savedUser = { id: 1, ...createUserDtoNoPhone, createdAt: new Date() };
      
      mockRepository.findOne.mockResolvedValueOnce(null); // Only email check, no phone check needed
      mockRepository.create.mockReturnValue(savedUser);
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDtoNoPhone);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1); // Only email check
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDtoNoPhone.email },
      });
      expect(result).toEqual(savedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', createdAt: new Date() },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', createdAt: new Date() },
      ];
      
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

});