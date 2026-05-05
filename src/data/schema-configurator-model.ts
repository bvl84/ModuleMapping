/**
 * Configurator state model + serialization for the Schema Configurator page.
 *
 * `ConfiguratorState` is the GUI-side shape (one card per concern).
 * `buildStandardizedConfigFromState` emits a clean standardized JSON.
 * `hydrateStateFromStandardizedConfig` parses an imported JSON back into
 * GUI state, matching components by template position + name and
 * preserving any unknown nodes via `extraMain` / `extraFooter` / `extraSteps`.
 */

import {
  DEFAULT_PRIMARY_PALETTE,
  DEFAULT_SECONDARY_PALETTE,
  type ActionDefinition,
  type ColorPalette,
  type ComponentNode,
  type ConditionExpression,
  type ContactsModuleMode,
  type DisplayFlags,
  type FaqEntry,
  type LinearGradientBackground,
  type StandardizedConfig,
  type StepAuth,
  type StepHeading,
  type StepPageLayout,
  type Theme,
  type Workflow,
  type WorkflowNavigation,
  type WorkflowStep,
  type WorkflowType,
} from "./standardized-schema";
import { SCHEMA_STEP_TEMPLATES, type SlotTemplate, type StepTemplate } from "./schema-step-templates";

/* -------------------------------------------------------------- */
/* State shape                                                     */
/* -------------------------------------------------------------- */

export type SlotEdits = {
  label?: string;
  required?: boolean;
  default?: boolean;
  binding?: string;
  content?: string;
  actions?: ActionDefinition[];
  options?: Array<{ label: string; targetPath: string }>;
  selectionRules?: { minimum: number; maximum: number };
};

export type SlotState = {
  slotId: string;
  enabled: boolean;
  edits: SlotEdits;
  /** Captured raw node when imported (used only when there are no edits to overlay). */
  importedNode?: ComponentNode;
};

export type StepState = {
  step: string;
  enabled: boolean;
  stepperLabel: string;
  heading: StepHeading;
  mainSlotsByOrder: string[];
  footerSlotsByOrder: string[];
  mainSlots: Record<string, SlotState>;
  footerSlots: Record<string, SlotState>;
  /** Components in `main` that didn't match any template slot during import. */
  extraMain: ComponentNode[];
  /** Components in `footer` that didn't match any template slot during import. */
  extraFooter: ComponentNode[];
  importedAuth?: StepAuth;
  importedPageLayout?: StepPageLayout;
  /**
   * When true, fall back to the template's `auth` if `importedAuth` is unset.
   * Disabled on import when the imported step had no `auth` so we don't
   * synthesize one that wasn't in the source JSON.
   */
  useTemplateAuth: boolean;
};

export type ThemeState = {
  enablePrimary: boolean;
  primary: ColorPalette;
  enableSecondary: boolean;
  secondary: ColorPalette;
  enableBackground: boolean;
  background: LinearGradientBackground;
};

export type FaqsState = {
  enable: boolean;
  default: FaqEntry[];
  enableJobStatus: boolean;
  jobStatus: FaqEntry[];
};

export type LandingPageState = {
  enable: boolean;
  manufacturerLogos: string[];
};

export type WorkflowSettingsState = {
  defaultStepPostAuthentication?: number;
  contactsMode: ContactsModuleMode;
  enableContactsModule: boolean;
  navigation: WorkflowNavigation;
};

export type MetaState = {
  id: string;
  title: string;
  description: string;
  version: string;
  type: WorkflowType;
};

export type ConfiguratorState = {
  meta: MetaState;
  includeDisplay: boolean;
  display: DisplayFlags;
  theme: ThemeState;
  faqs: FaqsState;
  landingPage: LandingPageState;
  workflow: WorkflowSettingsState;
  /** Ordered step ids: known templates first, in template order. Extras appended. */
  stepOrder: string[];
  steps: Record<string, StepState>;
  /** Imported steps with a `step` id that doesn't match any known template — preserved raw. */
  extraSteps: WorkflowStep[];
  proposedPayload: {
    enabled: boolean;
    rawJson: string;
  };
};

/* -------------------------------------------------------------- */
/* Defaults                                                        */
/* -------------------------------------------------------------- */

