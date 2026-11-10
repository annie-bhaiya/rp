import { createHash } from 'node:crypto';
import { Plan } from '@resolvepay/contracts';

/**
 * Computes a deterministic SHA-256 hash of the material terms of a plan.
 * Customer acceptance and merchant approval bind to this exact canonical hash.
 * If any material financial or condition term changes, the hash changes, invalidating prior approval.
 */
export function computeCanonicalPlanHash(plan: {
  caseId: string;
  orderId: string;
  type: string;
  policyVersionId: string;
  items: Array<{ orderItemId: string; sku: string; quantity: number; unitPrice: { currency: string; minor: string } }>;
  replacement?: { variantId: string; sku: string; quantity: number; unitPrice: { currency: string; minor: string } };
  originalEligibleValue: { currency: string; minor: string };
  replacementTotal?: { currency: string; minor: string };
  merchantCredit?: { currency: string; minor: string };
  additionalPayment?: { currency: string; minor: string };
  refund: { currency: string; minor: string };
  requiresReturn: boolean;
  requiresInspection: boolean;
}): string {
  // Sort items deterministically by orderItemId
  const sortedItems = [...plan.items].sort((a, b) => a.orderItemId.localeCompare(b.orderItemId));

  const canonicalPayload = {
    caseId: plan.caseId,
    orderId: plan.orderId,
    type: plan.type,
    policyVersionId: plan.policyVersionId,
    items: sortedItems.map((item) => ({
      orderItemId: item.orderItemId,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: { currency: item.unitPrice.currency, minor: item.unitPrice.minor },
    })),
    replacement: plan.replacement
      ? {
          variantId: plan.replacement.variantId,
          sku: plan.replacement.sku,
          quantity: plan.replacement.quantity,
          unitPrice: { currency: plan.replacement.unitPrice.currency, minor: plan.replacement.unitPrice.minor },
        }
      : null,
    originalEligibleValue: {
      currency: plan.originalEligibleValue.currency,
      minor: plan.originalEligibleValue.minor,
    },
    replacementTotal: plan.replacementTotal
      ? { currency: plan.replacementTotal.currency, minor: plan.replacementTotal.minor }
      : null,
    merchantCredit: plan.merchantCredit
      ? { currency: plan.merchantCredit.currency, minor: plan.merchantCredit.minor }
      : null,
    additionalPayment: plan.additionalPayment
      ? { currency: plan.additionalPayment.currency, minor: plan.additionalPayment.minor }
      : null,
    refund: {
      currency: plan.refund.currency,
      minor: plan.refund.minor,
    },
    requiresReturn: plan.requiresReturn,
    requiresInspection: plan.requiresInspection,
  };

  const serialized = JSON.stringify(canonicalPayload);
  return createHash('sha256').update(serialized).digest('hex');
}
