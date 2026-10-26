/**
 * Projects table — Google Sheet sources
 *
 * This file is the single source of truth for which workbook tabs are loaded
 * into the Projects page.
 */

export const PROJECTS_SPREADSHEET_ID = "1fe4vitjQwMhw92QltKECwBylbJ8ORWK3TsaI6548SEg";

export const DEC_TO_FEB_SPREADSHEET_ID = "1tkNFHBLjpOZkzayqObWO1VMYkGsD5uy-wrXaBcqHglE";

export const SUB_VENDOR_PAYMENT_SPREADSHEET_ID = "1UrgNeqxEpifcFroxnLU7U4Xah23Li5Hw";

/** Loans Ledgers workbook — Shripal Ji tab left block (see docs/planning/loans-ledgers.md). */
export const LOANS_LEDGERS_SPREADSHEET_ID = "1_CZnKHpPoISlSxjESlZdiQohpimMkbgHC6pA28hxQME";

export const SHRIPAL_CASH_BANK_LEDGER = {
  spreadsheetTitle: "Loans Ledgers",
  sheetTab: "Shripal Ji",
  projectType: "SHRIPAL JI",
  title: "Cash / Bank",
  columnRange: "A–F",
  headerDr: 66_600,
  headerCr: 218_805,
  closingBalance: -152_205,
} as const;

