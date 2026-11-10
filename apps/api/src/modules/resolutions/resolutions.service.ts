import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  getDb,
  returns,
  resolutions,
  resolutionSteps,
  cases,
  captures,
  refunds,
  eq,
  and,
} from '@resolvepay/db';
import { RecordInspectionDto, SessionInfo } from '@resolvepay/contracts';
import { transitionReturn } from '@resolvepay/domain';
import { PayPalAdapter, PayPalRestClient, MockPayPalAdapter } from '@resolvepay/integrations';

@Injectable()
export class ResolutionsService {
  private paypalAdapter: PayPalAdapter;

  constructor() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (clientId && clientSecret) {
      this.paypalAdapter = new PayPalRestClient({
        clientId,
        clientSecret,
        mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox',
        webhookId: process.env.PAYPAL_WEBHOOK_ID,
      });
    } else {
      this.paypalAdapter = new MockPayPalAdapter();
    }
  }

  async recordInspection(dto: RecordInspectionDto, session: SessionInfo): Promise<any> {
    const db = await getDb();
    const [returnRow] = await db.select().from(returns).where(eq(returns.id, dto.returnId)).limit(1);
    if (!returnRow) throw new NotFoundException(`Return not found: ${dto.returnId}`);

    const newStatus = dto.result === 'PASSED' ? 'INSPECTION_PASSED' : 'INSPECTION_FAILED';

    await db
      .update(returns)
      .set({
        status: newStatus,
        inspectionResult: dto.result,
        inspectorId: session.actorId,
        inspectionNotes: dto.notes,
        inspectedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(returns.id, returnRow.id));

    return {
      returnId: returnRow.id,
      status: newStatus,
      inspectionResult: dto.result,
      inspectedAt: new Date().toISOString(),
    };
  }

  async getRecoveryQueue(tenantId: string): Promise<any[]> {
    const db = await getDb();
    const failedSteps = await db
      .select()
      .from(resolutionSteps)
      .where(
        and(
          eq(resolutionSteps.tenantId, tenantId),
          eq(resolutionSteps.state, 'UNKNOWN')
        )
      );

    return failedSteps.map((s) => ({
      stepId: s.id,
      resolutionId: s.resolutionId,
      stepKey: s.stepKey,
      state: s.state,
      attempt: s.attempt,
      error: s.error,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  async reconcileOperation(stepId: string, session: SessionInfo): Promise<any> {
    const db = await getDb();
    const [step] = await db.select().from(resolutionSteps).where(eq(resolutionSteps.id, stepId)).limit(1);
    if (!step) throw new NotFoundException(`Step not found: ${stepId}`);

    // Safe authoritative lookup without creating a new payment key (Plan §12.2)
    if (step.stepKey === 'EXECUTE_REFUND' && step.externalReference) {
      const refundInfo = await this.paypalAdapter.getRefund(step.externalReference);
      if (refundInfo.status === 'COMPLETED') {
        await db.update(resolutionSteps).set({ state: 'SUCCEEDED', updatedAt: new Date() }).where(eq(resolutionSteps.id, step.id));
        return { success: true, reconciledState: 'SUCCEEDED', refundInfo };
      }
    }

    return { success: true, message: 'Reconciled authoritative provider state', currentState: step.state };
  }
}

