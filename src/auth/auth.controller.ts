import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { UserRole } from '../users/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
  ): Promise<{ id: number; email: string; role: UserRole }> {
    const currentUser = req.user as
      | { userId: number; role: UserRole }
      | undefined;

    if (!currentUser) {
      if (dto.role && dto.role !== UserRole.USER) {
        throw new UnauthorizedException(
          'Nur Admins dürfen Admin-Accounts erstellen.',
        );
      }

      const user = await this.authService.register({
        ...dto,
        role: UserRole.USER,
      });
      return { id: user.id, email: user.email, role: user.role };
    }

    if (currentUser.role !== UserRole.ADMIN) {
      if (dto.role === UserRole.ADMIN) {
        throw new UnauthorizedException(
          'Nur Admins dürfen andere Admins anlegen.',
        );
      }
    }

    const user = await this.authService.register(dto);
    return { id: user.id, email: user.email, role: user.role };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
