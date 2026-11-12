import { describe, it, expect } from 'vitest';
import {
  ResolutionReceiptSchema,
  ResolutionReceipt,
  EvidenceCompletenessAssessmentSchema,
} from '@resolvepay/contracts';
import {
  DeterministicAiProvider,
  MockPayPalAdapter,
} from '@resolvepay/integrations';
import {
  buildRefundJournal,
  validateJournalBalance,
  computeCanonicalPlanHash,
} from '@resolvepay/domain';

describe('Proposal 1: Resolution Receipt & Audited Subledger Verification', () => {
  it('validates a complete Resolution Receipt schema with balanced ledger entries', () => {
    const journalTxn = buildRefundJournal({
      orderId: '70000000-0000-0000-0000-000000000001',
      refundId: '80000000-0000-0000-0000-000000000001',
      itemRefundMinor: '12000',
      totalRefundMinor: '12000',
      currency: 'USD',
    });

    // Check balance invariant
    expect(() => validateJournalBalance(journalTxn.entries, 'USD')).not.toThrow();

    let totalDebit = 0n;
    let totalCredit = 0n;
    for (const e of journalTxn.entries) {
      totalDebit += BigInt(e.debitMinor);
      totalCredit += BigInt(e.creditMinor);
    }
    expect(totalDebit).toBe(totalCredit);
    expect(totalDebit).toBe(12000n);

    const validReceipt: ResolutionReceipt = {
      caseId: '00000000-0000-0000-0000-000000000010',
      orderId: '70000000-0000-0000-0000-000000000001',
      orderReference: 'ORD-2026-9041',
      customerName: 'Alex Johnson',
      customerEmail: 'alex.customer@example.com',
      complaint: {
        text: 'The zipper on my backpack broke on day 2. Requesting refund.',
        issueType: 'damaged',
        channel: 'WEB',
        submittedAt: new Date().toISOString(),
        affectedItems: [
          {
            sku: 'APEX-BP-40L-BLK',
            title: 'Apex Trail Backpack 40L',
            quantity: 1,
            unitPriceMinor: '12000',
          },
        ],
      },
      aiAttribution: {
        extractionSource: 'GEMINI',
        explanationSource: 'GEMINI',
        summary: 'Customer reports damaged zipper condition on Apex Trail Backpack 40L.',
        missingFacts: [],
        tradeoffs: ['Full payment credit to PayPal funding source.'],
        generatedAt: new Date().toISOString(),
      },
      policy: {
        version: 1,
        immutableHash: 'hash-peakgear-policy-v1',
        publisher: 'Marcus Vance (Owner)',
        effectiveAt: new Date().toISOString(),
        citedClauses: [
          {
            key: 'DEFECTIVE_DAMAGED_RETURN',
            title: 'Damaged or Defective Items',
            text: 'Items received in damaged condition are eligible for 100% refund.',
          },
        ],
      },
      remedy: {
        planId: 'plan-001',
        type: 'REFUND_FULL',
        title: 'Full Refund to PayPal',
        canonicalHash: 'sha256-remedy-hash-001',
        refundAmount: { currency: 'USD', minor: '12000' },
        requiresReturn: true,
        requiresInspection: true,
        state: 'COMPLETED',
      },
      customerConsent: {
        status: 'ACCEPTED',
        acceptedAt: new Date().toISOString(),
        canonicalHash: 'sha256-remedy-hash-001',
        hashMatches: true,
      },
      merchantAuthorization: {
        status: 'AUTHORIZED',
        approvedAt: new Date().toISOString(),
        approverId: '10000000-0000-0000-0000-000000000002',
        approverRole: 'MERCHANT_APPROVER',
      },
      providerExecution: {
        provider: 'PAYPAL',
        status: 'COMPLETED',
        captureId: 'PAYPAL-CAP-SYNTH-9041',
        refundId: 'MOCK-PAYPAL-REF-12345',
        requestId: 'resolvepay-refund-plan-001',
        amount: { currency: 'USD', minor: '12000' },
      },
      returnStatus: {
        status: 'INSPECTION_PASSED',
        trackingReference: 'TRK-RET-9941',
        inspectionResult: 'PASSED',
        inspectionNotes: 'Verified broken zipper track.',
        inspectedAt: new Date().toISOString(),
      },
      ledger: {
        transactionId: 'tx-001',
        businessEventKey: journalTxn.businessEventKey,
        description: journalTxn.description,
        occurredAt: new Date().toISOString(),
        currency: 'USD',
        isBalanced: true,
        totalDebitMinor: totalDebit.toString(),
        totalCreditMinor: totalCredit.toString(),
        entries: journalTxn.entries.map((e) => ({
          accountCode: e.accountCode,
          debitMinor: e.debitMinor,
          creditMinor: e.creditMinor,
        })),
      },
      verification: {
        isFullyVerified: true,
        steps: [
          { name: 'Customer Complaint Ingestion', status: 'VERIFIED', detail: 'Captured via WEB' },
          { name: 'Policy Version Citation', status: 'VERIFIED', detail: 'Policy v1 cited' },
          { name: 'Customer Consent', status: 'VERIFIED', detail: 'Hash bound' },
          { name: 'Merchant Authorization', status: 'VERIFIED', detail: 'Authorized' },
          { name: 'Payment Provider (PayPal) Execution', status: 'VERIFIED', detail: 'Settled' },
          { name: 'Double-Entry Subledger Balance', status: 'VERIFIED', detail: 'Balanced debits and credits' },
        ],
      },
    };

    const parsed = ResolutionReceiptSchema.parse(validReceipt);
    expect(parsed.caseId).toBe(validReceipt.caseId);
    expect(parsed.ledger?.isBalanced).toBe(true);
    expect(parsed.verification.isFullyVerified).toBe(true);
  });

  it('marks pending steps explicitly when verification is incomplete', () => {
    const pendingReceipt: ResolutionReceipt = {
      caseId: '00000000-0000-0000-0000-000000000011',
      orderId: '70000000-0000-0000-0000-000000000001',
      orderReference: 'ORD-PENDING',
      customerName: 'Alex Johnson',
      customerEmail: 'alex@example.com',
      complaint: {
        text: 'Missing strap',
        issueType: 'damaged',
        channel: 'WEB',
        submittedAt: new Date().toISOString(),
        affectedItems: [],
      },
      aiAttribution: {
        extractionSource: 'DETERMINISTIC',
        explanationSource: 'DETERMINISTIC',
        summary: 'Missing strap reported',
        missingFacts: ['Item photo recommended'],
        tradeoffs: [],
      },
      policy: {
        version: 1,
        immutableHash: 'hash-v1',
        publisher: 'Owner',
        effectiveAt: new Date().toISOString(),
        citedClauses: [],
      },
      remedy: {
        planId: 'plan-pending',
        type: 'REFUND_FULL',
        title: 'Full Refund',
        canonicalHash: 'hash-pending',
        refundAmount: { currency: 'USD', minor: '5000' },
        requiresReturn: false,
        requiresInspection: false,
        state: 'OFFERED',
      },
      customerConsent: {
        status: 'PENDING',
        canonicalHash: 'hash-pending',
        hashMatches: true,
      },
      merchantAuthorization: {
        status: 'PENDING',
      },
      providerExecution: {
        provider: 'PAYPAL',
        status: 'NOT_STARTED',
      },
      ledger: null,
      verification: {
        isFullyVerified: false,
        steps: [
          { name: 'Customer Consent', status: 'PENDING', detail: 'Awaiting customer selection' },
          { name: 'Merchant Authorization', status: 'PENDING', detail: 'Awaiting merchant review' },
          { name: 'Payment Provider Execution', status: 'PENDING', detail: 'Execution not started' },
          { name: 'Double-Entry Subledger Balance', status: 'PENDING', detail: 'Pending settlement' },
        ],
      },
    };

    const parsed = ResolutionReceiptSchema.parse(pendingReceipt);
    expect(parsed.verification.isFullyVerified).toBe(false);
    expect(parsed.verification.steps.filter((s) => s.status === 'PENDING').length).toBe(4);
    expect(parsed.ledger).toBeNull();
  });
});

