import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entity/user.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as { userId: number; email: string; role: UserRole };
    return await this.usersService.findOne(user.userId);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request) {
    const currentUser = req.user as { role: UserRole };

    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Nur Admins dürfen löschen');
    }

    await this.usersService.remove(id);
    return { success: true, message: `User ${id} gelöscht` };
  }
}
