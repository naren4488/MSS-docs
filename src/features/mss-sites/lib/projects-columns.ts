import {
  getProjectsScopeForProjectType,
  type ProjectsScope,
} from "./projects-config";

/** Canonical Projects table columns (summary tab excluded). */
export const PROJECT_TABLE_HEADERS = [
  "S NO",
  "PROJECT TYPE",
  "VENDOR",
  "NO",
  "UPDATE",
  "NAME",
  "KW",
  "PH",
  "LOCATION",
  "DISCOM",
  "K.NO",
  "MOBILE",
  "GMAIL",
  "GPS / LINK",
  "QUATATION",
  "FINAL DEAL with client",
  "Deal with MSS",
  "Partner commission",
  "LOAN",
  "Cash",
  "File login",
  "SUBSIDY",
  "BANK FILE/CASH",
  "WORK STATUS",
  "DISCOM WORK",
  "PAYMENT STATUS",
  "1ST INSTALLMENT",
  "2ND INATALLMENT",
  "CASH TO MSS",
  "Payment with partner",
  "Bank due",
  "CASH DUE FROM CLIENT",
  "Cash due to MSS",
  "Total Due to MSS",
  "TOTAL Payment recieved",
  "REMARK",
] as const;

/** Partner-only sheet columns — hidden on Our projects; shown on Partner projects. */
export const PARTNER_ONLY_PROJECT_COLUMNS = new Set<string>([
  "Deal with MSS",
  "Partner commission",
  "Payment with partner",
]);

/** Shown in the last-column tooltip instead of the main table. */
export const HIDDEN_PROJECT_COLUMNS = new Set<string>([
  "NO",
  "UPDATE",
  "DISCOM",
  "K.NO",
  "MOBILE",
  "GMAIL",
  "GPS / LINK",
  "File login",
  "SUBSIDY",
  "BANK FILE/CASH",
  "DISCOM WORK",
]);

export const PROJECT_MORE_COLUMN_HEADER = "MORE";

/** Payment columns — extra emphasis in print / PDF export. */
export const PROJECT_PRINT_HIGHLIGHT_COLUMNS = new Set<string>([
  "Bank due",
  "Cash due to MSS",
  "Total Due to MSS",
]);

export function isProjectPrintHighlightColumn(header: string): boolean {
  return PROJECT_PRINT_HIGHLIGHT_COLUMNS.has(header);
}

/** Omitted from PDF when compact export toggle is off (with MORE column). */
export const PROJECT_PDF_OMIT_COLUMNS = new Set<string>([
  "QUATATION",
  "Partner commission",
  "WORK STATUS",
  "PAYMENT STATUS",
  "REMARK",
]);

export function isProjectPdfOmitColumn(header: string): boolean {
  return PROJECT_PDF_OMIT_COLUMNS.has(header);
}

export const PROJECT_TYPE_COLUMN = "PROJECT TYPE";

export const PROJECT_TYPE_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf(PROJECT_TYPE_COLUMN);

export const VENDOR_COLUMN = "VENDOR";

export const VENDOR_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf(VENDOR_COLUMN);

export const PROJECT_S_NO_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf("S NO");

export const CLIENT_NAME_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf("NAME");

export const WORK_STATUS_COLUMN = "WORK STATUS";

export const WORK_STATUS_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf(WORK_STATUS_COLUMN);

export const TOTAL_DUE_TO_MSS_COLUMN = "Total Due to MSS";

export const TOTAL_DUE_TO_MSS_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf(TOTAL_DUE_TO_MSS_COLUMN);

export const TOTAL_PAYMENT_RECEIVED_COLUMN = "TOTAL Payment recieved";

export const TOTAL_PAYMENT_RECEIVED_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf(TOTAL_PAYMENT_RECEIVED_COLUMN);

export const CASH_DUE_TO_MSS_COLUMN = "Cash due to MSS";

export const CASH_DUE_TO_MSS_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf(CASH_DUE_TO_MSS_COLUMN);

export const BANK_DUE_COLUMN = "Bank due";

export const BANK_DUE_COLUMN_INDEX = PROJECT_TABLE_HEADERS.indexOf(BANK_DUE_COLUMN);