describe('Proposal 2: Recovery Demonstration & Idempotent PayPal Execution', () => {
  it('retains operation identifier (requestId) and avoids duplicate refund on repeated calls', async () => {
    const adapter = new MockPayPalAdapter();
    const requestId = 'resolvepay-refund-test-plan-100';

    // First refund call
    const refund1 = await adapter.refundCapture({
      captureId: 'CAP-12345',
      amount: { currency: 'USD', minor: '12000' },
      requestId,
      reason: 'Remedy settlement test',
    });

    expect(refund1.id).toBeDefined();
    expect(refund1.status).toBe('COMPLETED');

    // Repeated refund call with the same idempotency requestId
    const refund2 = await adapter.refundCapture({
      captureId: 'CAP-12345',
      amount: { currency: 'USD', minor: '12000' },
      requestId,
      reason: 'Remedy settlement test (retry)',
    });

    // Idempotent recovery: must return the exact same refund ID without duplicate debit
    expect(refund2.id).toBe(refund1.id);

    // Authoritative lookup via getRefund with the same requestId
    const lookup = await adapter.getRefund(requestId);
    expect(lookup.id).toBe(refund1.id);
    expect(lookup.status).toBe('COMPLETED');
  });

  it('proves that subledger journal is idempotent and cannot produce duplicate transactions', () => {
    const refundId = 'refund-rec-001';
    const txn1 = buildRefundJournal({
      orderId: 'ord-001',
      refundId,
      itemRefundMinor: '12000',
      totalRefundMinor: '12000',
      currency: 'USD',
    });

    const txn2 = buildRefundJournal({
      orderId: 'ord-001',
      refundId,
      itemRefundMinor: '12000',
      totalRefundMinor: '12000',
      currency: 'USD',
    });

    // Business event key must be uniquely derived from refundId to enforce unique index constraint
    expect(txn1.businessEventKey).toBe(`REFUND_SETTLED:${refundId}`);
    expect(txn2.businessEventKey).toBe(txn1.businessEventKey);
  });
});

