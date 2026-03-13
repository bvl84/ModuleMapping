'use client';

interface TabNavProps {
  activeTab: 'dashboard' | 'planning';
  onTabChange: (tab: 'dashboard' | 'planning') => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex gap-0 border-b border-gray-200 mb-6">
      <button
        onClick={() => onTabChange('dashboard')}
        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors mr-6 ${
          activeTab === 'dashboard'
            ? 'text-gray-900 border-gray-900'
            : 'text-gray-400 border-transparent hover:text-gray-600'
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => onTabChange('planning')}
        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
          activeTab === 'planning'
            ? 'text-gray-900 border-gray-900'
            : 'text-gray-400 border-transparent hover:text-gray-600'
        }`}
      >
        Energy Planning
      </button>
    </div>
  );
}
