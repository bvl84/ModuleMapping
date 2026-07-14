"use client";

import { useState, type ReactNode } from "react";
import {
  deriveOptionTargetPath,
  type SlotEdits,
  type SlotState,
  type StepState,
} from "@/data/schema-configurator-model";
import type { StepTemplate, SlotTemplate } from "@/data/schema-step-templates";
import {
  KNOWN_ACTION_TYPES,
  type ActionDefinition,
  type KnownActionType,
} from "@/data/standardized-schema";
import {
  CFG_LABEL,
  InlineToggle,
  SectionCard,
  TextField,
} from "../ConfiguratorUI";

type SlotEditPatch = Partial<SlotEdits> & { _replace?: SlotEdits };

function SlotGroupSection({
  label,
  defaultCollapsed,
  enabledCount,
  totalCount,
  children,
}: {
  label: string;
  defaultCollapsed?: boolean;
  enabledCount: number;
  totalCount: number;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed === true);
  return (
    <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 shadow-sm">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-amber-400/10"
      >
        <span
          aria-hidden
          className={`inline-block h-2 w-2 shrink-0 transform border-r-2 border-b-2 border-amber-300 transition-transform ${
            collapsed ? "-rotate-45" : "rotate-45"
          }`}
        />
        <span className="text-sm font-bold tracking-tight text-amber-200">{label}</span>
        <span className="ml-auto rounded-full border border-amber-400/30 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-200">
          {enabledCount}/{totalCount} on
        </span>
      </button>
      {!collapsed ? <div className="space-y-2 border-t border-amber-400/20 p-3">{children}</div> : null}
    </div>
  );
}

type SlotListItem =
  | { kind: "slot"; tpl: SlotTemplate }
  | {
      kind: "group";
      id: string;
      label: string;
      defaultCollapsed?: boolean;
      tpls: SlotTemplate[];
    };

function buildSlotListItems(slots: readonly SlotTemplate[]): SlotListItem[] {
  const items: SlotListItem[] = [];
  const groupIdxByKey = new Map<string, number>();
  for (const tpl of slots) {
    if (!tpl.group) {
      items.push({ kind: "slot", tpl });
      continue;
    }
    const key = tpl.group.id;
    const existingIdx = groupIdxByKey.get(key);
    if (existingIdx !== undefined) {
      const existing = items[existingIdx];
      if (existing.kind === "group") existing.tpls.push(tpl);
      continue;
    }
    groupIdxByKey.set(key, items.length);
    items.push({
      kind: "group",
      id: key,
      label: tpl.group.label,
      defaultCollapsed: tpl.group.defaultCollapsed,
      tpls: [tpl],
    });
  }
  return items;
}

function renderGroupedSlots(
  templates: readonly SlotTemplate[],
  states: Record<string, SlotState>,
  stepperLabel: string,
  onSlotChange: (slotId: string, next: SlotState) => void,
): ReactNode {
  const items = buildSlotListItems(templates);
  return items.map((item) => {
    if (item.kind === "slot") {
      const state = states[item.tpl.slotId];
      if (!state) return null;
      return (
        <SlotRow
          key={item.tpl.slotId}
          slotTemplate={item.tpl}
          slotState={state}
          stepperLabel={stepperLabel}
          onChange={(next) => onSlotChange(item.tpl.slotId, next)}
        />
      );
    }
    const enabledCount = item.tpls.reduce((acc, t) => {
      const s = states[t.slotId];
      return acc + (s?.enabled || t.locked === true ? 1 : 0);
    }, 0);
    return (
      <SlotGroupSection
        key={`group-${item.id}`}
        label={item.label}
        defaultCollapsed={item.defaultCollapsed}
        enabledCount={enabledCount}
        totalCount={item.tpls.length}
      >
        {item.tpls.map((tpl) => {
          const state = states[tpl.slotId];
          if (!state) return null;
          return (
            <SlotRow
              key={tpl.slotId}
              slotTemplate={tpl}
              slotState={state}
              stepperLabel={stepperLabel}
              onChange={(next) => onSlotChange(tpl.slotId, next)}
            />
          );
        })}
      </SlotGroupSection>
    );
  });
}

