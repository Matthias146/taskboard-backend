import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
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
}
