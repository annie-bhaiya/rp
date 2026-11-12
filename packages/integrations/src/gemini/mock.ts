import {
  AiProvider,
  RedactedCaseContext,
  ValidatedIssue,
  GroundedOptionsInput,
  ValidatedExplanation,
  CompletenessInput,
} from './types.js';
import {
  EvidenceCompletenessAssessment,
  EvidenceCompletenessQuestion,
  PolicyRequirementCheck,
} from '@resolvepay/contracts';

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

    const preference = text.match(/\b(?:prefer|want|would like|please send|rather have)\s+(?:a\s+|an\s+)?(refund|replacement|exchange)\b/)?.[1] as ValidatedIssue['constraints']['preference'];

    return {
      source: 'DETERMINISTIC',
      issueType,
      itemRefs,
      constraints: preference ? { preference } : {},
      missingFacts,
      evidenceRefs: [],
      summary: `Customer reports ${issueType} condition regarding ${targetItems.map((i) => i.title).join(', ')}.`,
    };
  }

  async explainOptions(input: GroundedOptionsInput): Promise<ValidatedExplanation> {
    const tradeoffs: string[] = [];
    const preference = input.customerConstraints?.preference;
    const preferredPrefix = preference === 'refund' ? 'REFUND' : preference === 'replacement' ? 'REPLACEMENT' : preference === 'exchange' ? 'EXCHANGE' : undefined;
    const recommended = (preferredPrefix && input.options.find(o => o.type.startsWith(preferredPrefix))) || input.options[0];

    const refundOpt = input.options.find((o) => o.type.includes('REFUND'));
    if (refundOpt) {
      tradeoffs.push(
        refundOpt.requiresReturn
          ? 'Refund: Refund processing follows the required return and inspection.'
          : 'Refund: Direct payment credit to your original PayPal funding source.'
      );
    }

    const replaceOpt = input.options.find((o) => o.type.includes('REPLACEMENT'));
    if (replaceOpt) {
      tradeoffs.push(
        `Same-Item Replacement: Estimated delivery: ${replaceOpt.estimatedDays} days after approval and any return checks.`
      );
    }

    const exchangeOpt = input.options.find((o) => o.type.includes('EXCHANGE'));
    if (exchangeOpt) {
      tradeoffs.push(
        `Alternative Exchange: Full credit applied towards selected alternative item.`
      );
    }

    return {
      source: 'DETERMINISTIC',
      explanationText: `Based on your purchase and store policy, ResolvePay has prepared ${input.options.length} eligible resolution plans. Choose the remedy that best fits your timeline and preference below.`,
      tradeoffs,
      recommendedOptionType: recommended?.type,
    };
  }

  async assessCompleteness(input: CompletenessInput): Promise<EvidenceCompletenessAssessment> {
    const text = input.complaintMessage.toLowerCase();
    const evidenceList = input.evidenceDescriptions || [];
    const hasPhotoEvidenceDescription = evidenceList.length > 0;

    const questions: EvidenceCompletenessQuestion[] = [];
    const requirementsChecked: PolicyRequirementCheck[] = [];

    // 1. Specific Item Identification
    const matchedItems = input.orderItems.filter((item) => {
      const words = item.title.toLowerCase().split(/\s+/);
      return (
        text.includes(item.sku.toLowerCase()) ||
        words.some((w) => w.length > 3 && text.includes(w))
      );
    });

    const itemIdentified = input.orderItems.length === 1 || matchedItems.length > 0;
    if (itemIdentified) {
      const identifiedName = matchedItems.length > 0 ? matchedItems.map((i) => i.title).join(', ') : input.orderItems[0].title;
      requirementsChecked.push({
        clauseKey: 'ITEM_IDENTIFICATION',
        title: 'Purchased Item Identification',
        satisfied: true,
        detail: `Item identified from order: ${identifiedName}`,
      });
    } else {
      const qId = 'item_spec';
      questions.push({
        id: qId,
        field: 'affectedItemSku',
        question: 'Which purchased item from your order experienced the issue?',
        placeholder: 'Select the affected item',
        options: input.orderItems.map((i) => `${i.sku} — ${i.title}`),
        requirementKey: 'ITEM_IDENTIFICATION',
      });
      requirementsChecked.push({
        clauseKey: 'ITEM_IDENTIFICATION',
        title: 'Purchased Item Identification',
        satisfied: false,
        detail: `Order contains ${input.orderItems.length} items; complaint does not specify which item is affected.`,
        missingQuestionId: qId,
      });
    }

    // 2. Specific Condition / Defect Specifics
    const defectKeywords = [
      'zipper', 'tear', 'torn', 'rip', 'broken', 'seam', 'stitch', 'fabric',
      'hole', 'defect', 'missing', 'damaged', 'scratch', 'crack', 'stain',
      'peeling', 'wrong size', 'wrong color', 'wrong item', 'split',
    ];
    const hasDefectDetail = defectKeywords.some((k) => text.includes(k)) && text.length > 15;

    if (hasDefectDetail) {
      requirementsChecked.push({
        clauseKey: 'DEFECTIVE_DAMAGED_RETURN',
        title: 'Specific Defect & Condition Description',
        satisfied: true,
        detail: 'Specific issue characteristics described in complaint narrative.',
      });
    } else {
      const qId = 'defect_detail';
      questions.push({
        id: qId,
        field: 'defectDetail',
        question: 'Could you describe the specific damage or defect (e.g. split zipper, torn seam, broken strap)?',
        placeholder: 'Describe what is damaged or non-functional...',
        requirementKey: 'DEFECTIVE_DAMAGED_RETURN',
      });
      requirementsChecked.push({
        clauseKey: 'DEFECTIVE_DAMAGED_RETURN',
        title: 'Specific Defect & Condition Description',
        satisfied: false,
        detail: 'Policy requires specific defect details before authorizing return or warranty remedy.',
        missingQuestionId: qId,
      });
    }

    // 3. Remedy Preference
    const hasPreference =
      text.includes('refund') ||
      text.includes('replace') ||
      text.includes('replacement') ||
      text.includes('exchange') ||
      text.includes('money back');

    if (hasPreference) {
      requirementsChecked.push({
        clauseKey: 'ALTERNATIVE_EXCHANGE_CREDIT',
        title: 'Resolution Remedy Preference',
        satisfied: true,
        detail: 'Customer specified resolution preference (refund, replacement, or exchange).',
      });
    } else {
      const qId = 'preference';
      questions.push({
        id: qId,
        field: 'preference',
        question: 'What remedy do you prefer?',
        placeholder: 'Select preferred resolution',
        options: ['Full Refund to Original PayPal Account', 'Same-Item Replacement', 'Exchange for Alternative Item'],
        requirementKey: 'ALTERNATIVE_EXCHANGE_CREDIT',
      });
      requirementsChecked.push({
        clauseKey: 'ALTERNATIVE_EXCHANGE_CREDIT',
        title: 'Resolution Remedy Preference',
        satisfied: false,
        detail: 'Customer preference not specified; policy offers refund, replacement, or exchange options.',
        missingQuestionId: qId,
      });
    }

    // 4. Evidence Metadata Check (without claiming to view image pixels)
    let photoEvidenceNote: string;
    if (hasPhotoEvidenceDescription) {
      photoEvidenceNote = `1 photo description on file: "${evidenceList[0]}". Evaluated text metadata without asserting image pixel inspection.`;
    } else {
      photoEvidenceNote = 'No photo description attached. Evaluated customer textual description without asserting image pixel inspection.';
    }

    const satisfiedCount = requirementsChecked.filter((r) => r.satisfied).length;
    const scorePct = Math.round((satisfiedCount / requirementsChecked.length) * 100);
    const isComplete = questions.length === 0;

    const summary = isComplete
      ? 'All policy requirements satisfied. 100% compliant for deterministic remedy enumeration.'
      : `${satisfiedCount} of ${requirementsChecked.length} policy requirements met. ${questions.length} targeted clarification(s) needed.`;

    return {
      isComplete,
      scorePct,
      summary,
      questions,
      requirementsChecked,
      hasPhotoEvidenceDescription,
      photoEvidenceNote,
      source: 'DETERMINISTIC',
    };
  }
}
