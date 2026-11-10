import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import {
  getDb,
  policyVersions,
  policyClauses,
  eq,
  and,
  desc,
} from '@resolvepay/db';
import { CreatePolicyDraftDto, SessionInfo } from '@resolvepay/contracts';

@Injectable()
export class PoliciesService {
  async getPolicies(tenantId: string): Promise<any[]> {
    const db = await getDb();
    const versions = await db
      .select()
      .from(policyVersions)
      .where(eq(policyVersions.tenantId, tenantId))
      .orderBy(desc(policyVersions.version));

    const result = [];
    for (const v of versions) {
      const clauses = await db
        .select()
        .from(policyClauses)
        .where(eq(policyClauses.policyVersionId, v.id));

      result.push({
        id: v.id,
        version: v.version,
        text: v.text,
        publisher: v.publisher,
        immutableHash: v.immutableHash,
        effectiveAt: v.effectiveAt.toISOString(),
        clauses: clauses.map((c) => ({
          id: c.id,
          key: c.key,
          title: c.title,
          text: c.text,
          structuredRule: c.structuredRule,
        })),
      });
    }

    return result;
  }

  async publishPolicy(dto: CreatePolicyDraftDto, session: SessionInfo): Promise<any> {
    const db = await getDb();
    const [latest] = await db
      .select()
      .from(policyVersions)
      .where(eq(policyVersions.tenantId, session.tenantId))
      .orderBy(desc(policyVersions.version))
      .limit(1);

    const nextVersion = (latest?.version || 0) + 1;
    const immutableHash = createHash('sha256')
      .update(`${session.tenantId}:${nextVersion}:${dto.text}`)
      .digest('hex');

    const [newVersion] = await db
      .insert(policyVersions)
      .values({
        tenantId: session.tenantId,
        version: nextVersion,
        text: dto.text,
        publisher: session.role || 'Merchant Owner',
        immutableHash,
      })
      .returning();

    for (const c of dto.clauses) {
      await db.insert(policyClauses).values({
        tenantId: session.tenantId,
        policyVersionId: newVersion.id,
        key: c.key,
        title: c.title,
        text: c.text,
        structuredRule: c.structuredRule || {},
      });
    }

    return {
      id: newVersion.id,
      version: newVersion.version,
      immutableHash: newVersion.immutableHash,
      effectiveAt: newVersion.effectiveAt.toISOString(),
    };
  }
}

