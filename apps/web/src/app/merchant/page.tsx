'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Inbox,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  FileCheck,
  RefreshCw,
  Clock,
  Eye,
  Sliders,
  BarChart3,
  FileDown,
  Image as ImageIcon,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { fetchJson } from '../../lib/api';

export default function MerchantOperationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'inbox' | 'insights' | 'recovery' | 'policies'>('inbox');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [inspectionResult, setInspectionResult] = useState<'PASSED' | 'FAILED'>('PASSED');
  const [inspectionNotes, setInspectionNotes] = useState('Physical item inspected: defective split zipper confirmed. Eligible for warranty remedy.');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    async function ensureMerchantSession() {
      try {
        const session = await fetchJson<any>('/api/v1/auth/session');
        if (session && session.actorType === 'MERCHANT') {
          setSessionReady(true);
          return;
        }
      } catch {
        // no session
      }

      try {
        await fetchJson<any>('/api/v1/auth/login-dev', {
          method: 'POST',
          body: JSON.stringify({ persona: 'OWNER', tenantSlug: 'default-merchant' }),
        });
      } catch (err) {
        console.warn('Could not auto-login merchant owner:', err);
      } finally {
        setSessionReady(true);
      }
    }

    ensureMerchantSession();
  }, []);

  // 1. Fetch Cases
  const { data: casesList, refetch: refetchCases } = useQuery({
    queryKey: ['merchant-cases'],
    queryFn: () => fetchJson<any[]>('/api/v1/cases'),
    enabled: sessionReady,
  });

  // 2. Fetch Selected Case Details
  const { data: caseDetails, refetch: refetchDetails } = useQuery({
    queryKey: ['merchant-case-details', selectedCaseId],
    queryFn: () => fetchJson<any>(`/api/v1/cases/${selectedCaseId}`),
    enabled: sessionReady && !!selectedCaseId,
  });

  // 3. Fetch Recovery Queue
  const { data: recoveryQueue, refetch: refetchRecovery } = useQuery({
    queryKey: ['recovery-queue'],
    queryFn: () => fetchJson<any[]>('/api/v1/merchant/recovery'),
    enabled: sessionReady && activeTab === 'recovery',
  });

  // 4. Fetch Policies
  const { data: policies, refetch: refetchPolicies } = useQuery({
    queryKey: ['merchant-policies'],
    queryFn: () => fetchJson<any[]>('/api/v1/merchant/policies'),
    enabled: sessionReady && activeTab === 'policies',
  });

  // 5. Fetch Insights
  const { data: insights, refetch: refetchInsights } = useQuery({
    queryKey: ['merchant-insights'],
    queryFn: () => fetchJson<any>('/api/v1/merchant/insights'),
    enabled: sessionReady && activeTab === 'insights',
  });

  // Merchant Approve Mutation
  const approveMutation = useMutation({
    mutationFn: ({ planId, expectedHash }: { planId: string; expectedHash: string }) =>
      fetchJson<any>(`/api/v1/plans/${planId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ expectedHash }),
      }),
    onSuccess: () => {
      setActionMessage('Plan authorized by merchant approver.');
      refetchDetails();
      refetchCases();
    },
    onError: (err: Error) => setActionError(err.message),
  });

  // Record Inspection Mutation
  const inspectMutation = useMutation({
    mutationFn: (returnId: string) =>
      fetchJson<any>(`/api/v1/returns/${returnId}/inspection`, {
        method: 'POST',
        body: JSON.stringify({ result: inspectionResult, notes: inspectionNotes }),
      }),
    onSuccess: () => {
      setActionMessage('Inspection record saved.');
      refetchDetails();
    },
    onError: (err: Error) => setActionError(err.message),
  });

  // Execute Resolution Saga Mutation
  const executeMutation = useMutation({
    mutationFn: (planId: string) =>
      fetchJson<any>(`/api/v1/plans/${planId}/execute`, {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    onSuccess: (data) => {
      setActionMessage(`Resolution completed! Refund: ${data.refund ? '$' + (Number(data.refund.amount.minor)/100).toFixed(2) : 'N/A'}. Replacement: ${data.replacementDispatched ? 'Dispatched' : 'No'}.`);
      refetchDetails();
      refetchCases();
    },
    onError: (err: Error) => setActionError(err.message),
  });

  // Reconcile Step Mutation
  const reconcileMutation = useMutation({
    mutationFn: (stepId: string) =>
      fetchJson<any>(`/api/v1/merchant/recovery/${stepId}/reconcile`, {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    onSuccess: () => {
      setActionMessage('Step reconciled with authoritative provider state.');
      refetchRecovery();
    },
    onError: (err: Error) => setActionError(err.message),
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Merchant Operations Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Store Owner & Approver Controls: Financial Authorizations, Physical Inspection, & Saga Recovery
          </p>
        </div>

        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-l-md border border-slate-300 flex items-center ${
              activeTab === 'inbox' ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 mr-1.5" />
            Case Inbox
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 text-xs font-semibold border-t border-b border-r border-slate-300 flex items-center ${
              activeTab === 'insights' ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Insights & Metrics
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1.5 text-xs font-semibold border-t border-b border-r border-slate-300 flex items-center ${
              activeTab === 'recovery' ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Recovery Queue
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-r-md border-t border-b border-r border-slate-300 flex items-center ${
              activeTab === 'policies' ? 'bg-blue-800 text-white border-blue-800' : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5" />
            Policy Manager
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-md text-xs font-semibold text-emerald-900 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:text-emerald-950 font-bold ml-4">✕</button>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-md text-xs font-semibold text-red-900 flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-red-700 hover:text-red-950 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Tab 1: Case Inbox */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Cases List */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Incoming Disputes</h2>
              <button onClick={() => refetchCases()} className="text-xs text-blue-800 hover:underline flex items-center">
                <RefreshCw className="w-3 h-3 mr-1" /> Refresh
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {casesList?.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No cases found.</div>
              ) : (
                casesList?.map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      setActionMessage(null);
                      setActionError(null);
                    }}
                    className={`py-3 px-3 rounded-md cursor-pointer transition ${
                      selectedCaseId === c.id ? 'bg-blue-50 ring-1 ring-blue-700/30' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">{c.orderReference}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {c.state}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{c.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Case Investigation & Action Center */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedCaseId ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-sm shadow-sm">
                Select a case from the inbox to investigate evidence and authorize remedies.
              </div>
            ) : (
              caseDetails && (
                <div className="space-y-6">
                  {/* Case Context Header */}
                  <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          Case Investigation: {caseDetails.order?.orderReference}
                        </h2>
                        <span className="text-xs text-slate-500 font-mono">
                          Customer: {caseDetails.order?.customerName} ({caseDetails.order?.customerEmail})
                        </span>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                        {caseDetails.case.state}
                      </span>
                    </div>

                    {/* Messages Thread */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-md border border-slate-200 max-h-56 overflow-y-auto">
                      {caseDetails.messages?.map((m: any) => (
                        <div key={m.id} className="text-xs">
                          <span className="font-bold text-slate-800">
                            {m.senderRole === 'CUSTOMER' ? 'Customer' : 'Store Rep'}:
                          </span>{' '}
                          <span className="text-slate-700">{m.body}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Evidence Photos */}
                  {caseDetails.evidence && caseDetails.evidence.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2 text-blue-800" />
                        Customer Photo Evidence
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Inspect submitted images of damage/defects to verify policy compliance before authorizing refund or dispatch.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {caseDetails.evidence.map((ev: any) => (
                          <div key={ev.id} className="border border-slate-200 rounded-md p-2 bg-slate-50">
                            <div className="aspect-video bg-slate-200 rounded overflow-hidden flex items-center justify-center border border-slate-200">
                              <img
                                src={`/api/v1/cases/${caseDetails.case.id}/evidence/${ev.id}/file`}
                                alt={ev.description || 'Defect Evidence'}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="mt-2">
                              <div className="text-[11px] font-semibold text-slate-800 truncate">{ev.description || 'Item Photo'}</div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                                <span className="font-mono text-emerald-800 font-semibold">{ev.validationState}</span>
                                <a
                                  href={`/api/v1/cases/${caseDetails.case.id}/evidence/${ev.id}/file`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-800 hover:underline flex items-center font-medium"
                                >
                                  Inspect <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Return Inspection Gate Recorder */}
                  {caseDetails.returnRecord && (
                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center">
                        <FileCheck className="w-4 h-4 mr-2 text-blue-800" />
                        Physical Return Inspection Gate
                      </h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Carrier: {caseDetails.returnRecord.carrier} | Tracking: <span className="font-mono">{caseDetails.returnRecord.trackingReference}</span>
                      </p>

                      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
                        <div className="flex items-center space-x-6 text-xs">
                          <span className="font-semibold text-slate-700">Inspection Verdict:</span>
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="verdict"
                              checked={inspectionResult === 'PASSED'}
                              onChange={() => setInspectionResult('PASSED')}
                            />
                            <span className="text-emerald-800 font-semibold">Passed (Condition Validated)</span>
                          </label>
                          <label className="flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="verdict"
                              checked={inspectionResult === 'FAILED'}
                              onChange={() => setInspectionResult('FAILED')}
                            />
                            <span className="text-red-800 font-semibold">Failed (Unacceptable Condition)</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Inspector Verification Notes
                          </label>
                          <textarea
                            value={inspectionNotes}
                            onChange={(e) => setInspectionNotes(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => inspectMutation.mutate(caseDetails.returnRecord.id)}
                          disabled={inspectMutation.isPending}
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-md shadow-sm transition"
                        >
                          Record Official Inspection Result
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Active Remedy Plans & Financial Execution */}
                  <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-blue-800" />
                      Remedy Authorization & Execution
                    </h3>

                    {caseDetails.plans?.map((plan: any) => {
                      const canApprove = !plan.merchantApproved;
                      const canExecute = plan.customerAccepted && plan.merchantApproved && plan.state !== 'COMPLETED';

                      return (
                        <div key={plan.id} className="p-4 border border-slate-200 rounded-md space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-slate-900">{plan.title}</h4>
                            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {plan.state}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600">{plan.explanation}</p>

                          <div className="text-[11px] text-slate-500 font-mono">
                            Customer Accepted: {plan.customerAccepted ? 'YES' : 'NO'} | Merchant Approved: {plan.merchantApproved ? 'YES' : 'NO'}
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            {canApprove && (
                              <button
                                onClick={() => approveMutation.mutate({ planId: plan.id, expectedHash: plan.canonicalHash })}
                                disabled={approveMutation.isPending}
                                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 shadow-sm transition"
                              >
                                Authorize Financial Plan
                              </button>
                            )}

                            {canExecute && (
                              <button
                                onClick={() => executeMutation.mutate(plan.id)}
                                disabled={executeMutation.isPending}
                                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm flex items-center transition"
                              >
                                <Play className="w-3.5 h-3.5 mr-1.5" />
                                Execute Resolution Saga
                              </button>
                            )}

                            {plan.state === 'COMPLETED' && (
                              <span className="text-xs font-semibold text-emerald-800 flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-1" /> Remedy Successfully Settled & Reconciled
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Operations & Intelligence Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Top Bar with Reconciliation CSV Export */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Operations & Dispute Intelligence</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time dispute frequency, defect risk by product denominator, and subledger reconciliation
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => refetchInsights()}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md shadow-sm flex items-center transition"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refresh
              </button>
              <a
                href="/api/v1/merchant/reconciliation/export.csv"
                download
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-md shadow-sm flex items-center transition"
              >
                <FileDown className="w-3.5 h-3.5 mr-1.5" />
                Export Subledger (CSV)
              </a>
            </div>
          </div>

          {/* 4 Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispute Rate</div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {insights?.summary?.disputeRatePct ?? '0.0'}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {insights?.summary?.totalCases ?? 0} disputes / {insights?.summary?.totalOrders ?? 0} total orders
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active vs Resolved</div>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                {insights?.summary?.activeCases ?? 0} <span className="text-xs font-normal text-slate-400">active</span> / {insights?.summary?.resolvedCases ?? 0} <span className="text-xs font-normal text-slate-400">resolved</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                {insights?.summary?.resolvedCases ? Math.round((insights.summary.resolvedCases / (insights.summary.totalCases || 1)) * 100) : 100}% resolution rate
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Refund Volume</div>
              <div className="text-2xl font-bold font-mono text-emerald-800 mt-1">
                ${(Number(insights?.summary?.totalRefundMinor ?? '0') / 100).toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Disbursed back to original PayPal accounts</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Replacements Sent</div>
              <div className="text-2xl font-bold font-mono text-blue-900 mt-1">
                {insights?.summary?.totalReplacementsDispatched ?? 0} <span className="text-xs font-normal text-slate-500">units</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Retained customer lifetime value</div>
            </div>
          </div>

          {/* Issue & Remedy Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
                Dispute Issue Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(insights?.issueBreakdown ?? {}).map(([issue, count]: [string, any]) => {
                  const total = insights?.summary?.totalCases || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={issue} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700 capitalize">{issue.replace('_', ' ')}</span>
                        <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-800" />
                Adopted Remedy Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(insights?.remedyBreakdown ?? {}).map(([rem, count]: [string, any]) => {
                  const total = Object.values(insights?.remedyBreakdown ?? {}).reduce((a: number, b: any) => a + Number(b), 0) || 1;
                  const pct = Math.round((count / (total as number)) * 100);
                  return (
                    <div key={rem} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{rem.replace('_', ' ')}</span>
                        <span className="font-mono text-slate-500">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-800 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product-Level Complaint Frequency with Denominators */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-800" />
                Product Risk & Defect Rate by SKU
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated against complete order shipment denominators to identify recurring manufacturer defects.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3 text-right">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Complaints</th>
                    <th className="py-2.5 px-3 text-right">Dispute Rate</th>
                    <th className="py-2.5 px-3">Top Defect Issue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {insights?.productInsights?.map((p: any) => (
                    <tr key={p.sku} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.sku}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{p.title}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-600">{p.totalOrders}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">{p.complaintCount}</td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          p.complaintRatePct > 15 ? 'bg-rose-50 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.complaintRatePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {p.topIssue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Recovery Queue */}
      {activeTab === 'recovery' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Operator Recovery Queue</h2>
              <p className="text-xs text-slate-500">
                Stale or UNKNOWN operations awaiting authoritative provider reconciliation without duplicate financial key generation.
              </p>
            </div>
            <button onClick={() => refetchRecovery()} className="text-xs text-blue-800 hover:underline flex items-center">
              <RefreshCw className="w-3 h-3 mr-1" /> Refresh Queue
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recoveryQueue?.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Recovery queue is clear. No UNKNOWN or failed financial operations detected.
              </div>
            ) : (
              recoveryQueue?.map((step: any) => (
                <div key={step.stepId} className="py-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{step.stepKey}</span>
                    <span className="text-slate-400 font-mono ml-2">ID: {step.stepId}</span>
                    <div className="text-slate-500 mt-0.5">Attempt: {step.attempt} | State: {step.state}</div>
                  </div>

                  <button
                    onClick={() => reconcileMutation.mutate(step.stepId)}
                    disabled={reconcileMutation.isPending}
                    className="px-3 py-1.5 bg-blue-800 text-white rounded text-xs font-semibold hover:bg-blue-700 shadow-sm transition"
                  >
                    Reconcile Authoritative State
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Policy Manager */}
      {activeTab === 'policies' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Published Policy Clauses</h2>
            <p className="text-xs text-slate-500">
              Immutable store policy versions governing deterministic remedy calculations.
            </p>
          </div>

          <div className="space-y-4">
            {policies?.map((ver: any) => (
              <div key={ver.id} className="p-5 border border-slate-200 rounded-md bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">
                    Policy Version {ver.version} (Published by {ver.publisher})
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Hash: {ver.immutableHash}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {ver.clauses?.map((c: any) => (
                    <div key={c.id} className="p-3 bg-white border border-slate-200 rounded text-xs">
                      <div className="font-bold text-slate-800">{c.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mb-1">Key: {c.key}</div>
                      <p className="text-slate-600 leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
