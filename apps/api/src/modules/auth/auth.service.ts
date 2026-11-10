import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';
import {
  getDb,
  tenants,
  users,
  memberships,
  sessions,
  accessTokens,
  orders,
  eq,
  and,
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

  async requestCustomerAccess(dto: CustomerAccessRequestDto): Promise<{ message: string; devToken?: string }> {
    const db = await getDb();
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, dto.tenantSlug))
      .limit(1);

    if (!tenant) {
      throw new NotFoundException(`Tenant not found: ${dto.tenantSlug}`);
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.tenantId, tenant.id),
          eq(orders.orderReference, dto.orderReference),
          eq(orders.customerEmail, dto.email)
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

    await this.emailAdapter.sendEmail({
      to: order.customerEmail,
      subject: `Your Secure Access Link for Order ${order.orderReference}`,
      text: `Hello ${order.customerName},\n\nClick the link below to securely access your order ${order.orderReference} and submit or track a resolution request:\n\n${accessLink}\n\nThis link expires in 15 minutes.\n\nResolvePay Rescue`,
    });

    return {
      message: 'If an order matches the provided reference and email, an access link has been sent.',
      devToken: process.env.APP_ENV === 'demo' ? rawToken : undefined,
    };
  }

  async redeemCustomerAccess(dto: CustomerAccessRedeemDto): Promise<{ session: SessionInfo; token: string }> {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');
    const db = await getDb();

    const [tokenRecord] = await db
      .select()
      .from(accessTokens)
      .where(
        and(
          eq(accessTokens.tokenHash, tokenHash),
          eq(accessTokens.purpose, 'CUSTOMER_ORDER_ACCESS')
        )
      )
      .limit(1);

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired access token');
    }

    if (tokenRecord.consumedAt) {
      throw new BadRequestException('Access token has already been consumed');
    }

    if (new Date(tokenRecord.expiresAt) < new Date()) {
      throw new BadRequestException('Access token has expired');
    }

    // Mark consumed
    await db
      .update(accessTokens)
      .set({ consumedAt: new Date() })
      .where(eq(accessTokens.id, tokenRecord.id));

    // Create session
    const rawSessionToken = randomBytes(32).toString('hex');
    const sessionTokenHash = createHash('sha256').update(rawSessionToken).digest('hex');
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const [session] = await db
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

    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tokenRecord.tenantId)).limit(1);
    const [order] = await db.select().from(orders).where(eq(orders.id, tokenRecord.orderId)).limit(1);

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
  }

  async loginDevPersona(persona: 'OWNER' | 'APPROVER' | 'JUDGE' | 'CUSTOMER', tenantSlug: string = 'default-merchant'): Promise<{ session: SessionInfo; token: string }> {
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
      email = 'alex.customer@example.com';
      const [order] = await db.select().from(orders).where(eq(orders.tenantId, tenant.id)).limit(1);
      orderId = order?.id;
    }

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

