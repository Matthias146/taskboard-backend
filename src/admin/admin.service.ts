import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
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
}
