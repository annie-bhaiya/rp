import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  getDb,
  cases,
  messages,
  orders,
  orderItems,
  plans,
  resolutions,
  resolutionSteps,
  returns,
  fulfillments,
  evidence,
  eq,
  and,
  desc,
} from '@resolvepay/db';
import {
  CreateCaseDto,
  AddCaseMessageDto,
  Case,
  CaseMessage,
  CreateEvidenceIntentDto,
  CompleteEvidenceUploadDto,
} from '@resolvepay/contracts';
import { transitionCase } from '@resolvepay/domain';
import { SessionInfo } from '@resolvepay/contracts';

@Injectable()
export class CasesService {
  async createCase(dto: CreateCaseDto, session: SessionInfo): Promise<Case> {
    const db = await getDb();
    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, dto.orderId), eq(orders.tenantId, session.tenantId)))
      .limit(1);

    if (!order) {
      throw new NotFoundException(`Order not found: ${dto.orderId}`);
    }

    // Verify customer owns this order if actor is CUSTOMER
    if (session.actorType === 'CUSTOMER') {
      if (session.orderId && session.orderId !== order.id) {
        if (session.customerEmail && session.customerEmail.toLowerCase() !== order.customerEmail.toLowerCase()) {
          throw new ForbiddenException('Not authorized to open case for this order');
        }
      }
    }

    const [newCase] = await db
      .insert(cases)
      .values({
        tenantId: session.tenantId,
        orderId: order.id,
        customerId: order.customerId,
        state: 'OPEN',
        issueType: dto.issueType || 'damaged',
        constraints: dto.constraints || {},
      })
      .returning();

    // Insert initial message
    await db.insert(messages).values({
      tenantId: session.tenantId,
      caseId: newCase.id,
      channel: dto.channel || 'WEB',
      senderRole: session.actorType === 'CUSTOMER' ? 'CUSTOMER' : 'MERCHANT',
      body: dto.initialMessage,
      verificationState: 'VERIFIED',
    });

    return {
      id: newCase.id,
      tenantId: newCase.tenantId,
      orderId: newCase.orderId,
      customerId: newCase.customerId,
      state: newCase.state as any,
      issueType: newCase.issueType as any,
      constraints: newCase.constraints as any,
      version: newCase.version,
      createdAt: newCase.createdAt.toISOString(),
      updatedAt: newCase.updatedAt.toISOString(),
    };
  }

  async getCaseById(caseId: string, tenantId: string): Promise<any> {
    const db = await getDb();
    const [caseRow] = await db
      .select()
      .from(cases)
      .where(and(eq(cases.id, caseId), eq(cases.tenantId, tenantId)))
      .limit(1);

    if (!caseRow) throw new NotFoundException(`Case not found: ${caseId}`);

    const [order] = await db.select().from(orders).where(eq(orders.id, caseRow.orderId)).limit(1);
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, caseRow.orderId));
    const caseMessages = await db.select().from(messages).where(eq(messages.caseId, caseId)).orderBy(messages.createdAt);
    const casePlans = await db.select().from(plans).where(eq(plans.caseId, caseId)).orderBy(desc(plans.createdAt));
    const [resolution] = await db.select().from(resolutions).where(eq(resolutions.caseId, caseId)).limit(1);
    const [returnRecord] = await db.select().from(returns).where(eq(returns.caseId, caseId)).limit(1);
    const caseEvidence = await db.select().from(evidence).where(eq(evidence.caseId, caseId)).orderBy(desc(evidence.createdAt));

    return {
      case: {
        id: caseRow.id,
        tenantId: caseRow.tenantId,
        orderId: caseRow.orderId,
        customerId: caseRow.customerId,
        state: caseRow.state,
        issueType: caseRow.issueType,
        constraints: caseRow.constraints,
        version: caseRow.version,
        createdAt: caseRow.createdAt.toISOString(),
        updatedAt: caseRow.updatedAt.toISOString(),
      },
      order: order
        ? {
            id: order.id,
            orderReference: order.orderReference,
            customerEmail: order.customerEmail,
            customerName: order.customerName,
            status: order.status,
            totalMinor: order.totalMinor,
            currency: order.currency,
            items: items.map((i) => ({
              id: i.id,
              variantId: i.variantId,
              sku: i.sku,
              title: i.title,
              quantity: i.quantity,
              unitPrice: { currency: order.currency, minor: i.unitPriceMinor },
            })),
          }
        : null,
      messages: caseMessages.map((m) => ({
        id: m.id,
        channel: m.channel,
        senderRole: m.senderRole,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
      })),
      evidence: caseEvidence.map((e) => ({
        id: e.id,
        blobKey: e.blobKey,
        contentHash: e.contentHash,
        mediaType: e.mediaType,
        validationState: e.validationState,
        description: e.description,
        createdAt: e.createdAt.toISOString(),
      })),
      plans: casePlans.map((p) => ({
        id: p.id,
        version: p.version,
        canonicalHash: p.canonicalHash,
        type: p.type,
        state: p.state,
        title: p.title,
        explanation: p.explanation,
        customerAccepted: p.customerAccepted,
        merchantApproved: p.merchantApproved,
        expiresAt: p.expiresAt.toISOString(),
        planData: p.planData,
      })),
      resolution: resolution ? { id: resolution.id, state: resolution.state, currentStep: resolution.currentStep } : null,
      returnRecord: returnRecord
        ? {
            id: returnRecord.id,
            status: returnRecord.status,
            carrier: returnRecord.carrier,
            trackingReference: returnRecord.trackingReference,
            inspectionResult: returnRecord.inspectionResult,
            inspectionNotes: returnRecord.inspectionNotes,
          }
        : null,
    };
  }

  async listCases(tenantId: string): Promise<any[]> {
    const db = await getDb();
    const caseRows = await db
      .select()
      .from(cases)
      .where(eq(cases.tenantId, tenantId))
      .orderBy(desc(cases.createdAt));

    const result = [];
    for (const c of caseRows) {
      const [order] = await db.select().from(orders).where(eq(orders.id, c.orderId)).limit(1);
      result.push({
        id: c.id,
        orderId: c.orderId,
        orderReference: order?.orderReference || 'N/A',
        customerName: order?.customerName || 'Customer',
        state: c.state,
        issueType: c.issueType,
        createdAt: c.createdAt.toISOString(),
      });
    }
    return result;
  }

  async addMessage(caseId: string, dto: AddCaseMessageDto, session: SessionInfo): Promise<CaseMessage> {
    const db = await getDb();
    const [caseRow] = await db
      .select()
      .from(cases)
      .where(and(eq(cases.id, caseId), eq(cases.tenantId, session.tenantId)))
      .limit(1);

    if (!caseRow) throw new NotFoundException(`Case not found: ${caseId}`);

    const senderRole = session.actorType === 'CUSTOMER' ? 'CUSTOMER' : 'MERCHANT';

    const [newMsg] = await db
      .insert(messages)
      .values({
        tenantId: session.tenantId,
        caseId,
        channel: dto.channel || 'WEB',
        senderRole,
        body: dto.body,
        verificationState: 'VERIFIED',
      })
      .returning();

    return {
      id: newMsg.id,
      caseId: newMsg.caseId,
      tenantId: newMsg.tenantId,
      channel: newMsg.channel as any,
      senderRole: newMsg.senderRole as any,
      body: newMsg.body,
      verificationState: 'VERIFIED',
      createdAt: newMsg.createdAt.toISOString(),
    };
  }

  async getTimeline(caseId: string, tenantId: string): Promise<any[]> {
    const details = await this.getCaseById(caseId, tenantId);
    const events: Array<{ timestamp: string; type: string; title: string; description: string; badge?: string }> = [];

    // Order purchase event
    if (details.order) {
      events.push({
        timestamp: details.case.createdAt,
        type: 'ORDER_PURCHASE',
        title: `Order ${details.order.orderReference} Placed`,
        description: `Purchased with PayPal capture confirmed. Total: $${(Number(details.order.totalMinor) / 100).toFixed(2)}`,
        badge: 'PAID',
      });
    }

    // Messages
    for (const m of details.messages) {
      events.push({
        timestamp: m.createdAt,
        type: 'MESSAGE',
        title: `${m.senderRole === 'CUSTOMER' ? 'Customer Message' : 'Store Reply'} (${m.channel})`,
        description: m.body,
      });
    }

    // Plans
    for (const p of details.plans) {
      events.push({
        timestamp: p.expiresAt,
        type: 'PLAN_PROPOSAL',
        title: `Remedy Proposed: ${p.title}`,
        description: p.explanation,
        badge: p.state,
      });
      if (p.customerAccepted) {
        events.push({
          timestamp: p.expiresAt,
          type: 'CUSTOMER_ACCEPTANCE',
          title: 'Customer Accepted Remedy Terms',
          description: `Bound to canonical terms hash: ${p.canonicalHash.substring(0, 16)}...`,
          badge: 'ACCEPTED',
        });
      }
      if (p.merchantApproved) {
        events.push({
          timestamp: p.expiresAt,
          type: 'MERCHANT_APPROVAL',
          title: 'Merchant Authorized Financial Plan',
          description: `Approved by store approver for execution.`,
          badge: 'APPROVED',
        });
      }
    }

    // Return status
    if (details.returnRecord) {
      events.push({
        timestamp: details.case.updatedAt,
        type: 'RETURN_TRACKING',
        title: `Return Status: ${details.returnRecord.status}`,
        description: details.returnRecord.inspectionNotes || `Carrier: ${details.returnRecord.carrier}`,
        badge: details.returnRecord.inspectionResult || details.returnRecord.status,
      });
    }

    // Evidence events
    if (details.evidence) {
      for (const ev of details.evidence) {
        events.push({
          timestamp: ev.createdAt,
          type: 'EVIDENCE_UPLOADED',
          title: 'Photo Evidence Provided',
          description: ev.description || `Uploaded item photo [Validation: ${ev.validationState}]`,
          badge: ev.validationState,
        });
      }
    }

    events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return events;
  }

  async createEvidenceIntent(caseId: string, dto: CreateEvidenceIntentDto, session: SessionInfo): Promise<any> {
    const db = await getDb();
    const [caseRow] = await db
      .select()
      .from(cases)
      .where(and(eq(cases.id, caseId), eq(cases.tenantId, session.tenantId)))
      .limit(1);

    if (!caseRow) throw new NotFoundException(`Case not found: ${caseId}`);

    const safeFileName = dto.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobKey = `evidence/${session.tenantId}/${caseId}/${crypto.randomUUID()}-${safeFileName}`;

    const [rec] = await db
      .insert(evidence)
      .values({
        tenantId: session.tenantId,
        caseId,
        blobKey,
        contentHash: 'PENDING_UPLOAD',
        mediaType: dto.mediaType,
        validationState: 'PENDING',
        description: dto.description || null,
      })
      .returning();

    return {
      evidenceId: rec.id,
      blobKey: rec.blobKey,
      uploadUrl: `/api/v1/cases/${caseId}/evidence/${rec.id}/upload`,
      mediaType: rec.mediaType,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  async storeEvidenceFile(
    caseId: string,
    evidenceId: string,
    buffer: Buffer,
    mediaType: string,
    tenantId: string
  ): Promise<any> {
    const db = await getDb();
    const [rec] = await db
      .select()
      .from(evidence)
      .where(and(eq(evidence.id, evidenceId), eq(evidence.caseId, caseId), eq(evidence.tenantId, tenantId)))
      .limit(1);

    if (!rec) throw new NotFoundException('Evidence intent not found');

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    let repoRoot = process.cwd();
    while (repoRoot.includes('apps') || repoRoot.includes('packages')) {
      repoRoot = path.dirname(repoRoot);
    }
    const storeDir = path.resolve(repoRoot, '.data', 'evidence', tenantId, caseId);
    fs.mkdirSync(storeDir, { recursive: true });
    const filePath = path.resolve(storeDir, `${evidenceId}.bin`);
    fs.writeFileSync(filePath, buffer);

    const [updated] = await db
      .update(evidence)
      .set({
        contentHash: hash,
        mediaType: mediaType || rec.mediaType,
        validationState: 'VALID',
      })
      .where(eq(evidence.id, evidenceId))
      .returning();

    await db.insert(messages).values({
      tenantId,
      caseId,
      channel: 'WEB',
      senderRole: 'CUSTOMER',
      body: `Customer uploaded photo evidence: ${rec.description || 'Inspection item photo'} [SHA-256: ${hash.substring(0, 12)}...]`,
      verificationState: 'VERIFIED',
    });

    return {
      id: updated.id,
      caseId: updated.caseId,
      blobKey: updated.blobKey,
      contentHash: updated.contentHash,
      mediaType: updated.mediaType,
      validationState: updated.validationState,
      description: updated.description,
    };
  }

  async completeEvidenceUpload(
    caseId: string,
    evidenceId: string,
    dto: CompleteEvidenceUploadDto,
    session: SessionInfo
  ): Promise<any> {
    const db = await getDb();
    const [rec] = await db
      .select()
      .from(evidence)
      .where(and(eq(evidence.id, evidenceId), eq(evidence.caseId, caseId), eq(evidence.tenantId, session.tenantId)))
      .limit(1);

    if (!rec) throw new NotFoundException('Evidence intent not found');

    const [updated] = await db
      .update(evidence)
      .set({
        contentHash: dto.contentHash,
        validationState: 'VALID',
        description: dto.description || rec.description,
      })
      .where(eq(evidence.id, evidenceId))
      .returning();

    return updated;
  }

  async getEvidenceFile(caseId: string, evidenceId: string, tenantId: string): Promise<{ buffer: Buffer; mediaType: string }> {
    const db = await getDb();
    const [rec] = await db
      .select()
      .from(evidence)
      .where(and(eq(evidence.id, evidenceId), eq(evidence.caseId, caseId), eq(evidence.tenantId, tenantId)))
      .limit(1);

    if (!rec) throw new NotFoundException('Evidence not found');

    let repoRoot = process.cwd();
    while (repoRoot.includes('apps') || repoRoot.includes('packages')) {
      repoRoot = path.dirname(repoRoot);
    }
    const filePath = path.resolve(repoRoot, '.data', 'evidence', tenantId, caseId, `${evidenceId}.bin`);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Evidence file not found on disk');
    }

    const buffer = fs.readFileSync(filePath);
    return { buffer, mediaType: rec.mediaType };
  }
}

