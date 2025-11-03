import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Task } from './entiity/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(title: string, userId: number): Promise<Task> {
    const task = this.taskRepo.create({
      title,
      user: { id: userId } as unknown as User,
    });
    return await this.taskRepo.save(task);
  }

  async findAllForUser(userId: number): Promise<Task[]> {
    return await this.taskRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto, userId?: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id, ...(userId ? { user: { id: userId } } : {}) },
    });

    if (!task) throw new NotFoundException(`Task mit ID ${id} nicht gefunden`);

    Object.assign(task, dto);
    return await this.taskRepo.save(task);
  }

  async remove(id: number, userId?: number): Promise<void> {
    const task = await this.taskRepo.findOne({
      where: { id, ...(userId ? { user: { id: userId } } : {}) },
    });

    if (!task) throw new NotFoundException(`Task mit ID ${id} nicht gefunden`);

    await this.taskRepo.remove(task);
  }
}
