import {
  formatProjectAmount,
  parseProjectAmount,
  PROJECT_TYPE_COLUMN_INDEX,
  VENDOR_COLUMN_INDEX,
} from "./projects-columns";
import { PROJECT_VENDORS } from "./projects-config";
import {
  getRecordedLedgerTransactionsForProjectTypes,
  type PartnerLedgerDirection,
} from "./partner-mss-payments";

export type LedgerSign = "credit" | "debit";

export interface VendorBreakdown {
  mss: number;
  arkshakti: number;
  total: number;
}

export interface ProjectAnalyticsSummary {
  totalSites: number;
  sitesByVendor: VendorBreakdown;
  bankDueByVendor: VendorBreakdown;
  cashDueFromClientByVendor: VendorBreakdown;
  cashDueToMssByVendor: VendorBreakdown;
  totalDueToMssByVendor: VendorBreakdown;
  finalDealWithClientByVendor: VendorBreakdown;
  dealWithMssByVendor: VendorBreakdown;
  /** Final deal with client minus deal with MSS — partner margin on filtered sites. */
  partnerProfitByVendor: VendorBreakdown;
  totalBankDue: number;
  totalCashDueFromClient: number;
  totalCashDueToMss: number;
  totalDueToMss: number;
  totalFinalDealWithClient: number;
  totalDealWithMss: number;
  totalPartnerProfit: number;
  /** Signed site dues: + MSS will receive from clients once they pay. */
  totalSitesDueSigned: number;
  totalCredits: number;
  totalDebits: number;
  /** Net MSS receivable: + MSS will receive, − MSS will pay. */
  netMssReceivable: number;
}

export interface ProjectTypeLedgerSummary {
  projectType: string;
  count: number;
  /** Pending from clients — positive = MSS will receive. */
  dueFromClients: number;
  /** Net partner advances recoverable — positive = MSS will receive from partner. */
  partnerAdvancesRecoverable: number;
  netMssReceivable: number;
}

export interface UnifiedLedgerLine {
  id: string;
  projectType: string;
  source: "site" | "external";
  description: string;
  signedAmount: number;
  sign: LedgerSign;
  runningBalance: number;
  method?: string;
  date?: string;
  note?: string;
}

function columnIndex(headers: readonly string[], name: string) {
  return headers.indexOf(name);
}

function sumColumn(headers: readonly string[], rows: readonly (readonly string[])[], columnName: string) {
  const index = columnIndex(headers, columnName);
  if (index < 0) {
    return 0;
  }

  return rows.reduce((total, row) => total + parseProjectAmount(row[index] ?? ""), 0);
}

function emptyVendorBreakdown(): VendorBreakdown {
  return { mss: 0, arkshakti: 0, total: 0 };
}

function vendorKey(vendor: string): keyof Omit<VendorBreakdown, "total"> | null {
  if (vendor === PROJECT_VENDORS.MSS) {
    return "mss";
  }
  if (vendor === PROJECT_VENDORS.ARKSHAKTI) {
    return "arkshakti";
  }
  return null;
}

function countRowsByVendor(rows: readonly (readonly string[])[]): VendorBreakdown {
  const breakdown = emptyVendorBreakdown();
  breakdown.total = rows.length;

  for (const row of rows) {
    const key = vendorKey(row[VENDOR_COLUMN_INDEX]?.trim() ?? "");
    if (key) {
      breakdown[key] += 1;
    }
  }

  return breakdown;
}

function sumColumnByVendor(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  columnName: string,
): VendorBreakdown {
  const index = columnIndex(headers, columnName);
  const breakdown = emptyVendorBreakdown();

  if (index < 0) {
    return breakdown;
  }

  for (const row of rows) {
    const amount = parseProjectAmount(row[index] ?? "");
    breakdown.total += amount;
    const key = vendorKey(row[VENDOR_COLUMN_INDEX]?.trim() ?? "");
    if (key) {
      breakdown[key] += amount;
    }
  }

  return breakdown;
}

function subtractVendorBreakdown(minuend: VendorBreakdown, subtrahend: VendorBreakdown): VendorBreakdown {
  return {
    mss: minuend.mss - subtrahend.mss,
    arkshakti: minuend.arkshakti - subtrahend.arkshakti,
    total: minuend.total - subtrahend.total,
  };
}

