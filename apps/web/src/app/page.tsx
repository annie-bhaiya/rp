'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../components/auth-provider';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldAlert, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { fetchJson } from '../lib/api';

export default function StorefrontPage() {
  const { demo } = useAuth();
  const cache = useQueryClient();
  const checkoutForm = useRef<HTMLFormElement>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [processingVariantId, setProcessingVariantId] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<'paypal' | 'demo' | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, error: catalogError, refetch } = useQuery({
    queryKey: ['catalog'],
    queryFn: () => fetchJson<any>('/api/v1/catalog?tenantSlug=default-merchant'),
  });

  const handlePayPalCheckout = async (variantId: string) => {
    if (!checkoutForm.current?.reportValidity()) return;
    setProcessingVariantId(variantId);
    setProcessingType('paypal');
    setError(null);
    try {
      const createRes = await fetchJson<any>('/api/v1/checkout/orders', {
        method: 'POST',
        body: JSON.stringify({
          tenantSlug: 'default-merchant',
          customerEmail: customerEmail.trim(),
          customerName: customerName.trim(),
          items: [{ variantId, quantity: 1 }],
        }),
      });

      if (createRes.approveUrl) {
        window.location.href = createRes.approveUrl;
      } else {
        throw new Error('No PayPal approval link returned by checkout service.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate PayPal checkout.');
      setProcessingVariantId(null);
      setProcessingType(null);
    }
  };

  const handleInstantDemoBuy = async (variantId: string) => {
    setProcessingVariantId(variantId);
    setProcessingType('demo');
    setError(null);
    try {
      const createRes = await fetchJson<any>('/api/v1/checkout/orders', {
        method: 'POST',
        body: JSON.stringify({
          tenantSlug: 'default-merchant',
          customerEmail: 'alex.customer@example.com',
          customerName: 'Alex Johnson',
          instantDemo: true,
          items: [{ variantId, quantity: 1 }],
        }),
      });

      const auth = await fetchJson<any>('/api/v1/auth/login-dev', { method: 'POST', body: JSON.stringify({ persona: 'CUSTOMER', orderId: createRes.orderId, tenantSlug: 'default-merchant' }) });
      cache.clear();
      cache.setQueryData(['auth-session'], auth.session);
      setOrderResult({
        orderId: createRes.orderId,
        orderReference: createRes.orderReference,
        status: createRes.status,
        captureId: createRes.captureId,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to create instant demo order.');
    } finally {
      setProcessingVariantId(null);
      setProcessingType(null);
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
              Gear for your next adventure, with clear support if something goes wrong. Report a problem, compare the options covered by store policy, and track your resolution in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/portal"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm transition"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Get help with an order
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
            <h3 className="text-sm font-semibold text-emerald-900">Purchase Completed Successfully!</h3>
            <p className="text-xs text-emerald-800 mt-1">
              Order <strong>{orderResult.orderReference}</strong> has been confirmed (Capture ID: <span className="font-mono">{orderResult.captureId}</span>).
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
      <form ref={checkoutForm} onSubmit={e => e.preventDefault()} className="border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold">Your checkout details</h2>
        <p className="mt-1 mb-4 text-sm text-slate-600">Use your own email so you can securely access your order after payment. Demo purchases use sample details.</p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          <div><label htmlFor="checkout-name" className="block text-sm font-medium mb-2">Name</label><input id="checkout-name" autoComplete="name" required maxLength={100} value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2.5" /></div>
          <div><label htmlFor="checkout-email" className="block text-sm font-medium mb-2">Email</label><input id="checkout-email" type="email" autoComplete="email" required maxLength={255} value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2.5" /></div>
        </div>
      </form>
      {catalogError && <div role="alert" className="text-red-800"><p>{catalogError.message}</p><button onClick={() => refetch()} className="mt-2 underline">Try loading the catalog again</button></div>}
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
              const isBuying = processingVariantId === variant?.id;

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

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Price</span>
                        <div className="text-lg font-bold text-slate-900 font-mono">
                          ${priceDollars}
                          <span className="text-xs text-slate-500 font-normal ml-1">USD</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => variant && handlePayPalCheckout(variant.id)}
                          disabled={isBuying}
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                          {isBuying && processingType === 'paypal' ? 'Redirecting...' : 'Buy with PayPal'}
                        </button>

                          {demo && <button
                          onClick={() => variant && handleInstantDemoBuy(variant.id)}
                          disabled={isBuying}
                          className="inline-flex items-center justify-center px-3 py-2 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-50 transition"
                        >
                          <Zap className="w-3.5 h-3.5 mr-1 text-amber-600" />
                          {isBuying && processingType === 'demo' ? 'Creating...' : '1-Click Demo Buy'}
                          </button>}
                      </div>
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
