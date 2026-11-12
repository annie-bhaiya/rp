import { CaseConstraint, Money, EvidenceCompletenessAssessment } from '@resolvepay/contracts';

export interface RedactedOrderItem {
  orderItemId: string;
  sku: string;
  title: string;
  quantity: number;
}

export interface RedactedCaseContext {
  orderReference: string;
  orderItems: RedactedOrderItem[];
  complaintMessage: string;
  priorMessages?: Array<{ sender: string; body: string }>;
  evidenceDescriptions?: string[];
}

export interface CompletenessInput {
  orderReference: string;
  orderItems: RedactedOrderItem[];
  complaintMessage: string;
  evidenceDescriptions?: string[];
  policyClauses: Array<{
    key: string;
    title: string;
    text: string;
    structuredRule?: Record<string, unknown>;
  }>;
}

export interface ValidatedIssue {
  source?: 'GEMINI' | 'DETERMINISTIC' | 'FALLBACK';
  issueType: 'damaged' | 'missing' | 'wrong_item' | 'cancel' | 'other';
  itemRefs: Array<{ orderItemId: string; quantity: number }>;
  constraints: CaseConstraint;
  missingFacts: string[];
  evidenceRefs: string[];
  summary: string;
}

export interface GroundedOptionCandidate {
  type: string;
  title: string;
  requiresReturn: boolean;
  refundAmount?: Money;
  additionalPayment?: Money;
  replacementItemTitle?: string;
  estimatedDays: number;
  policyCitations: string[];
}

export interface GroundedOptionsInput {
  caseSummary: string;
  customerConstraints?: Record<string, unknown>;
  options: GroundedOptionCandidate[];
}

export interface ValidatedExplanation {
  source?: 'GEMINI' | 'DETERMINISTIC' | 'FALLBACK';
  explanationText: string;
  tradeoffs: string[];
  recommendedOptionType?: string;
}

export interface AiProvider {
  extractIssue(input: RedactedCaseContext): Promise<ValidatedIssue>;
  explainOptions(input: GroundedOptionsInput): Promise<ValidatedExplanation>;
  assessCompleteness(input: CompletenessInput): Promise<EvidenceCompletenessAssessment>;
}


