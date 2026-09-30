"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapperAppShell } from "@/components/layout/MapperAppShell";
import type { WorkflowSummary } from "@/app/api/workflows/route";
import { stashCloneHandoff } from "@/data/clone-handoff";
import { pimClientUrl } from "@/data/pim-client-urls";
import { APP_CONFIG } from "@/lib/auth0-config";
import { useAuthHeader } from "@/lib/useAuthHeader";
import {
  CloneWorkflowModal,
  buildCloneFields,
  type CloneFormValues,
} from "./CloneWorkflowModal";

/** PIM workflow-service clone endpoint (CORS-enabled, called directly from the browser). */
const CLONE_URL = `${APP_CONFIG.API_URL}/workflow-service/workflows/clone`;

/**
 * Turn a camelCase / kebab / snake identifier into spaced Title Case.
 * e.g. "oldRepublic" → "Old Republic", "daikinFitLocal" → "Daikin Fit Local".
 */
function humanizeName(raw: string): string {
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** Format an ISO date string as e.g. "May 18, 2026", or a dash if missing/invalid. */
function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * The clone endpoint returns the newly created workflow record at
 * `workflowResponse[0]` (GET-style shape with `workflow.workflow` holding the
 * standardized config). We carry the whole record so the configurator can both
 * hydrate the form and reconstruct the full record when saving.
 */
function extractClonedRecord(result: unknown): Record<string, unknown> | null {
  if (!result || typeof result !== "object") return null;
  const wr = (result as Record<string, unknown>).workflowResponse;
  const first = Array.isArray(wr) ? wr[0] : undefined;
  if (!first || typeof first !== "object") return null;
  const outer = (first as Record<string, unknown>).workflow;
  if (!outer || typeof outer !== "object") return null;
  const config = (outer as Record<string, unknown>).workflow;
  if (!config || typeof config !== "object") return null;
  return first as Record<string, unknown>;
}

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; workflows: WorkflowSummary[] };

const TYPE_BADGE: Record<string, string> = {
  B2C: "bg-cyan-400/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/30",
  B2B: "bg-violet-400/15 text-violet-200 ring-1 ring-inset ring-violet-400/30",
  PUBLIC: "bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/30",
};

