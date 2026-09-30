"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MapperAppShell } from "@/components/layout/MapperAppShell";
import {
  buildStandardizedConfigFromState,
  createDefaultConfiguratorState,
  hydrateStateFromStandardizedConfig,
  type ConfiguratorState,
  type StepState,
} from "@/data/schema-configurator-model";
import { takeCloneHandoff } from "@/data/clone-handoff";
import { SCHEMA_STEP_TEMPLATES } from "@/data/schema-step-templates";
import { APP_CONFIG } from "@/lib/auth0-config";
import { useAuthHeader } from "@/lib/useAuthHeader";
import { FaqsCard } from "./cards/FaqsCard";
import { LandingPageCard } from "./cards/LandingPageCard";
import { MetaCard } from "./cards/MetaCard";
import { ModuleOrderCard } from "./cards/ModuleOrderCard";
import { ProposedPayloadCard } from "./cards/ProposedPayloadCard";
import { StepCard } from "./cards/StepCard";
import { ThemeCard } from "./cards/ThemeCard";
import { LiveJsonOutput } from "./LiveJsonOutput";
import { WizardNav, type WizardGroup, type WizardSection } from "./WizardNav";

const SECTION_META = "meta";
const SECTION_THEME = "theme";
const SECTION_FAQS = "faqs";
const SECTION_LANDING = "landing";
const SECTION_ORDER = "module-order";
const SECTION_PAYLOAD = "proposed-payload";
const STEP_PREFIX = "step:";

const navButtonClass =
  "inline-flex h-11 max-w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";

function StepNavBar({
  prevLabel,
  currentLabel,
  nextLabel,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  prevLabel: string;
  currentLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
      <div className="min-w-0 justify-self-start">
        <button
          type="button"
          onClick={onPrev}
          disabled={prevDisabled}
          className={`${navButtonClass} border border-cyan-400/25 bg-white/5 text-slate-200 hover:bg-cyan-400/10`}
        >
          <span className="truncate">← {prevLabel}</span>
        </button>
      </div>
      <h2 className="px-2 text-center text-lg font-bold tracking-tight text-[#eef7ff]">
        {currentLabel}
      </h2>
      <div className="min-w-0 justify-self-end">
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`${navButtonClass} bg-gradient-to-br from-cyan-300 to-amber-200 text-slate-950 shadow-[0_18px_48px_rgba(103,232,249,0.18)]`}
        >
          <span className="truncate">{nextLabel} →</span>
        </button>
      </div>
    </div>
  );
}

/** PIM workflow-service create/update endpoint (CORS-enabled, called from the browser). */
const CREATE_URL = `${APP_CONFIG.API_URL}/workflow-service/workflows/create`;

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

type WizardEntry = {
  id: string;
  label: string;
  group: "Setup" | "Steps" | "Advanced";
  enabled?: boolean;
  render: () => ReactNode;
};

