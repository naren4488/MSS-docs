/**
 * Sub Vendor Payment · Satyanarayan ledgers.
 * - `SATYANARAYAN ` tab — money ledger
 * - `BS enterprises` tab — also Satyanarayan (SATAYNARAYAN JI)
 * Source: live snapshot 2026-10-31 (closings unchanged vs 2026-10-26).
 */

import {
  SATYANARAYAN_BS_ENTERPRISES_LEDGER,
  SATYANARAYAN_SUB_VENDOR_LEDGER,
} from "./projects-config";
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
  totalDr: 169_992,
  totalCr: 0,
  closingBalance: SATYANARAYAN_SUB_VENDOR_LEDGER.headerBalance,
} as const;

export const SATYANARAYAN_BS_ENTERPRISES_SUMMARY = {
  totalDr: SATYANARAYAN_BS_ENTERPRISES_LEDGER.headerDr,
  totalCr: SATYANARAYAN_BS_ENTERPRISES_LEDGER.headerCr,
  closingBalance: SATYANARAYAN_BS_ENTERPRISES_LEDGER.headerBalance,
} as const;

/** Combined Sub Vendor closing for Satyanarayan hero / final sum. */
export const SATYANARAYAN_COMBINED_LEDGER_CLOSING =
  SATYANARAYAN_LEDGER_SUMMARY.closingBalance + SATYANARAYAN_BS_ENTERPRISES_SUMMARY.closingBalance;

/** Matches Sub Vendor Payment `SATYANARAYAN ` tab row order (skip empty trailing balance rows). */
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
  {
    date: "20 Aug 2026",
    particular: "Advance",
    dr: 1_620,
    cr: 0,
    closingBalance: 164_992,
    remark: "advance for fuel",
  },
  {
    date: "23 Aug 2026",
    particular: "Advance",
    dr: 1_500,
    cr: 0,
    closingBalance: 166_492,
    remark: "advance for fuel",
  },
  {
    date: "26 Aug 2026",
    particular: "Advance",
    dr: 1_850,
    cr: 0,
    closingBalance: 168_342,
    remark: "advance for fuel",
  },
  {
    date: "19 Oct 2026",
    particular: "Advance",
    dr: 1_650,
    cr: 0,
    closingBalance: 169_992,
    remark: "advance for fuel",
  },
];

/** Matches Sub Vendor Payment `BS enterprises` tab row order. */
export const SATYANARAYAN_BS_ENTERPRISES_ROWS: readonly SatyanarayanLedgerRow[] = [
  {
    date: "01 Sep 2026",
    particular: "BILL - MSE/26-27/0180",
    dr: 129_059,
    cr: 0,
    closingBalance: 129_059,
    remark: "",
  },
  { date: "", particular: "PAYMENT", dr: 0, cr: 17_000, closingBalance: 112_059, remark: "PP" },
  { date: "01 Sep 2026", particular: "PAYMENT", dr: 0, cr: 19_000, closingBalance: 93_059, remark: "PP" },
  { date: "01 Sep 2026", particular: "PAYMENT", dr: 0, cr: 19_000, closingBalance: 74_059, remark: "CASH" },
  {
    date: "05 Sep 2026",
    particular: "BILL - MSE/26-27/0183",
    dr: 6_702,
    cr: 0,
    closingBalance: 80_761,
    remark: "",
  },
  { date: "", particular: "OFF GRID -1", dr: 80_000, cr: 0, closingBalance: 160_761, remark: "" },
  { date: "", particular: "OFF GRID -1", dr: 80_000, cr: 0, closingBalance: 240_761, remark: "" },
  { date: "01 Sep 2026", particular: "PAYMENT", dr: 0, cr: 15_000, closingBalance: 225_761, remark: "" },
  { date: "07 Sep 2026", particular: "PAYMENT", dr: 0, cr: 15_000, closingBalance: 210_761, remark: "" },
  { date: "", particular: "PAYMENT", dr: 0, cr: 40_000, closingBalance: 170_761, remark: "" },
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
