/**
 * Mirrors `public/config-future-state.html` DEFAULT_CONFIG.entries — update both when the model changes.
 */
export type FutureStateConfigItem = {
  name?: string;
  display?: boolean;
  summary?: string;
  optionCount?: number;
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
            'If True: reference 3, reference 4, reference 5 as available inputs; label would be an input field - "Cinch ID" mapped to reference 3',
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
            { field: "value 1", display: true },
            { field: "value 2", display: true },
            { field: "value 3", display: true },
            { field: "value 4", display: true },
            { field: "value 5", display: true },
            { field: "value 6", display: true },
            { field: "value 7", display: true },
            { field: "value 8", display: true },
          ],
          summary: "Total options = # of options = total # of text fields",
        },
        {
          name: "Max selections",
          display: true,
          summary: "(hypothetically 2); Max ≤ number of total options",
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
        {
          name: "Type: best match or Good Better Best",
          display: true,
          configuration: [{ name: "Alternative options", display: true }],
        },
        { name: "Customer Notes", display: true },
        { name: "Price", display: true },
        { name: "Add Ons", display: true },
        { name: "Email", display: true },
        { name: "PDF", display: true },
        {
          name: "Schedule Inspection",
          display: true,
          summary: "T/F gate; Based on Job Status module being visible/true",
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
