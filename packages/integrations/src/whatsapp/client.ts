import { createHmac } from 'node:crypto';

export interface WhatsAppSendParams {
  toPhoneNumber: string;
  messageText: string;
}

export interface WhatsAppSendResult {
  id: string;
  success: boolean;
  error?: string;
}

export interface WhatsAppAdapter {
  sendMessage(params: WhatsAppSendParams): Promise<WhatsAppSendResult>;
  verifySignature(rawBody: string, signatureHeader: string): boolean;
}

export class MetaWhatsAppClient implements WhatsAppAdapter {
  constructor(
    private phoneNumberId: string,
    private accessToken: string,
    private appSecret?: string
  ) {}

  async sendMessage(params: WhatsAppSendParams): Promise<WhatsAppSendResult> {
    const url = `https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: params.toPhoneNumber,
          type: 'text',
          text: { body: params.messageText },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { id: '', success: false, error: errText };
      }

      const data = (await res.json()) as { messages?: Array<{ id: string }> };
      return {
        id: data.messages?.[0]?.id || `wa-${Date.now()}`,
        success: true,
      };
    } catch (err) {
      return { id: '', success: false, error: (err as Error).message };
    }
  }

  verifySignature(rawBody: string, signatureHeader: string): boolean {
    if (!this.appSecret || !signatureHeader) return true;
    const expectedSig = createHmac('sha256', this.appSecret).update(rawBody).digest('hex');
    const signature = signatureHeader.replace('sha256=', '');
    return expectedSig === signature;
  }
}

export class MockWhatsAppAdapter implements WhatsAppAdapter {
  private sentMessages: Array<{ to: string; text: string; sentAt: string }> = [];

  async sendMessage(params: WhatsAppSendParams): Promise<WhatsAppSendResult> {
    const id = `mock-wa-${Date.now()}`;
    this.sentMessages.push({
      to: params.toPhoneNumber,
      text: params.messageText,
      sentAt: new Date().toISOString(),
    });
    console.log(`[MockWhatsApp] Sent message to ${params.toPhoneNumber}: "${params.messageText}"`);
    return { id, success: true };
  }

  verifySignature(_rawBody: string, _signatureHeader: string): boolean {
    return true;
  }

  getSentMessages() {
    return [...this.sentMessages];
  }
}

