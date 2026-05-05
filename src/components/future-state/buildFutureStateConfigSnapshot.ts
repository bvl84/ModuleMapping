import {
  mergeWorkflowBranding,
  type FutureStateModuleEntry,
  type FutureStateWorkflowProfile,
  type WorkflowBrandingTheme,
} from "@/data/future-state-visual";

/** Mirrors `public/config-future-state.html` DEFAULT_CONFIG shape (root + first section). */
export type FutureStateConfigSnapshot = {
  "meta title": string;
  "meta description": string;
  sections: Array<{
    wfName: string;
    wfType: "Direct" | "Indirect";
    clientId: string;
    bc: string;
    backgroundImage: number;
    font: string;
    header: boolean;
    footer: boolean;
    branding: WorkflowBrandingTheme;
    moduleName: string;
    entries: FutureStateModuleEntry[];
  }>;
};

export function buildFutureStateConfigSnapshot(
  profile: FutureStateWorkflowProfile,
  entries: FutureStateModuleEntry[],
): FutureStateConfigSnapshot {
  const p = mergeWorkflowBranding(profile);
  return {
    "meta title": p.metaTitle,
    "meta description": p.metaDescription,
    sections: [
      {
        wfName: p.wfName,
        wfType: p.wfType,
        clientId: p.clientId,
        bc: p.BC,
        backgroundImage: p.backgroundImage,
        font: p.font,
        header: p.header,
        footer: p.footer,
        branding: JSON.parse(JSON.stringify(p.branding)) as WorkflowBrandingTheme,
        moduleName: "Module",
        entries: JSON.parse(JSON.stringify(entries)) as FutureStateModuleEntry[],
      },
    ],
  };
}
