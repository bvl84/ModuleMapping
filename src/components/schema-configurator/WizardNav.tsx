"use client";

import type { ReactNode } from "react";

export type WizardSection = {
  id: string;
  label: string;
  description?: string;
  enabled?: boolean;
  badge?: ReactNode;
};

export type WizardGroup = {
  id: string;
  label: string;
  sections: WizardSection[];
};

export function WizardNav({
  groups,
  activeId,
  onSelect,
}: {
  groups: WizardGroup[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Configurator sections"
      className="sticky top-4 flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-4 overflow-auto rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
    >
      {groups.map((group) => (
        <div key={group.id} className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.sections.map((s) => {
              const active = activeId === s.id;
              const muted = s.enabled === false;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(s.id)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                      active
                        ? "bg-sky-100 font-semibold text-sky-800"
                        : muted
                          ? "text-gray-400 hover:bg-gray-50"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        active ? "bg-sky-500" : muted ? "bg-gray-300" : "bg-gray-400"
                      }`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate">{s.label}</span>
                    {s.badge ? <span className="shrink-0">{s.badge}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
