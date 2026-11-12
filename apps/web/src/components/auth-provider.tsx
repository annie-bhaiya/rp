'use client';

import { createContext, useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { SessionInfo } from '@resolvepay/contracts';
import { ApiError, fetchJson } from '../lib/api';

const AuthContext = createContext<{ session: SessionInfo | null; loading: boolean; demo: boolean; error: Error | null; retry: () => void }>({ session: null, loading: true, demo: false, error: null, retry: () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const session = useQuery({ queryKey: ['auth-session'], queryFn: async ({ signal }) => {
    try { return await fetchJson<SessionInfo>('/api/v1/auth/session', { signal }); }
    catch (error) { if (error instanceof ApiError && error.status === 401) return null; throw error; }
  }, retry: false, refetchOnWindowFocus: true, refetchInterval: 60_000 });
  const config = useQuery({ queryKey: ['auth-config'], queryFn: () => fetchJson<{ demoEnabled: boolean }>('/api/v1/auth/config'), staleTime: 60_000 });
  useEffect(() => { void queryClient.invalidateQueries({ queryKey: ['auth-session'] }); }, [pathname, queryClient]);
  useEffect(() => {
    const expired = () => {
      void queryClient.cancelQueries();
      queryClient.removeQueries({ predicate: query => !['auth-session', 'auth-config'].includes(String(query.queryKey[0])) });
      queryClient.setQueryData(['auth-session'], null);
    };
    window.addEventListener('resolvepay:unauthorized', expired);
    return () => window.removeEventListener('resolvepay:unauthorized', expired);
  }, [queryClient]);
  useEffect(() => {
    if (!session.data) return;
    const timeout = window.setTimeout(() => window.dispatchEvent(new Event('resolvepay:unauthorized')), Math.max(0, new Date(session.data.expiresAt).getTime() - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [session.data]);
  return <AuthContext.Provider value={{ session: session.data ?? null, loading: session.isPending, demo: config.data?.demoEnabled ?? false, error: session.error, retry: () => { void session.refetch(); } }}>{children}</AuthContext.Provider>;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading, demo, error, retry } = useAuth();
  const pathname = usePathname();
  const merchant = pathname.startsWith('/merchant');
  const order = pathname.startsWith('/portal/orders/');
  const mailbox = pathname === '/mailbox';
  if (!merchant && !order && !mailbox) return children;
  if (loading) return <p role="status" className="py-16 text-center text-slate-600">Checking your secure session…</p>;
  if (mailbox && demo) return children;
  if (error) return <section role="alert" className="max-w-lg mx-auto py-12 space-y-4"><h1 className="text-2xl font-semibold">We could not check your session</h1><p className="text-slate-600">Check your connection, then try again. You do not need to request another sign-in link.</p><button onClick={retry} className="rounded-md bg-blue-800 px-5 py-3 text-white">Try again</button></section>;
  if ((merchant && session?.actorType === 'MERCHANT') || (order && session?.actorType === 'CUSTOMER' && pathname === `/portal/orders/${session.orderId}`)) return children;
  return <section className="max-w-lg mx-auto py-12 space-y-5">
    <h1 className="text-2xl font-semibold">{mailbox ? 'Demo inbox unavailable' : session ? 'Use the right account to continue' : 'Sign in to continue'}</h1>
    <p className="text-slate-600">{mailbox ? 'Your access links are delivered to your email address.' : merchant ? 'Sign in with your store email to review cases and approve resolutions.' : 'Use the email address and reference from your purchase to securely open this order.'}</p>
    <Link className="inline-flex bg-blue-800 text-white rounded-md px-5 py-3 font-medium" href={merchant ? '/sign-in' : '/portal'}>{merchant ? 'Merchant sign in' : 'Find my order'}</Link>
    {session?.actorType === 'CUSTOMER' && session.orderId && order && <Link className="block text-blue-800 underline" href={`/portal/orders/${session.orderId}`}>Return to my current order</Link>}
  </section>;
}
