import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import type { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing email
    const existingEmailUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingEmailUser) {
      throw new ConflictException('User registration failed');
    }

    // Check for existing phone (if provided)
    if (createUserDto.phone) {
      const existingPhoneUser = await this.usersRepository.findOne({
        where: { phone: createUserDto.phone },
      });

      if (existingPhoneUser) {
        throw new ConflictException('User registration failed');
      }
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}