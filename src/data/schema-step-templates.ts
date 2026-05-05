/**
 * Curated scaffolds for each known workflow step id observed across the
 * reference JSONs (Cinch, Greentech, Solutions Builder).
 *
 * Each step template is the union of patterns found in the samples. Each
 * component lives in a "slot" with a stable `slotId` so the configurator
 * GUI can:
 *   - toggle the slot on/off,
 *   - edit a curated subset of editable fields (label, binding, etc.),
 *   - round-trip arbitrary extras (`baseNode` is preserved verbatim and the
 *     GUI overlays only the curated edits when emitting).
 */

import type { ComponentNode, StepAuth, StepPageLayout, WorkflowStep } from "./standardized-schema";

export type EditableField =
  | "label"
  | "required"
  | "default"
  | "binding"
  | "content"
  | "actions"
  | "options"
  | "selectionRules";

export type SlotTemplate = {
  /** Stable id used for hydration/round-trip matching. */
  slotId: string;
  /** Friendly label shown in the configurator GUI. */
  displayName: string;
  /** Optional helper text shown under the slot row. */
  hint?: string;
  /** Whether the slot is on by default in a fresh template. */
  defaultEnabled: boolean;
  /** Full snapshot for the slot — used as the emit base. */
  baseNode: ComponentNode;
  /** Curated editable fields for this slot. */
  editable: readonly EditableField[];
};

export type StepTemplate = {
  /** Schema `step` id (e.g., `basicInfo`). */
  step: string;
  /** Friendly label for the configurator GUI tab/card. */
  displayName: string;
  /** When false, hidden by default in a fresh template (PM opts in). */
  defaultEnabled: boolean;
  stepperLabel: string;
  heading: { title?: string; subtitle?: string; description?: string };
  auth?: StepAuth;
  pageLayout?: StepPageLayout;
  mainSlots: SlotTemplate[];
  footerSlots: SlotTemplate[];
};

const PAGE_LAYOUT_MAIN_NARROW: StepPageLayout = {
  main: { styling: { core: "md:w-2/3 lg:w-1/3" } },
};

const PAGE_LAYOUT_MAIN_NARROW_FOOTER_RR: StepPageLayout = {
  main: { styling: { core: "md:w-2/3 lg:w-1/3" } },
  footer: {
    styling: {
      layout: { lg: { type: "flex", direction: "row-reverse", justify: "end" } },
    },
  },
};

const PAGE_LAYOUT_FOOTER_RR_QUARTER: StepPageLayout = {
  footer: {
    styling: {
      core: "lg:w-1/4",
      layout: { lg: { type: "flex", direction: "row-reverse", justify: "end" } },
    },
  },
};

const PAGE_LAYOUT_FOOTER_RR: StepPageLayout = {
  footer: {
    styling: {
      layout: { lg: { type: "flex", direction: "row-reverse", justify: "end" } },
    },
  },
};

const slot = (s: SlotTemplate): SlotTemplate => s;

/* ---------- basicInfo ---------- */

const basicInfo: StepTemplate = {
  step: "basicInfo",
  displayName: "Basic Information",
  defaultEnabled: true,
  stepperLabel: "Basic Information",
  heading: {
    title: "HVAC Upgrade Tool",
    subtitle: "Job Proposal",
    description:
      "Before we get started, we'll need to verify your information and some basic details to personalize your upgrade options.",
  },
  pageLayout: PAGE_LAYOUT_MAIN_NARROW,
  mainSlots: [
    slot({
      slotId: "basicInfo.infoBanner",
      displayName: "Info banner",
      defaultEnabled: false,
      hint: "Optional callout above the form (used by Solutions Builder).",
      baseNode: {
        component: "InfoBanner",
        properties: {
          content:
            "Providing your information allows us to connect you with your local Pro.",
        },
      },
      editable: ["content"],
    }),
    slot({
      slotId: "basicInfo.firstName",
      displayName: "First name input",
      defaultEnabled: true,
      baseNode: {
        component: "TextInput",
        properties: { label: "First name", required: true },
        binding: "@contacts.contactForm.firstName",
      },
      editable: ["label", "required", "binding"],
    }),
    slot({
      slotId: "basicInfo.lastName",
      displayName: "Last name input",
      defaultEnabled: true,
      baseNode: {
        component: "TextInput",
        properties: { label: "Last name", required: true },
        binding: "@contacts.contactForm.lastName",
      },
      editable: ["label", "required", "binding"],
    }),
    slot({
      slotId: "basicInfo.email",
      displayName: "Email input",
      defaultEnabled: true,
      baseNode: {
        component: "TextInput",
        properties: { type: "email", label: "Email", required: true },
        binding: "@contacts.contactForm.email",
      },
      editable: ["label", "required", "binding"],
    }),
    slot({
      slotId: "basicInfo.phone",
      displayName: "Phone input",
      defaultEnabled: true,
      baseNode: {
        component: "PhoneInput",
        properties: { label: "Phone number", required: true },
        binding: "@contacts.contactForm.phone",
        styling: { core: "md:w-[180px]" },
      },
      editable: ["label", "required", "binding"],
    }),
  ],
  footerSlots: [
    slot({
      slotId: "basicInfo.verifyButton",
      displayName: "Primary button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Verify Information" },
        actions: [{ type: "validateStep" }, { type: "nextStep" }],
        disabledWhen: {
          path: "@contacts.isCurrentContactValid",
          operator: "equals",
          value: false,
        },
      },
      editable: ["label", "actions"],
    }),
  ],
};

