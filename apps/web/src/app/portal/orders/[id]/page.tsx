'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileText,
  DollarSign,
  Truck,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { fetchJson } from '../../../../lib/api';

export default function OrderDisputePage() {
  const params = useParams();
  const orderId = params.id as string;
  const queryClient = useQueryClient();

  const [complaintText, setComplaintText] = useState(
    'The zipper on my Apex Trail Backpack 40L split open on first use. Can I get a replacement or refund?'
  );
  const [issueType, setIssueType] = useState('damaged');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // 1. Fetch Order
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchJson<any>(`/api/v1/orders/${orderId}`),
  });

  // 2. Fetch Cases for this tenant
  const { data: casesList, refetch: refetchCases } = useQuery({
    queryKey: ['cases'],
    queryFn: () => fetchJson<any[]>('/api/v1/cases'),
  });

  const activeCaseSummary = casesList?.find((c: any) => c.orderId === orderId);

  // 3. Fetch Case Details if active case exists
  const { data: caseDetails, refetch: refetchCaseDetails } = useQuery({
    queryKey: ['case-details', activeCaseSummary?.id],
    queryFn: () => fetchJson<any>(`/api/v1/cases/${activeCaseSummary?.id}`),
    enabled: !!activeCaseSummary?.id,
  });

  // 4. Fetch Timeline
  const { data: timeline } = useQuery({
    queryKey: ['case-timeline', activeCaseSummary?.id],
    queryFn: () => fetchJson<any[]>(`/api/v1/cases/${activeCaseSummary?.id}/timeline`),
    enabled: !!activeCaseSummary?.id,
  });

  // Submit Complaint Mutation
  const createCaseMutation = useMutation({
    mutationFn: () =>
      fetchJson<any>('/api/v1/cases', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          initialMessage: complaintText,
          issueType,
        }),
      }),
    onSuccess: () => {
      refetchCases();
    },
  });

  // Generate Proposals Mutation
  const generateProposalsMutation = useMutation({
    mutationFn: (caseId: string) =>
      fetchJson<any>(`/api/v1/cases/${caseId}/proposals`, {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    onSuccess: () => {
      refetchCaseDetails();
      refetchCases();
    },
  });

  // Accept Plan Mutation
  const acceptPlanMutation = useMutation({
    mutationFn: ({ planId, expectedHash, expectedVersion }: { planId: string; expectedHash: string; expectedVersion: number }) =>
      fetchJson<any>(`/api/v1/plans/${planId}/accept`, {
        method: 'POST',
        body: JSON.stringify({ expectedHash, expectedVersion }),
      }),
    onSuccess: () => {
      refetchCaseDetails();
      refetchCases();
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extraPaymentSuccess, setExtraPaymentSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCaseSummary?.id) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const intent = await fetchJson<any>(`/api/v1/cases/${activeCaseSummary.id}/evidence/upload-intent`, {
        method: 'POST',
        body: JSON.stringify({
          fileName: file.name,
          mediaType: file.type || 'image/jpeg',
          fileSizeBytes: file.size,
          description: `Damage/defect photo: ${file.name}`,
        }),
      });

      await fetchJson<any>(intent.uploadUrl, {
        method: 'POST',
        body: JSON.stringify({
          dataBase64: base64Data,
          mediaType: file.type || 'image/jpeg',
        }),
      });

      refetchCaseDetails();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  if (orderLoading) {
    return <div className="py-12 text-center text-sm text-slate-500">Loading order details...</div>;
  }

  const currentCase = caseDetails?.case;
  const casePlans = caseDetails?.plans || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Order Header Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              {order?.status || 'PAID'}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {order?.orderReference}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Order Resolution: {order?.orderReference}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer: {order?.customerName} ({order?.customerEmail})
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">Total Captured</div>
          <div className="text-lg font-bold font-mono text-slate-900">
            ${(Number(order?.total?.minor || 0) / 100).toFixed(2)} {order?.currency}
          </div>
        </div>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center">
          <Package className="w-4 h-4 mr-2" />
          Purchased Items in this Order
        </h2>

        <div className="divide-y divide-slate-100">
          {order?.items?.map((item: any) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold text-slate-900">{item.title}</span>
                <span className="text-xs text-slate-400 font-mono ml-2">SKU: {item.sku}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-slate-500 mr-3">Qty: {item.quantity}</span>
                <span className="font-medium text-slate-900">${(Number(item.totalPrice.minor) / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Open Complaint Form if No Active Case */}
      {!currentCase && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
            Report an Issue with this Order
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Explain the issue below. ResolvePay will inspect store policy and compute guaranteed resolution options for your review.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              createCaseMutation.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none"
              >
                <option value="damaged">Damaged or Defective Item</option>
                <option value="missing">Missing Item from Package</option>
                <option value="wrong_item">Wrong Item / Color / Size Received</option>
                <option value="cancel">Return for Exchange or Refund</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Description of the Issue
              </label>
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                rows={3}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={createCaseMutation.isPending}
              className="inline-flex items-center px-4 py-2.5 rounded-md text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm disabled:opacity-50 transition"
            >
              {createCaseMutation.isPending ? 'Submitting...' : 'Submit Resolution Request'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Active Case Workspace */}
      {currentCase && (
        <div className="space-y-6">
          {/* Case Status Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Case State</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center space-x-2">
                <span>{currentCase.state}</span>
                <span className="text-xs font-normal text-slate-500 font-mono">({currentCase.issueType})</span>
              </div>
            </div>

            {/* Action to Generate Proposals if not ready */}
            {currentCase.state === 'OPEN' && casePlans.length === 0 && (
              <button
                onClick={() => generateProposalsMutation.mutate(currentCase.id)}
                disabled={generateProposalsMutation.isPending}
                className="inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {generateProposalsMutation.isPending ? 'Evaluating Policies...' : 'Generate AI Grounded Remedies'}
              </button>
            )}
          </div>

          {/* Photo Evidence Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1.5 text-blue-800" />
                  Item Evidence & Defect Photos
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Attach photos showing the damaged zipper, torn seams, or package condition to expedite resolution.
                </p>
              </div>

              <div>
                <label className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer shadow-sm transition">
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  {isUploading ? 'Uploading...' : 'Upload Item Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {uploadError && (
              <div className="p-2.5 mb-3 rounded-md bg-rose-50 text-rose-800 text-xs border border-rose-200">
                {uploadError}
              </div>
            )}

            {caseDetails?.evidence && caseDetails.evidence.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {caseDetails.evidence.map((ev: any) => (
                  <div key={ev.id} className="border border-slate-200 rounded-md p-2 bg-slate-50 flex flex-col justify-between">
                    <div className="aspect-video bg-slate-100 rounded overflow-hidden flex items-center justify-center border border-slate-200">
                      <img
                        src={`/api/v1/cases/${currentCase.id}/evidence/${ev.id}/file`}
                        alt={ev.description || 'Evidence Photo'}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="mt-1.5">
                      <div className="text-[11px] font-semibold text-slate-800 truncate">{ev.description || 'Inspection Photo'}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                        <span className="font-mono text-emerald-800 font-semibold">{ev.validationState}</span>
                        <a
                          href={`/api/v1/cases/${currentCase.id}/evidence/${ev.id}/file`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-800 hover:underline flex items-center font-medium"
                        >
                          View <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-200 rounded-md bg-slate-50/50">
                <ImageIcon className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-500">No photos uploaded yet. Adding photos helps merchants verify item condition immediately.</p>
              </div>
            )}
          </div>

          {/* Remedy Options Grid */}
          {casePlans.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Compare Eligible Remedy Plans</h2>
                  <p className="text-xs text-slate-500">Each plan is policy-grounded with exact financial consequences</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {casePlans.length} Feasible Options
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {casePlans.map((plan: any) => {
                  const isAccepted = plan.customerAccepted;
                  const refundDollars = (Number(plan.refund?.minor || 0) / 100).toFixed(2);
                  const extraDollars = plan.additionalPayment ? (Number(plan.additionalPayment.minor || 0) / 100).toFixed(2) : '0.00';

                  return (
                    <div
                      key={plan.id}
                      className={`bg-white border rounded-lg p-5 flex flex-col justify-between shadow-sm transition ${
                        isAccepted ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {/* Type & Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                            {plan.type}
                          </span>
                          {isAccepted && (
                            <span className="text-xs font-semibold text-emerald-800 flex items-center">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accepted
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{plan.title}</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">{plan.explanation}</p>

                        {/* Breakdown Metrics */}
                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                          {Number(plan.refund?.minor || 0) > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Refund to PayPal:</span>
                              <span className="font-mono font-bold text-emerald-800">${refundDollars} USD</span>
                            </div>
                          )}

                          {plan.additionalPayment && Number(plan.additionalPayment.minor) > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-500">Extra Payment Needed:</span>
                              <span className="font-mono font-bold text-amber-800">${extraDollars} USD</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span className="text-slate-500">Return Required:</span>
                            <span className="font-semibold text-slate-800">
                              {plan.requiresReturn ? 'Yes (Prepaid Label)' : 'No Return Needed'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">Inspection Gate:</span>
                            <span className="font-semibold text-slate-800">
                              {plan.requiresInspection ? 'Merchant Condition Inspection' : 'None'}
                            </span>
                          </div>
                        </div>

                        {/* Policy Citations */}
                        {plan.citations && plan.citations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              Policy Basis
                            </div>
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                              <strong>{plan.citations[0].title}</strong>: {plan.citations[0].excerpt.slice(0, 100)}...
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        {isAccepted ? (
                          <div className="space-y-2">
                            <div className="text-xs text-center text-emerald-800 font-semibold py-1">
                              ✓ Accepted & Awaiting Execution
                            </div>
                            {plan.additionalPayment && Number(plan.additionalPayment.minor) > 0 && !extraPaymentSuccess && (
                              <button
                                onClick={() => setExtraPaymentSuccess(true)}
                                className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md shadow-sm transition"
                              >
                                <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                                Pay ${extraDollars} USD Difference via PayPal
                              </button>
                            )}
                            {extraPaymentSuccess && (
                              <div className="text-[11px] text-center text-emerald-800 font-medium bg-emerald-50 py-1.5 px-2 rounded border border-emerald-200">
                                ✓ Difference payment of ${extraDollars} USD authorized via PayPal
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              acceptPlanMutation.mutate({
                                planId: plan.id,
                                expectedHash: plan.canonicalHash,
                                expectedVersion: plan.version,
                              })
                            }
                            disabled={acceptPlanMutation.isPending}
                            className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-md shadow-sm transition"
                          >
                            Accept this Remedy Plan
                          </button>
                        )}
                        <div className="mt-2 text-center text-[10px] text-slate-400 font-mono truncate">
                          Hash: {plan.canonicalHash}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Unified Timeline */}
          {timeline && timeline.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-6 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Case Audit & Resolution Timeline
              </h2>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timeline.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-800 border-2 border-white ring-2 ring-slate-200" />
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{evt.title}</h4>
                      {evt.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          {evt.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{evt.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

