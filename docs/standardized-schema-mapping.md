# Standardized Schema ↔ GUI mapping

This document maps the standardized client config JSON schema (Cinch, Greentech, Solutions Builder) to the Schema Configurator GUI at `/schema-configurator`. It is meant as a working reference for product + engineering as the configurator grows.

The configurator's goal is **PM-editable, ~95% complete** — anything not exposed in the GUI either uses sensible defaults from the curated templates in [`src/data/schema-step-templates.ts`](../src/data/schema-step-templates.ts) **or** round-trips verbatim from an imported JSON via the per-step `extraMain`/`extraFooter`, top-level `extraSteps`, and the raw `proposedPayload` JSON textarea.

Legend: `✅` = exposed in GUI, `🟡` = exposed via raw editor / preserved on round-trip only, `❌` = not exposed and dropped on a from-scratch build (would need to be re-added through the JSON editor).

---

## A. Schema fields and how the GUI handles them

### Top-level

| Schema path | GUI exposure | Notes |
| --- | --- | --- |
| `id` | ✅ MetaCard → "id" | Required; also used as default download filename. |
| `title` | ✅ MetaCard → "title" | Required. |
| `description` | ✅ MetaCard → "description" | Required. |
| `version` | ✅ MetaCard → "version" | Default `1.0.0`. |
| `type` | ✅ MetaCard → pill toggle | `B2C` / `B2B`. |
| `display.pageHeader` | ✅ MetaCard → "Include display block" | Only emitted when the toggle is on. |
| `display.pageFooter` | ✅ MetaCard | Same. |
| `display.stepHeader` | ✅ MetaCard | Same. |

### Theme

| Schema path | GUI exposure | Notes |
| --- | --- | --- |
| `theme.colors.primary.{100..900}` | ✅ ThemeCard | Color picker + hex input per shade. |
| `theme.colors.secondary.{100..900}` | ✅ ThemeCard | Same. |
| `theme.colors.background.primary` (linear-gradient) | ✅ ThemeCard | Angle + dynamic stops list with live CSS preview. Supports any number of stops. |
| `theme.colors.background.primary` as a plain string | 🟡 | Round-trips only when imported; GUI authors gradients exclusively. Plain-string backgrounds will be dropped on a from-scratch export. |
| Any future `theme.colors.tertiary` / brand palettes | ❌ | Not modeled. |

### FAQs

| Schema path | GUI exposure | Notes |
| --- | --- | --- |
| `faqs.default[].question` / `.answer` | ✅ FaqsCard | Add/remove/reorder via list. |
| `faqs.default[].details[]` | 🟡 | Modeled in state; only the `jobStatus` list shows the details editor in the GUI today. Imported `details[]` on the default list round-trip on export. |
| `faqs.jobStatus[].question` / `.answer` | ✅ FaqsCard | Add/remove/reorder. |
| `faqs.jobStatus[].details[].title` / `.content` | ✅ FaqsCard | Per-item nested editor. |

### Landing page

| Schema path | GUI exposure | Notes |
| --- | --- | --- |
| `landingPage.manufacturerLogos[]` | ✅ LandingPageCard | String array editor. |
| Any future landingPage fields | ❌ | Not modeled. |

### Workflow settings

| Schema path | GUI exposure | Notes |
| --- | --- | --- |
| `workflow.defaultStepPostAuthentication` | ✅ WorkflowSettingsCard | Numeric input; omitted when blank. |
| `workflow.moduleConfigs.contacts.mode` | ✅ WorkflowSettingsCard | `single` / `multiple` pill toggle. |
| Other `workflow.moduleConfigs.*` modules | ❌ | Not modeled today; would need a new card. |
| `workflow.navigation.showProgress` | ✅ WorkflowSettingsCard | |
| `workflow.navigation.shouldSaveOnNext` | ✅ WorkflowSettingsCard | |

### Workflow steps

Each step is a card driven by a curated template in [`src/data/schema-step-templates.ts`](../src/data/schema-step-templates.ts). Toggling a step on/off includes/excludes it from `workflow.steps[]`.

| Schema path | GUI exposure | Notes |
| --- | --- | --- |
| `workflow.steps[].step` | ✅ (read-only) | Identity. Step ids that don't match any template are kept verbatim under `extraSteps` and round-trip on export. |
| `workflow.steps[].stepperLabel` | ✅ StepCard → "stepperLabel" | |
| `workflow.steps[].heading.title` | ✅ StepCard | |
| `workflow.steps[].heading.subtitle` | ✅ StepCard | |
| `workflow.steps[].heading.description` | ✅ StepCard | |
| `workflow.steps[].auth.required` / `.preAuthData` | 🟡 | Inherited from the template by default; if a different shape is imported, it is preserved verbatim on export. Not editable in the GUI. |
| `workflow.steps[].pageLayout.*` (styling, breakpoints) | 🟡 | Same as `auth` — inherited from template, preserved on import. The GUI does not author Tailwind class strings, breakpoint flex/grid configs, or column counts. |
| `workflow.steps[].main[]` curated components | ✅ See per-component table below. |
| `workflow.steps[].main[]` non-curated components | 🟡 `extraMain[]` per step | Preserved on import, not editable, appended verbatim on export. |
| `workflow.steps[].footer[]` curated components | ✅ See per-component table below. |
| `workflow.steps[].footer[]` non-curated components | 🟡 `extraFooter[]` per step | Same as above. |

