import { z } from 'zod';
import { MoneySchema } from './common.js';

export const IssueTypeSchema = z.enum([
  'damaged',
  'missing',
  'wrong_item',
  'cancel',
  'other',
]);
export type IssueType = z.infer<typeof IssueTypeSchema>;

export const CaseStateSchema = z.enum([
  'OPEN',
  'NEEDS_INFORMATION',
  'PLANNING',
  'OPTIONS_READY',
  'AWAITING_APPROVALS',
  'EXECUTING',
  'RESOLVED',
  'MANUAL_REVIEW',
  'CLOSED',
]);
export type CaseState = z.infer<typeof CaseStateSchema>;

export const ChannelTypeSchema = z.enum(['WEB', 'EMAIL', 'WHATSAPP']);
export type ChannelType = z.infer<typeof ChannelTypeSchema>;

export const CaseConstraintSchema = z.object({
  maxExtra: MoneySchema.optional(),
  neededBy: z.string().optional(),
  timezone: z.string().optional(),
  preference: z.enum(['refund', 'replacement', 'exchange', 'fastest']).optional(),
});
export type CaseConstraint = z.infer<typeof CaseConstraintSchema>;

export const CreateCaseDtoSchema = z.object({
  orderId: z.string().uuid(),
  initialMessage: z.string().min(3),
  issueType: IssueTypeSchema.optional(),
  channel: ChannelTypeSchema.default('WEB'),
  constraints: CaseConstraintSchema.optional(),
});
export type CreateCaseDto = z.infer<typeof CreateCaseDtoSchema>;

export const AddCaseMessageDtoSchema = z.object({
  body: z.string().min(1),
  channel: ChannelTypeSchema.default('WEB'),
});
export type AddCaseMessageDto = z.infer<typeof AddCaseMessageDtoSchema>;

export const CaseMessageSchema = z.object({
  id: z.string().uuid(),
  caseId: z.string().uuid(),
  tenantId: z.string().uuid(),
  channel: ChannelTypeSchema,
  senderRole: z.enum(['CUSTOMER', 'MERCHANT', 'SYSTEM', 'AI']),
  body: z.string(),
  verificationState: z.enum(['UNVERIFIED', 'VERIFIED']).default('VERIFIED'),
  createdAt: z.string(),
});
export type CaseMessage = z.infer<typeof CaseMessageSchema>;

export const CaseEvidenceSchema = z.object({
  id: z.string().uuid(),
  caseId: z.string().uuid(),
  tenantId: z.string().uuid(),
  blobKey: z.string(),
  contentHash: z.string(),
  mediaType: z.string(),
  validationState: z.enum(['PENDING', 'VALID', 'REJECTED']),
  description: z.string().optional(),
  createdAt: z.string(),
});
export type CaseEvidence = z.infer<typeof CaseEvidenceSchema>;

export const CaseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  state: CaseStateSchema,
  issueType: IssueTypeSchema.nullable().optional(),
  constraints: CaseConstraintSchema.default({}),
  version: z.number().int().default(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Case = z.infer<typeof CaseSchema>;
