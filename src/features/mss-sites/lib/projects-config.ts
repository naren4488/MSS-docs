/**
 * Projects table — Google Sheet sources
 *
 * This file is the single source of truth for which workbook tabs are loaded
 * into the Projects page. See also PROJECT.md §7.7.
 */

export const PROJECTS_SPREADSHEET_ID = "1fe4vitjQwMhw92QltKECwBylbJ8ORWK3TsaI6548SEg";

export const DEC_TO_FEB_SPREADSHEET_ID = "1tkNFHBLjpOZkzayqObWO1VMYkGsD5uy-wrXaBcqHglE";

export const SUB_VENDOR_PAYMENT_SPREADSHEET_ID = "1UrgNeqxEpifcFroxnLU7U4Xah23Li5Hw";

/** Sub Vendor Payment workbook — `Ajay` tab dual ledgers (see docs/planning/ui-ajay-sites.md). */
export const AJAY_SUB_VENDOR_LEDGER = {
  sheetTab: "Ajay",
  tables: [
    {
      id: "money",
      title: "Money ledger",
      columnRange: "A–E",
      headerBalance: -428_500,
    },
    {
      id: "everest-bills",
      title: "Everest Solar Bill",
      columnRange: "K–P",
      headerBalance: 69_179,
    },
  ],
} as const;

/**
 * Sub Vendor Payment workbook — `SATYANARAYAN ` tab (trailing space in sheet name).
 * Projects register spelling: `SATAYNARAYAN JI`.
 */
export const SATYANARAYAN_SUB_VENDOR_LEDGER = {
  sheetTab: "SATYANARAYAN ",
  projectType: "SATAYNARAYAN JI",
  title: "Satyanarayan money ledger",
  columnRange: "A–F",
  headerBalance: 163_372,
} as const;

export const PROJECT_VENDORS = {
  MSS: "MSS",
  ARKSHAKTI: "Arkshakti",
} as const;

/** Top-level Projects page scopes. */
export type ProjectsScope = "our" | "partner" | "shripal" | "ajay";

/**
 * Sheet tab / PROJECT TYPE values that belong on **Our projects**.
 */
export const OUR_PROJECT_TYPES = ["MSS res", "MSS COMMERCIAL"] as const;

export const OUR_PROJECT_TYPE_SET = new Set<string>(OUR_PROJECT_TYPES);

/** Shripal has its own top-level tab (MSS + Arkshakti `SHRIPAL JI` registers). */
export const SHRIPAL_PROJECT_TYPES = ["SHRIPAL JI"] as const;

export const SHRIPAL_PROJECT_TYPE_SET = new Set<string>(SHRIPAL_PROJECT_TYPES);

/** Ajay Ji has its own top-level tab (MSS + Arkshakti `Ajay (everest)` registers). */
export const AJAY_PROJECT_TYPES = ["Ajay (everest)"] as const;

export const AJAY_PROJECT_TYPE_SET = new Set<string>(AJAY_PROJECT_TYPES);

export function isOurProjectType(projectType: string): boolean {
  return OUR_PROJECT_TYPE_SET.has(projectType.trim());
}

export function isShripalProjectType(projectType: string): boolean {
  return SHRIPAL_PROJECT_TYPE_SET.has(projectType.trim());
}

export function isAjayProjectType(projectType: string): boolean {
  return AJAY_PROJECT_TYPE_SET.has(projectType.trim());
}

export function getProjectsScopeForProjectType(projectType: string): ProjectsScope {
  const trimmed = projectType.trim();
  if (isOurProjectType(trimmed)) {
    return "our";
  }
  if (isShripalProjectType(trimmed)) {
    return "shripal";
  }
  if (isAjayProjectType(trimmed)) {
    return "ajay";
  }
  return "partner";
}

