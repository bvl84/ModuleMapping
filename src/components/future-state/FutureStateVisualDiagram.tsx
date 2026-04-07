"use client";

import { useCallback, useState } from "react";
import {
  BACKGROUND_IMAGE_SLOTS,
  BC_FIELD_HELP,
  CLIENT_ID_FIELD_HELP,
  META_DESCRIPTION_FIELD_HELP,
  META_TITLE_FIELD_HELP,
  OPTION_DISPLAY_VALUE_HELP,
  WF_NAME_FIELD_HELP,
  WORKFLOW_GOOGLE_FONTS,
  type FutureStateConfigItem,
  type FutureStateModuleEntry,
  type FutureStateWorkflowProfile,
  type WorkflowGoogleFontId,
} from "@/data/future-state-visual";
import { FutureStateLiveConfigOutput } from "./FutureStateLiveConfigOutput";

/** Accent palette aligned with light “Module Control” UI */
const accent = {
  railOn: "bg-sky-400",
  railOff: "bg-gray-200",
  pillOn: "border-sky-400 bg-sky-50 text-sky-700",
  pillOff: "border-gray-300 bg-white text-gray-500",
};

type Pill = { label: string; active: boolean };

const CFG_LABEL = "text-[10px] font-semibold uppercase tracking-wide text-sky-800/90";

const MODULE_JOB_STATUS = "Job Status";
const MODULE_SUMMARY = "Summary";
const CONFIG_SCHEDULE_INSPECTION = "Schedule Inspection";
const CONFIG_ALTERNATIVE_OPTIONS = "Alternative options";
const CONFIG_BEST_MATCH = "Best match";
const CONFIG_GOOD_BETTER_BEST = "Good Better Best";
const CONFIG_TOTAL_OPTIONS = "Total options";
const CONFIG_MAX_SELECTIONS = "Max selections";

function maxSelectionsCapFromConfig(cfg: FutureStateConfigItem[]): number {
  const total = cfg.find((c) => c.name === CONFIG_TOTAL_OPTIONS);
  if (!total) return 99;
  if (total.display === false) {
    return Math.max(0, total.optionCount ?? total.options?.length ?? 0);
  }
  return Math.max(0, (total.options ?? []).filter((o) => o.display !== false).length);
}

/** When Max selections is on and cap ≥ 1, value must be at least 1. */
function maxSelectionsClampRange(maxSelRowOn: boolean, cap: number): { min: number; max: number } {
  const max = Math.max(0, cap);
  if (!maxSelRowOn) return { min: 0, max };
  if (max >= 1) return { min: 1, max };
  return { min: 0, max: 0 };
}

function clampMaxSelectionsInEntry(entry: FutureStateModuleEntry): void {
  const cfg = entry.details?.configuration;
  if (!cfg) return;
  const maxSel = cfg.find((c) => c.name === CONFIG_MAX_SELECTIONS);
  if (!maxSel || maxSel.configValue == null) return;
  const cap = maxSelectionsCapFromConfig(cfg);
  const on = maxSel.display !== false;
  const { min, max } = maxSelectionsClampRange(on, cap);
  maxSel.configValue = Math.min(Math.max(min, maxSel.configValue), max);
}

function configItemAtPath(
  rootList: FutureStateConfigItem[],
  path: number[],
): FutureStateConfigItem | null {
  if (path.length === 0) return null;
  let list: FutureStateConfigItem[] | undefined = rootList;
  let item: FutureStateConfigItem | undefined;
  for (let d = 0; d < path.length; d++) {
    if (!list) return null;
    item = list[path[d]];
    if (!item) return null;
    if (d < path.length - 1) {
      list = item.configuration;
    }
  }
  return item ?? null;
}