export function SchemaConfiguratorPageClient() {
  const router = useRouter();
  const [state, setState] = useState<ConfiguratorState>(() => createDefaultConfiguratorState());
  const [activeId, setActiveId] = useState<string>(SECTION_META);
  /** Full workflow record handed off from a clone; the base for saving back. */
  const [sourceRecord, setSourceRecord] = useState<Record<string, unknown> | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const authHeader = useAuthHeader();

  // If we arrived here from a workflow clone, hydrate the form from that record.
  useEffect(() => {
    const handoff = takeCloneHandoff();
    if (!isRecord(handoff)) return;
    const outer = handoff.workflow;
    const innerConfig = isRecord(outer) ? outer.workflow : undefined;
    if (isRecord(innerConfig)) {
      // Full record shape: hydrate from the inner config, keep record for saving.
      setState(hydrateStateFromStandardizedConfig(innerConfig));
      setSourceRecord(handoff);
    } else {
      // Bare standardized config.
      setState(hydrateStateFromStandardizedConfig(handoff));
    }
  }, []);

  const exportConfig = useMemo(() => buildStandardizedConfigFromState(state), [state]);

  const handleSubmitConfig = useCallback(async () => {
    setSubmitState({ status: "submitting" });
    try {
      // Build the full record payload: GET-style record with the inner config
      // swapped for the configurator's current output. companyId targets the row.
      let payload: Record<string, unknown>;
      if (sourceRecord) {
        const baseWorkflow = isRecord(sourceRecord.workflow) ? sourceRecord.workflow : {};
        payload = {
          ...sourceRecord,
          workflow: { ...baseWorkflow, workflow: exportConfig },
        };
      } else {
        payload = {
          companyId: exportConfig.id,
          workflowType: exportConfig.type,
          workflow: {
            metadata: {
              version: exportConfig.version,
              companyId: exportConfig.id,
              workflowType: exportConfig.type,
            },
            workflow: exportConfig,
          },
        };
      }

      const res = await fetch(CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(await authHeader()),
        },
        body: JSON.stringify([payload]),
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = (await res.text()).slice(0, 400);
        } catch {
          /* ignore */
        }
        throw new Error(`Save failed (${res.status})${detail ? `: ${detail}` : ""}`);
      }
      setSubmitState({
        status: "success",
        message: `Saved configuration for “${exportConfig.id || "workflow"}”.`,
      });
    } catch (err) {
      setSubmitState({
        status: "error",
        message: err instanceof Error ? err.message : "Save failed",
      });
    }
  }, [authHeader, exportConfig, sourceRecord]);

  const updateStep = useCallback((stepId: string, next: StepState) => {
    setState((s) => ({ ...s, steps: { ...s.steps, [stepId]: next } }));
  }, []);

  const onReorderSteps = useCallback((next: string[]) => {
    setState((s) => ({ ...s, stepOrder: next }));
  }, []);

  const onToggleStepEnabled = useCallback((stepId: string, enabled: boolean) => {
    setState((s) => ({
      ...s,
      steps: { ...s.steps, [stepId]: { ...s.steps[stepId], enabled } },
    }));
  }, []);

  const entries: WizardEntry[] = useMemo(() => {
    const list: WizardEntry[] = [
      {
        id: SECTION_META,
        label: "Workflow Definition",
        group: "Setup",
        render: () => (
          <MetaCard
            meta={state.meta}
            includeDisplay={state.includeDisplay}
            display={state.display}
            workflow={state.workflow}
            onMetaChange={(meta) => setState((s) => ({ ...s, meta }))}
            onIncludeDisplayChange={(includeDisplay) =>
              setState((s) => ({ ...s, includeDisplay }))
            }
            onDisplayChange={(display) => setState((s) => ({ ...s, display }))}
            onWorkflowChange={(workflow) => setState((s) => ({ ...s, workflow }))}
          />
        ),
      },
      {
        id: SECTION_THEME,
        label: "Theme",
        group: "Setup",
        render: () => (
          <ThemeCard
            theme={state.theme}
            onChange={(theme) => setState((s) => ({ ...s, theme }))}
          />
        ),
      },
      {
        id: SECTION_ORDER,
        label: "Module Order",
        group: "Setup",
        render: () => (
          <ModuleOrderCard
            stepOrder={state.stepOrder}
            steps={state.steps}
            onReorder={onReorderSteps}
            onToggleEnabled={onToggleStepEnabled}
          />
        ),
      },
    ];

    const landingEntry: WizardEntry = {
      id: SECTION_LANDING,
      label: "Landing Page",
      group: "Steps",
      enabled: state.landingPage.enable,
      render: () => (
        <LandingPageCard
          state={state.landingPage}
          onChange={(landingPage) => setState((s) => ({ ...s, landingPage }))}
        />
      ),
    };

    const faqsEntry: WizardEntry = {
      id: SECTION_FAQS,
      label: "FAQs",
      group: "Steps",
      enabled: state.faqs.enable,
      render: () => (
        <FaqsCard faqs={state.faqs} onChange={(faqs) => setState((s) => ({ ...s, faqs }))} />
      ),
    };

    list.push(landingEntry);

    let faqsInserted = false;
    for (const stepId of state.stepOrder) {
      const template = SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
      const step = state.steps[stepId];
      if (!template || !step) continue;
      list.push({
        id: `${STEP_PREFIX}${stepId}`,
        label: template.displayName,
        group: "Steps",
        enabled: step.enabled,
        render: () => (
          <StepCard
            template={template}
            step={step}
            onChange={(next) => updateStep(stepId, next)}
          />
        ),
      });
      if (stepId === "summary") {
        list.push(faqsEntry);
        faqsInserted = true;
      }
    }
    if (!faqsInserted) list.push(faqsEntry);

    list.push({
      id: SECTION_PAYLOAD,
      label: "Proposed Payload",
      group: "Advanced",
      enabled: state.proposedPayload.enabled,
      render: () => (
        <ProposedPayloadCard
          state={state.proposedPayload}
          onChange={(proposedPayload) => setState((s) => ({ ...s, proposedPayload }))}
        />
      ),
    });

    return list;
  }, [state, onReorderSteps, onToggleStepEnabled, updateStep]);

  const activeIndex = Math.max(
    0,
    entries.findIndex((e) => e.id === activeId),
  );
  const activeEntry = entries[activeIndex];
  const prevEntry = entries[activeIndex - 1];
  const nextEntry = entries[activeIndex + 1];

  const groups: WizardGroup[] = useMemo(() => {
    const out: WizardGroup[] = [];
    const setup: WizardSection[] = [];
    const steps: WizardSection[] = [];
    const advanced: WizardSection[] = [];
    for (const e of entries) {
      const section: WizardSection = { id: e.id, label: e.label, enabled: e.enabled };
      if (e.group === "Setup") setup.push(section);
      else if (e.group === "Steps") steps.push(section);
      else advanced.push(section);
    }
    if (setup.length) out.push({ id: "setup", label: "Setup", sections: setup });
    if (steps.length) out.push({ id: "steps", label: "Workflow Steps", sections: steps });
    if (advanced.length) out.push({ id: "advanced", label: "Advanced", sections: advanced });
    return out;
  }, [entries]);

  return (
    <MapperAppShell holo>
      <div className="mx-auto w-full max-w-[min(100%,1920px)] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-start xl:gap-8">
          <div className="lg:order-1">
            <WizardNav groups={groups} activeId={activeEntry?.id ?? SECTION_META} onSelect={setActiveId} />
            <button
              type="button"
              onClick={() => router.push("/workflows")}
              className={`${navButtonClass} mt-[10px] w-full border border-cyan-400/25 bg-white/5 text-slate-200 hover:bg-cyan-400/10`}
            >
              Cancel
            </button>
          </div>

          <div className="space-y-5 lg:order-2 lg:space-y-6">
            <div className="rounded-2xl border border-cyan-400/20 bg-[#0a1020]/80 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <StepNavBar
                prevLabel={prevEntry ? prevEntry.label : "Back"}
                currentLabel={activeEntry?.label ?? ""}
                nextLabel={nextEntry ? nextEntry.label : "Done"}
                prevDisabled={!prevEntry}
                nextDisabled={!nextEntry}
                onPrev={() => prevEntry && setActiveId(prevEntry.id)}
                onNext={() => nextEntry && setActiveId(nextEntry.id)}
              />
            </div>

            <div className="space-y-4">{activeEntry?.render()}</div>

            <div className="rounded-2xl border border-cyan-400/20 bg-[#0a1020]/80 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <StepNavBar
                prevLabel={prevEntry ? prevEntry.label : "Back"}
                currentLabel={activeEntry?.label ?? ""}
                nextLabel={nextEntry ? nextEntry.label : "Done"}
                prevDisabled={!prevEntry}
                nextDisabled={!nextEntry}
                onPrev={() => prevEntry && setActiveId(prevEntry.id)}
                onNext={() => nextEntry && setActiveId(nextEntry.id)}
              />
            </div>

            {!nextEntry ? (
              <div className="site-card p-5">
                <div className="relative">
                  <p className="eyebrow text-[0.68rem]">Publish</p>
                  <h3 className="mt-1 text-base font-bold tracking-tight text-[#eef7ff]">
                    Save configuration
                  </h3>
                  <p className="mt-1 text-sm text-slate-300/70">
                    Push these configurations to the workflow tables. Updates the row matching{" "}
                    <span className="font-semibold text-cyan-200">
                      {exportConfig.id || "this workflow"}
                    </span>
                    .
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSubmitConfig}
                      disabled={submitState.status === "submitting"}
                      className="holo-button holo-button--primary px-5 text-sm disabled:opacity-60"
                    >
                      {submitState.status === "submitting" ? "Submitting…" : "Submit configuration"}
                    </button>
                    {submitState.status === "success" ? (
                      <span className="text-sm font-medium text-cyan-200">
                        ✓ {submitState.message}
                      </span>
                    ) : null}
                    {submitState.status === "error" ? (
                      <span className="text-sm font-medium text-red-300">{submitState.message}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:order-3 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)]">
            <LiveJsonOutput value={exportConfig} />
          </div>
        </div>
      </div>
    </MapperAppShell>
  );
}
