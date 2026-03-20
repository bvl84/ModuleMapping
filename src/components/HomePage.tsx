'use client';

import { useState } from 'react';
import { Header } from './layout/Header';
import { TabNav } from './layout/TabNav';

type TabId = 'cinch' | 'greentech' | 'solutions';

export function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('cinch');

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Header />

        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'cinch' && (
          <div className="rounded-xl overflow-hidden border border-gray-700" style={{ height: 'calc(100vh - 160px)' }}>
            <iframe src="/config-cinch.html" className="w-full h-full border-0" title="Cinch WF" />
          </div>
        )}

        {activeTab === 'greentech' && (
          <div className="rounded-xl overflow-hidden border border-gray-700" style={{ height: 'calc(100vh - 160px)' }}>
            <iframe src="/config-greentech.html" className="w-full h-full border-0" title="GreenTech WF" />
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="rounded-xl overflow-hidden border border-gray-700" style={{ height: 'calc(100vh - 160px)' }}>
            <iframe src="/config-solutions-builder.html" className="w-full h-full border-0" title="Solutions Builder WF" />
          </div>
        )}
      </div>
    </div>
  );
}
