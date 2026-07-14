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
  | "selectionRules"
  | "key"
  | "keyName";

/**
 * Optional grouping metadata. Slots with the same `group.id` are rendered
 * together inside a single collapsible section in the GUI.
 */
export type SlotGroup = {
  /** Stable id (only slots sharing this id are grouped). */
  id: string;
  /** Friendly heading shown on the collapsed section. */
  label: string;
  /** When true, the section starts collapsed in the GUI. */
  defaultCollapsed?: boolean;
};

/**
 * A single deeply-nested string value inside a passthrough slot that the GUI
 * exposes as an editable text field (e.g. a button label or phone number buried
 * several containers deep). The `path` is a sequence of object keys / array
 * indices from the slot's `baseNode` down to the string leaf.
 */
export type DeepField = {
  /** Stable id for the edits map. */
  key: string;
  /** Friendly label shown in the GUI. */
  label: string;
  /** Path from baseNode to the string value (keys + array indices). */
  path: readonly (string | number)[];
  /** Optional `tel:` href path to keep in sync (digits derived from the value). */
  telHrefPath?: readonly (string | number)[];
};

export type SlotTemplate = {
  /** Stable id used for hydration/round-trip matching. */
  slotId: string;
  /** Friendly label shown in the configurator GUI. */
  displayName: string;
  /** Optional helper text shown under the slot row. */
  hint?: string;
  /** Whether the slot is on by default in a fresh template. */
  defaultEnabled: boolean;
  /**
   * When true, the slot cannot be disabled in the GUI. The user can still edit
   * any fields listed in `editable`, but the include/exclude checkbox is
   * permanently checked.
   */
  locked?: boolean;
  /** Optional collapsible group this slot belongs to. */
  group?: SlotGroup;
  /** Full snapshot for the slot — used as the emit base. */
  baseNode: ComponentNode;
  /** Curated editable fields for this slot. */
  editable: readonly EditableField[];
  /** Deeply-nested string fields exposed as editable text inputs. */
  deepFields?: readonly DeepField[];
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
    description:
      "Before we get started, we need a few details to create your personalized solution.",
  },
  pageLayout: PAGE_LAYOUT_MAIN_NARROW,
  mainSlots: [
    slot({
      slotId: "basicInfo.infoBanner",
      displayName: "Info banner",
      defaultEnabled: true,
      hint: "Callout above the form.",
      baseNode: {
        component: "InfoBanner",
        properties: {
          content:
            "Providing your information allows us to connect you with your local Daikin Pro.",
        },
      },
      editable: ["content"],
    }),
    slot({
      slotId: "basicInfo.basicInformation",
      displayName: "Basic information form",
      defaultEnabled: true,
      hint: "Single component that collects first name, last name, email, and phone.",
      baseNode: { component: "BasicInformation" },
      editable: [],
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
    description: "Enter your property address so we can estimate your home's size.",
  },
  pageLayout: PAGE_LAYOUT_MAIN_NARROW_FOOTER_RR,
  mainSlots: [
    slot({
      slotId: "propertyDetails.infoBanner",
      displayName: "Info banner",
      defaultEnabled: true,
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
      locked: true,
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
      locked: true,
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
      locked: true,
      baseNode: {
        component: "AddressVerificationPanel",
        properties: { display: { numberOfSystems: false } },
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
      locked: true,
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
      editable: ["label"],
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
  displayName: "Home Goals",
  defaultEnabled: false,
  stepperLabel: "Home Goals",
  heading: {
    title: "HVAC Upgrade Tool",
    subtitle: "Job Proposal",
    description: "Choose the 2 most important aspects of your home goals.",
  },
  pageLayout: PAGE_LAYOUT_FOOTER_RR_QUARTER,
  mainSlots: [
    slot({
      slotId: "hvacGoals.sectionButtonGroup",
      displayName: "Home goals options",
      defaultEnabled: true,
      hint: "Choices the customer can select from. Max selections caps how many can be picked at once.",
      baseNode: {
        component: "SectionButtonGroup",
        properties: {
          selectionRules: { minimum: 0, maximum: 2 },
          options: [
            { label: "Lower utility costs", targetPath: "@workflow.goals.homeGoals.lowerUtilityCosts" },
            { label: "Better performance", targetPath: "@workflow.goals.homeGoals.betterPerformance" },
            { label: "Modernize my system", targetPath: "@workflow.goals.homeGoals.modernizeMySystem" },
            { label: "Improve air quality", targetPath: "@workflow.goals.homeGoals.improveAirQuality" },
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
  defaultEnabled: false,
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
      hint: "Renders the system-upgrade widget tied to the user's property.",
      baseNode: {
        component: "SystemUpgradeContainer",
        binding: {
          requireSqFtPath: {
            target: "@workflow.systemUpgrade.requireSqFt",
            default: false,
          },
          showSqFtPath: {
            target: "@workflow.systemUpgrade.showSqFt",
            default: false,
          },
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
          path: "@systemUpgrades.hasBundlesAndRequiredFields",
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
  defaultEnabled: false,
  stepperLabel: "Your Match",
  heading: { title: "Your HVAC Upgrade!", subtitle: "Job Proposal" },
  mainSlots: [
    slot({
      slotId: "yourMatch.matchLayout",
      displayName: "Match summary layout",
      defaultEnabled: true,
      hint: "System details + add-ons + price + contact info + Schedule/Go Back buttons. Passthrough — non-editable in the GUI.",
      baseNode: {
        component: "Container",
        styling: {
          core: "lg:gap-16",
          layout: { lg: { type: "flex", direction: "row" } },
        },
        properties: {
          children: [
            {
              component: "SystemUpgradeDetails",
              styling: { core: "flex-1 h-full" },
              binding: {
                systemsDataPath: "@systemUpgrades.systems",
                currentSystemIndexPath: {
                  target: "@workflow.summary.currentSystemIndex",
                  default: 0,
                },
              },
            },
            {
              component: "Container",
              properties: {
                children: [
                  {
                    component: "AddonContainer",
                    showWhen: {
                      path: "@workflow.summary.hideAddonsContent",
                      operator: "equals",
                      value: false,
                    },
                    styling: { core: "lg:mt-0" },
                  },
                  {
                    component: "MountingOptionContainer",
                    showWhen: {
                      path: "@workflow.summary.hideMountTypesContent",
                      operator: "equals",
                      value: false,
                    },
                  },
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
      slotId: "yourMatch.scheduleDrawer",
      displayName: "Schedule inspection drawer",
      defaultEnabled: true,
      baseNode: {
        component: "ScheduleDrawer",
        properties: { containerContentType: "inspection" },
        binding: {
          timezonePath: "@propertyInfo.timezone",
          appointmentsPath: "@systemUpgrades.inspectionSchedules",
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
            module: "systemUpgrades",
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
  defaultEnabled: true,
  stepperLabel: "System Upgrade",
  heading: { description: "Select the type of solution you are most interested in for your home." },
  pageLayout: PAGE_LAYOUT_FOOTER_RR,
  mainSlots: [
    slot({
      slotId: "systemUpgrade.container",
      displayName: "System upgrade container",
      defaultEnabled: true,
      baseNode: {
        component: "SystemUpgradeContainer",
        binding: {
          requireSqFtPath: {
            target: "@workflow.systemUpgrade.requireSqFt",
            default: false,
          },
          showSqFtPath: {
            target: "@workflow.systemUpgrade.showSqFt",
            default: false,
          },
          enableMountTypeNaming: {
            target: "@workflow.systemUpgrade.enableMountTypeNaming",
            default: true,
          },
        },
      },
      editable: [],
    }),
    slot({
      slotId: "systemUpgrade.optInCommunication",
      displayName: "Opt-in communication checkbox",
      defaultEnabled: false,
      group: { id: "daikin", label: "Daikin Specific Config", defaultCollapsed: true },
      baseNode: {
        component: "OptInCommunication",
        properties: {
          label: "I agree to receive communications from Daikin.",
          description:
            "Daikin respects your privacy. Our Privacy Policy outlines how we collect and use information. By submitting your information here, you agree that we may contact you about our current and future products and services and that you are directing us to provide your submitted information to independent dealers in your area that offer our products and services. Your agreement and consent are not required to make a purchase but help facilitate future communications about, and the purchase of, Daikin, Goodman, and Amana-brand products and services.",
          disclaimer:
            "You can unsubscribe from these communications at any time. For more information on how to unsubscribe, our privacy practices, and how we are committed to protecting and respecting your privacy, please review our Privacy Policy. \n By clicking submit below, you consent to allow Daikin to store and process the personal information submitted above to provide you the content requested.",
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
      defaultEnabled: false,
      group: { id: "daikin", label: "Daikin Specific Config", defaultCollapsed: true },
      baseNode: {
        component: "ReCaptcha",
      },
      editable: [],
    }),
    slot({
      slotId: "systemUpgrade.disclaimer",
      displayName: "Submit disclaimer text",
      defaultEnabled: false,
      group: { id: "daikin", label: "Daikin Specific Config", defaultCollapsed: true },
      baseNode: {
        component: "Text",
        properties: {
          content:
            "By clicking submit, you understand you will be contacted by your local Daikin Pro to review your personalized solution.",
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
          { type: "validateSystemUpgrades" },
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
      core: "lg:gap-16",
    },
  },
};

const summary: StepTemplate = {
  step: "summary",
  displayName: "Summary",
  defaultEnabled: true,
  stepperLabel: "Summary",
  heading: {},
  pageLayout: summaryPageLayout,
  mainSlots: [
    slot({
      slotId: "summary.detailsLayout",
      displayName: "System details + next steps",
      defaultEnabled: true,
      hint: "System details, add-ons, mount options, next-steps copy, phone number, and the PDF/email buttons.",
      baseNode: {
        component: "Container",
        styling: {
          core: "lg:gap-x-16",
          layout: { lg: { type: "flex", direction: "row" } },
        },
        properties: {
          children: [
            {
              component: "SystemUpgradeDetails",
              styling: { core: "flex-1 h-full" },
              binding: {
                systemsDataPath: "@systemUpgrades.systems",
                currentSystemIndexPath: {
                  target: "@workflow.summary.currentSystemIndex",
                  default: 0,
                },
              },
            },
            {
              component: "Container",
              styling: { core: "lg:flex-1" },
              properties: {
                children: [
                  {
                    component: "AddonContainer",
                    styling: { core: "lg:mt-0" },
                    showWhen: {
                      path: "@workflow.summary.hideAddonsContent",
                      operator: "equals",
                      value: false,
                    },
                  },
                  {
                    component: "MountingOptionContainer",
                    showWhen: {
                      path: "@workflow.summary.hideMountTypesContent",
                      operator: "equals",
                      value: false,
                    },
                  },
                  {
                    component: "Container",
                    styling: { core: "mt-2 gap-1" },
                    properties: {
                      children: [
                        {
                          component: "Text",
                          properties: { content: "Next steps with your Daikin Pro" },
                          styling: { core: "font-semibold text-gray-600" },
                        },
                        {
                          component: "Text",
                          properties: {
                            content:
                              "A trusted local Daikin Pro will be assigned to you shortly (Monday – Friday, 8 a.m. – 5 p.m. CST). You can expect to be contacted within 2 business days to schedule an in-home assessment to review the recommended solutions.",
                          },
                          styling: { core: "text-sm text-gray-600" },
                        },
                        {
                          component: "Container",
                          styling: {
                            core: "gap-1 text-sm text-gray-600",
                            layout: { default: { type: "flex", direction: "row", wrap: true } },
                          },
                          properties: {
                            children: [
                              {
                                component: "Text",
                                properties: { content: "If you have additional questions, please call " },
                                styling: { core: "text-sm" },
                              },
                              {
                                component: "Text",
                                properties: { content: "833-803-1172", href: "tel:8338031172" },
                                styling: { core: "text-sm" },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    component: "FluidButtonGroup",
                    styling: {
                      core: "my-6 lg:mb-0",
                      layout: {
                        default: { type: "flex", direction: "col-reverse" },
                        lg: { type: "flex", direction: "row", justify: "end" },
                      },
                    },
                    properties: {
                      children: [
                        {
                          component: "Button",
                          properties: { label: "Start Over", variant: "secondary" },
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
                  },
                ],
              },
            },
          ],
        },
      },
      editable: [],
      deepFields: [
        {
          key: "phone",
          label: "Support phone number",
          path: [
            "properties", "children", 1,
            "properties", "children", 2,
            "properties", "children", 2,
            "properties", "children", 1,
            "properties", "content",
          ],
          telHrefPath: [
            "properties", "children", 1,
            "properties", "children", 2,
            "properties", "children", 2,
            "properties", "children", 1,
            "properties", "href",
          ],
        },
        {
          key: "btnStartOver",
          label: "Button: Start Over",
          path: [
            "properties", "children", 1,
            "properties", "children", 3,
            "properties", "children", 0,
            "properties", "label",
          ],
        },
        {
          key: "btnEmail",
          label: "Button: Email",
          path: [
            "properties", "children", 1,
            "properties", "children", 3,
            "properties", "children", 1,
            "properties", "label",
          ],
        },
        {
          key: "btnDownloadPdf",
          label: "Button: Download PDF",
          path: [
            "properties", "children", 1,
            "properties", "children", 3,
            "properties", "children", 2,
            "properties", "label",
          ],
        },
      ],
    }),
    slot({
      slotId: "summary.contactLayout",
      displayName: "Contact + pricing + technology info",
      defaultEnabled: true,
      hint: "Contact info, property address, pricing disclaimer, and technology details.",
      baseNode: {
        component: "Container",
        styling: {
          core: "lg:gap-x-16",
          layout: {
            default: { type: "flex", direction: "col-reverse" },
            lg: { type: "flex", direction: "row" },
          },
        },
        properties: {
          children: [
            {
              component: "Container",
              styling: { core: "flex-1" },
              properties: {
                children: [
                  { component: "ContactInfo", binding: "@contacts.contactForm" },
                  { component: "PropertyAddress" },
                  {
                    component: "Container",
                    styling: { core: "gap-1" },
                    properties: {
                      children: [
                        {
                          component: "Text",
                          properties: { content: "Pricing is finalized after an in-home assessment" },
                          styling: { core: "text-gray-600 font-semibold" },
                        },
                        {
                          component: "Text",
                          properties: {
                            content:
                              "Equipment pricing can vary based on your home, installation requirements, and local contractor rates. A Daikin Comfort Pro will assess and confirm the appropriate system FIT.",
                          },
                          styling: { core: "text-sm text-gray-600" },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              component: "TechnologyAdditionalInfo",
              styling: { core: "flex-1" },
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
  systemUpgrade,
  summary,
  // Optional/legacy steps (default off) — PMs can toggle on and reorder.
  hvacGoals,
  currentSystem,
  yourMatch,
];

export function getStepTemplate(stepId: string): StepTemplate | undefined {
  return SCHEMA_STEP_TEMPLATES.find((t) => t.step === stepId);
}
