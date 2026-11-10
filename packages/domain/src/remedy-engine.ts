import {
  Order,
  OrderItem,
  PolicyVersion,
  PolicyClause,
  PlanType,
  ProductVariant,
  Plan,
} from '@resolvepay/contracts';
import { createMoney, zeroMoney, addMoney, subtractMoney, compareMoney } from './money.js';
import { computeCanonicalPlanHash } from './hash.js';

export interface RemedyCalculationInput {
  tenantId: string;
  caseId: string;
  order: Order;
  policy: PolicyVersion;
  affectedItems: Array<{ orderItemId: string; quantity: number }>;
  issueType: 'damaged' | 'missing' | 'wrong_item' | 'cancel' | 'other';
  availableCatalogVariants?: ProductVariant[];
  currentStock?: Record<string, number>; // variantId -> onHand
}

export function generateEligiblePlans(input: RemedyCalculationInput): Plan[] {
  const plans: Plan[] = [];
  const currency = input.order.currency || 'USD';

  // 1. Calculate affected item value
  let affectedTotalMinor = 0n;
  const planItems = input.affectedItems.map((aff) => {
    const item = input.order.items.find((i: OrderItem) => i.id === aff.orderItemId);
    if (!item) {
      throw new Error(`Order item not found: ${aff.orderItemId}`);
    }
    const unitPriceMinor = BigInt(item.unitPrice.minor);
    const itemTotal = unitPriceMinor * BigInt(aff.quantity);
    affectedTotalMinor += itemTotal;
    return {
      orderItemId: item.id,
      sku: item.sku,
      title: item.title,
      quantity: aff.quantity,
      unitPrice: item.unitPrice,
    };
  });

  const affectedValue = createMoney(affectedTotalMinor.toString(), currency);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 mins validity
  const createdAt = now.toISOString();

  // Find relevant policy citations
  const relevantClauses = input.policy.clauses.filter((c: PolicyClause) => {
    const key = c.key.toLowerCase();
    if (input.issueType === 'damaged' && key.includes('damage')) return true;
    if (input.issueType === 'missing' && key.includes('missing')) return true;
    if (input.issueType === 'wrong_item' && key.includes('return')) return true;
    return key.includes('standard') || key.includes('refund') || key.includes('window');
  });

  const citations = (relevantClauses.length > 0 ? relevantClauses : input.policy.clauses.slice(0, 2)).map((c: PolicyClause) => ({
    clauseId: c.id,
    clauseKey: c.key,
    title: c.title,
    excerpt: c.text,
  }));

  const requiresReturn = input.issueType !== 'missing';
  const requiresInspection = input.issueType === 'damaged' || input.issueType === 'wrong_item';

  // Option 1: Partial / Full Refund
  const isAllItems =
    input.affectedItems.length === input.order.items.length &&
    input.affectedItems.every((aff) => {
      const orig = input.order.items.find((i: OrderItem) => i.id === aff.orderItemId);
      return orig && orig.quantity === aff.quantity;
    });

  const refundType: PlanType = isAllItems ? 'REFUND_FULL' : 'REFUND_PARTIAL';
  const refundPlanDraft = {
    caseId: input.caseId,
    orderId: input.order.id,
    type: refundType,
    policyVersionId: input.policy.id,
    items: planItems,
    originalEligibleValue: affectedValue,
    refund: affectedValue,
    requiresReturn,
    requiresInspection,
  };

  const refundHash = computeCanonicalPlanHash(refundPlanDraft);
  plans.push({
    id: crypto.randomUUID(),
    tenantId: input.tenantId,
    caseId: input.caseId,
    orderId: input.order.id,
    version: 1,
    canonicalHash: refundHash,
    policyVersionId: input.policy.id,
    type: refundType,
    state: 'OFFERED',
    title: isAllItems ? 'Full Order Refund' : 'Direct Item Refund',
    explanation: `Direct refund of ${affectedValue.currency} ${(Number(affectedValue.minor) / 100).toFixed(2)} back to the original PayPal payment method.${requiresReturn ? ' Return inspection required.' : ''}`,
    items: planItems,
    originalEligibleValue: affectedValue,
    refund: affectedValue,
    requiresReturn,
    requiresInspection,
    citations,
    delivery: {
      kind: 'ESTIMATE',
      source: 'paypal-refund',
      estimatedDays: 0,
      simulated: false,
    },
    approvalsRequired: ['CUSTOMER', 'MERCHANT_APPROVER'],
    customerAccepted: false,
    merchantApproved: false,
    expiresAt,
    createdAt,
  });

  // Option 2: Same-Item Replacement (if stock available)
  if (input.affectedItems.length === 1) {
    const targetItem = input.order.items.find((i: OrderItem) => i.id === input.affectedItems[0].orderItemId);
    if (targetItem) {
      const stock = input.currentStock?.[targetItem.variantId] ?? 10; // Default stock assumption in demo
      if (stock >= input.affectedItems[0].quantity) {
        const replacementDraft = {
          caseId: input.caseId,
          orderId: input.order.id,
          type: 'REPLACEMENT_SAME' as PlanType,
          policyVersionId: input.policy.id,
          items: planItems,
          replacement: {
            variantId: targetItem.variantId,
            sku: targetItem.sku,
            title: targetItem.title,
            quantity: input.affectedItems[0].quantity,
            unitPrice: targetItem.unitPrice,
          },
          originalEligibleValue: affectedValue,
          replacementTotal: affectedValue,
          merchantCredit: affectedValue,
          additionalPayment: zeroMoney(currency),
          refund: zeroMoney(currency),
          requiresReturn,
          requiresInspection,
        };

        const replacementHash = computeCanonicalPlanHash(replacementDraft);
        plans.push({
          id: crypto.randomUUID(),
          tenantId: input.tenantId,
          caseId: input.caseId,
          orderId: input.order.id,
          version: 1,
          canonicalHash: replacementHash,
          policyVersionId: input.policy.id,
          type: 'REPLACEMENT_SAME',
          state: 'OFFERED',
          title: 'Direct Same-Item Replacement',
          explanation: `Immediate replacement dispatch for ${targetItem.title} with no extra charge.${requiresReturn ? ' Return of the original item is required.' : ''}`,
          items: planItems,
          replacement: replacementDraft.replacement,
          originalEligibleValue: affectedValue,
          replacementTotal: affectedValue,
          merchantCredit: affectedValue,
          additionalPayment: zeroMoney(currency),
          refund: zeroMoney(currency),
          requiresReturn,
          requiresInspection,
          citations,
          delivery: {
            kind: 'ESTIMATE',
            source: 'simulated-carrier',
            estimatedDays: 3,
            simulated: true,
          },
          approvalsRequired: ['CUSTOMER', 'MERCHANT_APPROVER'],
          customerAccepted: false,
          merchantApproved: false,
          expiresAt,
          createdAt,
        });
      }
    }
  }

  // Option 3 & 4: Alternative Item Exchange (if catalog variants provided)
  if (input.availableCatalogVariants && input.availableCatalogVariants.length > 0) {
    for (const alt of input.availableCatalogVariants) {
      // Don't exchange for the exact same variant
      const isSameVariant = input.affectedItems.some((aff) => {
        const orig = input.order.items.find((i: OrderItem) => i.id === aff.orderItemId);
        return orig && orig.variantId === alt.id;
      });
      if (isSameVariant) continue;

      const altTotal = alt.price;
      const priceDiff = compareMoney(altTotal, affectedValue);

      if (priceDiff > 0) {
        // More expensive exchange: Customer pays difference
        const extraPayment = subtractMoney(altTotal, affectedValue);
        const exchangeDraft = {
          caseId: input.caseId,
          orderId: input.order.id,
          type: 'EXCHANGE_MORE_EXPENSIVE' as PlanType,
          policyVersionId: input.policy.id,
          items: planItems,
          replacement: {
            variantId: alt.id,
            sku: alt.sku,
            title: alt.title,
            quantity: 1,
            unitPrice: alt.price,
          },
          originalEligibleValue: affectedValue,
          replacementTotal: altTotal,
          merchantCredit: affectedValue,
          additionalPayment: extraPayment,
          refund: zeroMoney(currency),
          requiresReturn: true,
          requiresInspection: true,
        };

        const exchangeHash = computeCanonicalPlanHash(exchangeDraft);
        plans.push({
          id: crypto.randomUUID(),
          tenantId: input.tenantId,
          caseId: input.caseId,
          orderId: input.order.id,
          version: 1,
          canonicalHash: exchangeHash,
          policyVersionId: input.policy.id,
          type: 'EXCHANGE_MORE_EXPENSIVE',
          state: 'OFFERED',
          title: `Exchange for ${alt.title} (+${(Number(extraPayment.minor) / 100).toFixed(2)})`,
          explanation: `Upgrade exchange for ${alt.title}. Full credit of $${(Number(affectedValue.minor) / 100).toFixed(2)} applied; additional payment of $${(Number(extraPayment.minor) / 100).toFixed(2)} via PayPal checkout.`,
          items: planItems,
          replacement: exchangeDraft.replacement,
          originalEligibleValue: affectedValue,
          replacementTotal: altTotal,
          merchantCredit: affectedValue,
          additionalPayment: extraPayment,
          refund: zeroMoney(currency),
          requiresReturn: true,
          requiresInspection: true,
          citations,
          delivery: {
            kind: 'ESTIMATE',
            source: 'simulated-carrier',
            estimatedDays: 2,
            simulated: true,
          },
          approvalsRequired: ['CUSTOMER', 'MERCHANT_APPROVER'],
          customerAccepted: false,
          merchantApproved: false,
          expiresAt,
          createdAt,
        });
        break; // Include top alternative
      } else if (priceDiff < 0) {
        // Cheaper exchange: Merchant refunds difference
        const refundDiff = subtractMoney(affectedValue, altTotal);
        const exchangeDraft = {
          caseId: input.caseId,
          orderId: input.order.id,
          type: 'EXCHANGE_CHEAPER' as PlanType,
          policyVersionId: input.policy.id,
          items: planItems,
          replacement: {
            variantId: alt.id,
            sku: alt.sku,
            title: alt.title,
            quantity: 1,
            unitPrice: alt.price,
          },
          originalEligibleValue: affectedValue,
          replacementTotal: altTotal,
          merchantCredit: altTotal,
          additionalPayment: zeroMoney(currency),
          refund: refundDiff,
          requiresReturn: true,
          requiresInspection: true,
        };

        const exchangeHash = computeCanonicalPlanHash(exchangeDraft);
        plans.push({
          id: crypto.randomUUID(),
          tenantId: input.tenantId,
          caseId: input.caseId,
          orderId: input.order.id,
          version: 1,
          canonicalHash: exchangeHash,
          policyVersionId: input.policy.id,
          type: 'EXCHANGE_CHEAPER',
          state: 'OFFERED',
          title: `Exchange for ${alt.title} (Refund difference $${(Number(refundDiff.minor) / 100).toFixed(2)})`,
          explanation: `Exchange for ${alt.title}. Replacement dispatched plus a partial refund of $${(Number(refundDiff.minor) / 100).toFixed(2)} back to PayPal.`,
          items: planItems,
          replacement: exchangeDraft.replacement,
          originalEligibleValue: affectedValue,
          replacementTotal: altTotal,
          merchantCredit: altTotal,
          additionalPayment: zeroMoney(currency),
          refund: refundDiff,
          requiresReturn: true,
          requiresInspection: true,
          citations,
          delivery: {
            kind: 'ESTIMATE',
            source: 'simulated-carrier',
            estimatedDays: 3,
            simulated: true,
          },
          approvalsRequired: ['CUSTOMER', 'MERCHANT_APPROVER'],
          customerAccepted: false,
          merchantApproved: false,
          expiresAt,
          createdAt,
        });
        break; // Include top cheaper alternative
      }
    }
  }

  return plans;
}
