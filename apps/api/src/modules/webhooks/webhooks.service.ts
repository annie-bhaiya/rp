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
  MetaWhatsAppClient,
  MockWhatsAppAdapter,
  WhatsAppAdapter,
} from '@resolvepay/integrations';

@Injectable()
export class WebhooksService {
  private paypalAdapter: PayPalAdapter;
  private whatsappAdapter: WhatsAppAdapter;

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

    const phoneId = process.env.META_PHONE_NUMBER_ID;
    const token = process.env.META_ACCESS_TOKEN;
    if (phoneId && token) {
      this.whatsappAdapter = new MetaWhatsAppClient(phoneId, token, process.env.META_APP_SECRET);
    } else {
      this.whatsappAdapter = new MockWhatsAppAdapter();
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

  verifyWhatsAppChallenge(mode: string, token: string, challenge: string): string {
    const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'resolvepay_verify_token';
    if (mode === 'subscribe' && token === expectedToken) {
      return challenge;
    }
    throw new BadRequestException('Verification token mismatch');
  }

  async handleWhatsAppWebhook(headers: Record<string, string>, body: any, rawBody: string): Promise<any> {
    const sig = headers['x-hub-signature-256'] || '';
    const verified = this.whatsappAdapter.verifySignature(rawBody, sig);

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const fromPhone = message?.from;
    const textBody = message?.text?.body;
    const eventId = message?.id || `wa-${Date.now()}`;

    const db = await getDb();
    await db.insert(webhookInbox).values({
      provider: 'META_WHATSAPP',
      eventId,
      rawPayload: rawBody,
      verified,
      state: 'RECEIVED',
    });

    if (textBody && fromPhone) {
      console.log(`[WhatsApp Webhook] Inbound from ${fromPhone}: "${textBody}"`);
      // If customer is sending order reference or query, reply with portal link
      const portalUrl = `${process.env.PUBLIC_WEB_URL || 'http://localhost:3000'}/portal`;
      await this.whatsappAdapter.sendMessage({
        toPhoneNumber: fromPhone,
        messageText: `Hello! ResolvePay has received your message. To link this chat to your order and view remedies, please open: ${portalUrl}`,
      });
    }

    return { status: 'RECEIVED', eventId };
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