/** Best match vs Good Better Best are mutually exclusive; Alternative options allowed when either is on. */
function applySummaryMatchGbbRules(
  entries: FutureStateModuleEntry[],
  entryIndex: number,
  path: number[],
  patch: Partial<FutureStateConfigItem>,
): void {
  const summaryIdx = entries.findIndex((e) => e.nameId === MODULE_SUMMARY);
  if (summaryIdx < 0 || entryIndex !== summaryIdx) return;
  const cfg = entries[summaryIdx].details?.configuration;
  if (!cfg || path.length < 1) return;

  const leaf = configItemAtPath(cfg, path);
  if (!leaf?.name) return;

  const bm = cfg.find((c) => c.name === CONFIG_BEST_MATCH);
  const gbb = cfg.find((c) => c.name === CONFIG_GOOD_BETTER_BEST);
  const alt = cfg.find((c) => c.name === CONFIG_ALTERNATIVE_OPTIONS);

  if (patch.display === true && leaf.name === CONFIG_BEST_MATCH) {
    if (gbb) gbb.display = false;
  }
  if (patch.display === true && leaf.name === CONFIG_GOOD_BETTER_BEST) {
    if (bm) bm.display = false;
  }

  const bmOn = bm?.display !== false;
  const gbbOn = gbb?.display !== false;
  if (patch.display === true && leaf.name === CONFIG_ALTERNATIVE_OPTIONS && !bmOn && !gbbOn && alt) {
    alt.display = false;
  }

  if (alt && !bmOn && !gbbOn) {
    alt.display = false;
  }
}

/** When Job Status step is on, Schedule Inspection under Summary must stay on. */
function applyJobStatusScheduleInspectionRules(entries: FutureStateModuleEntry[]): void {
  const jobIdx = entries.findIndex((e) => e.nameId === MODULE_JOB_STATUS);
  const summaryIdx = entries.findIndex((e) => e.nameId === MODULE_SUMMARY);
  if (jobIdx < 0 || summaryIdx < 0) return;
  const jobOn = entries[jobIdx].display !== false;
  if (!jobOn) return;
  const cfg = entries[summaryIdx].details?.configuration;
  if (!cfg) return;
  const si = cfg.find((c) => c.name === CONFIG_SCHEDULE_INSPECTION);
  if (si && si.display === false) si.display = true;
}

function patchConfigItemAtPath(
  entries: FutureStateModuleEntry[],
  entryIndex: number,
  path: number[],
  patch: Partial<FutureStateConfigItem>,
): FutureStateModuleEntry[] {
  const next = structuredClone(entries) as FutureStateModuleEntry[];
  const entry = next[entryIndex];
  if (!entry?.details?.configuration) return next;
  let list = entry.details.configuration;
  for (let d = 0; d < path.length - 1; d++) {
    const parent = list[path[d]];
    if (!parent?.configuration) return next;
    list = parent.configuration;
  }
  const leaf = list[path[path.length - 1]];
  if (!leaf) return next;
  Object.assign(leaf, patch);
  applyJobStatusScheduleInspectionRules(next);
  applySummaryMatchGbbRules(next, entryIndex, path, patch);
  clampMaxSelectionsInEntry(next[entryIndex]);
  return next;
}

function patchOptionAtPath(
  entries: FutureStateModuleEntry[],
  entryIndex: number,
  configPath: number[],
  optionIndex: number,
  patch: Partial<FutureStateConfigItem>,
): FutureStateModuleEntry[] {
  const next = structuredClone(entries) as FutureStateModuleEntry[];
  const entry = next[entryIndex];
  if (!entry?.details?.configuration) return next;
  let list = entry.details.configuration;
  for (let d = 0; d < configPath.length - 1; d++) {
    const parent = list[configPath[d]];
    if (!parent?.configuration) return next;
    list = parent.configuration;
  }
  const leaf = list[configPath[configPath.length - 1]];
  if (!leaf?.options?.[optionIndex]) return next;
  Object.assign(leaf.options[optionIndex], patch);
  applyJobStatusScheduleInspectionRules(next);
  clampMaxSelectionsInEntry(next[entryIndex]);
  return next;
}

function patchEntryDisplay(
  entries: FutureStateModuleEntry[],
  entryIndex: number,
  display: boolean,
): FutureStateModuleEntry[] {
  const next = structuredClone(entries) as FutureStateModuleEntry[];
  next[entryIndex].display = display;
  applyJobStatusScheduleInspectionRules(next);
  return next;
}

function hasReferenceFieldLabels(item: FutureStateConfigItem) {
  return (
    item.reference3Label !== undefined ||
    item.reference4Label !== undefined ||
    item.reference5Label !== undefined
  );
}

