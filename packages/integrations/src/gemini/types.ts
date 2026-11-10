import { Money } from '@resolvepay/contracts';

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

export interface ValidatedIssue {
  issueType: 'damaged' | 'missing' | 'wrong_item' | 'cancel' | 'other';
  itemRefs: Array<{ orderItemId: string; quantity: number }>;
  constraints: {
    maxExtra?: Money;
    neededBy?: string;
    timezone?: string;
  };
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
  explanationText: string;
  tradeoffs: string[];
  recommendedOptionType?: string;
}

export interface AiProvider {
  extractIssue(input: RedactedCaseContext): Promise<ValidatedIssue>;
  explainOptions(input: GroundedOptionsInput): Promise<ValidatedExplanation>;
}

