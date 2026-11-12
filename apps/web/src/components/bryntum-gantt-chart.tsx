'use client';

import React, { useRef, useState, useMemo } from 'react';
import { BryntumGantt, BryntumGanttProjectModel } from '@bryntum/gantt-react-enterprise';
import type { BryntumGanttProps, BryntumGanttProjectModelProps } from '@bryntum/gantt-react-enterprise';
import { Calendar, ShieldCheck, Truck, CheckCircle2, AlertCircle, ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';

// Bryntum 8.0 Enterprise License Key Registration
// TODO: bryntum.licenseKey = '...'
declare const bryntum: { licenseKey?: string };
if (typeof window !== 'undefined') {
  (window as any).bryntum = (window as any).bryntum || {};
  if (process.env.NEXT_PUBLIC_BRYNTUM_LICENSE_KEY) {
    (window as any).bryntum.licenseKey = process.env.NEXT_PUBLIC_BRYNTUM_LICENSE_KEY;
  }
}

export interface DisputeGanttViewProps {
  cases?: any[];
  selectedCaseId?: string | null;
  onSelectCase?: (caseId: string) => void;
}

export default function DisputeGanttView({
  cases = [],
  selectedCaseId,
  onSelectCase,
}: DisputeGanttViewProps) {
  const ganttRef = useRef<BryntumGantt>(null);
  const projectRef = useRef<BryntumGanttProjectModel>(null);

  // Filter state for dispute milestones
  const [filterMode, setFilterMode] = useState<'all' | 'inspection' | 'replacement'>('all');

  // Build Project Data: tasks, dependencies, resources, and assignments
  const projectProps = useMemo<BryntumGanttProjectModelProps>(() => {
    const resources = [
      { id: 'res-buyer', name: 'Alex Rivera (Buyer)', role: 'Customer / Claim Initiator' },
      { id: 'res-gemini', name: 'Gemini AI Engine', role: 'Diagnostic Intelligence' },
      { id: 'res-fedex', name: 'FedEx Ground Logistics', role: 'Courier Transit' },
      { id: 'res-qa', name: 'Warehouse QA Station 4', role: 'Physical Inspection Gate' },
      { id: 'res-finops', name: 'Merchant FinOps', role: 'Subledger Settlement Officer' },
    ];

    // Seed tasks reflecting the Ledger of Trust architecture
    const baseTasks = [
      {
        id: 'case-ord-9041',
        name: 'Case #CAS-2026-9041 — Split Seam Waterproof Shell (ORD-2026-9041)',
        expanded: true,
        percentDone: 70,
        children: [
          {
            id: 't-9041-1',
            name: 'Dispute Intake & Customer Narrative',
            startDate: '2026-11-03T08:00:00',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-file-lines',
          },
          {
            id: 't-9041-2',
            name: 'Evidence Completeness & Diagnostic Questionnaire',
            duration: 2,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-camera',
          },
          {
            id: 't-9041-3',
            name: 'Gemini AI Resolution Brief & Invariant Evaluation',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-brain',
          },
          {
            id: 't-9041-4',
            name: 'Remedy Proposal: Replacement Before Refund',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-tags',
          },
          {
            id: 't-9041-5',
            name: 'Customer Acceptance & SHA-256 Hash Binding',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-signature',
          },
          {
            id: 't-9041-6',
            name: 'Prepaid Return Waybill & Carrier In-Transit',
            duration: 3,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-truck',
          },
          {
            id: 't-9041-7',
            name: 'Warehouse Receipt & Physical Inspection Gate',
            duration: 1,
            durationUnit: 'd',
            percentDone: 25,
            iconCls: 'b-fa b-fa-clipboard-check',
          },
          {
            id: 't-9041-8',
            name: 'Replacement Item Fulfillment Dispatch',
            duration: 2,
            durationUnit: 'd',
            percentDone: 0,
            iconCls: 'b-fa b-fa-box-open',
          },
          {
            id: 't-9041-9',
            name: 'Double-Entry Subledger Clearing & Canonical Receipt',
            duration: 1,
            durationUnit: 'd',
            percentDone: 0,
            iconCls: 'b-fa b-fa-receipt',
          },
        ],
      },
      {
        id: 'case-ord-9042',
        name: 'Case #CAS-2026-9042 — Backlight Failure Exchange (ORD-2026-9042)',
        expanded: true,
        percentDone: 50,
        children: [
          {
            id: 't-9042-1',
            name: 'Hardware Defect Intake & Video Evidence',
            startDate: '2026-11-06T09:00:00',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-video',
          },
          {
            id: 't-9042-2',
            name: 'AI Evidence Verification (Serial Match)',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-microchip',
          },
          {
            id: 't-9042-3',
            name: 'Alternative Catalog Exchange Proposed',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-arrows-rotate',
          },
          {
            id: 't-9042-4',
            name: 'Customer Selected Wireless Upgrade (+$20 Capture)',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-credit-card',
          },
          {
            id: 't-9042-5',
            name: 'Advanced Replacement Dispatched Prior to Return',
            duration: 2,
            durationUnit: 'd',
            percentDone: 40,
            iconCls: 'b-fa b-fa-plane',
          },
          {
            id: 't-9042-6',
            name: 'Defective Core Return & Merchant Re-stocking Gate',
            duration: 3,
            durationUnit: 'd',
            percentDone: 0,
            iconCls: 'b-fa b-fa-warehouse',
          },
        ],
      },
      {
        id: 'case-ord-9043',
        name: 'Case #CAS-2026-9043 — Minor Hemming Imperfection ($15 Item)',
        expanded: false,
        percentDone: 100,
        children: [
          {
            id: 't-9043-1',
            name: 'Low-Value Issue Report & Photo Attachment',
            startDate: '2026-11-08T10:00:00',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-camera',
          },
          {
            id: 't-9043-2',
            name: 'Automated Goodwill Store Credit Evaluated',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-gift',
          },
          {
            id: 't-9043-3',
            name: 'Instant Store Credit Credited (Zero Return Required)',
            duration: 1,
            durationUnit: 'd',
            percentDone: 100,
            iconCls: 'b-fa b-fa-circle-check',
          },
        ],
      },
    ];

    // Filter tasks based on selected mode
    let tasks = baseTasks;
    if (filterMode === 'inspection') {
      tasks = baseTasks.filter((t) => t.id === 'case-ord-9041');
    } else if (filterMode === 'replacement') {
      tasks = baseTasks.filter((t) => t.id === 'case-ord-9042');
    }

    // Dependencies chaining tasks within each dispute
    const dependencies = [
      // Case 9041 Chain
      { id: 'dep-1', fromTask: 't-9041-1', toTask: 't-9041-2', type: 2 },
      { id: 'dep-2', fromTask: 't-9041-2', toTask: 't-9041-3', type: 2 },
      { id: 'dep-3', fromTask: 't-9041-3', toTask: 't-9041-4', type: 2 },
      { id: 'dep-4', fromTask: 't-9041-4', toTask: 't-9041-5', type: 2 },
      { id: 'dep-5', fromTask: 't-9041-5', toTask: 't-9041-6', type: 2 },
      { id: 'dep-6', fromTask: 't-9041-6', toTask: 't-9041-7', type: 2 },
      { id: 'dep-7', fromTask: 't-9041-7', toTask: 't-9041-8', type: 2 },
      { id: 'dep-8', fromTask: 't-9041-8', toTask: 't-9041-9', type: 2 },

      // Case 9042 Chain
      { id: 'dep-9', fromTask: 't-9042-1', toTask: 't-9042-2', type: 2 },
      { id: 'dep-10', fromTask: 't-9042-2', toTask: 't-9042-3', type: 2 },
      { id: 'dep-11', fromTask: 't-9042-3', toTask: 't-9042-4', type: 2 },
      { id: 'dep-12', fromTask: 't-9042-4', toTask: 't-9042-5', type: 2 },
      { id: 'dep-13', fromTask: 't-9042-5', toTask: 't-9042-6', type: 2 },

      // Case 9043 Chain
      { id: 'dep-14', fromTask: 't-9043-1', toTask: 't-9043-2', type: 2 },
      { id: 'dep-15', fromTask: 't-9043-2', toTask: 't-9043-3', type: 2 },
    ];

    // Resource assignments
    const assignments = [
      { id: 'as-1', event: 't-9041-1', resource: 'res-buyer' },
      { id: 'as-2', event: 't-9041-2', resource: 'res-buyer' },
      { id: 'as-3', event: 't-9041-3', resource: 'res-gemini' },
      { id: 'as-4', event: 't-9041-6', resource: 'res-fedex' },
      { id: 'as-5', event: 't-9041-7', resource: 'res-qa' },
      { id: 'as-6', event: 't-9041-9', resource: 'res-finops' },

      { id: 'as-7', event: 't-9042-2', resource: 'res-gemini' },
      { id: 'as-8', event: 't-9042-4', resource: 'res-buyer' },
      { id: 'as-9', event: 't-9042-5', resource: 'res-fedex' },
      { id: 'as-10', event: 't-9042-6', resource: 'res-qa' },

      { id: 'as-11', event: 't-9043-2', resource: 'res-gemini' },
      { id: 'as-12', event: 't-9043-3', resource: 'res-finops' },
    ];

    return {
      tasks,
      dependencies,
      resources,
      assignments,
      startDate: new Date('2026-11-01'),
    };
  }, [filterMode]);

  // Gantt Component configuration
  const ganttProps = useMemo<BryntumGanttProps>(() => {
    return {
      columns: [
        { type: 'name', field: 'name', width: 340, text: 'Dispute Operation / Milestone' },
        { type: 'percent', field: 'percentDone', width: 95, text: 'Progress' },
        { type: 'duration', width: 85, text: 'Duration' },
        { type: 'startdate', width: 110, text: 'Start' },
        { type: 'enddate', width: 110, text: 'Target' },
        { type: 'resourceassignment', width: 170, text: 'Assigned Stakeholder' },
      ],
      viewPreset: 'weekAndDayLetter',
      barMargin: 5,
      rowHeight: 44,
      headerHeight: 48,
      subGridConfigs: {
        locked: { width: 450 },
      },
      // Features
      taskTooltipFeature: true,
      dependenciesFeature: true,
      projectLinesFeature: true,
      criticalPathsFeature: true,
      taskEditFeature: true,
      filterFeature: true,
      searchFeature: true,
      stripeFeature: true,
      onTaskClick: ({ taskRecord }: any) => {
        if (taskRecord?.id && onSelectCase) {
          // If a case root is clicked, notify selection
          const caseId = taskRecord.id.startsWith('case-ord-') ? taskRecord.id.replace('case-', '') : null;
          if (caseId) onSelectCase(caseId);
        }
      },
    };
  }, [onSelectCase]);

  // Toolbar Actions
  const handleZoomIn = () => {
    ganttRef.current?.instance?.zoomIn();
  };

  const handleZoomOut = () => {
    ganttRef.current?.instance?.zoomOut();
  };

  const handleZoomToFit = () => {
    ganttRef.current?.instance?.zoomToFit({ leftMargin: 50, rightMargin: 50 });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* Top Header / Control Toolbar */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">Dispute Operations & Remedy Lifecycle (Bryntum Gantt)</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Enterprise 8.0.1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time interactive scheduling engine for case evidence intake, courier tracking, inspection gates, and subledger settlement.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter Segment */}
          <div className="inline-flex rounded-md shadow-sm border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                filterMode === 'all' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Disputes
            </button>
            <button
              onClick={() => setFilterMode('inspection')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                filterMode === 'inspection' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inspection Gates
            </button>
            <button
              onClick={() => setFilterMode('replacement')}
              className={`px-2.5 py-1 text-xs font-medium rounded ${
                filterMode === 'replacement' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exchanges
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="inline-flex rounded-md shadow-sm border border-slate-200 bg-white">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-r border-slate-200 rounded-l"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-r border-slate-200"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomToFit}
              title="Zoom to Fit"
              className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-r flex items-center gap-1 text-xs font-medium"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legend & Milestone Guide */}
      <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            Active Intake & AI
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Courier Waybill Transit
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            Physical QA Gate
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
            Double-Entry Release
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Double-click any task bar to open the Bryntum Task Editor popup</span>
        </div>
      </div>

      {/* Bryntum Gantt Chart Container (Size Full Ancestor Chain with explicit height) */}
      <div className="relative w-full" style={{ height: '620px' }}>
        <BryntumGanttProjectModel ref={projectRef} {...projectProps} />
        <BryntumGantt ref={ganttRef} project={projectRef} {...ganttProps} />
      </div>

      {/* Footer Info & Verification Bar */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Deterministic Invariant:</strong> Physical Inspection Gates must pass before Subledger Settlement triggers.
          </span>
        </div>
        <div className="text-slate-400">
          Powered by <strong>@bryntum/gantt-react-enterprise v8.0.1</strong> • Svalbard Theme
        </div>
      </div>
    </div>
  );
}

