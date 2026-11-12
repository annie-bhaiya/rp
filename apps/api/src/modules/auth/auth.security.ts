import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable } from '@nestjs/common';

export const demoEnabled = () => process.env.APP_ENV === 'demo' && process.env.PAYPAL_MODE !== 'live';

@Injectable()
export class DemoOnlyGuard implements CanActivate {
  canActivate(): boolean {
    if (!demoEnabled()) throw new ForbiddenException('Demo access is disabled. Please sign in with your email.');
    return true;
  }
}

// Bounded per-process protection. Multi-instance deployments also need ingress rate limits.
@Injectable()
export class AuthRateGuard implements CanActivate {
  private attempts = new Map<string, { count: number; until: number }>();
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    for (const [key, value] of this.attempts) if (value.until <= now) this.attempts.delete(key);
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    const entry = this.attempts.get(key) || { count: 0, until: now + 60_000 };
    if (++entry.count > 20 || this.attempts.size > 10_000) {
      throw new HttpException('Too many sign-in attempts. Please try again in one minute.', 429);
    }
    this.attempts.set(key, entry);
    return true;
  }
}
