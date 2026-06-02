"use client";

import type { ThemeState } from "@/data/schema-configurator-model";
import {
  PALETTE_SHADE_KEYS,
  type ColorPalette,
  type LinearGradientBackground,
  type PaletteShade,
} from "@/data/standardized-schema";
import { CFG_LABEL, InlineToggle, SectionCard, TextField } from "../ConfiguratorUI";

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb | null {
  const trimmed = hex.trim();
  const long = /^#?([\da-f]{6})$/i.exec(trimmed);
  if (long) {
    const v = long[1];
    return [
      Number.parseInt(v.slice(0, 2), 16),
      Number.parseInt(v.slice(2, 4), 16),
      Number.parseInt(v.slice(4, 6), 16),
    ];
  }
  const short = /^#?([\da-f]{3})$/i.exec(trimmed);
  if (short) {
    const v = short[1];
    return [
      Number.parseInt(v[0] + v[0], 16),
      Number.parseInt(v[1] + v[1], 16),
      Number.parseInt(v[2] + v[2], 16),
    ];
  }
  return null;
}

function rgbToHex([r, g, b]: Rgb): string {
  const f = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`.toUpperCase();
}

function mix(base: Rgb, target: Rgb, amt: number): Rgb {
  return [
    base[0] * (1 - amt) + target[0] * amt,
    base[1] * (1 - amt) + target[1] * amt,
    base[2] * (1 - amt) + target[2] * amt,
  ];
}

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];

/**
 * Mix amounts toward white (lighter) or black (darker) for each shade,
 * relative to the base 500 color. Tuned to approximate a Tailwind-style ramp.
 */
const PALETTE_MIX_RECIPE: Record<PaletteShade, { target: Rgb; amt: number } | null> = {
  "100": { target: WHITE, amt: 0.9 },
  "200": { target: WHITE, amt: 0.75 },
  "300": { target: WHITE, amt: 0.55 },
  "400": { target: WHITE, amt: 0.3 },
  "500": null,
  "600": { target: BLACK, amt: 0.15 },
  "700": { target: BLACK, amt: 0.3 },
  "800": { target: BLACK, amt: 0.45 },
  "900": { target: BLACK, amt: 0.6 },
};

function generatePaletteFromBase(hex500: string): ColorPalette | null {
  const rgb = hexToRgb(hex500);
  if (!rgb) return null;
  const out: ColorPalette = {};
  for (const key of PALETTE_SHADE_KEYS) {
    const recipe = PALETTE_MIX_RECIPE[key];
    out[key] = recipe ? rgbToHex(mix(rgb, recipe.target, recipe.amt)) : rgbToHex(rgb);
  }
  return out;
}

function PaletteEditor({
  title,
  palette,
  onChange,
}: {
  title: string;
  palette: ColorPalette;
  onChange: (next: ColorPalette) => void;
}) {
  const baseHex = palette["500"] ?? "";
  const canGenerate = hexToRgb(baseHex) !== null;

  const onGenerate = () => {
    const generated = generatePaletteFromBase(baseHex);
    if (generated) onChange(generated);
  };

  const otherShades = PALETTE_SHADE_KEYS.filter((s) => s !== "500");

  return (
    <div>
      <p className={CFG_LABEL}>{title}</p>
      <p className="mt-1 text-[11px] text-gray-500">
        Set the 500 base color and click <span className="font-semibold">Generate</span> — the
        configurator fills 100–900 for you. You can tweak any shade afterward.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md border border-sky-300 bg-sky-50/50 px-2 py-1.5 shadow-sm">
        <input
          type="color"
          value={baseHex || "#ffffff"}
          onChange={(e) => onChange({ ...palette, "500": e.target.value })}
          aria-label={`${title} 500 base color`}
          className="h-8 w-8 shrink-0 cursor-pointer rounded border border-white shadow ring-1 ring-sky-300"
        />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-sky-800">
          500 · base
        </span>
        <input
          type="text"
          value={baseHex}
          onChange={(e) => onChange({ ...palette, "500": e.target.value })}
          placeholder="#0C60ED"
          className="w-24 rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className="ml-auto rounded-md border border-sky-500 bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-sky-600 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300"
          title="Generate 100–900 from the 500 hex"
        >
          Generate 100–900 →
        </button>
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-gray-400">
        Derived shades
      </p>
      <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {otherShades.map((shade: PaletteShade) => {
          const value = palette[shade] ?? "";
          return (
            <div
              key={shade}
              className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2"
            >
              <input
                type="color"
                value={value || "#ffffff"}
                onChange={(e) => onChange({ ...palette, [shade]: e.target.value })}
                aria-label={`${title} ${shade}`}
                className="h-7 w-7 shrink-0 cursor-pointer rounded border border-gray-300 bg-white"
              />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">
                  {shade}
                </p>
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
          label="Angle (deg)"
          type="number"
          value={String(background.angle)}
          step={45}
          min={0}
          max={360}
          onChange={(v) => onChange({ ...background, angle: Number.parseFloat(v) || 0 })}
          helperText="Increments by 45°."
        />
        <div className="h-10 flex-1 min-w-[8rem] rounded-md border border-gray-300 shadow-inner" style={{ background: previewCss }} />
      </div>
      <div className="space-y-2">
        {background.stops.map((stop, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2 rounded-md border border-gray-200 bg-white p-2">
            <div className="flex-1 min-w-[12rem]">
              <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">Color</p>
              <input
                type="text"
                value={stop.color}
                onChange={(e) => onStopChange(i, { color: e.target.value })}
                placeholder="rgba(...) or #hex"
                className="mt-0.5 w-full rounded border border-gray-200 bg-white px-1.5 py-1 font-mono text-xs text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
            <div className="w-24">
              <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">Position</p>
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
      subtitle="Color palettes and optional background gradient."
    >
      <div className="space-y-3">
        <InlineToggle
          checked
          onChange={() => {}}
          disabled
          label="Primary palette"
          helperText="Nine shades from 100 (lightest) to 900 (darkest) used as the brand's primary color. Required."
        />
        <PaletteEditor
          title="Primary"
          palette={theme.primary}
          onChange={(p) => onChange({ ...theme, primary: p })}
        />
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <InlineToggle
          checked
          onChange={() => {}}
          disabled
          label="Secondary palette"
          helperText="Nine shades from 100 (lightest) to 900 (darkest) used for accents and supporting elements. Required."
        />
        <PaletteEditor
          title="Secondary"
          palette={theme.secondary}
          onChange={(p) => onChange({ ...theme, secondary: p })}
        />
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <InlineToggle
          checked={theme.enableBackground}
          onChange={(v) => onChange({ ...theme, enableBackground: v })}
          label="Background gradient"
          helperText="Optional page-level linear gradient (used by Solutions Builder)."
        />
        {theme.enableBackground ? (
          <GradientEditor
            background={theme.background}
            onChange={(bg) => onChange({ ...theme, background: bg })}
          />
        ) : null}
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-3">
        <InlineToggle
          checked={theme.enableBackgroundImage}
          onChange={(v) => onChange({ ...theme, enableBackgroundImage: v })}
          label="Background image"
          helperText="Optional decorative image anchored to the bottom-right of the workflow."
        />
        {theme.enableBackgroundImage ? (
          <div className="space-y-3 rounded-md border border-dashed border-sky-300 bg-sky-50/40 p-3">
            <TextField
              id="bg-image-src"
              label="Image URL"
              type="url"
              value={theme.backgroundImage.src}
              onChange={(v) =>
                onChange({
                  ...theme,
                  backgroundImage: { ...theme.backgroundImage, src: v },
                })
              }
              placeholder="https://… or asset path"
              helperText="Anchored to the bottom-right of the workflow."
            />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-gray-500">
                Preview
              </p>
              <div
                className="mt-1 h-32 w-full rounded-md border border-gray-200 bg-white shadow-inner"
                style={{
                  backgroundImage: theme.backgroundImage.src
                    ? `url(${theme.backgroundImage.src})`
                    : undefined,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom right",
                  backgroundSize: "auto 70%",
                }}
              >
                {!theme.backgroundImage.src ? (
                  <div className="flex h-full w-full items-center justify-center text-[11px] text-gray-400">
                    Add an image URL above to preview
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
