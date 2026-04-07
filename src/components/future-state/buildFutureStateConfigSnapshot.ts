import type { FutureStateModuleEntry, FutureStateWorkflowProfile } from "@/data/future-state-visual";

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
    moduleName: string;
    entries: FutureStateModuleEntry[];
  }>;
};

export function buildFutureStateConfigSnapshot(
  profile: FutureStateWorkflowProfile,
  entries: FutureStateModuleEntry[],
): FutureStateConfigSnapshot {
  return {
    "meta title": profile.metaTitle,
    "meta description": profile.metaDescription,
    sections: [
      {
        wfName: profile.wfName,
        wfType: profile.wfType,
        clientId: profile.clientId,
        bc: profile.BC,
        backgroundImage: profile.backgroundImage,
        font: profile.font,
        header: profile.header,
        footer: profile.footer,
        moduleName: "Module",
        entries: JSON.parse(JSON.stringify(entries)) as FutureStateModuleEntry[],
      },
    ],
  };
}
