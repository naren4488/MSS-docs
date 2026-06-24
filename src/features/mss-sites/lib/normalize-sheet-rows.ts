import type { ProjectSheetTab } from "./projects-config";
import type { GvizSheet } from "./parse-gviz-sheet";

const NAME_HEADER_KEYS = new Set(["NAME", "CLIENT", "SITE NAME"]);

function normalizeHeaderKey(header: string) {
  return header.trim().replace(/\s+/g, " ").toUpperCase();
}

function isNameHeader(header: string) {
  const key = normalizeHeaderKey(header);
  return NAME_HEADER_KEYS.has(key) || key.startsWith("SITE NAME");
}

/** Expand ARKSHKATI COMM rows where each sheet row holds two sites side-by-side. */
function expandDualSiteRows(sheet: GvizSheet): GvizSheet {
  const siteNameIndices = sheet.headers
    .map((header, index) => ({ header, index }))
    .filter(({ header }) => isNameHeader(header))
    .map(({ index }) => index);

  if (siteNameIndices.length === 0) {
    return sheet;
  }

  const headers = ["SITE NAME", "KW", "AMOUNT"];
  const rows: string[][] = [];

  for (const row of sheet.rows) {
    for (const nameIndex of siteNameIndices) {
      const name = row[nameIndex]?.trim() ?? "";
      if (!name) {
        continue;
      }

      const kw = row[nameIndex + 1]?.trim() ?? "";
      const amount = row[nameIndex + 2]?.trim() ?? "";
      rows.push([name, kw, amount]);
    }
  }

  return { headers, rows };
}

export function normalizeSheetForTab(sheet: GvizSheet, tab: ProjectSheetTab): GvizSheet {
  if (tab.splitDualSiteRows) {
    return expandDualSiteRows(sheet);
  }

  return sheet;
}
