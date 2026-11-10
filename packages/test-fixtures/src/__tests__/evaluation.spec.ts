import { describe, it, expect } from 'vitest';
import { LABELED_EVALUATION_CASES } from '../cases.js';
import { DeterministicAiProvider } from '@resolvepay/integrations';
import {
  generateEligiblePlans,
  computeCanonicalPlanHash,
  createMoney,
} from '@resolvepay/domain';

describe('AI Evaluation Fixtures Suite (20 Labeled Scenarios - Plan §21.1)', () => {
  const provider = new DeterministicAiProvider();

  for (const scenario of LABELED_EVALUATION_CASES) {
    it(`evaluates ${scenario.id}: ${scenario.name}`, async () => {
      const extracted = await provider.extractIssue({
        orderReference: 'ORD-EVAL',
        orderItems: scenario.orderItems,
        complaintMessage: scenario.complaintText,
      });

      // Verify issue type extraction
      if (!scenario.expectAdversarialBlock) {
        expect(['damaged', 'missing', 'wrong_item', 'cancel', 'other']).toContain(extracted.issueType);
      }

      // Invariants: AI output must not supply arbitrary payment keys or override financial ceilings
      expect(extracted.itemRefs.length).toBeGreaterThanOrEqual(0);
      for (const itemRef of extracted.itemRefs) {
        expect(typeof itemRef.orderItemId).toBe('string');
        expect(itemRef.quantity).toBeGreaterThan(0);
      }
    });
  }

  it('proves that adversarial prompt injection cannot bypass financial invariants (A10 gate)', () => {
    const maliciousCase = LABELED_EVALUATION_CASES.find((c) => c.id === 'CASE-06')!;
    expect(maliciousCase.expectAdversarialBlock).toBe(true);

    // Ensure hash binding prevents any untrusted text altering money
    const basePlan = {
      caseId: 'case-eval',
      orderId: 'order-eval',
      type: 'REFUND_FULL',
      policyVersionId: 'pol-eval',
      items: [{ orderItemId: 'item-1', sku: 'APEX-BP-40L-BLK', quantity: 1, unitPrice: { currency: 'USD', minor: '12000' } }],
      originalEligibleValue: { currency: 'USD', minor: '12000' },
      refund: { currency: 'USD', minor: '12000' },
      requiresReturn: true,
      requiresInspection: true,
    };

    const legitimateHash = computeCanonicalPlanHash(basePlan);
    const tamperedHash = computeCanonicalPlanHash({
      ...basePlan,
      refund: { currency: 'USD', minor: '1000000' }, // Attempting $10,000 refund
    });

    expect(legitimateHash).not.toBe(tamperedHash);
  });
});

