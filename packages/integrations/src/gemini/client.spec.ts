import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GeminiAiClient } from './client.js';

const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));
vi.mock('@google/genai', async (importOriginal) => ({
  ...await importOriginal<typeof import('@google/genai')>(),
  GoogleGenAI: class { models = { generateContent }; },
}));

const context = {
  orderReference: 'TEST', complaintMessage: 'My backpack is broken. I prefer a replacement.',
  orderItems: [{ orderItemId: 'item-1', title: 'Backpack', sku: 'PACK', quantity: 1 }],
};

describe('Gemini provider recovery', () => {
  beforeEach(() => { generateContent.mockReset(); });

  it('sends the complaint and preserves validated model output with its source', async () => {
    generateContent.mockResolvedValue({ text: JSON.stringify({
      issueType: 'damaged', itemRefs: [{ orderItemId: 'item-1', quantity: 1 }],
      summary: 'Broken backpack', missingFacts: [], constraints: { preference: 'replacement' },
    }) });
    const result = await new GeminiAiClient({ apiKey: 'test' }).extractIssue(context);
    expect(generateContent.mock.calls[0][0].contents).toContain(context.complaintMessage);
    expect(result.source).toBe('GEMINI');
    expect(result.constraints.preference).toBe('replacement');
  });

  it.each(['timeout', 'malformed', 'foreign item'])('falls back when extraction fails: %s', async failure => {
    if (failure === 'timeout') generateContent.mockRejectedValue(new Error('timeout'));
    else generateContent.mockResolvedValue({ text: failure === 'malformed' ? '{' : JSON.stringify({
      issueType: 'damaged', itemRefs: [{ orderItemId: 'another-order', quantity: 1 }], summary: 'Invalid', missingFacts: [],
    }) });
    const result = await new GeminiAiClient({ apiKey: 'test' }).extractIssue(context);
    expect(result.source).toBe('FALLBACK');
    expect(result.itemRefs).toEqual([{ orderItemId: 'item-1', quantity: 1 }]);
  });

  it('recovers from an invented remedy recommendation', async () => {
    generateContent.mockResolvedValue({ text: JSON.stringify({ explanationText: 'Free upgrade', tradeoffs: [], recommendedOptionType: 'FREE_UPGRADE' }) });
    const result = await new GeminiAiClient({ apiKey: 'test' }).explainOptions({
      caseSummary: 'Broken backpack', options: [{ type: 'REFUND_FULL', title: 'Refund', requiresReturn: true, estimatedDays: 0, policyCitations: ['damage'] }],
    });
    expect(result.source).toBe('FALLBACK');
    expect(result.recommendedOptionType).toBe('REFUND_FULL');
  });

  it('completeness evaluation asks targeted questions when complaint is incomplete', async () => {
    const multiItemContext = {
      orderReference: 'ORD-MULTI',
      complaintMessage: 'It is broken, help.',
      orderItems: [
        { orderItemId: 'item-1', title: 'Apex Backpack 40L', sku: 'APEX-40L', quantity: 1 },
        { orderItemId: 'item-2', title: 'Carbon Poles', sku: 'POLES-CRBN', quantity: 1 },
      ],
      policyClauses: [
        { key: 'DEFECTIVE_DAMAGED_RETURN', title: 'Damaged Items', text: 'Requires return inspection' },
      ],
      evidenceDescriptions: [],
    };
    const assessment = await new GeminiAiClient({ apiKey: 'test' }).assessCompleteness(multiItemContext);
    expect(assessment.isComplete).toBe(false);
    expect(assessment.questions.length).toBeGreaterThan(0);
    expect(assessment.questions.some((q) => q.field === 'affectedItemSku')).toBe(true);
    expect(assessment.photoEvidenceNote).not.toContain('inspected the image');
  });

  it('completeness evaluation succeeds when complaint satisfies all requirements', async () => {
    const completeContext = {
      orderReference: 'ORD-COMPLETE',
      complaintMessage: 'My Apex Backpack 40L has a split zipper along the main seam. I would prefer a full refund please.',
      orderItems: [
        { orderItemId: 'item-1', title: 'Apex Backpack 40L', sku: 'APEX-40L', quantity: 1 },
      ],
      policyClauses: [
        { key: 'DEFECTIVE_DAMAGED_RETURN', title: 'Damaged Items', text: 'Requires return inspection' },
      ],
      evidenceDescriptions: ['Photo showing broken zipper teeth'],
    };
    const assessment = await new GeminiAiClient({ apiKey: 'test' }).assessCompleteness(completeContext);
    expect(assessment.isComplete).toBe(true);
    expect(assessment.questions.length).toBe(0);
    expect(assessment.hasPhotoEvidenceDescription).toBe(true);
    expect(assessment.photoEvidenceNote).toContain('without asserting image pixel inspection');
  });
});
