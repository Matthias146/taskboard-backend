import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import type { Request } from 'express';

interface JwtUser {
  userId: number;
  email: string;
  role: string;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as JwtUser;
    console.log('findAll wurde aufgerufen für User:', user.userId);
    return this.tasksService.findAll(user.userId);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.tasksService.create(dto, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtUser;
    return this.tasksService.update(id, dto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.tasksService.remove(id, user.userId);
  }
}
