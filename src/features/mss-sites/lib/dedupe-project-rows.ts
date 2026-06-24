import { sheetRowHasName } from "./projects-columns";

/** Raw sheet rows — compare site identity when detecting copied tabs. */
const SHEET_CONTENT_KEY_FIELDS = ["NAME", "KW", "LOCATION", "K.NO"] as const;

/** Merged table rows — same project may exist on multiple tabs (different PROJECT TYPE). */
const PROJECT_ROW_KEY_FIELDS = ["PROJECT TYPE", "VENDOR", "NAME", "KW", "LOCATION", "K.NO"] as const;

function fieldIndex(headers: readonly string[], field: string) {
  return headers.findIndex((header) => header === field);
}

function rowKey(headers: readonly string[], row: readonly string[], fields: readonly string[]) {
  return fields
    .map((field) => {
      const index = fieldIndex(headers, field);
      return index >= 0 ? (row[index]?.trim().toUpperCase() ?? "") : "";
    })
    .join("|");
}

export function getSheetRowKey(headers: readonly string[], row: readonly string[]): string {
  return rowKey(headers, row, SHEET_CONTENT_KEY_FIELDS);
}

export function getSheetTabSignature(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return rows
    .filter((row) => sheetRowHasName(headers, row))
    .map((row) => getSheetRowKey(headers, row))
    .sort()
    .join("\n");
}

export function getProjectRowKey(headers: readonly string[], row: readonly string[]): string {
  return rowKey(headers, row, PROJECT_ROW_KEY_FIELDS);
}

export function dedupeProjectRows(headers: readonly string[], rows: readonly string[][]): string[][] {
  const merged = new Map<string, string[]>();

  for (const row of rows) {
    const key = getProjectRowKey(headers, row);
    if (!merged.has(key)) {
      merged.set(key, [...row]);
    }
  }

  return [...merged.values()];
}
