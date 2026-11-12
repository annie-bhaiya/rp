'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info,
  Sparkles,
} from 'lucide-react';
import { EvidenceCompletenessAssessment } from '@resolvepay/contracts';
import { fetchJson } from '../lib/api';

interface EvidenceCompletenessViewProps {
  caseId: string;
  hasAcceptedPlan?: boolean;
  onAnswersSaved?: () => void;
}

export function EvidenceCompletenessView({
  caseId,
  hasAcceptedPlan = false,
  onAnswersSaved,
}: EvidenceCompletenessViewProps) {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // 1. Fetch Completeness Assessment
  const {
    data: assessment,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['case-completeness', caseId],
    queryFn: () => fetchJson<EvidenceCompletenessAssessment>(`/api/v1/cases/${caseId}/completeness`),
    enabled: !!caseId,
  });

  // 2. Submit Answers Mutation
  const saveAnswersMutation = useMutation({
    mutationFn: () =>
      fetchJson<any>(`/api/v1/cases/${caseId}/completeness/answers`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }),
    onSuccess: (data) => {
      setActionMessage(
        `Clarifications saved! ${data.regeneratedPlansCount} policy-grounded remedy options were refreshed based on your complete evidence.`
      );
      setActionError(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['case-details'] });
      queryClient.invalidateQueries({ queryKey: ['merchant-case-details'] });
      queryClient.invalidateQueries({ queryKey: ['receipt'] });
      if (onAnswersSaved) onAnswersSaved();
    },
    onError: (err: Error) => setActionError(err.message),
  });

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <div className="w-4 h-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
          <span>Auditing evidence completeness against store return policy...</span>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return null;
  }

  const {
    isComplete,
    scorePct,
    summary,
    questions,
    requirementsChecked,
    hasPhotoEvidenceDescription,
    photoEvidenceNote,
    source,
  } = assessment;

  const handleFieldChange = (field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              Proposal 3: Evidence Completeness Assistant
            </span>
            <span className="text-xs text-slate-500 font-mono">Source: {source}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">
            Policy Requirements & Evidence Audit
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {summary}
          </p>
        </div>

        <div>
          {isComplete ? (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
              100% Policy Grounded
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 font-mono shadow-sm">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              {scorePct}% Complete ({questions.length} question needed)
            </span>
          )}
        </div>
      </div>

      {/* Checklist of Policy Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
        {requirementsChecked.map((req, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-md border text-xs flex flex-col justify-between ${
              req.satisfied
                ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                : 'bg-amber-50/50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-900 text-[11px]">{req.title}</span>
              {req.satisfied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              ) : (
                <HelpCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">{req.detail}</p>
          </div>
        ))}
      </div>

      {/* Mandatory Photo Evidence Note (Per Prompt: AI Never Asserts Image Inspection) */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs flex items-start space-x-2 text-slate-600">
        <Info className="w-4 h-4 text-blue-800 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Photo Evidence Policy Boundary:</strong> {photoEvidenceNote}
        </div>
      </div>

      {/* Targeted Questions Form if Incomplete and plan not yet accepted */}
      {!isComplete && !hasAcceptedPlan && questions.length > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveAnswersMutation.mutate();
          }}
          className="space-y-3 pt-2 border-t border-slate-100"
        >
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Targeted Follow-up Questions (Required by Policy):
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-1.5">
                <label htmlFor={q.field} className="block text-xs font-semibold text-slate-900">
                  {q.question}
                </label>

                {q.options && q.options.length > 0 ? (
                  <select
                    id={q.field}
                    value={answers[q.field] || ''}
                    onChange={(e) => handleFieldChange(q.field, e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">{q.placeholder || 'Select an option...'}</option>
                    {q.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    id={q.field}
                    placeholder={q.placeholder}
                    value={answers[q.field] || ''}
                    onChange={(e) => handleFieldChange(q.field, e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                  </input>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-500">
              Saving answers updates case context and regenerates only unaccepted remedy proposals.
            </p>
            <button
              type="submit"
              disabled={saveAnswersMutation.isPending}
              className="inline-flex items-center px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
            >
              {saveAnswersMutation.isPending ? 'Updating Proposals...' : 'Save Answers & Refresh Proposals'}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </form>
      )}

      {/* Success Notification */}
      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:text-emerald-950 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Error Notification */}
      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-950 font-bold ml-2">✕</button>
        </div>
      )}
    </div>
  );
}

