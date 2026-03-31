import type { FutureStateConfigItem, FutureStateModuleEntry } from "@/data/future-state-visual";

/** Accent palette aligned with light “Module Control” UI */
const accent = {
  railOn: "bg-sky-400",
  railOff: "bg-gray-200",
  pillOn: "border-sky-400 bg-sky-50 text-sky-700",
  pillOff: "border-gray-300 bg-white text-gray-500",
};

type Pill = { label: string; active: boolean };

function collectFromConfigItem(item: FutureStateConfigItem, pills: Pill[], notes: string[]) {
  if (item.name) {
    pills.push({ label: item.name, active: item.display !== false });
  }
  if (item.field != null && item.name == null) {
    pills.push({ label: item.field, active: item.display !== false });
  }
  if (item.optionCount != null && !(item.options && item.options.length)) {
    pills.push({ label: `${item.optionCount} options`, active: true });
  }
  if (item.options?.length) {
    item.options.forEach((o) => {
      const lab = o.field ?? o.name;
      if (lab) pills.push({ label: lab, active: o.display !== false });
    });
  }
  if (item.summary) {
    notes.push(item.summary);
  }
  item.configuration?.forEach((c) => collectFromConfigItem(c, pills, notes));
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

function ModuleRow({ entry }: { entry: FutureStateModuleEntry }) {
  const pills: Pill[] = [];
  const notes: string[] = [];
  entry.details?.configuration?.forEach((c) => collectFromConfigItem(c, pills, notes));

  const selected = entry.display !== false;

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className={`flex w-12 shrink-0 flex-col items-center justify-center py-5 ${selected ? accent.railOn : accent.railOff}`}
      >
        <ModuleCheckbox selected={selected} />
      </div>
      <div className="min-w-0 flex-1 px-4 py-4">
        <h2 className="text-base font-bold tracking-tight text-gray-800">{entry.nameId}</h2>
        <p className="mt-0.5 text-xs text-gray-400">Step {entry.sort + 1}</p>

        {pills.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {pills.map((p, i) => (
              <TagPill key={`${p.label}-${i}`} {...p} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm italic text-gray-400">No configuration items in profile.</p>
        )}

        {notes.length > 0 ? (
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
            {notes.map((n, i) => (
              <p key={i} className="text-xs leading-relaxed text-gray-500">
                {n}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function FutureStateVisualDiagram({ entries }: { entries: FutureStateModuleEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <ModuleRow key={entry.nameId} entry={entry} />
      ))}
    </div>
  );
}
