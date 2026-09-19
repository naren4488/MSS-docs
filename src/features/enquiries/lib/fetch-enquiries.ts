import {
  canonicalizeEnquiryHeader,
  ENQUIRIES_SHEET_TAB,
  enquiriesSheetCsvUrl,
  type EnquiryColumn,
} from "./enquiries-config";
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

function parseEnquiriesCsv(text: string): { headers: EnquiryColumn[]; rows: string[][] } {
  const matrix = parseCsv(text);
  if (matrix.length === 0) {
    throw new Error(`Sheet "${ENQUIRIES_SHEET_TAB}" is empty`);
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
    throw new Error(`Sheet "${ENQUIRIES_SHEET_TAB}" has no Client name column`);
  }

  const rows = matrix.slice(1).map((cells) => keepIndices.map((index) => (cells[index] ?? "").trim()));

  return { headers, rows };
}

export async function fetchEnquiriesTable(): Promise<EnquiriesTable> {
  // CSV export keeps text in number-typed columns (kw "3+5", estimate "190k") that gviz drops.
  const response = await fetch(enquiriesSheetCsvUrl());
  if (!response.ok) {
    throw new Error(`Could not load enquiries (HTTP ${response.status})`);
  }

  const text = await response.text();
  if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
    throw new Error(
      `Could not export "${ENQUIRIES_SHEET_TAB}" as CSV. Check the sheet is shared (Anyone with the link can view).`,
    );
  }

  const { headers, rows } = parseEnquiriesCsv(text);

  return {
    title: "Sep Updated · Enquiries",
    headers,
    rows,
    fetchedAt: new Date().toISOString(),
  };
}
