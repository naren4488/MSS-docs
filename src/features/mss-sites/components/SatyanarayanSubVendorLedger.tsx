import { Wallet } from "lucide-react";
import {
  SATYANARAYAN_LEDGER_ROWS,
  SATYANARAYAN_LEDGER_SUMMARY,
  formatLedgerAmount,
  formatSignedLedgerBalance,
} from "../lib/satyanarayan-sub-vendor-ledger";
import { getLedgerSign, ledgerAmountClassName, netBalanceLabel } from "../lib/compute-project-analytics";
import { SATYANARAYAN_SUB_VENDOR_LEDGER } from "../lib/projects-config";

function LedgerAmountCell({ amount }: { amount: number }) {
  return (
    <td className={`mss-sites-analytics-table-num${amount === 0 ? " mss-sites-analytics-table-num--muted" : ""}`}>
      {formatLedgerAmount(amount)}
    </td>
  );
}

function SignedBalanceCell({ amount, emphasis = false }: { amount: number; emphasis?: boolean }) {
  const sign = getLedgerSign(amount);
  return (
    <td
      className={`mss-sites-analytics-table-num${emphasis ? " mss-sites-analytics-table-num--emphasis" : ""} ${ledgerAmountClassName(sign)}`}
    >
      {formatSignedLedgerBalance(amount)}
    </td>
  );
}

export function SatyanarayanSubVendorLedger() {
  const closingSign = getLedgerSign(SATYANARAYAN_LEDGER_SUMMARY.closingBalance);

  return (
    <div className="mss-analytics-dual-ledgers mss-analytics-dual-ledgers--single">
      <section className="mss-subvendor-ledger-panel" id="analytics-satyanarayan-ledger">
        <header className="mss-subvendor-ledger-header">
          <div className="mss-subvendor-ledger-header-icon mss-subvendor-ledger-header-icon--money">
            <Wallet size={18} aria-hidden />
          </div>
          <div>
            <h3 className="mss-subvendor-ledger-title">{SATYANARAYAN_SUB_VENDOR_LEDGER.title}</h3>
            <p className="mss-subvendor-ledger-subtitle">
              Sub Vendor Payment · {SATYANARAYAN_SUB_VENDOR_LEDGER.sheetTab} · columns{" "}
              {SATYANARAYAN_SUB_VENDOR_LEDGER.columnRange} · maps to Projects{" "}
              <strong>{SATYANARAYAN_SUB_VENDOR_LEDGER.projectType}</strong>
            </p>
          </div>
        </header>

        <div className="mss-subvendor-ledger-summary">
          <div className="mss-subvendor-ledger-summary-item">
            <p className="mss-subvendor-ledger-summary-label">Total DR (MSS → Satyanarayan)</p>
            <p className="mss-subvendor-ledger-summary-value">
              {formatLedgerAmount(SATYANARAYAN_LEDGER_SUMMARY.totalDr)}
            </p>
          </div>
          <div className="mss-subvendor-ledger-summary-item">
            <p className="mss-subvendor-ledger-summary-label">Total CR</p>
            <p className="mss-subvendor-ledger-summary-value">
              {formatLedgerAmount(SATYANARAYAN_LEDGER_SUMMARY.totalCr)}
            </p>
          </div>
          <div className="mss-subvendor-ledger-summary-item">
            <p className="mss-subvendor-ledger-summary-label">Closing balance</p>
            <p
              className={`mss-subvendor-ledger-summary-value mss-subvendor-ledger-summary-value--emphasis ${ledgerAmountClassName(closingSign)}`}
            >
              {formatSignedLedgerBalance(SATYANARAYAN_LEDGER_SUMMARY.closingBalance)}
            </p>
          </div>
        </div>

        <p className="mss-subvendor-ledger-note" role="note">
          <strong>+ green</strong> = we will receive · <strong>− red</strong> = we need to pay. Closing{" "}
          {netBalanceLabel(SATYANARAYAN_LEDGER_SUMMARY.closingBalance).toLowerCase()} (MSS advances still
          outstanding on Satyanarayan&apos;s book).
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
              {SATYANARAYAN_LEDGER_ROWS.map((row, index) => (
                <tr key={`${row.date}-${row.particular}-${row.dr}-${index}`}>
                  <td>{row.date}</td>
                  <td>{row.particular}</td>
                  <LedgerAmountCell amount={row.dr} />
                  <LedgerAmountCell amount={row.cr} />
                  <SignedBalanceCell amount={row.closingBalance} emphasis />
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
                  {formatLedgerAmount(SATYANARAYAN_LEDGER_SUMMARY.totalDr)}
                </td>
                <td className="mss-sites-analytics-table-num">
                  {formatLedgerAmount(SATYANARAYAN_LEDGER_SUMMARY.totalCr)}
                </td>
                <SignedBalanceCell amount={SATYANARAYAN_LEDGER_SUMMARY.closingBalance} emphasis />
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
