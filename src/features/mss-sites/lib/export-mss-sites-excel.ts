import * as XLSX from "xlsx";
import {
  HIDDEN_PROJECT_COLUMNS,
  getHiddenProjectFields,
  isProjectPdfOmitColumn,
} from "./projects-columns";

export interface MssSitesExcelExportInput {
  /** Workbook / download base name (without extension). */
  fileName: string;
  /** Excel sheet tab name (max 31 chars). */
  sheetName: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  visibleColumnIndices: readonly number[];
  /** When false, omit the same “extra” columns as compact PDF export. */
  includeExtraColumns: boolean;
}

function sanitizeSheetName(name: string): string {
  const cleaned = name.replace(/[\\/*?:\[\]]/g, " ").replace(/\s+/g, " ").trim() || "Projects";
  return cleaned.slice(0, 31);
}

function cellValue(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";
  return trimmed || "";
}

/**
 * Builds an .xlsx from the filtered projects table.
 * Same “Extra columns in export” rules as PDF:
 * - off → drop omit-pdf columns and the entire MORE set
 * - on  → keep omit-pdf columns and append MORE fields as columns
 */
export function downloadMssSitesExcel(input: MssSitesExcelExportInput): void {
  const columnIndices = input.visibleColumnIndices.filter((index) => {
    const header = input.headers[index] ?? "";
    if (!input.includeExtraColumns && isProjectPdfOmitColumn(header)) {
      return false;
    }
    return true;
  });

  // PDF hides the MORE column entirely when the toggle is off.
  const moreLabels: string[] = [];
  if (input.includeExtraColumns) {
    for (const header of input.headers) {
      if (!HIDDEN_PROJECT_COLUMNS.has(header)) continue;
      if (!moreLabels.includes(header)) {
        moreLabels.push(header);
      }
    }
  }

  const exportHeaders = [
    ...columnIndices.map((index) => input.headers[index] ?? ""),
    ...moreLabels,
  ];

  const exportRows = input.rows.map((row) => {
    const visibleCells = columnIndices.map((index) => cellValue(row[index]));
    if (moreLabels.length === 0) {
      return visibleCells;
    }
    const hidden = getHiddenProjectFields(input.headers, row);
    const byLabel = new Map(hidden.map((field) => [field.label, field.value]));
    return [...visibleCells, ...moreLabels.map((label) => cellValue(byLabel.get(label)))];
  });

  const worksheet = XLSX.utils.aoa_to_sheet([exportHeaders, ...exportRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sanitizeSheetName(input.sheetName));

  const base = input.fileName.replace(/\.xlsx$/i, "").trim() || "MSS Projects";
  XLSX.writeFile(workbook, `${base}.xlsx`);
}
