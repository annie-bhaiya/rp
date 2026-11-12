import { z } from 'zod';
import { MoneySchema } from './common.js';

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

// Proposal 1: Resolution Receipt
export const ResolutionReceiptSchema = z.object({
  caseId: z.string().uuid(),
  orderId: z.string().uuid(),
  orderReference: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  complaint: z.object({
    text: z.string(),
    issueType: z.string(),
    channel: z.string(),
    submittedAt: z.string(),
    affectedItems: z.array(
      z.object({
        sku: z.string(),
        title: z.string(),
        quantity: z.number().int(),
        unitPriceMinor: z.string(),
      })
    ),
  }),
  aiAttribution: z.object({
    extractionSource: z.string(),
    explanationSource: z.string(),
    summary: z.string(),
    missingFacts: z.array(z.string()).default([]),
    tradeoffs: z.array(z.string()).default([]),
    generatedAt: z.string().optional(),
  }),
  policy: z.object({
    version: z.number().int(),
    immutableHash: z.string(),
    publisher: z.string(),
    effectiveAt: z.string(),
    citedClauses: z.array(
      z.object({
        key: z.string(),
        title: z.string(),
        text: z.string(),
      })
    ),
  }),
  remedy: z.object({
    planId: z.string(),
    type: z.string(),
    title: z.string(),
    canonicalHash: z.string(),
    refundAmount: MoneySchema,
    additionalPayment: MoneySchema.optional(),
    requiresReturn: z.boolean(),
    requiresInspection: z.boolean(),
    state: z.string(),
  }),
  customerConsent: z.object({
    status: z.enum(['ACCEPTED', 'PENDING']),
    acceptedAt: z.string().optional(),
    canonicalHash: z.string(),
    hashMatches: z.boolean(),
  }),
  merchantAuthorization: z.object({
    status: z.enum(['AUTHORIZED', 'PENDING', 'REJECTED']),
    approvedAt: z.string().optional(),
    approverId: z.string().optional(),
    approverRole: z.string().optional(),
  }),
  providerExecution: z.object({
    provider: z.literal('PAYPAL'),
    status: z.enum(['COMPLETED', 'PENDING', 'UNKNOWN', 'NOT_STARTED']),
    captureId: z.string().optional(),
    refundId: z.string().optional(),
    requestId: z.string().optional(),
    amount: MoneySchema.optional(),
  }),
  returnStatus: z
    .object({
      status: z.string(),
      trackingReference: z.string().optional(),
      inspectionResult: z.string().optional(),
      inspectionNotes: z.string().optional(),
      inspectedAt: z.string().optional(),
    })
    .optional(),
  ledger: z
    .object({
      transactionId: z.string().optional(),
      businessEventKey: z.string(),
      description: z.string(),
      occurredAt: z.string(),
      currency: z.string(),
      isBalanced: z.boolean(),
      totalDebitMinor: z.string(),
      totalCreditMinor: z.string(),
      entries: z.array(
        z.object({
          accountCode: z.string(),
          debitMinor: z.string(),
          creditMinor: z.string(),
        })
      ),
    })
    .nullable(),
  verification: z.object({
    isFullyVerified: z.boolean(),
    steps: z.array(
      z.object({
        name: z.string(),
        status: z.enum(['VERIFIED', 'PENDING', 'FAILED']),
        detail: z.string(),
      })
    ),
  }),
});
export type ResolutionReceipt = z.infer<typeof ResolutionReceiptSchema>;

