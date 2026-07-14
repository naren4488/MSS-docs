/**
 * Projects table — Google Sheet sources
 *
 * This file is the single source of truth for which workbook tabs are loaded
 * into the Projects page. See also PROJECT.md §7.7.
 */

export const PROJECTS_SPREADSHEET_ID = "1fe4vitjQwMhw92QltKECwBylbJ8ORWK3TsaI6548SEg";

export const DEC_TO_FEB_SPREADSHEET_ID = "1tkNFHBLjpOZkzayqObWO1VMYkGsD5uy-wrXaBcqHglE";

export const PROJECT_VENDORS = {
  MSS: "MSS",
  ARKSHAKTI: "Arkshakti",
} as const;

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
