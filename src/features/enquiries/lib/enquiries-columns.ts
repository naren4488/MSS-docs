import {
  ENQUIRY_FILTER_COLUMNS,
  ENQUIRY_MORE_COLUMNS,
  ENQUIRY_VISIBLE_COLUMNS,
  type EnquiryColumn,
  type EnquiryFilterColumn,
} from "./enquiries-config";
import type { EnquiriesTable } from "../types/enquiries";

export function columnIndex(headers: readonly string[], column: EnquiryColumn): number {
  return headers.indexOf(column);
}

export function withSequentialSerialNumbers(headers: readonly string[], rows: string[][]): string[][] {
  const sNo = columnIndex(headers, "S No");
  if (sNo < 0) return rows;
  return rows.map((row, index) => {
    const next = [...row];
    next[sNo] = String(index + 1);
    return next;
  });
}

export function filterRowsByClientName(headers: readonly string[], rows: string[][], query: string): string[][] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  const index = columnIndex(headers, "Client name");
  if (index < 0) return rows;
  return rows.filter((row) => (row[index] ?? "").toLowerCase().includes(needle));
}

export function filterRowsBySelectedValues(
  headers: readonly string[],
  rows: string[][],
  column: EnquiryColumn,
  selected: Set<string>,
  allOptions: string[],
): string[][] {
  if (allOptions.length === 0) return rows;
  if (selected.size === 0) return [];
  if (selected.size === allOptions.length) return rows;
  const index = columnIndex(headers, column);
  if (index < 0) return rows;
  return rows.filter((row) => {
    const raw = row[index]?.trim() ?? "";
    const key = raw || "(blank)";
    return selected.has(key);
  });
}

export function getFilterOptions(table: EnquiriesTable, column: EnquiryFilterColumn): string[] {
  const index = columnIndex(table.headers, column);
  if (index < 0) return [];
  const values = new Set<string>();
  let hasBlank = false;
  for (const row of table.rows) {
    const value = row[index]?.trim() ?? "";
    if (!value) hasBlank = true;
    else values.add(value);
  }
  const sorted = [...values].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  return hasBlank ? [...sorted, "(blank)"] : sorted;
}

export function visibleColumnIndices(headers: readonly string[]): number[] {
  return ENQUIRY_VISIBLE_COLUMNS.map((column) => columnIndex(headers, column)).filter((index) => index >= 0);
}

export function moreFieldsForRow(headers: readonly string[], row: string[]): Array<{ label: string; value: string }> {
  const fields: Array<{ label: string; value: string }> = [];
  for (const column of ENQUIRY_MORE_COLUMNS) {
    const index = columnIndex(headers, column);
    if (index < 0) continue;
    const value = row[index]?.trim() ?? "";
    if (!value) continue;
    fields.push({ label: column, value });
  }
  return fields;
}

export function createDefaultFilterSets(table: EnquiriesTable): Record<EnquiryFilterColumn, Set<string>> {
  const result = {} as Record<EnquiryFilterColumn, Set<string>>;
  for (const column of ENQUIRY_FILTER_COLUMNS) {
    result[column] = new Set(getFilterOptions(table, column));
  }
  return result;
}

export { ENQUIRY_FILTER_COLUMNS, ENQUIRY_VISIBLE_COLUMNS };
