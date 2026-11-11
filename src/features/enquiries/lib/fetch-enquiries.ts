import {
  canonicalizeEnquiryHeader,
  ENQUIRY_COLUMNS,
  ENQUIRY_SHEET_TABS,
  enquiriesSheetCsvUrl,
  getEnquirySheetTab,
  type EnquiryColumn,
  type EnquirySheetTab,
  type EnquirySheetTabId,
} from "./enquiries-config";
import { filterRowsWithEnquiryIdentity } from "./enquiries-columns";
import type { EnquiriesTable } from "../types/enquiries";

/** Minimal RFC-style CSV parse (handles quotes and newlines in fields). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim().length > 0)) {
        rows.push(row);
      }
      row = [];
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }

  row.push(field);
  if (row.some((cell) => cell.trim().length > 0)) {
    rows.push(row);
  }
  return rows;
}

function parseEnquiriesCsv(
  text: string,
  tab: EnquirySheetTab,
): { headers: EnquiryColumn[]; rows: string[][] } {
  const matrix = parseCsv(text);
  if (matrix.length === 0) {
    throw new Error(`Sheet "${tab.sheetName}" is empty`);
  }

  const rawHeaders = matrix[0].map((label) => canonicalizeEnquiryHeader(label));
  const keepIndices: number[] = [];
  const headers: EnquiryColumn[] = [];

  rawHeaders.forEach((header, index) => {
    if (!header) return;
    if (headers.includes(header)) return;
    headers.push(header);
    keepIndices.push(index);
  });

  if (!headers.includes("Client name")) {
    throw new Error(`Sheet "${tab.sheetName}" has no Client name column`);
  }

  let rows = filterRowsWithEnquiryIdentity(
    headers,
    matrix.slice(1).map((cells) => keepIndices.map((index) => (cells[index] ?? "").trim())),
  );

  // Some month tabs (e.g. "nov update") have no serial column — add one so rows stay numbered.
  if (!headers.includes("S No")) {
    headers.unshift("S No");
    rows = rows.map((row) => ["", ...row]);
  }

  return { headers, rows };
}

export async function fetchEnquiriesTable(
  tabId?: EnquirySheetTabId | string | null,
): Promise<EnquiriesTable> {
  const tab = getEnquirySheetTab(tabId);
  // CSV export keeps text in number-typed columns (kw "3+5", estimate "190k") that gviz drops.
  const response = await fetch(enquiriesSheetCsvUrl(tab.gid));
  if (!response.ok) {
    throw new Error(`Could not load enquiries (HTTP ${response.status})`);
  }

  const text = await response.text();
  if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
    throw new Error(
      `Could not export "${tab.sheetName}" as CSV. Check the sheet is shared (Anyone with the link can view).`,
    );
  }

  const { headers, rows } = parseEnquiriesCsv(text, tab);

  return {
    title: tab.title,
    headers,
    rows,
    fetchedAt: new Date().toISOString(),
    tabId: tab.id,
  };
}

export interface AllEnquiriesResult {
  table: EnquiriesTable;
  /** Month tabs that could not be read (the rest still load). */
  failedMonths: Array<{ label: string; message: string }>;
}

/** All month tabs in one table, sheet order (September first), with a Month column. */
export async function fetchAllEnquiriesTable(): Promise<AllEnquiriesResult> {
  const results = await Promise.allSettled(ENQUIRY_SHEET_TABS.map((tab) => fetchEnquiriesTable(tab.id)));
  const loaded: Array<{ label: string; table: EnquiriesTable }> = [];
  const failedMonths: AllEnquiriesResult["failedMonths"] = [];
  results.forEach((result, index) => {
    const tab = ENQUIRY_SHEET_TABS[index];
    if (result.status === "fulfilled") loaded.push({ label: tab.label, table: result.value });
    else
      failedMonths.push({
        label: tab.label,
        message: result.reason instanceof Error ? result.reason.message : "Could not load",
      });
  });
  if (loaded.length === 0) {
    throw new Error(failedMonths.map((month) => `${month.label}: ${month.message}`).join(" · "));
  }

  const present = new Set<string>(["S No", "Month"]);
  for (const { table } of loaded) table.headers.forEach((header) => present.add(header));
  const headers: EnquiryColumn[] = ENQUIRY_COLUMNS.filter((column) => present.has(column));

  const rows: string[][] = [];
  for (const { label, table } of loaded) {
    const sourceIndex = headers.map((header) => table.headers.indexOf(header));
    for (const row of table.rows) {
      rows.push(
        headers.map((header, i) => (header === "Month" ? label : sourceIndex[i] >= 0 ? row[sourceIndex[i]] ?? "" : "")),
      );
    }
  }

  return {
    table: {
      title: "All months · Enquiries",
      headers,
      rows,
      fetchedAt: new Date().toISOString(),
      tabId: "all",
    },
    failedMonths,
  };
}
