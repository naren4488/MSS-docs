import type { ReactNode } from "react";
import { Building2, Wallet } from "lucide-react";
import {
  SATYANARAYAN_BS_ENTERPRISES_ROWS,
  SATYANARAYAN_BS_ENTERPRISES_SUMMARY,
  SATYANARAYAN_LEDGER_ROWS,
  SATYANARAYAN_LEDGER_SUMMARY,
  formatLedgerAmount,
  formatSignedLedgerBalance,
  type SatyanarayanLedgerRow,
} from "../lib/satyanarayan-sub-vendor-ledger";
import { getLedgerSign, ledgerAmountClassName, netBalanceLabel } from "../lib/compute-project-analytics";
import {
  SATYANARAYAN_BS_ENTERPRISES_LEDGER,
  SATYANARAYAN_SUB_VENDOR_LEDGER,
} from "../lib/projects-config";

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

function SatyanarayanLedgerPanel({
  id,
  title,
  subtitle,
  icon,
  iconClassName,
  summary,
  rows,
  drLabel,
  note,
}: {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconClassName: string;
  summary: { totalDr: number; totalCr: number; closingBalance: number };
  rows: readonly SatyanarayanLedgerRow[];
  drLabel: string;
  note: ReactNode;
}) {
  const closingSign = getLedgerSign(summary.closingBalance);

  return (
    <section className="mss-subvendor-ledger-panel" id={id}>
      <header className="mss-subvendor-ledger-header">
        <div className={`mss-subvendor-ledger-header-icon ${iconClassName}`}>{icon}</div>
        <div>
          <h3 className="mss-subvendor-ledger-title">{title}</h3>
          <p className="mss-subvendor-ledger-subtitle">{subtitle}</p>
        </div>
      </header>

      <div className="mss-subvendor-ledger-summary">
        <div className="mss-subvendor-ledger-summary-item">
          <p className="mss-subvendor-ledger-summary-label">{drLabel}</p>
          <p className="mss-subvendor-ledger-summary-value">{formatLedgerAmount(summary.totalDr)}</p>
        </div>
        <div className="mss-subvendor-ledger-summary-item">
          <p className="mss-subvendor-ledger-summary-label">Total CR</p>
          <p className="mss-subvendor-ledger-summary-value">{formatLedgerAmount(summary.totalCr)}</p>
        </div>
        <div className="mss-subvendor-ledger-summary-item">
          <p className="mss-subvendor-ledger-summary-label">Closing balance</p>
          <p
            className={`mss-subvendor-ledger-summary-value mss-subvendor-ledger-summary-value--emphasis ${ledgerAmountClassName(closingSign)}`}
          >
            {formatSignedLedgerBalance(summary.closingBalance)}
          </p>
        </div>
      </div>

      <p className="mss-subvendor-ledger-note" role="note">
        {note}
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
            {rows.map((row, index) => (
              <tr key={`${row.date}-${row.particular}-${row.dr}-${row.cr}-${index}`}>
                <td>{row.date || "—"}</td>
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
              <td className="mss-sites-analytics-table-num">{formatLedgerAmount(summary.totalDr)}</td>
              <td className="mss-sites-analytics-table-num">{formatLedgerAmount(summary.totalCr)}</td>
              <SignedBalanceCell amount={summary.closingBalance} emphasis />
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export function SatyanarayanSubVendorLedger() {
  return (
    <div className="mss-analytics-dual-ledgers">
      <SatyanarayanLedgerPanel
        id="analytics-satyanarayan-ledger"
        title={SATYANARAYAN_SUB_VENDOR_LEDGER.title}
        subtitle={`Sub Vendor Payment · ${SATYANARAYAN_SUB_VENDOR_LEDGER.sheetTab} · columns ${SATYANARAYAN_SUB_VENDOR_LEDGER.columnRange} · maps to Projects ${SATYANARAYAN_SUB_VENDOR_LEDGER.projectType}`}
        icon={<Wallet size={18} aria-hidden />}
        iconClassName="mss-subvendor-ledger-header-icon--money"
        summary={SATYANARAYAN_LEDGER_SUMMARY}
        rows={SATYANARAYAN_LEDGER_ROWS}
        drLabel="Total DR (MSS → Satyanarayan)"
        note={
          <>
            <strong>+ green</strong> = we will receive · <strong>− red</strong> = we need to pay. Closing{" "}
            {netBalanceLabel(SATYANARAYAN_LEDGER_SUMMARY.closingBalance).toLowerCase()} (MSS advances still
            outstanding on Satyanarayan&apos;s book).
          </>
        }
      />
      <SatyanarayanLedgerPanel
        id="analytics-satyanarayan-bs-enterprises"
        title={SATYANARAYAN_BS_ENTERPRISES_LEDGER.title}
        subtitle={`Sub Vendor Payment · ${SATYANARAYAN_BS_ENTERPRISES_LEDGER.sheetTab} · columns ${SATYANARAYAN_BS_ENTERPRISES_LEDGER.columnRange} · also Satyanarayan (${SATYANARAYAN_BS_ENTERPRISES_LEDGER.projectType})`}
        icon={<Building2 size={18} aria-hidden />}
        iconClassName="mss-subvendor-ledger-header-icon--bills"
        summary={SATYANARAYAN_BS_ENTERPRISES_SUMMARY}
        rows={SATYANARAYAN_BS_ENTERPRISES_ROWS}
        drLabel="Total DR (bills / advances)"
        note={
          <>
            <strong>+ green</strong> = we will receive · <strong>− red</strong> = we need to pay. Closing{" "}
            {netBalanceLabel(SATYANARAYAN_BS_ENTERPRISES_SUMMARY.closingBalance).toLowerCase()} on the BS
            Enterprises book.
          </>
        }
      />
    </div>
  );
}
