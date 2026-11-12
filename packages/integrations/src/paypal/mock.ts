import {
  PayPalAdapter,
  PayPalCreateOrderParams,
  PayPalOrderResponse,
  PayPalCaptureResponse,
  PayPalRefundParams,
  PayPalRefundResponse,
  PayPalWebhookVerificationParams,
} from './types.js';

export class MockPayPalAdapter implements PayPalAdapter {
  private orders = new Map<string, { status: PayPalOrderResponse['status']; params: PayPalCreateOrderParams }>();
  private captures = new Map<string, { orderId: string; amount: string; currency: string; refunded: bigint }>();
  private refunds = new Map<string, PayPalRefundResponse>();
  private refundsByRequestId = new Map<string, PayPalRefundResponse>();

  async createOrder(params: PayPalCreateOrderParams): Promise<PayPalOrderResponse> {
    const id = `MOCK-PAYPAL-ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.orders.set(id, { status: 'CREATED', params });
    return {
      id,
      status: 'CREATED',
      links: [
        {
          href: `http://localhost:3000/mock/paypal-checkout?token=${id}`,
          rel: 'approve',
          method: 'GET',
        },
      ],
    };
  }

  async getOrder(orderId: string): Promise<PayPalOrderResponse> {
    const existing = this.orders.get(orderId);
    if (!existing) {
      return { id: orderId, status: 'COMPLETED' };
    }
    return { id: orderId, status: existing.status };
  }

  async captureOrder(orderId: string, _requestId?: string): Promise<PayPalCaptureResponse> {
    const existing = this.orders.get(orderId);
    const amountMinor = existing ? existing.params.total.minor : '12000';
    const currency = existing ? existing.params.total.currency : 'USD';
    const captureId = `MOCK-PAYPAL-CAP-${Date.now()}`;

    this.captures.set(captureId, {
      orderId,
      amount: amountMinor,
      currency,
      refunded: 0n,
    });

    if (existing) {
      existing.status = 'COMPLETED';
    }

    return {
      id: captureId,
      status: 'COMPLETED',
      amount: {
        currency_code: currency,
        value: (Number(amountMinor) / 100).toFixed(2),
      },
    };
  }

  async refundCapture(params: PayPalRefundParams): Promise<PayPalRefundResponse> {
    if (params.requestId && this.refundsByRequestId.has(params.requestId)) {
      return this.refundsByRequestId.get(params.requestId)!;
    }

    const capture = this.captures.get(params.captureId);
    const refundMinor = BigInt(params.amount.minor);

    if (capture) {
      const capturedMinor = BigInt(capture.amount);
      if (capture.refunded + refundMinor > capturedMinor) {
        throw new Error(
          `Refund amount exceeds remaining capture balance: ${capture.refunded + refundMinor} > ${capturedMinor}`
        );
      }
      capture.refunded += refundMinor;
    }

    const refundId = `MOCK-PAYPAL-REF-${Date.now()}`;
    const response: PayPalRefundResponse = {
      id: refundId,
      status: 'COMPLETED',
      amount: {
        currency_code: params.amount.currency,
        value: (Number(params.amount.minor) / 100).toFixed(2),
      },
    };
    this.refunds.set(refundId, response);
    if (params.requestId) {
      this.refundsByRequestId.set(params.requestId, response);
    }
    return response;
  }

  async getRefund(refundId: string): Promise<PayPalRefundResponse> {
    const existing = this.refunds.get(refundId) || this.refundsByRequestId.get(refundId);
    if (!existing) {
      return {
        id: refundId.startsWith('REF-') || refundId.startsWith('MOCK-') ? refundId : `REF-RECON-${Date.now().toString().slice(-6)}`,
        status: 'COMPLETED',
        amount: { currency_code: 'USD', value: '120.00' },
      };
    }
    return existing;
  }

  async verifyWebhook(_params: PayPalWebhookVerificationParams): Promise<boolean> {
    return true;
  }
}

