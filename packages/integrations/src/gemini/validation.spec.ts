import { describe, expect, it } from 'vitest';
import { validateIssue, validateExplanation } from './validation.js';
import { DeterministicAiProvider } from './mock.js';

const context = { orderReference: 'test', complaintMessage: 'The backpack never arrived', orderItems: [
  { orderItemId: 'item-1', sku: 'PACK', title: 'Trail backpack', quantity: 2 },
] };
const issue = { issueType: 'missing', itemRefs: [{ orderItemId: 'item-1', quantity: 1 }], missingFacts: [], summary: 'Backpack missing.' };

describe('AI trust boundary', () => {
  it('accepts grounded extraction', () => expect(validateIssue(issue, context).issueType).toBe('missing'));
  it.each([
    [{ orderItemId: 'invented', quantity: 1 }],
    [{ orderItemId: 'item-1', quantity: 3 }],
    [{ orderItemId: 'item-1', quantity: -1 }],
    [{ orderItemId: 'item-1', quantity: 1 }, { orderItemId: 'item-1', quantity: 1 }],
  ])('rejects foreign, excessive, negative or duplicate item references: %j', (...refs) => {
    expect(() => validateIssue({ ...issue, itemRefs: refs }, context)).toThrow();
  });
  it('rejects malformed model output', () => expect(() => validateIssue({ issueType: 'refund-everything' }, context)).toThrow());
  it('rejects invented remedy recommendations', () => {
    expect(() => validateExplanation({ explanationText: 'Free upgrade', tradeoffs: [], recommendedOptionType: 'FREE_UPGRADE' }, { caseSummary: '', options: [] })).toThrow();
  });
  it('labels deterministic inference and uses actual complaint text', async () => {
    const result = await new DeterministicAiProvider().extractIssue(context);
    expect(result.source).toBe('DETERMINISTIC');
    expect(result.issueType).toBe('missing');
  });
  it('retains a valid preference without accepting financial instructions', () => {
    const result = validateIssue({ ...issue, constraints: { preference: 'replacement', approved: true, maxExtra: { currency: 'USD', minor: '999999' } } }, context);
    expect(result.constraints).toEqual({ preference: 'replacement' });
    expect(() => validateIssue({ ...issue, constraints: { preference: 'free_upgrade' } }, context)).toThrow();
  });
  it('uses a stated preference to recommend an offered remedy', async () => {
    const provider = new DeterministicAiProvider();
    const extracted = await provider.extractIssue({ ...context, complaintMessage: 'My backpack is broken. I would like a replacement.' });
    expect(extracted.constraints.preference).toBe('replacement');
    const options = ['REFUND_PARTIAL', 'REPLACEMENT_SAME'].map(type => ({
      type, title: type, requiresReturn: true, estimatedDays: 5, policyCitations: ['damage'],
    }));
    const explanation = await provider.explainOptions({ caseSummary: extracted.summary, customerConstraints: extracted.constraints, options });
    expect(explanation.recommendedOptionType).toBe('REPLACEMENT_SAME');
    const unavailable = await provider.explainOptions({ caseSummary: '', customerConstraints: { preference: 'exchange' }, options });
    expect(options.some(o => o.type === unavailable.recommendedOptionType)).toBe(true);
  });
});