const DEFAULT_BACKGROUND: LinearGradientBackground = {
  type: "linear-gradient",
  angle: 315,
  stops: [
    { color: "rgba(189, 233, 250, 0.4)", position: "0%" },
    { color: "rgba(255, 255, 255, 1)", position: "50%" },
  ],
};

const DEFAULT_PROPOSED_PAYLOAD = {
  metadata: {
    submittedBy: {
      name: "@contacts.contactForm.firstName",
      email: "@contacts.contactForm.email",
    },
  },
  summary: {
    companyId: "",
    summaryName: "@contacts.contactForm.firstName",
    contacts: "@contacts.proposalFormatted.contacts",
    property: "@propertyInfo.proposalFormatted",
  },
};

function emptySlotState(slot: SlotTemplate): SlotState {
  return { slotId: slot.slotId, enabled: slot.defaultEnabled, edits: {} };
}

function emptyStepStateFromTemplate(t: StepTemplate): StepState {
  const mainSlots: Record<string, SlotState> = {};
  for (const s of t.mainSlots) mainSlots[s.slotId] = emptySlotState(s);
  const footerSlots: Record<string, SlotState> = {};
  for (const s of t.footerSlots) footerSlots[s.slotId] = emptySlotState(s);
  return {
    step: t.step,
    enabled: t.defaultEnabled,
    stepperLabel: t.stepperLabel,
    heading: { ...t.heading },
    mainSlotsByOrder: t.mainSlots.map((s) => s.slotId),
    footerSlotsByOrder: t.footerSlots.map((s) => s.slotId),
    mainSlots,
    footerSlots,
    extraMain: [],
    extraFooter: [],
    useTemplateAuth: true,
  };
}

export function createDefaultConfiguratorState(): ConfiguratorState {
  const steps: Record<string, StepState> = {};
  const stepOrder: string[] = [];
  for (const t of SCHEMA_STEP_TEMPLATES) {
    steps[t.step] = emptyStepStateFromTemplate(t);
    stepOrder.push(t.step);
  }
  return {
    meta: {
      id: "",
      title: "",
      description: "",
      version: "1.0.0",
      type: "B2C",
    },
    includeDisplay: false,
    display: { pageHeader: true, pageFooter: true, stepHeader: true },
    theme: {
      enablePrimary: true,
      primary: { ...DEFAULT_PRIMARY_PALETTE },
      enableSecondary: true,
      secondary: { ...DEFAULT_SECONDARY_PALETTE },
      enableBackground: false,
      background: structuredClone(DEFAULT_BACKGROUND),
    },
    faqs: {
      enable: false,
      default: [],
      enableJobStatus: false,
      jobStatus: [],
    },
    landingPage: {
      enable: false,
      manufacturerLogos: [],
    },
    workflow: {
      defaultStepPostAuthentication: undefined,
      enableContactsModule: true,
      contactsMode: "single",
      navigation: { showProgress: true, shouldSaveOnNext: true },
    },
    stepOrder,
    steps,
    extraSteps: [],
    proposedPayload: {
      enabled: true,
      rawJson: JSON.stringify(DEFAULT_PROPOSED_PAYLOAD, null, 2),
    },
  };
}

/* -------------------------------------------------------------- */
/* Serialization helpers                                           */
/* -------------------------------------------------------------- */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** Apply a slot's edits onto a deep clone of its base node. */
function applySlotEdits(base: ComponentNode, edits: SlotEdits): ComponentNode {
  const node = structuredClone(base) as ComponentNode;
  const props: Record<string, unknown> = isPlainObject(node.properties)
    ? { ...node.properties }
    : {};

  if (edits.label !== undefined) props.label = edits.label;
  if (edits.required !== undefined) props.required = edits.required;
  if (edits.default !== undefined) props.default = edits.default;
  if (edits.content !== undefined) props.content = edits.content;
  if (edits.options !== undefined) props.options = edits.options;
  if (edits.selectionRules !== undefined) props.selectionRules = edits.selectionRules;

  if (Object.keys(props).length > 0) node.properties = props;
  if (edits.binding !== undefined) node.binding = edits.binding;
  if (edits.actions !== undefined) node.actions = edits.actions;

  return node;
}

function applySlotEditsOrImported(slot: SlotState, template: SlotTemplate): ComponentNode {
  const base = slot.importedNode ?? template.baseNode;
  return applySlotEdits(base, slot.edits);
}

