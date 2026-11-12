import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { createHash } from 'node:crypto';
import { getDb, sessions, tenants, users, memberships, eq, and } from '@resolvepay/db';
import { AuthenticatedRequest } from './guards.js';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  async use(req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.['resolvepay_session'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken;

    if (!token) {
      return next();
    }

    try {
      const tokenHash = createHash('sha256').update(token).digest('hex');
      const db = await getDb();
      const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.tokenHash, tokenHash))
        .limit(1);

      if (session && !session.revokedAt && new Date(session.expiresAt) > new Date() && ['CUSTOMER', 'MERCHANT'].includes(session.actorType)) {
        const [tenant] = await db
          .select()
          .from(tenants)
          .where(eq(tenants.id, session.tenantId))
          .limit(1);

        if (!tenant || tenant.status !== 'ACTIVE') return next();
        if (session.actorType === 'MERCHANT') {
          const [member] = await db.select({ role: memberships.role }).from(memberships)
            .innerJoin(users, eq(users.id, memberships.userId))
            .where(and(eq(memberships.userId, session.actorId), eq(memberships.tenantId, session.tenantId),
              eq(memberships.status, 'ACTIVE'), eq(users.status, 'ACTIVE'))).limit(1);
          if (!member) return next();
          session.role = member.role;
        }

        req.sessionInfo = {
          sessionId: session.id,
          actorType: session.actorType as 'CUSTOMER' | 'MERCHANT' | 'OPERATOR',
          actorId: session.actorId,
          tenantId: session.tenantId,
          tenantSlug: tenant?.slug || 'default-merchant',
          role: session.role as any,
          customerEmail: session.customerEmail || undefined,
          orderId: session.orderId || undefined,
          expiresAt: session.expiresAt.toISOString(),
        };
        req.tenantId = session.tenantId;
      }
    } catch (err) {
      console.error('[SessionMiddleware] Error validating session:', err);
    }

    next();
  }
}

