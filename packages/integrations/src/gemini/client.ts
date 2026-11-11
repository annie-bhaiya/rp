import { GoogleGenAI, Type } from '@google/genai';
import {
  AiProvider,
  RedactedCaseContext,
  ValidatedIssue,
  GroundedOptionsInput,
  ValidatedExplanation,
} from './types.js';

export interface GeminiClientConfig {
  apiKey: string;
  model?: string;
}

export class GeminiAiClient implements AiProvider {
  private ai: GoogleGenAI;
  private model: string;

  constructor(config: GeminiClientConfig) {
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gemini-3.8-flash';
  }

  async extractIssue(input: RedactedCaseContext): Promise<ValidatedIssue> {
    try {
      const itemsDescription = input.orderItems
        .map((item) => `- ID: ${item.orderItemId}, Title: "${item.title}", SKU: ${item.sku}, Qty: ${item.quantity}`)
        .join('\n');

      const prompt = `You are the advisory issue-extraction component of ResolvePay Rescue.
You analyze customer complaints against authenticated order items and extract structured facts.
Never invent order item IDs or quantities. Never include personal customer identifiers.

AUTHENTICATED ORDER ITEMS:
${itemsDescription}

CUSTOMER COMPLAINT:
"${input.complaintMessage}"

TASK:
1. Identify the primary issueType from: 'damaged', 'missing', 'wrong_item', 'cancel', 'other'.
2. Map the complaint to specific order items and quantities.
3. Extract any customer constraints such as maximum extra budget or deadline.
4. Note missing facts required to settle the claim.
5. Provide a 1-sentence objective summary.`;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              issueType: {
                type: Type.STRING,
                enum: ['damaged', 'missing', 'wrong_item', 'cancel', 'other'],
              },
              itemRefs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    orderItemId: { type: Type.STRING },
                    quantity: { type: Type.INTEGER },
                  },
                  required: ['orderItemId', 'quantity'],
                },
              },
              missingFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              summary: { type: Type.STRING },
            },
            required: ['issueType', 'itemRefs', 'missingFacts', 'summary'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}') as {
        issueType: ValidatedIssue['issueType'];
        itemRefs: ValidatedIssue['itemRefs'];
        missingFacts: string[];
        summary: string;
      };

      return {
        issueType: parsed.issueType || 'damaged',
        itemRefs: parsed.itemRefs?.length ? parsed.itemRefs : input.orderItems.map((i) => ({ orderItemId: i.orderItemId, quantity: 1 })),
        constraints: {},
        missingFacts: parsed.missingFacts || [],
        evidenceRefs: [],
        summary: parsed.summary || 'Customer reported an issue with order item.',
      };
    } catch (err: any) {
      console.warn(`[GeminiAiClient] Gemini inference notice: ${err?.message || err}. Falling back to deterministic extraction.`);
      const lower = (input.complaintMessage || '').toLowerCase();
      let issueType: ValidatedIssue['issueType'] = 'damaged';
      if (lower.includes('missing') || lower.includes('not in box') || lower.includes('didn\'t receive')) {
        issueType = 'missing';
      } else if (lower.includes('wrong') || lower.includes('different') || lower.includes('incorrect')) {
        issueType = 'wrong_item';
      } else if (lower.includes('cancel')) {
        issueType = 'cancel';
      }

      return {
        issueType,
        itemRefs: input.orderItems.map((item) => ({
          orderItemId: item.orderItemId,
          quantity: 1,
        })),
        constraints: {},
        missingFacts: ['Damage photo evidence if applicable'],
        evidenceRefs: [],
        summary: `Customer complaint concerning order items (${issueType}).`,
      };
    }
  }

  async explainOptions(input: GroundedOptionsInput): Promise<ValidatedExplanation> {
    try {
      const optionsText = input.options
        .map(
          (opt, idx) =>
            `Option ${idx + 1} (${opt.type}): "${opt.title}" - Return required: ${opt.requiresReturn}. Refund: $${opt.refundAmount ? (Number(opt.refundAmount.minor) / 100).toFixed(2) : '0.00'}. Est. Delivery: ${opt.estimatedDays} days. Citations: [${opt.policyCitations.join(', ')}]`
        )
        .join('\n');

      const prompt = `You are ResolvePay Rescue remedy explainer.
Provide a clear, neutral, truthful explanation of the eligible resolution options to the customer.
Stick strictly to the provided numbers and policy citations. Never make false promises or fabricate discounts.

CASE SUMMARY:
${input.caseSummary}

GROUNDED REMEDY OPTIONS:
${optionsText}`;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanationText: { type: Type.STRING },
              tradeoffs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedOptionType: { type: Type.STRING },
            },
            required: ['explanationText', 'tradeoffs'],
          },
        },
      });

      return JSON.parse(response.text || '{}') as ValidatedExplanation;
    } catch (err: any) {
      console.warn(`[GeminiAiClient] Gemini explainOptions notice: ${err?.message || err}. Falling back to deterministic explanation.`);
      return {
        explanationText: `Based on store policy, ${input.options.length} verified remedy options have been generated for your order. Each option complies with policy terms with verified financial calculations.`,
        tradeoffs: input.options.map((o) =>
          o.requiresReturn
            ? `${o.title}: Requires physical item return before fulfillment.`
            : `${o.title}: Immediate resolution without return requirement.`
        ),
        recommendedOptionType: input.options[0]?.type,
      };
    }
  }
}
