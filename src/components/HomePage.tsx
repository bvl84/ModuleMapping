'use client';

import { useState } from 'react';
import { TabNav } from './layout/TabNav';

type TabId = 'cinch' | 'greentech' | 'solutions';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('cinch');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1e1e1e]">
      <div className="flex-shrink-0 px-6 pt-4">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === 'cinch' && (
        <iframe src="/config-cinch.html" className="flex-1 w-full border-0" title="Cinch WF" />
      )}

      {activeTab === 'greentech' && (
        <iframe src="/config-greentech.html" className="flex-1 w-full border-0" title="GreenTech WF" />
      )}

      {activeTab === 'solutions' && (
        <iframe src="/config-solutions-builder.html" className="flex-1 w-full border-0" title="Solutions Builder WF" />
      )}
    </div>
  );
}
