'use client';

type TabId = 'cinch' | 'greentech' | 'solutions';

const TABS: { id: TabId; label: string }[] = [
  { id: 'cinch', label: 'Cinch WF' },
  { id: 'greentech', label: 'GreenTech WF' },
  { id: 'solutions', label: 'Solutions Builder WF' },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex gap-0 border-b border-gray-700 mb-6">
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
