"use client";

import type { ReactNode } from "react";
import { AuthControls } from "@/components/auth/AuthControls";
import { HiddenTocMenu } from "./HiddenTocMenu";

/**
 * Dark shell shared by iframe mapper routes and Future State visual:
 * title + tab nav (same as legacy MapperView header).
 */
export function MapperAppShell({
  children,
  contentFillViewport = false,
  holo = false,
}: {
  children: ReactNode;
  /** Iframe routes: fill viewport, no outer scroll. Visual page: allow vertical scroll. */
  contentFillViewport?: boolean;
  /** Apply the Holocron space-navy theme (Workflows + Schema Configurator only). */
  holo?: boolean;
}) {
  const base = contentFillViewport
    ? "flex h-screen flex-col overflow-hidden"
    : "flex min-h-screen flex-col";
  const outer = holo
    ? `holo-bg holo-grid relative ${base}`
    : `relative bg-[#1e1e1e] ${base}`;

  /** Iframes need a flex column parent so `flex-1` on the iframe allocates remaining viewport height. */
  const main = contentFillViewport
    ? "flex min-h-0 flex-1 flex-col"
    : "flex-1 overflow-auto";

  return (
    <div className={outer}>
      {holo ? <div className="stars" aria-hidden="true" /> : null}
      {holo ? (
        <div className="relative z-40 shrink-0 px-4 pb-2 pt-12 sm:px-6">
          <div className="mx-auto flex w-full max-w-[min(100%,1400px)] items-center justify-between gap-4 rounded-full border border-cyan-200/20 bg-[#050711]/60 px-5 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl max-sm:flex-col max-sm:items-stretch max-sm:rounded-[26px]">
            <div className="flex items-center gap-3">
              <HiddenTocMenu />
              <span className="brand-mark shrink-0" aria-hidden="true" />
              <h1 className="text-lg font-semibold tracking-tight text-[#eef7ff] [text-shadow:0_0_18px_rgba(103,232,249,0.35)]">
                Module Mapper 3000
              </h1>
            </div>
            <div className="max-sm:self-end">
              <AuthControls />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-40 shrink-0 px-6 pb-3 pt-4">
          <div className="flex items-center gap-3">
            <HiddenTocMenu />
            <h1 className="text-xl font-semibold text-gray-100">Module Mapper 3000</h1>
            <div className="ml-auto">
              <AuthControls />
            </div>
          </div>
        </div>
      )}
      <div className={`relative z-10 ${main}`}>{children}</div>
    </div>
  );
}
