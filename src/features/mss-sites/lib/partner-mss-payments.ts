/**
 * External partner ledger — not in Google Sheets; maintained here for analytics.
 * `projectType` must match the PROJECT TYPE column (sheet tab name) exactly.
 */
export type PartnerLedgerDirection = "partner_to_mss" | "mss_to_partner";

export interface PartnerLedgerTransaction {
  projectType: string;
  direction: PartnerLedgerDirection;
  amount: number;
  method?: string;
  date?: string;
  note?: string;
}

export const PARTNER_LEDGER_TRANSACTIONS: readonly PartnerLedgerTransaction[] = [
  {
    projectType: "KAVITA MAM",
    direction: "mss_to_partner",
    amount: 48_000,
    note: "MSS payment to Kavita mam",
  },
  {
    projectType: "SATAYNARAYAN JI",
    direction: "mss_to_partner",
    amount: 141_020,
    note: "MSS payment to Satyanarayan",
  },
  {
    projectType: "Ajay (everest)",
    direction: "partner_to_mss",
    amount: 105_000,
    method: "PhonePe",
    date: "27-04-2026",
  },
  {
    projectType: "Ajay (everest)",
    direction: "partner_to_mss",
    amount: 300_000,
    method: "Cash",
    date: "19-05-2026",
  },
  {
    projectType: "Ajay (everest)",
    direction: "partner_to_mss",
    amount: 170_000,
    method: "PhonePe",
    date: "19-05-2026",
  },
  {
    projectType: "Ajay (everest)",
    direction: "partner_to_mss",
    amount: 113_500,
    method: "PhonePe",
    date: "21-05-2026",
  },
  {
    projectType: "Ajay (everest)",
    direction: "partner_to_mss",
    amount: 50_000,
    method: "PhonePe",
    date: "22-05-2026",
  },
  {
    projectType: "Ajay (everest)",
    direction: "partner_to_mss",
    amount: 50_000,
    method: "Cash",
    date: "28-05-2026",
  },
  {
    projectType: "Ajay (everest)",
    direction: "mss_to_partner",
    amount: 50_000,
    date: "14-03-2026",
  },
  {
    projectType: "Ajay (everest)",
    direction: "mss_to_partner",
    amount: 10_000,
    date: "12-11-2025",
  },
];

function sumByDirection(projectTypes: readonly string[], direction: PartnerLedgerDirection): number {
  const visible = new Set(projectTypes.map((projectType) => projectType.trim()).filter(Boolean));
  return PARTNER_LEDGER_TRANSACTIONS.filter(
    (entry) => visible.has(entry.projectType) && entry.direction === direction,
  ).reduce((total, entry) => total + entry.amount, 0);
}

function sumByDirectionForProjectType(projectType: string, direction: PartnerLedgerDirection): number {
  const normalized = projectType.trim();
  return PARTNER_LEDGER_TRANSACTIONS.filter(
    (entry) => entry.projectType === normalized && entry.direction === direction,
  ).reduce((total, entry) => total + entry.amount, 0);
}

/** Signed total for external ledger: partner→MSS is debit (−), MSS→partner is credit (+). */
export function getExternalSignedForProjectType(projectType: string): number {
  const normalized = projectType.trim();
  return PARTNER_LEDGER_TRANSACTIONS.filter((entry) => entry.projectType === normalized).reduce(
    (total, entry) => total + (entry.direction === "partner_to_mss" ? -entry.amount : entry.amount),
    0,
  );
}

export function getMssPaidToPartner(projectType: string): number | null {
  const amount = sumByDirectionForProjectType(projectType, "mss_to_partner");
  return amount === 0 ? null : amount;
}

export function getPartnerPaidToMss(projectType: string): number | null {
  const amount = sumByDirectionForProjectType(projectType, "partner_to_mss");
  return amount === 0 ? null : amount;
}

export function sumMssPaidToPartners(projectTypes: readonly string[]): number {
  return sumByDirection(projectTypes, "mss_to_partner");
}

export function sumPartnerPaidToMss(projectTypes: readonly string[]): number {
  return sumByDirection(projectTypes, "partner_to_mss");
}

export function getRecordedLedgerTransactionsForProjectTypes(
  projectTypes: readonly string[],
): PartnerLedgerTransaction[] {
  const visible = new Set(projectTypes.map((projectType) => projectType.trim()).filter(Boolean));
  return PARTNER_LEDGER_TRANSACTIONS.filter((entry) => visible.has(entry.projectType));
}

/** @deprecated Use getRecordedLedgerTransactionsForProjectTypes */
export function getRecordedPartnerPaymentsForProjectTypes(
  projectTypes: readonly string[],
): Array<{ projectType: string; amount: number; note?: string }> {
  return getRecordedLedgerTransactionsForProjectTypes(projectTypes)
    .filter((entry) => entry.direction === "mss_to_partner")
    .map((entry) => ({
      projectType: entry.projectType,
      amount: entry.amount,
      note: entry.note,
    }));
}

export function totalConfiguredMssPartnerPayments(): number {
  return sumByDirection(
    [...new Set(PARTNER_LEDGER_TRANSACTIONS.map((entry) => entry.projectType))],
    "mss_to_partner",
  );
}
