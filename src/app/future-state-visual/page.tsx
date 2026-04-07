import Link from "next/link";
import type { Metadata } from "next";
import { FutureStateVisualDiagram } from "@/components/future-state/FutureStateVisualDiagram";
import { FUTURE_STATE_VISUAL_ENTRIES, FUTURE_STATE_WORKFLOW_PROFILE } from "@/data/future-state-visual";

export const metadata: Metadata = {
  title: "Future State visual — Module Mapper 3000",
  description: "Visual flow of Future State workflow modules and configuration",
};

export default function FutureStateVisualPage() {
  return (
    <div className="min-h-screen bg-[#f0f7fc] text-gray-800">
      <header className="border-b border-sky-200/80 bg-white px-5 py-5 shadow-sm sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[min(100%,1920px)] flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-sky-600">
              Future State <span className="text-gray-400">/</span> Modules
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Workflow modules</h1>
            <p className="mt-1 text-sm text-gray-500">
              Step layout inspired by module selection — pills are configuration and fields for each step.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-md border-2 border-sky-400 bg-white px-4 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-50"
          >
            ← Module Mapper
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[min(100%,1920px)] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="rounded-xl border-2 border-sky-300 bg-sky-50/40 p-5 shadow-sm sm:p-8 lg:p-10">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-sky-700">
            Module control — future state
          </p>
          <FutureStateVisualDiagram
            entries={FUTURE_STATE_VISUAL_ENTRIES}
            workflowProfile={FUTURE_STATE_WORKFLOW_PROFILE}
          />
        </div>
      </main>
    </div>
  );
}
