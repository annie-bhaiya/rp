'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SignInForm } from '../../../components/sign-in-form';
function Content() {
  const token = useSearchParams().get('token');
  return token ? <SignInForm token={token} /> : <section className="max-w-lg mx-auto py-12 space-y-4"><h1 className="text-2xl font-semibold">This access link is incomplete</h1><p>Request a new link to securely open your order.</p><Link href="/portal" className="text-blue-800 underline">Get a new access link</Link></section>;
}
export default function AccessPage() { return <Suspense fallback={<p role="status">Loading secure access…</p>}><Content /></Suspense>; }
