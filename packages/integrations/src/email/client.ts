import { Resend } from 'resend';
import { EmailAdapter, EmailSendParams, EmailSendResult } from './types.js';

export class ResendEmailClient implements EmailAdapter {
  private resend: Resend;
  private defaultFrom: string;

  constructor(apiKey: string, defaultFrom: string = 'resolvepay@divyansh.live') {
    this.resend = new Resend(apiKey);
    this.defaultFrom = defaultFrom;
  }

  async sendEmail(params: EmailSendParams): Promise<EmailSendResult> {
    try {
      const response = await this.resend.emails.send({
        from: params.from || this.defaultFrom,
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html,
        replyTo: params.replyTo,
      });

      if (response.error) {
        return {
          id: '',
          success: false,
          error: response.error.message,
        };
      }

      return {
        id: response.data?.id || `resend-${Date.now()}`,
        success: true,
      };
    } catch (err) {
      return {
        id: '',
        success: false,
        error: (err as Error).message,
      };
    }
  }
}

export interface SentMailRecord extends EmailSendParams {
  id: string;
  sentAt: string;
}

export class DevMailboxClient implements EmailAdapter {
  private sentMails: SentMailRecord[] = [];

  async sendEmail(params: EmailSendParams): Promise<EmailSendResult> {
    const id = `dev-mail-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record: SentMailRecord = {
      ...params,
      id,
      sentAt: new Date().toISOString(),
    };
    this.sentMails.push(record);
    console.log(`[DevMailbox] Email sent to: ${params.to} | Subject: ${params.subject}`);
    console.log(`[DevMailbox Content]:\n${params.text}\n`);
    return { id, success: true };
  }

  getInbox(): SentMailRecord[] {
    return [...this.sentMails].reverse();
  }
}
