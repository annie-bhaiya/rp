import { Injectable } from '@nestjs/common';
import {
  getDb,
  cases,
  orders,
  orderItems,
  plans,
  resolutions,
  journalTransactions,
  journalEntries,
  eq,
  desc,
} from '@resolvepay/db';

export interface ProductInsight {
  sku: string;
  title: string;
  totalOrders: number;
  complaintCount: number;
  complaintRatePct: number;
  topIssue: string;
}

export interface MerchantInsights {
  summary: {
    totalOrders: number;
    totalCases: number;
    resolvedCases: number;
    activeCases: number;
    disputeRatePct: number;
    totalRefundMinor: string;
    totalReplacementsDispatched: number;
  };
  issueBreakdown: Record<string, number>;
  remedyBreakdown: Record<string, number>;
  productInsights: ProductInsight[];
}

@Injectable()
export class MerchantService {
  async getInsights(tenantId: string): Promise<MerchantInsights> {
    const db = await getDb();

    // 1. All orders for tenant
    const tenantOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
    const allOrderItems = await db.select().from(orderItems);

    // 2. All cases for tenant
    const tenantCases = await db.select().from(cases).where(eq(cases.tenantId, tenantId));

    // 3. All plans and resolutions
    const tenantPlans = await db.select().from(plans).where(eq(plans.tenantId, tenantId));
    const tenantResolutions = await db.select().from(resolutions).where(eq(resolutions.tenantId, tenantId));

    // Summary calculations
    const totalOrders = tenantOrders.length;
    const totalCases = tenantCases.length;
    const resolvedCases = tenantCases.filter((c) => c.state === 'RESOLVED' || c.state === 'CLOSED').length;
    const activeCases = totalCases - resolvedCases;
    const disputeRatePct = totalOrders > 0 ? Number(((totalCases / totalOrders) * 100).toFixed(1)) : 0;

    // Issue breakdown
    const issueBreakdown: Record<string, number> = {
      damaged: 0,
      missing: 0,
      wrong_item: 0,
      cancel: 0,
      other: 0,
    };
    for (const c of tenantCases) {
      const issue = c.issueType || 'other';
      issueBreakdown[issue] = (issueBreakdown[issue] || 0) + 1;
    }

    // Remedy breakdown & total money refunded
    const remedyBreakdown: Record<string, number> = {
      REFUND: 0,
      REPLACEMENT_SAME: 0,
      EXCHANGE_CHEAPER: 0,
      EXCHANGE_MORE_EXPENSIVE: 0,
    };
    let totalRefundMinorBigInt = 0n;
    let replacementsDispatched = 0;

    for (const p of tenantPlans) {
      if (p.state === 'ACCEPTED' || p.merchantApproved) {
        remedyBreakdown[p.type] = (remedyBreakdown[p.type] || 0) + 1;
        const pData = p.planData as any;
        if (pData?.refundAmount?.minor) {
          totalRefundMinorBigInt += BigInt(pData.refundAmount.minor);
        }
        if (pData?.replacementItems?.length) {
          replacementsDispatched += pData.replacementItems.length;
        }
      }
    }

    // Product breakdown
    const skuOrdersMap = new Map<string, { title: string; count: number }>();
    for (const item of allOrderItems) {
      const curr = skuOrdersMap.get(item.sku) || { title: item.title, count: 0 };
      curr.count += item.quantity;
      skuOrdersMap.set(item.sku, curr);
    }

    const skuComplaintsMap = new Map<string, { count: number; issues: Record<string, number> }>();
    for (const c of tenantCases) {
      const relatedItems = allOrderItems.filter((i) => i.orderId === c.orderId);
      for (const item of relatedItems) {
        const curr = skuComplaintsMap.get(item.sku) || { count: 0, issues: {} };
        curr.count += 1;
        const iss = c.issueType || 'other';
        curr.issues[iss] = (curr.issues[iss] || 0) + 1;
        skuComplaintsMap.set(item.sku, curr);
      }
    }

    const productInsights: ProductInsight[] = [];
    for (const [sku, info] of skuOrdersMap.entries()) {
      const comp = skuComplaintsMap.get(sku) || { count: 0, issues: {} };
      const topIssue =
        Object.entries(comp.issues).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
      const rate = info.count > 0 ? Number(((comp.count / info.count) * 100).toFixed(1)) : 0;
      productInsights.push({
        sku,
        title: info.title,
        totalOrders: info.count,
        complaintCount: comp.count,
        complaintRatePct: rate,
        topIssue,
      });
    }

    return {
      summary: {
        totalOrders,
        totalCases,
        resolvedCases,
        activeCases,
        disputeRatePct,
        totalRefundMinor: totalRefundMinorBigInt.toString(),
        totalReplacementsDispatched: replacementsDispatched,
      },
      issueBreakdown,
      remedyBreakdown,
      productInsights,
    };
  }

  async generateReconciliationCsv(tenantId: string): Promise<string> {
    const db = await getDb();

    const txs = await db
      .select()
      .from(journalTransactions)
      .where(eq(journalTransactions.tenantId, tenantId))
      .orderBy(desc(journalTransactions.occurredAt));

    const allEntries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.tenantId, tenantId));

    const rows: string[] = [];
    rows.push('Transaction ID,Date,Business Event Key,Description,Currency,Account Code,Debit ($),Credit ($),Debit Minor,Credit Minor');

    for (const tx of txs) {
      const entries = allEntries.filter((e) => e.transactionId === tx.id);
      for (const e of entries) {
        const debitMinor = BigInt(e.debitMinor || '0');
        const creditMinor = BigInt(e.creditMinor || '0');
        const debitDollar = (Number(debitMinor) / 100).toFixed(2);
        const creditDollar = (Number(creditMinor) / 100).toFixed(2);
        const safeDesc = `"${tx.description.replace(/"/g, '""')}"`;
        rows.push(
          `${tx.id},${tx.occurredAt.toISOString()},${tx.businessEventKey},${safeDesc},${tx.currency},${e.accountCode},${debitDollar},${creditDollar},${e.debitMinor},${e.creditMinor}`
        );
      }
    }

    return rows.join('\r\n');
  }
}

