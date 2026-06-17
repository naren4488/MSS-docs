import { dedupeProjectRows, getSheetTabSignature } from "./dedupe-project-rows";
import {
  ARKSHAKTI_SHEET_TABS,
  PROJECT_SHEET_TABS,
  PROJECT_VENDORS,
  decToFebSheetGvizUrl,
  projectsSheetGvizUrl,
} from "./projects-config";
import { PROJECT_TABLE_HEADERS, mapSheetRowToProjectRow, sheetRowHasName } from "./projects-columns";
import { fetchGvizSheet } from "./parse-gviz-sheet";
import type { MssSitesTable } from "../types/mss-sites";

type GvizUrlBuilder = (sheetName: string, headerRows?: number) => string;

async function fetchProjectSheetTab(
  sheetName: string,
  projectType: string,
  vendor: string,
  buildUrl: GvizUrlBuilder,
) {
  const sheet = await fetchGvizSheet(sheetName, buildUrl);

  const rows = sheet.rows
    .filter((row) => sheetRowHasName(sheet.headers, row))
    .map((row) => mapSheetRowToProjectRow(sheet.headers, row, projectType, vendor));

  return {
    sheetName,
    headers: sheet.headers,
    rawRows: sheet.rows.filter((row) => sheetRowHasName(sheet.headers, row)),
    rows,
  };
}

export async function fetchMssSitesTable(): Promise<MssSitesTable> {
  const [mssTab, ...partnerTabs] = PROJECT_SHEET_TABS;
  const mssResult = await fetchProjectSheetTab(
    mssTab.sheetName,
    mssTab.projectType,
    PROJECT_VENDORS.MSS,
    projectsSheetGvizUrl,
  );
  const mssSignature = getSheetTabSignature(mssResult.headers, mssResult.rawRows);

  const [partnerResults, arkshaktiResults] = await Promise.all([
    Promise.all(
      partnerTabs.map((tab) =>
        fetchProjectSheetTab(tab.sheetName, tab.projectType, PROJECT_VENDORS.MSS, projectsSheetGvizUrl),
      ),
    ),
    Promise.all(
      ARKSHAKTI_SHEET_TABS.map((tab) =>
        fetchProjectSheetTab(tab.sheetName, tab.projectType, PROJECT_VENDORS.ARKSHAKTI, decToFebSheetGvizUrl),
      ),
    ),
  ]);

  const mergedRows = [
    ...mssResult.rows,
    ...partnerResults
      .filter((result) => getSheetTabSignature(result.headers, result.rawRows) !== mssSignature)
      .flatMap((result) => result.rows),
    ...arkshaktiResults.flatMap((result) => result.rows),
  ];

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
