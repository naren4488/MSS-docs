/**
 * Loans Ledgers · `Shripal Ji` tab — left Cash / Bank block (columns A–F).
 * Source: Loans Ledgers sheet (live snapshot 2026-08-19). Loan EMI block (right) excluded.
 * See docs/planning/loans-ledgers.md.
 */

import { formatProjectAmount } from "./projects-columns";
import { SHRIPAL_CASH_BANK_LEDGER } from "./projects-config";

export interface ShripalCashBankLedgerRow {
  date: string;
  particular: string;
  dr: number;
  cr: number;
  closingBalance: number;
  remark: string;
}

export const SHRIPAL_CASH_BANK_LEDGER_SUMMARY = {
  totalDr: SHRIPAL_CASH_BANK_LEDGER.headerDr,
  totalCr: SHRIPAL_CASH_BANK_LEDGER.headerCr,
  closingBalance: SHRIPAL_CASH_BANK_LEDGER.closingBalance,
} as const;

/** Matches Loans Ledgers tab row order (Cash / Bank block only). */
export const SHRIPAL_CASH_BANK_LEDGER_ROWS: readonly ShripalCashBankLedgerRow[] = [
  { date: "09 Feb 2026", particular: "Solvency Time", dr: 0, cr: 10_000, closingBalance: -10_000, remark: "Phonepe" },
  {
    date: "",
    particular: "Online Verfication Solvency",
    dr: 0,
    cr: 2_000,
    closingBalance: -12_000,
    remark: "Phonepe",
  },
  {
    date: "",
    particular: "Firm K account Me clint ka pay.",
    dr: 0,
    cr: 49_785,
    closingBalance: -61_785,
    remark: "Phonepe",
  },
  { date: "", particular: "TIN Shade", dr: 0, cr: 54_694, closingBalance: -116_479, remark: "Phonepe" },
  { date: "", particular: "RTGS", dr: 0, cr: 41_226, closingBalance: -157_705, remark: "RTGS" },
  { date: "09 Feb 2026", particular: "Phonepe", dr: 15_000, cr: 0, closingBalance: -142_705, remark: "Phonepe" },
  { date: "", particular: "Phonepe", dr: 28_900, cr: 0, closingBalance: -113_805, remark: "Phonepe" },
  { date: "", particular: "Phonepe", dr: 2_700, cr: 0, closingBalance: -111_105, remark: "Phonepe" },
  {
    date: "",
    particular: "ajay pal ji ka cash payment",
    dr: 20_000,
    cr: 0,
    closingBalance: -91_105,
    remark: "ajay pal ji paid",
  },
  {
    date: "",
    particular: "mukesh mali advance refund kia",
    dr: 0,
    cr: 10_000,
    closingBalance: -101_105,
    remark: "srhipal ji ne advance refund kia jiska cash MSS me aaya tha",
  },
  {
    date: "",
    particular: "farma first time (8 farma)",
    dr: 0,
    cr: 2_450,
    closingBalance: -103_555,
    remark: "cash paid by shripal ji",
  },
  {
    date: "",
    particular: "farma second time (16 farma)",
    dr: 0,
    cr: 4_400,
    closingBalance: -107_955,
    remark: "cash paid by shripal ji",
  },
  {
    date: "03 Mar 2026",
    particular: "1st EMI",
    dr: 0,
    cr: 14_750,
    closingBalance: -122_705,
    remark: "self paid by shripal ji",
  },
  {
    date: "03 Apr 2026",
    particular: "2nd EMI",
    dr: 0,
    cr: 14_750,
    closingBalance: -137_455,
    remark: "self paid by shripal ji",
  },
  {
    date: "",
    particular: "pipe gaye the karansar",
    dr: 0,
    cr: 0,
    closingBalance: -137_455,
    remark: "",
  },
  {
    date: "",
    particular: "farma sheet (16 farma)",
    dr: 0,
    cr: 0,
    closingBalance: -137_455,
    remark: "",
  },
  {
    date: "",
    particular: "shri govind workshop se material",
    dr: 0,
    cr: 0,
    closingBalance: -137_455,
    remark: "",
  },
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
