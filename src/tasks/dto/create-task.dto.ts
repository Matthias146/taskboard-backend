import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { TaskStatus } from '../entiity/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Milch kaufen',
    description: 'Titel oder kurze Beschreibung des Tasks',
  })
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsIn(['open', 'in_progress', 'done'])
  status?: TaskStatus;
}
