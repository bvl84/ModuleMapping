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
      className="sticky top-4 flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-4 overflow-auto rounded-2xl border border-cyan-400/20 bg-[#0a1020]/80 p-3 shadow-[0_22px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl"
    >
      {groups.map((group) => (
        <div key={group.id} className="space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-300/70">
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
                        ? "bg-cyan-400/15 font-semibold text-cyan-100 ring-1 ring-inset ring-cyan-400/30"
                        : muted
                          ? "text-slate-500 hover:bg-white/5"
                          : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        active ? "bg-cyan-300" : muted ? "bg-slate-600" : "bg-slate-500"
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
