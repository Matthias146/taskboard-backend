import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User mit ID ${id} nicht gefunden`);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
  }
}
