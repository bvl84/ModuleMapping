"use client";

import type { ChangeEvent, ReactNode } from "react";

export const accent = {
  railOn: "bg-sky-400",
  railOff: "bg-gray-200",
  pillOn: "border-sky-400 bg-sky-50 text-sky-700",
  pillOff: "border-gray-300 bg-white text-gray-500",
};

export const CFG_LABEL = "text-[10px] font-semibold uppercase tracking-wide text-sky-800/90";

export function ModuleCheckbox({ selected }: { selected: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 bg-white ${
        selected ? "border-sky-500" : "border-gray-400"
      }`}
      aria-hidden
    >
      {selected ? (
        <svg
          className="h-3 w-3 text-sky-500"
          fill="none"
          viewBox="0 0 12 12"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2.5 6l2.5 2.5L9.5 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

export function CheckboxButton({
  checked,
  onChange,
  ariaLabel,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="rounded p-0.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ModuleCheckbox selected={checked} />
    </button>
  );
}

export function SectionCard({
  enabled,
  onToggleEnabled,
  title,
  subtitle,
  children,
  enabledLabel,
}: {
  enabled: boolean;
  onToggleEnabled?: (next: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  enabledLabel?: string;
}) {
  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`flex w-12 shrink-0 flex-col items-center justify-center py-5 ${
          enabled ? accent.railOn : accent.railOff
        }`}
      >
        {onToggleEnabled ? (
          <button
            type="button"
            role="checkbox"
            aria-checked={enabled}
            aria-label={enabledLabel ?? `${title}: ${enabled ? "on" : "off"}`}
            onClick={() => onToggleEnabled(!enabled)}
            className="flex min-h-[2.5rem] w-full flex-1 flex-col items-center justify-center bg-transparent p-1 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset"
          >
            <ModuleCheckbox selected={enabled} />
          </button>
        ) : (
          <ModuleCheckbox selected={enabled} />
        )}
      </div>
      <div className="min-w-0 flex-1 px-4 py-4">
        <h2 className="text-base font-bold tracking-tight text-gray-800">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p> : null}
        <div className="mt-3 space-y-3">{children}</div>
      </div>
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="font-mono text-xs font-semibold text-sky-800">
      {children}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  );
}

export const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 font-mono text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-gray-100";

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  disabled,
  helperText,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "url" | "number";
  disabled?: boolean;
  helperText?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClass}
      />
      {helperText ? <p className="mt-1 text-[11px] text-gray-500">{helperText}</p> : null}
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled,
  helperText,
  monospace = true,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  helperText?: string;
  monospace?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 ${
          monospace ? "font-mono text-sm" : "text-sm"
        } text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:bg-gray-100`}
      />
      {helperText ? <p className="mt-1 text-[11px] text-gray-500">{helperText}</p> : null}
    </div>
  );
}

export function PillToggle<V extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: V; label: string }[];
  value: V;
  onChange: (next: V) => void;
  ariaLabel?: string;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`inline-flex max-w-full rounded-full border px-3 py-1 text-sm font-medium leading-tight transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400 ${
            value === opt.value ? accent.pillOn : accent.pillOff
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function InlineToggle({
  checked,
  onChange,
  label,
  helperText,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  helperText?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <CheckboxButton checked={checked} onChange={onChange} ariaLabel={label} disabled={disabled} />
      <div className="min-w-0">
        <span
          className={`text-sm font-semibold ${checked ? "text-gray-800" : "text-gray-400"}`}
        >
          {label}
        </span>
        {helperText ? <p className="mt-0.5 text-[11px] text-gray-500">{helperText}</p> : null}
      </div>
    </div>
  );
}
