"use client";

import { Fragment, useState, type ReactNode } from "react";
import type { FutureStateConfigItem, FutureStateModuleEntry } from "@/data/future-state-visual";
import type { FutureStateConfigSnapshot } from "./buildFutureStateConfigSnapshot";

function countFsConfigItems(arr: FutureStateConfigItem[] | undefined): number {
  if (!Array.isArray(arr)) return 0;
  let n = 0;
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    n += 1;
    if (item.options?.length) n += countFsConfigItems(item.options);
    if (item.configuration?.length) n += countFsConfigItems(item.configuration);
  }
  return n;
}

function Key({ children }: { children: string }) {
  return <span className="text-[#9cdcfe]">{children}</span>;
}

function Punct({ children }: { children: string }) {
  return <span className="text-[#d4d4d4]">{children}</span>;
}

function Val({ v }: { v: unknown }) {
  if (v === null) return <span className="text-[#b5cea8]">null</span>;
  if (typeof v === "boolean") {
    return (
      <span className={v ? "text-[#4ec9b0]" : "text-[#f44747]"}>{String(v)}</span>
    );
  }
  if (typeof v === "number") return <span className="text-[#b5cea8]">{String(v)}</span>;
  if (typeof v === "string") return <span className="text-[#ce9178]">{v}</span>;
  return <span className="text-[#d4d4d4]">{String(v)}</span>;
}

function Line({
  depth,
  children,
  className = "",
}: {
  depth: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`py-px font-mono text-[13px] leading-[1.5] text-[#d4d4d4] ${className}`}
      style={{ paddingLeft: `${depth * 1.25}rem` }}
    >
      {children}
    </div>
  );
}

function BlankLine() {
  return <div className="line py-px font-mono text-[13px]">&nbsp;</div>;
}

