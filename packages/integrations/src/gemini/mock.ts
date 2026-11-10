import {
  AiProvider,
  RedactedCaseContext,
  ValidatedIssue,
  GroundedOptionsInput,
  ValidatedExplanation,
} from './types.js';

export class DeterministicAiProvider implements AiProvider {
  async extractIssue(input: RedactedCaseContext): Promise<ValidatedIssue> {
    const text = input.complaintMessage.toLowerCase();

    let issueType: ValidatedIssue['issueType'] = 'other';
    if (text.includes('damage') || text.includes('broken') || text.includes('zipper') || text.includes('rip') || text.includes('defect')) {
      issueType = 'damaged';
    } else if (text.includes('missing') || text.includes('not in box') || text.includes('never arrived') || text.includes('did not receive')) {
      issueType = 'missing';
    } else if (text.includes('wrong') || text.includes('incorrect') || text.includes('different color') || text.includes('different size')) {
      issueType = 'wrong_item';
    } else if (text.includes('cancel') || text.includes('return') || text.includes('refund')) {
      issueType = 'cancel';
    }

    // Match order items by keyword in title/sku
    const matchedItems = input.orderItems.filter((item) => {
      const words = item.title.toLowerCase().split(/\s+/);
      return words.some((w) => w.length > 3 && text.includes(w));
    });

    const targetItems = matchedItems.length > 0
      ? matchedItems
      : input.orderItems.length > 0
        ? [input.orderItems[0]]
        : [];

    const itemRefs = targetItems.map((item) => ({
      orderItemId: item.orderItemId,
      quantity: 1,
    }));

    const missingFacts: string[] = [];
    if (issueType === 'damaged' && !text.includes('photo') && !text.includes('picture')) {
      missingFacts.push('Customer photo evidence of damage requested for faster inspection review.');
    }

    return {
      issueType,
      itemRefs,
      constraints: {},
      missingFacts,
      evidenceRefs: [],
      summary: `Customer reports ${issueType} condition regarding ${targetItems.map((i) => i.title).join(', ')}.`,
    };
  }

  async explainOptions(input: GroundedOptionsInput): Promise<ValidatedExplanation> {
    const tradeoffs: string[] = [];

    const refundOpt = input.options.find((o) => o.type.includes('REFUND'));
    if (refundOpt) {
      tradeoffs.push(
        refundOpt.requiresReturn
          ? 'Refund: Immediate credit to PayPal following physical return inspection.'
          : 'Refund: Direct payment credit to your original PayPal funding source.'
      );
    }

    const replaceOpt = input.options.find((o) => o.type.includes('REPLACEMENT'));
    if (replaceOpt) {
      tradeoffs.push(
        `Same-Item Replacement: Dispatches in ~${replaceOpt.estimatedDays} days with prepaid return packaging included.`
      );
    }

    const exchangeOpt = input.options.find((o) => o.type.includes('EXCHANGE'));
    if (exchangeOpt) {
      tradeoffs.push(
        `Alternative Exchange: Full credit applied towards selected alternative item.`
      );
    }

    return {
      explanationText: `Based on your purchase and store policy, ResolvePay has prepared ${input.options.length} eligible resolution plans. Choose the remedy that best fits your timeline and preference below.`,
      tradeoffs,
      recommendedOptionType: input.options[0]?.type,
    };
  }
}
