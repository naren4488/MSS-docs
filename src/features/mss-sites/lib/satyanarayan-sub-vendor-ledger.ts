/**
 * Sub Vendor Payment · `SATYANARAYAN ` tab — money ledger.
 * Source: SUB VENDOR PAYMENT sheet (live snapshot 2026-08-20).
 * Maps to Projects PROJECT TYPE `SATAYNARAYAN JI`.
 */

import { SATYANARAYAN_SUB_VENDOR_LEDGER } from "./projects-config";
import { formatProjectAmount } from "./projects-columns";

export interface SatyanarayanLedgerRow {
  date: string;
  particular: string;
  dr: number;
  cr: number;
  closingBalance: number;
  remark: string;
}

export const SATYANARAYAN_LEDGER_SUMMARY = {
  totalDr: 163_372,
  totalCr: 0,
  closingBalance: SATYANARAYAN_SUB_VENDOR_LEDGER.headerBalance,
} as const;

/** Matches Sub Vendor Payment tab row order (skip empty trailing balance rows). */
export const SATYANARAYAN_LEDGER_ROWS: readonly SatyanarayanLedgerRow[] = [
  { date: "14 May 2026", particular: "PAYMENT", dr: 1_420, cr: 0, closingBalance: 1_420, remark: "MSS" },
  { date: "14 May 2026", particular: "PAYMENT", dr: 15_000, cr: 0, closingBalance: 16_420, remark: "" },
  { date: "16 May 2026", particular: "PAYMENT", dr: 5_000, cr: 0, closingBalance: 21_420, remark: "" },
  { date: "20 May 2026", particular: "PAYMENT", dr: 21_000, cr: 0, closingBalance: 42_420, remark: "" },
  { date: "21 May 2026", particular: "PAYMENT", dr: 5_000, cr: 0, closingBalance: 47_420, remark: "" },
  { date: "25 May 2026", particular: "PAYMENT", dr: 1_600, cr: 0, closingBalance: 49_020, remark: "" },
  { date: "28 May 2026", particular: "PAYMENT", dr: 2_000, cr: 0, closingBalance: 51_020, remark: "" },
  { date: "31 May 2026", particular: "PAYMENT", dr: 20_000, cr: 0, closingBalance: 71_020, remark: "" },
  { date: "17 Jun 2026", particular: "PAYMENT", dr: 30_000, cr: 0, closingBalance: 101_020, remark: "" },
  { date: "07 Jun 2026", particular: "PAYMENT", dr: 2_000, cr: 0, closingBalance: 103_020, remark: "" },
  { date: "11 Jun 2026", particular: "PAYMENT", dr: 2_000, cr: 0, closingBalance: 105_020, remark: "" },
  { date: "15 Jun 2026", particular: "PAYMENT", dr: 8_000, cr: 0, closingBalance: 113_020, remark: "" },
  { date: "16 Jun 2026", particular: "PAYMENT", dr: 8_000, cr: 0, closingBalance: 121_020, remark: "" },
  { date: "17 Jun 2026", particular: "PAYMENT", dr: 20_000, cr: 0, closingBalance: 141_020, remark: "" },
  { date: "04 Jul 2026", particular: "PAYMENT", dr: 5_000, cr: 0, closingBalance: 146_020, remark: "ADVANCE" },
  {
    date: "25 Jun 2026",
    particular: "10X2 ac cable 20m",
    dr: 1_652,
    cr: 0,
    closingBalance: 147_672,
    remark: "",
  },
  {
    date: "15 Jul 2026",
    particular: "PAYMENT",
    dr: 12_000,
    cr: 0,
    closingBalance: 159_672,
    remark: "MARGEN MONEY",
  },
  { date: "16 Jul 2026", particular: "PAYMENT", dr: 2_000, cr: 0, closingBalance: 161_672, remark: "CAR PETROL" },
  { date: "22 Jul 2026", particular: "PAYMENT", dr: 700, cr: 0, closingBalance: 162_372, remark: "CAR PETROL" },
  { date: "31 Jul 2026", particular: "PAYMENT", dr: 1_000, cr: 0, closingBalance: 163_372, remark: "CAR PETROL" },
];

export function formatLedgerAmount(amount: number): string {
  if (amount === 0) {
    return "—";
  }
  return `₹ ${formatProjectAmount(amount)}`;
}

export function formatSignedLedgerBalance(amount: number): string {
  const prefix = amount < 0 ? "− ₹ " : "₹ ";
  return `${prefix}${formatProjectAmount(Math.abs(amount))}`;
}
