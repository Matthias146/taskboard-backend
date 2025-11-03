import { Controller, Get, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  @Get('me')
  @ApiOperation({ summary: 'Eigene Benutzerdaten abrufen' })
  @ApiResponse({
    status: 200,
    description: 'Gibt den eingeloggten Benutzer zurück.',
  })
  getProfile(@Req() req: Request) {
    console.log(req);
  }
}
