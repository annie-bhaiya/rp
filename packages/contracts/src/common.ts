import { z } from 'zod';

export const MoneySchema = z.object({
  currency: z.string().length(3).default('USD'),
  minor: z.string().regex(/^-?\d+$/, 'Must be an integer string representing minor units (cents)'),
});
export type Money = z.infer<typeof MoneySchema>;

export const PaginationParamsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  traceId: z.string(),
  retryable: z.boolean().default(false),
  details: z.record(z.unknown()).optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

