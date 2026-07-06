export interface GvizSheet {
  headers: string[];
  rows: string[][];
}

function formatGvizCell(value: unknown): string {
  if (value == null || value === "") {
    return "";
  }
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : String(value);
  }
  return String(value).trim();
}

/** Normalizes merged total labels and legacy header spellings. */
export function canonicalizeSheetHeader(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) {
    return "";
  }

  const stripped = trimmed.replace(/^[\d,]+(?:\.\d+)?\s+/, "").replace(/\s+/g, " ").trim();
  const upper = stripped.toUpperCase();

  if (upper === "FINAL DEAL" || upper === "FINAL DEAL WITH CLIENT") {
    return "FINAL DEAL with client";
  }
  if (upper.includes("BANK DUE") || upper === "BANK AMOUT DUE") {
    return "Bank due";
  }
  // Order matters: "CASH DUE TO MSS" also contains "CASH DUE".
  if (upper.includes("NET DUE TO MSS") || upper === "DUE TO MSS") {
    return "Total Due to MSS";
  }
  if (upper.includes("CASH DUE TO MSS")) {
    return "Cash due to MSS";
  }
  if (upper.includes("CASH DUE FROM CLIENT") || upper.includes("CASH DUE") || upper === "CASH AMOUNT DUE") {
    return "CASH DUE";
  }
  if (upper.includes("QUATATION")) {
    return "QUATATION";
  }
  if (
    (upper.includes("TOTAL") && upper.includes("PAYMENT") && (upper.includes("RECEIV") || upper.includes("RECIV"))) ||
    upper === "TOTAL"
  ) {
    return "TOTAL Payment recieved";
  }
  if (upper === "DEAL WITH MSS") {
    return "Deal with MSS";
  }
  if (upper === "PAYMENT WITH PARTNER") {
    return "Payment with partner";
  }
  if (upper === "CASH TO MSS" || upper === "CASH TO US") {
    return upper === "CASH TO US" ? "CASH TO US" : "CASH TO MSS";
  }
  if (upper.startsWith("SIGNATURE")) {
    return "UPDATE";
  }

  return stripped;
}

function hasNameHeader(headers: readonly string[]) {
  return headers.some((header) => {
    const upper = header.trim().replace(/\s+/g, " ").toUpperCase();
    return upper === "NAME" || upper === "CLIENT" || upper === "SITE NAME" || upper.startsWith("SITE NAME");
  });
}

function trimSheetColumns(headers: string[], rows: string[][]): GvizSheet {
  let lastIndex = headers.length - 1;

  while (lastIndex >= 0) {
    const hasHeader = headers[lastIndex]?.trim().length > 0;
    const hasData = rows.some((row) => row[lastIndex]?.trim().length > 0);
    if (hasHeader || hasData) {
      break;
    }
    lastIndex -= 1;
  }

  if (lastIndex < 0) {
    throw new Error("Sheet has no column headers");
  }

  return {
    headers: headers.slice(0, lastIndex + 1),
    rows: rows.map((row) => row.slice(0, lastIndex + 1)),
  };
}

export function parseGvizSheet(text: string): GvizSheet {
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  if (!match) {
    throw new Error("Could not parse Google Sheet response");
  }

  const payload = JSON.parse(match[1]) as {
    table?: {
      cols?: Array<{ label?: string }>;
      rows?: Array<{ c?: Array<{ v?: unknown } | null> }>;
    };
  };

  const cols = payload.table?.cols ?? [];
  const headers = cols.map((col) => canonicalizeSheetHeader(col.label?.trim() ?? ""));

  const rows = (payload.table?.rows ?? [])
    .map((row) => {
      const cells = row.c ?? [];
      return cols.map((_, index) => formatGvizCell(cells[index]?.v));
    })
    .filter((cells) => cells.some((cell) => cell.length > 0));

  return trimSheetColumns(headers, rows);
}

export async function fetchGvizSheet(
  sheetName: string,
  buildUrl: (sheetName: string, headerRows?: number) => string,
  preferredHeaderRows = 1,
  options?: {
    /** When gviz cannot find a tab it silently returns the first sheet — pass reference to detect that. */
    referenceTab?: string;
    referenceResponseText?: string;
  },
): Promise<GvizSheet> {
  async function load(headerRows?: number) {
    const response = await fetch(buildUrl(sheetName, headerRows));
    if (!response.ok) {
      throw new Error(`Could not load "${sheetName}" (HTTP ${response.status})`);
    }

    const text = await response.text();
    if (
      options?.referenceTab &&
      options.referenceResponseText &&
      sheetName !== options.referenceTab &&
      text === options.referenceResponseText
    ) {
      throw new Error(
        `Sheet tab "${sheetName}" was not found. Google Sheets returned "${options.referenceTab}" instead.`,
      );
    }

    return parseGvizSheet(text);
  }

  const primarySheet = await load(preferredHeaderRows);
  if (hasNameHeader(primarySheet.headers)) {
    return primarySheet;
  }

  if (preferredHeaderRows !== 2) {
    const fallbackSheet = await load(2);
    if (hasNameHeader(fallbackSheet.headers)) {
      return fallbackSheet;
    }
  }

  if (primarySheet.headers.some((header) => isNameLikeHeader(header))) {
    return primarySheet;
  }

  throw new Error(`Sheet "${sheetName}" has no NAME / Client / SITE NAME column`);
}

function isNameLikeHeader(header: string) {
  const upper = header.trim().replace(/\s+/g, " ").toUpperCase();
  return upper === "CLIENT" || upper === "SITE NAME" || upper.startsWith("SITE NAME");
}
