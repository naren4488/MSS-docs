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
  "CASH DUE",
  "Total Due to MSS",
  "Cash due to MSS",
  "TOTAL Payment recieved",
  "REMARK",
] as const;

/** Partner-only sheet columns — shown for all rows; empty when absent on MSS tab. */
export const PARTNER_ONLY_PROJECT_COLUMNS = new Set<string>(["Deal with MSS", "Payment with partner"]);

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
  "Total Due to MSS",
  "Cash due to MSS",
]);

export function isProjectPrintHighlightColumn(header: string): boolean {
  return PROJECT_PRINT_HIGHLIGHT_COLUMNS.has(header);
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

export const PAYMENT_RECEIVED_LABEL = "Received";

export const PAYMENT_NOT_RECEIVED_LABEL = "Not received";

export const PAYMENT_RECEIVED_FILTER_OPTIONS = [PAYMENT_RECEIVED_LABEL, PAYMENT_NOT_RECEIVED_LABEL] as const;

export type DueToMssFilter = "all" | "has-due" | "no-due";

export const DUE_TO_MSS_FILTER_OPTIONS: ReadonlyArray<{ value: DueToMssFilter; label: string }> = [
  { value: "all", label: "All projects" },
  { value: "has-due", label: "Has due to MSS" },
  { value: "no-due", label: "No due to MSS" },
];

export const EMPTY_WORK_STATUS_LABEL = "Not set";

export function normalizeWorkStatus(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : EMPTY_WORK_STATUS_LABEL;
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
  "LOAN",
  "Cash",
  "1ST INSTALLMENT",
  "2ND INATALLMENT",
  "CASH TO MSS",
  "Payment with partner",
  "Bank due",
  "CASH DUE",
  "Total Due to MSS",
  "Cash due to MSS",
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

export function hasDueToMss(row: readonly string[]): boolean {
  return parseProjectAmount(row[TOTAL_DUE_TO_MSS_COLUMN_INDEX] ?? "") !== 0;
}

export function isPaymentReceived(row: readonly string[]): boolean {
  return parseProjectAmount(row[TOTAL_PAYMENT_RECEIVED_COLUMN_INDEX] ?? "") > 0;
}

export function filterRowsByDueToMss(
  rows: readonly (readonly string[])[],
  filter: DueToMssFilter,
): string[][] {
  if (filter === "all") {
    return rows.map((row) => [...row]);
  }

  return rows
    .filter((row) => (filter === "has-due" ? hasDueToMss(row) : !hasDueToMss(row)))
    .map((row) => [...row]);
}

export function filterRowsByPaymentReceived(
  rows: readonly (readonly string[])[],
  selected: ReadonlySet<string>,
): string[][] {
  if (selected.size === 0) {
    return [];
  }

  return rows
    .filter((row) => {
      const label = isPaymentReceived(row) ? PAYMENT_RECEIVED_LABEL : PAYMENT_NOT_RECEIVED_LABEL;
      return selected.has(label);
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

export function getVisibleColumnIndices(headers: readonly string[]): number[] {
  return headers.flatMap((header, index) => (HIDDEN_PROJECT_COLUMNS.has(header) ? [] : [index]));
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
    sheetCell(headers, row, ["CASH DUE", "CASH DUE FROM CLIENT", "Cash due"]),
    totalDueToMss,
    cashDueToMss,
    sheetCell(headers, row, ["TOTAL Payment recieved", "TOTAL"]),
    sheetCell(headers, row, "REMARK"),
  ];
}