function ActionsEditor({
  actions,
  onChange,
}: {
  actions: ActionDefinition[];
  onChange: (next: ActionDefinition[]) => void;
}) {
  const update = (i: number, patch: Partial<ActionDefinition>) => {
    const next = actions.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    onChange(next);
  };
  const remove = (i: number) => onChange(actions.filter((_, idx) => idx !== i));
  const add = () => onChange([...actions, { type: "validateStep" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= actions.length) return;
    const next = [...actions];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2 rounded-md border border-dashed border-amber-400/30 bg-amber-400/5 p-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-200">Actions</p>
      {actions.length === 0 ? (
        <p className="text-[11px] italic text-slate-400">No actions.</p>
      ) : null}
      {actions.map((action, i) => {
        const needsModule = action.type === "moduleAction";
        const needsTargetPath = action.type === "flipBool" || action.type === "setValue";
        const needsValue = action.type === "setValue";
        const needsName = action.type === "moduleAction" || action.type === "setValue" || action.type === "flipBool";
        return (
          <div key={i} className="space-y-1.5 rounded border border-amber-400/20 bg-[#050711]/50 p-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-slate-200">#{i + 1}</span>
              <select
                value={KNOWN_ACTION_TYPES.includes(action.type as KnownActionType) ? action.type : "__custom"}
                onChange={(e) => {
                  const t = e.target.value;
                  if (t === "__custom") return;
                  update(i, { type: t });
                }}
                className="rounded border border-cyan-400/20 bg-[#050711] px-1.5 py-0.5 font-mono text-xs text-slate-100 shadow-sm focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              >
                {KNOWN_ACTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                {!KNOWN_ACTION_TYPES.includes(action.type as KnownActionType) ? (
                  <option value="__custom">{action.type} (custom)</option>
                ) : null}
              </select>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded border border-cyan-400/20 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-40"
                aria-label="move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === actions.length - 1}
                className="rounded border border-cyan-400/20 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-40"
                aria-label="move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="ml-auto rounded border border-red-400/30 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-red-300 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
            {needsModule ? (
              <input
                type="text"
                value={action.module ?? ""}
                onChange={(e) => update(i, { module: e.target.value })}
                placeholder="Module"
                className="w-full rounded border border-cyan-400/20 bg-[#050711]/60 px-1.5 py-1 font-mono text-[11px] text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            ) : null}
            {needsName ? (
              <input
                type="text"
                value={action.name ?? ""}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="Name"
                className="w-full rounded border border-cyan-400/20 bg-[#050711]/60 px-1.5 py-1 font-mono text-[11px] text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            ) : null}
            {needsTargetPath ? (
              <input
                type="text"
                value={action.targetPath ?? ""}
                onChange={(e) => update(i, { targetPath: e.target.value })}
                placeholder="Target Path"
                className="w-full rounded border border-cyan-400/20 bg-[#050711]/60 px-1.5 py-1 font-mono text-[11px] text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            ) : null}
            {needsValue ? (
              <input
                type="text"
                value={action.value === undefined ? "" : JSON.stringify(action.value)}
                onChange={(e) => {
                  try {
                    const parsed = e.target.value === "" ? undefined : JSON.parse(e.target.value);
                    update(i, { value: parsed });
                  } catch {
                    update(i, { value: e.target.value });
                  }
                }}
                placeholder="Value"
                className="w-full rounded border border-cyan-400/20 bg-[#050711]/60 px-1.5 py-1 font-mono text-[11px] text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="rounded border border-amber-400/30 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-400/10"
      >
        + Add action
      </button>
    </div>
  );
}

function OptionsEditor({
  options,
  stepperLabel,
  onChange,
}: {
  options: NonNullable<SlotEdits["options"]>;
  stepperLabel: string;
  onChange: (next: NonNullable<SlotEdits["options"]>) => void;
}) {
  const update = (i: number, patch: Partial<{ label: string; targetPath: string }>) => {
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  };
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([
      ...options,
      { label: "", targetPath: deriveOptionTargetPath(stepperLabel, "") },
    ]);

  return (
    <div className="space-y-2 rounded-md border border-dashed border-cyan-400/30 bg-cyan-400/5 p-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300/80">Options</p>
      <p className="text-[11px] text-slate-400">
        The path each option writes to is auto-generated from the step name and the option label.
      </p>
      {options.length === 0 ? (
        <p className="text-[11px] italic text-slate-400">No options.</p>
      ) : null}
      {options.map((opt, i) => {
        const derivedPath = deriveOptionTargetPath(stepperLabel, opt.label);
        return (
          <div key={i} className="space-y-1 rounded border border-cyan-400/20 bg-[#050711]/50 p-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-slate-200">#{i + 1}</span>
              <input
                type="text"
                value={opt.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Label"
                className="min-w-[12rem] flex-1 rounded border border-cyan-400/20 bg-[#050711]/60 px-1.5 py-1 text-xs text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded border border-red-400/30 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-red-300 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
            <p className="font-mono text-[10px] text-slate-500">
              Path: <span className="text-slate-300">{derivedPath}</span>
            </p>
          </div>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="rounded border border-cyan-400/30 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-400/10"
      >
        + Add option
      </button>
    </div>
  );
}

function SlotRow({
  slotTemplate,
  slotState,
  stepperLabel,
  onChange,
}: {
  slotTemplate: SlotTemplate;
  slotState: SlotState;
  stepperLabel: string;
  onChange: (next: SlotState) => void;
}) {
  const update = (patch: SlotEditPatch) => {
    if (patch._replace) onChange({ ...slotState, edits: patch._replace });
    else onChange({ ...slotState, edits: { ...slotState.edits, ...patch } });
  };

  const baseProps = (slotTemplate.baseNode.properties ?? {}) as Record<string, unknown>;
  const baseLabel = typeof baseProps.label === "string" ? baseProps.label : "";
  const baseRequired = typeof baseProps.required === "boolean" ? baseProps.required : false;
  const baseDefault = typeof baseProps.default === "boolean" ? baseProps.default : false;
  const baseContent = typeof baseProps.content === "string" ? baseProps.content : "";
  const baseActions = (slotTemplate.baseNode.actions ?? []) as ActionDefinition[];
  const baseOptions = Array.isArray(baseProps.options)
    ? ((baseProps.options as unknown[])
        .filter((o): o is Record<string, unknown> => !!o && typeof o === "object")
        .map((o) => ({
          label: typeof o.label === "string" ? o.label : "",
          targetPath: typeof o.targetPath === "string" ? o.targetPath : "",
        })))
    : [];
  const baseSelectionRules =
    baseProps.selectionRules && typeof baseProps.selectionRules === "object"
      ? (baseProps.selectionRules as { minimum?: number; maximum?: number })
      : { minimum: 0, maximum: 0 };
  const baseKey = typeof baseProps.key === "string" ? baseProps.key : "";
  const baseKeyName = typeof baseProps.keyName === "string" ? baseProps.keyName : "";

  const editable = new Set<string>(slotTemplate.editable);
  const labelValue = slotState.edits.label ?? baseLabel;
  const requiredValue = slotState.edits.required ?? baseRequired;
  const defaultValue = slotState.edits.default ?? baseDefault;
  const contentValue = slotState.edits.content ?? baseContent;
  const actionsValue = slotState.edits.actions ?? baseActions;
  const optionsValue = slotState.edits.options ?? baseOptions;
  const selectionRulesValue = slotState.edits.selectionRules ?? {
    minimum: baseSelectionRules.minimum ?? 0,
    maximum: baseSelectionRules.maximum ?? 0,
  };
  const keyValue = slotState.edits.key ?? baseKey;
  const keyNameValue = slotState.edits.keyName ?? baseKeyName;

  const locked = slotTemplate.locked === true;
  const enabled = locked ? true : slotState.enabled;

  return (
    <div className={`rounded-lg border ${enabled ? "border-cyan-400/15" : "border-cyan-400/10 opacity-70"} bg-[#050711]/40 p-3 shadow-sm`}>
      <div className="flex flex-wrap items-start gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={enabled}
          aria-disabled={locked}
          aria-label={
            locked
              ? `${slotTemplate.displayName}: required (cannot be disabled)`
              : `${slotTemplate.displayName}: ${enabled ? "on" : "off"}`
          }
          onClick={() => {
            if (locked) return;
            onChange({ ...slotState, enabled: !enabled });
          }}
          title={locked ? "This component is required and cannot be removed." : undefined}
          className={`mt-0.5 rounded p-0.5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 ${
            locked ? "cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
              locked ? "border-slate-600 bg-white/5" : enabled ? "border-cyan-400 bg-cyan-400/20" : "border-slate-500 bg-transparent"
            }`}
            aria-hidden
          >
            {enabled ? (
              <svg
                className={`h-3 w-3 ${locked ? "text-slate-400" : "text-cyan-300"}`}
                fill="none"
                viewBox="0 0 12 12"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2.5 6l2.5 2.5L9.5 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-semibold ${enabled ? "text-slate-100" : "text-slate-500"}`}>
              {slotTemplate.displayName}
            </span>
            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 font-mono text-[10px] text-cyan-200">
              {slotTemplate.baseNode.component}
            </span>
            {locked ? (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                Always on
              </span>
            ) : null}
          </div>
          {slotTemplate.hint ? (
            <p className="mt-1 text-[11px] text-slate-400">{slotTemplate.hint}</p>
          ) : null}
        </div>
      </div>

      {enabled ? (
        <div className="mt-3 space-y-2 pl-7">
          {editable.has("label") ? (
            <TextField
              label="Label"
              value={labelValue}
              onChange={(v) => update({ label: v })}
            />
          ) : null}
          {editable.has("content") ? (
            <TextField
              label="Content"
              value={contentValue}
              onChange={(v) => update({ content: v })}
            />
          ) : null}
          {editable.has("required") ? (
            <label className="inline-flex select-none items-center gap-1.5 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={requiredValue}
                onChange={(e) => update({ required: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-slate-500 accent-cyan-400"
              />
              <span>Required Field?</span>
            </label>
          ) : null}
          {editable.has("default") ? (
            <InlineToggle
              checked={defaultValue}
              onChange={(v) => update({ default: v })}
              label="Default"
            />
          ) : null}
          {editable.has("selectionRules") ? (
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Minimum"
                type="number"
                value={String(selectionRulesValue.minimum)}
                onChange={(v) =>
                  update({
                    selectionRules: {
                      minimum: Number.parseInt(v, 10) || 0,
                      maximum: selectionRulesValue.maximum,
                    },
                  })
                }
              />
              <TextField
                label="Maximum"
                type="number"
                value={String(selectionRulesValue.maximum)}
                onChange={(v) =>
                  update({
                    selectionRules: {
                      minimum: selectionRulesValue.minimum,
                      maximum: Number.parseInt(v, 10) || 0,
                    },
                  })
                }
              />
            </div>
          ) : null}
          {editable.has("options") ? (
            <OptionsEditor
              options={optionsValue}
              stepperLabel={stepperLabel}
              onChange={(next) => update({ options: next })}
            />
          ) : null}
          {editable.has("key") ? (
            <TextField
              label="Key"
              value={keyValue}
              onChange={(v) => update({ key: v })}
              placeholder="reCAPTCHA site key"
              helperText="The actual reCAPTCHA site key issued by Google."
            />
          ) : null}
          {editable.has("keyName") ? (
            <TextField
              label="reCAPTCHA Key Name"
              value={keyNameValue}
              onChange={(v) => update({ keyName: v })}
              placeholder="e.g. daikinFitLocal"
              helperText="A friendly identifier the runtime uses to look up this reCAPTCHA configuration."
            />
          ) : null}
          {editable.has("actions") ? (
            <ActionsEditor actions={actionsValue} onChange={(next) => update({ actions: next })} />
          ) : null}
          {slotTemplate.deepFields && slotTemplate.deepFields.length > 0 ? (
            <div className="space-y-2">
              {slotTemplate.deepFields.map((field) => (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={slotState.edits.deep?.[field.key] ?? ""}
                  onChange={(v) =>
                    update({ deep: { ...(slotState.edits.deep ?? {}), [field.key]: v } })
                  }
                />
              ))}
            </div>
          ) : null}
          {slotTemplate.editable.length === 0 &&
          !(slotTemplate.deepFields && slotTemplate.deepFields.length > 0) ? (
            <p className="text-[11px] italic text-slate-400">
              Component preserved as-is from the template (deep edits via JSON export).
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function StepCard({
  template,
  step,
  onChange,
}: {
  template: StepTemplate;
  step: StepState;
  onChange: (next: StepState) => void;
}) {
  const updateSlot = (which: "main" | "footer", slotId: string, next: SlotState) => {
    if (which === "main") {
      onChange({ ...step, mainSlots: { ...step.mainSlots, [slotId]: next } });
    } else {
      onChange({ ...step, footerSlots: { ...step.footerSlots, [slotId]: next } });
    }
  };

  return (
    <SectionCard
      enabled={step.enabled}
      onToggleEnabled={(v) => onChange({ ...step, enabled: v })}
      title={template.displayName}
    >
      {step.enabled ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Stepper Label"
              value={step.stepperLabel}
              onChange={(v) => onChange({ ...step, stepperLabel: v })}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Title"
              value={step.heading.title ?? ""}
              onChange={(v) =>
                onChange({ ...step, heading: { ...step.heading, title: v || undefined } })
              }
            />
            <TextField
              label="Subtitle"
              value={step.heading.subtitle ?? ""}
              onChange={(v) =>
                onChange({ ...step, heading: { ...step.heading, subtitle: v || undefined } })
              }
            />
          </div>
          <TextField
            label="Description"
            value={step.heading.description ?? ""}
            onChange={(v) =>
              onChange({ ...step, heading: { ...step.heading, description: v || undefined } })
            }
          />

          {template.mainSlots.length > 0 ? (
            <div className="space-y-2">
              <p className={CFG_LABEL}>Page content</p>
              {renderGroupedSlots(
                template.mainSlots,
                step.mainSlots,
                step.stepperLabel,
                (slotId, next) => updateSlot("main", slotId, next),
              )}
              {step.extraMain.length > 0 ? (
                <p className="text-[11px] italic text-slate-400">
                  + {step.extraMain.length} unmatched main component
                  {step.extraMain.length === 1 ? "" : "s"} preserved from import.
                </p>
              ) : null}
            </div>
          ) : null}

          {template.footerSlots.length > 0 ? (
            <div className="space-y-2 border-t border-cyan-400/10 pt-3">
              <p className={CFG_LABEL}>Page actions</p>
              {renderGroupedSlots(
                template.footerSlots,
                step.footerSlots,
                step.stepperLabel,
                (slotId, next) => updateSlot("footer", slotId, next),
              )}
              {step.extraFooter.length > 0 ? (
                <p className="text-[11px] italic text-slate-400">
                  + {step.extraFooter.length} unmatched footer component
                  {step.extraFooter.length === 1 ? "" : "s"} preserved from import.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-xs italic text-slate-500">
          Step disabled. Toggle the rail to include it in the workflow.
        </p>
      )}
    </SectionCard>
  );
}
