import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'MERCHANT_OWNER',
  'MERCHANT_APPROVER',
  'SUPPORT_AGENT',
  'ANALYST',
  'PLATFORM_OPERATOR',
  'JUDGE',
]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const CustomerAccessRequestDtoSchema = z.object({
  tenantSlug: z.string().default('default-merchant'),
  orderReference: z.string().min(1),
  email: z.string().email(),
});
export type CustomerAccessRequestDto = z.infer<typeof CustomerAccessRequestDtoSchema>;

export const CustomerAccessRedeemDtoSchema = z.object({
  token: z.string().min(16),
});
export type CustomerAccessRedeemDto = z.infer<typeof CustomerAccessRedeemDtoSchema>;

export const SessionInfoSchema = z.object({
  sessionId: z.string().uuid(),
  actorType: z.enum(['CUSTOMER', 'MERCHANT', 'OPERATOR']),
  actorId: z.string().uuid(),
  tenantId: z.string().uuid(),
  tenantSlug: z.string(),
  role: UserRoleSchema.optional(),
  customerEmail: z.string().email().optional(),
  orderId: z.string().uuid().optional(),
  orderReference: z.string().optional(),
  expiresAt: z.string(),
});
export type SessionInfo = z.infer<typeof SessionInfoSchema>;

