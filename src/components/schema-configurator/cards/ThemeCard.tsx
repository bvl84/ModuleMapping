"use client";

import type { ThemeState } from "@/data/schema-configurator-model";
import {
  PALETTE_SHADE_KEYS,
  type ColorPalette,
  type LinearGradientBackground,
  type PaletteShade,
} from "@/data/standardized-schema";
import { CFG_LABEL, InlineToggle, SectionCard, TextField } from "../ConfiguratorUI";

function PaletteEditor({
  title,
  palette,
  onChange,
}: {
  title: string;
  palette: ColorPalette;
  onChange: (next: ColorPalette) => void;
}) {
  return (
    <div>
      <p className={CFG_LABEL}>{title}</p>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-3">
        {PALETTE_SHADE_KEYS.map((shade: PaletteShade) => {
          const value = palette[shade] ?? "";
          return (
            <div key={shade} className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2">
              <input
                type="color"
                value={value || "#ffffff"}
                onChange={(e) => onChange({ ...palette, [shade]: e.target.value })}
                aria-label={`${title} ${shade}`}
                className="h-8 w-8 shrink-0 cursor-pointer rounded border border-gray-300 bg-white"
              />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">{shade}</p>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange({ ...palette, [shade]: e.target.value })}
                  placeholder="#000000"
                  className="w-full rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-[11px] text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GradientEditor({
  background,
  onChange,
}: {
  background: LinearGradientBackground;
  onChange: (next: LinearGradientBackground) => void;
}) {
  const onStopChange = (i: number, patch: Partial<LinearGradientBackground["stops"][number]>) => {
    const next = structuredClone(background);
    next.stops[i] = { ...next.stops[i], ...patch };
    onChange(next);
  };

  const addStop = () => {
    const next = structuredClone(background);
    next.stops.push({ color: "rgba(255, 255, 255, 1)", position: "100%" });
    onChange(next);
  };

  const removeStop = (i: number) => {
    const next = structuredClone(background);
    next.stops.splice(i, 1);
    onChange(next);
  };

  const previewCss = `linear-gradient(${background.angle}deg, ${background.stops
    .map((s) => `${s.color} ${s.position}`)
    .join(", ")})`;

  return (
    <div className="space-y-3 rounded-md border border-dashed border-sky-300 bg-sky-50/40 p-3">
      <div className="flex flex-wrap items-end gap-3">
        <TextField
          id="bg-angle"
          label="angle (deg)"
          type="number"
          value={String(background.angle)}
          onChange={(v) => onChange({ ...background, angle: Number.parseFloat(v) || 0 })}
        />
        <div className="h-10 flex-1 min-w-[8rem] rounded-md border border-gray-300 shadow-inner" style={{ background: previewCss }} />
      </div>
      <div className="space-y-2">
        {background.stops.map((stop, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2 rounded-md border border-gray-200 bg-white p-2">
            <div className="flex-1 min-w-[12rem]">
              <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">color</p>
              <input
                type="text"
                value={stop.color}
                onChange={(e) => onStopChange(i, { color: e.target.value })}
                placeholder="rgba(...) or #hex"
                className="mt-0.5 w-full rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-xs text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
            <div className="w-24">
              <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">position</p>
              <input
                type="text"
                value={stop.position}
                onChange={(e) => onStopChange(i, { position: e.target.value })}
                placeholder="0%"
                className="mt-0.5 w-full rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-xs text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
            <button
              type="button"
              onClick={() => removeStop(i)}
              className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStop}
          className="rounded-md border border-sky-300 bg-white px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
        >
          + Add stop
        </button>
      </div>
    </div>
  );
}

export function ThemeCard({
  theme,
  onChange,
}: {
  theme: ThemeState;
  onChange: (next: ThemeState) => void;
}) {
  return (
    <SectionCard
      enabled
      title="Theme"
      subtitle="Color palettes and optional background gradient (theme.colors.*)."
    >
      <div className="space-y-3">
        <InlineToggle
          checked={theme.enablePrimary}
          onChange={(v) => onChange({ ...theme, enablePrimary: v })}
          label="Primary palette"
          helperText="Emits theme.colors.primary.{100..900}."
        />
        {theme.enablePrimary ? (
          <PaletteEditor
            title="primary"
            palette={theme.primary}
            onChange={(p) => onChange({ ...theme, primary: p })}
          />
        ) : null}
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <InlineToggle
          checked={theme.enableSecondary}
          onChange={(v) => onChange({ ...theme, enableSecondary: v })}
          label="Secondary palette"
          helperText="Emits theme.colors.secondary.{100..900}."
        />
        {theme.enableSecondary ? (
          <PaletteEditor
            title="secondary"
            palette={theme.secondary}
            onChange={(p) => onChange({ ...theme, secondary: p })}
          />
        ) : null}
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <InlineToggle
          checked={theme.enableBackground}
          onChange={(v) => onChange({ ...theme, enableBackground: v })}
          label="Background gradient"
          helperText="Emits theme.colors.background.primary as a linear-gradient (used by Solutions Builder)."
        />
        {theme.enableBackground ? (
          <GradientEditor
            background={theme.background}
            onChange={(bg) => onChange({ ...theme, background: bg })}
          />
        ) : null}
      </div>
    </SectionCard>
  );
}
