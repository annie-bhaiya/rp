'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookOpen,
  DollarSign,
  Lock,
} from 'lucide-react';
import { ResolutionReceipt } from '@resolvepay/contracts';

interface ResolutionReceiptViewProps {
  receipt: ResolutionReceipt | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function ResolutionReceiptView({ receipt, isLoading, onRefresh }: ResolutionReceiptViewProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const downloadJson = () => {
    if (!receipt) return;
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resolution-receipt-${receipt.orderReference}-${receipt.caseId.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center space-y-3">
        <div className="w-6 h-6 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Assembling authoritative resolution receipt...</p>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center space-y-2">
        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-800">No Resolution Receipt Available Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          A resolution receipt is compiled once a case is opened and proposed remedy plans are generated.
        </p>
      </div>
    );
  }

  const {
    caseId,
    orderReference,
    customerName,
    customerEmail,
    complaint,
    aiAttribution,
    policy,
    remedy,
    customerConsent,
    merchantAuthorization,
    providerExecution,
    ledger,
    verification,
  } = receipt;

  const refundDollars = (Number(remedy.refundAmount.minor) / 100).toFixed(2);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Receipt Top Header */}
      <div className="bg-slate-900 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50">
              Audited Resolution Receipt
            </span>
            <span className="text-xs text-slate-400 font-mono">Case: {caseId.slice(0, 8)}</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Order Resolution Audit: {orderReference}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Party: {customerName} ({customerEmail})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {verification.isFullyVerified ? (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              100% Fully Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700/60 shadow-sm">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              {verification.steps.filter((s) => s.status === 'PENDING').length} Pending Check(s)
            </span>
          )}