/* ---------- propertyDetails ---------- */

const propertyDetails: StepTemplate = {
  step: "propertyDetails",
  displayName: "Property Details",
  defaultEnabled: true,
  stepperLabel: "Property Details",
  heading: {
    title: "HVAC Upgrade Tool",
    subtitle: "Job Proposal",
    description:
      "Enter the property address for the upgrade so we can provide the most accurate options for your home.",
  },
  auth: {
    required: true,
    preAuthData: { email: "@contacts.contactForm.email" },
  },
  pageLayout: PAGE_LAYOUT_MAIN_NARROW_FOOTER_RR,
  mainSlots: [
    slot({
      slotId: "propertyDetails.infoBanner",
      displayName: "Info banner",
      defaultEnabled: false,
      baseNode: {
        component: "InfoBanner",
        properties: {
          content:
            "Your address helps us provide a heating and cooling system that is the best fit for your home.",
        },
      },
      editable: ["content"],
    }),
    slot({
      slotId: "propertyDetails.autoSuggest",
      displayName: "Property address auto-suggest",
      defaultEnabled: true,
      baseNode: {
        component: "PropertyInfoAutoSuggest",
        properties: { label: "Property address", required: true },
      },
      editable: ["label", "required"],
    }),
    slot({
      slotId: "propertyDetails.addressManualInput",
      displayName: "Manual address fallback",
      defaultEnabled: true,
      hint: "Auto-shown when @propertyInfo.showAddressManualInput is true.",
      baseNode: {
        component: "AddressManualInput",
        showWhen: {
          path: "@propertyInfo.showAddressManualInput",
          operator: "equals",
          value: true,
        },
      },
      editable: [],
    }),
    slot({
      slotId: "propertyDetails.occupiedCheckbox",
      displayName: "Occupied checkbox",
      defaultEnabled: true,
      baseNode: {
        component: "Checkbox",
        properties: { label: "Property is currently occupied", default: true },
        binding: "@propertyInfo.isOccupied",
      },
      editable: ["label", "default", "binding"],
    }),
    slot({
      slotId: "propertyDetails.verificationPanel",
      displayName: "Address verification panel",
      defaultEnabled: true,
      baseNode: {
        component: "AddressVerificationPanel",
        showWhen: {
          path: "@workflow.verifyHome.showVerifyHome",
          operator: "equals",
          value: true,
        },
      },
      editable: [],
    }),
  ],
  footerSlots: [
    slot({
      slotId: "propertyDetails.verifyButton",
      displayName: "Verify address button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Verify Address" },
        actions: [
          { type: "validateStep" },
          { type: "moduleAction", module: "propertyInfo", name: "getHomeInfo" },
          { type: "flipBool", targetPath: "@workflow.verifyHome.showVerifyHome" },
        ],
        disabledWhen: [
          { path: "@propertyInfo.hasValidAddress", operator: "equals", value: false },
          { path: "@propertyInfo.addressIsValid", operator: "equals", value: false },
        ],
      },
      editable: ["label", "actions"],
    }),
    slot({
      slotId: "propertyDetails.backButton",
      displayName: "Back button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Back", variant: "secondary" },
        actions: [{ type: "previousStep" }],
      },
      editable: ["label", "actions"],
    }),
  ],
};

/* ---------- hvacGoals ---------- */

