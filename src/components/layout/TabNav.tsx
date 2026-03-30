'use client';

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
    <div className="flex gap-0 border-b border-gray-600 mb-0">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors mr-6 ${
            activeTab === tab.id
              ? 'text-gray-100 border-gray-100'
              : 'text-gray-500 border-transparent hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
