"use client";

import { useRef, useState, type ChangeEvent } from "react";
import type { StandardizedConfig } from "@/data/standardized-schema";

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-md border border-sky-300 bg-white px-3 py-1.5 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400";
const primaryClass =
  "inline-flex items-center gap-1.5 rounded-md border border-sky-500 bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400";

function downloadBlob(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ImportExportToolbar({
  configForExport,
  onImport,
}: {
  configForExport: StandardizedConfig;
  onImport: (parsed: unknown) => void;
}) {
  const [importPanelOpen, setImportPanelOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const filename = `${configForExport.id?.trim() || "workflow-config"}.json`;
    const json = JSON.stringify(configForExport, null, 2);
    downloadBlob(filename, json);
  };

  const tryImportText = (raw: string) => {
    try {
      const parsed = JSON.parse(raw);
      onImport(parsed);
      setError(null);
      setPasteValue("");
      setImportPanelOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON");
    }
  };

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      tryImportText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-800">
            Import / Export
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Start from a sample (Cinch / Greentech / Solutions Builder) or download the live JSON.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setImportPanelOpen((v) => !v);
              setError(null);
            }}
            className={buttonClass}
          >
            {importPanelOpen ? "Cancel import" : "Import JSON"}
          </button>
          <button type="button" onClick={handleExport} className={primaryClass}>
            Export JSON
          </button>
        </div>
      </div>
      {importPanelOpen ? (
        <div className="mt-3 space-y-2 rounded-md border border-dashed border-sky-300 bg-sky-50/40 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-sky-300 bg-white px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm hover:bg-sky-50">
              <span>Choose JSON file…</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json,.JSON"
                onChange={onFileSelected}
                className="hidden"
              />
            </label>
            <span className="text-[11px] text-gray-500">or paste JSON below</span>
          </div>
          <textarea
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            placeholder='{"id":"…","title":"…","workflow":{ "steps": [ … ] }}'
            rows={8}
            className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 font-mono text-xs text-gray-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => tryImportText(pasteValue)}
              disabled={!pasteValue.trim()}
              className={`${primaryClass} disabled:opacity-40`}
            >
              Hydrate from pasted JSON
            </button>
            {error ? (
              <span className="font-mono text-[11px] text-red-600">{error}</span>
            ) : null}
          </div>
          <p className="text-[11px] text-gray-500">
            Importing replaces the current configurator state. Unknown components are preserved
            verbatim and round-trip on export.
          </p>
        </div>
      ) : null}
    </div>
  );
}
