import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from '../../users/entity/user.entity';

export class RegisterDto {
  @ApiProperty({
    example: 'max@example.com',
    description: 'E-Mail-Adresse des Benutzers',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Passwort des Benutzers (mind. 6 Zeichen)',
  })
  @IsString()
  @MinLength(6, {
    message: 'Das Passwort muss mindestens 6 Zeichen lang sein.',
  })
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.USER,
    description: 'Optionale Benutzerrolle (nur für Admins relevant)',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Rolle muss "user" oder "admin" sein.' })
  role?: UserRole;
}
