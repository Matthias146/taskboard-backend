import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { type Request } from 'express';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔹 Registrierung
  @Post('register')
  @ApiResponse({ status: 201, description: 'User erfolgreich registriert.' })
  async register(
    @Body() body: RegisterDto,
  ): Promise<{ id: number; email: string; role: string }> {
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }

    const hashed = await bcrypt.hash(body.password, 10);

    const user = await this.usersService.create({
      email: body.email,
      password: hashed,
      role: body.role ?? UserRole.USER,
    });

    return { id: user.id, email: user.email, role: user.role };
  }

  // 🔹 Login
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Login erfolgreich. Token zurückgegeben.',
  })
  async login(@Body() body: LoginDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // 🟩 Jetzt auch role im Token speichern
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  // 🔹 Profil abrufen
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({ status: 200, description: 'Aktuell eingeloggter Benutzer.' })
  getProfile(@Req() req: Request): Partial<User> {
    return req.user as Partial<User>;
  }
}
