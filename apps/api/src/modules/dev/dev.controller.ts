import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DemoOnlyGuard } from '../auth/auth.security.js';
import { AuthService } from '../auth/auth.service.js';
import { FailureInjectionService, FailureInjectionType } from './failure-injection.service.js';
import { getDb, runSeed, runMigrations, sql, webhookInbox, desc, eq } from '@resolvepay/db';

@Controller('dev')
export class DevController {
  constructor(
    private authService: AuthService,
    private failureInjectionService: FailureInjectionService,
  ) {}

  @Get('failure-injection')
  getFailureInjection() {
    return this.failureInjectionService.getStatus();
  }

  @Post('failure-injection')
  setFailureInjection(@Body() body: { type?: FailureInjectionType; enabled?: boolean }) {
    if (body.enabled === false || body.type === 'NONE') {
      this.failureInjectionService.setSimulation('NONE');
    } else {
      this.failureInjectionService.setSimulation('REFUND_TIMEOUT_SIMULATION');
    }
    return this.failureInjectionService.getStatus();
  }

  @Get('mailbox')
  @UseGuards(DemoOnlyGuard)
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
  @UseGuards(DemoOnlyGuard)
  async reSeed() {
    await runSeed();
    return { success: true, message: 'Database migrated and seeded successfully.' };
  }
}
