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
      {hint ? <p className="text-[11px] text-gray-500">{hint}</p> : null}
      {items.length === 0 ? (
        <p className="text-xs italic text-gray-400">No entries yet.</p>
      ) : null}
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-md border border-gray-200 bg-gray-50/60 p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-[11px] text-gray-500">#{i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="rounded-md border border-red-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => update(i, { question: e.target.value })}
            placeholder="Question"
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
          <textarea
            value={item.answer}
            onChange={(e) => update(i, { answer: e.target.value })}
            placeholder="Answer"
            rows={2}
            className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
          {showDetails ? (
            <div className="space-y-2 rounded border border-dashed border-sky-200 bg-sky-50/40 p-2">
              <p className="font-mono text-[10px] uppercase tracking-wide text-sky-700">
                details (optional, used for Job Status)
              </p>
              {(item.details ?? []).map((d, di) => (
                <div key={di} className="space-y-1 rounded border border-gray-200 bg-white p-2">
                  <input
                    type="text"
                    value={d.title}
                    onChange={(e) => {
                      const details = [...(item.details ?? [])];
                      details[di] = { ...details[di], title: e.target.value };
                      update(i, { details });
                    }}
                    placeholder="Detail title"
                    className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-xs shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
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
                    className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-xs shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const details = [...(item.details ?? [])];
                      details.splice(di, 1);
                      update(i, { details });
                    }}
                    className="rounded border border-red-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove detail
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => update(i, { details: [...(item.details ?? []), { title: "", content: "" }] })}
                className="rounded border border-sky-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-sky-700 hover:bg-sky-50"
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
        className="rounded-md border border-sky-300 bg-white px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50"
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
      subtitle="Default and Job Status FAQ lists (faqs.default[], faqs.jobStatus[])."
    >
      {faqs.enable ? (
        <>
          <FaqList
            title="default"
            hint="Shown on the main workflow."
            items={faqs.default}
            onChange={(next) => onChange({ ...faqs, default: next })}
          />
          <div className="border-t border-gray-100 pt-3">
            <InlineToggle
              checked={faqs.enableJobStatus}
              onChange={(v) => onChange({ ...faqs, enableJobStatus: v })}
              label="Include jobStatus FAQ list"
              helperText="Surfaced on the post-submission Job Status view; supports nested details."
            />
            {faqs.enableJobStatus ? (
              <div className="mt-3">
                <FaqList
                  title="jobStatus"
                  items={faqs.jobStatus}
                  showDetails
                  onChange={(next) => onChange({ ...faqs, jobStatus: next })}
                />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <p className="text-xs italic text-gray-400">FAQs are disabled. Toggle the rail to enable.</p>
      )}
    </SectionCard>
  );
}