/** Human-readable rules for which tabs are included (for docs / debugging). */
export const PROJECT_SHEET_SOURCE_RULES = {
  mss: {
    spreadsheetId: PROJECTS_SPREADSHEET_ID,
    label: "MSS site register",
    /** First tab — used to detect invalid tab names (gviz silently falls back to this). */
    referenceTab: "MSS res",
    /** Include tabs from the start through DHERAJ JI SITES (inclusive). */
    includeThroughTab: "DHERAJ JI SITES",
    /** Never loaded — summary dashboard and tabs after DHERAJ JI SITES. */
    excludedTabs: ["summary", "ALWAR SITES"] as const,
  },
  decToFeb: {
    spreadsheetId: DEC_TO_FEB_SPREADSHEET_ID,
    label: "DEC to FEB (Arkshakti)",
    referenceTab: "MSS res",
    /** Only the first six tabs in workbook order. */
    tabCount: 6,
    /** Tabs after the first six are not loaded (e.g. RAVI, ARKSHKATI COMM, ALWAR SITES). */
    excludedAfterTab: "Pradeep (veer)",
  },
} as const;

export interface ProjectSheetTab {
  /** Exact Google Sheet tab name — must match character-for-character. */
  sheetName: string;
  /** Shown in the PROJECT TYPE column — matches the sheet tab name. */
  projectType: string;
  /** gviz `headers` param (default 1). */
  headerRows?: number;
  /** Each sheet row holds two site entries side-by-side (ARKSHKATI COMM). */
  splitDualSiteRows?: boolean;
}

function projectTab(
  sheetName: string,
  options: Omit<ProjectSheetTab, "sheetName" | "projectType"> = {},
): ProjectSheetTab {
  return { sheetName, projectType: sheetName, ...options };
}

/**
 * MSS workbook — tabs 1 through DHERAJ JI SITES (workbook order).
 * Excludes: summary tab, ALWAR SITES (and anything after it).
 * Tab 9 is "KAVITA MAM" (not "KAVITA MAAM" — wrong spelling makes gviz return MSS res).
 */
export const PROJECT_SHEET_TABS: readonly ProjectSheetTab[] = [
  projectTab("MSS res"),
  projectTab("SHRIPAL JI"),
  projectTab("Rohit (RJ GREEN)"),
  projectTab("SATAYNARAYAN JI"),
  projectTab("Ajay (everest)"),
  projectTab("RAVI JI SITES"),
  projectTab("JITENDRA JI"),
  projectTab("KAVITA MAM"),
  projectTab("SUNNY JI"),
  projectTab("ROHIT JI PHULERA"),
  projectTab("DHERAJ JI SITES"),
];

/**
 * DEC to FEB (Arkshakti) workbook — first 6 tabs only.
 * 1. MSS res  2. SHRIPAL JI  3. MSS COMMERCIAL  4. Ajay (everest)
 * 5. Rohit (RJ GREEN)  6. Pradeep (veer)
 */
export const ARKSHAKTI_SHEET_TABS: readonly ProjectSheetTab[] = [
  projectTab("MSS res"),
  projectTab("SHRIPAL JI"),
  projectTab("MSS COMMERCIAL"),
  projectTab("Ajay (everest)"),
  projectTab("Rohit (RJ GREEN)"),
  projectTab("Pradeep (veer)"),
];

/**
 * Quick sheet-tab chips on the Projects page (below main filters).
 * - With `vendor`: sets Vendor + Project type together (Our / Arkshakti MSS res).
 * - Without `vendor`: sets Partner name only; keeps all vendors selected.
 */
export interface ProjectSheetTabShortcut {
  id: string;
  /** Chip label shown in the UI. */
  label: string;
  /** Optional vendor — when set, chip locks Vendor + Project type. */
  vendor?: string;
  /** Partner / PROJECT TYPE — must match sheet tab `projectType`. */
  projectType: string;
  /** Group heading above the chips (e.g. Arkshakti, Partners). */
  group: string;
  /** Which Projects scope tab shows this chip. */
  scope: ProjectsScope;
}

