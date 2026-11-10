import { describe, it, expect } from 'vitest';
import {
  createMoney,
  addMoney,
  subtractMoney,
  compareMoney,
  allocateLargestRemainder,
  formatMoney,
  computeCanonicalPlanHash,
  transitionCase,
  transitionPlan,
  transitionResolution,
  buildOrderCaptureJournal,
  buildRefundJournal,
  validateJournalBalance,
  LedgerImbalanceError,
} from '../index.js';

describe('Domain Money Invariants', () => {
  it('prevents float precision errors with minor units', () => {
    const a = createMoney('12000', 'USD'); // $120.00
    const b = createMoney('1000', 'USD');  // $10.00
    const sum = addMoney(a, b);
    expect(sum.minor).toBe('13000');
    expect(formatMoney(sum)).toBe('$130.00');

    const diff = subtractMoney(a, b);
    expect(diff.minor).toBe('11000');
    expect(formatMoney(diff)).toBe('$110.00');
  });

  it('allocates totals accurately with largest remainder rule without loss', () => {
    const total = createMoney('10000', 'USD'); // $100.00
    // Split into 3 equal items: 33.33, 33.33, 33.34
    const allocated = allocateLargestRemainder(total, [1, 1, 1]);
    expect(allocated.length).toBe(3);
    const sum = allocated.reduce((acc, curr) => acc + BigInt(curr.minor), 0n);
    expect(sum).toBe(10000n);
    expect(allocated[0].minor).toBe('3334');
    expect(allocated[1].minor).toBe('3333');
    expect(allocated[2].minor).toBe('3333');
  });
});

describe('Canonical Material-Terms Plan Hash', () => {
  it('produces identical hash regardless of item insertion order', () => {
    const planA = {
      caseId: 'case-1',
      orderId: 'order-1',
      type: 'REFUND_FULL',
      policyVersionId: 'pol-1',
      items: [
        { orderItemId: 'item-2', sku: 'SKU-B', quantity: 1, unitPrice: { currency: 'USD', minor: '4000' } },
        { orderItemId: 'item-1', sku: 'SKU-A', quantity: 2, unitPrice: { currency: 'USD', minor: '3000' } },
      ],
      originalEligibleValue: { currency: 'USD', minor: '10000' },
      refund: { currency: 'USD', minor: '10000' },
      requiresReturn: true,
      requiresInspection: true,
    };

    const planB = {
      ...planA,
      items: [
        { orderItemId: 'item-1', sku: 'SKU-A', quantity: 2, unitPrice: { currency: 'USD', minor: '3000' } },
        { orderItemId: 'item-2', sku: 'SKU-B', quantity: 1, unitPrice: { currency: 'USD', minor: '4000' } },
      ],
    };

    expect(computeCanonicalPlanHash(planA)).toBe(computeCanonicalPlanHash(planB));
  });

  it('changes hash when financial terms change', () => {
    const basePlan = {
      caseId: 'case-1',
      orderId: 'order-1',
      type: 'REFUND_FULL',
      policyVersionId: 'pol-1',
      items: [{ orderItemId: 'item-1', sku: 'SKU-A', quantity: 1, unitPrice: { currency: 'USD', minor: '5000' } }],
      originalEligibleValue: { currency: 'USD', minor: '5000' },
      refund: { currency: 'USD', minor: '5000' },
      requiresReturn: false,
      requiresInspection: false,
    };

    const hash1 = computeCanonicalPlanHash(basePlan);
    const hash2 = computeCanonicalPlanHash({
      ...basePlan,
      refund: { currency: 'USD', minor: '4999' },
    });

    expect(hash1).not.toBe(hash2);
  });
});

describe('Double-Entry Subledger Invariants', () => {
  it('balances order capture transaction', () => {
    const txn = buildOrderCaptureJournal({
      orderId: 'order-1',
      subtotalMinor: '10000',
      taxMinor: '800',
      shippingMinor: '500',
      totalMinor: '11300',
      currency: 'USD',
    });

    expect(txn.entries.length).toBe(4);
    expect(() => validateJournalBalance(txn.entries, 'USD')).not.toThrow();
  });

  it('throws LedgerImbalanceError when debits and credits do not balance', () => {
    const invalidEntries = [
      { accountCode: 'PAYPAL_CLEARING' as const, debitMinor: '10000', creditMinor: '0' },
      { accountCode: 'SALES_REVENUE' as const, debitMinor: '0', creditMinor: '9900' },
    ];

    expect(() => validateJournalBalance(invalidEntries, 'USD')).toThrow(LedgerImbalanceError);
  });

  it('balances refund transaction', () => {
    const txn = buildRefundJournal({
      orderId: 'order-1',
      refundId: 'ref-1',
      itemRefundMinor: '10000',
      taxRefundMinor: '800',
      totalRefundMinor: '10800',
      currency: 'USD',
    });

    expect(() => validateJournalBalance(txn.entries, 'USD')).not.toThrow();
  });
});

describe('State Machines', () => {
  it('enforces valid case transitions', () => {
    expect(transitionCase('OPEN', 'PLANNING')).toBe('PLANNING');
    expect(transitionCase('PLANNING', 'OPTIONS_READY')).toBe('OPTIONS_READY');
    expect(transitionCase('OPTIONS_READY', 'AWAITING_APPROVALS')).toBe('AWAITING_APPROVALS');
    expect(() => transitionCase('RESOLVED', 'OPEN')).toThrow();
  });

  it('enforces valid plan transitions', () => {
    expect(transitionPlan('OFFERED', 'SELECTED')).toBe('SELECTED');
    expect(transitionPlan('SELECTED', 'READY')).toBe('READY');
    expect(transitionPlan('READY', 'EXECUTING')).toBe('EXECUTING');
    expect(transitionPlan('EXECUTING', 'COMPLETED')).toBe('COMPLETED');
    expect(() => transitionPlan('COMPLETED', 'OFFERED')).toThrow();
  });
});
