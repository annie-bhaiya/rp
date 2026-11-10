import {
  PayPalAdapter,
  PayPalCreateOrderParams,
  PayPalOrderResponse,
  PayPalCaptureResponse,
  PayPalRefundParams,
  PayPalRefundResponse,
  PayPalWebhookVerificationParams,
} from './types.js';

export interface PayPalClientConfig {
  clientId: string;
  clientSecret: string;
  mode?: 'sandbox' | 'live';
  webhookId?: string;
}

export class PayPalRestClient implements PayPalAdapter {
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(private config: PayPalClientConfig) {
    this.baseUrl = config.mode === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.accessToken && this.tokenExpiresAt > now + 60000) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal OAuth authentication failed (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.accessToken = data.access_token;
    this.tokenExpiresAt = now + data.expires_in * 1000;
    return this.accessToken;
  }

  async createOrder(params: PayPalCreateOrderParams): Promise<PayPalOrderResponse> {
    const token = await this.getAccessToken();
    const value = (Number(params.total.minor) / 100).toFixed(2);
    const subtotalValue = (Number(params.subtotal.minor) / 100).toFixed(2);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    if (params.requestId) {
      headers['PayPal-Request-Id'] = params.requestId;
    }

    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.orderReference,
          amount: {
            currency_code: params.total.currency,
            value,
            breakdown: {
              item_total: {
                currency_code: params.subtotal.currency,
                value: subtotalValue,
              },
            },
          },
          items: params.items?.map((item) => ({
            name: item.name,
            sku: item.sku,
            unit_amount: {
              currency_code: item.unitPrice.currency,
              value: (Number(item.unitPrice.minor) / 100).toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      application_context: {
        return_url: params.returnUrl || 'http://localhost:3000/checkout/success',
        cancel_url: params.cancelUrl || 'http://localhost:3000/checkout/cancel',
      },
    };

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal createOrder failed (${res.status}): ${errText}`);
    }

    return (await res.json()) as PayPalOrderResponse;
  }

  async getOrder(orderId: string): Promise<PayPalOrderResponse> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal getOrder failed (${res.status}): ${errText}`);
    }

    return (await res.json()) as PayPalOrderResponse;
  }

  async captureOrder(orderId: string, requestId?: string): Promise<PayPalCaptureResponse> {
    const token = await this.getAccessToken();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    if (requestId) {
      headers['PayPal-Request-Id'] = requestId;
    }

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal captureOrder failed (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as {
      status: string;
      purchase_units?: Array<{
        payments?: {
          captures?: Array<{
            id: string;
            status: string;
            amount: { currency_code: string; value: string };
          }>;
        };
      }>;
    };

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture) {
      throw new Error(`PayPal capture response missing payment details`);
    }

    return {
      id: capture.id,
      status: capture.status as PayPalCaptureResponse['status'],
      amount: capture.amount,
    };
  }

  async refundCapture(params: PayPalRefundParams): Promise<PayPalRefundResponse> {
    const token = await this.getAccessToken();
    const value = (Number(params.amount.minor) / 100).toFixed(2);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    if (params.requestId) {
      headers['PayPal-Request-Id'] = params.requestId;
    }

    const body: Record<string, unknown> = {
      amount: {
        value,
        currency_code: params.amount.currency,
      },
    };
    if (params.reason) {
      body.note_to_payer = params.reason;
    }

    const res = await fetch(`${this.baseUrl}/v2/payments/captures/${params.captureId}/refund`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal refundCapture failed (${res.status}): ${errText}`);
    }

    return (await res.json()) as PayPalRefundResponse;
  }

  async getRefund(refundId: string): Promise<PayPalRefundResponse> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/payments/refunds/${refundId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`PayPal getRefund failed (${res.status}): ${errText}`);
    }

    return (await res.json()) as PayPalRefundResponse;
  }

  async verifyWebhook(params: PayPalWebhookVerificationParams): Promise<boolean> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: params.authAlgo,
        cert_url: params.certUrl,
        transmission_id: params.transmissionId,
        transmission_sig: params.transmissionSig,
        transmission_time: params.transmissionTime,
        webhook_id: params.webhookId || this.config.webhookId,
        webhook_event: params.webhookEvent,
      }),
    });

    if (!res.ok) return false;
    const data = (await res.json()) as { verification_status: string };
    return data.verification_status === 'SUCCESS';
  }
}