function ModuleCheckbox({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 bg-white ${
        selected ? "border-sky-500" : "border-gray-400"
      }`}
      aria-hidden
    >
      {selected ? (
        <svg className="h-3 w-3 text-sky-500" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 6l2.5 2.5L9.5 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

function TagPill({ label, active }: Pill) {
  return (
    <span
      className={`inline-flex max-w-full rounded-full border px-3 py-1 text-sm font-medium leading-tight ${
        active ? accent.pillOn : accent.pillOff
      }`}
    >
      {label}
    </span>
  );
}

type PatchHandler = (entryIndex: number, path: number[], patch: Partial<FutureStateConfigItem>) => void;

type PatchOptionHandler = (
  entryIndex: number,
  configPath: number[],
  optionIndex: number,
  patch: Partial<FutureStateConfigItem>,
) => void;

function ConfigItemBlock({
  item,
  depth = 0,
  entryIndex,
  pathPrefix,
  peerConfiguration,
  onPatch,
  onPatchOption,
  jobStatusModuleOn,
  summaryAllowsAlternativeOptions,
}: {
  item: FutureStateConfigItem;
  depth?: number;
  entryIndex: number;
  pathPrefix: number[];
  /** Sibling config rows at this level (for Max selections cap vs Total options). */
  peerConfiguration?: FutureStateConfigItem[];
  onPatch: PatchHandler;
  onPatchOption: PatchOptionHandler;
  jobStatusModuleOn: boolean;
  summaryAllowsAlternativeOptions: boolean;
}) {
  const scheduleLocked = jobStatusModuleOn && item.name === CONFIG_SCHEDULE_INSPECTION;
  const alternativeOptionsLocked =
    item.name === CONFIG_ALTERNATIVE_OPTIONS && !summaryAllowsAlternativeOptions;
  const active = scheduleLocked
    ? true
    : alternativeOptionsLocked
      ? false
      : item.display !== false;
  const hasName = item.name != null;
  const hasOptions = (item.options?.length ?? 0) > 0;
  const hasConfigValue = item.configValue != null;
  const hasNestedConfig = (item.configuration?.length ?? 0) > 0;
  const showReferenceFields = hasReferenceFieldLabels(item);
  const showAlternativeImages = item.name === CONFIG_ALTERNATIVE_OPTIONS;
  const maxSelectionsCap =
    peerConfiguration != null ? maxSelectionsCapFromConfig(peerConfiguration) : 99;
  const maxSelBounds = maxSelectionsClampRange(active, maxSelectionsCap);

  const shell =
    depth > 0
      ? "ml-2 border-l-2 border-sky-300 bg-sky-50/20"
      : "border-gray-200 bg-white";

  const toggleDisplay = () => {
    if (scheduleLocked || alternativeOptionsLocked) return;
    onPatch(entryIndex, pathPrefix, { display: !active });
  };

  return (
    <div className={`rounded-lg border shadow-sm ${shell}`}>
      <div className="space-y-2 p-3">
        {hasName ? (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={active}
                aria-disabled={scheduleLocked || alternativeOptionsLocked}
                disabled={scheduleLocked || alternativeOptionsLocked}
                title={
                  scheduleLocked
                    ? "Turn off the Job Status step to disable Schedule Inspection"
                    : alternativeOptionsLocked
                      ? "Turn on Best match or Good Better Best to enable Alternative options"
                      : undefined
                }
                aria-label={`${item.name}: ${active ? "on" : "off"}`}
                className="rounded p-0.5 text-left focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 hover:enabled:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={toggleDisplay}
              >
                <ModuleCheckbox selected={active} />
              </button>
              <span className={`text-sm font-semibold ${active ? "text-gray-800" : "text-gray-400"}`}>
                {item.name}
              </span>
            </div>
            {scheduleLocked ? (
              <p className="pl-7 text-xs text-sky-800/85">Stays on while the Job Status step is enabled.</p>
            ) : null}
            {alternativeOptionsLocked ? (
              <p className="pl-7 text-xs text-teal-800/90">
                Turn on <span className="font-semibold">Best match</span> or{" "}
                <span className="font-semibold">Good Better Best</span> to enable this config.
              </p>
            ) : null}
          </div>
        ) : null}

        {item.summary ? <p className="text-xs leading-relaxed text-gray-500">{item.summary}</p> : null}

        {showReferenceFields ? (
          <div
            className={`mt-1 rounded-md border border-dashed border-violet-200 bg-violet-50/50 p-3 ${
              !active ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <p className={`${CFG_LABEL} mb-3`}>Reference field labels</p>
            <div className="space-y-2.5">
              {(
                [
                  { key: "reference3Label" as const, ref: "Reference 3" },
                  { key: "reference4Label" as const, ref: "Reference 4" },
                  { key: "reference5Label" as const, ref: "Reference 5" },
                ] as const
              ).map(({ key, ref }) => (
                <label key={key} className="block">
                  <span className="mb-1 block font-mono text-[11px] font-medium text-violet-900">{ref}</span>
                  <input
                    type="text"
                    value={item[key] ?? ""}
                    onChange={(e) => onPatch(entryIndex, pathPrefix, { [key]: e.target.value })}
                    placeholder={
                      key === "reference3Label" ? "example: Cinch ID" : "Field display name"
                    }
                    disabled={!active}
                    className="w-full max-w-md rounded-md border border-gray-300 bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-gray-100"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {showAlternativeImages ? (
          <div
            className={`mt-1 rounded-md border border-dashed border-teal-300 bg-teal-50/50 p-3 ${
              !active || alternativeOptionsLocked ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <p className={`${CFG_LABEL} mb-3`}>Images (3 slots)</p>
            <p className="mb-3 text-xs text-gray-600">
              Add a URL or path for each alternative option image shown in the workflow.
            </p>
            <div className="space-y-3">
              {(
                [
                  { key: "alternativeImage1" as const, n: 1 },
                  { key: "alternativeImage2" as const, n: 2 },
                  { key: "alternativeImage3" as const, n: 3 },
                ] as const
              ).map(({ key, n }) => (
                <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <label className="font-mono text-[11px] font-semibold text-teal-900">Image {n}</label>
                    <input
                      type="url"
                      value={item[key] ?? ""}
                      onChange={(e) => onPatch(entryIndex, pathPrefix, { [key]: e.target.value })}
                      placeholder="https://… or asset path"
                      disabled={!active}
                      className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex h-16 w-full shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white sm:h-[4.5rem] sm:w-24">
                    {item[key] ? (
                      <img
                        src={item[key]}
                        alt=""
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                        Preview
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {hasOptions ? (
          <div
            className={`rounded-md border border-dashed border-sky-300 bg-sky-50/60 p-3 ${
              !active ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <p className={`${CFG_LABEL} mb-3`}>
              Option values
              <span className="ml-1.5 font-mono text-[11px] font-normal normal-case tracking-normal text-gray-600">
                up to {item.optionCount ?? item.options!.length} slots — toggle each and set the label shown in the
                workflow
              </span>
            </p>
            <div className="space-y-2.5">
              {item.options!.map((o, oi) => {
                const optOn = o.display !== false;
                const slotLabel = `Value ${oi + 1}`;
                return (
                  <div key={oi} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={optOn}
                      aria-label={`${slotLabel}: ${optOn ? "on" : "off"}`}
                      className="shrink-0 rounded p-0.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 disabled:opacity-40"
                      disabled={!active}
                      onClick={() =>
                        onPatchOption(entryIndex, pathPrefix, oi, { display: !optOn })
                      }
                    >
                      <ModuleCheckbox selected={optOn} />
                    </button>
                    <span
                      className={`shrink-0 font-mono text-[11px] font-semibold tabular-nums ${
                        optOn && active ? "text-sky-900" : "text-gray-400"
                      }`}
                    >
                      {slotLabel}
                    </span>
                    <input
                      type="text"
                      value={o.field ?? o.name ?? ""}
                      onChange={(e) =>
                        onPatchOption(entryIndex, pathPrefix, oi, { field: e.target.value })
                      }
                      placeholder={OPTION_DISPLAY_VALUE_HELP}
                      disabled={!active}
                      className="min-w-[12rem] flex-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-gray-100"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {hasConfigValue ? (
          item.name === CONFIG_MAX_SELECTIONS ? (
            <div
              className={`rounded-md border border-dashed border-amber-300 bg-amber-50/50 p-3 ${
                !active ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <span className={CFG_LABEL}>Setting</span>
                <input
                  id={`max-sel-${entryIndex}-${pathPrefix.join("-")}`}
                  type="number"
                  inputMode="numeric"
                  min={maxSelBounds.min}
                  max={maxSelBounds.max}
                  step={1}
                  value={item.configValue ?? 0}
                  disabled={!active}
                  aria-valuemin={maxSelBounds.min}
                  aria-valuemax={maxSelBounds.max}
                  aria-label="Max selections"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const fallback = item.configValue ?? maxSelBounds.min;
                    const parsed = raw === "" ? maxSelBounds.min : Number.parseInt(raw, 10);
                    const n = Number.isFinite(parsed) ? parsed : fallback;
                    const clamped = Math.min(Math.max(maxSelBounds.min, n), maxSelBounds.max);
                    onPatch(entryIndex, pathPrefix, { configValue: clamped });
                  }}
                  className="w-28 rounded-md border border-amber-400 bg-white px-2.5 py-1.5 font-mono text-sm font-semibold text-amber-950 tabular-nums shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-gray-100 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
                />
                <span className="text-xs text-gray-600">
                  Max ≤ {maxSelectionsCap}
                  {peerConfiguration?.find((c) => c.name === CONFIG_TOTAL_OPTIONS)?.display !== false
                    ? " (enabled options when Total options is on)"
                    : " (total slots)"}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-amber-300 bg-amber-50/50 p-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className={CFG_LABEL}>Setting</span>
                <span className="rounded-md border border-amber-400 bg-white px-2.5 py-1 font-mono text-sm font-semibold text-amber-950 tabular-nums">
                  {item.configValue}
                </span>
                <span className="text-xs text-gray-600">numeric value for this config</span>
              </div>
            </div>
          )
        ) : null}

        {hasNestedConfig ? (
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <p className={CFG_LABEL}>Sub-configuration</p>
            {item.configuration!.map((child, ci) => (
              <ConfigItemBlock
                key={child.name ?? `nested-${ci}`}
                item={child}
                depth={depth + 1}
                entryIndex={entryIndex}
                pathPrefix={[...pathPrefix, ci]}
                peerConfiguration={item.configuration}
                onPatch={onPatch}
                onPatchOption={onPatchOption}
                jobStatusModuleOn={jobStatusModuleOn}
                summaryAllowsAlternativeOptions={summaryAllowsAlternativeOptions}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ModuleConfigurationTree({
  entryIndex,
  items,
  onPatch,
  onPatchOption,
  jobStatusModuleOn,
  summaryAllowsAlternativeOptions,
  pathPrefix = [],
}: {
  entryIndex: number;
  items: FutureStateConfigItem[];
  onPatch: PatchHandler;
  onPatchOption: PatchOptionHandler;
  jobStatusModuleOn: boolean;
  summaryAllowsAlternativeOptions: boolean;
  pathPrefix?: number[];
}) {
  return (
    <div className="mt-3 space-y-3">
      {items.map((item, i) => (
        <ConfigItemBlock
          key={item.name ?? `row-${i}`}
          item={item}
          entryIndex={entryIndex}
          pathPrefix={[...pathPrefix, i]}
          peerConfiguration={items}
          onPatch={onPatch}
          onPatchOption={onPatchOption}
          jobStatusModuleOn={jobStatusModuleOn}
          summaryAllowsAlternativeOptions={summaryAllowsAlternativeOptions}
        />
      ))}
    </div>
  );
}

type ProfileTextFieldKey = "wfName" | "clientId" | "metaTitle" | "metaDescription" | "BC";

function WorkflowProfileCard({
  profile,
  onFontChange,
  onToggleLayout,
  onProfileTextChange,
  onWfTypeChange,
}: {
  profile: FutureStateWorkflowProfile;
  onFontChange: (font: WorkflowGoogleFontId) => void;
  onToggleLayout: (part: "header" | "footer") => void;
  onProfileTextChange: (key: ProfileTextFieldKey, value: string) => void;
  onWfTypeChange: (next: "Direct" | "Indirect") => void;
}) {
  const [blurred, setBlurred] = useState({
    wfName: false,
    clientId: false,
    title: false,
    desc: false,
    bc: false,
  });
  const wfNameInvalid = blurred.wfName && !profile.wfName.trim();
  const clientIdInvalid = blurred.clientId && !profile.clientId.trim();
  const titleInvalid = blurred.title && !profile.metaTitle.trim();
  const descInvalid = blurred.desc && !profile.metaDescription.trim();
  const bcInvalid = blurred.bc && !profile.BC.trim();

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`flex w-12 shrink-0 flex-col items-center justify-center py-5 ${accent.railOn}`}
        aria-hidden
      >
        <ModuleCheckbox selected />
      </div>
      <div className="min-w-0 flex-1 px-4 py-4">
        <h2 className="text-base font-bold tracking-tight text-gray-800">Workflow definition</h2>
        <p className="mt-0.5 text-xs text-gray-400">Set before module steps (edit on Future State tab)</p>

        <div className="mt-3 space-y-3">
          <div>
            <label className="font-mono text-xs font-semibold text-sky-800" htmlFor="wf-name">
              wfName <span className="text-red-600">*</span>
            </label>
            <input
              id="wf-name"
              type="text"
              value={profile.wfName}
              onChange={(e) => onProfileTextChange("wfName", e.target.value)}
              onBlur={() => setBlurred((b) => ({ ...b, wfName: true }))}
              placeholder={WF_NAME_FIELD_HELP}
              required
              aria-required="true"
              aria-invalid={wfNameInvalid}
              className={`mt-1 w-full rounded-md border bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                wfNameInvalid
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:border-sky-400 focus:ring-sky-400"
              }`}
            />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold text-sky-800" id="wf-type-label">
              wfType
            </p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="group"
              aria-labelledby="wf-type-label"
            >
              <button
                type="button"
                aria-pressed={profile.wfType === "Direct"}
                onClick={() => onWfTypeChange("Direct")}
                className={`inline-flex max-w-full rounded-full border px-3 py-1 text-sm font-medium leading-tight transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  profile.wfType === "Direct" ? accent.pillOn : accent.pillOff
                }`}
              >
                Direct
              </button>
              <button
                type="button"
                aria-pressed={profile.wfType === "Indirect"}
                onClick={() => onWfTypeChange("Indirect")}
                className={`inline-flex max-w-full rounded-full border px-3 py-1 text-sm font-medium leading-tight transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  profile.wfType === "Indirect" ? accent.pillOn : accent.pillOff
                }`}
              >
                Indirect
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-xs font-semibold text-sky-800" htmlFor="wf-client-id">
              clientId <span className="text-red-600">*</span>
            </label>
            <input
              id="wf-client-id"
              type="text"
              value={profile.clientId}
              onChange={(e) => onProfileTextChange("clientId", e.target.value)}
              onBlur={() => setBlurred((b) => ({ ...b, clientId: true }))}
              placeholder={CLIENT_ID_FIELD_HELP}
              required
              aria-required="true"
              aria-invalid={clientIdInvalid}
              className={`mt-1 w-full rounded-md border bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                clientIdInvalid
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:border-sky-400 focus:ring-sky-400"
              }`}
            />
          </div>
          <div>
            <label className="font-mono text-xs font-semibold text-sky-800" htmlFor="wf-meta-title">
              meta title <span className="text-red-600">*</span>
            </label>
            <input
              id="wf-meta-title"
              type="text"
              value={profile.metaTitle}
              onChange={(e) => onProfileTextChange("metaTitle", e.target.value)}
              onBlur={() => setBlurred((b) => ({ ...b, title: true }))}
              placeholder={META_TITLE_FIELD_HELP}
              required
              aria-required="true"
              aria-invalid={titleInvalid}
              className={`mt-1 w-full rounded-md border bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                titleInvalid
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:border-sky-400 focus:ring-sky-400"
              }`}
            />
          </div>
          <div>
            <label className="font-mono text-xs font-semibold text-sky-800" htmlFor="wf-meta-desc">
              meta description <span className="text-red-600">*</span>
            </label>
            <input
              id="wf-meta-desc"
              type="text"
              value={profile.metaDescription}
              onChange={(e) => onProfileTextChange("metaDescription", e.target.value)}
              onBlur={() => setBlurred((b) => ({ ...b, desc: true }))}
              placeholder={META_DESCRIPTION_FIELD_HELP}
              required
              aria-required="true"
              aria-invalid={descInvalid}
              className={`mt-1 w-full rounded-md border bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                descInvalid
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:border-sky-400 focus:ring-sky-400"
              }`}
            />
          </div>
          <div>
            <label className="font-mono text-xs font-semibold text-sky-800" htmlFor="wf-bc">
              BC <span className="text-red-600">*</span>
            </label>
            <input
              id="wf-bc"
              type="text"
              value={profile.BC}
              onChange={(e) => onProfileTextChange("BC", e.target.value)}
              onBlur={() => setBlurred((b) => ({ ...b, bc: true }))}
              placeholder={BC_FIELD_HELP}
              required
              aria-required="true"
              aria-invalid={bcInvalid}
              className={`mt-1 w-full rounded-md border bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                bcInvalid
                  ? "border-red-400 focus:border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:border-sky-400 focus:ring-sky-400"
              }`}
            />
          </div>
          <div>
            <p className="font-mono text-xs font-semibold text-sky-800">backgroundImage</p>
            <p className="mt-2 flex flex-wrap gap-2">
              {BACKGROUND_IMAGE_SLOTS.map((slot) => (
                <TagPill
                  key={slot}
                  label={`Image ${slot}`}
                  active={profile.backgroundImage === slot}
                />
              ))}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs font-semibold text-sky-800">Layout</p>
            <p className="mt-0.5 text-xs text-gray-500">Workflow chrome — toggle header and footer regions.</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={profile.header}
                  aria-label={`Header: ${profile.header ? "on" : "off"}`}
                  className="rounded p-0.5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 hover:opacity-90"
                  onClick={() => onToggleLayout("header")}
                >
                  <ModuleCheckbox selected={profile.header} />
                </button>
                <span className={`text-sm font-semibold ${profile.header ? "text-gray-800" : "text-gray-400"}`}>
                  Header
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={profile.footer}
                  aria-label={`Footer: ${profile.footer ? "on" : "off"}`}
                  className="rounded p-0.5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 hover:opacity-90"
                  onClick={() => onToggleLayout("footer")}
                >
                  <ModuleCheckbox selected={profile.footer} />
                </button>
                <span className={`text-sm font-semibold ${profile.footer ? "text-gray-800" : "text-gray-400"}`}>
                  Footer
                </span>
              </div>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs font-semibold text-sky-800">font</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Google Fonts — select one (sans-serif or serif).
            </p>
            <div role="radiogroup" aria-label="Workflow font" className="mt-3 space-y-3">
              {(["Sans-serif", "Serif"] as const).map((category) => (
                <div key={category}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{category}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {WORKFLOW_GOOGLE_FONTS.filter((f) => f.category === category).map((f) => {
                      const sel = profile.font === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          role="radio"
                          aria-checked={sel}
                          onClick={() => onFontChange(f.id)}
                          className={`inline-flex max-w-full rounded-full border px-3 py-1.5 text-sm font-medium leading-tight transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 ${
                            sel ? accent.pillOn : accent.pillOff
                          }`}
                          style={{ fontFamily: f.cssVar }}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleRow({
  entry,
  entryIndex,
  onPatch,
  onPatchOption,
  onToggleModuleDisplay,
  jobStatusModuleOn,
  summaryAllowsAlternativeOptions,
}: {
  entry: FutureStateModuleEntry;
  entryIndex: number;
  onPatch: PatchHandler;
  onPatchOption: PatchOptionHandler;
  onToggleModuleDisplay: (entryIndex: number) => void;
  jobStatusModuleOn: boolean;
  summaryAllowsAlternativeOptions: boolean;
}) {
  const selected = entry.display !== false;
  const configItems = entry.details?.configuration;

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`flex w-12 shrink-0 flex-col items-center justify-center py-5 ${selected ? accent.railOn : accent.railOff}`}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          aria-label={`${entry.nameId} step: ${selected ? "on" : "off"}`}
          className="flex min-h-[2.5rem] w-full flex-1 flex-col items-center justify-center bg-transparent p-1 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset"
          onClick={() => onToggleModuleDisplay(entryIndex)}
        >
          <ModuleCheckbox selected={selected} />
        </button>
      </div>
      <div className="min-w-0 flex-1 px-4 py-4">
        <h2 className="text-base font-bold tracking-tight text-gray-800">{entry.nameId}</h2>
        <p className="mt-0.5 text-xs text-gray-400">Step {entry.sort + 1}</p>

        {configItems && configItems.length > 0 ? (
          <ModuleConfigurationTree
            entryIndex={entryIndex}
            items={configItems}
            onPatch={onPatch}
            onPatchOption={onPatchOption}
            jobStatusModuleOn={jobStatusModuleOn}
            summaryAllowsAlternativeOptions={summaryAllowsAlternativeOptions}
          />
        ) : (
          <p className="mt-3 text-sm italic text-gray-400">No configuration items in profile.</p>
        )}
      </div>
    </div>
  );
}

export function FutureStateVisualDiagram({
  entries: initialEntries,
  workflowProfile: initialWorkflowProfile,
}: {
  entries: FutureStateModuleEntry[];
  workflowProfile: FutureStateWorkflowProfile;
}) {
  const [entries, setEntries] = useState<FutureStateModuleEntry[]>(() => {
    const next = structuredClone(initialEntries) as FutureStateModuleEntry[];
    for (const e of next) clampMaxSelectionsInEntry(e);
    return next;
  });

  const [profile, setProfile] = useState<FutureStateWorkflowProfile>(() =>
    structuredClone(initialWorkflowProfile),
  );

  const onFontChange = useCallback((font: WorkflowGoogleFontId) => {
    setProfile((p) => ({ ...p, font }));
  }, []);

  const onToggleLayout = useCallback((part: "header" | "footer") => {
    setProfile((p) => ({ ...p, [part]: !p[part] }));
  }, []);

  const onProfileTextChange = useCallback((key: ProfileTextFieldKey, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }));
  }, []);

  const onWfTypeChange = useCallback((wfType: "Direct" | "Indirect") => {
    setProfile((p) => ({ ...p, wfType }));
  }, []);

  const onPatch = useCallback<PatchHandler>((entryIndex, path, patch) => {
    setEntries((prev) => patchConfigItemAtPath(prev, entryIndex, path, patch));
  }, []);

  const onPatchOption = useCallback<PatchOptionHandler>((entryIndex, configPath, optionIndex, patch) => {
    setEntries((prev) => patchOptionAtPath(prev, entryIndex, configPath, optionIndex, patch));
  }, []);

  const onToggleModuleDisplay = useCallback((entryIndex: number) => {
    setEntries((prev) => {
      const cur = prev[entryIndex].display !== false;
      return patchEntryDisplay(prev, entryIndex, !cur);
    });
  }, []);

  const jobStatusModuleOn =
    entries.find((e) => e.nameId === MODULE_JOB_STATUS)?.display !== false;

  const summaryCfg = entries.find((e) => e.nameId === MODULE_SUMMARY)?.details?.configuration;
  const bestMatchOn = summaryCfg?.find((c) => c.name === CONFIG_BEST_MATCH)?.display !== false;
  const goodBetterBestOn =
    summaryCfg?.find((c) => c.name === CONFIG_GOOD_BETTER_BEST)?.display !== false;
  const summaryAllowsAlternativeOptions = bestMatchOn || goodBetterBestOn;

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-12 xl:gap-16">
      <div className="min-w-0 min-h-0 flex-1 space-y-5 lg:space-y-6">
        <WorkflowProfileCard
          profile={profile}
          onFontChange={onFontChange}
          onToggleLayout={onToggleLayout}
          onProfileTextChange={onProfileTextChange}
          onWfTypeChange={onWfTypeChange}
        />
        <div className="space-y-3">
          {entries.map((entry, entryIndex) => (
            <ModuleRow
              key={entry.nameId}
              entry={entry}
              entryIndex={entryIndex}
              onPatch={onPatch}
              onPatchOption={onPatchOption}
              onToggleModuleDisplay={onToggleModuleDisplay}
              jobStatusModuleOn={jobStatusModuleOn}
              summaryAllowsAlternativeOptions={summaryAllowsAlternativeOptions}
            />
          ))}
        </div>
      </div>
      <FutureStateLiveConfigOutput profile={profile} entries={entries} />
    </div>
  );
}
