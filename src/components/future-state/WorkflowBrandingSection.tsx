"use client";

import {
  WORKFLOW_GOOGLE_FONTS,
  type ThemeColorSlotRef,
  type ThemeLogoSlotRef,
  type WorkflowBrandingTheme,
  type WorkflowGoogleFontId,
} from "@/data/future-state-visual";

const accent = {
  pillOn: "border-sky-400 bg-sky-50 text-sky-700",
  pillOff: "border-gray-300 bg-white text-gray-500",
};

const BRAND_LABEL = "text-[10px] font-semibold uppercase tracking-wide text-gray-600";

/** Light checkerboard for transparent / empty logo slots */
const LOGO_CHECKER =
  "bg-[length:12px_12px] bg-[image:repeating-conic-gradient(#e8e8e8_0%_25%,#fff_0%_50%)]";

function parseColorRef(v: string): ThemeColorSlotRef {
  const n = Number(v);
  if (n >= 0 && n <= 4) return n as ThemeColorSlotRef;
  return 0;
}

function parseLogoRef(v: string): ThemeLogoSlotRef {
  const n = Number(v);
  if (n >= 0 && n <= 3) return n as ThemeLogoSlotRef;
  return 0;
}

function colorRefLabel(ref: ThemeColorSlotRef): string {
  if (ref === 0) return "None";
  return `Color ${ref}`;
}

function themeHexAt(b: WorkflowBrandingTheme, slot: 1 | 2 | 3 | 4): string {
  return b.themeColors[slot - 1]?.trim() ?? "";
}

function ColorRefSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: ThemeColorSlotRef;
  onChange: (next: ThemeColorSlotRef) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={BRAND_LABEL}>
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <select
          id={id}
          value={String(value)}
          onChange={(e) => onChange(parseColorRef(e.target.value))}
          className="max-w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        >
          <option value="0">None</option>
          <option value="1">Color 1</option>
          <option value="2">Color 2</option>
          <option value="3">Color 3</option>
          <option value="4">Color 4</option>
        </select>
      </div>
    </div>
  );
}

function LogoRefSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: ThemeLogoSlotRef;
  onChange: (next: ThemeLogoSlotRef) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={BRAND_LABEL}>
        {label}
      </label>
      <select
        id={id}
        value={String(value)}
        onChange={(e) => onChange(parseLogoRef(e.target.value))}
        className="mt-1 max-w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
      >
        <option value="0">None</option>
        <option value="1">Logo 1</option>
        <option value="2">Logo 2</option>
        <option value="3">Logo 3</option>
      </select>
    </div>
  );
}

function SelectedColorRow({ branding, refIndex }: { branding: WorkflowBrandingTheme; refIndex: ThemeColorSlotRef }) {
  if (refIndex === 0) {
    return <span className="text-sm text-gray-500">None</span>;
  }
  const hex = themeHexAt(branding, refIndex as 1 | 2 | 3 | 4);
  if (!hex) {
    return <span className="text-sm italic text-gray-400">[None Selected]</span>;
  }
  return <span className="text-sm text-gray-800">{colorRefLabel(refIndex)}</span>;
}

