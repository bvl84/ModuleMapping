'use client';

import Link from 'next/link';

export type TabId = 'cinch' | 'greentech' | 'solutions' | 'comparison' | 'future-state';

const TABS: { id: TabId; label: string }[] = [
  { id: 'cinch', label: 'Cinch' },
  { id: 'greentech', label: 'GreenTech' },
  { id: 'solutions', label: 'Solutions Builder' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'future-state', label: 'Future State' },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="mb-0 flex flex-wrap items-end gap-0 border-b border-gray-600">
      {TABS.map((tab) =>
        tab.id === 'future-state' ? (
          <div key={tab.id} className="mr-6 flex items-end gap-0">
            <button
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-100 text-gray-100'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
            <Link
              href="/future-state-visual"
              className="ml-4 border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-300"
            >
              Future State Visual
            </Link>
          </div>
        ) : (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`mr-6 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-gray-100 text-gray-100'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        )
      )}
    </div>
  );
}
