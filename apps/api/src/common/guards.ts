import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionInfo, UserRole } from '@resolvepay/contracts';

export interface AuthenticatedRequest extends Request {
  sessionInfo?: SessionInfo;
  tenantId?: string;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = req.sessionInfo;
    if (!session) {
      throw new UnauthorizedException('Authentication session required');
    }
    return true;
  }
}

@Injectable()
export class MerchantRoleGuard implements CanActivate {
  constructor(private allowedRoles: UserRole[] = ['MERCHANT_OWNER', 'MERCHANT_APPROVER', 'JUDGE']) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = req.sessionInfo;
    if (!session) {
      throw new UnauthorizedException('Authentication session required');
    }
    if (session.actorType !== 'MERCHANT' && session.role !== 'JUDGE') {
      throw new ForbiddenException('Merchant authority required');
    }
    if (session.role && !this.allowedRoles.includes(session.role)) {
      throw new ForbiddenException(`Role ${session.role} not authorized for this action`);
    }
    return true;
  }
}