const hvacGoals: StepTemplate = {
  step: "hvacGoals",
  displayName: "HVAC Goals",
  defaultEnabled: true,
  stepperLabel: "HVAC Goals",
  heading: {
    title: "HVAC Upgrade Tool",
    subtitle: "Job Proposal",
    description: "Choose the 2 most important aspects of your HVAC goals.",
  },
  pageLayout: PAGE_LAYOUT_FOOTER_RR_QUARTER,
  mainSlots: [
    slot({
      slotId: "hvacGoals.sectionButtonGroup",
      displayName: "HVAC goals options",
      defaultEnabled: true,
      hint: "Choices the customer can select from. Max selections caps how many can be picked at once.",
      baseNode: {
        component: "SectionButtonGroup",
        properties: {
          selectionRules: { minimum: 0, maximum: 2 },
          options: [
            { label: "Lower utility costs", targetPath: "@workflow.goals.hvacGoals.lowerCost" },
            { label: "Better performance", targetPath: "@workflow.goals.hvacGoals.betterPerformance" },
            { label: "Modernize my system", targetPath: "@workflow.goals.hvacGoals.modernizeSystem" },
            { label: "Improve air quality", targetPath: "@workflow.goals.hvacGoals.improveAirQuality" },
          ],
        },
        styling: {
          core: "lg:w-3/4",
          layout: {
            default: { type: "grid", columns: 2 },
            lg: { type: "grid", columns: 4 },
          },
        },
      },
      editable: ["options", "selectionRules"],
    }),
  ],
  footerSlots: [
    slot({
      slotId: "hvacGoals.continueButton",
      displayName: "Continue button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Continue" },
        styling: { core: "xl:w-[120px]" },
        actions: [{ type: "validateStep" }, { type: "nextStep" }],
      },
      editable: ["label", "actions"],
    }),
    slot({
      slotId: "hvacGoals.backButton",
      displayName: "Back button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Go Back", variant: "secondary" },
        styling: { core: "xl:w-[120px]" },
        actions: [{ type: "previousStep" }],
      },
      editable: ["label", "actions"],
    }),
  ],
};

/* ---------- currentSystem ---------- */

const currentSystem: StepTemplate = {
  step: "currentSystem",
  displayName: "Current System",
  defaultEnabled: true,
  stepperLabel: "Current System",
  heading: {
    title: "HVAC Upgrade Tool",
    subtitle: "Job Proposal",
    description: "Tell us what you know about your current system type.",
  },
  pageLayout: PAGE_LAYOUT_FOOTER_RR_QUARTER,
  mainSlots: [
    slot({
      slotId: "currentSystem.container",
      displayName: "Current system container",
      defaultEnabled: true,
      hint: "Holds the client-specific current-system widget (e.g., CinchCurrentSystemInfo).",
      baseNode: {
        component: "CurrentSystemContainer",
        properties: {
          children: [{ component: "CinchCurrentSystemInfo" }],
        },
      },
      editable: [],
    }),
  ],
  footerSlots: [
    slot({
      slotId: "currentSystem.viewUpgradeButton",
      displayName: "View upgrade button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "View Upgrade" },
        styling: { core: "lg:w-[120px]" },
        actions: [{ type: "nextStep" }],
        disabledWhen: {
          path: "@bundles.hasBundlesAndRequiredFields",
          operator: "equals",
          value: false,
        },
      },
      editable: ["label", "actions"],
    }),
    slot({
      slotId: "currentSystem.backButton",
      displayName: "Back button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Go Back", variant: "secondary" },
        actions: [{ type: "previousStep" }],
      },
      editable: ["label", "actions"],
    }),
  ],
};

/* ---------- yourMatch ---------- */

