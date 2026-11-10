import { Injectable, Logger } from '@nestjs/common';
import {
  getDb,
  jobs,
  resolutionSteps,
  resolutions,
  eq,
  and,
  sql,
} from '@resolvepay/db';
import { PayPalAdapter, PayPalRestClient, MockPayPalAdapter } from '@resolvepay/integrations';

@Injectable()
export class WorkerRunnerService {
  private readonly logger = new Logger(WorkerRunnerService.name);
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

  /**
   * Scans and processes a bounded batch of ready jobs and reconciles stale UNKNOWN resolution steps.
   * Runs independently of browser traffic (Plan §12.1).
   */
  async processBatch(batchSize: number = 20): Promise<{ processed: number; reconciled: number }> {
    const db = await getDb();
    const workerId = `worker-${process.pid}-${Date.now()}`;
    const leaseDurationMinutes = 2;
    const leaseUntil = new Date(Date.now() + leaseDurationMinutes * 60 * 1000);

    this.logger.log(`[Worker] Starting batch execution cycle as ${workerId}`);

    // 1. Claim ready jobs with lease update
    const readyJobs = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.state, 'READY'),
          sql`${jobs.readyAt} <= NOW()`
        )
      )
      .limit(batchSize);

    let processed = 0;
    for (const job of readyJobs) {
      try {
        await db
          .update(jobs)
          .set({
            state: 'CLAIMED',
            leaseOwner: workerId,
            leaseUntil,
            attempts: job.attempts + 1,
          })
          .where(eq(jobs.id, job.id));

        this.logger.log(`[Worker] Executing job ${job.id} (${job.type})`);

        // Execute specific job handlers
        if (job.type === 'RECONCILE_STEP') {
          const stepId = (job.payload as any)?.stepId;
          if (stepId) {
            await this.reconcileStaleStep(stepId);
          }
        }

        await db.update(jobs).set({ state: 'COMPLETED' }).where(eq(jobs.id, job.id));
        processed++;
      } catch (err) {
        this.logger.error(`[Worker] Job ${job.id} failed:`, err);
        await db
          .update(jobs)
          .set({
            state: job.attempts >= 3 ? 'FAILED' : 'READY',
            readyAt: new Date(Date.now() + 60 * 1000), // Backoff retry
          })
          .where(eq(jobs.id, job.id));
      }
    }

    // 2. Scan and reconcile stale UNKNOWN steps (Plan §12.1 & §12.2)
    const staleSteps = await db
      .select()
      .from(resolutionSteps)
      .where(
        and(
          eq(resolutionSteps.state, 'UNKNOWN'),
          sql`(${resolutionSteps.leaseUntil} IS NULL OR ${resolutionSteps.leaseUntil} < NOW())`
        )
      )
      .limit(10);

    let reconciled = 0;
    for (const step of staleSteps) {
      const recovered = await this.reconcileStaleStep(step.id);
      if (recovered) reconciled++;
    }

    this.logger.log(`[Worker] Finished batch cycle: ${processed} jobs processed, ${reconciled} steps reconciled.`);
    return { processed, reconciled };
  }

  private async reconcileStaleStep(stepId: string): Promise<boolean> {
    const db = await getDb();
    const [step] = await db.select().from(resolutionSteps).where(eq(resolutionSteps.id, stepId)).limit(1);
    if (!step) return false;

    this.logger.log(`[Worker Reconcile] Investigating stale step ${step.id} (${step.stepKey})`);

    if (step.stepKey === 'EXECUTE_REFUND' && step.externalReference) {
      try {
        const refund = await this.paypalAdapter.getRefund(step.externalReference);
        if (refund.status === 'COMPLETED') {
          await db
            .update(resolutionSteps)
            .set({ state: 'SUCCEEDED', updatedAt: new Date() })
            .where(eq(resolutionSteps.id, step.id));
          this.logger.log(`[Worker Reconcile] Step ${step.id} confirmed completed at PayPal.`);
          return true;
        }
      } catch (err) {
        this.logger.warn(`[Worker Reconcile] External lookup failed for ${step.id}: ${(err as Error).message}`);
      }
    }

    return false;
  }
}