function partnerSlug(projectType: string) {
  return projectType
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Unique partner register names in workbook order (MSS first, then Arkshakti-only). Excludes Our + Shripal + Ajay. */
function buildPartnerSheetTabShortcuts(): ProjectSheetTabShortcut[] {
  const seen = new Set<string>();
  const shortcuts: ProjectSheetTabShortcut[] = [];

  for (const tab of [...PROJECT_SHEET_TABS, ...ARKSHAKTI_SHEET_TABS]) {
    if (
      isOurProjectType(tab.projectType) ||
      isShripalProjectType(tab.projectType) ||
      isAjayProjectType(tab.projectType) ||
      seen.has(tab.projectType)
    ) {
      continue;
    }
    seen.add(tab.projectType);
    shortcuts.push({
      id: `partner-${partnerSlug(tab.projectType)}`,
      label: tab.projectType,
      projectType: tab.projectType,
      group: "Partners",
      scope: "partner",
    });
  }

  return shortcuts;
}

const OUR_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  {
    id: "arkshakti-mss-res",
    label: "MSS res",
    vendor: PROJECT_VENDORS.ARKSHAKTI,
    projectType: "MSS res",
    group: "Arkshakti",
    scope: "our",
  },
];

/** Shripal sites — vendor chips (same PROJECT TYPE on MSS + Arkshakti workbooks). */
const SHRIPAL_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  {
    id: "mss-shripal",
    label: "MSS",
    vendor: PROJECT_VENDORS.MSS,
    projectType: "SHRIPAL JI",
    group: "Vendor",
    scope: "shripal",
  },
  {
    id: "arkshakti-shripal",
    label: "Arkshakti",
    vendor: PROJECT_VENDORS.ARKSHAKTI,
    projectType: "SHRIPAL JI",
    group: "Vendor",
    scope: "shripal",
  },
];

/** Ajay sites — vendor chips (same PROJECT TYPE on MSS + Arkshakti workbooks). */
const AJAY_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  {
    id: "mss-ajay",
    label: "MSS",
    vendor: PROJECT_VENDORS.MSS,
    projectType: "Ajay (everest)",
    group: "Vendor",
    scope: "ajay",
  },
  {
    id: "arkshakti-ajay",
    label: "Arkshakti",
    vendor: PROJECT_VENDORS.ARKSHAKTI,
    projectType: "Ajay (everest)",
    group: "Vendor",
    scope: "ajay",
  },
];

export const PROJECT_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  ...OUR_SHEET_TAB_SHORTCUTS,
  ...SHRIPAL_SHEET_TAB_SHORTCUTS,
  ...AJAY_SHEET_TAB_SHORTCUTS,
  ...buildPartnerSheetTabShortcuts(),
];

export function getSheetTabShortcutsForScope(scope: ProjectsScope): readonly ProjectSheetTabShortcut[] {
  return PROJECT_SHEET_TAB_SHORTCUTS.filter((shortcut) => shortcut.scope === scope);
}

export function isSheetTabShortcutActive(
  shortcut: ProjectSheetTabShortcut,
  selectedVendors: ReadonlySet<string>,
  selectedProjectTypes: ReadonlySet<string>,
  allVendors: readonly string[],
): boolean {
  if (selectedProjectTypes.size !== 1 || !selectedProjectTypes.has(shortcut.projectType)) {
    return false;
  }

  if (shortcut.vendor) {
    return selectedVendors.size === 1 && selectedVendors.has(shortcut.vendor);
  }

  return (
    allVendors.length > 0 &&
    selectedVendors.size === allVendors.length &&
    allVendors.every((vendor) => selectedVendors.has(vendor))
  );
}

function spreadsheetGvizUrl(spreadsheetId: string, sheetName: string, headerRows = 1) {
  const params = new URLSearchParams({
    tqx: "out:json",
    sheet: sheetName,
    headers: String(headerRows),
  });
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${params}`;
}

export function projectsSheetGvizUrl(sheetName: string, headerRows = 1) {
  return spreadsheetGvizUrl(PROJECTS_SPREADSHEET_ID, sheetName, headerRows);
}

export function decToFebSheetGvizUrl(sheetName: string, headerRows = 1) {
  return spreadsheetGvizUrl(DEC_TO_FEB_SPREADSHEET_ID, sheetName, headerRows);
}
