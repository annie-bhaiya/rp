'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { SessionInfo } from '@resolvepay/contracts';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from './auth-provider';
import { fetchJson } from '../lib/api';

export function SignInForm({ merchant = false, token = '', initialReference = '' }: { merchant?: boolean; token?: string; initialReference?: string }) {
  const { session, demo } = useAuth();
  const router = useRouter();
  const cache = useQueryClient();
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState(initialReference);
  const [store, setStore] = useState('default-merchant');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ message: string; devToken?: string } | null>(null);
  const inputClass = 'w-full border border-slate-300 rounded-md px-3 py-3 text-base bg-white';
  const destination = session?.actorType === 'MERCHANT' ? '/merchant' : session?.orderId ? `/portal/orders/${session.orderId}` : '';
  async function establish(url: string, body: object) {
    const response = await fetchJson<{ session: SessionInfo }>(url, { method: 'POST', body: JSON.stringify(body) });
    await cache.cancelQueries();
    cache.clear(); cache.setQueryData(['auth-session'], response.session);
    router.replace(response.session.actorType === 'MERCHANT' ? '/merchant' : `/portal/orders/${response.session.orderId}`);
    router.refresh();
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setResult(null);
    try {
      if (token) await establish(`/api/v1/auth/${merchant ? 'merchant' : 'customer'}/access/redeem`, { token });
      else setResult(await fetchJson(`/api/v1/auth/${merchant ? 'merchant' : 'customer'}/access/request`, { method: 'POST', body: JSON.stringify({ email: email.trim(), tenantSlug: store.trim(), ...(!merchant ? { orderReference: reference.trim() } : {}) }) }));
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function enterDemo(persona: string) {
    setBusy(true); setError('');
    try { await establish('/api/v1/auth/login-dev', { persona, tenantSlug: 'default-merchant' }); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return <section className="max-w-lg mx-auto py-4 sm:py-10">
    <ShieldCheck aria-hidden="true" className="w-9 h-9 text-blue-800 mb-5" />
    <h1 className="text-3xl font-semibold tracking-tight">{token ? 'Your secure link is ready' : merchant ? 'Welcome to your workspace' : 'Let’s find your order'}</h1>
    <p className="mt-3 mb-7 text-slate-600 leading-relaxed">{token ? 'Continue to securely sign in. This link can be used once.' : merchant ? 'Use your store email. We’ll send a sign-in link—no password to remember.' : 'Enter the details from your purchase. We’ll email a secure link to report a problem or track your resolution.'}</p>
    {!token && destination && <Link href={destination} className="block mb-6 p-4 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-medium">Continue to your {session?.actorType === 'MERCHANT' ? 'workspace' : 'order'} <ArrowRight aria-hidden="true" className="inline w-4 h-4" /></Link>}
    <form onSubmit={submit} className="space-y-5" aria-busy={busy}>
      {!token && <>
        {!merchant && <div><label htmlFor="order-reference" className="block mb-2 text-sm font-medium">Order reference</label><input id="order-reference" value={reference} onChange={e => setReference(e.target.value)} required maxLength={64} placeholder="ORD-2026-9041" className={inputClass} /></div>}
        <div><label htmlFor="signin-email" className="block mb-2 text-sm font-medium">{merchant ? 'Work email' : 'Email used at checkout'}</label><input id="signin-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} placeholder="you@example.com" className={inputClass} /></div>
        <details className="text-sm text-slate-600"><summary className="cursor-pointer py-2">{merchant ? 'Signing in to another store?' : 'Shopping with another store?'}</summary><label htmlFor="store-slug" className="block my-2">Store ID</label><input id="store-slug" maxLength={64} value={store} onChange={e => setStore(e.target.value)} className={inputClass} /></details>
      </>}
      {error && <p role="alert" className="p-4 rounded-md bg-red-50 text-red-800 border border-red-200 text-sm">{error}</p>}
      <button disabled={busy} className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-md px-4 py-3 disabled:opacity-60">{busy ? (token ? 'Signing in…' : 'Please wait…') : token ? 'Continue securely' : result ? 'Send another link' : 'Email me a sign-in link'}<ArrowRight aria-hidden="true" className="w-4 h-4" /></button>
    </form>
    {result && <div role="status" className="mt-5 p-4 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm space-y-3"><p>{result.message}</p><p>Check your inbox and spam folder. You can correct the details above and try again.</p>{demo && result.devToken && <Link className="block font-semibold underline" href={`${merchant ? '/sign-in' : '/portal/access'}?token=${result.devToken}`}>Open demo sign-in link</Link>}</div>}
    {token && <Link href={merchant ? '/sign-in' : '/portal'} className="block mt-5 text-sm text-blue-800 underline">Expired link? Request a new one</Link>}
    {!token && <p className="mt-6 text-sm text-slate-600">{merchant ? 'Need help with a purchase?' : 'Managing a store?'} <Link className="text-blue-800 underline" href={merchant ? '/portal' : '/sign-in'}>{merchant ? 'Find your order' : 'Merchant sign in'}</Link></p>}
    {demo && !token && <div className="mt-8 pt-6 border-t border-slate-200"><h2 className="font-semibold text-sm">Try the sandbox demo</h2><p className="text-sm text-slate-600 mt-1 mb-4">Explore with sample data. No email required.</p><div className="flex flex-wrap gap-2">{(merchant ? [['OWNER', 'Store owner'], ['APPROVER', 'Approver'], ['JUDGE', 'Judge']] : [['CUSTOMER', 'Try a sample order']]).map(([persona, label]) => <button key={persona} disabled={busy} onClick={() => enterDemo(persona)} className="px-4 py-2.5 text-sm border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50">{label}</button>)}</div></div>}
  </section>;
}
