import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Milch kaufen',
    description: 'Titel oder kurze Beschreibung des Tasks',
  })
  @IsString()
  @MinLength(3)
  title!: string;
}
