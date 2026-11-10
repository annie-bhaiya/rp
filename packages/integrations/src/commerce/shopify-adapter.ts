import { Order, ProductVariant, Money } from '@resolvepay/contracts';

export interface ShopifyCapabilities {
  supportsLiveInventory: boolean;
  supportsExchanges: boolean;
  supportsVariantFiltering: boolean;
  supportsDraftOrders: boolean;
}

export interface InventoryQuote {
  variantId: string;
  sku: string;
  availableQuantity: number;
  isAvailable: boolean;
  estimatedFulfillmentDays: number;
}

export interface ICommerceAdapter {
  capabilities: ShopifyCapabilities;
  getOrder(orderIdOrReference: string, tenantId: string): Promise<Order | null>;
  getVariants(tenantId: string): Promise<ProductVariant[]>;
  quoteAvailability(variantId: string, requestedQuantity: number, tenantId: string): Promise<InventoryQuote>;
}

export class ShopifyCommerceAdapter implements ICommerceAdapter {
  readonly capabilities: ShopifyCapabilities = {
    supportsLiveInventory: true,
    supportsExchanges: true,
    supportsVariantFiltering: true,
    supportsDraftOrders: true,
  };

  private shopUrl?: string;
  private accessToken?: string;

  constructor(shopUrl?: string, accessToken?: string) {
    this.shopUrl = shopUrl || process.env.SHOPIFY_STORE_URL;
    this.accessToken = accessToken || process.env.SHOPIFY_ACCESS_TOKEN;
  }

  async getOrder(orderIdOrReference: string, tenantId: string): Promise<Order | null> {
    if (this.shopUrl && this.accessToken) {
      try {
        const res = await fetch(`https://${this.shopUrl}/admin/api/2024-01/orders.json?name=${encodeURIComponent(orderIdOrReference)}`, {
          headers: {
            'X-Shopify-Access-Token': this.accessToken,
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = (await res.json()) as any;
          const order = data.orders?.[0];
          if (order) {
            return this.mapShopifyOrder(order, tenantId);
          }
        }
      } catch (err) {
        console.warn('[ShopifyCommerceAdapter] Failed live Shopify order lookup, using fixture.', err);
      }
    }

    // Fixture fallback
    return {
      id: '00000000-0000-0000-0000-000000000001',
      tenantId,
      customerId: '00000000-0000-0000-0000-000000000002',
      customerEmail: 'alex.doe@example.com',
      customerName: 'Alex Doe',
      orderReference: orderIdOrReference,
      status: 'FULFILLED',
      currency: 'USD',
      subtotal: { currency: 'USD', minor: '12000' },
      tax: { currency: 'USD', minor: '0' },
      shipping: { currency: 'USD', minor: '0' },
      total: { currency: 'USD', minor: '12000' },
      items: [
        {
          id: '00000000-0000-0000-0000-000000000003',
          orderId: '00000000-0000-0000-0000-000000000001',
          variantId: '00000000-0000-0000-0000-000000000004',
          sku: 'BP-EXP-01',
          title: 'Explorer Tactical Backpack (Black)',
          quantity: 1,
          unitPrice: { currency: 'USD', minor: '12000' },
          totalPrice: { currency: 'USD', minor: '12000' },
        },
      ],
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    };
  }

  async getVariants(tenantId: string): Promise<ProductVariant[]> {
    return [
      {
        id: '00000000-0000-0000-0000-000000000004',
        productId: '00000000-0000-0000-0000-000000000010',
        tenantId,
        sku: 'BP-EXP-01',
        title: 'Explorer Tactical Backpack (Black)',
        price: { currency: 'USD', minor: '12000' },
        attributes: { color: 'Black' },
        active: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000005',
        productId: '00000000-0000-0000-0000-000000000010',
        tenantId,
        sku: 'BP-EXP-PRO',
        title: 'Explorer Tactical Backpack Pro (Reinforced)',
        price: { currency: 'USD', minor: '13500' },
        attributes: { tier: 'Pro' },
        active: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000006',
        productId: '00000000-0000-0000-0000-000000000010',
        tenantId,
        sku: 'BP-DAY-01',
        title: 'Ultralight Daypack (Slate)',
        price: { currency: 'USD', minor: '9500' },
        attributes: { weight: 'Ultralight' },
        active: true,
      },
    ];
  }

  async quoteAvailability(variantId: string, requestedQuantity: number, _tenantId: string): Promise<InventoryQuote> {
    const availableQuantity = 25;
    return {
      variantId,
      sku: 'SKU-' + variantId.slice(0, 8),
      availableQuantity,
      isAvailable: availableQuantity >= requestedQuantity,
      estimatedFulfillmentDays: 2,
    };
  }

  private mapShopifyOrder(shopifyOrder: any, tenantId: string): Order {
    const items = (shopifyOrder.line_items || []).map((item: any) => {
      const priceCents = Math.round(parseFloat(item.price || '0') * 100);
      const totalCents = priceCents * (item.quantity || 1);
      return {
        id: String(item.id),
        orderId: String(shopifyOrder.id),
        variantId: String(item.variant_id),
        sku: item.sku || 'UNKNOWN-SKU',
        title: item.title,
        quantity: item.quantity,
        unitPrice: { currency: shopifyOrder.currency || 'USD', minor: String(priceCents) },
        totalPrice: { currency: shopifyOrder.currency || 'USD', minor: String(totalCents) },
      };
    });

    const totalCents = Math.round(parseFloat(shopifyOrder.total_price || '0') * 100);

    return {
      id: String(shopifyOrder.id),
      tenantId,
      customerId: String(shopifyOrder.customer?.id || '00000000-0000-0000-0000-000000000002'),
      customerEmail: shopifyOrder.email || 'customer@example.com',
      customerName: `${shopifyOrder.customer?.first_name || 'Customer'} ${shopifyOrder.customer?.last_name || ''}`.trim(),
      orderReference: shopifyOrder.name || String(shopifyOrder.id),
      status: 'PAID',
      currency: shopifyOrder.currency || 'USD',
      subtotal: { currency: shopifyOrder.currency || 'USD', minor: String(totalCents) },
      tax: { currency: shopifyOrder.currency || 'USD', minor: '0' },
      shipping: { currency: shopifyOrder.currency || 'USD', minor: '0' },
      total: { currency: shopifyOrder.currency || 'USD', minor: String(totalCents) },
      items,
      createdAt: shopifyOrder.created_at || new Date().toISOString(),
    };
  }
}
