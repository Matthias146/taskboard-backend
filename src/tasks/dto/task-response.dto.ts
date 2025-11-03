import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class TaskResponseDto {
  @ApiProperty({ example: 1, description: 'Eindeutige ID des Tasks' })
  id!: number;

  @ApiProperty({
    example: 'Milch kaufen',
    description: 'Titel oder kurze Beschreibung des Tasks',
  })
  title!: string;

  @ApiProperty({
    example: false,
    description: 'Gibt an, ob der Task abgeschlossen ist',
  })
  completed!: boolean;

  @ApiProperty({
    example: '2025-11-01T10:00:00Z',
    description: 'Zeitpunkt der Erstellung',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2025-11-01T10:05:00Z',
    description: 'Zeitpunkt der letzten Aktualisierung',
  })
  updatedAt!: string;

  @ApiProperty({
    type: () => UserResponseDto,
    description: 'User, dem der Task gehört',
  })
  user!: UserResponseDto;
}
