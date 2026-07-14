"use client";

import type { FaqsState } from "@/data/schema-configurator-model";
import type { FaqEntry } from "@/data/standardized-schema";
import { CFG_LABEL, InlineToggle, SectionCard } from "../ConfiguratorUI";

function FaqList({
  title,
  hint,
  items,
  showDetails,
  onChange,
}: {
  title: string;
  hint?: string;
  items: FaqEntry[];
  showDetails?: boolean;
  onChange: (next: FaqEntry[]) => void;
}) {
  const update = (i: number, patch: Partial<FaqEntry>) => {
    const next = items.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { question: "", answer: "" }]);

  return (
    <div className="space-y-2">
      <p className={CFG_LABEL}>{title}</p>
      {hint ? <p className="text-[11px] text-slate-400">{hint}</p> : null}
      {items.length === 0 ? (
        <p className="text-xs italic text-slate-500">No entries yet.</p>
      ) : null}
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-md border border-cyan-400/15 bg-[#050711]/40 p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-[11px] text-slate-400">#{i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-md border border-red-400/30 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-red-300 hover:bg-red-500/10"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => update(i, { question: e.target.value })}
            placeholder="Question"
            className="w-full rounded-md border border-cyan-400/20 bg-[#050711]/60 px-2 py-1 text-sm text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          />
          <textarea
            value={item.answer}
            onChange={(e) => update(i, { answer: e.target.value })}
            placeholder="Answer"
            rows={2}
            className="w-full rounded-md border border-cyan-400/20 bg-[#050711]/60 px-2 py-1 text-sm text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          />
          {showDetails ? (
            <div className="space-y-2 rounded border border-dashed border-cyan-400/30 bg-cyan-400/5 p-2">
              <p className="font-mono text-[10px] uppercase tracking-wide text-cyan-200">
                Details (optional)
              </p>
              {(item.details ?? []).map((d, di) => (
                <div key={di} className="space-y-1 rounded border border-cyan-400/15 bg-[#050711]/40 p-2">
                  <input
                    type="text"
                    value={d.title}
                    onChange={(e) => {
                      const details = [...(item.details ?? [])];
                      details[di] = { ...details[di], title: e.target.value };
                      update(i, { details });
                    }}
                    placeholder="Detail title"
                    className="w-full rounded border border-cyan-400/20 bg-[#050711]/60 px-1.5 py-1 text-xs text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                  />
                  <textarea
                    value={d.content}
                    onChange={(e) => {
                      const details = [...(item.details ?? [])];
                      details[di] = { ...details[di], content: e.target.value };
                      update(i, { details });
                    }}
                    placeholder="Detail content"
                    rows={2}
                    className="w-full rounded border border-cyan-400/20 bg-[#050711]/60 px-1.5 py-1 text-xs text-slate-100 shadow-sm placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const details = [...(item.details ?? [])];
                      details.splice(di, 1);
                      update(i, { details });
                    }}
                    className="rounded border border-red-400/30 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-red-300 hover:bg-red-500/10"
                  >
                    Remove detail
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update(i, { details: [...(item.details ?? []), { title: "", content: "" }] })}
                className="rounded border border-cyan-400/30 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-400/10"
              >
                + Add detail
              </button>
            </div>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-md border border-cyan-400/30 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/10"
      >
        + Add entry
      </button>
    </div>
  );
}

export function FaqsCard({
  faqs,
  onChange,
}: {
  faqs: FaqsState;
  onChange: (next: FaqsState) => void;
}) {
  return (
    <SectionCard
      enabled={faqs.enable}
      onToggleEnabled={(v) => onChange({ ...faqs, enable: v })}
      title="FAQs"
      subtitle="Default and Job Status FAQ lists shown to customers."
    >
      {faqs.enable ? (
        <>
          <FaqList
            title="Default"
            hint="Shown on the main workflow."
            items={faqs.default}
            onChange={(next) => onChange({ ...faqs, default: next })}
          />
          <div className="border-t border-cyan-400/10 pt-3">
            <InlineToggle
              checked={faqs.enableJobStatus}
              onChange={(v) => onChange({ ...faqs, enableJobStatus: v })}
              label="Include Job Status FAQs"
              helperText="Surfaced on the post-submission Job Status view; supports nested details."
            />
            {faqs.enableJobStatus ? (
              <div className="mt-3">
                <FaqList
                  title="Job Status"
                  items={faqs.jobStatus}
                  showDetails
                  onChange={(next) => onChange({ ...faqs, jobStatus: next })}
                />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <p className="text-xs italic text-slate-500">FAQs are disabled. Toggle the rail to enable.</p>
      )}
    </SectionCard>
  );
}
