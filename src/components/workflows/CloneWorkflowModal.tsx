"use client";

import { useEffect, useId, useState } from "react";
import type { WorkflowSummary } from "@/app/api/workflows/route";
import { pimClientUrl } from "@/data/pim-client-urls";

export type CloneFormValues = {
  cloneCompanyId: string;
  clientName: string;
  companyId: string;
  companyName: string;
  baseUrl: string;
  clientId: string;
  businessChannelKey: string;
};

export type CloneFieldConfig = {
  key: keyof CloneFormValues;
  label: string;
  /** Reference value from the source workflow, shown in quotes beside the label. */
  helpText?: string;
  placeholder?: string;
  type?: "text" | "url";
};

export function buildCloneFields(source: WorkflowSummary): CloneFieldConfig[] {
  const pimUrl = pimClientUrl(source.companyId, source.businessChannelKey) ?? undefined;
  return [
    {
      key: "clientName",
      label: "client name",
      helpText: source.companyId || undefined,
      placeholder: "e.g., Fidelity",
    },
    {
      key: "companyId",
      label: "companyID",
      helpText: source.companyId || undefined,
      placeholder: "e.g., fidelity",
    },
    {
      key: "companyName",
      label: "companyName",
      helpText: source.companyName || undefined,
      placeholder: "e.g., F01",
    },
    { key: "baseUrl", label: "PIM URL", type: "url", helpText: pimUrl, placeholder: "https://…" },
    { key: "clientId", label: "clientID-in S2", helpText: "3225", placeholder: "e.g., 3234" },
    {
      key: "businessChannelKey",
      label: "businessChannelKey",
      placeholder: "e.g., FIDELITY HOME WARRANTY",
    },
  ];
}

export function CloneWorkflowModal({
  source,
  onClose,
  onSubmit,
}: {
  source: WorkflowSummary;
  onClose: () => void;
  onSubmit: (values: CloneFormValues) => Promise<void>;
}) {
  const titleId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<CloneFormValues>(() => ({
    // Source companyID being cloned from — sent in the payload but no longer an
    // editable field in the form.
    cloneCompanyId: source.companyId || "",
    clientName: source.companyId || "",
    companyId: "",
    companyName: "",
    baseUrl: pimClientUrl(source.companyId, source.businessChannelKey) ?? "",
    clientId: "",
    businessChannelKey: "",
  }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fields = buildCloneFields(source);

  const update = (key: keyof CloneFormValues, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clone workflow");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
        aria-hidden="true"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#0b1020] shadow-[0_0_60px_-12px_rgba(103,232,249,0.45)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-cyan-400/15 px-6 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold tracking-tight text-[#eef7ff]">
              Clone Workflow
            </h2>
            <p className="mt-0.5 truncate text-sm text-slate-400">
              Cloning from{" "}
              <span className="font-medium text-cyan-200">
                {source.companyId || source.companyName}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-5">
          <div className="space-y-4">
            {fields.map((field) => (
              <div
                key={field.key}
                className="grid grid-cols-1 items-center gap-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-4"
              >
                <label
                  htmlFor={`clone-${field.key}`}
                  className="text-sm font-medium text-slate-200"
                >
                  {field.label}
                  {field.helpText ? (
                    <span className="ml-1.5 text-xs font-normal italic text-slate-500">
                      “{field.helpText}”
                    </span>
                  ) : null}
                </label>
                <input
                  id={`clone-${field.key}`}
                  type={field.type === "url" ? "url" : "text"}
                  value={values[field.key]}
                  placeholder={field.placeholder}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="w-full rounded-md border border-cyan-400/20 bg-[#050711]/60 px-3 py-2 text-center text-sm text-slate-100 shadow-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-cyan-400/15 px-6 py-4">
          <p className="min-w-0 flex-1 truncate text-sm text-red-300" role="alert">
            {error}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-cyan-400/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md border border-cyan-400/60 bg-cyan-400/90 px-4 py-2 text-sm font-semibold text-[#04121a] shadow-[0_0_18px_-4px_rgba(103,232,249,0.6)] hover:bg-cyan-300 disabled:opacity-60"
            >
              {submitting ? "Cloning…" : "Submit / Clone"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
