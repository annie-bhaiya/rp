'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Mail, RefreshCw, KeyRound, ExternalLink } from 'lucide-react';
import { fetchJson } from '../../lib/api';

export default function MailboxViewerPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dev-mailbox'],
    queryFn: () => fetchJson<any>('/api/v1/dev/mailbox'),
    refetchInterval: 3000,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-800" />
            Local Development Mailbox
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Intercepted transactional emails, customer magic links, and notifications (offline alternative for Resend).
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading mailbox...</div>
        ) : data?.emails?.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No outgoing emails sent yet. Request an order access link in the customer portal to test.
          </div>
        ) : (
          data?.emails?.map((mail: any) => {
            // Extract access link from body if present
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
    </div>
  );
}
