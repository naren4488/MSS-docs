import { Wallet } from "lucide-react";
import {
  SHRIPAL_CASH_BANK_LEDGER_ROWS,
  SHRIPAL_CASH_BANK_LEDGER_SUMMARY,
  formatLedgerAmount,
  formatSignedLedgerBalance,
} from "../lib/shripal-cash-bank-ledger";
import { SHRIPAL_CASH_BANK_LEDGER } from "../lib/projects-config";

function LedgerAmountCell({ amount }: { amount: number }) {
  return (
    <td className={`mss-sites-analytics-table-num${amount === 0 ? " mss-sites-analytics-table-num--muted" : ""}`}>
      {formatLedgerAmount(amount)}
    </td>
  );
}

export function ShripalCashBankLedger() {
  return (
    <div className="mss-analytics-dual-ledgers mss-analytics-dual-ledgers--single">
      <section className="mss-subvendor-ledger-panel" id="analytics-shripal-cash-bank">
        <header className="mss-subvendor-ledger-header">
          <div className="mss-subvendor-ledger-header-icon mss-subvendor-ledger-header-icon--money">
            <Wallet size={18} aria-hidden />
          </div>
          <div>
            <h3 className="mss-subvendor-ledger-title">{SHRIPAL_CASH_BANK_LEDGER.title}</h3>
            <p className="mss-subvendor-ledger-subtitle">
              {SHRIPAL_CASH_BANK_LEDGER.spreadsheetTitle} · {SHRIPAL_CASH_BANK_LEDGER.sheetTab} · columns{" "}
              {SHRIPAL_CASH_BANK_LEDGER.columnRange} · maps to Projects{" "}
              <strong>{SHRIPAL_CASH_BANK_LEDGER.projectType}</strong>
            </p>
          </div>
        </header>

        <div className="mss-subvendor-ledger-summary">
          <div className="mss-subvendor-ledger-summary-item">
            <p className="mss-subvendor-ledger-summary-label">Total DR</p>
            <p className="mss-subvendor-ledger-summary-value">
              {formatLedgerAmount(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.totalDr)}
            </p>
          </div>
          <div className="mss-subvendor-ledger-summary-item">
            <p className="mss-subvendor-ledger-summary-label">Total CR</p>
            <p className="mss-subvendor-ledger-summary-value">
              {formatLedgerAmount(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.totalCr)}
            </p>
          </div>
          <div className="mss-subvendor-ledger-summary-item">
            <p className="mss-subvendor-ledger-summary-label">Balance</p>
            <p className="mss-subvendor-ledger-summary-value mss-subvendor-ledger-summary-value--emphasis">
              {formatSignedLedgerBalance(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.closingBalance)}
            </p>
          </div>
        </div>

        <p className="mss-subvendor-ledger-note" role="note">
          Left block on the Loans Ledgers tab — solvency fees, PhonePe / RTGS, partner cash, farma, and EMI rows
          mirrored when self-paid. Negative balance follows the sheet&apos;s Cash / Bank convention.
        </p>

        <div className="mss-sites-analytics-table-wrap">
          <table className="mss-sites-analytics-table mss-subvendor-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Particular</th>
                <th className="mss-sites-analytics-table-num">DR</th>
                <th className="mss-sites-analytics-table-num">CR</th>
                <th className="mss-sites-analytics-table-num">Closing</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {SHRIPAL_CASH_BANK_LEDGER_ROWS.map((row, index) => (
                <tr key={`${row.particular}-${row.closingBalance}-${index}`}>
                  <td>{row.date || "—"}</td>
                  <td>{row.particular}</td>
                  <LedgerAmountCell amount={row.dr} />
                  <LedgerAmountCell amount={row.cr} />
                  <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                    {formatSignedLedgerBalance(row.closingBalance)}
                  </td>
                  <td className="mss-subvendor-ledger-remark">{row.remark || "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  Totals
                </th>
                <td className="mss-sites-analytics-table-num">
                  {formatLedgerAmount(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.totalDr)}
                </td>
                <td className="mss-sites-analytics-table-num">
                  {formatLedgerAmount(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.totalCr)}
                </td>
                <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                  {formatSignedLedgerBalance(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.closingBalance)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