function buildStepFromState(stepState: StepState, template: StepTemplate): WorkflowStep {
  const main: ComponentNode[] = [];
  for (const slotId of stepState.mainSlotsByOrder) {
    const slotState = stepState.mainSlots[slotId];
    const slotTemplate = template.mainSlots.find((s) => s.slotId === slotId);
    if (!slotState || !slotTemplate || !slotState.enabled) continue;
    main.push(applySlotEditsOrImported(slotState, slotTemplate));
  }
  for (const extra of stepState.extraMain) main.push(structuredClone(extra));

  const footer: ComponentNode[] = [];
  for (const slotId of stepState.footerSlotsByOrder) {
    const slotState = stepState.footerSlots[slotId];
    const slotTemplate = template.footerSlots.find((s) => s.slotId === slotId);
    if (!slotState || !slotTemplate || !slotState.enabled) continue;
    footer.push(applySlotEditsOrImported(slotState, slotTemplate));
  }
  for (const extra of stepState.extraFooter) footer.push(structuredClone(extra));

  const out: WorkflowStep = {
    step: stepState.step,
    stepperLabel: stepState.stepperLabel,
  };

  const heading: StepHeading = {};
  if (stepState.heading.title) heading.title = stepState.heading.title;
  if (stepState.heading.subtitle) heading.subtitle = stepState.heading.subtitle;
  if (stepState.heading.description) heading.description = stepState.heading.description;
  if (Object.keys(heading).length > 0) out.heading = heading;

  if (stepState.importedAuth) {
    out.auth = structuredClone(stepState.importedAuth);
  } else if (stepState.useTemplateAuth && template.auth) {
    out.auth = structuredClone(template.auth);
  }

  const pl = stepState.importedPageLayout ?? template.pageLayout;
  if (pl) out.pageLayout = structuredClone(pl);

  if (main.length > 0) out.main = main;
  if (footer.length > 0) out.footer = footer;

  return out;
}