### Component-level fields (across `main[]` / `footer[]`)

| Component path | GUI exposure | Notes |
| --- | --- | --- |
| `component` | ✅ (read-only badge) | Comes from the slot template. |
| `properties.label` | ✅ when slot's `editable` includes `"label"` | |
| `properties.required` | ✅ when slot's `editable` includes `"required"` | |
| `properties.default` | ✅ when slot's `editable` includes `"default"` | |
| `properties.content` | ✅ when slot's `editable` includes `"content"` | |
| `properties.options[]` (label + targetPath) | ✅ for `SectionButtonGroup` slot | Add/remove/reorder. |
| `properties.selectionRules.{minimum,maximum}` | ✅ for `SectionButtonGroup` slot | |
| `properties.children[]` (Container / FluidButtonGroup) | ❌ in GUI | Snapshot from template is preserved as-is; per-child editing is not exposed. To customize children, edit the JSON via the proposedPayload-style approach (export → tweak → re-import). |
| `properties.{title, description, disclaimer, hideNumberOfSystems, …}` (other props) | 🟡 | Snapshot preserved; not editable in GUI. |
| `binding` (string) | ✅ when slot's `editable` includes `"binding"` | |
| `binding` (object — e.g. `SummaryBundleCard.binding`) | 🟡 | Preserved from template snapshot; not editable. |
| `styling.core` / `styling.layout.{default,lg,xl}` | 🟡 | Preserved from template / import; not editable. |
| `actions[].type` | ✅ when slot's `editable` includes `"actions"` | Dropdown from `KNOWN_ACTION_TYPES`; custom action types are preserved if imported. |
| `actions[].module` (moduleAction) | ✅ same | |
| `actions[].name` (moduleAction / setValue / flipBool) | ✅ same | |
| `actions[].targetPath` (flipBool / setValue) | ✅ same | |
| `actions[].value` (setValue) | ✅ same | Authored as JSON literal. |
| `showWhen` (single rule or array) | 🟡 | Preserved from template / import; not authored in GUI. |
| `disabledWhen` (single rule or array) | 🟡 | Preserved from template / import; not authored in GUI. |

### Proposed payload

| Schema path | GUI exposure | Notes |
| --- | --- | --- |
| `proposedPayload.metadata.*` | ✅ ProposedPayloadCard (raw JSON) | Raw textarea with live JSON-parse error indicator. |
| `proposedPayload.summary.*` | ✅ ProposedPayloadCard (raw JSON) | |
| Special directives like `{ "$filterTrue": true, "value": "@workflow.goals" }` | ✅ via raw JSON | The textarea round-trips arbitrary JSON. |

---

## B. GUI fields with no direct schema home

The configurator is built FROM the standardized schema, so this section is intentionally short. It tracks UI-only state that is not serialized:

- **Per-slot `enabled` toggle** — represented by including/omitting the component from the emitted array, not as a schema field.
- **Per-step `enabled` toggle** — same; toggled-off steps are simply omitted from `workflow.steps[]`.
- **`includeDisplay` / per-toggle "enable…" flags** (theme palettes, FAQs, landing page, contacts module) — control whether the corresponding optional schema block is emitted at all. They have no schema field; absence in the JSON is the canonical "off" state.

Nothing else is invented by the GUI.

---

## C. Per-step component map (curated slots)

Each row maps a slot in the GUI to its emitted JSON path. `[…]` indicates the index inside `main[]` or `footer[]` after disabled slots are filtered out.

### `basicInfo`

| Slot | Component | Emit path |
| --- | --- | --- |
| `basicInfo.infoBanner` | `InfoBanner` | `workflow.steps[basicInfo].main[…]` |
| `basicInfo.firstName` | `TextInput` | `workflow.steps[basicInfo].main[…]` |
| `basicInfo.lastName` | `TextInput` | `workflow.steps[basicInfo].main[…]` |
| `basicInfo.email` | `TextInput` | `workflow.steps[basicInfo].main[…]` |
| `basicInfo.phone` | `PhoneInput` | `workflow.steps[basicInfo].main[…]` |
| `basicInfo.verifyButton` | `Button` | `workflow.steps[basicInfo].footer[…]` |

### `propertyDetails`

