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
              className={`flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm transition-all ${
                isDragging ? "opacity-50" : ""
              } ${
                isOver ? "border-sky-400 ring-2 ring-sky-300" : "border-gray-200"
              }`}
            >
              <span
                className="flex h-7 w-5 shrink-0 cursor-grab select-none items-center justify-center text-gray-400 hover:text-gray-700 active:cursor-grabbing"
                aria-hidden
                title="Drag to reorder"
              >
                ⋮⋮
              </span>
              <span className="font-mono text-[11px] tabular-nums text-gray-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <CheckboxButton
                checked={step.enabled}
                onChange={(next) => onToggleEnabled(stepId, next)}
                ariaLabel={`Include ${template.displayName} in workflow`}
              />
              <span
                className={`flex-1 text-sm font-semibold ${
                  step.enabled ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {template.displayName}
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(stepId, -1)}
                  disabled={i === 0}
                  className="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(stepId, 1)}
                  disabled={i === stepOrder.length - 1}
                  className="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-[11px] text-gray-500">
        Tip: drag the dotted handle on the left, or use the up/down buttons. The wizard nav and the
        exported workflow steps follow this order.
      </p>
    </SectionCard>
  );
}
