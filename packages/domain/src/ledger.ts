import { AccountCode } from '@resolvepay/contracts';

export interface UncommittedJournalEntry {
  accountCode: AccountCode;
  debitMinor: string;
  creditMinor: string;
}

export interface UncommittedTransaction {
  businessEventKey: string;
  description: string;
  currency: string;
  occurredAt?: string;
  entries: UncommittedJournalEntry[];
}

export class LedgerImbalanceError extends Error {
  constructor(debitTotal: bigint, creditTotal: bigint, currency: string) {
    super(
      `Double-entry ledger invariant violation: Debits (${debitTotal.toString()}) do not balance Credits (${creditTotal.toString()}) for ${currency}`
    );
    this.name = 'LedgerImbalanceError';
  }
}

/**
 * Validates that sum(debitMinor) === sum(creditMinor) for the transaction.
 * Throws LedgerImbalanceError if debits and credits do not balance.
 */
export function validateJournalBalance(entries: UncommittedJournalEntry[], currency: string = 'USD'): void {
  let totalDebit = 0n;
  let totalCredit = 0n;

  for (const entry of entries) {
    const debit = BigInt(entry.debitMinor);
    const credit = BigInt(entry.creditMinor);

    if (debit < 0n || credit < 0n) {
      throw new Error(`Negative entry amounts are prohibited in append-only ledger (use reversing entries)`);
    }
    if (debit > 0n && credit > 0n) {
      throw new Error(`An individual entry line cannot contain both debit and credit amounts`);
    }

    totalDebit += debit;
    totalCredit += credit;
  }

  if (totalDebit !== totalCredit) {
    throw new LedgerImbalanceError(totalDebit, totalCredit, currency);
  }
}

/**
 * Initial Order Capture Journal Transaction:
 * Debit: PAYPAL_CLEARING (full capture amount)
 * Credit: SALES_REVENUE (subtotal)
 * Credit: SALES_TAX_PAYABLE (tax)
 * Credit: SHIPPING_REVENUE (shipping)
 */
export function buildOrderCaptureJournal(params: {
  orderId: string;
  subtotalMinor: string;
  taxMinor: string;
  shippingMinor: string;
  totalMinor: string;
  currency?: string;
}): UncommittedTransaction {
  const currency = params.currency || 'USD';
  const entries: UncommittedJournalEntry[] = [
    {
      accountCode: 'PAYPAL_CLEARING',
      debitMinor: params.totalMinor,
      creditMinor: '0',
    },
    {
      accountCode: 'SALES_REVENUE',
      debitMinor: '0',
      creditMinor: params.subtotalMinor,
    },
  ];

  if (BigInt(params.taxMinor) > 0n) {
    entries.push({
      accountCode: 'SALES_TAX_PAYABLE',
      debitMinor: '0',
      creditMinor: params.taxMinor,
    });
  }

  if (BigInt(params.shippingMinor) > 0n) {
    entries.push({
      accountCode: 'SHIPPING_REVENUE',
      debitMinor: '0',
      creditMinor: params.shippingMinor,
    });
  }

  validateJournalBalance(entries, currency);

  return {
    businessEventKey: `ORDER_CAPTURE:${params.orderId}`,
    description: `Order initial capture: ${params.orderId}`,
    currency,
    entries,
  };
}

/**
 * Refund Journal Transaction:
 * Debit: SALES_RETURNS (item value refunded)
 * Debit: SALES_TAX_PAYABLE (tax refunded, if applicable)
 * Credit: PAYPAL_CLEARING (total refunded through PayPal)
 */
export function buildRefundJournal(params: {
  orderId: string;
  refundId: string;
  itemRefundMinor: string;
  taxRefundMinor?: string;
  totalRefundMinor: string;
  currency?: string;
}): UncommittedTransaction {
  const currency = params.currency || 'USD';
  const taxMinor = params.taxRefundMinor || '0';

  const entries: UncommittedJournalEntry[] = [
    {
      accountCode: 'SALES_RETURNS',
      debitMinor: params.itemRefundMinor,
      creditMinor: '0',
    },
  ];

  if (BigInt(taxMinor) > 0n) {
    entries.push({
      accountCode: 'SALES_TAX_PAYABLE',
      debitMinor: taxMinor,
      creditMinor: '0',
    });
  }

  entries.push({
    accountCode: 'PAYPAL_CLEARING',
    debitMinor: '0',
    creditMinor: params.totalRefundMinor,
  });

  validateJournalBalance(entries, currency);

  return {
    businessEventKey: `REFUND_SETTLED:${params.refundId}`,
    description: `Refund settled for order ${params.orderId}`,
    currency,
    entries,
  };
}

/**
 * Exchange Return Credit Issuance:
 * Debit: SALES_RETURNS (returned item value)
 * Credit: EXCHANGE_CREDIT_LIABILITY (merchant credit held for customer exchange)
 */
export function buildExchangeCreditJournal(params: {
  caseId: string;
  creditMinor: string;
  currency?: string;
}): UncommittedTransaction {
  const currency = params.currency || 'USD';
  const entries: UncommittedJournalEntry[] = [
    {
      accountCode: 'SALES_RETURNS',
      debitMinor: params.creditMinor,
      creditMinor: '0',
    },
    {
      accountCode: 'EXCHANGE_CREDIT_LIABILITY',
      debitMinor: '0',
      creditMinor: params.creditMinor,
    },
  ];

  validateJournalBalance(entries, currency);

  return {
    businessEventKey: `EXCHANGE_CREDIT_ISSUED:${params.caseId}`,
    description: `Exchange credit recognized following inspection for case ${params.caseId}`,
    currency,
    entries,
  };
}

/**
 * Exchange Order Commitment (Consuming Credit + Extra Payment):
 * Debit: EXCHANGE_CREDIT_LIABILITY (consumed credit)
 * Debit: PAYPAL_CLEARING (extra charge collected via PayPal, if any)
 * Credit: SALES_REVENUE (replacement item revenue)
 */
export function buildExchangeCommitJournal(params: {
  caseId: string;
  replacementOrderId: string;
  creditConsumedMinor: string;
  extraPaymentMinor: string;
  replacementTotalMinor: string;
  currency?: string;
}): UncommittedTransaction {
  const currency = params.currency || 'USD';
  const entries: UncommittedJournalEntry[] = [
    {
      accountCode: 'EXCHANGE_CREDIT_LIABILITY',
      debitMinor: params.creditConsumedMinor,
      creditMinor: '0',
    },
  ];

  if (BigInt(params.extraPaymentMinor) > 0n) {
    entries.push({
      accountCode: 'PAYPAL_CLEARING',
      debitMinor: params.extraPaymentMinor,
      creditMinor: '0',
    });
  }

  entries.push({
    accountCode: 'SALES_REVENUE',
    debitMinor: '0',
    creditMinor: params.replacementTotalMinor,
  });

  validateJournalBalance(entries, currency);

  return {
    businessEventKey: `EXCHANGE_COMMITTED:${params.replacementOrderId}`,
    description: `Exchange order committed for case ${params.caseId}`,
    currency,
    entries,
  };
}

