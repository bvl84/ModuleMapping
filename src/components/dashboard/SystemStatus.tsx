'use client';

import { useState } from 'react';
import type { SystemStatus as SystemStatusType } from '../../types/scoring';

interface SystemStatusProps {
  systems: SystemStatusType[];
}

function SystemItem({ system }: { system: SystemStatusType }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            width="12" height="12" viewBox="0 0 12 12"
            className={`text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
          >
            <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">{system.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {system.activity === 'Cooling' ? (
                <span className="text-blue-500 text-xs">❄️ {system.activity}</span>
              ) : (
                <span className="text-amber-500 text-xs">⚡ {system.activity}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${system.status === 'Live' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
          <span className="text-xs text-gray-500">{system.status}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 mt-3 text-center">
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium text-emerald-600">{system.status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Activity</p>
              <p className="text-sm font-medium">{system.activity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Efficiency</p>
              <p className="text-sm font-medium text-[#4F8F73]">98%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SystemStatusPanel({ systems }: SystemStatusProps) {
  return (
    <div className="space-y-2">
      {systems.map((system) => (
        <SystemItem key={system.id} system={system} />
      ))}
    </div>
  );
}
