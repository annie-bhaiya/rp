'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '';

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center space-y-6">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Checkout Cancelled
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Your PayPal checkout session {ref ? `for reference ${ref}` : ''} was cancelled. No charges were made to your account.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Storefront
          </Link>
          <Link
            href="/portal"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" /> Lookup Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto py-16 px-4 text-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <CheckoutCancelContent />
    </Suspense>
  );
}