function tryParseJson(s: string): unknown | undefined {
  if (!s.trim()) return undefined;
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

/* -------------------------------------------------------------- */
/* Build standardized config from state                            */
/* -------------------------------------------------------------- */

export function buildStandardizedConfigFromState(state: ConfiguratorState): StandardizedConfig {
  const out: StandardizedConfig = {
    id: state.meta.id,
    title: state.meta.title,
    description: state.meta.description,
    version: state.meta.version,
    type: state.meta.type,
    workflow: { steps: [] } as Workflow,
  };

  const theme: Theme = {};
  if (state.theme.enablePrimary || state.theme.enableSecondary || state.theme.enableBackground) {
    theme.colors = {};
    if (state.theme.enablePrimary) theme.colors.primary = { ...state.theme.primary };
    if (state.theme.enableSecondary) theme.colors.secondary = { ...state.theme.secondary };
    if (state.theme.enableBackground) {
      theme.colors.background = { primary: structuredClone(state.theme.background) };
    }
    out.theme = theme;
  }

  if (state.faqs.enable) {
    const f: { default?: FaqEntry[]; jobStatus?: FaqEntry[] } = {};
    if (state.faqs.default.length > 0) f.default = structuredClone(state.faqs.default);
    if (state.faqs.enableJobStatus && state.faqs.jobStatus.length > 0) {
      f.jobStatus = structuredClone(state.faqs.jobStatus);
    }
    if (f.default || f.jobStatus) out.faqs = f;
  }

  if (state.landingPage.enable && state.landingPage.manufacturerLogos.length > 0) {
    out.landingPage = { manufacturerLogos: [...state.landingPage.manufacturerLogos] };
  }

  if (state.includeDisplay) {
    const d: DisplayFlags = {};
    if (state.display.pageHeader !== undefined) d.pageHeader = state.display.pageHeader;
    if (state.display.pageFooter !== undefined) d.pageFooter = state.display.pageFooter;
    if (state.display.stepHeader !== undefined) d.stepHeader = state.display.stepHeader;
    out.display = d;
  }

  const wf: Workflow = { steps: [] };
  if (state.workflow.defaultStepPostAuthentication !== undefined) {
    wf.defaultStepPostAuthentication = state.workflow.defaultStepPostAuthentication;
  }
  if (state.workflow.enableContactsModule) {
    wf.moduleConfigs = { contacts: { mode: state.workflow.contactsMode } };
  }
  wf.navigation = { ...state.workflow.navigation };

  for (const stepId of state.stepOrder) {
    const stepState = state.steps[stepId];
    if (!stepState || !stepState.enabled) continue;
    const template = SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
    if (!template) continue;
    wf.steps.push(buildStepFromState(stepState, template));
  }
  for (const extra of state.extraSteps) wf.steps.push(structuredClone(extra));

  out.workflow = wf;

  if (state.proposedPayload.enabled) {
    const parsed = tryParseJson(state.proposedPayload.rawJson);
    if (parsed && isPlainObject(parsed)) {
      out.proposedPayload = parsed as StandardizedConfig["proposedPayload"];
    }
  }

  return out;
}

/* -------------------------------------------------------------- */
/* Hydrate state from imported standardized config                 */
/* -------------------------------------------------------------- */

function readSlotEditsFromNode(node: ComponentNode, slotTemplate: SlotTemplate): SlotEdits {
  const edits: SlotEdits = {};
  const baseProps = isPlainObject(slotTemplate.baseNode.properties)
    ? slotTemplate.baseNode.properties
    : {};
  const nodeProps = isPlainObject(node.properties) ? node.properties : {};

  const editable = new Set<string>(slotTemplate.editable);

  if (editable.has("label") && typeof nodeProps.label === "string" && nodeProps.label !== baseProps.label) {
    edits.label = nodeProps.label;
  }
  if (editable.has("required") && typeof nodeProps.required === "boolean" && nodeProps.required !== baseProps.required) {
    edits.required = nodeProps.required;
  }
  if (editable.has("default") && typeof nodeProps.default === "boolean" && nodeProps.default !== baseProps.default) {
    edits.default = nodeProps.default;
  }
  if (editable.has("content") && typeof nodeProps.content === "string" && nodeProps.content !== baseProps.content) {
    edits.content = nodeProps.content;
  }
  if (editable.has("binding") && typeof node.binding === "string" && node.binding !== slotTemplate.baseNode.binding) {
    edits.binding = node.binding;
  }
  if (editable.has("actions") && Array.isArray(node.actions)) {
    edits.actions = structuredClone(node.actions);
  }
  if (editable.has("options") && Array.isArray(nodeProps.options)) {
    const opts = (nodeProps.options as unknown[])
      .filter(isPlainObject)
      .map((o) => ({
        label: typeof o.label === "string" ? o.label : "",
        targetPath: typeof o.targetPath === "string" ? o.targetPath : "",
      }));
    edits.options = opts;
  }
  if (editable.has("selectionRules") && isPlainObject(nodeProps.selectionRules)) {
    const sr = nodeProps.selectionRules as Record<string, unknown>;
    edits.selectionRules = {
      minimum: typeof sr.minimum === "number" ? sr.minimum : 0,
      maximum: typeof sr.maximum === "number" ? sr.maximum : 0,
    };
  }

  return edits;
}

function matchSlotsToImported(
  templateSlots: readonly SlotTemplate[],
  imported: ComponentNode[],
): { slots: Record<string, SlotState>; extras: ComponentNode[] } {
  const slots: Record<string, SlotState> = {};
  for (const t of templateSlots) slots[t.slotId] = { slotId: t.slotId, enabled: false, edits: {} };

  const extras: ComponentNode[] = [];
  let s = 0;
  let i = 0;

  while (i < imported.length) {
    const node = imported[i];
    let matchIdx = -1;
    for (let k = s; k < templateSlots.length; k++) {
      if (templateSlots[k].baseNode.component === node.component) {
        matchIdx = k;
        break;
      }
    }
    if (matchIdx === -1) {
      extras.push(structuredClone(node));
      i += 1;
      continue;
    }
    const slotTemplate = templateSlots[matchIdx];
    slots[slotTemplate.slotId] = {
      slotId: slotTemplate.slotId,
      enabled: true,
      edits: readSlotEditsFromNode(node, slotTemplate),
      importedNode: structuredClone(node),
    };
    s = matchIdx + 1;
    i += 1;
  }

  return { slots, extras };
}

function readPalette(input: unknown): ColorPalette {
  if (!isPlainObject(input)) return {};
  const out: ColorPalette = {};
  for (const key of ["100", "200", "300", "400", "500", "600", "700", "800", "900"] as const) {
    const v = (input as Record<string, unknown>)[key];
    if (typeof v === "string") out[key] = v;
  }
  return out;
}

export function hydrateStateFromStandardizedConfig(input: unknown): ConfiguratorState {
  const fresh = createDefaultConfiguratorState();
  if (!isPlainObject(input)) return fresh;

  if (typeof input.id === "string") fresh.meta.id = input.id;
  if (typeof input.title === "string") fresh.meta.title = input.title;
  if (typeof input.description === "string") fresh.meta.description = input.description;
  if (typeof input.version === "string") fresh.meta.version = input.version;
  if (input.type === "B2B" || input.type === "B2C") fresh.meta.type = input.type;

  // theme
  const theme = isPlainObject(input.theme) ? input.theme : undefined;
  const colors = theme && isPlainObject(theme.colors) ? theme.colors : undefined;
  if (colors) {
    if (colors.primary) {
      fresh.theme.enablePrimary = true;
      fresh.theme.primary = readPalette(colors.primary);
    }
    if (colors.secondary) {
      fresh.theme.enableSecondary = true;
      fresh.theme.secondary = readPalette(colors.secondary);
    }
    const bg = isPlainObject(colors.background) ? colors.background : undefined;
    const bgPrimary = bg && isPlainObject(bg.primary) ? bg.primary : undefined;
    if (bgPrimary && bgPrimary.type === "linear-gradient") {
      fresh.theme.enableBackground = true;
      fresh.theme.background = {
        type: "linear-gradient",
        angle: typeof bgPrimary.angle === "number" ? bgPrimary.angle : 0,
        stops: Array.isArray(bgPrimary.stops)
          ? (bgPrimary.stops as unknown[]).filter(isPlainObject).map((s) => ({
              color: typeof s.color === "string" ? s.color : "",
              position: typeof s.position === "string" ? s.position : "",
            }))
          : [],
      };
    }
  } else {
    fresh.theme.enablePrimary = false;
    fresh.theme.enableSecondary = false;
  }

  // faqs
  const faqs = isPlainObject(input.faqs) ? input.faqs : undefined;
  if (faqs) {
    fresh.faqs.enable = true;
    if (Array.isArray(faqs.default)) {
      fresh.faqs.default = (faqs.default as unknown[]).filter(isPlainObject).map((e) => ({
        question: typeof e.question === "string" ? e.question : "",
        answer: typeof e.answer === "string" ? e.answer : "",
        details: Array.isArray(e.details)
          ? (e.details as unknown[]).filter(isPlainObject).map((d) => ({
              title: typeof d.title === "string" ? d.title : "",
              content: typeof d.content === "string" ? d.content : "",
            }))
          : undefined,
      }));
    }
    if (Array.isArray(faqs.jobStatus)) {
      fresh.faqs.enableJobStatus = true;
      fresh.faqs.jobStatus = (faqs.jobStatus as unknown[]).filter(isPlainObject).map((e) => ({
        question: typeof e.question === "string" ? e.question : "",
        answer: typeof e.answer === "string" ? e.answer : "",
        details: Array.isArray(e.details)
          ? (e.details as unknown[]).filter(isPlainObject).map((d) => ({
              title: typeof d.title === "string" ? d.title : "",
              content: typeof d.content === "string" ? d.content : "",
            }))
          : undefined,
      }));
    }
  }

  // landing page
  const lp = isPlainObject(input.landingPage) ? input.landingPage : undefined;
  if (lp && Array.isArray(lp.manufacturerLogos)) {
    fresh.landingPage.enable = true;
    fresh.landingPage.manufacturerLogos = (lp.manufacturerLogos as unknown[])
      .filter((s): s is string => typeof s === "string");
  }

  // display
  const display = isPlainObject(input.display) ? input.display : undefined;
  if (display) {
    fresh.includeDisplay = true;
    fresh.display = {
      pageHeader: typeof display.pageHeader === "boolean" ? display.pageHeader : undefined,
      pageFooter: typeof display.pageFooter === "boolean" ? display.pageFooter : undefined,
      stepHeader: typeof display.stepHeader === "boolean" ? display.stepHeader : undefined,
    };
  }

  // workflow
  const workflow = isPlainObject(input.workflow) ? input.workflow : undefined;
  if (workflow) {
    if (typeof workflow.defaultStepPostAuthentication === "number") {
      fresh.workflow.defaultStepPostAuthentication = workflow.defaultStepPostAuthentication;
    }
    const mc = isPlainObject(workflow.moduleConfigs) ? workflow.moduleConfigs : undefined;
    const contacts = mc && isPlainObject(mc.contacts) ? mc.contacts : undefined;
    if (contacts && typeof contacts.mode === "string") {
      fresh.workflow.enableContactsModule = true;
      fresh.workflow.contactsMode = contacts.mode;
    } else {
      fresh.workflow.enableContactsModule = false;
    }
    const nav = isPlainObject(workflow.navigation) ? workflow.navigation : undefined;
    if (nav) {
      fresh.workflow.navigation = {
        showProgress: typeof nav.showProgress === "boolean" ? nav.showProgress : undefined,
        shouldSaveOnNext: typeof nav.shouldSaveOnNext === "boolean" ? nav.shouldSaveOnNext : undefined,
      };
    }

    // disable all steps by default; re-enable as we encounter them
    for (const stepId of fresh.stepOrder) {
      fresh.steps[stepId].enabled = false;
    }

    const importedSteps = Array.isArray(workflow.steps) ? (workflow.steps as unknown[]) : [];
    const seen = new Set<string>();
    const orderedKnown: string[] = [];

    for (const raw of importedSteps) {
      if (!isPlainObject(raw) || typeof raw.step !== "string") continue;
      const stepId = raw.step;
      const template = SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
      if (!template) {
        fresh.extraSteps.push(structuredClone(raw) as WorkflowStep);
        continue;
      }
      seen.add(stepId);
      orderedKnown.push(stepId);
      const stepState = fresh.steps[stepId];
      stepState.enabled = true;
      if (typeof raw.stepperLabel === "string") stepState.stepperLabel = raw.stepperLabel;
      if (isPlainObject(raw.heading)) {
        stepState.heading = {
          title: typeof raw.heading.title === "string" ? raw.heading.title : undefined,
          subtitle: typeof raw.heading.subtitle === "string" ? raw.heading.subtitle : undefined,
          description: typeof raw.heading.description === "string" ? raw.heading.description : undefined,
        };
      }
      if (isPlainObject(raw.auth)) {
        stepState.importedAuth = structuredClone(raw.auth) as StepAuth;
      } else {
        stepState.useTemplateAuth = false;
      }
      if (isPlainObject(raw.pageLayout)) {
        stepState.importedPageLayout = structuredClone(raw.pageLayout) as StepPageLayout;
      }

      const mainArr = Array.isArray(raw.main) ? (raw.main as ComponentNode[]) : [];
      const footerArr = Array.isArray(raw.footer) ? (raw.footer as ComponentNode[]) : [];
      const matchedMain = matchSlotsToImported(template.mainSlots, mainArr);
      const matchedFooter = matchSlotsToImported(template.footerSlots, footerArr);
      stepState.mainSlots = matchedMain.slots;
      stepState.footerSlots = matchedFooter.slots;
      stepState.extraMain = matchedMain.extras;
      stepState.extraFooter = matchedFooter.extras;
    }

    // Reorder so imported (known) steps come first in their file order, then any
    // unseen known templates trail (still disabled).
    const trailing = fresh.stepOrder.filter((id) => !seen.has(id));
    fresh.stepOrder = [...orderedKnown, ...trailing];
  }

  // proposedPayload
  if (isPlainObject(input.proposedPayload)) {
    fresh.proposedPayload.enabled = true;
    fresh.proposedPayload.rawJson = JSON.stringify(input.proposedPayload, null, 2);
  } else {
    fresh.proposedPayload.enabled = false;
    fresh.proposedPayload.rawJson = "";
  }

  return fresh;
}

/* -------------------------------------------------------------- */
/* Small helpers exported for the GUI                              */
/* -------------------------------------------------------------- */

export function getSlotTemplate(stepId: string, slotId: string): SlotTemplate | undefined {
  const step = SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
  if (!step) return undefined;
  return [...step.mainSlots, ...step.footerSlots].find((s) => s.slotId === slotId);
}

export function previewSlotNode(stepId: string, slotState: SlotState): ComponentNode | undefined {
  const tpl = getSlotTemplate(stepId, slotState.slotId);
  if (!tpl) return undefined;
  return applySlotEdits(slotState.importedNode ?? tpl.baseNode, slotState.edits);
}

export type { ConditionExpression };
