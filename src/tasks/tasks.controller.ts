/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { User } from '../users/entity/user.entity';

interface JwtUser {
  id: number;
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
    console.log('➡️ findAll wurde aufgerufen für User:', user.id);
    return this.tasksService.findAll(user.id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const userPayload = req.user as any;
    const userEntity = { id: userPayload.userId } as User;
    return this.tasksService.create(dto, userEntity);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as JwtUser;
    return this.tasksService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as JwtUser;
    return this.tasksService.remove(id, user.id);
  }
}
