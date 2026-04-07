"use client";

import { useMemo } from "react";
import type { FutureStateModuleEntry, FutureStateWorkflowProfile } from "@/data/future-state-visual";
import { buildFutureStateConfigSnapshot } from "./buildFutureStateConfigSnapshot";
import { FutureStateMapperStyleView } from "./FutureStateMapperStyleView";

export function FutureStateLiveConfigOutput({
  profile,
  entries,
}: {
  profile: FutureStateWorkflowProfile;
  entries: FutureStateModuleEntry[];
}) {
  const snapshot = useMemo(
    () => buildFutureStateConfigSnapshot(profile, entries),
    [profile, entries],
  );

  return (
    <aside
      className="flex w-full min-h-0 shrink-0 flex-col self-stretch lg:min-w-[min(100%,560px)] lg:max-w-[min(100%,820px)] lg:flex-[0_1_44%]"
      aria-label="Live Future State config output"
    >
      <div className="flex h-full min-h-[min(100dvh,28rem)] flex-1 flex-col overflow-hidden rounded-xl border border-gray-700 bg-[#1e1e1e] shadow-lg ring-1 ring-white/5 sm:min-h-[32rem] lg:min-h-0">
        <div className="shrink-0 border-b border-gray-700 px-5 py-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6a9955]">Live output</p>
          <p className="mt-0.5 text-sm font-medium text-[#d4d4d4]">Future State config</p>
          <p className="mt-1 text-xs text-gray-500">
            Same layout as the Future State module mapper — expand <span className="font-mono text-[#9cdcfe]">configuration</span> rows to
            see nested options. Updates live as you edit the visual.
          </p>
        </div>
        <div
          className="min-h-0 flex-1 overflow-auto p-5 sm:p-6"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
        >
          <FutureStateMapperStyleView data={snapshot} />
        </div>
      </div>
    </aside>
  );
}
