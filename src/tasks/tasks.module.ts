import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entiity/task.entity';
import { TasksGateway } from './tasks.gateway';
import { TaskReminderService } from './task-reminder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, TasksGateway, TaskReminderService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
