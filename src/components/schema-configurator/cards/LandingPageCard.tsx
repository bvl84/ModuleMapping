"use client";

import type { LandingPageState } from "@/data/schema-configurator-model";
import { CFG_LABEL, SectionCard } from "../ConfiguratorUI";

export function LandingPageCard({
  state,
  onChange,
}: {
  state: LandingPageState;
  onChange: (next: LandingPageState) => void;
}) {
  const update = (i: number, value: string) => {
    const next = [...state.manufacturerLogos];
    next[i] = value;
    onChange({ ...state, manufacturerLogos: next });
  };
  const remove = (i: number) =>
    onChange({ ...state, manufacturerLogos: state.manufacturerLogos.filter((_, idx) => idx !== i) });
  const add = () => onChange({ ...state, manufacturerLogos: [...state.manufacturerLogos, ""] });

  return (
    <SectionCard
      enabled={state.enable}
      onToggleEnabled={(v) => onChange({ ...state, enable: v })}
      title="Landing page"
      subtitle="landingPage.manufacturerLogos[] — names or asset paths shown on the landing screen."
    >
      {state.enable ? (
        <div className="space-y-2">
          <p className={CFG_LABEL}>manufacturerLogos</p>
          {state.manufacturerLogos.length === 0 ? (
            <p className="text-xs italic text-gray-400">No entries yet.</p>
          ) : null}
          {state.manufacturerLogos.map((logo, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-gray-500">#{i + 1}</span>
              <input
                type="text"
                value={logo}
                onChange={(e) => update(i, e.target.value)}
                placeholder="Daikin, Goodman, Amana, or asset URL"
                className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-md border border-red-200 bg-white px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            className="rounded-md border border-sky-300 bg-white px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
          >
            + Add logo
          </button>
        </div>
      ) : (
        <p className="text-xs italic text-gray-400">
          Landing page block is disabled. Toggle the rail to enable.
        </p>
      )}
    </SectionCard>
  );
}
