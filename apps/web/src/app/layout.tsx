import './globals.css';
import { Providers } from '../components/providers';
import { Navbar } from '../components/navbar';
import { AuthGate } from '../components/auth-provider';

export const metadata = {
  title: 'ResolvePay Rescue — Autonomous Dispute & Remedy Resolution',
  description: 'Policy-grounded, double-entry verified commerce resolution platform',
  referrer: 'no-referrer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Providers>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:p-3 focus:bg-white">Skip to content</a>
          <Navbar />
          <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AuthGate>{children}</AuthGate>
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
            <p>ResolvePay Rescue — Built with PayPal Orders v2, Gemini AI Structured Reasoning, and PostgreSQL Subledger.</p>
            <p className="mt-1">Clear options. Your consent. A resolution you can track.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

