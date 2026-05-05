"use client";

import type { SlotEdits, SlotState, StepState } from "@/data/schema-configurator-model";
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
    <div className="space-y-2 rounded-md border border-dashed border-amber-300 bg-amber-50/40 p-2">
      <p className={`${CFG_LABEL} text-amber-800`}>actions</p>
      {actions.length === 0 ? (
        <p className="text-[11px] italic text-gray-500">No actions.</p>
      ) : null}
      {actions.map((action, i) => {
        const needsModule = action.type === "moduleAction";
        const needsTargetPath = action.type === "flipBool" || action.type === "setValue";
        const needsValue = action.type === "setValue";
        const needsName = action.type === "moduleAction" || action.type === "setValue" || action.type === "flipBool";
        return (
          <div key={i} className="space-y-1.5 rounded border border-amber-200 bg-white p-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-gray-500">#{i + 1}</span>
              <select
                value={KNOWN_ACTION_TYPES.includes(action.type as KnownActionType) ? action.type : "__custom"}
                onChange={(e) => {
                  const t = e.target.value;
                  if (t === "__custom") return;
                  update(i, { type: t });
                }}
                className="rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
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
                className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                aria-label="move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === actions.length - 1}
                className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                aria-label="move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="ml-auto rounded border border-red-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            {needsModule ? (
              <input
                type="text"
                value={action.module ?? ""}
                onChange={(e) => update(i, { module: e.target.value })}
                placeholder="module (e.g., propertyInfo, bundles)"
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-[11px] shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            ) : null}
            {needsName ? (
              <input
                type="text"
                value={action.name ?? ""}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder={action.type === "moduleAction" ? "name (action on module)" : "name (optional)"}
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-[11px] shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            ) : null}
            {needsTargetPath ? (
              <input
                type="text"
                value={action.targetPath ?? ""}
                onChange={(e) => update(i, { targetPath: e.target.value })}
                placeholder="targetPath (e.g., @workflow.foo.bar)"
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-[11px] shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
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
                placeholder='value as JSON (e.g., true, false, "string", 123)'
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-[11px] shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        onClick={add}
        className="rounded border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-amber-800 hover:bg-amber-50"
      >
        + Add action
      </button>
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: NonNullable<SlotEdits["options"]>;
  onChange: (next: NonNullable<SlotEdits["options"]>) => void;
}) {
  const update = (i: number, patch: Partial<{ label: string; targetPath: string }>) => {
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  };
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
  const add = () => onChange([...options, { label: "", targetPath: "" }]);

  return (
    <div className="space-y-2 rounded-md border border-dashed border-sky-300 bg-sky-50/40 p-2">
      <p className={CFG_LABEL}>options</p>
      {options.length === 0 ? (
        <p className="text-[11px] italic text-gray-500">No options.</p>
      ) : null}
      {options.map((opt, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-gray-500">#{i + 1}</span>
          <input
            type="text"
            value={opt.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Label"
            className="min-w-[10rem] flex-1 rounded border border-gray-200 bg-white px-1.5 py-1 text-xs shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
          <input
            type="text"
            value={opt.targetPath}
            onChange={(e) => update(i, { targetPath: e.target.value })}
            placeholder="@workflow.goals.…"
            className="min-w-[12rem] flex-1 rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-[11px] shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="rounded border border-red-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded border border-sky-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-sky-700 hover:bg-sky-50"
      >
        + Add option
      </button>
    </div>
  );
}

function SlotRow({
  slotTemplate,
  slotState,
  onChange,
}: {
  slotTemplate: SlotTemplate;
  slotState: SlotState;
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
  const baseBinding =
    typeof slotTemplate.baseNode.binding === "string" ? slotTemplate.baseNode.binding : "";
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

  const editable = new Set<string>(slotTemplate.editable);
  const labelValue = slotState.edits.label ?? baseLabel;
  const requiredValue = slotState.edits.required ?? baseRequired;
  const defaultValue = slotState.edits.default ?? baseDefault;
  const contentValue = slotState.edits.content ?? baseContent;
  const bindingValue = slotState.edits.binding ?? baseBinding;
  const actionsValue = slotState.edits.actions ?? baseActions;
  const optionsValue = slotState.edits.options ?? baseOptions;
  const selectionRulesValue = slotState.edits.selectionRules ?? {
    minimum: baseSelectionRules.minimum ?? 0,
    maximum: baseSelectionRules.maximum ?? 0,
  };

  const enabled = slotState.enabled;

  return (
    <div className={`rounded-lg border ${enabled ? "border-gray-200" : "border-gray-200 opacity-80"} bg-white p-3 shadow-sm`}>
      <div className="flex flex-wrap items-start gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={enabled}
          aria-label={`${slotTemplate.displayName}: ${enabled ? "on" : "off"}`}
          onClick={() => onChange({ ...slotState, enabled: !enabled })}
          className="mt-0.5 rounded p-0.5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 hover:opacity-90"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 bg-white ${
              enabled ? "border-sky-500" : "border-gray-400"
            }`}
            aria-hidden
          >
            {enabled ? (
              <svg className="h-3 w-3 text-sky-500" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
                <path d="M2.5 6l2.5 2.5L9.5 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-semibold ${enabled ? "text-gray-800" : "text-gray-400"}`}>
              {slotTemplate.displayName}
            </span>
            <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[10px] text-sky-700">
              {slotTemplate.baseNode.component}
            </span>
          </div>
          {slotTemplate.hint ? (
            <p className="mt-1 text-[11px] text-gray-500">{slotTemplate.hint}</p>
          ) : null}
        </div>
      </div>

      {enabled ? (
        <div className="mt-3 space-y-2 pl-7">
          {editable.has("label") ? (
            <TextField
              label="properties.label"
              value={labelValue}
              onChange={(v) => update({ label: v })}
            />
          ) : null}
          {editable.has("content") ? (
            <TextField
              label="properties.content"
              value={contentValue}
              onChange={(v) => update({ content: v })}
            />
          ) : null}
          {editable.has("binding") ? (
            <TextField
              label="binding"
              value={bindingValue}
              onChange={(v) => update({ binding: v })}
              placeholder="@module.path.to.field"
            />
          ) : null}
          {editable.has("required") ? (
            <InlineToggle
              checked={requiredValue}
              onChange={(v) => update({ required: v })}
              label="properties.required"
            />
          ) : null}
          {editable.has("default") ? (
            <InlineToggle
              checked={defaultValue}
              onChange={(v) => update({ default: v })}
              label="properties.default"
            />
          ) : null}
          {editable.has("selectionRules") ? (
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="selectionRules.minimum"
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
                label="selectionRules.maximum"
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
            <OptionsEditor options={optionsValue} onChange={(next) => update({ options: next })} />
          ) : null}
          {editable.has("actions") ? (
            <ActionsEditor actions={actionsValue} onChange={(next) => update({ actions: next })} />
          ) : null}
          {slotTemplate.editable.length === 0 ? (
            <p className="text-[11px] italic text-gray-500">
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
      subtitle={`step: ${template.step}`}
    >
      {step.enabled ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="stepperLabel"
              value={step.stepperLabel}
              onChange={(v) => onChange({ ...step, stepperLabel: v })}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="heading.title"
              value={step.heading.title ?? ""}
              onChange={(v) =>
                onChange({ ...step, heading: { ...step.heading, title: v || undefined } })
              }
            />
            <TextField
              label="heading.subtitle"
              value={step.heading.subtitle ?? ""}
              onChange={(v) =>
                onChange({ ...step, heading: { ...step.heading, subtitle: v || undefined } })
              }
            />
          </div>
          <TextField
            label="heading.description"
            value={step.heading.description ?? ""}
            onChange={(v) =>
              onChange({ ...step, heading: { ...step.heading, description: v || undefined } })
            }
          />

          {template.mainSlots.length > 0 ? (
            <div className="space-y-2">
              <p className={CFG_LABEL}>main components</p>
              {template.mainSlots.map((tpl) => {
                const slotState = step.mainSlots[tpl.slotId];
                if (!slotState) return null;
                return (
                  <SlotRow
                    key={tpl.slotId}
                    slotTemplate={tpl}
                    slotState={slotState}
                    onChange={(next) => updateSlot("main", tpl.slotId, next)}
                  />
                );
              })}
              {step.extraMain.length > 0 ? (
                <p className="text-[11px] italic text-gray-500">
                  + {step.extraMain.length} unmatched main component
                  {step.extraMain.length === 1 ? "" : "s"} preserved from import.
                </p>
              ) : null}
            </div>
          ) : null}

          {template.footerSlots.length > 0 ? (
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <p className={CFG_LABEL}>footer components</p>
              {template.footerSlots.map((tpl) => {
                const slotState = step.footerSlots[tpl.slotId];
                if (!slotState) return null;
                return (
                  <SlotRow
                    key={tpl.slotId}
                    slotTemplate={tpl}
                    slotState={slotState}
                    onChange={(next) => updateSlot("footer", tpl.slotId, next)}
                  />
                );
              })}
              {step.extraFooter.length > 0 ? (
                <p className="text-[11px] italic text-gray-500">
                  + {step.extraFooter.length} unmatched footer component
                  {step.extraFooter.length === 1 ? "" : "s"} preserved from import.
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-xs italic text-gray-400">
          Step disabled. Toggle the rail to include it in the workflow.
        </p>
      )}
    </SectionCard>
  );
}
