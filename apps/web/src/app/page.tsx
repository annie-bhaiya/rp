'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchJson } from '../lib/api';

export default function StorefrontPage() {
  const [buyingVariantId, setBuyingVariantId] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['catalog'],
    queryFn: () => fetchJson<any>('/api/v1/catalog?tenantSlug=default-merchant'),
  });

  const handleBuyNow = async (variantId: string) => {
    setBuyingVariantId(variantId);
    setError(null);
    try {
      // 1. Create order
      const createRes = await fetchJson<any>('/api/v1/checkout/orders', {
        method: 'POST',
        body: JSON.stringify({
          tenantSlug: 'default-merchant',
          customerEmail: 'alex.customer@example.com',
          customerName: 'Alex Johnson',
          items: [{ variantId, quantity: 1 }],
        }),
      });

      // 2. Capture immediately in sandbox demo mode
      const captureRes = await fetchJson<any>(`/api/v1/checkout/orders/${createRes.orderId}/capture`, {
        method: 'POST',
        body: JSON.stringify({ paypalOrderId: createRes.paypalOrderId }),
      });

      setOrderResult({
        orderId: createRes.orderId,
        orderReference: createRes.orderReference,
        status: captureRes.status,
        captureId: captureRes.paypalCaptureId,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBuyingVariantId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero / Notice Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              PeakGear Outfitter Storefront
            </h1>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              Explore technical mountaineering gear backed by the <strong>ResolvePay Rescue</strong> guarantee. If anything arrives damaged, missing, or requires an exchange, our inspectable remedy engine prepares exact policy-grounded plans with mathematical ledger certainty.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/portal/orders/70000000-0000-0000-0000-000000000001"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm transition"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Test Pre-Seeded Order (ORD-2026-9041)
            </Link>

            <Link
              href="/portal"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
            >
              Lookup Existing Order
            </Link>
          </div>
        </div>
      </div>

      {/* Success Notification after purchase */}
      {orderResult && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-5 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-emerald-900">Sandbox Purchase Successful!</h3>
            <p className="text-xs text-emerald-800 mt-1">
              Order <strong>{orderResult.orderReference}</strong> has been captured via PayPal (Capture ID: <span className="font-mono">{orderResult.captureId}</span>).
            </p>
            <div className="mt-3">
              <Link
                href={`/portal/orders/${orderResult.orderId}`}
                className="inline-flex items-center text-xs font-semibold text-emerald-950 underline hover:text-emerald-900"
              >
                Open Customer Resolution Portal for this order <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-800 flex-shrink-0" />
          <span className="text-sm text-red-900">{error}</span>
        </div>
      )}

      {/* Products Catalog Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-slate-700" />
          Active Catalog Items
        </h2>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading catalog items...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.products?.map((product: any) => {
              const variant = product.variants?.[0];
              const priceDollars = variant ? (Number(variant.price.minor) / 100).toFixed(2) : '0.00';

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition"
                >
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2 py-0.5 rounded border border-slate-200">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{product.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-900 font-mono">
                        ${priceDollars}
                        <span className="text-xs text-slate-500 font-normal ml-1">USD</span>
                      </div>

                      <button
                        onClick={() => variant && handleBuyNow(variant.id)}
                        disabled={buyingVariantId === variant?.id}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        {buyingVariantId === variant?.id ? 'Processing...' : 'Buy with PayPal'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
