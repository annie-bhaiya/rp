'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from './auth-provider';
import { fetchJson } from '../lib/api';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session, demo, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const links = [
    { href: '/', label: 'Shop' },
    { href: session?.actorType === 'CUSTOMER' && session.orderId ? `/portal/orders/${session.orderId}` : '/portal', label: 'My order' },
    { href: '/merchant', label: 'Merchant workspace' },
    ...(demo ? [{ href: '/mailbox', label: 'Demo inbox' }] : []),
  ];
  async function logout() {
    setBusy(true); setError('');
    try { await fetchJson('/api/v1/auth/logout', { method: 'POST' }); await queryClient.cancelQueries(); queryClient.clear(); queryClient.setQueryData(['auth-session'], null); router.replace('/'); router.refresh(); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return <header className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="min-h-16 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight"><ShieldCheck aria-hidden="true" className="w-6 h-6 text-blue-800" />ResolvePay Rescue</Link>
        <div className="flex items-center gap-3 text-sm">
          {demo && <span className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-800 border border-amber-200">Sandbox demo</span>}
          {session ? <><span className="hidden sm:block text-slate-600">{session.actorType === 'CUSTOMER' ? 'Customer' : session.role?.replaceAll('_', ' ').toLowerCase()}</span><button onClick={logout} disabled={busy} className="inline-flex gap-2 items-center px-3 py-2 rounded-md border border-slate-300"><LogOut aria-hidden="true" className="w-4 h-4" />{busy ? 'Signing out…' : 'Sign out'}</button></> : !loading && <Link href="/sign-in" className="text-blue-800 font-medium py-2">Sign in</Link>}
        </div>
      </div>
      <nav aria-label="Main navigation" className="flex gap-5 overflow-x-auto text-sm whitespace-nowrap">
        {links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} className={`py-3 border-b-2 ${pathname === link.href ? 'border-blue-800 text-blue-800 font-semibold' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>{link.label}</Link>)}
      </nav>
      {error && <p role="alert" className="py-2 text-sm text-red-800">{error}</p>}
    </div>
  </header>;
}
