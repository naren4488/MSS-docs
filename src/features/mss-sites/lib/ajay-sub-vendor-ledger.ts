/**
 * Sub Vendor Payment · `Ajay` tab — money ledger + Everest Solar Bill.
 * Source: SUB VENDOR PAYMENT sheet (live snapshot 2026-08-09).
 */

import { AJAY_SUB_VENDOR_LEDGER } from "./projects-config";
import { formatProjectAmount } from "./projects-columns";

export interface AjayMoneyLedgerRow {
  date: string;
  dr: number;
  cr: number;
  closingBalance: number;
  remark: string;
}

export interface AjayEverestBillRow {
  date: string;
  invoiceNo: string;
  amount: number;
  closingBalance: number;
}

export const AJAY_MONEY_LEDGER_SUMMARY = {
  totalDr: 360_000,
  totalCr: 788_500,
  closingBalance: AJAY_SUB_VENDOR_LEDGER.tables[0].headerBalance,
} as const;

export const AJAY_EVEREST_BILLS_SUMMARY = {
  totalDr: AJAY_SUB_VENDOR_LEDGER.tables[1].headerBalance,
  closingBalance: AJAY_SUB_VENDOR_LEDGER.tables[1].headerBalance,
} as const;

/** Matches Sub Vendor Payment tab row order. */
export const AJAY_MONEY_LEDGER_ROWS: readonly AjayMoneyLedgerRow[] = [
  {
    date: "12 Nov 2025",
    dr: 10_000,
    cr: 0,
    closingBalance: 10_000,
    remark: "Saroj Devi site — ₹90k return from Arkshakti ₹1L",
  },
  {
    date: "14 Mar 2026",
    dr: 50_000,
    cr: 0,
    closingBalance: 60_000,
    remark: "Online PhonePe",
  },
  {
    date: "27 Apr 2026",
    dr: 0,
    cr: 105_000,
    closingBalance: -45_000,
    remark: "PP",
  },
  {
    date: "19 May 2026",
    dr: 0,
    cr: 300_000,
    closingBalance: -345_000,
    remark: "Cash",
  },
  {
    date: "19 May 2026",
    dr: 0,
    cr: 170_000,
    closingBalance: -515_000,
    remark: "PP",
  },
  {
    date: "21 May 2026",
    dr: 0,
    cr: 113_500,
    closingBalance: -628_500,
    remark: "PP",
  },
  {
    date: "22 May 2026",
    dr: 0,
    cr: 50_000,
    closingBalance: -678_500,
    remark: "PP",
  },
  {
    date: "28 May 2026",
    dr: 0,
    cr: 50_000,
    closingBalance: -728_500,
    remark: "Cash",
  },
  {
    date: "30 Jul 2026",
    dr: 300_000,
    cr: 0,
    closingBalance: -428_500,
    remark: "EVEREST BUILD SOLAR NEFT",
  },
];

export const AJAY_EVEREST_BILL_ROWS: readonly AjayEverestBillRow[] = [
  { date: "17 Jun 2026", invoiceNo: "MSE/26-27/0065", amount: 7_623, closingBalance: 7_623 },
  { date: "24 Jun 2026", invoiceNo: "MSE/26-27/0075", amount: 8_903, closingBalance: 16_526 },
  { date: "24 Jun 2026", invoiceNo: "MSE/26-27/0080", amount: 4_857, closingBalance: 21_383 },
  { date: "07 Jul 2026", invoiceNo: "MSE/26-27/0094", amount: 5_891, closingBalance: 27_274 },
  { date: "14 Jul 2026", invoiceNo: "MSE/26-27/0105", amount: 11_800, closingBalance: 39_074 },
  { date: "19 Jul 2026", invoiceNo: "MSE/26-27/0111", amount: 2_124, closingBalance: 41_198 },
  { date: "24 Jul 2026", invoiceNo: "MSE/26-27/0117", amount: 2_183, closingBalance: 43_381 },
  { date: "02 Aug 2026", invoiceNo: "MSE/26-27/0125", amount: 8_260, closingBalance: 51_641 },
  { date: "08 Aug 2026", invoiceNo: "MSE/26-27/0137", amount: 17_538, closingBalance: 69_179 },
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
