import { FileText, Wallet } from "lucide-react";
import {
  AJAY_EVEREST_BILL_ROWS,
  AJAY_EVEREST_BILLS_SUMMARY,
  AJAY_MONEY_LEDGER_ROWS,
  AJAY_MONEY_LEDGER_SUMMARY,
  formatLedgerAmount,
  formatSignedLedgerBalance,
} from "../lib/ajay-sub-vendor-ledger";
import { AJAY_SUB_VENDOR_LEDGER } from "../lib/projects-config";

function LedgerAmountCell({ amount }: { amount: number }) {
  return (
    <td className={`mss-sites-analytics-table-num${amount === 0 ? " mss-sites-analytics-table-num--muted" : ""}`}>
      {formatLedgerAmount(amount)}
    </td>
  );
}

function SubVendorLedgerSummary({
  items,
}: {
  items: { label: string; value: string; emphasis?: boolean }[];
}) {
  return (
    <div className="mss-subvendor-ledger-summary">
      {items.map((item) => (
        <div key={item.label} className="mss-subvendor-ledger-summary-item">
          <p className="mss-subvendor-ledger-summary-label">{item.label}</p>
          <p
            className={`mss-subvendor-ledger-summary-value${item.emphasis ? " mss-subvendor-ledger-summary-value--emphasis" : ""}`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function AjaySubVendorLedgers() {
  const moneyTable = AJAY_SUB_VENDOR_LEDGER.tables[0];
  const billsTable = AJAY_SUB_VENDOR_LEDGER.tables[1];

  return (
    <div className="mss-analytics-dual-ledgers">
      <section className="mss-subvendor-ledger-panel" id="analytics-ajay-money">
        <header className="mss-subvendor-ledger-header">
          <div className="mss-subvendor-ledger-header-icon mss-subvendor-ledger-header-icon--money">
            <Wallet size={18} aria-hidden />
          </div>
          <div>
            <h3 className="mss-subvendor-ledger-title">{moneyTable.title}</h3>
            <p className="mss-subvendor-ledger-subtitle">
              Sub Vendor Payment · {AJAY_SUB_VENDOR_LEDGER.sheetTab} · columns {moneyTable.columnRange}
            </p>
          </div>
        </header>

        <SubVendorLedgerSummary
          items={[
            { label: "Total DR (paid out)", value: formatLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalDr) },
            { label: "Total CR (received)", value: formatLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalCr) },
            {
              label: "Closing balance",
              value: formatSignedLedgerBalance(AJAY_MONEY_LEDGER_SUMMARY.closingBalance),
              emphasis: true,
            },
          ]}
        />

        <p className="mss-subvendor-ledger-note" role="note">
          Negative closing balance = Ajay has paid/received more than MSS has paid out on this book (net CR side).
        </p>

        <div className="mss-sites-analytics-table-wrap">
          <table className="mss-sites-analytics-table mss-subvendor-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="mss-sites-analytics-table-num">DR</th>
                <th className="mss-sites-analytics-table-num">CR</th>
                <th className="mss-sites-analytics-table-num">Closing</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {AJAY_MONEY_LEDGER_ROWS.map((row) => (
                <tr key={`${row.date}-${row.remark}`}>
                  <td>{row.date}</td>
                  <LedgerAmountCell amount={row.dr} />
                  <LedgerAmountCell amount={row.cr} />
                  <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                    {formatSignedLedgerBalance(row.closingBalance)}
                  </td>
                  <td className="mss-subvendor-ledger-remark">{row.remark}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Totals</th>
                <td className="mss-sites-analytics-table-num">{formatLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalDr)}</td>
                <td className="mss-sites-analytics-table-num">{formatLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalCr)}</td>
                <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                  {formatSignedLedgerBalance(AJAY_MONEY_LEDGER_SUMMARY.closingBalance)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="mss-subvendor-ledger-panel" id="analytics-ajay-bills">
        <header className="mss-subvendor-ledger-header">
          <div className="mss-subvendor-ledger-header-icon mss-subvendor-ledger-header-icon--bills">
            <FileText size={18} aria-hidden />
          </div>
          <div>
            <h3 className="mss-subvendor-ledger-title">{billsTable.title}</h3>
            <p className="mss-subvendor-ledger-subtitle">
              MSE vendor invoices · columns {billsTable.columnRange}
            </p>
          </div>
        </header>

        <SubVendorLedgerSummary
          items={[
            { label: "Invoice lines", value: String(AJAY_EVEREST_BILL_ROWS.length) },
            {
              label: "Total bills (DR)",
              value: formatLedgerAmount(AJAY_EVEREST_BILLS_SUMMARY.totalDr),
              emphasis: true,
            },
          ]}
        />

        <p className="mss-subvendor-ledger-note" role="note">
          Everest Solar / MSE invoices booked against Ajay — cumulative DR is total vendor bill outstanding on this side.
        </p>

        <div className="mss-sites-analytics-table-wrap">
          <table className="mss-sites-analytics-table mss-subvendor-ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice no.</th>
                <th className="mss-sites-analytics-table-num">DR</th>
                <th className="mss-sites-analytics-table-num">Closing</th>
              </tr>
            </thead>
            <tbody>
              {AJAY_EVEREST_BILL_ROWS.map((row) => (
                <tr key={row.invoiceNo}>
                  <td>{row.date}</td>
                  <td className="mss-subvendor-ledger-invoice">{row.invoiceNo}</td>
                  <td className="mss-sites-analytics-table-num">{formatLedgerAmount(row.amount)}</td>
                  <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                    {formatLedgerAmount(row.closingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  Total
                </th>
                <td className="mss-sites-analytics-table-num">{formatLedgerAmount(AJAY_EVEREST_BILLS_SUMMARY.totalDr)}</td>
                <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                  {formatLedgerAmount(AJAY_EVEREST_BILLS_SUMMARY.closingBalance)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
