import type { FutureStateConfigItem, FutureStateModuleEntry } from "@/data/future-state-visual";

function DisplayPill({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
        value ? "bg-emerald-950/80 text-emerald-300 ring-1 ring-emerald-700/50" : "bg-red-950/60 text-red-300 ring-1 ring-red-800/50"
      }`}
    >
      {value ? "true" : "false"}
    </span>
  );
}

function FlowConnector() {
  return (
    <div className="flex justify-center py-1" aria-hidden>
      <div className="flex flex-col items-center text-gray-500">
        <div className="h-4 w-px bg-gray-600" />
        <div className="text-[10px] leading-none">▼</div>
      </div>
    </div>
  );
}

function ConfigItemVisual({ item, depth = 0 }: { item: FutureStateConfigItem; depth?: number }) {
  const pad = depth > 0 ? "border-l-2 border-sky-600/40 pl-3 ml-1" : "";
  const isFieldRow = item.field != null;

  return (
    <div className={`space-y-2 rounded-md bg-[#2d2d30] p-3 ${pad}`}>
      {item.name != null && <div className="text-sm font-medium text-gray-100">{item.name}</div>}
      {isFieldRow && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-sky-400/90">field</span>
          <span className="rounded bg-[#1e1e1e] px-2 py-0.5 font-mono text-amber-200/90">{item.field}</span>
          {item.display !== undefined && <DisplayPill value={item.display} />}
        </div>
      )}
      {!isFieldRow && item.display !== undefined && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span>display</span>
          <DisplayPill value={item.display} />
        </div>
      )}
      {item.optionCount !== undefined && (
        <div className="text-xs text-gray-400">
          <span className="text-cyan-500/90">option count</span>
          <span className="ml-2 font-mono text-gray-200">{item.optionCount}</span>
        </div>
      )}
      {item.options != null && item.options.length > 0 && (
        <div className="space-y-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">options</div>
          <div className="flex flex-wrap gap-1.5">
            {item.options.map((opt, i) => (
              <span
                key={i}
                className="rounded border border-gray-600/80 bg-[#1e1e1e] px-2 py-1 font-mono text-[11px] text-gray-300"
              >
                {opt.field ?? opt.name ?? `option ${i + 1}`}
              </span>
            ))}
          </div>
        </div>
      )}
      {item.summary != null && (
        <p className="border-t border-gray-600/50 pt-2 text-xs leading-relaxed text-gray-400">{item.summary}</p>
      )}
      {item.configuration != null && item.configuration.length > 0 && (
        <div className="space-y-2 border-t border-gray-600/40 pt-2">
          <div className="text-[11px] font-medium uppercase tracking-wide text-violet-400/80">sub configuration</div>
          <div className="space-y-2">
            {item.configuration.map((child, i) => (
              <ConfigItemVisual key={i} item={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleCard({ entry, isLast }: { entry: FutureStateModuleEntry; isLast: boolean }) {
  const configs = entry.details?.configuration;

  return (
    <>
      <article className="relative rounded-lg border border-gray-600/80 bg-[#252526] shadow-lg ring-1 ring-black/20">
        <div className="flex items-start gap-3 p-4">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-900/50 text-sm font-semibold text-sky-200 ring-1 ring-sky-700/40"
            aria-hidden
          >
            {entry.sort}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-gray-100">{entry.nameId}</h2>
              <DisplayPill value={entry.display} />
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-gray-500">nameId · sort {entry.sort}</p>

            {configs != null && configs.length > 0 ? (
              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">configuration</div>
                <div className="space-y-2">
                  {configs.map((c, i) => (
                    <ConfigItemVisual key={i} item={c} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm italic text-gray-500">No configuration block in profile.</p>
            )}
          </div>
        </div>
      </article>
      {!isLast && <FlowConnector />}
    </>
  );
}

export function FutureStateVisualDiagram({ entries }: { entries: FutureStateModuleEntry[] }) {
  return (
    <div className="mx-auto max-w-2xl pb-16">
      {entries.map((entry, i) => (
        <ModuleCard key={entry.nameId} entry={entry} isLast={i === entries.length - 1} />
      ))}
    </div>
  );
}
