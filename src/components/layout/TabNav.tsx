"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type TabId = "cinch" | "greentech" | "solutions" | "comparison" | "future-state";

export const TAB_ROUTES: Record<TabId, string> = {
  cinch: "/cinch",
  greentech: "/greentech",
  solutions: "/solutions-builder",
  comparison: "/comparison",
  "future-state": "/future-state",
};

const TABS: { id: TabId; label: string }[] = [
  { id: "cinch", label: "Cinch" },
  { id: "greentech", label: "GreenTech" },
  { id: "solutions", label: "Solutions Builder" },
  { id: "comparison", label: "Comparison" },
  { id: "future-state", label: "Future State" },
];

const tabLinkClass = (active: boolean) =>
  `mr-6 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
    active ? "border-gray-100 text-gray-100" : "border-transparent text-gray-500 hover:text-gray-300"
  }`;

export function TabNav() {
  const pathname = usePathname();

  return (
    <div className="mb-0 flex flex-wrap items-end gap-0 border-b border-gray-600">
      {TABS.map((tab) =>
        tab.id === "future-state" ? (
          <div key={tab.id} className="mr-0 flex items-end gap-0">
            <Link
              href={TAB_ROUTES["future-state"]}
              className={tabLinkClass(pathname === TAB_ROUTES["future-state"])}
            >
              {tab.label}
            </Link>
            <Link
              href="/future-state-visual"
              className={`ml-4 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                pathname === "/future-state-visual"
                  ? "border-gray-100 text-gray-100"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              Future State Visual
            </Link>
          </div>
        ) : (
          <Link
            key={tab.id}
            href={TAB_ROUTES[tab.id]}
            className={tabLinkClass(pathname === TAB_ROUTES[tab.id])}
          >
            {tab.label}
          </Link>
        ),
      )}
    </div>
  );
}
