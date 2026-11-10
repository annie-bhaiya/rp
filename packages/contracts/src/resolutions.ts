import { z } from 'zod';

export const ResolutionStateSchema = z.enum([
  'PREPARED',
  'WAITING_RETURN',
  'WAITING_PAYMENT',
  'RUNNING',
  'WAITING_PROVIDER',
  'WAITING_FULFILLMENT',
  'COMPLETED',
  'RECOVERY_REQUIRED',
  'MANUAL_REVIEW',
  'CANCELLED',
]);
export type ResolutionState = z.infer<typeof ResolutionStateSchema>;

export const StepStateSchema = z.enum([
  'READY',
  'CLAIMED',
  'IN_FLIGHT',
  'SUCCEEDED',
  'RETRY_WAIT',
  'UNKNOWN',
  'FAILED_FINAL',
  'COMPENSATING',
  'COMPENSATED',
]);
export type StepState = z.infer<typeof StepStateSchema>;

export const StepKeySchema = z.enum([
  'VERIFY_RETURN',
  'INSPECT_RETURN',
  'RESERVE_STOCK',
  'EXECUTE_REFUND',
  'COLLECT_EXTRA_PAYMENT',
  'COMMIT_EXCHANGE',
  'DISPATCH_FULFILLMENT',
  'SEND_NOTIFICATIONS',
  'POST_JOURNAL',
]);
export type StepKey = z.infer<typeof StepKeySchema>;

export const ResolutionStepSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  resolutionId: z.string().uuid(),
  stepKey: StepKeySchema,
  state: StepStateSchema,
  attempt: z.number().int().default(0),
  fencingToken: z.number().int().default(0),
  leaseOwner: z.string().optional(),
  leaseUntil: z.string().optional(),
  externalReference: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ResolutionStep = z.infer<typeof ResolutionStepSchema>;

export const ResolutionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  caseId: z.string().uuid(),
  planId: z.string().uuid(),
  state: ResolutionStateSchema,
  currentStep: StepKeySchema.optional(),
  steps: z.array(ResolutionStepSchema).default([]),
  version: z.number().int().default(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Resolution = z.infer<typeof ResolutionSchema>;

export const ReturnStatusSchema = z.enum([
  'REQUIRED',
  'AUTHORIZED',
  'IN_TRANSIT',
  'RECEIVED',
  'INSPECTION_PASSED',
  'INSPECTION_FAILED',
]);
export type ReturnStatus = z.infer<typeof ReturnStatusSchema>;

export const ReturnRequestSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  caseId: z.string().uuid(),
  status: ReturnStatusSchema,
  trackingReference: z.string().optional(),
  carrier: z.string().default('Simulated Express'),
  inspectionResult: z.enum(['PASSED', 'FAILED', 'PARTIAL']).optional(),
  inspectorId: z.string().uuid().optional(),
  inspectionNotes: z.string().optional(),
  inspectedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ReturnRequest = z.infer<typeof ReturnRequestSchema>;

export const RecordInspectionDtoSchema = z.object({
  returnId: z.string().uuid(),
  result: z.enum(['PASSED', 'FAILED']),
  notes: z.string().min(2),
});
export type RecordInspectionDto = z.infer<typeof RecordInspectionDtoSchema>;

export const FulfillmentStatusSchema = z.enum([
  'PLANNED',
  'RESERVED',
  'DISPATCH_READY',
  'SHIPPED',
  'DELIVERED',
  'BLOCKED',
  'CANCELLED',
  'EXCEPTION',
]);
export type FulfillmentStatus = z.infer<typeof FulfillmentStatusSchema>;

export const FulfillmentSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  resolutionId: z.string().uuid(),
  replacementOrderId: z.string().uuid().optional(),
  status: FulfillmentStatusSchema,
  trackingReference: z.string().optional(),
  carrier: z.string().default('Simulated Freight'),
  estimatedDelivery: z.string(),
  deliveredAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Fulfillment = z.infer<typeof FulfillmentSchema>;
