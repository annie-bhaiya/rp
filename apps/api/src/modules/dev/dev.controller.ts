import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';
import { WebhooksService } from '../webhooks/webhooks.service.js';
import { getDb, runSeed, runMigrations, sql, webhookInbox, desc, eq } from '@resolvepay/db';

@Controller('dev')
export class DevController {
  constructor(
    private authService: AuthService,
    private webhooksService: WebhooksService,
  ) {}

  @Get('mailbox')
  getMailbox() {
    return {
      count: this.authService.devMailbox.getInbox().length,
      emails: this.authService.devMailbox.getInbox(),
    };
  }

  @Get('whatsapp')
  async getWhatsApp() {
    let recentWebhooks: any[] = [];
    try {
      const db = await getDb();
      recentWebhooks = await db
        .select()
        .from(webhookInbox)
        .where(eq(webhookInbox.provider, 'META_WHATSAPP'))
        .orderBy(desc(webhookInbox.receivedAt))
        .limit(10);
    } catch (err) {
      console.warn('Could not fetch webhook inbox:', err);
    }

    return {
      configured: !!(process.env.META_PHONE_NUMBER_ID && process.env.META_ACCESS_TOKEN),
      phoneNumberId: process.env.META_PHONE_NUMBER_ID || '1384627974742720',
      allowedRecipients: process.env.DEMO_ALLOWED_RECIPIENTS || '9068662279',
      messages: this.webhooksService.getWhatsAppMessages(),
      recentWebhooks: recentWebhooks.map((w) => ({
        id: w.id,
        eventId: w.eventId,
        state: w.state,
        verified: w.verified,
        receivedAt: w.receivedAt,
        rawPayload: (() => {
          try {
            return JSON.parse(w.rawPayload || '{}');
          } catch {
            return w.rawPayload;
          }
        })(),
      })),
    };
  }

  @Post('whatsapp/simulate')
  async simulateWhatsApp(@Body() body: { fromPhone?: string; text?: string }) {
    const from = body.fromPhone || process.env.DEMO_ALLOWED_RECIPIENTS || '9068662279';
    const text = body.text || 'I have a problem with my order.';
    const result = await this.webhooksService.simulateInboundMessage(from, text);
    return {
      success: true,
      result,
      messages: this.webhooksService.getWhatsAppMessages(),
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
