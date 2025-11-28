import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { Type } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: 'Neue Überschrift' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  contactId?: number;
}
