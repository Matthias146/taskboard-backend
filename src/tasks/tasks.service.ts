import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entiity/task.entity';
import { User } from '../users/entity/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async findAll(userId: number): Promise<Task[]> {
    return this.taskRepo.find({
      where: { user: { id: userId } },
      relations: ['contact'],
      order: { id: 'DESC' },
    });
  }

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    const { contactId, ...rest } = dto;

    const task = this.taskRepo.create({
      ...rest,
      user,
      contact: contactId ? { id: contactId } : undefined,
    });

    const savedTask = await this.taskRepo.save(task);
    return savedTask;
  }

  async update(id: number, dto: UpdateTaskDto, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!task) throw new NotFoundException('Task nicht gefunden');

    const { contactId, ...rest } = dto;

    this.taskRepo.merge(task, rest);

    if (contactId !== undefined) {
      this.taskRepo.merge(task, {
        contact: contactId ? { id: contactId } : null,
      });
    }

    const updatedTask = await this.taskRepo.save(task);
    return updatedTask;
  }

  async remove(id: number, userId: number) {
    const result = await this.taskRepo.delete({ id, user: { id: userId } });
    if (result.affected === 0)
      throw new NotFoundException('Task nicht gefunden');
  }
}
