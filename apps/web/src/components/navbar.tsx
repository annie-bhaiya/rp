'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, User, Store, Inbox, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchJson } from '../lib/api';

export function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadSession = () => {
    fetchJson<any>('/api/v1/auth/session')
      .then(setSession)
      .catch(() => setSession(null));
  };

  useEffect(() => {
    loadSession();
  }, [pathname]);

  const switchPersona = async (persona: 'OWNER' | 'APPROVER' | 'JUDGE' | 'CUSTOMER') => {
    setLoading(true);
    try {
      await fetchJson('/api/v1/auth/login-dev', {
        method: 'POST',
        body: JSON.stringify({ persona, tenantSlug: 'default-merchant' }),
      });
      loadSession();
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 text-slate-900 font-bold text-lg tracking-tight hover:opacity-90 transition">
              <span className="p-1.5 bg-blue-800 text-white rounded-md">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span>ResolvePay Rescue</span>
            </Link>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
              PeakGear Store
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`flex items-center space-x-1.5 transition ${
                pathname === '/' ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Catalog & Checkout</span>
            </Link>

            <Link
              href="/portal"
              className={`flex items-center space-x-1.5 transition ${
                pathname?.startsWith('/portal') ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer Portal</span>
            </Link>

            <Link
              href="/merchant"
              className={`flex items-center space-x-1.5 transition ${
                pathname?.startsWith('/merchant') ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Merchant Operations</span>
            </Link>

            <Link
              href="/mailbox"
              className={`flex items-center space-x-1.5 transition ${
                pathname === '/mailbox' ? 'text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Dev Mailbox</span>
            </Link>
          </nav>

          {/* Demo Persona Switcher */}
          <div className="flex items-center space-x-2">
            <div className="text-xs font-medium text-slate-500 hidden lg:block">Persona:</div>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => switchPersona('OWNER')}
                disabled={loading}
                className={`px-2.5 py-1 text-xs font-medium rounded-l-md border border-slate-300 ${
                  session?.role === 'MERCHANT_OWNER'
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => switchPersona('APPROVER')}
                disabled={loading}
                className={`px-2.5 py-1 text-xs font-medium border-t border-b border-r border-slate-300 ${
                  session?.role === 'MERCHANT_APPROVER'
                    ? 'bg-blue-800 text-white border-blue-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Approver
              </button>
              <button
                type="button"
                onClick={() => switchPersona('JUDGE')}
                disabled={loading}
                className={`px-2.5 py-1 text-xs font-medium border-t border-b border-r border-slate-300 ${
                  session?.role === 'JUDGE'
                    ? 'bg-purple-800 text-white border-purple-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Judge
              </button>
              <button
                type="button"
                onClick={() => switchPersona('CUSTOMER')}
                disabled={loading}
                className={`px-2.5 py-1 text-xs font-medium rounded-r-md border-t border-b border-r border-slate-300 ${
                  session?.actorType === 'CUSTOMER'
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
