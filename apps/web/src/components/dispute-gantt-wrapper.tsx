'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { DisputeGanttViewProps } from './bryntum-gantt-chart';
import { Calendar } from 'lucide-react';

const DynamicGantt = dynamic(
  () => import('./bryntum-gantt-chart'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-sm flex flex-col items-center justify-center gap-3 min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800" />
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Calendar className="w-4 h-4 text-blue-700" />
          <span>Loading Bryntum Gantt Enterprise Scheduler...</span>
        </div>
        <p className="text-xs text-slate-500 max-w-md">
          Initializing the high-performance dispute schedule canvas, cascade dependency lines, and inspection gates.
        </p>
      </div>
    ),
  }
);

export function DisputeGantt(props: DisputeGanttViewProps) {
  return <DynamicGantt {...props} />;
}

