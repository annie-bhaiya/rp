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

export interface WhatsAppMessageItem {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  phone: string;
  text: string;
  timestamp: string;
  verified?: boolean;
}

@Injectable()
export class WebhooksService {
  private paypalAdapter: PayPalAdapter;
  private whatsappAdapter: WhatsAppAdapter;
  private liveWhatsAppMessages: WhatsAppMessageItem[] = [
    {
      id: 'wa-init-1',
      direction: 'OUTBOUND',
      phone: 'system',
      text: 'ResolvePay Automated Dispute Service ready. Send your message or order reference anytime to trigger immediate remedy options.',
      timestamp: new Date().toISOString(),
      verified: true,
    },
  ];

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

    let replyText = '';
    if (textBody && fromPhone) {
      this.liveWhatsAppMessages.push({
        id: eventId,
        direction: 'INBOUND',
        phone: fromPhone,
        text: textBody,
        timestamp: new Date().toISOString(),
        verified,
      });

      console.log(`[WhatsApp Webhook] Inbound from ${fromPhone}: "${textBody}"`);
      // If customer is sending order reference or query, reply with portal link
      const portalUrl = `${process.env.PUBLIC_WEB_URL || 'https://resolvepay-web.politetree-c3c2d975.centralindia.azurecontainerapps.io'}/portal`;
      replyText = `Hello! ResolvePay has received your message. To link this chat to your order and view remedies, please open: ${portalUrl}`;

      this.liveWhatsAppMessages.push({
        id: `wa-out-${Date.now()}`,
        direction: 'OUTBOUND',
        phone: fromPhone,
        text: replyText,
        timestamp: new Date().toISOString(),
        verified: true,
      });

      try {
        await this.whatsappAdapter.sendMessage({
          toPhoneNumber: fromPhone,
          messageText: replyText,
        });
      } catch (err: any) {
        console.warn(`[WhatsApp] Meta Graph API dispatch note (fallback to simulator): ${err?.message || err}`);
      }
    }

    return { status: 'RECEIVED', eventId, verified, replyText };
  }

  getWhatsAppMessages(): WhatsAppMessageItem[] {
    return [...this.liveWhatsAppMessages];
  }

  async simulateInboundMessage(fromPhone: string, text: string) {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: process.env.META_PHONE_NUMBER_ID || '1384627974742720',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '15550269041',
                  phone_number_id: process.env.META_PHONE_NUMBER_ID || '1384627974742720',
                },
                contacts: [
                  {
                    profile: { name: 'Customer' },
                    wa_id: fromPhone,
                  },
                ],
                messages: [
                  {
                    from: fromPhone,
                    id: `wamid.SIM${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: { body: text },
                    type: 'text',
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };

    const raw = JSON.stringify(payload);
    return this.handleWhatsAppWebhook({}, payload, raw);
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

