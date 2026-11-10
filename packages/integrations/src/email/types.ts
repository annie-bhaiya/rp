export interface EmailSendParams {
  to: string;
  from?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  id: string;
  success: boolean;
  error?: string;
}

export interface EmailAdapter {
  sendEmail(params: EmailSendParams): Promise<EmailSendResult>;
}
