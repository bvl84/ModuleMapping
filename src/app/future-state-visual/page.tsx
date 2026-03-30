import Link from "next/link";
import type { Metadata } from "next";
import { FutureStateVisualDiagram } from "@/components/future-state/FutureStateVisualDiagram";
import { FUTURE_STATE_VISUAL_ENTRIES } from "@/data/future-state-visual";

export const metadata: Metadata = {
  title: "Future State visual — Module Mapper 3000",
  description: "Visual flow of Future State workflow modules and configuration",
};

export default function FutureStateVisualPage() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-100">
      <header className="border-b border-gray-700/80 bg-[#252526] px-6 py-4">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Future State</p>
            <h1 className="text-lg font-semibold text-gray-100">Workflow visual</h1>
          </div>
          <Link
            href="/"
            className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-gray-500 hover:bg-gray-800/80 hover:text-white"
          >
            ← Module Mapper
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 pt-8">
        <p className="mb-8 text-sm leading-relaxed text-gray-400">
          Modules in <span className="text-gray-300">sort</span> order. Each card is a workflow step; nested panels
          mirror <span className="font-mono text-xs text-gray-400">configuration</span> and{" "}
          <span className="font-mono text-xs text-gray-400">sub configuration</span> from the Future State profile.
        </p>
        <FutureStateVisualDiagram entries={FUTURE_STATE_VISUAL_ENTRIES} />
      </main>
    </div>
  );
}
