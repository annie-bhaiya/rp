import './globals.css';
import { Providers } from '../components/providers';
import { Navbar } from '../components/navbar';

export const metadata = {
  title: 'ResolvePay Rescue — Autonomous Dispute & Remedy Resolution',
  description: 'Policy-grounded, double-entry verified commerce resolution platform',
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
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
            <p>ResolvePay Rescue — Built with PayPal Orders v2, Gemini AI Structured Reasoning, and PostgreSQL Subledger.</p>
            <p className="mt-1">WCAG 2.2 AA compliant | Sandbox demonstration mode</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
