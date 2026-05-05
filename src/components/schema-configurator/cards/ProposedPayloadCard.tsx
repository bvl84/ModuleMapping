"use client";

import { useMemo } from "react";
import type { ConfiguratorState } from "@/data/schema-configurator-model";
import { SectionCard, TextAreaField } from "../ConfiguratorUI";

export function ProposedPayloadCard({
  state,
  onChange,
}: {
  state: ConfiguratorState["proposedPayload"];
  onChange: (next: ConfiguratorState["proposedPayload"]) => void;
}) {
  const parseError = useMemo(() => {
    if (!state.enabled) return null;
    if (!state.rawJson.trim()) return null;
    try {
      JSON.parse(state.rawJson);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Invalid JSON";
    }
  }, [state.enabled, state.rawJson]);

  return (
    <SectionCard
      enabled={state.enabled}
      onToggleEnabled={(v) => onChange({ ...state, enabled: v })}
      title="Proposed payload"
      subtitle="proposedPayload.{metadata, summary} — advanced raw JSON (highly client-specific)."
    >
      {state.enabled ? (
        <>
          <p className="text-[11px] text-gray-500">
            Edit the raw JSON below. Bindings starting with{" "}
            <span className="font-mono text-sky-700">@</span> reference workflow paths and are
            evaluated at runtime.
          </p>
          <TextAreaField
            label="proposedPayload (JSON)"
            value={state.rawJson}
            onChange={(v) => onChange({ ...state, rawJson: v })}
            rows={16}
            placeholder="{ ... }"
          />
          {parseError ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-2 py-1 font-mono text-[11px] text-red-700">
              JSON error: {parseError}
            </p>
          ) : (
            <p className="text-[11px] italic text-gray-500">JSON parses cleanly.</p>
          )}
        </>
      ) : (
        <p className="text-xs italic text-gray-400">
          proposedPayload omitted from the export. Toggle the rail to include.
        </p>
      )}
    </SectionCard>
  );
}
