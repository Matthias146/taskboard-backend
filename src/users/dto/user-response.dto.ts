import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 3, description: 'Eindeutige ID des Users' })
  id!: number;

  @ApiProperty({ example: 'max@example.com', description: 'E-Mail des Users' })
  email!: string;
}
