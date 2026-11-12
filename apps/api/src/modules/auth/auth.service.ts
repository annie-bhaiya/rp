import { Injectable, BadRequestException, NotFoundException, ServiceUnavailableException, ForbiddenException } from '@nestjs/common';
import { demoEnabled } from './auth.security.js';
import { randomBytes, createHash } from 'node:crypto';
import {
  getDb,
  tenants,
  users,
  memberships,
  sessions,
  accessTokens,
  merchantLoginTokens,
  sql,
  orders,
  eq,
  and,
  desc,
} from '@resolvepay/db';
import {
  CustomerAccessRequestDto,
  CustomerAccessRedeemDto,
  SessionInfo,
  UserRole,
} from '@resolvepay/contracts';
import { ResendEmailClient, DevMailboxClient, EmailAdapter } from '@resolvepay/integrations';

@Injectable()
export class AuthService {
  private emailAdapter: EmailAdapter;
  public devMailbox: DevMailboxClient;

  constructor() {
    this.devMailbox = new DevMailboxClient();
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey.startsWith('re_')) {
      this.emailAdapter = new ResendEmailClient(apiKey, process.env.EMAIL_FROM);
    } else {
      this.emailAdapter = this.devMailbox;
    }
  }

  private ensureEmailDelivery() {
    if (this.emailAdapter === this.devMailbox && !demoEnabled()) {
      throw new ServiceUnavailableException('Email sign-in is temporarily unavailable. Please contact the store.');
    }
  }

  async revokeSession(sessionId?: string) {
    if (!sessionId) return;
    const db = await getDb();
    await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, sessionId));
  }

  async requestMerchantAccess(dto: { tenantSlug: string; email: string }) {
    this.ensureEmailDelivery();
    const db = await getDb();
    const message = 'If this email has access to the store, a sign-in link has been sent. It expires in 15 minutes.';
    const [member] = await db.select({ userId: users.id, tenantId: tenants.id })
      .from(memberships).innerJoin(users, eq(users.id, memberships.userId))
      .innerJoin(tenants, eq(tenants.id, memberships.tenantId))
      .where(and(eq(tenants.slug, dto.tenantSlug), eq(tenants.status, 'ACTIVE'),
        sql`lower(${users.email}) = ${dto.email.toLowerCase()}`, eq(users.status, 'ACTIVE'), eq(memberships.status, 'ACTIVE'))).limit(1);
    if (!member) return { message };
    const token = randomBytes(32).toString('hex');
    await db.insert(merchantLoginTokens).values({ ...member, tokenHash: createHash('sha256').update(token).digest('hex'), expiresAt: new Date(Date.now() + 900_000) });
    const link = `${process.env.PUBLIC_WEB_URL || 'http://localhost:3000'}/sign-in?token=${token}`;
    const sent = await this.emailAdapter.sendEmail({ to: dto.email, subject: 'Sign in to ResolvePay', text: `Sign in to your store: ${link}\n\nThis link expires in 15 minutes and can be used once. If you did not request it, ignore this email.` });
    if (!sent.success) throw new ServiceUnavailableException('We could not send the email. Please try again shortly.');
    return { message, devToken: demoEnabled() ? token : undefined };
  }

  async redeemMerchantAccess(token: string): Promise<{ session: SessionInfo; token: string }> {
    const db = await getDb();
    return db.transaction(async (tx) => {
      const [challenge] = await tx.update(merchantLoginTokens).set({ consumedAt: new Date() })
        .where(and(eq(merchantLoginTokens.tokenHash, createHash('sha256').update(token).digest('hex')),
          sql`${merchantLoginTokens.consumedAt} IS NULL`, sql`${merchantLoginTokens.expiresAt} > NOW()`)).returning();
      if (!challenge) throw new BadRequestException('This sign-in link has expired or was already used. Request a new link.');
      const [member] = await tx.select({ role: memberships.role, tenantSlug: tenants.slug })
        .from(memberships).innerJoin(users, eq(users.id, memberships.userId)).innerJoin(tenants, eq(tenants.id, memberships.tenantId))
        .where(and(eq(memberships.userId, challenge.userId), eq(memberships.tenantId, challenge.tenantId),
          eq(users.status, 'ACTIVE'), eq(tenants.status, 'ACTIVE'), eq(memberships.status, 'ACTIVE'))).limit(1);
      if (!member) throw new ForbiddenException('Store access is no longer available. Contact your store owner.');
      const rawToken = randomBytes(32).toString('hex');
      const [session] = await tx.insert(sessions).values({ tokenHash: createHash('sha256').update(rawToken).digest('hex'), actorType: 'MERCHANT',
        actorId: challenge.userId, tenantId: challenge.tenantId, role: member.role, expiresAt: new Date(Date.now() + 86_400_000) }).returning();
      return { token: rawToken, session: { sessionId: session.id, actorType: 'MERCHANT', actorId: session.actorId,
        tenantId: session.tenantId, tenantSlug: member.tenantSlug, role: member.role as UserRole, expiresAt: session.expiresAt.toISOString() } };
    });
  }

  async requestCustomerAccess(dto: CustomerAccessRequestDto): Promise<{ message: string; devToken?: string }> {
    this.ensureEmailDelivery();
    const db = await getDb();
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(and(eq(tenants.slug, dto.tenantSlug), eq(tenants.status, 'ACTIVE')))
      .limit(1);

    if (!tenant) {
      return { message: 'If an order matches the provided reference and email, an access link has been sent.' };
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.tenantId, tenant.id),
          eq(orders.orderReference, dto.orderReference),
          sql`lower(${orders.customerEmail}) = ${dto.email.toLowerCase()}`
        )
      )
      .limit(1);

    // Plan §6.2: Always return a generic response to prevent account enumeration, but send email if matching order exists
    if (!order) {
      return { message: 'If an order matches the provided reference and email, an access link has been sent.' };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await db.insert(accessTokens).values({
      tenantId: tenant.id,
      orderId: order.id,
      customerEmail: order.customerEmail,
      tokenHash,
      purpose: 'CUSTOMER_ORDER_ACCESS',
      expiresAt,
    });

    const webUrl = process.env.PUBLIC_WEB_URL || 'http://localhost:3000';
    const accessLink = `${webUrl}/portal/access?token=${rawToken}`;

    const sent = await this.emailAdapter.sendEmail({
      to: order.customerEmail,
      subject: `Your Secure Access Link for Order ${order.orderReference}`,
      text: `Hello ${order.customerName},\n\nClick the link below to securely access your order ${order.orderReference} and submit or track a resolution request:\n\n${accessLink}\n\nThis link expires in 15 minutes.\n\nResolvePay Rescue`,
    });

    if (!sent.success) throw new ServiceUnavailableException('We could not send the email. Please try again shortly.');

    return {
      message: 'If an order matches the provided reference and email, an access link has been sent.',
      devToken: demoEnabled() ? rawToken : undefined,
    };
  }

  async redeemCustomerAccess(dto: CustomerAccessRedeemDto): Promise<{ session: SessionInfo; token: string }> {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');
    const db = await getDb();
    return db.transaction(async (tx) => {

    const [tokenRecord] = await tx
      .update(accessTokens).set({ consumedAt: new Date() })
      .where(
        and(
          eq(accessTokens.tokenHash, tokenHash),
          eq(accessTokens.purpose, 'CUSTOMER_ORDER_ACCESS'),
          sql`${accessTokens.consumedAt} IS NULL`,
          sql`${accessTokens.expiresAt} > NOW()`
        )
      )
      .returning();

    if (!tokenRecord) {
      throw new BadRequestException('This sign-in link has expired or was already used. Request a new link.');
    }

    if (new Date(tokenRecord.expiresAt) < new Date()) {
      throw new BadRequestException('Access token has expired');
    }

    // Create session
    const rawSessionToken = randomBytes(32).toString('hex');
    const sessionTokenHash = createHash('sha256').update(rawSessionToken).digest('hex');
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const [session] = await tx
      .insert(sessions)
      .values({
        tokenHash: sessionTokenHash,
        actorType: 'CUSTOMER',
        actorId: tokenRecord.orderId,
        tenantId: tokenRecord.tenantId,
        customerEmail: tokenRecord.customerEmail,
        orderId: tokenRecord.orderId,
        expiresAt: sessionExpiresAt,
      })
      .returning();

    const [tenant] = await tx.select().from(tenants).where(eq(tenants.id, tokenRecord.tenantId)).limit(1);
    const [order] = await tx.select().from(orders).where(eq(orders.id, tokenRecord.orderId)).limit(1);
    if (!tenant || tenant.status !== 'ACTIVE' || !order || order.tenantId !== tenant.id || order.customerEmail.toLowerCase() !== tokenRecord.customerEmail.toLowerCase()) {
      throw new ForbiddenException('Order access is no longer available. Contact the store.');
    }

    return {
      token: rawSessionToken,
      session: {
        sessionId: session.id,
        actorType: 'CUSTOMER',
        actorId: session.actorId,
        tenantId: session.tenantId,
        tenantSlug: tenant.slug,
        customerEmail: session.customerEmail || undefined,
        orderId: session.orderId || undefined,
        orderReference: order?.orderReference,
        expiresAt: session.expiresAt.toISOString(),
      },
    };
    });
  }

  async loginDevPersona(
    persona: 'OWNER' | 'APPROVER' | 'JUDGE' | 'CUSTOMER',
    tenantSlug: string = 'default-merchant',
    orderIdParam?: string,
    emailParam?: string
  ): Promise<{ session: SessionInfo; token: string }> {
    if (!demoEnabled()) throw new ForbiddenException('Demo access is disabled.');
    const db = await getDb();
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1);
    if (!tenant) throw new NotFoundException(`Tenant not found: ${tenantSlug}`);

    let role: UserRole = 'MERCHANT_APPROVER';
    let email = 'approver@peakgear.demo';
    let actorType: 'CUSTOMER' | 'MERCHANT' = 'MERCHANT';
    let orderId: string | undefined;

    if (persona === 'OWNER') {
      role = 'MERCHANT_OWNER';
      email = 'owner@peakgear.demo';
    } else if (persona === 'JUDGE') {
      role = 'JUDGE';
      email = 'judge@hackathon.demo';
    } else if (persona === 'CUSTOMER') {
      actorType = 'CUSTOMER';
      email = emailParam || 'alex.customer@example.com';
      if (orderIdParam) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdParam);
        const [order] = isUuid
          ? await db.select().from(orders).where(and(eq(orders.id, orderIdParam), eq(orders.tenantId, tenant.id))).limit(1)
          : await db.select().from(orders).where(and(eq(orders.orderReference, orderIdParam), eq(orders.tenantId, tenant.id))).limit(1);
        if (order) {
          orderId = order.id;
          email = order.customerEmail;
        }
      }
      if (!orderId) {
        const [order] = await db
          .select()
          .from(orders)
          .where(and(eq(orders.tenantId, tenant.id), eq(orders.customerEmail, email)))
          .orderBy(desc(orders.createdAt))
          .limit(1);
        orderId = order?.id;
      }
    }

    if (actorType === 'CUSTOMER' && !orderId) throw new NotFoundException('No demo order found. Seed the demo data first.');
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const actorId = user ? user.id : (orderId || tenant.id);

    const rawSessionToken = randomBytes(32).toString('hex');
    const sessionTokenHash = createHash('sha256').update(rawSessionToken).digest('hex');
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [session] = await db
      .insert(sessions)
      .values({
        tokenHash: sessionTokenHash,
        actorType,
        actorId,
        tenantId: tenant.id,
        role: actorType === 'MERCHANT' ? role : undefined,
        customerEmail: actorType === 'CUSTOMER' ? email : undefined,
        orderId,
        expiresAt: sessionExpiresAt,
      })
      .returning();

    return {
      token: rawSessionToken,
      session: {
        sessionId: session.id,
        actorType,
        actorId: session.actorId,
        tenantId: session.tenantId,
        tenantSlug: tenant.slug,
        role: session.role as any,
        customerEmail: session.customerEmail || undefined,
        orderId: session.orderId || undefined,
        expiresAt: session.expiresAt.toISOString(),
      },
    };
  }
}

