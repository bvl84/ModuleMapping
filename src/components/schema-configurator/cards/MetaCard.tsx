"use client";

import {
  labelToStepId,
  type ConfiguratorState,
  type MetaState,
  type WorkflowSettingsState,
} from "@/data/schema-configurator-model";
import type { DisplayFlags, WorkflowType } from "@/data/standardized-schema";
import {
  CFG_LABEL,
  InlineToggle,
  PillToggle,
  SectionCard,
  TextAreaField,
  TextField,
} from "../ConfiguratorUI";

export function MetaCard({
  meta,
  includeDisplay,
  display,
  workflow,
  onMetaChange,
  onIncludeDisplayChange,
  onDisplayChange,
  onWorkflowChange,
}: {
  meta: ConfiguratorState["meta"];
  includeDisplay: boolean;
  display: DisplayFlags;
  workflow: WorkflowSettingsState;
  onMetaChange: (next: MetaState) => void;
  onIncludeDisplayChange: (next: boolean) => void;
  onDisplayChange: (next: DisplayFlags) => void;
  onWorkflowChange: (next: WorkflowSettingsState) => void;
}) {
  const update = (patch: Partial<MetaState>) => onMetaChange({ ...meta, ...patch });

  const derivedId = labelToStepId(meta.id);

  return (
    <SectionCard
      enabled
      title="Workflow definition"
      subtitle="Top-level identification, display, contacts, and navigation."
    >
      <div>
        <TextField
          id="meta-id"
          label="Client Name"
          value={meta.id}
          onChange={(v) => update({ id: v })}
          placeholder="example: Daikin FIT Local, Solutions Builder, Cinch"
          required
          helperText="Used for the workflow ID in the URL and the proposed payload company ID."
        />
        {meta.id ? (
          <p className="mt-1 text-[11px] text-gray-500">
            ID: <span className="font-mono text-gray-700">{derivedId || meta.id}</span>
          </p>
        ) : null}
      </div>
      <TextField
        id="meta-title"
        label="Title"
        value={meta.title}
        onChange={(v) => update({ title: v })}
        placeholder="Browser tab title"
        required
      />
      <TextAreaField
        id="meta-description"
        label="Description"
        value={meta.description}
        onChange={(v) => update({ description: v })}
        placeholder="SEO description shown to crawlers and previews."
        rows={3}
        monospace={false}
        required
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          id="meta-version"
          label="Version"
          value={meta.version}
          onChange={(v) => update({ version: v })}
          placeholder="1.0.0"
        />
        <div>
          <p className={CFG_LABEL}>Type</p>
          <PillToggle<WorkflowType>
            options={[
              { value: "B2C", label: "B2C" },
              { value: "B2B", label: "B2B" },
            ]}
            value={meta.type}
            onChange={(v) => update({ type: v })}
            ariaLabel="Workflow type"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <InlineToggle
          checked={includeDisplay}
          onChange={onIncludeDisplayChange}
          label="Include display block"
          helperText="When on, controls visibility of the page header, page footer, and step header (used by Solutions Builder)."
        />
        {includeDisplay ? (
          <div className="mt-3 space-y-2 rounded-md border border-dashed border-sky-300 bg-sky-50/40 p-3">
            <InlineToggle
              checked={display.pageHeader !== false}
              onChange={(v) => onDisplayChange({ ...display, pageHeader: v })}
              label="Page Header"
            />
            <InlineToggle
              checked={display.pageFooter !== false}
              onChange={(v) => onDisplayChange({ ...display, pageFooter: v })}
              label="Page Footer"
            />
            <InlineToggle
              checked={display.stepHeader !== false}
              onChange={(v) => onDisplayChange({ ...display, stepHeader: v })}
              label="Step Header"
            />
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-100 pt-3">
        <InlineToggle
          checked={workflow.enableContactsModule}
          onChange={(v) => onWorkflowChange({ ...workflow, enableContactsModule: v })}
          label="Include contacts module"
        />
        {workflow.enableContactsModule ? (
          <div className="mt-2">
            <p className={CFG_LABEL}>Mode</p>
            <PillToggle
              options={[
                { value: "single", label: "Single" },
                { value: "multiple", label: "Multiple" },
              ]}
              value={workflow.contactsMode === "multiple" ? "multiple" : "single"}
              onChange={(v) => onWorkflowChange({ ...workflow, contactsMode: v })}
              ariaLabel="Contacts mode"
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3">
        <p className={CFG_LABEL}>Navigation</p>
        <InlineToggle
          checked={workflow.navigation.showProgress !== false}
          onChange={(v) =>
            onWorkflowChange({
              ...workflow,
              navigation: { ...workflow.navigation, showProgress: v },
            })
          }
          label="Show pizza tracker progress"
          helperText="Displays the step-by-step progress indicator at the top of the workflow."
        />
        <InlineToggle
          checked={workflow.navigation.shouldSaveOnNext !== false}
          onChange={(v) =>
            onWorkflowChange({
              ...workflow,
              navigation: { ...workflow.navigation, shouldSaveOnNext: v },
            })
          }
          label="Save On Next"
          helperText="Persist the user's progress each time they advance to the next step."
        />
      </div>
    </SectionCard>
  );
}
