import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserRole } from '../users/entity/user.entity';
import { OptionalJwtAuthGuard } from './jwt/optional-jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { UsersService } from '../users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ): Promise<{ id: number; email: string; role: UserRole }> {
    const currentUser = req.user as
      | { userId: number; role: UserRole }
      | undefined;

    // 🔹 Fall 1: Kein eingeloggter User → normale Registrierung (nur USER)
    if (!currentUser) {
      if (dto.role && dto.role !== UserRole.USER) {
        throw new ForbiddenException(
          'Nur Admins dürfen Admin-Accounts erstellen.',
        );
      }

      const user = await this.authService.register({
        ...dto,
        role: UserRole.USER,
      });
      return { id: user.id, email: user.email, role: user.role };
    }

    // 🔹 Fall 2: Eingeloggt, aber kein Admin
    if (currentUser.role !== UserRole.ADMIN) {
      if (dto.role && dto.role !== UserRole.USER) {
        throw new ForbiddenException(
          'Nur Admins dürfen Admin-Accounts erstellen.',
        );
      }
    }

    // 🔹 Fall 3: Admin darf beliebige Rolle anlegen
    const user = await this.authService.register(dto);
    return { id: user.id, email: user.email, role: user.role };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me')
  getProfile(@Req() req: Request) {
    const user = req.user as { userId: number; email: string; role: UserRole };
    return this.usersService.findOne(user.userId);
  }
}
