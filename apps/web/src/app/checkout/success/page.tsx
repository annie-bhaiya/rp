'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { fetchJson } from '@/lib/api';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const token = searchParams.get('token') || '';
  const orderIdParam = searchParams.get('orderId') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [captureResult, setCaptureResult] = useState<{
    orderId: string;
    orderReference: string;
    status: string;
    paypalCaptureId: string;
  } | null>(null);

  useEffect(() => {
    async function captureOrder() {
      const targetId = orderIdParam || ref;
      if (!targetId) {
        setError('No order reference or ID provided in checkout callback.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetchJson<any>(`/api/v1/checkout/orders/${targetId}/capture`, {
          method: 'POST',
          body: JSON.stringify({ paypalOrderId: token || targetId }),
        });
        setCaptureResult(res);
      } catch (err: any) {
        // If it was already captured, fetch order details to show success state
        try {
          const order = await fetchJson<any>(`/api/v1/orders/${targetId}`);
          if (order && order.status === 'PAID') {
            setCaptureResult({
              orderId: order.id,
              orderReference: order.orderReference,
              status: order.status,
              paypalCaptureId: order.paypalCaptureId || '',
            });
            return;
          }
        } catch {
          // ignore lookup error
        }
        setError(err?.message || 'Failed to capture PayPal payment authorization.');
      } finally {
        setLoading(false);
      }
    }

    captureOrder();
  }, [ref, token, orderIdParam]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        {loading ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-10 h-10 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-semibold text-slate-900">Finalizing Your PayPal Purchase</h2>
            <p className="text-sm text-slate-500">
              Confirming your payment with PayPal. Please keep this page open.
            </p>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-red-700">
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Checkout Finalization Issue</h2>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <ShoppingBag className="w-4 h-4 mr-1.5" /> Return to Storefront
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm transition"
              >
                Open Resolution Portal <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider mb-2">
                  Payment Captured & Confirmed
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Thank You for Your Order!
                </h1>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Your PayPal payment is confirmed. Save your order reference below to get help with your purchase.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 font-mono text-xs break-all [&>div]:gap-4">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Order Reference</span>
                <span className="font-bold text-slate-900">{captureResult?.orderReference || ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Internal Order ID</span>
                <span className="text-slate-700">{captureResult?.orderId || orderIdParam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">PayPal Capture ID</span>
                <span className="text-slate-700">{captureResult?.paypalCaptureId || 'COMPLETED'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Status</span>
                <span className="text-emerald-700 font-bold font-sans">PAID</span>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>Need help with your purchase?</strong> Use your order reference and checkout email to securely report a problem and review the options covered by store policy.
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                <ShoppingBag className="w-4 h-4 mr-1.5" /> Back to PeakGear Store
              </Link>
              <Link
                href={`/portal?ref=${encodeURIComponent(captureResult?.orderReference || ref)}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm transition"
              >
                Open Resolution Portal <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading checkout confirmation...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
