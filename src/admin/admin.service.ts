import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entity/user.entity';
import { Task } from '../tasks/entiity/task.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getDashboardStats() {
    const usersCount = await this.userRepo.count();
    const tasksCount = await this.taskRepo.count();

    return {
      usersCount,
      tasksCount,
      generatedAt: new Date().toISOString(),
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.find({
      select: ['id', 'email', 'role', 'createdAt'],
      order: { id: 'ASC' },
    });
  }

  async updateUserRole(id: number, role: UserRole): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User mit ID ${id} nicht gefunden`);

    user.role = role;
    return await this.userRepo.save(user);
  }
}