/** Optional non-zero dues filters (empty selection = no dues filter). */
export const DUES_NET_NONZERO_LABEL = "Net due ≠ 0";
export const DUES_CASH_NONZERO_LABEL = "Cash due ≠ 0";
export const DUES_BANK_NONZERO_LABEL = "Bank due ≠ 0";

export const NONZERO_DUES_FILTER_OPTIONS = [
  DUES_NET_NONZERO_LABEL,
  DUES_CASH_NONZERO_LABEL,
  DUES_BANK_NONZERO_LABEL,
] as const;

export type NonzeroDuesFilterOption = (typeof NONZERO_DUES_FILTER_OPTIONS)[number];

export const EMPTY_WORK_STATUS_LABEL = "Not set";

/** Sheet value kept unselected in the Work status filter by default. */
const PROJECT_ON_HOLD_WORK_STATUS = "project on hold";

export function normalizeWorkStatus(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : EMPTY_WORK_STATUS_LABEL;
}

export function isProjectOnHoldWorkStatus(value: string): boolean {
  return normalizeWorkStatus(value).toLowerCase() === PROJECT_ON_HOLD_WORK_STATUS;
}

/** Default Work status selection: every status except project on HOLD. */
export function getDefaultSelectedWorkStatuses(workStatuses: readonly string[]): Set<string> {
  return new Set(workStatuses.filter((status) => !isProjectOnHoldWorkStatus(status)));
}

export function workStatusSelectionMatchesDefault(
  selectedWorkStatuses: ReadonlySet<string>,
  workStatuses: readonly string[],
): boolean {
  const defaults = getDefaultSelectedWorkStatuses(workStatuses);
  if (selectedWorkStatuses.size !== defaults.size) {
    return false;
  }
  for (const status of defaults) {
    if (!selectedWorkStatuses.has(status)) {
      return false;
    }
  }
  return true;
}

