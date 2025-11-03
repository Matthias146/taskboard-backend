import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new ForbiddenException('No authorization header');

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.decode<{ role?: UserRole }>(token);

    if (!decoded || typeof decoded !== 'object') {
      throw new ForbiddenException('Invalid token');
    }

    const payload = decoded as { role?: UserRole };

    if (!payload?.role) throw new ForbiddenException('Missing role in token');

    if (!requiredRoles.includes(payload.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
