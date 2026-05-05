"use client";

import { MapperAppShell } from "@/components/layout/MapperAppShell";
import { FUTURE_STATE_VISUAL_ENTRIES, FUTURE_STATE_WORKFLOW_PROFILE } from "@/data/future-state-visual";
import { FutureStateVisualDiagram } from "./FutureStateVisualDiagram";

export function FutureStateVisualPageClient() {
  return (
    <MapperAppShell>
      <div className="mx-auto w-full max-w-[min(100%,1920px)] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <FutureStateVisualDiagram
          entries={FUTURE_STATE_VISUAL_ENTRIES}
          workflowProfile={FUTURE_STATE_WORKFLOW_PROFILE}
        />
      </div>
    </MapperAppShell>
  );
}
