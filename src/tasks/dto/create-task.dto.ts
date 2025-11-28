import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  IsISO8601,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { TaskStatus } from '../entiity/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Milch kaufen' })
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['open', 'in_progress', 'done', 'todo'])
  status?: TaskStatus;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  contactId?: number;
}
