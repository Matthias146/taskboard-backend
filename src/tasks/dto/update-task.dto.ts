import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    example: 'Neue Überschrift',
    description: 'Optionaler neuer Titel für den Task',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Gibt an, ob der Task abgeschlossen ist',
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({
    example: '2025-12-24',
    description: 'Fälligkeitsdatum',
  })
  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
