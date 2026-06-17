import { sheetRowHasName } from "./projects-columns";

const PROJECT_KEY_FIELDS = ["VENDOR", "NAME", "KW", "LOCATION", "K.NO"] as const;

function fieldIndex(headers: readonly string[], field: string) {
  return headers.findIndex((header) => header === field);
}

export function getSheetRowKey(headers: readonly string[], row: readonly string[]): string {
  return PROJECT_KEY_FIELDS.map((field) => {
    const index = fieldIndex(headers, field);
    return index >= 0 ? (row[index]?.trim().toUpperCase() ?? "") : "";
  }).join("|");
}

export function getSheetTabSignature(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return rows
    .filter((row) => sheetRowHasName(headers, row))
    .map((row) => getSheetRowKey(headers, row))
    .sort()
    .join("\n");
}

export function getProjectRowKey(headers: readonly string[], row: readonly string[]): string {
  return getSheetRowKey(headers, row);
}

export function dedupeProjectRows(headers: readonly string[], rows: readonly string[][]): string[][] {
  const projectTypeIndex = headers.indexOf("PROJECT TYPE");
  const merged = new Map<string, string[]>();

  for (const row of rows) {
    const key = getProjectRowKey(headers, row);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, [...row]);
      continue;
    }

    const types = new Set<string>();
    for (const value of `${existing[projectTypeIndex]}|${row[projectTypeIndex]}`.split(/[,|]/)) {
      const trimmed = value.trim();
      if (trimmed) {
        types.add(trimmed);
      }
    }

    existing[projectTypeIndex] = [...types]
      .sort((left, right) => {
        if (left === "MSS") {
          return -1;
        }
        if (right === "MSS") {
          return 1;
        }
        return left.localeCompare(right);
      })
      .join(", ");
  }

  return [...merged.values()];
}
