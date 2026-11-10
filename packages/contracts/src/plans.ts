import { z } from 'zod';
import { MoneySchema } from './common.js';

export const PlanTypeSchema = z.enum([
  'REFUND_FULL',
  'REFUND_PARTIAL',
  'REPLACEMENT_SAME',
  'EXCHANGE_MORE_EXPENSIVE',
  'EXCHANGE_CHEAPER',
]);
export type PlanType = z.infer<typeof PlanTypeSchema>;

export const PlanStateSchema = z.enum([
  'DRAFT',
  'VALIDATED',
  'OFFERED',
  'SELECTED',
  'READY',
  'EXECUTING',
  'COMPLETED',
  'SUPERSEDED',
  'EXPIRED',
  'REJECTED',
]);
export type PlanState = z.infer<typeof PlanStateSchema>;

export const PlanItemSchema = z.object({
  orderItemId: z.string().uuid(),
  sku: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: MoneySchema,
});
export type PlanItem = z.infer<typeof PlanItemSchema>;

export const PlanReplacementSchema = z.object({
  variantId: z.string().uuid(),
  sku: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: MoneySchema,
});
export type PlanReplacement = z.infer<typeof PlanReplacementSchema>;

export const PlanCitationSchema = z.object({
  clauseId: z.string().uuid(),
  clauseKey: z.string(),
  title: z.string(),
  excerpt: z.string(),
});
export type PlanCitation = z.infer<typeof PlanCitationSchema>;

export const PlanSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  caseId: z.string().uuid(),
  orderId: z.string().uuid(),
  version: z.number().int(),
  canonicalHash: z.string(),
  policyVersionId: z.string().uuid(),
  type: PlanTypeSchema,
  state: PlanStateSchema,
  title: z.string(),
  explanation: z.string(),
  items: z.array(PlanItemSchema),
  replacement: PlanReplacementSchema.optional(),
  originalEligibleValue: MoneySchema,
  replacementTotal: MoneySchema.optional(),
  merchantCredit: MoneySchema.optional(),
  additionalPayment: MoneySchema.optional(),
  refund: MoneySchema,
  requiresReturn: z.boolean().default(false),
  requiresInspection: z.boolean().default(false),
  citations: z.array(PlanCitationSchema).default([]),
  delivery: z.object({
    kind: z.string().default('ESTIMATE'),
    source: z.string().default('simulated-logistics'),
    estimatedDays: z.number().default(3),
    simulated: z.boolean().default(true),
  }),
  approvalsRequired: z.array(z.enum(['CUSTOMER', 'MERCHANT_APPROVER'])).default(['CUSTOMER', 'MERCHANT_APPROVER']),
  customerAccepted: z.boolean().default(false),
  customerAcceptedAt: z.string().optional(),
  merchantApproved: z.boolean().default(false),
  merchantApprovedAt: z.string().optional(),
  merchantApproverId: z.string().uuid().optional(),
  expiresAt: z.string(),
  createdAt: z.string(),
});
export type Plan = z.infer<typeof PlanSchema>;

export const AcceptPlanDtoSchema = z.object({
  planId: z.string().uuid(),
  expectedHash: z.string().min(16),
  expectedVersion: z.number().int(),
});
export type AcceptPlanDto = z.infer<typeof AcceptPlanDtoSchema>;

export const MerchantApprovePlanDtoSchema = z.object({
  planId: z.string().uuid(),
  expectedHash: z.string().min(16),
  decision: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
});
export type MerchantApprovePlanDto = z.infer<typeof MerchantApprovePlanDtoSchema>;

