/**
 * Type definitions for the standardized client config JSON used by the
 * production workflow runtime. Mirrors the shape observed in the three
 * reference files (`Cinch.JSON`, `Greentech.json`, `SolutionsBuilder.json`).
 *
 * Kept intentionally permissive: many leaf values are free-form (Tailwind
 * class strings, runtime-evaluated bindings starting with `@`, etc.) and we
 * preserve unknown shapes via `Record<string, unknown>` rather than asserting
 * a tight contract.
 */

export type WorkflowType = "B2C" | "B2B";

export type ColorPalette = {
  "100"?: string;
  "200"?: string;
  "300"?: string;
  "400"?: string;
  "500"?: string;
  "600"?: string;
  "700"?: string;
  "800"?: string;
  "900"?: string;
};

export type GradientStop = {
  color: string;
  position: string;
};

export type LinearGradientBackground = {
  type: "linear-gradient";
  angle: number;
  stops: GradientStop[];
};

export type ThemeBackground = {
  primary?: LinearGradientBackground | string;
};

export type ThemeColors = {
  primary?: ColorPalette;
  secondary?: ColorPalette;
  background?: ThemeBackground;
};

export type Theme = {
  colors?: ThemeColors;
};

export type FaqDetail = {
  title: string;
  content: string;
};

export type FaqEntry = {
  question: string;
  answer: string;
  details?: FaqDetail[];
};

export type Faqs = {
  default?: FaqEntry[];
  jobStatus?: FaqEntry[];
};

export type LandingPage = {
  manufacturerLogos?: string[];
};

export type DisplayFlags = {
  pageHeader?: boolean;
  pageFooter?: boolean;
  stepHeader?: boolean;
};

export type ConditionRule = {
  path: string;
  operator: "equals" | "not_equals" | string;
  value: unknown;
};

export type ConditionExpression = ConditionRule | ConditionRule[];

export type ActionType =
  | "validateStep"
  | "nextStep"
  | "previousStep"
  | "flipBool"
  | "setValue"
  | "moduleAction"
  | "submitWorkOrderProposal"
  | "generateSalesforceWebToCase"
  | "resetWorkflow"
  | "sendReportPDF"
  | "generateReportPDF"
  | string;

export type ActionDefinition = {
  type: ActionType;
  /** moduleAction reference */
  module?: string;
  /** moduleAction name, also used by setValue/flipBool */
  name?: string;
  /** flipBool / setValue target */
  targetPath?: string;
  /** setValue assignment */
  value?: unknown;
};

export type ComponentBinding = string | Record<string, unknown>;

export type ComponentNode = {
  component: string;
  properties?: Record<string, unknown>;
  binding?: ComponentBinding;
  styling?: Record<string, unknown>;
  actions?: ActionDefinition[];
  showWhen?: ConditionExpression;
  disabledWhen?: ConditionExpression;
};

export type StepHeading = {
  title?: string;
  subtitle?: string;
  description?: string;
};

export type StepAuth = {
  required?: boolean;
  preAuthData?: Record<string, unknown>;
};

export type StepPageLayout = {
  main?: Record<string, unknown>;
  footer?: Record<string, unknown>;
};

export type WorkflowStep = {
  step: string;
  stepperLabel?: string;
  heading?: StepHeading;
  auth?: StepAuth;
  pageLayout?: StepPageLayout;
  main?: ComponentNode[];
  footer?: ComponentNode[];
};

export type ContactsModuleMode = "single" | "multiple" | string;

export type WorkflowModuleConfigs = {
  contacts?: {
    mode?: ContactsModuleMode;
  };
  [moduleId: string]: unknown;
};

export type WorkflowNavigation = {
  showProgress?: boolean;
  shouldSaveOnNext?: boolean;
};

export type Workflow = {
  defaultStepPostAuthentication?: number;
  moduleConfigs?: WorkflowModuleConfigs;
  navigation?: WorkflowNavigation;
  steps: WorkflowStep[];
};

export type ProposedPayload = {
  metadata?: Record<string, unknown>;
  summary?: Record<string, unknown>;
};

export type StandardizedConfig = {
  id: string;
  title: string;
  description: string;
  version: string;
  type: WorkflowType;
  theme?: Theme;
  faqs?: Faqs;
  landingPage?: LandingPage;
  display?: DisplayFlags;
  workflow: Workflow;
  proposedPayload?: ProposedPayload;
};

/** Default empty palette mirrors the cinch/greentech baseline. */
export const DEFAULT_PRIMARY_PALETTE: ColorPalette = {
  "100": "#E4EEFF",
  "200": "#CEDFFB",
  "300": "#94B9F6",
  "400": "#6BA0F7",
  "500": "#0C60ED",
  "600": "#024BC6",
  "700": "#003EA6",
  "800": "#002F7D",
  "900": "#00225A",
};

export const DEFAULT_SECONDARY_PALETTE: ColorPalette = {
  "100": "#E5FFEB",
  "200": "#AFFFC1",
  "300": "#73FF83",
  "400": "#1FC345",
  "500": "#058623",
  "600": "#02701B",
  "700": "#025E17",
  "800": "#014B12",
  "900": "#01340D",
};

export const PALETTE_SHADE_KEYS = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const satisfies ReadonlyArray<keyof ColorPalette>;

export type PaletteShade = (typeof PALETTE_SHADE_KEYS)[number];

/** Curated set of action types observed across the three reference JSONs. */
export const KNOWN_ACTION_TYPES = [
  "validateStep",
  "nextStep",
  "previousStep",
  "flipBool",
  "setValue",
  "moduleAction",
  "submitWorkOrderProposal",
  "generateSalesforceWebToCase",
  "resetWorkflow",
  "sendReportPDF",
  "generateReportPDF",
] as const;

export type KnownActionType = (typeof KNOWN_ACTION_TYPES)[number];
