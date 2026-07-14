/**
 * Lightweight client-side handoff for passing a freshly cloned workflow record
 * from the Workflows page to the Schema Configurator across a route navigation.
 * Uses sessionStorage so it survives the navigation but not a new tab/session.
 *
 * The stashed value is the full workflow record (GET/clone shape:
 * `{ companyId, companyName, businessChannelKey, workflow: { metadata, workflow } }`)
 * so the configurator can both hydrate from the inner config and reconstruct the
 * full record when saving back.
 */

const CLONE_HANDOFF_KEY = "schemaConfigurator.cloneImport";

export function stashCloneHandoff(record: unknown): void {
  try {
    sessionStorage.setItem(CLONE_HANDOFF_KEY, JSON.stringify(record));
  } catch {
    /* sessionStorage unavailable — silently skip */
  }
}

/** Returns the stashed record (if any) and clears it so it's consumed once. */
export function takeCloneHandoff(): unknown | undefined {
  try {
    const raw = sessionStorage.getItem(CLONE_HANDOFF_KEY);
    if (!raw) return undefined;
    sessionStorage.removeItem(CLONE_HANDOFF_KEY);
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
