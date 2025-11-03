import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { TasksService } from './tasks.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard) // 🔐 Gilt für alle Routen in diesem Controller
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 🟢 Task erstellen
  @Post()
  @ApiOperation({ summary: 'Erstellt einen neuen Task' })
  @ApiResponse({
    status: 201,
    description: 'Task erfolgreich erstellt.',
    type: TaskResponseDto,
    examples: {
      example: {
        summary: 'Beispiel-Response nach erfolgreichem POST',
        value: {
          id: 5,
          title: 'Einkaufen gehen',
          completed: false,
          createdAt: '2025-11-01T12:34:00Z',
          updatedAt: '2025-11-01T12:34:00Z',
          user: {
            id: 3,
            email: 'max@example.com',
          },
        },
      },
    },
  })
  async create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.tasksService.create(dto.title, user.userId);
  }

  // 🟣 Alle Tasks des eingeloggten Users abrufen
  @Get()
  @ApiOperation({ summary: 'Gibt alle Tasks des eingeloggten Users zurück' })
  @ApiResponse({
    status: 200,
    description: 'Liste aller Tasks.',
    type: [TaskResponseDto],
    examples: {
      example: {
        summary: 'Beispielhafte Task-Liste',
        value: [
          {
            id: 1,
            title: 'Milch kaufen',
            completed: false,
            createdAt: '2025-11-01T10:00:00Z',
            updatedAt: '2025-11-01T10:05:00Z',
            user: {
              id: 3,
              email: 'max@example.com',
            },
          },
        ],
      },
    },
  })
  async findAll(@Req() req: Request) {
    const user = req.user as { userId: number };
    return this.tasksService.findAllForUser(user.userId);
  }

  // 🔵 Einen Task nach ID abrufen
  @Get(':id')
  @ApiOperation({ summary: 'Hole einen bestimmten Task (nur eigene)' })
  @ApiResponse({
    status: 200,
    description: 'Task gefunden.',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task nicht gefunden.' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.tasksService.findOne(id, user.userId);
  }

  // 🟡 Task aktualisieren
  @Patch(':id')
  @ApiOperation({ summary: 'Aktualisiert einen Task (Titel oder Status)' })
  @ApiResponse({
    status: 200,
    description: 'Aktualisierter Task.',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task nicht gefunden.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.tasksService.update(id, dto, user.userId);
  }

  // 🔴 Task löschen
  @Delete(':id')
  @ApiOperation({ summary: 'Löscht einen Task des eingeloggten Users' })
  @ApiResponse({ status: 204, description: 'Task erfolgreich gelöscht.' })
  @ApiResponse({ status: 404, description: 'Task nicht gefunden.' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as { userId: number };
    return this.tasksService.remove(id, user.userId);
  }
}
