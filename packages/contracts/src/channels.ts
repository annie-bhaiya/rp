import { z } from 'zod';

export const InboundWebhookEventSchema = z.object({
  id: z.string().uuid(),
  provider: z.enum(['PAYPAL', 'RESEND']),
  connectionId: z.string().optional(),
  eventId: z.string(),
  rawPayload: z.string(),
  verified: z.boolean().default(false),
  receivedAt: z.string(),
});
export type InboundWebhookEvent = z.infer<typeof InboundWebhookEventSchema>;

export const NotificationEventSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  caseId: z.string().uuid(),
  channel: z.enum(['WEB', 'EMAIL']),
  recipient: z.string(),
  templateKey: z.string(),
  subject: z.string().optional(),
  content: z.string(),
  status: z.enum(['QUEUED', 'SENDING', 'SENT', 'FAILED']),
  createdAt: z.string(),
});
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;