export function getLedgerSign(signedAmount: number): LedgerSign {
  return signedAmount >= 0 ? "credit" : "debit";
}

/** MSS advance to partner (+). Repayment or site expense (−). */
export function signedExternalAmount(direction: PartnerLedgerDirection, amount: number): number {
  return direction === "mss_to_partner" ? amount : -amount;
}

export function externalLedgerDescription(
  direction: PartnerLedgerDirection,
  method?: string,
  note?: string,
): string {
  if (direction === "site_expense") {
    return note ?? "Sites expense";
  }
  if (direction === "partner_to_mss") {
    return method ? `Partner repaid MSS (${method})` : "Partner repaid MSS";
  }
  return note ? `MSS advance to partner — ${note}` : "MSS advance to partner";
}

function sumSignedColumnByProjectType(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  columnName: string,
) {
  const index = columnIndex(headers, columnName);
  const totals = new Map<string, number>();

  if (index < 0) {
    return totals;
  }

  for (const row of rows) {
    const projectType = row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? "";
    if (!projectType) {
      continue;
    }
    totals.set(projectType, (totals.get(projectType) ?? 0) + parseProjectAmount(row[index] ?? ""));
  }

  return totals;
}

function buildUnifiedLedger(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  projectTypes: readonly string[],
): UnifiedLedgerLine[] {
  const lines: UnifiedLedgerLine[] = [];
  const totalDueIndex = columnIndex(headers, "Total Due to MSS");
  const visibleTypes = new Set(projectTypes);

  if (totalDueIndex >= 0) {
    let siteCount = 0;
    let signedAmount = 0;

    for (const row of rows) {
      const projectType = row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? "";
      if (!projectType || !visibleTypes.has(projectType)) {
        continue;
      }
      siteCount += 1;
      signedAmount += parseProjectAmount(row[totalDueIndex] ?? "");
    }

    if (siteCount > 0 && signedAmount !== 0) {
      const projectTypeLabel =
        projectTypes.length === 1 ? projectTypes[0] : `${projectTypes.length} partners`;

      lines.push({
        id: "sites-summary",
        projectType: projectTypeLabel,
        source: "site",
        description: `Due from clients (${siteCount} site${siteCount === 1 ? "" : "s"})`,
        signedAmount,
        sign: getLedgerSign(signedAmount),
        runningBalance: 0,
      });
    }
  }

  for (const [index, entry] of getRecordedLedgerTransactionsForProjectTypes(projectTypes).entries()) {
    const signedAmount = signedExternalAmount(entry.direction, entry.amount);
    lines.push({
      id: `external-${entry.projectType}-${index}`,
      projectType: entry.projectType,
      source: "external",
      description: externalLedgerDescription(entry.direction, entry.method, entry.note),
      signedAmount,
      sign: getLedgerSign(signedAmount),
      runningBalance: 0,
      method: entry.method,
      date: entry.date,
      note: entry.note,
    });
  }

  lines.sort((left, right) => {
    if (left.source !== right.source) {
      return left.source === "site" ? -1 : 1;
    }
    const typeOrder = left.projectType.localeCompare(right.projectType);
    if (typeOrder !== 0) {
      return typeOrder;
    }
    const leftDate = left.date ?? "";
    const rightDate = right.date ?? "";
    if (leftDate !== rightDate) {
      return leftDate.localeCompare(rightDate);
    }
    return left.description.localeCompare(right.description);
  });

  let runningBalance = 0;
  return lines.map((line) => {
    runningBalance += line.signedAmount;
    return { ...line, runningBalance };
  });
}

function sumExternalSignedByProjectType(projectTypes: readonly string[]): Map<string, number> {
  const totals = new Map<string, number>();

  for (const entry of getRecordedLedgerTransactionsForProjectTypes(projectTypes)) {
    const signedAmount = signedExternalAmount(entry.direction, entry.amount);
    totals.set(entry.projectType, (totals.get(entry.projectType) ?? 0) + signedAmount);
  }

  return totals;
}

