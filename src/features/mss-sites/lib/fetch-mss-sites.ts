import {
  ARKSHAKTI_SHEET_TABS,
  PROJECT_SHEET_SOURCE_RULES,
  PROJECT_SHEET_TABS,
  PROJECT_VENDORS,
  type ProjectSheetTab,
  decToFebSheetGvizUrl,
  projectsSheetGvizUrl,
} from "./projects-config";
import { dedupeProjectRows } from "./dedupe-project-rows";
import { normalizeSheetForTab } from "./normalize-sheet-rows";
import { fetchGvizSheet } from "./parse-gviz-sheet";
import { PROJECT_TABLE_HEADERS, mapSheetRowToProjectRow, sheetRowHasName } from "./projects-columns";
import type { MssSitesTable } from "../types/mss-sites";

type GvizUrlBuilder = (sheetName: string, headerRows?: number) => string;

async function fetchProjectSheetTab(
  tab: ProjectSheetTab,
  vendor: string,
  buildUrl: GvizUrlBuilder,
  referenceTab: string,
  referenceResponseText: string,
) {
  const rawSheet = await fetchGvizSheet(tab.sheetName, buildUrl, tab.headerRows ?? 1, {
    referenceTab,
    referenceResponseText,
  });
  const sheet = normalizeSheetForTab(rawSheet, tab);

  const rows = sheet.rows
    .filter((row) => sheetRowHasName(sheet.headers, row))
    .map((row) => mapSheetRowToProjectRow(sheet.headers, row, tab.projectType, vendor));

  return {
    sheetName: tab.sheetName,
    projectType: tab.projectType,
    vendor,
    rowCount: rows.length,
    rows,
  };
}

async function fetchSpreadsheetTabs(
  tabs: readonly ProjectSheetTab[],
  vendor: string,
  buildUrl: GvizUrlBuilder,
  referenceTab: string,
) {
  const referenceResponse = await fetch(buildUrl(referenceTab));
  if (!referenceResponse.ok) {
    throw new Error(`Could not load reference tab "${referenceTab}" (HTTP ${referenceResponse.status})`);
  }
  const referenceResponseText = await referenceResponse.text();

  const results = [];

  for (const tab of tabs) {
    results.push(
      await fetchProjectSheetTab(tab, vendor, buildUrl, referenceTab, referenceResponseText),
    );
  }

  return results;
}

export async function fetchMssSitesTable(): Promise<MssSitesTable> {
  const [mssResults, arkshaktiResults] = await Promise.all([
    fetchSpreadsheetTabs(
      PROJECT_SHEET_TABS,
      PROJECT_VENDORS.MSS,
      projectsSheetGvizUrl,
      PROJECT_SHEET_SOURCE_RULES.mss.referenceTab,
    ),
    fetchSpreadsheetTabs(
      ARKSHAKTI_SHEET_TABS,
      PROJECT_VENDORS.ARKSHAKTI,
      decToFebSheetGvizUrl,
      PROJECT_SHEET_SOURCE_RULES.decToFeb.referenceTab,
    ),
  ]);

  const failedTabs = [...mssResults, ...arkshaktiResults].filter((result) => result.rowCount === 0);
  if (failedTabs.length > 0) {
    console.warn(
      "Projects: tabs loaded with zero NAME/Client rows:",
      failedTabs.map((tab) => `${tab.sheetName} (${tab.projectType})`).join(", "),
    );
  }

  const mergedRows = [...mssResults, ...arkshaktiResults].flatMap((result) => result.rows);

  const headers = [...PROJECT_TABLE_HEADERS];
  const dedupedRows = dedupeProjectRows(
    headers,
    mergedRows.map((row) => [String(0), ...row]),
  ).map((row) => row.slice(1));

  const rows = dedupedRows.map((row, index) => [String(index + 1), ...row]);

  if (rows.length === 0) {
    throw new Error("No project rows found in Google Sheet");
  }

  return {
    title: "Projects",
    headers,
    rows,
    fetchedAt: new Date().toISOString(),
  };
}

/** Dev helper: per-tab row counts after fetch (before dedupe). */
export async function fetchMssSitesTabSummary() {
  const [mssResults, arkshaktiResults] = await Promise.all([
    fetchSpreadsheetTabs(
      PROJECT_SHEET_TABS,
      PROJECT_VENDORS.MSS,
      projectsSheetGvizUrl,
      PROJECT_SHEET_SOURCE_RULES.mss.referenceTab,
    ),
    fetchSpreadsheetTabs(
      ARKSHAKTI_SHEET_TABS,
      PROJECT_VENDORS.ARKSHAKTI,
      decToFebSheetGvizUrl,
      PROJECT_SHEET_SOURCE_RULES.decToFeb.referenceTab,
    ),
  ]);

  return [...mssResults, ...arkshaktiResults].map((result) => ({
    sheetName: result.sheetName,
    projectType: result.projectType,
    vendor: result.vendor,
    rowCount: result.rowCount,
  }));
}
