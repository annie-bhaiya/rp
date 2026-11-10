import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';
import { getDb, runSeed, runMigrations, sql } from '@resolvepay/db';

@Controller('dev')
export class DevController {
  constructor(private authService: AuthService) {}

  @Get('mailbox')
  getMailbox() {
    return {
      count: this.authService.devMailbox.getInbox().length,
      emails: this.authService.devMailbox.getInbox(),
    };
  }

  @Get('health')
  async getHealth() {
    try {
      const db = await getDb();
      const res = await db.execute(sql`SELECT count(*) as count FROM tenants`);
      const count = (res as any)?.rows?.[0]?.count ?? (res as any)?.[0]?.count ?? 1;
      return {
        status: 'OK',
        app: 'ResolvePay Rescue API',
        timestamp: new Date().toISOString(),
        database: 'Connected',
        tenantsCount: count,
      };
    } catch (err) {
      return {
        status: 'DEGRADED',
        error: (err as Error).message,
      };
    }
  }

  @Post('seed')
  async reSeed() {
    await runSeed();
    return { success: true, message: 'Database migrated and seeded successfully.' };
  }
}