| Slot | Component | Emit path |
| --- | --- | --- |
| `propertyDetails.infoBanner` | `InfoBanner` | `workflow.steps[propertyDetails].main[…]` |
| `propertyDetails.autoSuggest` | `PropertyInfoAutoSuggest` | `workflow.steps[propertyDetails].main[…]` |
| `propertyDetails.addressManualInput` | `AddressManualInput` | `workflow.steps[propertyDetails].main[…]` |
| `propertyDetails.occupiedCheckbox` | `Checkbox` | `workflow.steps[propertyDetails].main[…]` |
| `propertyDetails.verificationPanel` | `AddressVerificationPanel` | `workflow.steps[propertyDetails].main[…]` |
| `propertyDetails.verifyButton` | `Button` | `workflow.steps[propertyDetails].footer[…]` |
| `propertyDetails.backButton` | `Button` | `workflow.steps[propertyDetails].footer[…]` |

### `hvacGoals`

| Slot | Component | Emit path |
| --- | --- | --- |
| `hvacGoals.sectionButtonGroup` | `SectionButtonGroup` | `workflow.steps[hvacGoals].main[…]` |
| `hvacGoals.continueButton` | `Button` | `workflow.steps[hvacGoals].footer[…]` |
| `hvacGoals.backButton` | `Button` | `workflow.steps[hvacGoals].footer[…]` |

### `currentSystem`

| Slot | Component | Emit path |
| --- | --- | --- |
| `currentSystem.container` | `CurrentSystemContainer` | `workflow.steps[currentSystem].main[…]` |
| `currentSystem.viewUpgradeButton` | `Button` | `workflow.steps[currentSystem].footer[…]` |
| `currentSystem.backButton` | `Button` | `workflow.steps[currentSystem].footer[…]` |

> Note: the inner `CinchCurrentSystemInfo` child is preserved from the template snapshot. Other client-specific child components (e.g., a hypothetical `GreentechCurrentSystemInfo`) need to be wired in here or pasted via the JSON import path.

### `yourMatch`

| Slot | Component | Emit path |
| --- | --- | --- |
| `yourMatch.matchLayout` | `Container` (deeply nested) | `workflow.steps[yourMatch].main[…]` |
| `yourMatch.alternativeOptions` | `SummaryBundleAlternativeOptions` | `workflow.steps[yourMatch].main[…]` |
| `yourMatch.scheduleDrawer` | `ScheduleDrawer` | `workflow.steps[yourMatch].main[…]` |

### `systemUpgrade`

| Slot | Component | Emit path |
| --- | --- | --- |
| `systemUpgrade.container` | `SystemUpgradeContainer` | `workflow.steps[systemUpgrade].main[…]` |
| `systemUpgrade.optInCommunication` | `OptInCommunication` | `workflow.steps[systemUpgrade].main[…]` |
| `systemUpgrade.recaptcha` | `ReCaptcha` | `workflow.steps[systemUpgrade].main[…]` |
| `systemUpgrade.disclaimer` | `Text` | `workflow.steps[systemUpgrade].main[…]` |
| `systemUpgrade.submitButton` | `Button` | `workflow.steps[systemUpgrade].footer[…]` |
| `systemUpgrade.backButton` | `Button` | `workflow.steps[systemUpgrade].footer[…]` |

### `summary`

| Slot | Component | Emit path |
| --- | --- | --- |
| `summary.upgradeDetails` | `Container` | `workflow.steps[summary].main[…]` |
| `summary.sideContainer` | `Container` (with `FluidButtonGroup` inside) | `workflow.steps[summary].main[…]` |

---

## D. Open questions for the PM / dev

1. **`companyId` ↔ `id` linkage.** Today the configurator emits `id` at the top level and leaves `proposedPayload.summary.companyId` for the PM to set in the raw JSON editor. Should the GUI auto-populate `companyId` from `id`?
2. **Job Status step.** None of the three reference JSONs include a `jobStatus` step; the only `jobStatus` lane today lives under `faqs.jobStatus`. If a future client introduces a real `jobStatus` step, we'll need a new template entry in `schema-step-templates.ts`.
3. **`pageLayout` authoring.** Tailwind `core` strings and breakpoint configs (`md:w-2/3`, `lg:gap-x-16`, `flex-row-reverse`, etc.) are the highest-friction items for a PM. Worth designing a future "layout preset" picker (narrow / wide / split / two-column) instead of free-form Tailwind.
4. **`showWhen` / `disabledWhen` authoring.** Currently preserved as-is. A future enhancement would be a condition-builder that targets the workflow path tree, but the path universe is large and client-specific.
5. **Custom client widgets** like `CinchCurrentSystemInfo`, `SystemUpgradeContainer`, `SummaryBundleCard`. These are referenced by name only — the runtime knows how to render them. If a new client introduces its own custom widget, we either (a) add a step template variant or (b) the PM imports from a sibling client and the snapshot rides along.
6. **Theme `background.primary` shape variance.** Cinch/Greentech omit the field entirely; Solutions Builder uses a 2-stop gradient. If clients need radial-gradient or solid-color backgrounds, the gradient editor needs a new variant.
7. **FAQ `default[].details[]`.** Modeled in state but not surfaced in the GUI on the default list. If product wants a unified editor (details on both lists), a one-line GUI tweak in `FaqsCard` enables it.
