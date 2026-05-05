"use client";

import { useState, type ReactNode } from "react";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function Punct({ children }: { children: string }) {
  return <span className="text-[#d4d4d4]">{children}</span>;
}

function Key({ children }: { children: string }) {
  return <span className="text-[#9cdcfe]">{children}</span>;
}

function Primitive({ value }: { value: unknown }) {
  if (value === null) return <span className="text-[#b5cea8]">null</span>;
  if (typeof value === "boolean") {
    return <span className={value ? "text-[#4ec9b0]" : "text-[#f44747]"}>{String(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className="text-[#b5cea8]">{String(value)}</span>;
  }
  if (typeof value === "string") {
    return <span className="text-[#ce9178]">{`"${value}"`}</span>;
  }
  return <span className="text-[#d4d4d4]">{String(value)}</span>;
}

function Indent({ depth, children }: { depth: number; children: ReactNode }) {
  return (
    <div
      className="py-px font-mono text-[13px] leading-[1.5] text-[#d4d4d4]"
      style={{ paddingLeft: `${depth * 1.25}rem` }}
    >
      {children}
    </div>
  );
}

function Collapsible({
  depth,
  prefix,
  count,
  preview,
  defaultExpanded = false,
  children,
}: {
  depth: number;
  prefix: ReactNode;
  count: number;
  preview: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full cursor-pointer select-none py-px text-left font-mono text-[13px] leading-[1.5] text-[#d4d4d4] hover:bg-[#2a2d2e]"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
      >
        <span className="mr-1 inline-block w-4 shrink-0 text-[10px] text-[#858585]">
          {expanded ? "▼" : "▶"}
        </span>
        <span>
          {prefix}
          <Punct>{preview}</Punct>{" "}
          <span className="text-[#858585]">{`// ${count} item${count === 1 ? "" : "s"}`}</span>
        </span>
      </button>
      {expanded ? <div>{children}</div> : null}
    </>
  );
}

function Node({
  value,
  keyName,
  depth,
  defaultExpanded,
}: {
  value: unknown;
  keyName?: string;
  depth: number;
  defaultExpanded?: boolean;
}) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <Indent depth={depth}>
          {keyName !== undefined ? (
            <>
              <Key>{`"${keyName}"`}</Key>
              <Punct>: </Punct>
            </>
          ) : null}
          <Punct>[]</Punct>
        </Indent>
      );
    }
    return (
      <Collapsible
        depth={depth}
        prefix={
          keyName !== undefined ? (
            <>
              <Key>{`"${keyName}"`}</Key>
              <Punct>: </Punct>
            </>
          ) : null
        }
        count={value.length}
        preview="["
        defaultExpanded={defaultExpanded}
      >
        {value.map((v, i) => (
          <Node key={i} value={v} depth={depth + 1} />
        ))}
        <Indent depth={depth}>
          <Punct>]</Punct>
        </Indent>
      </Collapsible>
    );
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return (
        <Indent depth={depth}>
          {keyName !== undefined ? (
            <>
              <Key>{`"${keyName}"`}</Key>
              <Punct>: </Punct>
            </>
          ) : null}
          <Punct>{"{}"}</Punct>
        </Indent>
      );
    }
    return (
      <Collapsible
        depth={depth}
        prefix={
          keyName !== undefined ? (
            <>
              <Key>{`"${keyName}"`}</Key>
              <Punct>: </Punct>
            </>
          ) : null
        }
        count={keys.length}
        preview="{"
        defaultExpanded={defaultExpanded}
      >
        {keys.map((k) => (
          <Node key={k} value={value[k]} keyName={k} depth={depth + 1} />
        ))}
        <Indent depth={depth}>
          <Punct>{"}"}</Punct>
        </Indent>
      </Collapsible>
    );
  }

  return (
    <Indent depth={depth}>
      {keyName !== undefined ? (
        <>
          <Key>{`"${keyName}"`}</Key>
          <Punct>: </Punct>
        </>
      ) : null}
      <Primitive value={value} />
    </Indent>
  );
}

export function LiveJsonOutput({
  value,
  title = "Standardized config",
  subtitle = "Live preview — updates as you edit. Click any node to expand.",
}: {
  value: unknown;
  title?: string;
  subtitle?: string;
}) {
  return (
    <aside
      className="flex min-h-0 w-full min-w-0 flex-1 basis-0 flex-col self-stretch"
      aria-label="Live config output"
    >
      <div className="flex h-full min-h-[min(100dvh,28rem)] flex-1 flex-col overflow-hidden rounded-xl border-2 border-[#00BCFF] bg-[#1e1e1e] shadow-lg sm:min-h-[32rem] lg:min-h-0">
        <div className="shrink-0 border-b border-gray-700 px-5 py-4 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6a9955]">Live output</p>
          <p className="mt-0.5 text-sm font-medium text-[#d4d4d4]">{title}</p>
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div
          className="min-h-0 flex-1 overflow-auto p-5 sm:p-6"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
        >
          <Node value={value} depth={0} defaultExpanded />
        </div>
      </div>
    </aside>
  );
}
