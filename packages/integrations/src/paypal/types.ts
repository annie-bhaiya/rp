import { Money } from '@resolvepay/contracts';

export interface PayPalCreateOrderParams {
  orderReference: string;
  total: Money;
  subtotal: Money;
  tax?: Money;
  shipping?: Money;
  items?: Array<{
    name: string;
    quantity: number;
    unitPrice: Money;
    sku?: string;
  }>;
  returnUrl?: string;
  cancelUrl?: string;
  requestId?: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  links?: Array<{ href: string; rel: string; method: string }>;
}

export interface PayPalCaptureResponse {
  id: string;
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING' | 'FAILED';
  amount: {
    currency_code: string;
    value: string;
  };
}

export interface PayPalRefundParams {
  captureId: string;
  amount: Money;
  requestId?: string;
  reason?: string;
}

export interface PayPalRefundResponse {
  id: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  amount: {
    currency_code: string;
    value: string;
  };
}

export interface PayPalWebhookVerificationParams {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookId: string;
  webhookEvent: Record<string, unknown>;
}

export interface PayPalAdapter {
  createOrder(params: PayPalCreateOrderParams): Promise<PayPalOrderResponse>;
  getOrder(orderId: string): Promise<PayPalOrderResponse>;
  captureOrder(orderId: string, requestId?: string): Promise<PayPalCaptureResponse>;
  refundCapture(params: PayPalRefundParams): Promise<PayPalRefundResponse>;
  getRefund(refundId: string): Promise<PayPalRefundResponse>;
  verifyWebhook(params: PayPalWebhookVerificationParams): Promise<boolean>;
}

