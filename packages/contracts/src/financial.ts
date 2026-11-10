import { z } from 'zod';
import { MoneySchema } from './common.js';

export const AccountCodeSchema = z.enum([
  'PAYPAL_CLEARING',
  'SALES_REVENUE',
  'SALES_TAX_PAYABLE',
  'SHIPPING_REVENUE',
  'SALES_RETURNS',
  'EXCHANGE_CREDIT_LIABILITY',
  'PAYPAL_FEES',
  'REPLACEMENT_EXPENSE',
]);
export type AccountCode = z.infer<typeof AccountCodeSchema>;

export const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  transactionId: z.string().uuid(),
  accountCode: AccountCodeSchema,
  debitMinor: z.string(),
  creditMinor: z.string(),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const JournalTransactionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  businessEventKey: z.string(),
  description: z.string(),
  currency: z.string().length(3).default('USD'),
  occurredAt: z.string(),
  entries: z.array(JournalEntrySchema).default([]),
});
export type JournalTransaction = z.infer<typeof JournalTransactionSchema>;

export const CaptureSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  orderId: z.string().uuid(),
  providerCaptureId: z.string(),
  amount: MoneySchema,
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'PARTIALLY_REFUNDED', 'REFUNDED']),
  refundedAmount: MoneySchema,
  createdAt: z.string(),
});
export type Capture = z.infer<typeof CaptureSchema>;

export const RefundSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  captureId: z.string().uuid(),
  resolutionId: z.string().uuid().optional(),
  providerRefundId: z.string().optional(),
  amount: MoneySchema,
  status: z.enum(['PREPARED', 'SUBMITTED', 'PENDING', 'COMPLETED', 'FAILED', 'UNKNOWN']),
  createdAt: z.string(),
});
export type Refund = z.infer<typeof RefundSchema>;
