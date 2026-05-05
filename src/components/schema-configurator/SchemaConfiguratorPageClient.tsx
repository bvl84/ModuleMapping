"use client";

import { useCallback, useMemo, useState } from "react";
import { MapperAppShell } from "@/components/layout/MapperAppShell";
import {
  buildStandardizedConfigFromState,
  createDefaultConfiguratorState,
  hydrateStateFromStandardizedConfig,
  type ConfiguratorState,
  type StepState,
} from "@/data/schema-configurator-model";
import { SCHEMA_STEP_TEMPLATES } from "@/data/schema-step-templates";
import { FaqsCard } from "./cards/FaqsCard";
import { LandingPageCard } from "./cards/LandingPageCard";
import { MetaCard } from "./cards/MetaCard";
import { ProposedPayloadCard } from "./cards/ProposedPayloadCard";
import { StepCard } from "./cards/StepCard";
import { ThemeCard } from "./cards/ThemeCard";
import { WorkflowSettingsCard } from "./cards/WorkflowSettingsCard";
import { ImportExportToolbar } from "./ImportExportToolbar";
import { LiveJsonOutput } from "./LiveJsonOutput";

export function SchemaConfiguratorPageClient() {
  const [state, setState] = useState<ConfiguratorState>(() => createDefaultConfiguratorState());

  const exportConfig = useMemo(() => buildStandardizedConfigFromState(state), [state]);

  const onImport = useCallback((parsed: unknown) => {
    setState(hydrateStateFromStandardizedConfig(parsed));
  }, []);

  const updateStep = useCallback((stepId: string, next: StepState) => {
    setState((s) => ({ ...s, steps: { ...s.steps, [stepId]: next } }));
  }, []);

  return (
    <MapperAppShell>
      <div className="mx-auto w-full max-w-[min(100%,1920px)] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-8 xl:gap-10">
          <div className="min-h-0 min-w-0 w-full flex-1 basis-0 space-y-5 lg:space-y-6">
            <ImportExportToolbar configForExport={exportConfig} onImport={onImport} />

            <MetaCard
              meta={state.meta}
              includeDisplay={state.includeDisplay}
              display={state.display}
              onMetaChange={(meta) => setState((s) => ({ ...s, meta }))}
              onIncludeDisplayChange={(includeDisplay) =>
                setState((s) => ({ ...s, includeDisplay }))
              }
              onDisplayChange={(display) => setState((s) => ({ ...s, display }))}
            />

            <ThemeCard
              theme={state.theme}
              onChange={(theme) => setState((s) => ({ ...s, theme }))}
            />

            <FaqsCard
              faqs={state.faqs}
              onChange={(faqs) => setState((s) => ({ ...s, faqs }))}
            />

            <LandingPageCard
              state={state.landingPage}
              onChange={(landingPage) => setState((s) => ({ ...s, landingPage }))}
            />

            <WorkflowSettingsCard
              state={state.workflow}
              onChange={(workflow) => setState((s) => ({ ...s, workflow }))}
            />

            <div className="space-y-3">
              <h2 className="px-1 text-sm font-semibold uppercase tracking-wide text-gray-300">
                Workflow steps
              </h2>
              {state.stepOrder.map((stepId) => {
                const template = SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
                const step = state.steps[stepId];
                if (!template || !step) return null;
                return (
                  <StepCard
                    key={stepId}
                    template={template}
                    step={step}
                    onChange={(next) => updateStep(stepId, next)}
                  />
                );
              })}
              {state.extraSteps.length > 0 ? (
                <p className="rounded-md border border-dashed border-amber-300 bg-amber-50/40 px-3 py-2 text-xs italic text-amber-800">
                  + {state.extraSteps.length} unknown step
                  {state.extraSteps.length === 1 ? "" : "s"} preserved from import (not editable in
                  the GUI; will round-trip on export).
                </p>
              ) : null}
            </div>

            <ProposedPayloadCard
              state={state.proposedPayload}
              onChange={(proposedPayload) => setState((s) => ({ ...s, proposedPayload }))}
            />
          </div>

          <LiveJsonOutput value={exportConfig} />
        </div>
      </div>
    </MapperAppShell>
  );
}
