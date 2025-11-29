import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    // 🔓 Wenn kein Token im Header → Zugriff erlauben
    if (!authHeader) {
      return true;
    }

    // 🔐 Wenn Token vorhanden → normale Prüfung
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any): any {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
