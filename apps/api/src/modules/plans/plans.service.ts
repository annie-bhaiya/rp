import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Optional } from '@nestjs/common';
import { FailureInjectionService } from '../dev/failure-injection.service.js';
import {
  getDb,
  cases,
  messages,
  orders,
  orderItems,
  policyVersions,
  policyClauses,
  plans,
  productVariants,
  inventory,
  resolutions,
  resolutionSteps,
  returns,
  fulfillments,
  captures,
  refunds,
  journalTransactions,
  journalEntries,
  eq,
  and,
  desc,
  inArray,
} from '@resolvepay/db';
import {
  Plan,
  AcceptPlanDto,
  MerchantApprovePlanDto,
  SessionInfo,
} from '@resolvepay/contracts';
import {
  generateEligiblePlans,
  computeCanonicalPlanHash,
  transitionCase,
  transitionPlan,
  buildRefundJournal,
} from '@resolvepay/domain';
import {
  AiProvider,
  GeminiAiClient,
  DeterministicAiProvider,
  PayPalAdapter,
  PayPalRestClient,
  MockPayPalAdapter,
} from '@resolvepay/integrations';

@Injectable()
export class PlansService {
  private aiProvider: AiProvider;
  private paypalAdapter: PayPalAdapter;

  constructor(
    @Optional() private failureInjectionService?: FailureInjectionService
  ) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.length > 10) {
      this.aiProvider = new GeminiAiClient({
        apiKey: geminiKey,
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      });
    } else {
      this.aiProvider = new DeterministicAiProvider();
    }

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

  async generateProposals(caseId: string, session: SessionInfo): Promise<Plan[]> {
    const db = await getDb();
    const [caseRow] = await db
      .select()
      .from(cases)
      .where(and(eq(cases.id, caseId), eq(cases.tenantId, session.tenantId)))
      .limit(1);

    if (!caseRow) throw new NotFoundException(`Case not found: ${caseId}`);

    const [orderRow] = await db.select().from(orders).where(eq(orders.id, caseRow.orderId)).limit(1);
    if (!orderRow) throw new NotFoundException(`Order not found: ${caseRow.orderId}`);

    if (session.actorType === 'CUSTOMER' && session.orderId !== orderRow.id &&
        (!session.customerEmail || session.customerEmail.toLowerCase() !== orderRow.customerEmail.toLowerCase())) {
      throw new ForbiddenException('This order is not linked to your session');
    }
    const orderItemRows = await db.select().from(orderItems).where(eq(orderItems.orderId, orderRow.id));

    // Load latest published policy version
    const [policyVersionRow] = await db
      .select()
      .from(policyVersions)
      .where(eq(policyVersions.tenantId, session.tenantId))
      .orderBy(desc(policyVersions.version))
      .limit(1);

    if (!policyVersionRow) {
      throw new BadRequestException('No published store policy found for tenant');
    }

    const clauseRows = await db
      .select()
      .from(policyClauses)
      .where(eq(policyClauses.policyVersionId, policyVersionRow.id));

    // Load other catalog variants for exchange remedies
    const catalogVariants = await db
      .select()
      .from(productVariants)
      .where(and(eq(productVariants.tenantId, session.tenantId), eq(productVariants.active, true)));

    if (!orderItemRows.length) throw new BadRequestException('This order has no items to resolve');
    if (caseRow.state !== 'OPEN' && caseRow.state !== 'OPTIONS_READY') {
      throw new BadRequestException('This case is already in review or execution');
    }
    const existingPlans = await this.getPlansByCase(caseId, session.tenantId);
    if (existingPlans.some(p => p.customerAccepted)) {
      throw new BadRequestException('A remedy has already been accepted');
    }
    if (existingPlans.length && existingPlans.every(p => new Date(p.expiresAt) > new Date())) return existingPlans;
    const customerMessages = await db.select().from(messages)
      .where(and(eq(messages.caseId, caseId), eq(messages.senderRole, 'CUSTOMER')))
      .orderBy(messages.createdAt);
    const complaint = customerMessages.map(m => m.body).join('\n').slice(-12000)
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
      .replace(/\b(?:\d[ -]?){10,16}\b/g, '[number]');
    // 1. AI issue extraction from the actual customer narrative.

    const extractedIssue = await this.aiProvider.extractIssue({
      orderReference: orderRow.orderReference,
      orderItems: orderItemRows.map((i) => ({
        orderItemId: i.id,
        sku: i.sku,
        title: i.title,
        quantity: i.quantity,
      })),
      complaintMessage: complaint,
    });

    const affectedItems = extractedIssue.itemRefs.length > 0
      ? extractedIssue.itemRefs
      : [{ orderItemId: orderItemRows[0].id, quantity: 1 }];

    // 2. Deterministic remedy option calculation
    const domainOrder = {
      id: orderRow.id,
      tenantId: orderRow.tenantId,
      orderReference: orderRow.orderReference,
      customerId: orderRow.customerId,
      customerEmail: orderRow.customerEmail,
      customerName: orderRow.customerName,
      status: orderRow.status as any,
      currency: orderRow.currency,
      subtotal: { currency: orderRow.currency, minor: orderRow.subtotalMinor },
      tax: { currency: orderRow.currency, minor: orderRow.taxMinor },
      shipping: { currency: orderRow.currency, minor: orderRow.shippingMinor },
      total: { currency: orderRow.currency, minor: orderRow.totalMinor },
      items: orderItemRows.map((i) => ({
        id: i.id,
        orderId: i.orderId,
        variantId: i.variantId,
        sku: i.sku,
        title: i.title,
        quantity: i.quantity,
        unitPrice: { currency: orderRow.currency, minor: i.unitPriceMinor },
        totalPrice: { currency: orderRow.currency, minor: i.totalPriceMinor },
      })),
      createdAt: orderRow.createdAt.toISOString(),
    };

    const domainPolicy = {
      id: policyVersionRow.id,
      tenantId: policyVersionRow.tenantId,
      version: policyVersionRow.version,
      text: policyVersionRow.text,
      publisher: policyVersionRow.publisher,
      immutableHash: policyVersionRow.immutableHash,
      effectiveAt: policyVersionRow.effectiveAt.toISOString(),
      clauses: clauseRows.map((c) => ({
        id: c.id,
        tenantId: c.tenantId,
        policyVersionId: c.policyVersionId,
        key: c.key,
        title: c.title,
        text: c.text,
        structuredRule: (c.structuredRule as Record<string, unknown>) || {},
      })),
    };

    const generatedPlans = generateEligiblePlans({
      tenantId: session.tenantId,
      caseId: caseRow.id,
      order: domainOrder,
      policy: domainPolicy,
      affectedItems,
      issueType: extractedIssue.issueType,
      availableCatalogVariants: catalogVariants.map((v) => ({
        id: v.id,
        productId: v.productId,
        tenantId: v.tenantId,
        sku: v.sku,
        title: v.title,
        price: { currency: v.currency, minor: v.priceMinor },
        attributes: (v.attributes as Record<string, string>) || {},
        active: v.active,
      })),
    });

    // Recommendations are advisory; all prices, gates and citations remain deterministic.
    // Explicit form values take precedence over advisory narrative extraction.
    const customerConstraints = { ...extractedIssue.constraints, ...(caseRow.constraints as object) };
    const explanation = await this.aiProvider.explainOptions({
      caseSummary: extractedIssue.summary,
      customerConstraints,
      options: generatedPlans.map(p => ({
        type: p.type, title: p.title, requiresReturn: p.requiresReturn,
        refundAmount: p.refund, additionalPayment: p.additionalPayment,
        estimatedDays: p.delivery.estimatedDays,
        policyCitations: p.citations.map(c => c.clauseKey),
      })),
    });
    const aiBrief = {
      summary: extractedIssue.summary, missingFacts: extractedIssue.missingFacts,
      explanation: explanation.explanationText, tradeoffs: explanation.tradeoffs,
      recommendedOptionType: explanation.recommendedOptionType,
      extractionSource: extractedIssue.source || 'DETERMINISTIC',
      explanationSource: explanation.source || 'DETERMINISTIC',
      generatedAt: new Date().toISOString(),
    };
    // Replace only expired, unaccepted proposals.
    if (existingPlans.length) await db.delete(plans).where(and(eq(plans.caseId, caseId), eq(plans.customerAccepted, false)));
    // 3. Persist plans
    const persistedPlans: Plan[] = [];
    for (const p of generatedPlans) {
      const [inserted] = await db
        .insert(plans)
        .values({
          id: p.id,
          tenantId: session.tenantId,
          caseId: caseRow.id,
          orderId: orderRow.id,
          version: p.version,
          canonicalHash: p.canonicalHash,
          policyVersionId: p.policyVersionId,
          type: p.type,
          state: p.state,
          title: p.title,
          explanation: p.explanation,
          planData: p as any,
          expiresAt: new Date(p.expiresAt),
        })
        .returning();

      persistedPlans.push(p);
    }

    // Update case state to OPTIONS_READY
    await db
      .update(cases)
      .set({
        state: 'OPTIONS_READY',
        constraints: { ...customerConstraints, aiBrief },
        issueType: extractedIssue.issueType,
        updatedAt: new Date(),
      })
      .where(eq(cases.id, caseRow.id));

    return persistedPlans;
  }

  async getPlansByCase(caseId: string, tenantId: string): Promise<any[]> {
    const db = await getDb();
    const rows = await db
      .select()
      .from(plans)
      .where(and(eq(plans.caseId, caseId), eq(plans.tenantId, tenantId)))
      .orderBy(desc(plans.createdAt));

    return rows.map((r) => ({
      ...(r.planData as Record<string, unknown>),
      id: r.id,
      state: r.state,
      customerAccepted: r.customerAccepted,
      merchantApproved: r.merchantApproved,
      expiresAt: r.expiresAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async acceptPlan(dto: AcceptPlanDto, session: SessionInfo): Promise<any> {
    const db = await getDb();
    const [planRow] = await db.select().from(plans).where(and(eq(plans.id, dto.planId), eq(plans.tenantId, session.tenantId))).limit(1);
    if (!planRow) throw new NotFoundException(`Plan not found: ${dto.planId}`);

    const [ownedOrder] = await db.select().from(orders).where(eq(orders.id, planRow.orderId)).limit(1);
    if (session.actorType === 'CUSTOMER' && session.orderId !== planRow.orderId &&
        (!session.customerEmail || session.customerEmail.toLowerCase() !== ownedOrder?.customerEmail.toLowerCase())) {
      throw new ForbiddenException('This remedy is not linked to your session');
    }
    if (planRow.customerAccepted) return { success: true, planId: planRow.id, state: planRow.state };
    if (!['OFFERED', 'VALIDATED'].includes(planRow.state) || planRow.version !== dto.expectedVersion) {
      throw new BadRequestException('This proposal is no longer available. Reload your options.');
    }
    const siblings = await this.getPlansByCase(planRow.caseId, session.tenantId);
    if (siblings.some(p => p.customerAccepted)) throw new BadRequestException('Another remedy has already been selected');
    if (BigInt((planRow.planData as any).additionalPayment?.minor || '0') > 0n) {
      throw new BadRequestException('Paid upgrades are not available yet. Please choose a refund or a no-extra-cost remedy.');
    }
    // Verify canonical hash matches
    if (planRow.canonicalHash !== dto.expectedHash) {
      throw new BadRequestException('Plan material terms have changed. Please reload and accept fresh proposal.');
    }

    if (new Date(planRow.expiresAt) < new Date()) {
      throw new BadRequestException('Plan proposal has expired. Please request fresh options.');
    }

    // Mark plan selected
    await db
      .update(plans)
      .set({
        state: 'SELECTED',
        customerAccepted: true,
        customerAcceptedAt: new Date(),
      })
      .where(eq(plans.id, planRow.id));

    // If plan requires return, create return record
    const planData = planRow.planData as any;
    if (planData.requiresReturn) {
      const [existingReturn] = await db.select().from(returns).where(eq(returns.caseId, planRow.caseId)).limit(1);
      if (!existingReturn) {
        await db.insert(returns).values({
          tenantId: planRow.tenantId,
          caseId: planRow.caseId,
          status: 'AUTHORIZED',
          carrier: 'Simulated Express',
          trackingReference: `TRK-RET-${Date.now().toString().slice(-6)}`,
        });
      }
    }

    // Update case state to AWAITING_APPROVALS
    await db
      .update(cases)
      .set({ state: 'AWAITING_APPROVALS', updatedAt: new Date() })
      .where(eq(cases.id, planRow.caseId));

    return {
      success: true,
      planId: planRow.id,
      state: 'SELECTED',
      customerAccepted: true,
      requiresReturn: planData.requiresReturn,
    };
  }

  async merchantDecision(dto: MerchantApprovePlanDto, session: SessionInfo): Promise<any> {
    const db = await getDb();
    const [planRow] = await db.select().from(plans).where(and(eq(plans.id, dto.planId), eq(plans.tenantId, session.tenantId))).limit(1);
    if (!planRow) throw new NotFoundException(`Plan not found: ${dto.planId}`);

    if (planRow.canonicalHash !== dto.expectedHash) {
      throw new BadRequestException('Plan material terms have changed. Hash mismatch.');
    }

    if (dto.decision === 'REJECTED') {
      await db.update(plans).set({ state: 'REJECTED' }).where(eq(plans.id, planRow.id));
      await db.update(cases).set({ state: 'MANUAL_REVIEW', updatedAt: new Date() }).where(eq(cases.id, planRow.caseId));
      return { success: true, decision: 'REJECTED' };
    }

    if (!planRow.customerAccepted || !['SELECTED', 'READY'].includes(planRow.state)) {
      throw new BadRequestException('Customer must accept an available remedy before merchant approval');
    }
    // Approved
    await db
      .update(plans)
      .set({
        merchantApproved: true,
        merchantApprovedAt: new Date(),
        merchantApproverId: session.actorId,
        state: 'READY',
      })
      .where(eq(plans.id, planRow.id));

    return {
      success: true,
      planId: planRow.id,
      decision: 'APPROVED',
      state: 'READY',
    };
  }

  async approveAndExecute(dto: MerchantApprovePlanDto, session: SessionInfo) {
    await this.merchantDecision(dto, session);
    const db = await getDb();
    const [row] = await db.select().from(plans).where(and(eq(plans.id, dto.planId), eq(plans.tenantId, session.tenantId))).limit(1);
    const data = row.planData as any;
    const [ret] = await db.select().from(returns).where(eq(returns.caseId, row.caseId)).limit(1);
    if ((data.requiresInspection && ret?.inspectionResult !== 'PASSED') ||
        (data.requiresReturn && !data.requiresInspection && !['RECEIVED', 'INSPECTED', 'INSPECTION_PASSED'].includes(ret?.status || ''))) {
      return { success: true, state: 'AWAITING_RETURN', message: 'Approved. Record the required return or inspection, then execute.' };
    }
    return this.executePlan(dto.planId, session);
  }

  async executePlan(planId: string, session: SessionInfo): Promise<any> {
    const db = await getDb();
    const [planRow] = await db.select().from(plans).where(and(eq(plans.id, planId), eq(plans.tenantId, session.tenantId))).limit(1);
    if (!planRow) throw new NotFoundException(`Plan not found: ${planId}`);

    if (planRow.state === 'COMPLETED') return { success: true, state: 'COMPLETED', alreadyCompleted: true };
    if (BigInt((planRow.planData as any).additionalPayment?.minor || '0') > 0n) {
      throw new BadRequestException('Additional payment capture is not implemented; this remedy cannot execute');
    }
    if (!planRow.customerAccepted) {
      throw new BadRequestException('Customer has not accepted this remedy plan');
    }
    if (!planRow.merchantApproved) {
      throw new BadRequestException('Merchant has not authorized this remedy plan');
    }

    const planData = planRow.planData as any;

    // Check inspection gate if return was required
    if (planData.requiresInspection) {
      const [returnRecord] = await db.select().from(returns).where(eq(returns.caseId, planRow.caseId)).limit(1);
      if (!returnRecord || returnRecord.inspectionResult !== 'PASSED') {
        throw new BadRequestException('Inspection gate not met: physical return must pass merchant inspection before financial execution');
      }
    }

    if (planData.requiresReturn && !planData.requiresInspection) {
      const [ret] = await db.select().from(returns).where(eq(returns.caseId, planRow.caseId)).limit(1);
      if (!ret || !['RECEIVED', 'INSPECTED', 'INSPECTION_PASSED'].includes(ret.status)) throw new BadRequestException('The item must be received before execution');
    }

    // Create or retrieve resolution record
    let [resolution] = await db.select().from(resolutions).where(eq(resolutions.planId, planRow.id)).limit(1);
    if (!resolution) {
      [resolution] = await db
        .insert(resolutions)
        .values({
          tenantId: planRow.tenantId,
          caseId: planRow.caseId,
          planId: planRow.id,
          state: 'RUNNING',
          currentStep: 'EXECUTE_REFUND',
        })
        .returning();
    }

    // Check resolutionSteps for prior attempt / recovery state
    const [existingRefundStep] = await db
      .select()
      .from(resolutionSteps)
      .where(
        and(
          eq(resolutionSteps.resolutionId, resolution.id),
          eq(resolutionSteps.stepKey, 'EXECUTE_REFUND')
        )
      )
      .limit(1);

    if (existingRefundStep?.state === 'UNKNOWN') {
      throw new BadRequestException(
        `RECOVERY_REQUIRED: Operation is in an UNKNOWN state (Idempotency Key: ${existingRefundStep.externalReference}). Please reconcile provider status in Recovery Queue before retrying.`
      );
    }

    if (existingRefundStep?.state === 'SUCCEEDED') {
      return { success: true, state: 'COMPLETED', alreadyCompleted: true };
    }

    const [claimed] = await db.update(plans).set({ state: 'EXECUTING' })
      .where(and(eq(plans.id, planRow.id), inArray(plans.state, ['READY', 'EXECUTING']))).returning();
    if (!claimed) throw new BadRequestException('Execution already started or requires reconciliation. Do not repeat the payment.');

    // Execute Refund Saga step if plan has refund amount
    const refundAmountMinor = BigInt(planData.refund?.minor || '0');
    let refundResult: any = null;

    if (refundAmountMinor > 0n) {
      // Find order capture
      const [capture] = await db
        .select()
        .from(captures)
        .where(eq(captures.orderId, planRow.orderId))
        .limit(1);

      if (!capture) {
        throw new BadRequestException('No capture found to execute refund against');
      }

      // Check ceiling
      const capturedMinor = BigInt(capture.amountMinor);
      const alreadyRefundedMinor = BigInt(capture.refundedMinor);
      if (alreadyRefundedMinor + refundAmountMinor > capturedMinor) {
        throw new BadRequestException('Refund ceiling exceeded: refund amount exceeds remaining capture balance');
      }

      const requestId = `resolvepay-refund-${planRow.id}`;

      // Insert or update resolutionStep as IN_FLIGHT
      let activeStep = existingRefundStep;
      if (!activeStep) {
        [activeStep] = await db
          .insert(resolutionSteps)
          .values({
            tenantId: planRow.tenantId,
            resolutionId: resolution.id,
            stepKey: 'EXECUTE_REFUND',
            state: 'IN_FLIGHT',
            externalReference: requestId,
            leaseOwner: 'api-executor',
            leaseUntil: new Date(Date.now() + 60_000),
            attempt: 1,
          })
          .returning();
      } else {
        await db
          .update(resolutionSteps)
          .set({
            state: 'IN_FLIGHT',
            externalReference: requestId,
            attempt: activeStep.attempt + 1,
            updatedAt: new Date(),
          })
          .where(eq(resolutionSteps.id, activeStep.id));
      }

      // Proposal 2: Failure Injection Simulation Check
      const shouldTimeout = this.failureInjectionService?.shouldSimulateRefundTimeout();
      if (shouldTimeout) {
        // Dispatches the request to provider/mock with requestId so PayPal receives it,
        // BUT network drops response before ResolvePay receives HTTP OK!
        try {
          await this.paypalAdapter.refundCapture({
            captureId: capture.providerCaptureId,
            amount: planData.refund,
            requestId,
            reason: `Remedy resolution for case ${planRow.caseId}`,
          });
        } catch {
          // In simulation, ensure PayPal mock records it
        }

        // Sever the response! Mark step as UNKNOWN and resolution as UNKNOWN_RECONCILING
        await db
          .update(resolutionSteps)
          .set({
            state: 'UNKNOWN',
            error: `SIMULATED_NETWORK_TIMEOUT: HTTP 504 Gateway Timeout while awaiting PayPal confirmation. Retained idempotency key: ${requestId}.`,
            updatedAt: new Date(),
          })
          .where(eq(resolutionSteps.id, activeStep.id));

        await db
          .update(resolutions)
          .set({ state: 'UNKNOWN_RECONCILING', updatedAt: new Date() })
          .where(eq(resolutions.id, resolution.id));

        throw new BadRequestException(
          `SIMULATED_NETWORK_TIMEOUT: PayPal refund request was dispatched with idempotency key "${requestId}", but the network response timed out. The operation is in UNKNOWN state. Reconcile provider status in Recovery Queue before retrying.`
        );
      }

      // Call PayPal refund with synthetic demo resilience
      let ppRefund: { id: string; status: string; amount?: any };
      const isSyntheticCapture =
        capture.providerCaptureId.startsWith('PAYPAL-CAP-SYNTH') ||
        capture.providerCaptureId.startsWith('PAYPAL-CAP-DEMO') ||
        capture.providerCaptureId.startsWith('CAP-') ||
        capture.providerCaptureId.startsWith('mock-');

      if (isSyntheticCapture) {
        ppRefund = await this.paypalAdapter.refundCapture({
          captureId: capture.providerCaptureId,
          amount: planData.refund,
          requestId,
          reason: `Remedy resolution for case ${planRow.caseId}`,
        });
        if (!ppRefund?.id) {
          ppRefund = {
            id: `REF-SYNTH-${Date.now().toString().slice(-6)}`,
            status: 'COMPLETED',
            amount: { currency_code: planData.refund.currency, value: (Number(planData.refund.minor) / 100).toFixed(2) },
          };
        }
      } else {
        ppRefund = await this.paypalAdapter.refundCapture({
          captureId: capture.providerCaptureId,
          amount: planData.refund,
          requestId,
          reason: `Remedy resolution for case ${planRow.caseId}`,
        });
      }

      if (ppRefund.status !== 'COMPLETED') {
        await db
          .update(resolutionSteps)
          .set({ state: 'UNKNOWN', error: 'PayPal refund status not completed', updatedAt: new Date() })
          .where(eq(resolutionSteps.id, activeStep.id));
        await db.update(resolutions).set({ state: 'UNKNOWN_RECONCILING', updatedAt: new Date() }).where(eq(resolutions.id, resolution.id));
        throw new BadRequestException('PayPal has not confirmed completion. Reconcile provider status before continuing.');
      }

      // Mark step SUCCEEDED
      await db
        .update(resolutionSteps)
        .set({
          state: 'SUCCEEDED',
          externalReference: ppRefund.id,
          updatedAt: new Date(),
        })
        .where(eq(resolutionSteps.id, activeStep.id));

      // Record refund row if not existing
      let [refundRecord] = await db
        .select()
        .from(refunds)
        .where(eq(refunds.resolutionId, resolution.id))
        .limit(1);

      if (!refundRecord) {
        [refundRecord] = await db
          .insert(refunds)
          .values({
            tenantId: planRow.tenantId,
            captureId: capture.id,
            resolutionId: resolution.id,
            providerRefundId: ppRefund.id,
            amountMinor: planData.refund.minor,
            currency: planData.refund.currency,
            status: 'COMPLETED',
          })
          .returning();

        // Update capture refunded balance
        await db
          .update(captures)
          .set({
            refundedMinor: (alreadyRefundedMinor + refundAmountMinor).toString(),
          })
          .where(eq(captures.id, capture.id));
      }

      // Post double-entry journal transaction (idempotent: avoid duplicate)
      const journalKey = `REFUND_SETTLED:${refundRecord.id}`;
      const [existingTx] = await db
        .select()
        .from(journalTransactions)
        .where(eq(journalTransactions.businessEventKey, journalKey))
        .limit(1);

      if (!existingTx) {
        const journalTxn = buildRefundJournal({
          orderId: planRow.orderId,
          refundId: refundRecord.id,
          itemRefundMinor: planData.refund.minor,
          totalRefundMinor: planData.refund.minor,
          currency: planData.refund.currency,
        });

        const [txRecord] = await db
          .insert(journalTransactions)
          .values({
            tenantId: planRow.tenantId,
            businessEventKey: journalTxn.businessEventKey,
            description: journalTxn.description,
            currency: journalTxn.currency,
          })
          .returning();

        for (const entry of journalTxn.entries) {
          await db.insert(journalEntries).values({
            tenantId: planRow.tenantId,
            transactionId: txRecord.id,
            accountCode: entry.accountCode,
            debitMinor: entry.debitMinor,
            creditMinor: entry.creditMinor,
          });
        }
      }

      refundResult = {
        refundId: refundRecord.id,
        providerRefundId: ppRefund.id,
        amount: planData.refund,
      };
    }

    // Execute Replacement Dispatch step if plan includes replacement
    if (planData.replacement) {
      await db.insert(fulfillments).values({
        tenantId: planRow.tenantId,
        resolutionId: resolution.id,
        status: 'SHIPPED',
        trackingReference: `TRK-EXP-${Date.now().toString().slice(-6)}`,
        carrier: 'Simulated Freight',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });
    }

    // Mark plan COMPLETED and case RESOLVED
    await db.update(plans).set({ state: 'COMPLETED' }).where(eq(plans.id, planRow.id));
    await db.update(resolutions).set({ state: 'COMPLETED', updatedAt: new Date() }).where(eq(resolutions.id, resolution.id));
    await db.update(cases).set({ state: 'RESOLVED', updatedAt: new Date() }).where(eq(cases.id, planRow.caseId));

    return {
      success: true,
      resolutionId: resolution.id,
      state: 'COMPLETED',
      refund: refundResult,
      replacementDispatched: !!planData.replacement,
    };
  }
}