const yourMatch: StepTemplate = {
  step: "yourMatch",
  displayName: "Your Match",
  defaultEnabled: true,
  stepperLabel: "Your Match",
  heading: { title: "Your HVAC Upgrade!", subtitle: "Job Proposal" },
  mainSlots: [
    slot({
      slotId: "yourMatch.matchLayout",
      displayName: "Match summary layout",
      defaultEnabled: true,
      hint: "Bundle card + price + contact + schedule button. Edit deep contents in code.",
      baseNode: {
        component: "Container",
        styling: {
          core: "lg:gap-16",
          layout: { lg: { type: "flex", direction: "row" } },
        },
        properties: {
          children: [
            {
              component: "SummaryBundleCard",
              binding: {
                systemsDataPath: "@bundles.systems",
                currentSystemIndexPath: {
                  target: "@workflow.yourMatch.currentSystemIndex",
                  default: 0,
                },
              },
              styling: { core: "mb-10 flex-1" },
            },
            {
              component: "Container",
              properties: {
                children: [
                  { component: "PriceBreakdown", binding: "@pricing.finalPrice" },
                  {
                    component: "ContactInfo",
                    binding: "@contacts.contactForm",
                    styling: { core: "order-3 lg:order-2" },
                  },
                  {
                    component: "Container",
                    properties: {
                      children: [
                        {
                          component: "Button",
                          properties: { label: "Schedule Free Inspection" },
                          actions: [
                            {
                              type: "flipBool",
                              targetPath: "@workflow.yourMatch.showScheduleDrawer",
                            },
                          ],
                        },
                        {
                          component: "Button",
                          properties: { label: "Go Back", variant: "secondary" },
                          actions: [{ type: "previousStep" }],
                        },
                      ],
                    },
                    styling: {
                      core: "order-2 lg:order-3",
                      layout: {
                        default: { direction: "col" },
                        lg: {
                          type: "flex",
                          direction: "row-reverse",
                          justify: "start",
                        },
                      },
                    },
                  },
                ],
              },
              styling: { core: "flex-1" },
            },
          ],
        },
      },
      editable: [],
    }),
    slot({
      slotId: "yourMatch.alternativeOptions",
      displayName: "Alternative options",
      defaultEnabled: true,
      baseNode: { component: "SummaryBundleAlternativeOptions" },
      editable: [],
    }),
    slot({
      slotId: "yourMatch.scheduleDrawer",
      displayName: "Schedule inspection drawer",
      defaultEnabled: true,
      baseNode: {
        component: "ScheduleDrawer",
        properties: {
          title: "Show Schedule Drawer",
          containerContentType: "inspection",
        },
        binding: {
          timezonePath: "@propertyInfo.timezone",
          appointmentsPath: "@bundles.inspectionSchedules",
        },
        showWhen: {
          path: "@workflow.yourMatch.showScheduleDrawer",
          operator: "equals",
          value: true,
        },
        actions: [
          {
            type: "moduleAction",
            name: "validateInspectionSchedule",
            module: "bundles",
          },
          { type: "submitWorkOrderProposal" },
        ],
      },
      editable: [],
    }),
  ],
  footerSlots: [],
};

/* ---------- systemUpgrade ---------- */

const systemUpgrade: StepTemplate = {
  step: "systemUpgrade",
  displayName: "System Upgrade",
  defaultEnabled: false,
  stepperLabel: "System Upgrade",
  heading: { description: "Select the type of solution you are most interested in for your home." },
  pageLayout: PAGE_LAYOUT_FOOTER_RR,
  mainSlots: [
    slot({
      slotId: "systemUpgrade.container",
      displayName: "System upgrade container",
      defaultEnabled: true,
      baseNode: { component: "SystemUpgradeContainer" },
      editable: [],
    }),
    slot({
      slotId: "systemUpgrade.optInCommunication",
      displayName: "Opt-in communication checkbox",
      defaultEnabled: true,
      baseNode: {
        component: "OptInCommunication",
        properties: {
          label: "I agree to receive communications.",
          description:
            "We respect your privacy. By submitting your information here, you agree that we may contact you about our current and future products and services.",
          disclaimer:
            "You can unsubscribe from these communications at any time. By clicking submit below, you consent to allow us to store and process the personal information submitted above to provide you the content requested.",
          required: true,
          default: false,
        },
        binding: "@contacts.optInCommunication",
      },
      editable: ["label", "required", "binding", "default"],
    }),
    slot({
      slotId: "systemUpgrade.recaptcha",
      displayName: "reCAPTCHA",
      defaultEnabled: true,
      baseNode: {
        component: "ReCaptcha",
        showWhen: {
          path: "@systemUpgrades.hasBundlesAndRequiredFields",
          operator: "equals",
          value: true,
        },
      },
      editable: [],
    }),
    slot({
      slotId: "systemUpgrade.disclaimer",
      displayName: "Submit disclaimer text",
      defaultEnabled: true,
      baseNode: {
        component: "Text",
        properties: {
          content:
            "By clicking submit, you understand you will be contacted by your local Pro to review your personalized solution.",
        },
        styling: { core: "text-xs" },
      },
      editable: ["content"],
    }),
  ],
  footerSlots: [
    slot({
      slotId: "systemUpgrade.submitButton",
      displayName: "Submit button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Submit" },
        disabledWhen: [
          {
            path: "@systemUpgrades.hasBundlesAndRequiredFields",
            operator: "equals",
            value: false,
          },
          {
            path: "@workflow.reCaptchaVerified",
            operator: "not_equals",
            value: true,
          },
          {
            path: "@contacts.optInCommunication",
            operator: "equals",
            value: false,
          },
        ],
        actions: [
          { type: "validateStep" },
          { type: "generateSalesforceWebToCase" },
          { type: "nextStep" },
        ],
      },
      editable: ["label", "actions"],
    }),
    slot({
      slotId: "systemUpgrade.backButton",
      displayName: "Back button",
      defaultEnabled: true,
      baseNode: {
        component: "Button",
        properties: { label: "Back", variant: "secondary" },
        actions: [
          { type: "previousStep" },
          { type: "setValue", targetPath: "@workflow.reCaptchaVerified", value: false },
        ],
      },
      editable: ["label", "actions"],
    }),
  ],
};

