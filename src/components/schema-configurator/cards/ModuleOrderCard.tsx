"use client";

import { useState, type DragEvent } from "react";
import type { ConfiguratorState } from "@/data/schema-configurator-model";
import { SCHEMA_STEP_TEMPLATES } from "@/data/schema-step-templates";
import { CheckboxButton, SectionCard } from "../ConfiguratorUI";

export function ModuleOrderCard({
  stepOrder,
  steps,
  onReorder,
  onToggleEnabled,
}: {
  stepOrder: ConfiguratorState["stepOrder"];
  steps: ConfiguratorState["steps"];
  onReorder: (next: string[]) => void;
  onToggleEnabled: (stepId: string, next: boolean) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const onDragStart = (id: string) => (e: DragEvent<HTMLElement>) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (id: string) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverId !== id) setDragOverId(id);
  };

  const onDragLeave = (id: string) => () => {
    if (dragOverId === id) setDragOverId(null);
  };

  const onDrop = (targetId: string) => (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    const sourceId = draggingId ?? e.dataTransfer.getData("text/plain");
    setDraggingId(null);
    setDragOverId(null);
    if (!sourceId || sourceId === targetId) return;
    const next = [...stepOrder];
    const fromIdx = next.indexOf(sourceId);
    const toIdx = next.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, sourceId);
    onReorder(next);
  };

  const onDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const move = (id: string, dir: -1 | 1) => {
    const next = [...stepOrder];
    const i = next.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onReorder(next);
  };

  return (
    <SectionCard
      enabled
      title="Module order"
      subtitle="Drag to reorder. Toggle the checkbox to include or exclude a module from the workflow."
    >
      <ol className="space-y-2">
        {stepOrder.map((stepId, i) => {
          const template = SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
          const step = steps[stepId];
          if (!template || !step) return null;
          const isDragging = draggingId === stepId;
          const isOver = dragOverId === stepId && draggingId && draggingId !== stepId;
          return (
            <li
              key={stepId}
              draggable
              onDragStart={onDragStart(stepId)}
              onDragOver={onDragOver(stepId)}
              onDragLeave={onDragLeave(stepId)}
              onDrop={onDrop(stepId)}
              onDragEnd={onDragEnd}
              aria-grabbed={isDragging}
              aria-label={`${template.displayName}, position ${i + 1} of ${stepOrder.length}`}
              className={`flex items-center gap-3 rounded-lg border bg-[#050711]/40 p-3 shadow-sm transition-all ${
                isDragging ? "opacity-50" : ""
              } ${
                isOver ? "border-cyan-400/60 ring-2 ring-cyan-400/30" : "border-cyan-400/15"
              }`}
            >
              <span
                className="flex h-7 w-5 shrink-0 cursor-grab select-none items-center justify-center text-slate-500 hover:text-slate-200 active:cursor-grabbing"
                aria-hidden
                title="Drag to reorder"
              >
                ⋮⋮
              </span>
              <span className="font-mono text-[11px] tabular-nums text-slate-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <CheckboxButton
                checked={step.enabled}
                onChange={(next) => onToggleEnabled(stepId, next)}
                ariaLabel={`Include ${template.displayName} in workflow`}
              />
              <span
                className={`flex-1 text-sm font-semibold ${
                  step.enabled ? "text-slate-100" : "text-slate-500"
                }`}
              >
                {template.displayName}
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(stepId, -1)}
                  disabled={i === 0}
                  className="rounded border border-cyan-400/20 bg-white/5 px-2 py-0.5 text-xs font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-40"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(stepId, 1)}
                  disabled={i === stepOrder.length - 1}
                  className="rounded border border-cyan-400/20 bg-white/5 px-2 py-0.5 text-xs font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-40"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-[11px] text-slate-400">
        Tip: drag the dotted handle on the left, or use the up/down buttons. The wizard nav and the
        exported workflow steps follow this order.
      </p>
    </SectionCard>
  );
}
