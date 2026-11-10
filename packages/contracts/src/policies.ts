import { z } from 'zod';

export const PolicyClauseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  policyVersionId: z.string().uuid(),
  key: z.string(),
  title: z.string(),
  text: z.string(),
  structuredRule: z.record(z.unknown()).default({}),
  sourceSpan: z.string().optional(),
});
export type PolicyClause = z.infer<typeof PolicyClauseSchema>;

export const PolicyVersionSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  version: z.number().int(),
  text: z.string(),
  clauses: z.array(PolicyClauseSchema).default([]),
  effectiveAt: z.string(),
  publisher: z.string(),
  immutableHash: z.string(),
});
export type PolicyVersion = z.infer<typeof PolicyVersionSchema>;

export const CreatePolicyDraftDtoSchema = z.object({
  text: z.string().min(10),
  clauses: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      text: z.string(),
      structuredRule: z.record(z.unknown()).optional(),
    })
  ).min(1),
});
export type CreatePolicyDraftDto = z.infer<typeof CreatePolicyDraftDtoSchema>;

