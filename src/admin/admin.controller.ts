import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(UserRole.ADMIN)
  @Get('dashboard')
  async getDashboard() {
    const stats = await this.adminService.getDashboardStats();
    return {
      message: '👑 Willkommen im Adminbereich!',
      stats,
    };
  }

  @Roles(UserRole.ADMIN)
  @Get('users')
  @ApiOperation({ summary: 'Liste aller Benutzer (nur Admin)' })
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  @Roles(UserRole.ADMIN)
  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Ändert die Rolle eines Benutzers (nur Admin)' })
  async updateUserRole(
    @Param('id') id: number,
    @Body() body: { role: UserRole },
  ) {
    return await this.adminService.updateUserRole(id, body.role);
  }
}
