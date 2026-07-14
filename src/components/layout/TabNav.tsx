"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type TabId =
  | "cinch"
  | "greentech"
  | "solutions"
  | "comparison"
  | "future-state"
  | "workflows"
  | "schema-configurator";

export const TAB_ROUTES: Record<TabId, string> = {
  cinch: "/cinch",
  greentech: "/greentech",
  solutions: "/solutions-builder",
  comparison: "/comparison",
  "future-state": "/future-state",
  workflows: "/workflows",
  "schema-configurator": "/schema-configurator",
};

/** Tabs shown in the primary nav. Legacy/reference pages live in the hidden TOC. */
const VISIBLE_TABS: { id: TabId; label: string }[] = [
  { id: "workflows", label: "Workflows" },
  { id: "schema-configurator", label: "Schema Configurator" },
];

const tabLinkClass = (active: boolean) =>
  `mr-6 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
    active ? "border-gray-100 text-gray-100" : "border-transparent text-gray-500 hover:text-gray-300"
  }`;

export function TabNav() {
  const pathname = usePathname();

  return (
    <div className="mb-0 flex flex-wrap items-end gap-0 border-b border-gray-600">
      {VISIBLE_TABS.map((tab) => (
        <Link
          key={tab.id}
          href={TAB_ROUTES[tab.id]}
          className={tabLinkClass(pathname === TAB_ROUTES[tab.id])}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