/** Sub Vendor Payment workbook — `Ajay` tab dual ledgers (see docs/planning/ui-ajay-sites.md). */
export const AJAY_SUB_VENDOR_LEDGER = {
  sheetTab: "Ajay",
  tables: [
    {
      id: "money",
      title: "Money ledger",
      columnRange: "A–E",
      headerBalance: 509_590,
    },
    {
      id: "everest-bills",
      title: "Everest Solar Bill",
      columnRange: "K–P",
      headerBalance: 77_781,
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
  headerBalance: 169_992,
} as const;

/**
 * Sub Vendor Payment workbook — `BS enterprises` tab (also Satyanarayan / SATAYNARAYAN JI).
 */
export const SATYANARAYAN_BS_ENTERPRISES_LEDGER = {
  sheetTab: "BS enterprises",
  projectType: "SATAYNARAYAN JI",
  title: "BS Enterprises",
  columnRange: "A–F",
  headerDr: 295_761,
  headerCr: 125_000,
  headerBalance: 170_761,
} as const;

export const PROJECT_VENDORS = {
  MSS: "MSS",
  ARKSHAKTI: "Arkshakti",
} as const;

/** Top-level Projects page scopes. */
export type ProjectsScope = "our" | "partner" | "shripal" | "ajay" | "satyanarayan" | "rjgreen";

/**
 * Sheet tab / PROJECT TYPE values that belong on **Our projects**.
 * Five registers: MSS New, MSS res (MSS + Ark), CALL TEAM SITE, MSS COMMERCIAL (Ark).
 */
export const OUR_PROJECT_TYPES = ["MSS New", "MSS res", "CALL TEAM SITE", "MSS COMMERCIAL"] as const;

export const OUR_PROJECT_TYPE_SET = new Set<string>(OUR_PROJECT_TYPES);

/**
 * MSS workbook tab `MSS New  ` (trailing spaces in the live sheet title).
 * Exact sheet name is required for gviz.
 */
export const MSS_NEW_SHEET_NAME = "MSS New  ";

/**
 * MSS workbook tab `CALL TEAM SITE` — included under **Our projects**.
 * Exact sheet name is required for gviz (wrong name silently returns `MSS res`).
 */
export const CALL_TEAM_SHEET_NAME = "CALL TEAM SITE";

/** Shripal has its own top-level tab (MSS + Arkshakti `SHRIPAL JI` registers). */
export const SHRIPAL_PROJECT_TYPES = ["SHRIPAL JI"] as const;

export const SHRIPAL_PROJECT_TYPE_SET = new Set<string>(SHRIPAL_PROJECT_TYPES);

/** Ajay Ji has its own top-level tab (MSS + Arkshakti `Ajay (everest)` registers). */
export const AJAY_PROJECT_TYPES = ["Ajay (everest)"] as const;

export const AJAY_PROJECT_TYPE_SET = new Set<string>(AJAY_PROJECT_TYPES);

/** Satyanarayan has its own top-level tab (MSS workbook `SATAYNARAYAN JI`). */
export const SATYANARAYAN_PROJECT_TYPES = ["SATAYNARAYAN JI"] as const;

export const SATYANARAYAN_PROJECT_TYPE_SET = new Set<string>(SATYANARAYAN_PROJECT_TYPES);

/** Rohit RJ Green has its own top-level tab (MSS + Arkshakti `Rohit (RJ GREEN)`). */
export const RJGREEN_PROJECT_TYPES = ["Rohit (RJ GREEN)"] as const;

export const RJGREEN_PROJECT_TYPE_SET = new Set<string>(RJGREEN_PROJECT_TYPES);

export function isOurProjectType(projectType: string): boolean {
  return OUR_PROJECT_TYPE_SET.has(projectType.trim());
}

/** Our projects — hide partner-only columns; cash due = from client. */
export function isOurStyleProjectsScope(scope: ProjectsScope): boolean {
  return scope === "our";
}

export function isShripalProjectType(projectType: string): boolean {
  return SHRIPAL_PROJECT_TYPE_SET.has(projectType.trim());
}

export function isAjayProjectType(projectType: string): boolean {
  return AJAY_PROJECT_TYPE_SET.has(projectType.trim());
}

export function isSatyanarayanProjectType(projectType: string): boolean {
  return SATYANARAYAN_PROJECT_TYPE_SET.has(projectType.trim());
}

export function isRjGreenProjectType(projectType: string): boolean {
  return RJGREEN_PROJECT_TYPE_SET.has(projectType.trim());
}

/** Dedicated partner-style tabs excluded from the aggregate Partner projects scope. */
export function isDedicatedPartnerProjectType(projectType: string): boolean {
  const trimmed = projectType.trim();
  return (
    isShripalProjectType(trimmed) ||
    isAjayProjectType(trimmed) ||
    isSatyanarayanProjectType(trimmed) ||
    isRjGreenProjectType(trimmed)
  );
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
  if (isSatyanarayanProjectType(trimmed)) {
    return "satyanarayan";
  }
  if (isRjGreenProjectType(trimmed)) {
    return "rjgreen";
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
    /** Include tabs from the start through DHERAJ JI SITES (inclusive), plus CALL TEAM SITE. */
    includeThroughTab: "DHERAJ JI SITES",
    /** Never loaded — summary dashboard, Alwar, and other unused partner/inc tabs. */
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
  options: Partial<Omit<ProjectSheetTab, "sheetName">> = {},
): ProjectSheetTab {
  const { projectType = sheetName, ...rest } = options;
  return { sheetName, projectType, ...rest };
}

/**
 * MSS workbook — loaded registers (explicit list, not workbook order).
 * `MSS New  ` and `CALL TEAM SITE` are fetched by exact sheet name (Our projects).
 * Excludes: summary, ALWAR SITES, PENDING SITES, POORAN JI, inc tabs, reject/cash-due dashboards.
 * "KAVITA MAM" (not "KAVITA MAAM" — wrong spelling makes gviz return MSS res).
 */
export const PROJECT_SHEET_TABS: readonly ProjectSheetTab[] = [
  projectTab(MSS_NEW_SHEET_NAME, { projectType: "MSS New" }),
  projectTab("MSS res"),
  projectTab(CALL_TEAM_SHEET_NAME, { projectType: "CALL TEAM SITE" }),
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
 * - Chips set only the Register/PROJECT TYPE filter.
 * - Vendor selection remains unchanged.
 */
export interface ProjectSheetTabShortcut {
  id: string;
  /** Chip label shown in the UI. */
  label: string;
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

/** Unique partner register names in workbook order (MSS first, then Arkshakti-only). Excludes dedicated tabs. */
function buildPartnerSheetTabShortcuts(): ProjectSheetTabShortcut[] {
  const seen = new Set<string>();
  const shortcuts: ProjectSheetTabShortcut[] = [];

  for (const tab of [...PROJECT_SHEET_TABS, ...ARKSHAKTI_SHEET_TABS]) {
    if (
      isOurProjectType(tab.projectType) ||
      isDedicatedPartnerProjectType(tab.projectType) ||
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
    id: "our-mss-new",
    label: "MSS New",
    projectType: "MSS New",
    group: "Register",
    scope: "our",
  },
  {
    id: "our-mss-res",
    label: "MSS res",
    projectType: "MSS res",
    group: "Register",
    scope: "our",
  },
  {
    id: "our-call-team",
    label: "CALL TEAM SITE",
    projectType: "CALL TEAM SITE",
    group: "Register",
    scope: "our",
  },
  {
    id: "our-mss-commercial",
    label: "MSS commercial",
    projectType: "MSS COMMERCIAL",
    group: "Register",
    scope: "our",
  },
];

/** Shripal sites — vendor chips (same PROJECT TYPE on MSS + Arkshakti workbooks). */
const SHRIPAL_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  {
    id: "shripal",
    label: "Shripal Ji",
    projectType: "SHRIPAL JI",
    scope: "shripal",
    group: "Register",
  },
];

/** Ajay sites — vendor chips (same PROJECT TYPE on MSS + Arkshakti workbooks). */
const AJAY_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  {
    id: "ajay",
    label: "Ajay Ji",
    projectType: "Ajay (everest)",
    scope: "ajay",
    group: "Register",
  },
];

/** Satyanarayan sites — single register chip. */
const SATYANARAYAN_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  {
    id: "satyanarayan",
    label: "Satyanarayan Ji",
    projectType: "SATAYNARAYAN JI",
    scope: "satyanarayan",
    group: "Register",
  },
];

/** RJ Green sites — vendor chips (MSS + Arkshakti). */
const RJGREEN_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  {
    id: "rjgreen",
    label: "RJ Green",
    projectType: "Rohit (RJ GREEN)",
    scope: "rjgreen",
    group: "Register",
  },
];

export const PROJECT_SHEET_TAB_SHORTCUTS: readonly ProjectSheetTabShortcut[] = [
  ...OUR_SHEET_TAB_SHORTCUTS,
  ...SHRIPAL_SHEET_TAB_SHORTCUTS,
  ...AJAY_SHEET_TAB_SHORTCUTS,
  ...SATYANARAYAN_SHEET_TAB_SHORTCUTS,
  ...RJGREEN_SHEET_TAB_SHORTCUTS,
  ...buildPartnerSheetTabShortcuts(),
];

export function getSheetTabShortcutsForScope(scope: ProjectsScope): readonly ProjectSheetTabShortcut[] {
  return PROJECT_SHEET_TAB_SHORTCUTS.filter((shortcut) => shortcut.scope === scope);
}

export function isSheetTabShortcutActive(
  shortcut: ProjectSheetTabShortcut,
  selectedProjectTypes: ReadonlySet<string>,
): boolean {
  return selectedProjectTypes.size === 1 && selectedProjectTypes.has(shortcut.projectType);
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
