'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ShieldAlert,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { fetchJson } from '../lib/api';

interface RecoverySimulatorProps {
  caseId?: string;
  stepId?: string;
  planId?: string;
  stepState?: string;
  operationId?: string;
  onReconciled?: () => void;
}

export function RecoverySimulator({
  caseId,
  stepId,
  planId,
  stepState,
  operationId,
  onReconciled,
}: RecoverySimulatorProps) {
  const queryClient = useQueryClient();
  const [simulationStatusMessage, setSimulationStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch failure injection status
  const { data: failureStatus, refetch: refetchFailureStatus } = useQuery({
    queryKey: ['failure-injection-status'],
    queryFn: () => fetchJson<{ activeSimulation: string; triggerCount: number }>('/api/v1/dev/failure-injection'),
    refetchInterval: 5000,
  });

  const isArmed = failureStatus?.activeSimulation === 'REFUND_TIMEOUT_SIMULATION';

  // Arm/Disarm mutation
  const toggleFailureMutation = useMutation({
    mutationFn: (enable: boolean) =>
      fetchJson<any>('/api/v1/dev/failure-injection', {
        method: 'POST',
        body: JSON.stringify({
          type: enable ? 'REFUND_TIMEOUT_SIMULATION' : 'NONE',
          enabled: enable,
        }),
      }),
    onSuccess: (data) => {
      refetchFailureStatus();
      if (data.activeSimulation === 'REFUND_TIMEOUT_SIMULATION') {
        setSimulationStatusMessage('Sandbox Failure Armed: The next refund call will dispatch to PayPal with PayPal-Request-Id, but drop the network response, entering an UNKNOWN in-flight state.');
      } else {
        setSimulationStatusMessage('Sandbox Failure Disarmed: Refunds will execute normally.');
      }
      setErrorMessage(null);
    },
    onError: (err: Error) => setErrorMessage(err.message),
  });

  // Reconcile Step Mutation
  const reconcileMutation = useMutation({
    mutationFn: (targetStepId: string) =>
      fetchJson<any>(`/api/v1/merchant/recovery/${targetStepId}/reconcile`, {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    onSuccess: (data) => {
      setSimulationStatusMessage(data.message || 'Operation reconciled with PayPal! Subledger journal posted without duplicate entries.');
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ['merchant-cases'] });
      queryClient.invalidateQueries({ queryKey: ['recovery-queue'] });
      queryClient.invalidateQueries({ queryKey: ['merchant-case-details'] });
      queryClient.invalidateQueries({ queryKey: ['case-details'] });
      queryClient.invalidateQueries({ queryKey: ['receipt'] });
      if (onReconciled) onReconciled();
    },
    onError: (err: Error) => setErrorMessage(err.message),
  });

  // Test Blind Repeat Execution Mutation (to demonstrate duplicate prevention)
  const repeatExecuteMutation = useMutation({
    mutationFn: (targetPlanId: string) =>
      fetchJson<any>(`/api/v1/plans/${targetPlanId}/execute`, {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    onSuccess: (data) => {
      if (data.alreadyCompleted) {
        setSimulationStatusMessage('Idempotency Guard Active: Repeated click detected completed refund. No duplicate payment was sent and no duplicate ledger entry was posted.');
      } else {
        setSimulationStatusMessage('Execution processed.');
      }
      setErrorMessage(null);
    },
    onError: (err: Error) => {
      setErrorMessage(`Guard Active: ${err.message}`);
    },
  });

  const isUnknownState = stepState === 'UNKNOWN';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              Proposal 2: Recovery Demonstration
            </span>
            <span className="text-xs text-slate-500 font-mono">Sandbox Failure Simulator</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1">
            PayPal Timeout & Exactly-Once Reconcile Test
          </h3>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
            Simulates a lost HTTP response after PayPal receives a refund request. Tests visible pending state, prevents repeated duplicate disbursements, and recovers the balanced ledger entry via authoritative reconciliation.
          </p>
        </div>

        <div>
          {isArmed ? (
            <button
              onClick={() => toggleFailureMutation.mutate(false)}
              disabled={toggleFailureMutation.isPending}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300 shadow-sm transition"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 text-rose-600 animate-pulse" />
              Disarm Timeout Simulator
            </button>
          ) : (
            <button
              onClick={() => toggleFailureMutation.mutate(true)}
              disabled={toggleFailureMutation.isPending}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 shadow-sm transition"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Arm Timeout on Next Refund
            </button>
          )}
        </div>
      </div>

      {/* Simulator Status Banner */}
      {isArmed && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Failure Simulation Armed:</strong> The next refund executed will dispatch with{' '}
            <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200">
              PayPal-Request-Id: resolvepay-refund-...
            </code>
            , sever the connection, and mark the step as <strong className="font-mono">UNKNOWN</strong> to demonstrate crash recovery.
          </div>
        </div>
      )}

      {/* Visible UNKNOWN in-flight state banner */}
      {isUnknownState && (
        <div className="p-4 bg-sky-50 border border-sky-300 rounded-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wider font-mono flex items-center">
                <Clock className="w-4 h-4 mr-1 text-sky-700 animate-spin" />
                Visible Pending State: UNKNOWN IN-FLIGHT
              </span>
            </div>
            <span className="text-[11px] font-mono text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
              HTTP 504 Simulated
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            PayPal received the refund request with idempotency key{' '}
            <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-950 font-semibold">
              {operationId || `resolvepay-refund-${planId}`}
            </code>
            , but the client connection was lost before confirmation. The ledger transaction has NOT been posted yet to avoid duplicate balance corruption.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            {stepId && (
              <button
                onClick={() => reconcileMutation.mutate(stepId)}
                disabled={reconcileMutation.isPending}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-800 hover:bg-blue-700 shadow-sm transition"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                {reconcileMutation.isPending ? 'Reconciling with PayPal...' : 'Reconcile Authoritative State'}
              </button>
            )}

            {planId && (
              <button
                onClick={() => repeatExecuteMutation.mutate(planId)}
                disabled={repeatExecuteMutation.isPending}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                Test Repeated Execute (Check Guard)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {simulationStatusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <span>{simulationStatusMessage}</span>
          </div>
          <button onClick={() => setSimulationStatusMessage(null)} className="text-emerald-700 hover:text-emerald-950 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-900 flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-700 hover:text-rose-950 font-bold ml-2">✕</button>
        </div>
      )}
    </div>
  );
}

