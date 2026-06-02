"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { MapperAppShell } from "@/components/layout/MapperAppShell";
import {
  buildStandardizedConfigFromState,
  createDefaultConfiguratorState,
  type ConfiguratorState,
  type StepState,
} from "@/data/schema-configurator-model";
import { SCHEMA_STEP_TEMPLATES } from "@/data/schema-step-templates";
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

type WizardEntry = {
  id: string;
  label: string;
  group: "Setup" | "Steps" | "Advanced";
  enabled?: boolean;
  render: () => ReactNode;
};

export function SchemaConfiguratorPageClient() {
  const [state, setState] = useState<ConfiguratorState>(() => createDefaultConfiguratorState());
  const [activeId, setActiveId] = useState<string>(SECTION_META);

  const exportConfig = useMemo(() => buildStandardizedConfigFromState(state), [state]);

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
    <MapperAppShell>
      <div className="mx-auto w-full max-w-[min(100%,1920px)] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-start xl:gap-8">
          <div className="lg:order-1">
            <WizardNav groups={groups} activeId={activeEntry?.id ?? SECTION_META} onSelect={setActiveId} />
          </div>

          <div className="space-y-5 lg:order-2 lg:space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Step {activeIndex + 1} of {entries.length}
                  </p>
                  <h2 className="mt-0.5 text-lg font-bold tracking-tight text-gray-800">
                    {activeEntry?.label}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => prevEntry && setActiveId(prevEntry.id)}
                    disabled={!prevEntry}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
                  >
                    ← {prevEntry ? prevEntry.label : "Back"}
                  </button>
                  <button
                    type="button"
                    onClick={() => nextEntry && setActiveId(nextEntry.id)}
                    disabled={!nextEntry}
                    className="rounded-md border border-sky-500 bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-40"
                  >
                    {nextEntry ? nextEntry.label : "Done"} →
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">{activeEntry?.render()}</div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => prevEntry && setActiveId(prevEntry.id)}
                disabled={!prevEntry}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => nextEntry && setActiveId(nextEntry.id)}
                disabled={!nextEntry}
                className="rounded-md border border-sky-500 bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="lg:order-3 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)]">
            <LiveJsonOutput value={exportConfig} />
          </div>
        </div>
      </div>
    </MapperAppShell>
  );
}
