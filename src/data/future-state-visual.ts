/**
 * Workflow-level fields — mirrors the top of `public/config-future-state.html` DEFAULT_CONFIG (root meta + first section).
 * Update both when the model changes.
 */
export type BackgroundImageSlot = 1 | 2 | 3 | 4 | 5 | 6;

export const BACKGROUND_IMAGE_SLOTS: readonly BackgroundImageSlot[] = [1, 2, 3, 4, 5, 6];

/** Help / placeholder copy for required fields (inner text from `{…}` in the template where applicable). */
export const WF_NAME_FIELD_HELP = "Workflow Name - example: Cinch, Solutions Builder, etc";
export const CLIENT_ID_FIELD_HELP = "clientID";
export const META_TITLE_FIELD_HELP = "name that you want to appear in browser tab";
export const META_DESCRIPTION_FIELD_HELP = "type in brief description for SEO";
export const BC_FIELD_HELP = "Paste link to business channel in Motili";

/** Placeholder for each option slot label (e.g. Home Goals value 1–8). */
export const OPTION_DISPLAY_VALUE_HELP = "Lower utility cost, modernize my system, etc...";

/** Single Google Font for the workflow (stored as id string in config HTML). */
export type WorkflowGoogleFontId =
  | "inter"
  | "open-sans"
  | "roboto"
  | "poppins"
  | "lora"
  | "merriweather"
  | "playfair-display"
  | "source-serif-4";

export const WORKFLOW_GOOGLE_FONTS: {
  id: WorkflowGoogleFontId;
  label: string;
  category: "Sans-serif" | "Serif";
  /** CSS variable set by `src/app/future-state-visual/layout.tsx` (next/font). */
  cssVar: string;
}[] = [
  { id: "inter", label: "Inter", category: "Sans-serif", cssVar: "var(--font-wf-inter)" },
  { id: "open-sans", label: "Open Sans", category: "Sans-serif", cssVar: "var(--font-wf-open-sans)" },
  { id: "roboto", label: "Roboto", category: "Sans-serif", cssVar: "var(--font-wf-roboto)" },
  { id: "poppins", label: "Poppins", category: "Sans-serif", cssVar: "var(--font-wf-poppins)" },
  { id: "lora", label: "Lora", category: "Serif", cssVar: "var(--font-wf-lora)" },
  { id: "merriweather", label: "Merriweather", category: "Serif", cssVar: "var(--font-wf-merriweather)" },
  {
    id: "playfair-display",
    label: "Playfair Display",
    category: "Serif",
    cssVar: "var(--font-wf-playfair)",
  },
  {
    id: "source-serif-4",
    label: "Source Serif 4",
    category: "Serif",
    cssVar: "var(--font-wf-source-serif-4)",
  },
];

export type FutureStateWorkflowProfile = {
  wfName: string;
  /** Mirrors Future State config — only Direct or Indirect. */
  wfType: "Direct" | "Indirect";
  clientId: string;
  metaTitle: string;
  metaDescription: string;
  BC: string;
  /** Visual default for which background (1–6). Config tab stores a string (e.g. "{1-6}" or "3"). */
  backgroundImage: BackgroundImageSlot;
  /** One Google Font id (see WORKFLOW_GOOGLE_FONTS). */
  font: WorkflowGoogleFontId;
  /** Show workflow chrome header. */
  header: boolean;
  /** Show workflow chrome footer. */
  footer: boolean;
};

export const FUTURE_STATE_WORKFLOW_PROFILE: FutureStateWorkflowProfile = {
  wfName: "",
  wfType: "Direct",
  clientId: "",
  metaTitle: "",
  metaDescription: "",
  BC: "",
  backgroundImage: 1,
  font: "inter",
  header: true,
  footer: true,
};

/**
 * Mirrors `public/config-future-state.html` DEFAULT_CONFIG.entries — update both when the model changes.
 */
export type FutureStateConfigItem = {
  name?: string;
  display?: boolean;
  summary?: string;
  optionCount?: number;
  /** Numeric setting for this config (e.g. max selections cap). */
  configValue?: number;
  /** When Additional fields is on: display names mapped to reference 3 / 4 / 5. */
  reference3Label?: string;
  reference4Label?: string;
  reference5Label?: string;
  /** Alternative options: image URL or path per slot (visual + config). */
  alternativeImage1?: string;
  alternativeImage2?: string;
  alternativeImage3?: string;
  field?: string;
  options?: FutureStateConfigItem[];
  configuration?: FutureStateConfigItem[];
};

export type FutureStateModuleEntry = {
  nameId: string;
  display: boolean;
  sort: number;
  details?: {
    configuration?: FutureStateConfigItem[];
  };
};

export const FUTURE_STATE_VISUAL_ENTRIES: FutureStateModuleEntry[] = [
  {
    nameId: "Landing Page",
    display: true,
    sort: 0,
    details: {
      configuration: [{ name: "OTP verification", display: true }],
    },
  },
  {
    nameId: "Basic Information",
    display: true,
    sort: 1,
    details: {
      configuration: [
        {
          name: "Additional fields",
          display: true,
          summary:
            "When on, three extra inputs use references 3–5. Set the field label each reference shows in the workflow.",
          reference3Label: "",
          reference4Label: "",
          reference5Label: "",
        },
      ],
    },
  },
  {
    nameId: "Property Details",
    display: true,
    sort: 2,
    details: {
      configuration: [
        { name: "Year built", display: true },
        { name: "Sq footage", display: true },
        { name: "# of systems", display: true },
        { name: "# of Beds", display: true },
        { name: "# of Baths", display: true },
      ],
    },
  },
  {
    nameId: "Home Goals",
    display: true,
    sort: 3,
    details: {
      configuration: [
        {
          name: "Total options",
          display: true,
          optionCount: 8,
          options: [
            { field: "", display: true },
            { field: "", display: true },
            { field: "", display: true },
            { field: "", display: true },
            { field: "", display: true },
            { field: "", display: true },
            { field: "", display: true },
            { field: "", display: true },
          ],
          summary: "Total options = # of options = total # of text fields",
        },
        {
          name: "Max selections",
          display: true,
          configValue: 2,
          summary: "Max ≤ number of total options (Total options when on).",
        },
      ],
    },
  },
  {
    nameId: "System Scoping",
    display: true,
    sort: 4,
  },
  {
    nameId: "Summary",
    display: true,
    sort: 5,
    details: {
      configuration: [
        { name: "Best match", display: true },
        { name: "Good Better Best", display: false },
        {
          name: "Alternative options",
          display: false,
          summary:
            "Shown as its own row on the visual; applies when Best match or Good Better Best is selected.",
          alternativeImage1: "",
          alternativeImage2: "",
          alternativeImage3: "",
        },
        { name: "Customer Notes", display: true },
        { name: "Price", display: true },
        { name: "Add Ons", display: true },
        { name: "Email", display: true },
        { name: "PDF", display: true },
        {
          name: "Schedule Inspection",
          display: true,
        },
      ],
    },
  },
  {
    nameId: "Job Status",
    display: true,
    sort: 6,
  },
];
