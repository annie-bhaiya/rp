'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignInForm } from '../../components/sign-in-form';
function Content() { const params = useSearchParams(); return <SignInForm key={params.get('token') || 'request'} merchant token={params.get('token') || ''} />; }
export default function SignInPage() { return <Suspense fallback={<p role="status">Loading sign in…</p>}><Content /></Suspense>; }