export function getWorkStatusesFromRows(rows: readonly (readonly string[])[]): string[] {
  return [...new Set(rows.map((row) => normalizeWorkStatus(row[WORK_STATUS_COLUMN_INDEX] ?? "")))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterRowsByWorkStatuses(
  rows: readonly (readonly string[])[],
  selectedWorkStatuses: ReadonlySet<string>,
): string[][] {
  if (selectedWorkStatuses.size === 0) {
    return [];
  }

  return rows
    .filter((row) => selectedWorkStatuses.has(normalizeWorkStatus(row[WORK_STATUS_COLUMN_INDEX] ?? "")))
    .map((row) => [...row]);
}

/** Columns that show a computed total in the summary row (S NO = row count). */
export const PROJECT_TOTAL_COLUMNS = new Set<string>([
  "S NO",
  "QUATATION",
  "FINAL DEAL with client",
  "Deal with MSS",
  "Partner commission",
  "LOAN",
  "Cash",
  "1ST INSTALLMENT",
  "2ND INATALLMENT",
  "CASH TO MSS",
  "Payment with partner",
  "Bank due",
  "CASH DUE FROM CLIENT",
  "Cash due to MSS",
  "Total Due to MSS",
  "TOTAL Payment recieved",
]);

export function parseProjectAmount(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, "").trim();
  if (!cleaned) {
    return 0;
  }

  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

export function formatProjectAmount(total: number): string {
  return total.toLocaleString("en-IN");
}

export function computePartnerCommissionValue(finalDeal: string, dealWithMss: string): string {
  if (!finalDeal.trim() && !dealWithMss.trim()) {
    return "";
  }

  const commission = parseProjectAmount(finalDeal) - parseProjectAmount(dealWithMss);
  return formatProjectAmount(commission);
}

function computeCashDueToMss(totalDueToMss: string, bankDue: string): string {
  if (!totalDueToMss.trim() && !bankDue.trim()) {
    return "";
  }

  const result = parseProjectAmount(totalDueToMss) - parseProjectAmount(bankDue);
  return formatProjectAmount(result);
}

export function computeVisibleColumnTotals(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  visibleColumnIndices: readonly number[],
): Map<number, string> {
  const totals = new Map<number, string>();

  for (const columnIndex of visibleColumnIndices) {
    const header = headers[columnIndex];
    if (!PROJECT_TOTAL_COLUMNS.has(header)) {
      continue;
    }

    if (header === "S NO") {
      totals.set(columnIndex, String(rows.length));
      continue;
    }

    const sum = rows.reduce((acc, row) => acc + parseProjectAmount(row[columnIndex] ?? ""), 0);
    totals.set(columnIndex, formatProjectAmount(sum));
  }

  return totals;
}

export function getProjectTypesFromRows(rows: readonly (readonly string[])[]): string[] {
  return [...new Set(rows.map((row) => row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? "").filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterRowsByProjectTypes(
  rows: readonly (readonly string[])[],
  selectedProjectTypes: ReadonlySet<string>,
): string[][] {
  if (selectedProjectTypes.size === 0) {
    return [];
  }

  return rows
    .filter((row) => selectedProjectTypes.has(row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? ""))
    .map((row) => [...row]);
}

export function getVendorsFromRows(rows: readonly (readonly string[])[]): string[] {
  return [...new Set(rows.map((row) => row[VENDOR_COLUMN_INDEX]?.trim() ?? "").filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterRowsByVendors(
  rows: readonly (readonly string[])[],
  selectedVendors: ReadonlySet<string>,
): string[][] {
  if (selectedVendors.size === 0) {
    return [];
  }

  return rows
    .filter((row) => selectedVendors.has(row[VENDOR_COLUMN_INDEX]?.trim() ?? ""))
    .map((row) => [...row]);
}

export function filterRowsByClientName(
  rows: readonly (readonly string[])[],
  query: string,
): string[][] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return rows.map((row) => [...row]);
  }

  return rows
    .filter((row) =>
      (row[CLIENT_NAME_COLUMN_INDEX]?.trim() ?? "").toLowerCase().includes(normalizedQuery),
    )
    .map((row) => [...row]);
}

export function filterRowsByNonzeroDues(
  rows: readonly (readonly string[])[],
  selected: ReadonlySet<string>,
): string[][] {
  if (selected.size === 0) {
    return rows.map((row) => [...row]);
  }

  return rows
    .filter((row) => {
      if (selected.has(DUES_NET_NONZERO_LABEL) && parseProjectAmount(row[TOTAL_DUE_TO_MSS_COLUMN_INDEX] ?? "") !== 0) {
        return true;
      }
      if (selected.has(DUES_CASH_NONZERO_LABEL) && parseProjectAmount(row[CASH_DUE_TO_MSS_COLUMN_INDEX] ?? "") !== 0) {
        return true;
      }
      if (selected.has(DUES_BANK_NONZERO_LABEL) && parseProjectAmount(row[BANK_DUE_COLUMN_INDEX] ?? "") !== 0) {
        return true;
      }
      return false;
    })
    .map((row) => [...row]);
}

export function withSequentialSerialNumbers(rows: readonly (readonly string[])[]): string[][] {
  return rows.map((row, index) => {
    const nextRow = [...row];
    nextRow[PROJECT_S_NO_COLUMN_INDEX] = String(index + 1);
    return nextRow;
  });
}

export function filterRowsByProjectsScope(
  rows: readonly (readonly string[])[],
  scope: ProjectsScope,
): string[][] {
  return rows
    .filter((row) => getProjectsScopeForProjectType(row[PROJECT_TYPE_COLUMN_INDEX] ?? "") === scope)
    .map((row) => [...row]);
}

export function getVisibleColumnIndices(
  headers: readonly string[],
  scope: ProjectsScope = "partner",
): number[] {
  return headers.flatMap((header, index) => {
    if (HIDDEN_PROJECT_COLUMNS.has(header)) {
      return [];
    }
    if (scope === "our" && PARTNER_ONLY_PROJECT_COLUMNS.has(header)) {
      return [];
    }
    return [index];
  });
}

export function getHiddenProjectFields(
  headers: readonly string[],
  row: readonly string[],
): Array<{ label: string; value: string }> {
  return headers.flatMap((header, index) => {
    if (!HIDDEN_PROJECT_COLUMNS.has(header)) {
      return [];
    }
    return [{ label: header, value: row[index]?.trim() ?? "" }];
  });
}

function normalizeHeaderKey(header: string) {
  return header.trim().replace(/\s+/g, " ").toUpperCase();
}

function sheetCell(
  headers: readonly string[],
  row: readonly string[],
  labels: string | readonly string[],
  occurrence = 0,
): string {
  const options = typeof labels === "string" ? [labels] : labels;

  for (const label of options) {
    let seen = 0;
    const target = normalizeHeaderKey(label);

    for (let index = 0; index < headers.length; index += 1) {
      const headerKey = normalizeHeaderKey(headers[index]);
      const isMatch =
        // Some sheets use "LOCATION" for both main location and GPS/link column
        // (e.g. "LOCATION (GPS)"). Match both via prefix when caller asks for LOCATION.
        target === "LOCATION" ? headerKey.startsWith(target) : headerKey === target;

      if (!isMatch) {
        continue;
      }
      if (seen === occurrence) {
        return row[index]?.trim() ?? "";
      }
      seen += 1;
    }
  }

  return "";
}

export function sheetRowHasName(headers: readonly string[], row: readonly string[]): boolean {
  return sheetCell(headers, row, ["NAME", "Client", "CLIENT", "SITE NAME"]).length > 0;
}

function sheetCellGpsLink(headers: readonly string[], row: readonly string[]): string {
  return sheetCell(headers, row, "GPS / LINK") || sheetCell(headers, row, "LOCATION", 1);
}

export function mapSheetRowToProjectRow(
  headers: string[],
  row: string[],
  projectType: string,
  vendor: string,
): string[] {
  const bankDue = sheetCell(headers, row, ["Bank due", "BANK DUE PAYMENT", "BANK DUE"]);
  const totalDueToMss = sheetCell(headers, row, ["Total Due to MSS", "NET DUE TO MSS", "DUE TO MSS"]);
  const cashDueToMss =
    sheetCell(headers, row, ["Cash due to MSS", "CASH DUE TO MSS"]) ||
    computeCashDueToMss(totalDueToMss, bankDue);

  return [
    projectType,
    vendor,
    sheetCell(headers, row, "NO"),
    sheetCell(headers, row, "UPDATE"),
    sheetCell(headers, row, ["NAME", "Client", "CLIENT", "SITE NAME"]),
    sheetCell(headers, row, "KW"),
    sheetCell(headers, row, "PH"),
    sheetCell(headers, row, ["LOCATION", "Location"], 0),
    sheetCell(headers, row, "DISCOM"),
    sheetCell(headers, row, ["K.NO", "K. NO"]),
    sheetCell(headers, row, "MOBILE"),
    sheetCell(headers, row, "GMAIL"),
    sheetCellGpsLink(headers, row),
    sheetCell(headers, row, ["QUATATION", "QUATATION IN BANK"]),
    sheetCell(headers, row, ["FINAL DEAL with client", "FINAL DEAL", "AMOUNT"]),
    sheetCell(headers, row, "Deal with MSS"),
    computePartnerCommissionValue(
      sheetCell(headers, row, ["FINAL DEAL with client", "FINAL DEAL", "AMOUNT"]),
      sheetCell(headers, row, "Deal with MSS"),
    ),
    sheetCell(headers, row, "LOAN"),
    sheetCell(headers, row, ["Cash", "CASH"]),
    sheetCell(headers, row, ["File login", "File Login"]),
    sheetCell(headers, row, "SUBSIDY"),
    sheetCell(headers, row, ["BANK FILE/CASH", "Bank file / Cash"]),
    sheetCell(headers, row, ["WORK STATUS", "Work status"]),
    sheetCell(headers, row, ["DISCOM WORK", "Discom"]),
    sheetCell(headers, row, ["PAYMENT STATUS", "Payment status"]),
    sheetCell(headers, row, "1ST INSTALLMENT"),
    sheetCell(headers, row, ["2ND INATALLMENT", "2ND INSTALLMENT"]),
    sheetCell(headers, row, ["CASH TO MSS", "CASH TO US"]),
    sheetCell(headers, row, "Payment with partner"),
    bankDue,
    sheetCell(headers, row, ["CASH DUE FROM CLIENT", "CASH DUE", "Cash due"]),
    cashDueToMss,
    totalDueToMss,
    sheetCell(headers, row, [
      "TOTAL Payment recieved",
      "TOTAL PAYMENT RECIVED",
      "TOTAL PAYMENT RECEIVED",
    ]),
    sheetCell(headers, row, "REMARK"),
  ];
}