/* ---------- summary ---------- */

const summaryPageLayout: StepPageLayout = {
  main: {
    styling: {
      core: "lg:gap-x-16",
      layout: { lg: { type: "grid", columns: 2, items: "start" } },
    },
  },
};

const summary: StepTemplate = {
  step: "summary",
  displayName: "Summary",
  defaultEnabled: false,
  stepperLabel: "Summary",
  heading: {},
  pageLayout: summaryPageLayout,
  mainSlots: [
    slot({
      slotId: "summary.upgradeDetails",
      displayName: "Upgrade details container",
      defaultEnabled: true,
      baseNode: {
        component: "Container",
        styling: { core: "flex-1" },
        properties: {
          children: [
            {
              component: "SummarySystemUpgradeDetails",
              binding: {
                systemsDataPath: "@systemUpgrades.systems",
                currentSystemIndexPath: {
                  target: "@workflow.yourMatch.currentSystemIndex",
                  default: 0,
                },
              },
            },
          ],
        },
      },
      editable: [],
    }),
    slot({
      slotId: "summary.sideContainer",
      displayName: "Side container (addons + contact + buttons)",
      defaultEnabled: true,
      hint: "Holds add-ons, contact info, property address, next-steps copy, and PDF/email buttons.",
      baseNode: {
        component: "Container",
        styling: { core: "flex-1" },
        properties: {
          children: [
            {
              component: "SummaryAddonContainer",
              showWhen: {
                path: "@workflow.summary.hideAddonsContent",
                operator: "equals",
                value: false,
              },
              styling: { core: "mt-6 lg:mt-0" },
            },
            {
              component: "ContactInfo",
              binding: "@contacts.contactForm",
              showWhen: {
                path: "@workflow.summary.hideAddonsContent",
                operator: "equals",
                value: true,
              },
            },
            {
              component: "PropertyAddress",
              showWhen: {
                path: "@workflow.summary.hideAddonsContent",
                operator: "equals",
                value: true,
              },
            },
            {
              component: "FluidButtonGroup",
              properties: {
                children: [
                  {
                    component: "Button",
                    properties: { label: "Restart Upgrade", variant: "secondary" },
                    actions: [{ type: "resetWorkflow" }],
                  },
                  {
                    component: "Button",
                    properties: { label: "Email", variant: "secondary", preIcon: "MailIcon" },
                    actions: [{ type: "sendReportPDF" }],
                  },
                  {
                    component: "Button",
                    properties: { label: "Download PDF", preIcon: "PDFIcon", preIconColor: "white" },
                    actions: [{ type: "generateReportPDF" }],
                  },
                ],
              },
              styling: {
                core: "my-6",
                layout: {
                  default: { type: "flex", direction: "col-reverse" },
                  lg: { type: "flex", direction: "row", justify: "end" },
                },
              },
            },
          ],
        },
      },
      editable: [],
    }),
  ],
  footerSlots: [],
};

export const SCHEMA_STEP_TEMPLATES: readonly StepTemplate[] = [
  basicInfo,
  propertyDetails,
  hvacGoals,
  currentSystem,
  yourMatch,
  systemUpgrade,
  summary,
];

export function getStepTemplate(stepId: string): StepTemplate | undefined {
  return SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
}