export function computeProjectAnalytics(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): {
  summary: ProjectAnalyticsSummary;
  byProjectType: ProjectTypeLedgerSummary[];
  ledgerLines: UnifiedLedgerLine[];
} {
  const counts = new Map<string, number>();
  const sitesDueByType = sumSignedColumnByProjectType(headers, rows, "Total Due to MSS");

  for (const row of rows) {
    const projectType = row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? "";
    if (!projectType) {
      continue;
    }
    counts.set(projectType, (counts.get(projectType) ?? 0) + 1);
  }

  const projectTypes = [...counts.keys()].sort((left, right) => left.localeCompare(right));
  const externalSignedByType = sumExternalSignedByProjectType(projectTypes);

  const byProjectType = projectTypes.map((projectType) => {
    const dueFromClients = sitesDueByType.get(projectType) ?? 0;
    const partnerAdvancesRecoverable = externalSignedByType.get(projectType) ?? 0;
    return {
      projectType,
      count: counts.get(projectType) ?? 0,
      dueFromClients,
      partnerAdvancesRecoverable,
      netMssReceivable: dueFromClients + partnerAdvancesRecoverable,
    };
  });

  const ledgerLines = buildUnifiedLedger(headers, rows, projectTypes);
  const netMssReceivable = ledgerLines.reduce((total, line) => total + line.signedAmount, 0);
  const totalCredits = ledgerLines
    .filter((line) => line.sign === "credit")
    .reduce((total, line) => total + line.signedAmount, 0);
  const totalDebits = ledgerLines
    .filter((line) => line.sign === "debit")
    .reduce((total, line) => total + line.signedAmount, 0);
  const totalSitesDueSigned = sumColumn(headers, rows, "Total Due to MSS");
  const sitesByVendor = countRowsByVendor(rows);
  const bankDueByVendor = sumColumnByVendor(headers, rows, "Bank due");
  const cashDueFromClientByVendor = sumColumnByVendor(headers, rows, "CASH DUE FROM CLIENT");
  const cashDueToMssByVendor = sumColumnByVendor(headers, rows, "Cash due to MSS");
  const totalDueToMssByVendor = sumColumnByVendor(headers, rows, "Total Due to MSS");
  const finalDealWithClientByVendor = sumColumnByVendor(headers, rows, "FINAL DEAL with client");
  const dealWithMssByVendor = sumColumnByVendor(headers, rows, "Deal with MSS");
  const partnerProfitByVendor = subtractVendorBreakdown(finalDealWithClientByVendor, dealWithMssByVendor);

  return {
    summary: {
      totalSites: rows.length,
      sitesByVendor,
      bankDueByVendor,
      cashDueFromClientByVendor,
      cashDueToMssByVendor,
      totalDueToMssByVendor,
      finalDealWithClientByVendor,
      dealWithMssByVendor,
      partnerProfitByVendor,
      totalBankDue: bankDueByVendor.total,
      totalCashDueFromClient: cashDueFromClientByVendor.total,
      totalCashDueToMss: cashDueToMssByVendor.total,
      totalDueToMss: totalDueToMssByVendor.total,
      totalFinalDealWithClient: finalDealWithClientByVendor.total,
      totalDealWithMss: dealWithMssByVendor.total,
      totalPartnerProfit: partnerProfitByVendor.total,
      totalSitesDueSigned,
      totalCredits,
      totalDebits,
      netMssReceivable,
    },
    byProjectType,
    ledgerLines,
  };
}

export function formatAnalyticsAmount(amount: number) {
  const prefix = amount < 0 ? "− ₹ " : "₹ ";
  return `${prefix}${formatProjectAmount(Math.abs(amount))}`;
}

export function formatSignedLedgerAmount(amount: number) {
  return formatAnalyticsAmount(amount);
}

export function ledgerAmountClassName(sign: LedgerSign) {
  return sign === "credit" ? "mss-ledger-amount--credit" : "mss-ledger-amount--debit";
}

export function ledgerSignLabel(sign: LedgerSign) {
  return sign === "credit" ? "Credit" : "Debit";
}

export function netBalanceLabel(netBalance: number) {
  if (netBalance > 0) {
    return "MSS will receive";
  }
  if (netBalance < 0) {
    return "MSS will pay";
  }
  return "Settled";
}