describe('Proposal 3: Evidence Completeness Assistant & Policy Grounding', () => {
  const provider = new DeterministicAiProvider();

  it('detects incomplete complaint and generates targeted clarification questions', async () => {
    const incompleteContext = {
      orderReference: 'ORD-9041',
      complaintMessage: 'Something broke in my package.',
      orderItems: [
        { orderItemId: 'item-1', sku: 'APEX-BP-40L-BLK', title: 'Apex Trail Backpack 40L', quantity: 1 },
        { orderItemId: 'item-2', sku: 'POLES-CRBN-PAIR', title: 'Ultralight Carbon Trekking Poles', quantity: 1 },
      ],
      policyClauses: [
        { key: 'DEFECTIVE_DAMAGED_RETURN', title: 'Damaged Items', text: 'Must describe defect and return item.' },
      ],
      evidenceDescriptions: [],
    };

    const assessment = await provider.assessCompleteness(incompleteContext);
    const parsed = EvidenceCompletenessAssessmentSchema.parse(assessment);

    expect(parsed.isComplete).toBe(false);
    expect(parsed.scorePct).toBeLessThan(100);
    expect(parsed.questions.length).toBeGreaterThan(0);

    // Multi-item order without specified item asks for affected item
    const itemQuestion = parsed.questions.find((q) => q.field === 'affectedItemSku');
    expect(itemQuestion).toBeDefined();

    // Missing defect detail asks for defect description
    const defectQuestion = parsed.questions.find((q) => q.field === 'defectDetail');
    expect(defectQuestion).toBeDefined();

    // AI never asserts it inspected an image
    expect(parsed.photoEvidenceNote).not.toContain('inspected the image');
    expect(parsed.photoEvidenceNote).toContain('without asserting image pixel inspection');
  });

  it('validates a complete complaint directly without asking redundant questions', async () => {
    const completeContext = {
      orderReference: 'ORD-9041',
      complaintMessage: 'My Apex Trail Backpack 40L has a split zipper along the main compartment. I would prefer a full refund to my PayPal account.',
      orderItems: [
        { orderItemId: 'item-1', sku: 'APEX-BP-40L-BLK', title: 'Apex Trail Backpack 40L', quantity: 1 },
      ],
      policyClauses: [
        { key: 'DEFECTIVE_DAMAGED_RETURN', title: 'Damaged Items', text: 'Must describe defect.' },
        { key: 'ALTERNATIVE_EXCHANGE_CREDIT', title: 'Exchanges', text: 'Customer preference.' },
      ],
      evidenceDescriptions: ['Photo showing detached zipper teeth'],
    };

    const assessment = await provider.assessCompleteness(completeContext);
    const parsed = EvidenceCompletenessAssessmentSchema.parse(assessment);

    expect(parsed.isComplete).toBe(true);
    expect(parsed.scorePct).toBe(100);
    expect(parsed.questions.length).toBe(0);
    expect(parsed.hasPhotoEvidenceDescription).toBe(true);
    expect(parsed.requirementsChecked.every((r) => r.satisfied)).toBe(true);
  });
});

