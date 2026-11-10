'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { fetchJson } from '../../../lib/api';

function AccessRedeemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmRedeem = async () => {
    if (!token) {
      setError('No access token provided in URL');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchJson<any>('/api/v1/auth/customer/access/redeem', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });

      if (res.session?.orderId) {
        router.push(`/portal/orders/${res.session.orderId}`);
      } else {
        router.push('/portal');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm text-center">
      <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
        <ShieldCheck className="w-6 h-6" />
      </div>

      <h1 className="text-xl font-bold text-slate-900">Confirm Order Access</h1>
      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
        To protect your order from automated email scanner prefetching, please click the button below to authenticate your session and view resolution remedies.
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleConfirmRedeem}
        disabled={loading || !token}
        className="w-full mt-6 inline-flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50 transition"
      >
        {loading ? 'Authenticating Order...' : 'Access My Order Remedies'}
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </button>

      <p className="mt-4 text-[11px] text-slate-400">
        Session grants 24-hour scoped access strictly for your authenticated order.
      </p>
    </div>
  );
}

export default function AccessRedeemPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading access verification...</div>}>
        <AccessRedeemContent />
      </Suspense>
    </div>
  );
}
