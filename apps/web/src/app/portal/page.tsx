'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchJson } from '../../lib/api';

export default function CustomerPortalPage() {
  const [orderReference, setOrderReference] = useState('ORD-2026-9041');
  const [email, setEmail] = useState('alex.customer@example.com');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetchJson<any>('/api/v1/auth/customer/access/request', {
        method: 'POST',
        body: JSON.stringify({
          tenantSlug: 'default-merchant',
          orderReference,
          email,
        }),
      });
      setResponse(res);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <span className="p-2 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
            <KeyRound className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Access Your Order</h1>
            <p className="text-xs text-slate-500 mt-0.5">Secure, link-based access for purchase remedies</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Order Reference
            </label>
            <input
              type="text"
              value={orderReference}
              onChange={(e) => setOrderReference(e.target.value)}
              required
              placeholder="e.g. ORD-2026-9041"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Purchasing Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. alex.customer@example.com"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:border-blue-600 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center py-2.5 px-4 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-50 transition"
          >
            {loading ? 'Sending Access Link...' : 'Request Secure Access Link'}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </form>

        {response && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-emerald-900">{response.message}</p>
                {response.devToken && (
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-xs text-emerald-800 font-semibold mb-1">
                      Demo Environment Direct Token:
                    </p>
                    <Link
                      href={`/portal/access?token=${response.devToken}`}
                      className="inline-flex items-center text-xs font-mono font-medium text-blue-900 underline hover:text-blue-700"
                    >
                      Redeem Link Instantly →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-800 flex-shrink-0" />
            <p className="text-xs font-medium text-red-900">{error}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Need help? Check the Dev Mailbox for test links.</span>
          <Link href="/mailbox" className="text-blue-800 font-medium hover:underline flex items-center">
            <Mail className="w-3.5 h-3.5 mr-1" /> View Mailbox
          </Link>
        </div>
      </div>
    </div>
  );
}

