"use client";

import type { ConfiguratorState, MetaState } from "@/data/schema-configurator-model";
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
  onMetaChange,
  onIncludeDisplayChange,
  onDisplayChange,
}: {
  meta: ConfiguratorState["meta"];
  includeDisplay: boolean;
  display: DisplayFlags;
  onMetaChange: (next: MetaState) => void;
  onIncludeDisplayChange: (next: boolean) => void;
  onDisplayChange: (next: DisplayFlags) => void;
}) {
  const update = (patch: Partial<MetaState>) => onMetaChange({ ...meta, ...patch });

  return (
    <SectionCard
      enabled
      title="Workflow definition"
      subtitle="Top-level identification, version, and audience type."
    >
      <TextField
        id="meta-id"
        label="id"
        value={meta.id}
        onChange={(v) => update({ id: v })}
        placeholder="example: cinchPOC, sbPOC"
        required
        helperText="Unique workflow id used in the URL and proposedPayload.summary.companyId."
      />
      <TextField
        id="meta-title"
        label="title"
        value={meta.title}
        onChange={(v) => update({ title: v })}
        placeholder="Browser tab title"
        required
      />
      <TextAreaField
        id="meta-description"
        label="description"
        value={meta.description}
        onChange={(v) => update({ description: v })}
        placeholder="SEO description shown to crawlers and previews."
        rows={3}
        monospace={false}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          id="meta-version"
          label="version"
          value={meta.version}
          onChange={(v) => update({ version: v })}
          placeholder="1.0.0"
        />
        <div>
          <p className={CFG_LABEL}>type</p>
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
          helperText="When on, emits top-level display.{pageHeader,pageFooter,stepHeader} (used by Solutions Builder)."
        />
        {includeDisplay ? (
          <div className="mt-3 space-y-2 rounded-md border border-dashed border-sky-300 bg-sky-50/40 p-3">
            <InlineToggle
              checked={display.pageHeader !== false}
              onChange={(v) => onDisplayChange({ ...display, pageHeader: v })}
              label="display.pageHeader"
            />
            <InlineToggle
              checked={display.pageFooter !== false}
              onChange={(v) => onDisplayChange({ ...display, pageFooter: v })}
              label="display.pageFooter"
            />
            <InlineToggle
              checked={display.stepHeader !== false}
              onChange={(v) => onDisplayChange({ ...display, stepHeader: v })}
              label="display.stepHeader"
            />
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
