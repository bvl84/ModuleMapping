'use client';

type TabId = 'dashboard' | 'planning' | 'scoring';

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'planning', label: 'Energy Planning' },
  { id: 'scoring', label: 'Scoring' },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex gap-0 border-b border-gray-200 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors mr-6 ${
            activeTab === tab.id
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
