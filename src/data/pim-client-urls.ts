/**
 * Public deployed workflow-UI URLs per client.
 *
 * The PIM listing API does not return a per-workflow UI link, so we store the
 * known client URLs here, keyed by the workflow's `businessChannelKey` (the
 * cleanest 1:1 identifier for a client across its workflow variants).
 *
 * Add new clients here as their workflow UIs go live.
 */
export const PIM_CLIENT_URLS: Record<string, string> = {
  SOLUTIONS_BUILDER: "https://sb.workflow-ui.pim.motilidev.com/workflow",
  CINCH_WF: "https://cinch.workflow-ui.pim.motilidev.com/",
  DAIKIN_FIT_LOCAL: "https://daikin-fit-local.pim.homeenergy.io",
  AM_CONSERVATION_WF: "https://am-conservation.pim.homeenergy.io",
  FIDELITY_WF: "https://fidelity.pim.homeenergy.io",
  DAIKIN_3_E_WF: "https://3e.pim.homeenergy.io",
  OLD_REPUBLIC_WF: "https://old-republic.pim.homeenergy.io",
  DAIKIN_WF: "https://daikin-comfort-zone.pim.homeenergy.io/",
  HOME_SOLUTIONS_WF: "https://demo-lead.pim.homeenergy.io",
};

/**
 * Per-companyId overrides for workflow variants that share a businessChannelKey
 * with another client (e.g. test environments). Checked before the channel-key
 * mapping above.
 */
export const PIM_COMPANY_URL_OVERRIDES: Record<string, string> = {
  solutionsBuilderTest: "https://sb-test.pim.homeenergy.io",
  daikinFitLocalTest: "https://daikin-fit-local-test.pim.homeenergy.io",
};

/**
 * Returns the client's workflow-UI URL, preferring a per-companyId override and
 * falling back to the businessChannelKey mapping. Null if neither is known.
 */
export function pimClientUrl(
  companyId: string | null | undefined,
  businessChannelKey: string | null | undefined,
): string | null {
  if (companyId && PIM_COMPANY_URL_OVERRIDES[companyId]) {
    return PIM_COMPANY_URL_OVERRIDES[companyId];
  }
  if (businessChannelKey && PIM_CLIENT_URLS[businessChannelKey]) {
    return PIM_CLIENT_URLS[businessChannelKey];
  }
  return null;
}