/** Small "i" button that reveals the clone field reference for a workflow. */
function WorkflowInfoButton({ workflow }: { workflow: WorkflowSummary }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const fields = buildCloneFields(workflow)
    .filter((f) => f.key !== "clientName")
    .map((f) =>
      f.key === "businessChannelKey"
        ? { ...f, helpText: workflow.businessChannelKey || undefined }
        : f,
    );

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Show clone field reference"
        aria-expanded={open}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-white/5 font-serif text-sm italic text-cyan-200 shadow-sm transition-colors hover:bg-cyan-400/10"
      >
        i
      </button>
      {open ? (
        <div
          role="dialog"
          className="absolute bottom-full right-0 z-20 mb-2 w-[326px] rounded-lg border border-cyan-400/20 bg-[#0b1020]/95 p-3 shadow-[0_0_40px_-8px_rgba(103,232,249,0.4)] backdrop-blur"
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-cyan-300/70">
            Client Details
          </p>
          <ul className="space-y-2">
            {fields.map((f) => (
              <li key={f.key} className="text-sm text-slate-200">
                <span className="font-medium">{f.label}</span>
                {f.helpText ? (
                  <span className="ml-1.5 text-xs italic text-slate-400">“{f.helpText}”</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function WorkflowCard({
  workflow,
  onClone,
  onUpdate,
  updating,
}: {
  workflow: WorkflowSummary;
  onClone: (workflow: WorkflowSummary) => void;
  onUpdate: (workflow: WorkflowSummary) => void;
  updating: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const pimUrl = pimClientUrl(workflow.companyId, workflow.businessChannelKey);
  const badgeClass =
    TYPE_BADGE[workflow.workflowType] ??
    "bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10";

  const copyPimUrl = async () => {
    if (!pimUrl) return;
    try {
      await navigator.clipboard.writeText(pimUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="site-card group flex flex-col p-5">
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className="truncate text-2xl font-semibold leading-[1.05] text-[#eef7ff]"
            title={workflow.companyId}
          >
            {humanizeName(workflow.companyId || workflow.companyName || workflow.guid)}
          </h3>
        </div>
        {workflow.workflowType ? (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClass}`}
          >
            {workflow.workflowType}
          </span>
        ) : null}
      </div>

      <div className="mt-4 rounded-lg border border-cyan-400/10 bg-white/[0.03] px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300/70">PIM URL</p>
        {pimUrl ? (
          <div className="mt-1 flex items-center gap-2">
            <a
              href={pimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1 truncate text-xs font-medium text-cyan-300 hover:text-cyan-200 hover:underline"
              title={pimUrl}
            >
              {pimUrl}
            </a>
            <button
              type="button"
              onClick={copyPimUrl}
              className="shrink-0 rounded border border-cyan-400/20 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-100"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        ) : (
          <p className="mt-1 truncate text-xs italic text-slate-500">Not available</p>
        )}
      </div>

      <div className="mt-3 space-y-0.5 text-xs text-slate-400">
        <p className="truncate" title={workflow.createdAt ?? undefined}>
          <span className="text-slate-500">Created:</span>{" "}
          <span className="font-medium text-slate-200">{formatDate(workflow.createdAt)}</span>
        </p>
        <p className="truncate" title={workflow.createdBy ?? undefined}>
          <span className="text-slate-500">Created by:</span>{" "}
          <span className="font-medium text-slate-200">{workflow.createdBy || "Unknown"}</span>
        </p>
      </div>

      <div className="relative mt-4 border-t border-cyan-400/10 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdate(workflow)}
            disabled={updating}
            className="holo-button holo-button--primary flex-1 text-sm disabled:opacity-60"
          >
            {updating ? "Loading…" : "Update"}
          </button>
          <button
            type="button"
            onClick={() => onClone(workflow)}
            disabled={updating}
            className="holo-button holo-button--ghost flex-1 text-sm disabled:opacity-60"
          >
            Clone
          </button>
          <WorkflowInfoButton workflow={workflow} />
        </div>
      </div>
    </div>
  );
}

export function WorkflowsPageClient() {
  const router = useRouter();
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [query, setQuery] = useState("");
  const [cloneTarget, setCloneTarget] = useState<WorkflowSummary | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingGuid, setUpdatingGuid] = useState<string | null>(null);
  const authHeader = useAuthHeader();

  const loadWorkflows = useCallback(async () => {
    try {
      const res = await fetch("/api/workflows", {
        cache: "no-store",
        headers: await authHeader(),
      });
      const body = (await res.json()) as { workflows?: WorkflowSummary[]; error?: string };
      if (!res.ok || body.error) {
        setState({ status: "error", message: body.error ?? `Request failed (${res.status})` });
        return;
      }
      setState({ status: "ready", workflows: body.workflows ?? [] });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load workflows",
      });
    }
  }, [authHeader]);

  const handleCloneSubmit = useCallback(
    async (values: CloneFormValues) => {
      const trimmedClientId = values.clientId.trim();
      const numericClientId =
        trimmedClientId !== "" && Number.isFinite(Number(trimmedClientId))
          ? Number(trimmedClientId)
          : null;
      const payload = {
        companyName: values.companyName,
        clientName: values.clientName,
        cloneCompanyId: values.cloneCompanyId,
        companyId: values.companyId,
        baseUrl: values.baseUrl,
        s2ClientId: numericClientId,
        businessChannelKey: values.businessChannelKey,
      };
      const res = await fetch(CLONE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(await authHeader()),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.text()).slice(0, 300);
        } catch {
          /* ignore */
        }
        throw new Error(`Clone failed (${res.status})${detail ? `: ${detail}` : ""}`);
      }

      const result = await res.json().catch(() => null);
      const clonedRecord = extractClonedRecord(result);
      setCloneTarget(null);

      if (clonedRecord) {
        // Hand the cloned record to the configurator and jump there with fields filled in.
        stashCloneHandoff(clonedRecord);
        router.push("/schema-configurator");
        return;
      }

      // Clone succeeded but the response didn't include a config to import.
      setNotice(`Cloned workflow as “${values.companyId || values.companyName || "new client"}”.`);
      void loadWorkflows();
    },
    [authHeader, loadWorkflows, router],
  );

  const handleUpdate = useCallback(
    async (workflow: WorkflowSummary) => {
      setActionError(null);
      setNotice(null);
      setUpdatingGuid(workflow.guid);
      try {
        const res = await fetch(`/api/workflows/${workflow.guid}`, {
          cache: "no-store",
          headers: await authHeader(),
        });
        const body = (await res.json()) as {
          record?: Record<string, unknown>;
          error?: string;
        };
        if (!res.ok || body.error || !body.record) {
          setActionError(body.error ?? `Couldn't load workflow (${res.status})`);
          setUpdatingGuid(null);
          return;
        }
        // Hand the full record to the configurator so it hydrates the form and
        // can save back via the create/update call, preserving id/guid/theming.
        stashCloneHandoff(body.record);
        router.push("/schema-configurator");
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "Failed to load workflow");
        setUpdatingGuid(null);
      }
    },
    [authHeader, router],
  );

  useEffect(() => {
    void loadWorkflows();
  }, [loadWorkflows]);

  const filtered = useMemo(() => {
    if (state.status !== "ready") return [];
    const q = query.trim().toLowerCase();
    const list =
      q === ""
        ? state.workflows
        : state.workflows.filter((w) =>
            [w.companyId, w.companyName, w.title, w.workflowType, w.businessChannelKey]
              .join(" ")
              .toLowerCase()
              .includes(q),
          );
    const nameOf = (w: WorkflowSummary) =>
      humanizeName(w.companyId || w.companyName || w.guid);
    return [...list].sort((a, b) =>
      nameOf(a).localeCompare(nameOf(b), undefined, { sensitivity: "base" }),
    );
  }, [state, query]);

  return (
    <MapperAppShell holo>
      <div className="mx-auto w-full max-w-[min(100%,1400px)] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Workflow Archive</p>
            <h2 className="mt-1 text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#eef7ff] [text-shadow:0_0_24px_rgba(103,232,249,0.3)]">
              Workflows
            </h2>
            <p className="mt-2 leading-7 text-slate-300/70">
              Browse existing client workflows or start a new configuration.
            </p>
          </div>
          <div className="relative w-full max-w-xs">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workflows…"
              className="w-full rounded-lg border border-cyan-400/20 bg-[#0b1020]/70 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none backdrop-blur placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
        </div>

        {notice ? (
          <div className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss"
              className="shrink-0 text-cyan-300 hover:text-cyan-100"
            >
              ✕
            </button>
          </div>
        ) : null}

        {actionError ? (
          <div className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <p>{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError(null)}
              aria-label="Dismiss"
              className="shrink-0 text-red-300 hover:text-red-100"
            >
              ✕
            </button>
          </div>
        ) : null}

        {state.status === "loading" ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-3xl border border-cyan-400/10 bg-[#0b1020]/60"
              />
            ))}
          </div>
        ) : null}

        {state.status === "error" ? (
          <div className="mt-8 rounded-xl border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-200">
            <p className="font-semibold">Couldn&apos;t load workflows</p>
            <p className="mt-1 text-red-300">{state.message}</p>
          </div>
        ) : null}

        {state.status === "ready" ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((w) => (
                <WorkflowCard
                  key={w.guid}
                  workflow={w}
                  onClone={setCloneTarget}
                  onUpdate={handleUpdate}
                  updating={updatingGuid === w.guid}
                />
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="mt-6 text-sm text-slate-400">
                No workflows match “{query}”.
              </p>
            ) : null}
          </>
        ) : null}
      </div>

      {cloneTarget ? (
        <CloneWorkflowModal
          source={cloneTarget}
          onClose={() => setCloneTarget(null)}
          onSubmit={handleCloneSubmit}
        />
      ) : null}
    </MapperAppShell>
  );
}
