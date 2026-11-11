'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Mail,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Send,
  Smartphone,
  ShieldCheck,
  CheckCheck,
  AlertTriangle,
  Terminal,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { fetchJson } from '../../lib/api';

export default function DevCommsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [customPhone, setCustomPhone] = useState('+91 9068662279');
  const [inputText, setInputText] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // 1. Fetch Dev Mailbox (Emails)
  const { data: emailData, isLoading: emailsLoading, refetch: refetchEmails } = useQuery({
    queryKey: ['dev-mailbox'],
    queryFn: () => fetchJson<any>('/api/v1/dev/mailbox'),
    refetchInterval: 3000,
  });

  // 2. Fetch WhatsApp Simulator Data (Recent messages & webhooks)
  const { data: waData, isLoading: waLoading, refetch: refetchWhatsApp } = useQuery({
    queryKey: ['dev-whatsapp'],
    queryFn: () => fetchJson<any>('/api/v1/dev/whatsapp'),
    refetchInterval: 2000,
  });

  // 3. Simulate Inbound WhatsApp Mutation
  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      fetchJson<any>('/api/v1/dev/whatsapp/simulate', {
        method: 'POST',
        body: JSON.stringify({
          fromPhone: customPhone.replace(/\D/g, '') || '9068662279',
          text,
        }),
      }),
    onSuccess: () => {
      setInputText('');
      queryClient.invalidateQueries({ queryKey: ['dev-whatsapp'] });
    },
  });

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sendMutation.isPending) return;
    sendMutation.mutate(inputText.trim());
  };

  const quickPrompts = [
    'I have an issue with order ORD-435489',
    'The backpack strap tore off completely',
    'Can I exchange this for a different size?',
    'What is the status of my refund?',
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-emerald-600" />
            Developer Communications Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Test and observe real-time customer channels: Live Meta WhatsApp Cloud API simulator, webhook signatures, and transactional email interception.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            WhatsApp Simulator
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-emerald-700 text-emerald-100 rounded-full">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'email'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 mr-1.5" />
            Email Mailbox
            {emailData?.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-blue-900 text-blue-100 rounded-full">
                {emailData.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'whatsapp' ? (
        <div className="space-y-6">
          {/* Policy Information Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold text-amber-950">
                Meta Business Policy Notice & Live Alternative:
              </strong>
              <p className="text-amber-800">
                Meta requires official corporate verification (business license, tax ID) to unlock real SIM WhatsApp messaging. When Meta blocks personal developer setup, you can test the <strong>identical end-to-end webhook architecture</strong> below. Every simulated message formats the exact Meta Graph API v21.0 JSON payload, posts to the live Azure API webhook endpoint, verifies signatures, records events in Cloud Supabase <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">webhook_inbox</code>, and dispatches the automated Resolution Portal link.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: WhatsApp Smartphone Mockup (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[650px]">
              {/* WhatsApp Phone Header */}
              <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-white text-sm border border-emerald-400">
                    RP
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center">
                      ResolvePay Rescue
                      <ShieldCheck className="w-3.5 h-3.5 ml-1 text-emerald-300" />
                    </div>
                    <div className="text-[10px] text-emerald-200">
                      Official Dispute Assistant • Online
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                    ID: {waData?.phoneNumberId || '1384627974742720'}
                  </span>
                  <button
                    onClick={() => refetchWhatsApp()}
                    className="p-1 hover:bg-emerald-700 rounded transition text-emerald-100"
                    title="Refresh Chat"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body (WhatsApp Doodle Background) */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFEAE2]"
                style={{
                  backgroundImage:
                    'radial-gradient(#d3c9b8 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              >
                {waLoading && (
                  <div className="text-center text-xs text-slate-500 py-4">
                    Loading conversation stream...
                  </div>
                )}

                {waData?.messages?.map((msg: any) => {
                  const isInbound = msg.direction === 'INBOUND';
                  const linkMatch = msg.text.match(/https?:\/\/[^\s]+/);
                  const portalLink = linkMatch ? linkMatch[0] : null;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isInbound ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 text-xs shadow-sm relative space-y-1.5 ${
                          isInbound
                            ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {/* Sender info */}
                        <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-between gap-4">
                          <span>
                            {isInbound
                              ? `You (${msg.phone})`
                              : 'ResolvePay Bot'}
                          </span>
                          <span className="text-[9px]">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Body text */}
                        <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </div>

                        {/* If Bot provided portal link, render interactive button */}
                        {portalLink && (
                          <div className="pt-1.5">
                            <a
                              href={portalLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-emerald-700 text-white rounded text-[11px] font-semibold hover:bg-emerald-800 shadow-sm transition"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Open Customer Resolution Portal
                            </a>
                          </div>
                        )}

                        {/* Delivery receipts */}
                        <div className="flex justify-end items-center pt-0.5">
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Prompts Bar */}
              <div className="p-2 bg-slate-50 border-t border-slate-200 overflow-x-auto whitespace-nowrap space-x-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-1 mr-1">
                  Quick Prompts:
                </span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(prompt);
                    }}
                    className="inline-block text-[11px] bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
              >
                <div className="w-36">
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="Your Phone Number"
                    className="w-full text-xs font-mono px-2 py-2 border border-slate-300 rounded-md bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    title="Simulated customer sender phone"
                  />
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message (e.g. 'I want a refund for my order')..."
                  className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || sendMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-md transition shadow-sm"
                  title="Send WhatsApp Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right Column: Webhook & Cloud Audit Inspector (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Webhook Connection Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                    <Terminal className="w-4 h-4 mr-1.5 text-slate-600" />
                    Live Webhook Health
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified 200 OK
                  </span>
                </div>

                <div className="text-xs space-y-2 text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="font-mono text-slate-700 font-medium truncate max-w-[200px]" title="/api/v1/webhooks/whatsapp">
                      /api/v1/webhooks/whatsapp
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Security:</span>
                    <span className="font-mono text-slate-700">HMAC-SHA256 (Hub Signature)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verify Token:</span>
                    <span className="font-mono text-slate-700">resolvepay_meta_verify_2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Database:</span>
                    <span className="font-mono text-slate-700">Supabase (webhook_inbox)</span>
                  </div>
                </div>
              </div>

              {/* Inbound Webhooks Stream Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Recent Webhook Inbound Logs
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {waData?.recentWebhooks?.length || 0} events
                  </span>
                </div>

                {waData?.recentWebhooks?.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No webhook events recorded yet. Send a message in the simulator to fire one.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[360px] overflow-y-auto divide-y divide-slate-100">
                    {waData?.recentWebhooks?.map((wh: any) => (
                      <div key={wh.id} className="pt-2 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-medium text-slate-800 text-[11px] truncate max-w-[150px]">
                            {wh.eventId}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(wh.receivedAt).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {wh.state}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedEventId(
                                expandedEventId === wh.id ? null : wh.id
                              )
                            }
                            className="text-blue-800 hover:underline text-[10px] font-medium"
                          >
                            {expandedEventId === wh.id
                              ? 'Hide JSON'
                              : 'Inspect JSON'}
                          </button>
                        </div>

                        {expandedEventId === wh.id && (
                          <pre className="p-2 bg-slate-900 text-slate-200 rounded text-[10px] font-mono whitespace-pre-wrap overflow-x-auto max-h-40 mt-1">
                            {JSON.stringify(wh.rawPayload, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Email Mailbox View */
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
      )}
    </div>
  );
}
