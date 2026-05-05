"use client";

import type { ReactNode } from "react";
import { TabNav } from "./TabNav";

/**
 * Dark shell shared by iframe mapper routes and Future State visual:
 * title + tab nav (same as legacy MapperView header).
 */
export function MapperAppShell({
  children,
  contentFillViewport = false,
}: {
  children: ReactNode;
  /** Iframe routes: fill viewport, no outer scroll. Visual page: allow vertical scroll. */
  contentFillViewport?: boolean;
}) {
  const outer = contentFillViewport
    ? "flex h-screen flex-col overflow-hidden bg-[#1e1e1e]"
    : "flex min-h-screen flex-col bg-[#1e1e1e]";

  /** Iframes need a flex column parent so `flex-1` on the iframe allocates remaining viewport height. */
  const main = contentFillViewport
    ? "flex min-h-0 flex-1 flex-col"
    : "flex-1 overflow-auto";

  return (
    <div className={outer}>
      <div className="shrink-0 px-6 pt-4">
        <h1 className="mb-3 text-xl font-semibold text-gray-100">Module Mapper 3000</h1>
        <TabNav />
      </div>
      <div className={main}>{children}</div>
    </div>
  );
}
