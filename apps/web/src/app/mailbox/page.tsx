'use client';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { fetchJson } from '../../lib/api';

export default function MailboxPage() {
  const { data: emailData, isLoading: emailsLoading, error, refetch: refetchEmails } = useQuery({
    queryKey: ['dev-mailbox'], queryFn: () => fetchJson<any>('/api/v1/dev/mailbox'), refetchInterval: 10000,
  });
  return <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
    <h1 className="text-2xl font-semibold text-slate-900">Email inbox</h1>
    <p className="text-sm text-slate-600">Demo copies of access emails. Open your secure order link to describe a problem and review prepared remedies.</p>
    {error && <p role="alert" className="text-red-800">Could not load emails. Use Refresh to try again.</p>}

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 flex items-center justify-between border-b border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Intercepted Transactional Emails & Magic Links
            </span>
            <button
              onClick={() => refetchEmails()}
              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded transition"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </button>
          </div>

          {emailsLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading mailbox...</div>
          ) : emailData?.emails?.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No outgoing emails captured yet. Trigger a customer magic link login in the portal to test.
            </div>
          ) : (
            emailData?.emails?.map((mail: any) => {
              const linkMatch = mail.text.match(/https?:\/\/[^\s]+/);
              const link = linkMatch ? linkMatch[0] : null;

              return (
                <div key={mail.id} className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{mail.subject}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(mail.sentAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>To: <strong className="text-slate-700 font-mono">{mail.to}</strong></span>
                    <span>From: <strong className="text-slate-700 font-mono">{mail.from || 'resolvepay@divyansh.live'}</strong></span>
                  </div>

                  <pre className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 whitespace-pre-wrap font-sans">
                    {mail.text}
                  </pre>

                  {link && (
                    <div className="pt-2">
                      <a
                        href={link}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-800 text-white rounded text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Open Magic Link in Browser
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
</main>;
}
