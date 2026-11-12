import { z } from 'zod';
import { RedactedCaseContext, GroundedOptionsInput } from './types.js';

const IssueSchema = z.object({
  issueType: z.enum(['damaged', 'missing', 'wrong_item', 'cancel', 'other']),
  itemRefs: z.array(z.object({ orderItemId: z.string(), quantity: z.number().int().positive() })).min(1),
  missingFacts: z.array(z.string().max(500)).max(10),
  summary: z.string().min(1).max(1500),
  constraints: z.object({
    preference: z.enum(['refund', 'replacement', 'exchange', 'fastest']).optional(),
  }).default({}),
});

export function validateIssue(value: unknown, context: RedactedCaseContext) {
  const issue = IssueSchema.parse(value);
  const seen = new Set<string>();
  for (const ref of issue.itemRefs) {
    const item = context.orderItems.find(i => i.orderItemId === ref.orderItemId);
    if (!item || ref.quantity > item.quantity || seen.has(ref.orderItemId)) {
      throw new Error('AI item reference does not match the authenticated order');
    }
    seen.add(ref.orderItemId);
  }
  return { ...issue, evidenceRefs: [] };
}

export function validateExplanation(value: unknown, context: GroundedOptionsInput) {
  const result = z.object({
    explanationText: z.string().min(1).max(2500),
    tradeoffs: z.array(z.string().max(750)).max(10),
    recommendedOptionType: z.string().optional(),
  }).parse(value);
  if (result.recommendedOptionType && !context.options.some(o => o.type === result.recommendedOptionType)) {
    throw new Error('AI recommended an unavailable remedy');
  }
  return result;
}
