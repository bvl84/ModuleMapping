/**
 * Smoke test: hydrate each reference JSON into ConfiguratorState and re-emit
 * via buildStandardizedConfigFromState. Reports structural diffs.
 *
 * Run with: node --experimental-strip-types scripts/round-trip-test.mts
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  buildStandardizedConfigFromState,
  hydrateStateFromStandardizedConfig,
} from "../src/data/schema-configurator-model";

type Diff = { path: string; from: unknown; to: unknown };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function diffJson(a: unknown, b: unknown, path = "$"): Diff[] {
  const diffs: Diff[] = [];
  if (a === b) return diffs;
  if (typeof a !== typeof b) {
    diffs.push({ path, from: a, to: b });
    return diffs;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      diffs.push(...diffJson(a[i], b[i], `${path}[${i}]`));
    }
    return diffs;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      diffs.push(...diffJson(a[k], b[k], `${path}.${k}`));
    }
    return diffs;
  }
  if (a !== b) diffs.push({ path, from: a, to: b });
  return diffs;
}

function summarizeDiffs(diffs: Diff[]): string {
  if (diffs.length === 0) return "  ✓ exact structural match";
  const lines = [`  ✗ ${diffs.length} difference(s):`];
  for (const d of diffs.slice(0, 25)) {
    const from = typeof d.from === "string" ? `"${d.from}"` : JSON.stringify(d.from);
    const to = typeof d.to === "string" ? `"${d.to}"` : JSON.stringify(d.to);
    const truncate = (s: string) => (s && s.length > 80 ? `${s.slice(0, 77)}…` : s);
    lines.push(`    ${d.path}: ${truncate(from ?? "undefined")}  →  ${truncate(to ?? "undefined")}`);
  }
  if (diffs.length > 25) lines.push(`    … and ${diffs.length - 25} more`);
  return lines.join("\n");
}

const samples = [
  { name: "Cinch", path: "/Users/zach.sechler/Desktop/Cinch.JSON" },
  { name: "Greentech", path: "/Users/zach.sechler/Desktop/Greentech.json" },
  { name: "SolutionsBuilder", path: "/Users/zach.sechler/Desktop/SolutionsBuilder.json" },
];

async function main() {
  let totalFailures = 0;

  for (const sample of samples) {
    console.log(`\n── ${sample.name} (${sample.path})`);
    try {
      const raw = await readFile(resolve(sample.path), "utf8");
      const parsed = JSON.parse(raw);
      const state = hydrateStateFromStandardizedConfig(parsed);
      const emitted = buildStandardizedConfigFromState(state);
      const diffs = diffJson(parsed, emitted);
      console.log(summarizeDiffs(diffs));
      if (diffs.length > 0) totalFailures += diffs.length;
    } catch (err) {
      console.error(`  ✗ ${(err as Error).message}`);
      totalFailures += 1;
    }
  }

  console.log(`\nTotal differences across all samples: ${totalFailures}`);
  process.exit(totalFailures > 0 ? 1 : 0);
}

main();