function CollapsibleBlock({
  depth,
  label,
  count,
  children,
}: {
  depth: number;
  label: string;
  count: number;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex w-full cursor-pointer select-none py-px text-left font-mono text-[13px] leading-[1.5] text-[#d4d4d4] hover:bg-[#2a2d2e]"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span className="mr-1 inline-block w-4 shrink-0 text-[10px] text-[#858585]">
          {expanded ? "▼" : "▶"}
        </span>
        <span>
          <Key>{label}</Key>
          <Punct>: </Punct>
          <Punct>{`(${count} items)`}</Punct>
        </span>
      </button>
      {expanded ? <div className="overflow-hidden">{children}</div> : null}
    </>
  );
}

function FsConfigItemView({
  item,
  itemPath,
  depth,
}: {
  item: FutureStateConfigItem;
  itemPath: string;
  depth: number;
}) {
  const blocks: ReactNode[] = [];
  let k = 0;
  const push = (node: ReactNode) => blocks.push(<Fragment key={k++}>{node}</Fragment>);

  if (item.name !== undefined) {
    push(
      <Line depth={depth}>
        <Key>name</Key>
        <Punct>: </Punct>
        <Val v={item.name} />
      </Line>,
    );
  }
  if (item.field !== undefined) {
    push(
      <Line depth={depth}>
        <Key>field</Key>
        <Punct>: </Punct>
        <Val v={item.field} />
      </Line>,
    );
  }
  if (item.display !== undefined) {
    push(
      <Line depth={depth}>
        <Key>display</Key>
        <Punct>: </Punct>
        <Val v={item.display} />
      </Line>,
    );
  }
  if (item.configValue !== undefined) {
    push(
      <Line depth={depth}>
        <Key>configValue</Key>
        <Punct>: </Punct>
        <Val v={item.configValue} />
      </Line>,
    );
  }
  if (item.reference3Label !== undefined) {
    push(
      <Line depth={depth}>
        <Key>reference3Label</Key>
        <Punct>: </Punct>
        <Val v={item.reference3Label} />
      </Line>,
    );
  }
  if (item.reference4Label !== undefined) {
    push(
      <Line depth={depth}>
        <Key>reference4Label</Key>
        <Punct>: </Punct>
        <Val v={item.reference4Label} />
      </Line>,
    );
  }
  if (item.reference5Label !== undefined) {
    push(
      <Line depth={depth}>
        <Key>reference5Label</Key>
        <Punct>: </Punct>
        <Val v={item.reference5Label} />
      </Line>,
    );
  }
  if (item.alternativeImage1 !== undefined) {
    push(
      <Line depth={depth}>
        <Key>alternativeImage1</Key>
        <Punct>: </Punct>
        <Val v={item.alternativeImage1} />
      </Line>,
    );
  }
  if (item.alternativeImage2 !== undefined) {
    push(
      <Line depth={depth}>
        <Key>alternativeImage2</Key>
        <Punct>: </Punct>
        <Val v={item.alternativeImage2} />
      </Line>,
    );
  }
  if (item.alternativeImage3 !== undefined) {
    push(
      <Line depth={depth}>
        <Key>alternativeImage3</Key>
        <Punct>: </Punct>
        <Val v={item.alternativeImage3} />
      </Line>,
    );
  }
  if (item.optionCount !== undefined) {
    push(
      <Line depth={depth}>
        <Key>option count</Key>
        <Punct>: </Punct>
        <Val v={item.optionCount} />
      </Line>,
    );
  }
  if (item.options && item.options.length > 0) {
    push(
      <Line depth={depth}>
        <Key>options</Key>
        <Punct>:</Punct>
      </Line>,
    );
    item.options.forEach((opt, oi) => {
      push(
        <FsConfigItemView
          key={`${itemPath}-o-${oi}`}
          item={opt}
          itemPath={`${itemPath}.options.${oi}`}
          depth={depth + 1}
        />,
      );
    });
  }
  if (item.summary !== undefined) {
    push(
      <Line depth={depth}>
        <Key>summary</Key>
        <Punct>: </Punct>
        <Val v={item.summary} />
      </Line>,
    );
  }
  if (item.configuration && item.configuration.length > 0) {
    push(
      <Line depth={depth}>
        <Key>sub configuration</Key>
        <Punct>:</Punct>
      </Line>,
    );
    item.configuration.forEach((sub, si) => {
      push(
        <FsConfigItemView
          key={`${itemPath}-c-${si}`}
          item={sub}
          itemPath={`${itemPath}.configuration.${si}`}
          depth={depth + 1}
        />,
      );
    });
  }

  return <>{blocks}</>;
}

function FutureStateConfigurationSection({
  configArr,
  depth,
  pathPrefix,
}: {
  configArr: FutureStateConfigItem[];
  depth: number;
  pathPrefix: string;
}) {
  const count = countFsConfigItems(configArr);
  const headerDepth = depth + 1;
  const itemDepth = depth + 2;

  return (
    <CollapsibleBlock depth={headerDepth} label="configuration" count={count}>
      {configArr.map((row, i) => (
        <Fragment key={`${pathPrefix}-${i}`}>
          {i > 0 ? <BlankLine /> : null}
          <FsConfigItemView item={row} itemPath={`${pathPrefix}-${i}`} depth={itemDepth} />
        </Fragment>
      ))}
    </CollapsibleBlock>
  );
}

function EntryBlock({
  entry,
  entryKey,
  depth,
}: {
  entry: FutureStateModuleEntry;
  entryKey: string;
  depth: number;
}) {
  const cfg = entry.details?.configuration;
  const hasFs = Array.isArray(cfg) && cfg.length > 0;

  return (
    <>
      <Line depth={depth}>
        <Key>nameId</Key>
        <Punct>: </Punct>
        <Val v={entry.nameId} />
      </Line>
      <Line depth={depth}>
        <Key>display</Key>
        <Punct>: </Punct>
        <Val v={entry.display !== false} />
      </Line>
      <Line depth={depth}>
        <Key>sort</Key>
        <Punct>: </Punct>
        <Val v={entry.sort} />
      </Line>
      {hasFs ? (
        <FutureStateConfigurationSection
          configArr={cfg}
          depth={depth}
          pathPrefix={`e-${entryKey}`}
        />
      ) : null}
    </>
  );
}

function SectionBlock({
  data,
  sec,
  secIndex,
}: {
  data: FutureStateConfigSnapshot;
  sec: FutureStateConfigSnapshot["sections"][number];
  secIndex: number;
}) {
  const metaDepth = 1;
  const bcDepth = 0;
  const modLabel = sec.moduleName || "Module";

  return (
    <>
      <Line depth={0}>
        <Key>wfName</Key>
        <Punct>: </Punct>
        <Val v={sec.wfName} />
      </Line>
      <Line depth={0}>
        <Key>wfType</Key>
        <Punct>: </Punct>
        <Val v={sec.wfType} />
      </Line>
      <Line depth={0}>
        <Key>clientId</Key>
        <Punct>: </Punct>
        <Val v={sec.clientId} />
      </Line>
      <Line depth={metaDepth}>
        <Key>meta title</Key>
        <Punct>: </Punct>
        <Val v={data["meta title"]} />
      </Line>
      <Line depth={metaDepth}>
        <Key>meta description</Key>
        <Punct>: </Punct>
        <Val v={data["meta description"]} />
      </Line>
      <Line depth={bcDepth}>
        <Key>BC</Key>
        <Punct>: </Punct>
        <Val v={sec.bc} />
      </Line>
      <Line depth={bcDepth}>
        <Key>backgroundImage</Key>
        <Punct>: </Punct>
        <Val v={sec.backgroundImage} />
      </Line>
      <Line depth={bcDepth}>
        <Key>font</Key>
        <Punct>: </Punct>
        <Val v={sec.font} />
      </Line>
      <Line depth={bcDepth}>
        <Key>header</Key>
        <Punct>: </Punct>
        <Val v={sec.header} />
      </Line>
      <Line depth={bcDepth}>
        <Key>footer</Key>
        <Punct>: </Punct>
        <Val v={sec.footer} />
      </Line>
      <BlankLine />
      <Line depth={0}>
        <Key>{modLabel}</Key>
        <Punct>:</Punct>
      </Line>
      {sec.entries?.map((ent, ei) => (
        <Fragment key={`${ent.nameId}-${ei}`}>
          {ei > 0 ? <BlankLine /> : null}
          <EntryBlock entry={ent} entryKey={`${secIndex}-${ei}`} depth={1} />
        </Fragment>
      ))}
    </>
  );
}

/** Renders Future State config like `public/config-renderer.js` (read-only mirror of state). */
export function FutureStateMapperStyleView({ data }: { data: FutureStateConfigSnapshot }) {
  return (
    <div className="select-text">
      {data.sections?.map((sec, i) => (
        <SectionBlock key={i} data={data} sec={sec} secIndex={i} />
      ))}
    </div>
  );
}
