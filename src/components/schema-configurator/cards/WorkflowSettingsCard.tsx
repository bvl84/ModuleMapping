"use client";

import type { WorkflowSettingsState } from "@/data/schema-configurator-model";
import { CFG_LABEL, InlineToggle, PillToggle, SectionCard, TextField } from "../ConfiguratorUI";

export function WorkflowSettingsCard({
  state,
  onChange,
}: {
  state: WorkflowSettingsState;
  onChange: (next: WorkflowSettingsState) => void;
}) {
  return (
    <SectionCard
      enabled
      title="Workflow settings"
      subtitle="workflow.{defaultStepPostAuthentication, moduleConfigs, navigation}"
    >
      <TextField
        id="wf-default-step"
        label="defaultStepPostAuthentication"
        type="number"
        value={state.defaultStepPostAuthentication?.toString() ?? ""}
        onChange={(v) => {
          const trimmed = v.trim();
          const parsed = trimmed === "" ? undefined : Number.parseInt(trimmed, 10);
          onChange({
            ...state,
            defaultStepPostAuthentication: Number.isFinite(parsed) ? (parsed as number) : undefined,
          });
        }}
        placeholder="(omitted when blank)"
        helperText="Step index to land on after authentication (Cinch uses 1)."
      />

      <div className="border-t border-gray-100 pt-3">
        <InlineToggle
          checked={state.enableContactsModule}
          onChange={(v) => onChange({ ...state, enableContactsModule: v })}
          label="Include moduleConfigs.contacts"
        />
        {state.enableContactsModule ? (
          <div className="mt-2">
            <p className={CFG_LABEL}>moduleConfigs.contacts.mode</p>
            <PillToggle
              options={[
                { value: "single", label: "single" },
                { value: "multiple", label: "multiple" },
              ]}
              value={state.contactsMode === "multiple" ? "multiple" : "single"}
              onChange={(v) => onChange({ ...state, contactsMode: v })}
              ariaLabel="contacts mode"
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3">
        <p className={CFG_LABEL}>navigation</p>
        <InlineToggle
          checked={state.navigation.showProgress !== false}
          onChange={(v) =>
            onChange({ ...state, navigation: { ...state.navigation, showProgress: v } })
          }
          label="navigation.showProgress"
        />
        <InlineToggle
          checked={state.navigation.shouldSaveOnNext !== false}
          onChange={(v) =>
            onChange({ ...state, navigation: { ...state.navigation, shouldSaveOnNext: v } })
          }
          label="navigation.shouldSaveOnNext"
        />
      </div>
    </SectionCard>
  );
}
