import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Max Mustermann' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'max@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+49 123 456789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Musterstraße 1, 12345 Berlin' })
  @IsOptional()
  @IsString()
  address?: string;
}
