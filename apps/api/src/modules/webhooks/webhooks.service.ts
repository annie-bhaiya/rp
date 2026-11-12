import { Injectable, BadRequestException } from '@nestjs/common';
import {
  getDb,
  webhookInbox,
  cases,
  messages,
  orders,
  jobs,
  eq,
} from '@resolvepay/db';
import {
  PayPalAdapter,
  PayPalRestClient,
  MockPayPalAdapter,
} from '@resolvepay/integrations';

@Injectable()
export class WebhooksService {
  private paypalAdapter: PayPalAdapter;
  constructor() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (clientId && clientSecret) {
      this.paypalAdapter = new PayPalRestClient({
        clientId,
        clientSecret,
        mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox',
        webhookId: process.env.PAYPAL_WEBHOOK_ID,
      });
    } else {
      this.paypalAdapter = new MockPayPalAdapter();
    }

  }

  async handlePayPalWebhook(headers: Record<string, string>, body: Record<string, unknown>, rawBody: string): Promise<any> {
    const eventId = (body.id as string) || `evt-${Date.now()}`;
    const eventType = (body.event_type as string) || 'UNKNOWN';

    const db = await getDb();

    // Deduplication check (Plan §7.4)
    const [existing] = await db.select().from(webhookInbox).where(eq(webhookInbox.eventId, eventId)).limit(1);
    if (existing) {
      return { status: 'DUPLICATE_IGNORED', eventId };
    }

    // Verify webhook signature if real PayPal configured
    const verified = await this.paypalAdapter.verifyWebhook({
      authAlgo: headers['paypal-auth-algo'] || '',
      certUrl: headers['paypal-cert-url'] || '',
      transmissionId: headers['paypal-transmission-id'] || '',
      transmissionSig: headers['paypal-transmission-sig'] || '',
      transmissionTime: headers['paypal-transmission-time'] || '',
      webhookId: process.env.PAYPAL_WEBHOOK_ID || '',
      webhookEvent: body,
    });

    await db.insert(webhookInbox).values({
      provider: 'PAYPAL',
      eventId,
      rawPayload: rawBody,
      verified,
      state: 'RECEIVED',
    });

    console.log(`[PayPal Webhook] Received verified=${verified} event: ${eventType} (${eventId})`);

    return { status: 'RECEIVED', eventId, verified };
  }

  async handleEmailWebhook(headers: Record<string, string>, body: any, rawBody: string): Promise<any> {
    const eventId = body.id || `mail-${Date.now()}`;
    const db = await getDb();

    await db.insert(webhookInbox).values({
      provider: 'RESEND',
      eventId,
      rawPayload: rawBody,
      verified: true,
      state: 'RECEIVED',
    });

    console.log(`[Email Webhook] Inbound message: ${eventId}`);
    return { status: 'RECEIVED', eventId };
  }
}