          <button
            onClick={downloadJson}
            title="Download Audited Receipt JSON"
            className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> JSON
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Section 1: Verification Checklist Trail */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-800" />
            End-to-End Verification Trail
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {verification.steps.map((step, idx) => {
              const isVerified = step.status === 'VERIFIED';
              const isFailed = step.status === 'FAILED';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-md border text-xs flex flex-col justify-between ${
                    isVerified
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                      : isFailed
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-amber-50/60 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-900 text-[11px]">{step.name}</span>
                    {isVerified ? (
                      <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                        <Check className="w-3 h-3 mr-0.5" /> VERIFIED
                      </span>
                    ) : isFailed ? (
                      <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                        <AlertCircle className="w-3 h-3 mr-0.5" /> FAILED
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                        <Clock className="w-3 h-3 mr-0.5" /> PENDING
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">{step.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Complaint & AI Attribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          {/* Complaint Record */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-blue-800" />
              Customer Complaint Ingestion
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Channel: <strong className="text-slate-800 font-mono">{complaint.channel}</strong></span>
                <span>Submitted: <strong className="text-slate-800 font-mono">{complaint.submittedAt.slice(0, 10)}</strong></span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Narrative:</span>
                <p className="text-slate-800 bg-white border border-slate-200 rounded p-2.5 italic">
                  "{complaint.text}"
                </p>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Purchased Order Items:</span>
                <div className="space-y-1">
                  {complaint.affectedItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white px-2.5 py-1.5 border border-slate-200 rounded text-[11px]">
                      <span className="font-medium text-slate-900">{item.title}</span>
                      <span className="font-mono text-slate-600">Qty: {item.quantity} · ${(Number(item.unitPriceMinor) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Attribution */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-blue-800" />
              Advisory AI Source Attribution
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Extraction Source:</span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 text-[11px]">
                  {aiAttribution.extractionSource}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Explanation Source:</span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 text-[11px]">
                  {aiAttribution.explanationSource}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Advisory Case Summary:</span>
                <p className="text-slate-800 bg-white border border-slate-200 rounded p-2 text-[11px]">
                  {aiAttribution.summary}
                </p>
              </div>

              {aiAttribution.missingFacts && aiAttribution.missingFacts.length > 0 && (
                <div>
                  <span className="text-amber-800 font-semibold block mb-0.5">Identified Missing Facts:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[11px]">
                    {aiAttribution.missingFacts.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Policy Grounding & Citations */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              <BookOpen className="w-4 h-4 mr-1.5 text-blue-800" />
              Cited Store Policy Governance
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Policy Version: <strong>v{policy.version}</strong>
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600">
              <div>
                Published By: <strong className="text-slate-900">{policy.publisher}</strong>
              </div>
              <div className="flex items-center space-x-1.5">
                <span>Immutable Hash:</span>
                <code className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-800">
                  {policy.immutableHash}
                </code>
                <button
                  onClick={() => copyToClipboard(policy.immutableHash, 'policy-hash')}
                  className="text-slate-400 hover:text-slate-700"
                  title="Copy immutable policy hash"
                >
                  {copiedHash === 'policy-hash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-500 font-semibold block">Authorizing Policy Clauses:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {policy.citedClauses.map((clause, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-900 text-[11px]">{clause.key}</span>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Binding
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 text-[11px]">{clause.title}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">{clause.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Dual Authorization (Customer Consent & Merchant Approval) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          {/* Customer Consent */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              <Lock className="w-4 h-4 mr-1.5 text-blue-800" />
              Customer Consent Status
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Consent State:</span>
                {customerConsent.status === 'ACCEPTED' ? (
                  <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    <Check className="w-3 h-3 mr-1" /> ACCEPTED
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                    <Clock className="w-3 h-3 mr-1" /> AWAITING_CUSTOMER
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Accepted Timestamp:</span>
                <span className="font-mono text-slate-800">
                  {customerConsent.acceptedAt ? customerConsent.acceptedAt.slice(0, 19).replace('T', ' ') : 'Pending'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Bound Plan Canonical Hash:</span>
                <div className="flex items-center space-x-1.5">
                  <code className="font-mono bg-white px-2 py-1 rounded border border-slate-200 text-[11px] text-slate-800 truncate flex-1">
                    {remedy.canonicalHash}
                  </code>
                  <button
                    onClick={() => copyToClipboard(remedy.canonicalHash, 'plan-hash')}
                    className="text-slate-400 hover:text-slate-700 p-1"
                    title="Copy Canonical Hash"
                  >
                    {copiedHash === 'plan-hash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Authorization */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-800" />
              Merchant Authorization Status
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Authorization State:</span>
                {merchantAuthorization.status === 'AUTHORIZED' ? (
                  <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    <Check className="w-3 h-3 mr-1" /> AUTHORIZED
                  </span>
                ) : merchantAuthorization.status === 'REJECTED' ? (
                  <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                    <AlertCircle className="w-3 h-3 mr-1" /> REJECTED
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono">
                    <Clock className="w-3 h-3 mr-1" /> AWAITING_MERCHANT
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Authorized Timestamp:</span>
                <span className="font-mono text-slate-800">
                  {merchantAuthorization.approvedAt ? merchantAuthorization.approvedAt.slice(0, 19).replace('T', ' ') : 'Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Authorizing Role:</span>
                <span className="font-mono font-medium text-slate-800">
                  {merchantAuthorization.approverRole || 'MERCHANT_APPROVER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Payment Provider (PayPal) Execution */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
            <DollarSign className="w-4 h-4 mr-1.5 text-blue-800" />
            Payment Provider (PayPal) Settlement
          </h3>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Provider Status:</span>
              <span
                className={`font-mono font-bold text-xs inline-flex items-center mt-0.5 ${
                  providerExecution.status === 'COMPLETED'
                    ? 'text-emerald-800'
                    : providerExecution.status === 'UNKNOWN'
                    ? 'text-rose-800'
                    : 'text-amber-800'
                }`}
              >
                {providerExecution.status === 'COMPLETED' && <Check className="w-3 h-3 mr-1" />}
                {providerExecution.status}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Provider Refund ID:</span>
              <span className="font-mono font-semibold text-slate-900 text-xs truncate block mt-0.5">
                {providerExecution.refundId || 'Pending Settlement'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Original Capture ID:</span>
              <span className="font-mono text-slate-700 text-xs truncate block mt-0.5">
                {providerExecution.captureId || 'N/A'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Idempotency Request ID:</span>
              <span className="font-mono text-slate-700 text-xs truncate block mt-0.5">
                {providerExecution.requestId || `resolvepay-refund-${remedy.planId}`}
              </span>
            </div>
          </div>
        </div>

        {/* Section 6: Double-Entry Subledger (The Ledger of Trust) */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-blue-800" />
              Balanced Subledger Journal Postings
            </h3>

            {ledger?.isBalanced && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono">
                <Check className="w-3 h-3 mr-1" /> Balance Invariant Verified: Debits == Credits
              </span>
            )}
          </div>

          {ledger ? (
            <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="font-mono font-semibold text-slate-800">{ledger.businessEventKey}</span>
                <span>Settled: {ledger.occurredAt.slice(0, 19).replace('T', ' ')}</span>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold text-left">
                    <th className="py-2 px-4">Account Code</th>
                    <th className="py-2 px-4 text-right">Debit ({ledger.currency})</th>
                    <th className="py-2 px-4 text-right">Credit ({ledger.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledger.entries.map((entry, idx) => {
                    const debitNum = Number(entry.debitMinor) / 100;
                    const creditNum = Number(entry.creditMinor) / 100;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 px-4 font-mono font-medium text-slate-800">
                          {entry.accountCode}
                        </td>
                        <td className="py-2 px-4 font-mono text-right text-slate-900">
                          {debitNum > 0 ? `$${debitNum.toFixed(2)}` : '—'}
                        </td>
                        <td className="py-2 px-4 font-mono text-right text-slate-900">
                          {creditNum > 0 ? `$${creditNum.toFixed(2)}` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t border-slate-200">
                    <td className="py-2.5 px-4 text-slate-800 font-semibold">Total Journal Balance</td>
                    <td className="py-2.5 px-4 font-mono text-right text-emerald-900">
                      ${(Number(ledger.totalDebitMinor) / 100).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-right text-emerald-900">
                      ${(Number(ledger.totalCreditMinor) / 100).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-center text-xs text-slate-500">
              <Clock className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              Subledger posting will occur automatically upon merchant authorization and PayPal refund settlement.
            </div>
          )}
        </div>

        {/* Raw JSON Debug Expander */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center font-medium"
          >
            {showRawJson ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
            {showRawJson ? 'Hide Raw Audit Payload' : 'View Complete Raw Audit JSON Payload'}
          </button>

          {showRawJson && (
            <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded text-[11px] font-mono overflow-x-auto max-h-72">
              {JSON.stringify(receipt, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

