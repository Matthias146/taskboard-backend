import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entiity/task.entity';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly tasksGateway: TasksGateway,
  ) {}

  async findAll(userId: number): Promise<Task[]> {
    return this.taskRepo.find({ where: { user: { id: userId } } });
  }

  async create(dto: CreateTaskDto, userId: number) {
    const task = this.taskRepo.create({
      ...dto,
      user: { id: userId },
    });
    this.tasksGateway.notifyTaskUpdated();

    return await this.taskRepo.save(task);
  }

  async update(id: number, dto: UpdateTaskDto, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task) throw new NotFoundException('Task nicht gefunden');

    Object.assign(task, dto);
    this.tasksGateway.notifyTaskUpdated();
    return this.taskRepo.save(task);
  }

  async remove(id: number, userId: number) {
    const result = await this.taskRepo.delete({ id, user: { id: userId } });

    if (result.affected === 0) {
      throw new NotFoundException('Task nicht gefunden');
    }
    this.tasksGateway.notifyTaskUpdated();
  }
}
