import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  getDb,
  tenants,
  products,
  productVariants,
  inventory,
  orders,
  orderItems,
  captures,
  journalTransactions,
  journalEntries,
  customers,
  eq,
  and,
} from '@resolvepay/db';
import {
  CreateCheckoutOrderDto,
  CaptureCheckoutOrderDto,
  Order,
  Product,
} from '@resolvepay/contracts';
import {
  createMoney,
  addMoney,
  buildOrderCaptureJournal,
} from '@resolvepay/domain';
import {
  PayPalAdapter,
  PayPalRestClient,
  MockPayPalAdapter,
} from '@resolvepay/integrations';

@Injectable()
export class CatalogService {
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

  async getCatalog(tenantSlug: string = 'default-merchant'): Promise<{ tenant: any; products: Product[] }> {
    const db = await getDb();
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, tenantSlug)).limit(1);
    if (!tenant) throw new NotFoundException(`Tenant not found: ${tenantSlug}`);

    const productRows = await db.select().from(products).where(eq(products.tenantId, tenant.id));
    const variantRows = await db.select().from(productVariants).where(eq(productVariants.tenantId, tenant.id));

    const result: Product[] = productRows.map((p) => ({
      id: p.id,
      tenantId: p.tenantId,
      title: p.title,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl || undefined,
      variants: variantRows
        .filter((v) => v.productId === p.id)
        .map((v) => ({
          id: v.id,
          productId: v.productId,
          tenantId: v.tenantId,
          sku: v.sku,
          title: v.title,
          price: { currency: v.currency, minor: v.priceMinor },
          attributes: (v.attributes as Record<string, string>) || {},
          active: v.active,
        })),
    }));

    return { tenant, products: result };
  }

  async createCheckoutOrder(dto: CreateCheckoutOrderDto): Promise<{
    orderId: string;
    orderReference: string;
    paypalOrderId: string;
    approveUrl: string;
    total: { currency: string; minor: string };
    status?: string;
    captureId?: string;
    instantDemo?: boolean;
  }> {
    const db = await getDb();
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, dto.tenantSlug)).limit(1);
    if (!tenant) throw new NotFoundException(`Tenant not found: ${dto.tenantSlug}`);

    // Authoritative server-side price calculation
    let subtotalMinor = 0n;
    const itemsToInsert: Array<{
      variantId: string;
      sku: string;
      title: string;
      quantity: number;
      unitPriceMinor: string;
      totalPriceMinor: string;
    }> = [];

    for (const itemDto of dto.items) {
      const [variant] = await db
        .select()
        .from(productVariants)
        .where(and(eq(productVariants.id, itemDto.variantId), eq(productVariants.tenantId, tenant.id)))
        .limit(1);

      if (!variant) {
        throw new NotFoundException(`Product variant not found: ${itemDto.variantId}`);
      }

      const unitMinor = BigInt(variant.priceMinor);
      const lineMinor = unitMinor * BigInt(itemDto.quantity);
      subtotalMinor += lineMinor;

      itemsToInsert.push({
        variantId: variant.id,
        sku: variant.sku,
        title: variant.title,
        quantity: itemDto.quantity,
        unitPriceMinor: variant.priceMinor,
        totalPriceMinor: lineMinor.toString(),
      });
    }

    // Zero-tax fixtures for demo R0
    const subtotal = createMoney(subtotalMinor.toString(), tenant.defaultCurrency);
    const tax = createMoney('0', tenant.defaultCurrency);
    const shipping = createMoney('0', tenant.defaultCurrency);
    const total = subtotal;

    // Ensure customer record
    let [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.tenantId, tenant.id), eq(customers.email, dto.customerEmail)))
      .limit(1);

    if (!customer) {
      [customer] = await db
        .insert(customers)
        .values({
          tenantId: tenant.id,
          email: dto.customerEmail,
          name: dto.customerName,
        })
        .returning();
    }

    const orderReference = `ORD-${Date.now().toString().slice(-6)}`;

    // Instant frictionless demo purchase option
    if (dto.instantDemo) {
      const demoCaptureId = `PAYPAL-CAP-DEMO-${Date.now().toString().slice(-6)}`;
      const [order] = await db
        .insert(orders)
        .values({
          tenantId: tenant.id,
          orderReference,
          customerId: customer.id,
          customerEmail: customer.email,
          customerName: customer.name,
          status: 'PAID',
          currency: tenant.defaultCurrency,
          subtotalMinor: subtotal.minor,
          taxMinor: tax.minor,
          shippingMinor: shipping.minor,
          totalMinor: total.minor,
          paypalOrderId: `PAYPAL-ORD-DEMO-${Date.now().toString().slice(-6)}`,
          paypalCaptureId: demoCaptureId,
        })
        .returning();

      for (const item of itemsToInsert) {
        await db.insert(orderItems).values({
          tenantId: tenant.id,
          orderId: order.id,
          variantId: item.variantId,
          sku: item.sku,
          title: item.title,
          quantity: item.quantity,
          unitPriceMinor: item.unitPriceMinor,
          totalPriceMinor: item.totalPriceMinor,
        });
      }

      await db.insert(captures).values({
        tenantId: order.tenantId,
        orderId: order.id,
        providerCaptureId: demoCaptureId,
        amountMinor: order.totalMinor,
        currency: order.currency,
        status: 'COMPLETED',
        refundedMinor: '0',
      });

      const journalTxn = buildOrderCaptureJournal({
        orderId: order.id,
        subtotalMinor: order.subtotalMinor,
        taxMinor: order.taxMinor,
        shippingMinor: order.shippingMinor,
        totalMinor: order.totalMinor,
        currency: order.currency,
      });

      const [txRecord] = await db
        .insert(journalTransactions)
        .values({
          tenantId: order.tenantId,
          businessEventKey: journalTxn.businessEventKey,
          description: journalTxn.description,
          currency: journalTxn.currency,
        })
        .returning();

      for (const entry of journalTxn.entries) {
        await db.insert(journalEntries).values({
          tenantId: order.tenantId,
          transactionId: txRecord.id,
          accountCode: entry.accountCode,
          debitMinor: entry.debitMinor,
          creditMinor: entry.creditMinor,
        });
      }

      return {
        orderId: order.id,
        orderReference,
        paypalOrderId: order.paypalOrderId!,
        approveUrl: '',
        total,
        status: 'PAID',
        captureId: demoCaptureId,
        instantDemo: true,
      };
    }

    // Call PayPal Orders create
    const paypalOrder = await this.paypalAdapter.createOrder({
      orderReference,
      total,
      subtotal,
      items: itemsToInsert.map((i) => ({
        name: i.title,
        sku: i.sku,
        quantity: i.quantity,
        unitPrice: createMoney(i.unitPriceMinor, tenant.defaultCurrency),
      })),
      returnUrl: `${process.env.PUBLIC_WEB_URL || 'http://localhost:3000'}/checkout/success?ref=${orderReference}`,
      cancelUrl: `${process.env.PUBLIC_WEB_URL || 'http://localhost:3000'}/checkout/cancel?ref=${orderReference}`,
    });

    const approveLink = paypalOrder.links?.find((l) => l.rel === 'approve')?.href || `http://localhost:3000/mock/paypal?token=${paypalOrder.id}`;

    // Insert order record
    const [order] = await db
      .insert(orders)
      .values({
        tenantId: tenant.id,
        orderReference,
        customerId: customer.id,
        customerEmail: customer.email,
        customerName: customer.name,
        status: 'PENDING',
        currency: tenant.defaultCurrency,
        subtotalMinor: subtotal.minor,
        taxMinor: tax.minor,
        shippingMinor: shipping.minor,
        totalMinor: total.minor,
        paypalOrderId: paypalOrder.id,
      })
      .returning();

    for (const item of itemsToInsert) {
      await db.insert(orderItems).values({
        tenantId: tenant.id,
        orderId: order.id,
        variantId: item.variantId,
        sku: item.sku,
        title: item.title,
        quantity: item.quantity,
        unitPriceMinor: item.unitPriceMinor,
        totalPriceMinor: item.totalPriceMinor,
      });
    }

    return {
      orderId: order.id,
      orderReference,
      paypalOrderId: paypalOrder.id,
      approveUrl: approveLink,
      total,
    };
  }

  async captureCheckoutOrder(orderId: string, dto: CaptureCheckoutOrderDto): Promise<{
    orderId: string;
    orderReference: string;
    status: string;
    paypalCaptureId: string;
  }> {
    const db = await getDb();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const [order] = isUuid
      ? await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
      : await db.select().from(orders).where(eq(orders.orderReference, orderId)).limit(1);

    if (!order) throw new NotFoundException(`Order not found: ${orderId}`);

    if (order.status === 'PAID') {
      return {
        orderId: order.id,
        orderReference: order.orderReference,
        status: order.status,
        paypalCaptureId: order.paypalCaptureId || '',
      };
    }

    // Call PayPal capture
    let captureResult;
    try {
      captureResult = await this.paypalAdapter.captureOrder(dto.paypalOrderId || order.paypalOrderId!);
    } catch (err: any) {
      if (err.message?.includes('ORDER_NOT_APPROVED')) {
        throw new BadRequestException('PayPal Order has not yet been approved by payer. Please complete payment approval on PayPal first.');
      }
      throw new BadRequestException(`PayPal capture failed: ${err.message}`);
    }

    if (captureResult.status !== 'COMPLETED') {
      throw new BadRequestException(`PayPal capture status is ${captureResult.status}`);
    }

    // Update order status
    await db
      .update(orders)
      .set({
        status: 'PAID',
        paypalCaptureId: captureResult.id,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    // Record capture
    await db.insert(captures).values({
      tenantId: order.tenantId,
      orderId: order.id,
      providerCaptureId: captureResult.id,
      amountMinor: order.totalMinor,
      currency: order.currency,
      status: 'COMPLETED',
      refundedMinor: '0',
    });

    // Double-entry journal transaction
    const journalTxn = buildOrderCaptureJournal({
      orderId: order.id,
      subtotalMinor: order.subtotalMinor,
      taxMinor: order.taxMinor,
      shippingMinor: order.shippingMinor,
      totalMinor: order.totalMinor,
      currency: order.currency,
    });

    const [txRecord] = await db
      .insert(journalTransactions)
      .values({
        tenantId: order.tenantId,
        businessEventKey: journalTxn.businessEventKey,
        description: journalTxn.description,
        currency: journalTxn.currency,
      })
      .returning();

    for (const entry of journalTxn.entries) {
      await db.insert(journalEntries).values({
        tenantId: order.tenantId,
        transactionId: txRecord.id,
        accountCode: entry.accountCode,
        debitMinor: entry.debitMinor,
        creditMinor: entry.creditMinor,
      });
    }

    return {
      orderId: order.id,
      orderReference: order.orderReference,
      status: 'PAID',
      paypalCaptureId: captureResult.id,
    };
  }

  async getOrderById(orderId: string, tenantId?: string): Promise<Order> {
    const db = await getDb();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
    const conditions = isUuid ? [eq(orders.id, orderId)] : [eq(orders.orderReference, orderId)];
    if (tenantId) conditions.push(eq(orders.tenantId, tenantId));

    const [order] = await db.select().from(orders).where(and(...conditions)).limit(1);
    if (!order) throw new NotFoundException(`Order not found: ${orderId}`);

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

    return {
      id: order.id,
      tenantId: order.tenantId,
      orderReference: order.orderReference,
      customerId: order.customerId,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      status: order.status as any,
      currency: order.currency,
      subtotal: { currency: order.currency, minor: order.subtotalMinor },
      tax: { currency: order.currency, minor: order.taxMinor },
      shipping: { currency: order.currency, minor: order.shippingMinor },
      total: { currency: order.currency, minor: order.totalMinor },
      paypalOrderId: order.paypalOrderId || undefined,
      paypalCaptureId: order.paypalCaptureId || undefined,
      createdAt: order.createdAt.toISOString(),
      items: items.map((i) => ({
        id: i.id,
        orderId: i.orderId,
        variantId: i.variantId,
        sku: i.sku,
        title: i.title,
        quantity: i.quantity,
        unitPrice: { currency: order.currency, minor: i.unitPriceMinor },
        totalPrice: { currency: order.currency, minor: i.totalPriceMinor },
      })),
    };
  }
}

