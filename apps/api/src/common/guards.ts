import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionInfo, UserRole } from '@resolvepay/contracts';
import { getDb, cases, eq, and } from '@resolvepay/db';

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
export class CaseAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = req.sessionInfo;
    if (!session) throw new UnauthorizedException('Please sign in to continue.');
    if (session.actorType !== 'CUSTOMER' || !req.params.id) return true;
    const db = await getDb();
    const [record] = await db.select({ orderId: cases.orderId }).from(cases)
      .where(and(eq(cases.id, String(req.params.id)), eq(cases.tenantId, session.tenantId))).limit(1);
    if (!record || !session.orderId || record.orderId !== session.orderId) {
      throw new ForbiddenException('This case belongs to another order. Use its secure access link.');
    }
    return true;
  }
}

@Injectable()
export class MerchantRoleGuard implements CanActivate {
  private allowedRoles: UserRole[] = ['MERCHANT_OWNER', 'MERCHANT_APPROVER', 'JUDGE'];

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const session = req.sessionInfo;
    if (!session) {
      throw new UnauthorizedException('Authentication session required');
    }
    if (session.actorType !== 'MERCHANT') {
      throw new ForbiddenException('Merchant authority required');
    }
    if (!session.role || !this.allowedRoles.includes(session.role)) {
      throw new ForbiddenException(`Role ${session.role} not authorized for this action`);
    }
    return true;
  }
}