export function WorkflowBrandingSection({
  branding,
  onBranding,
  font,
  onFontChange,
}: {
  branding: WorkflowBrandingTheme;
  onBranding: (updater: (b: WorkflowBrandingTheme) => WorkflowBrandingTheme) => void;
  font: WorkflowGoogleFontId;
  onFontChange: (font: WorkflowGoogleFontId) => void;
}) {
  const setThemeColor = (index: 0 | 1 | 2 | 3, hex: string) => {
    onBranding((b) => {
      const next: [string, string, string, string] = [...b.themeColors];
      next[index] = hex;
      return { ...b, themeColors: next };
    });
  };

  const setLogoSrc = (index: 0 | 1 | 2, src: string) => {
    onBranding((b) => {
      const next: [string, string, string] = [...b.logoSrc];
      next[index] = src;
      return { ...b, logoSrc: next };
    });
  };

  const patchEmail = (patch: Partial<WorkflowBrandingTheme["email"]>) => {
    onBranding((b) => ({ ...b, email: { ...b.email, ...patch } }));
  };

  const patchPdf = (patch: Partial<WorkflowBrandingTheme["pdf"]>) => {
    onBranding((b) => ({ ...b, pdf: { ...b.pdf, ...patch } }));
  };

  const selectClass =
    "rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400";

  return (
    <div className="space-y-5 rounded-lg border border-gray-200 bg-gray-50/90 p-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">Branding &amp; themeing</h3>
        <p className="mt-0.5 text-xs text-gray-500">Theme colors, logos, typography, email and PDF placement.</p>
      </div>

      <div>
        <p className={BRAND_LABEL}>Colors</p>
        <div className="mt-2 grid min-w-0 grid-cols-4 gap-2 sm:gap-4">
          {([0, 1, 2, 3] as const).map((i) => {
            const hex = branding.themeColors[i] ?? "";
            const slotNum = i + 1;
            return (
              <div key={i} className="min-w-0">
                <label htmlFor={`theme-color-${i}`} className={BRAND_LABEL}>
                  {`Color ${slotNum}`}
                </label>
                <input
                  id={`theme-color-${i}`}
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={`Color ${slotNum} hex`}
                  placeholder="[None Selected]"
                  value={hex}
                  onChange={(e) => setThemeColor(i, e.target.value)}
                  className={`mt-1 w-full min-w-0 rounded-md border border-gray-300 bg-white px-2 py-1.5 font-mono text-xs text-gray-800 placeholder:italic placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                    !hex ? "text-gray-400" : ""
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className={BRAND_LABEL}>Logos</p>
        <div className="mt-2 flex flex-wrap gap-4">
          {([0, 1, 2] as const).map((i) => {
            const src = branding.logoSrc[i] ?? "";
            return (
              <div key={i} className="min-w-[9rem] flex-1">
                <p className={BRAND_LABEL}>{`Logo ${i + 1}`}</p>
                <div
                  className={`mt-1 flex h-20 items-center justify-center overflow-hidden rounded-md border border-gray-300 ${LOGO_CHECKER}`}
                >
                  {src ? <img src={src} alt="" className="max-h-full max-w-full object-contain p-1" /> : null}
                </div>
                <input
                  type="text"
                  aria-label={`Logo ${i + 1} URL or path`}
                  placeholder="Image URL or path"
                  value={src}
                  onChange={(e) => setLogoSrc(i, e.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-mono text-xs font-semibold text-sky-800">font</p>
        <p className="mt-0.5 text-xs text-gray-500">Google Fonts — select one (sans-serif or serif).</p>
        <div role="radiogroup" aria-label="Workflow font" className="mt-3 space-y-3">
          {(["Sans-serif", "Serif"] as const).map((category) => (
            <div key={category}>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{category}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {WORKFLOW_GOOGLE_FONTS.filter((f) => f.category === category).map((f) => {
                  const sel = font === f.id;
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

      <div>
        <h4 className="text-sm font-semibold text-gray-800">Email settings</h4>
        <hr className="mt-1 border-gray-200" />

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-700">Header</p>
            <hr className="mt-1 border-gray-200" />
            <div className="mt-3 flex flex-wrap gap-8">
              <LogoRefSelect
                id="email-header-logo"
                label="Header logo"
                value={branding.email.headerLogo}
                onChange={(headerLogo) => patchEmail({ headerLogo })}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                <ColorRefSelect
                  id="email-header-bg"
                  label="Header background color"
                  value={branding.email.headerBgColorIndex}
                  onChange={(headerBgColorIndex) => patchEmail({ headerBgColorIndex })}
                />
                <ColorRefSelect
                  id="email-header-text"
                  label="Header text color"
                  value={branding.email.headerTextColorIndex}
                  onChange={(headerTextColorIndex) => patchEmail({ headerTextColorIndex })}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700">Signature</p>
            <hr className="mt-1 border-gray-200" />
            <div className="mt-3">
              <LogoRefSelect
                id="email-sig-logo"
                label="Signature logo"
                value={branding.email.signatureLogo}
                onChange={(signatureLogo) => patchEmail({ signatureLogo })}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700">Footer</p>
            <hr className="mt-1 border-gray-200" />
            <div className="mt-3 flex flex-wrap gap-6">
              <ColorRefSelect
                id="email-footer-bg"
                label="Footer background color"
                value={branding.email.footerBgColorIndex}
                onChange={(footerBgColorIndex) => patchEmail({ footerBgColorIndex })}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-800">PDF settings</h4>
        <hr className="mt-1 border-gray-200" />
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-700">Header</p>
          <hr className="mt-1 border-gray-200" />
          <div className="mt-3 flex flex-wrap gap-8">
            <div>
              <label htmlFor="pdf-header-logo" className={BRAND_LABEL}>
                PDF header logo
              </label>
              <select
                id="pdf-header-logo"
                value={String(branding.pdf.headerLogo)}
                onChange={(e) => patchPdf({ headerLogo: parseLogoRef(e.target.value) })}
                className={`mt-2 ${selectClass}`}
              >
                <option value="0">None</option>
                <option value="1">Logo 1</option>
                <option value="2">Logo 2</option>
                <option value="3">Logo 3</option>
              </select>
            </div>
            <div>
              <label htmlFor="pdf-header-text-color" className={BRAND_LABEL}>
                Header text color
              </label>
              <div className="mt-1">
                <SelectedColorRow branding={branding} refIndex={branding.pdf.headerTextColorIndex} />
              </div>
              <select
                id="pdf-header-text-color"
                value={String(branding.pdf.headerTextColorIndex)}
                onChange={(e) => patchPdf({ headerTextColorIndex: parseColorRef(e.target.value) })}
                className={`mt-2 ${selectClass}`}
              >
                <option value="0">None</option>
                <option value="1">Color 1</option>
                <option value="2">Color 2</option>
                <option value="3">Color 3</option>
                <option value="4">Color 4</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
