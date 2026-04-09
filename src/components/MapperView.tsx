"use client";

import { TabNav, type TabId } from "./layout/TabNav";

export function MapperView({ tab }: { tab: TabId }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#1e1e1e]">
      <div className="shrink-0 px-6 pt-4">
        <h1 className="mb-3 text-xl font-semibold text-gray-100">Module Mapper 3000</h1>
        <TabNav />
      </div>

      {tab === "cinch" && (
        <iframe src="/config-cinch.html" className="w-full flex-1 border-0" title="Cinch WF" />
      )}

      {tab === "greentech" && (
        <iframe src="/config-greentech.html" className="w-full flex-1 border-0" title="GreenTech WF" />
      )}

      {tab === "solutions" && (
        <iframe
          src="/config-solutions-builder.html"
          className="w-full flex-1 border-0"
          title="Solutions Builder WF"
        />
      )}

      {tab === "comparison" && (
        <iframe src="/comparison.html" className="w-full flex-1 border-0" title="Workflow Module Comparison" />
      )}

      {tab === "future-state" && (
        <iframe
          src="/config-future-state.html"
          className="w-full flex-1 border-0"
          title="Future State — Config Profile"
        />
      )}
    </div>
  );
}
