"use client";

import { MapperAppShell } from "./layout/MapperAppShell";
import type { TabId } from "./layout/TabNav";

export function MapperView({ tab }: { tab: TabId }) {
  return (
    <MapperAppShell contentFillViewport>
      {tab === "cinch" && (
        <iframe src="/config-cinch.html" className="min-h-0 w-full flex-1 border-0" title="Cinch WF" />
      )}

      {tab === "greentech" && (
        <iframe src="/config-greentech.html" className="min-h-0 w-full flex-1 border-0" title="GreenTech WF" />
      )}

      {tab === "solutions" && (
        <iframe
          src="/config-solutions-builder.html"
          className="min-h-0 w-full flex-1 border-0"
          title="Solutions Builder WF"
        />
      )}

      {tab === "comparison" && (
        <iframe src="/comparison.html" className="min-h-0 w-full flex-1 border-0" title="Workflow Module Comparison" />
      )}

      {tab === "future-state" && (
        <iframe
          src="/config-future-state.html"
          className="min-h-0 w-full flex-1 border-0"
          title="Future State — Config Profile"
        />
      )}
    </MapperAppShell>
  );
}
