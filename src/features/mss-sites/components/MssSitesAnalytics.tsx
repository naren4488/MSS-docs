import { useMemo } from "react";
import { ArrowDown, ArrowUp, Building2, Handshake, IndianRupee, Landmark, Wallet } from "lucide-react";
import {
  computeProjectAnalytics,
  formatSignedLedgerAmount,
  getLedgerSign,
  ledgerAmountClassName,
  ledgerSignLabel,
  netBalanceLabel,
  type LedgerSign,
  type VendorBreakdown,
} from "../lib/compute-project-analytics";
import { PROJECT_VENDORS } from "../lib/projects-config";

interface MssSitesAnalyticsProps {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  totalRowCount?: number;
}

const ANALYTICS_SECTIONS = [
  { id: "analytics-overview", label: "Overview" },
  { id: "analytics-deals", label: "Deal totals" },
  { id: "analytics-dues", label: "Payment dues" },
  { id: "analytics-ledger", label: "Partner ledger" },
  { id: "analytics-partners", label: "By partner" },
] as const;

function formatAmountOrDash(amount: number) {
  return amount === 0 ? "—" : formatSignedLedgerAmount(amount);
}

function signedSign(amount: number): LedgerSign {
  return getLedgerSign(amount);
}

function SignedAmount({
  amount,
  sign,
  emphasis = false,
  dashWhenZero = false,
}: {
  amount: number;
  sign: LedgerSign;
  emphasis?: boolean;
  dashWhenZero?: boolean;
}) {
  const className = [
    "mss-sites-analytics-table-num",
    amount === 0 && dashWhenZero ? "mss-sites-analytics-table-num--muted" : ledgerAmountClassName(sign),
    emphasis ? "mss-sites-analytics-table-num--emphasis" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <td className={className}>
      {dashWhenZero && amount === 0 ? "—" : formatSignedLedgerAmount(amount)}
    </td>
  );
}

function VendorSplitBar({ breakdown }: { breakdown: VendorBreakdown }) {
  const mssShare = breakdown.total > 0 ? (breakdown.mss / breakdown.total) * 100 : 0;
  const arkshaktiShare = breakdown.total > 0 ? (breakdown.arkshakti / breakdown.total) * 100 : 0;

  return (
    <div className="mss-analytics-vendor-split" aria-hidden={breakdown.total === 0}>
      <div className="mss-analytics-vendor-split-track">
        {mssShare > 0 ? (
          <span
            className="mss-analytics-vendor-split-segment mss-analytics-vendor-split-segment--mss"
            style={{ width: `${mssShare}%` }}
          />
        ) : null}
        {arkshaktiShare > 0 ? (
          <span
            className="mss-analytics-vendor-split-segment mss-analytics-vendor-split-segment--arkshakti"
            style={{ width: `${arkshaktiShare}%` }}
          />
        ) : null}
      </div>
      <div className="mss-analytics-vendor-split-labels">
        <span>
          <span className="mss-analytics-vendor-dot mss-analytics-vendor-dot--mss" />
          {PROJECT_VENDORS.MSS} {breakdown.mss}
          {breakdown.total > 0 ? ` (${Math.round(mssShare)}%)` : ""}
        </span>
        <span>
          <span className="mss-analytics-vendor-dot mss-analytics-vendor-dot--arkshakti" />
          {PROJECT_VENDORS.ARKSHAKTI} {breakdown.arkshakti}
          {breakdown.total > 0 ? ` (${Math.round(arkshaktiShare)}%)` : ""}
        </span>
      </div>
    </div>
  );
}

function VendorDueTable({
  rows,
  neutralAmounts = false,
  summaryRow,
}: {
  rows: { label: string; breakdown: VendorBreakdown }[];
  neutralAmounts?: boolean;
  summaryRow?: { label: string; breakdown: VendorBreakdown };
}) {
  const amountClass = (amount: number, emphasis = false) =>
    [
      "mss-sites-analytics-table-num",
      emphasis ? "mss-sites-analytics-table-num--emphasis" : "",
      neutralAmounts ? "" : ledgerAmountClassName(signedSign(amount)),
    ]
      .filter(Boolean)
      .join(" ");

  const signedAmountClass = (amount: number, emphasis = false) =>
    [
      "mss-sites-analytics-table-num",
      emphasis ? "mss-sites-analytics-table-num--emphasis" : "",
      ledgerAmountClassName(signedSign(amount)),
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="mss-sites-analytics-table-wrap mss-sites-analytics-table-wrap--dues">
      <table className="mss-sites-analytics-table mss-sites-analytics-table--dues">
        <thead>
          <tr>
            <th>Metric</th>
            <th className="mss-sites-analytics-table-num">{PROJECT_VENDORS.MSS}</th>
            <th className="mss-sites-analytics-table-num">{PROJECT_VENDORS.ARKSHAKTI}</th>
            <th className="mss-sites-analytics-table-num">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td className={amountClass(row.breakdown.mss)}>{formatAmountOrDash(row.breakdown.mss)}</td>
              <td className={amountClass(row.breakdown.arkshakti)}>
                {formatAmountOrDash(row.breakdown.arkshakti)}
              </td>
              <td className={amountClass(row.breakdown.total, true)}>{formatAmountOrDash(row.breakdown.total)}</td>
            </tr>
          ))}
        </tbody>
        {summaryRow ? (
          <tfoot>
            <tr className="mss-analytics-deals-profit-row">
              <th scope="row">{summaryRow.label}</th>
              <td className={signedAmountClass(summaryRow.breakdown.mss, true)}>
                {formatAmountOrDash(summaryRow.breakdown.mss)}
              </td>
              <td className={signedAmountClass(summaryRow.breakdown.arkshakti, true)}>
                {formatAmountOrDash(summaryRow.breakdown.arkshakti)}
              </td>
              <td className={signedAmountClass(summaryRow.breakdown.total, true)}>
                {formatAmountOrDash(summaryRow.breakdown.total)}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

function LedgerLegend() {
  return (
    <div className="mss-ledger-legend" role="note">
      <div className="mss-ledger-legend-item">
        <span className="mss-ledger-badge mss-ledger-badge--credit">
          <ArrowUp size={12} aria-hidden />
          Credit
        </span>
        <span>MSS will receive (from clients or partner recovery)</span>
      </div>
      <div className="mss-ledger-legend-item">
        <span className="mss-ledger-badge mss-ledger-badge--debit">
          <ArrowDown size={12} aria-hidden />
          Debit
        </span>
        <span>Partner repaid MSS — reduces net receivable</span>
      </div>
    </div>
  );
}

export function MssSitesAnalytics({ headers, rows, totalRowCount }: MssSitesAnalyticsProps) {
  const analytics = useMemo(() => computeProjectAnalytics(headers, rows), [headers, rows]);
  const { summary } = analytics;
  const netSign = getLedgerSign(summary.netMssReceivable);
  const profitSign = summary.totalPartnerProfit >= 0 ? "credit" : "debit";
  const isFiltered = totalRowCount !== undefined && totalRowCount !== rows.length;

  const partnerTotals = useMemo(
    () =>
      analytics.byProjectType.reduce(
        (acc, entry) => ({
          dueFromClients: acc.dueFromClients + entry.dueFromClients,
          partnerAdvances: acc.partnerAdvances + entry.partnerAdvancesRecoverable,
          net: acc.net + entry.netMssReceivable,
        }),
        { dueFromClients: 0, partnerAdvances: 0, net: 0 },
      ),
    [analytics.byProjectType],
  );

  return (
    <div className="mss-sites-analytics">
      <header className="mss-analytics-top">
        <div className="mss-analytics-top-copy">
          <p className="mss-analytics-eyebrow">Projects analytics</p>
          <h1 className="mss-analytics-title">Filtered summary</h1>
          <p className="mss-analytics-subtitle">
            {rows.length} site{rows.length === 1 ? "" : "s"}
            {isFiltered ? ` of ${totalRowCount} total` : ""}
            {analytics.byProjectType.length > 0
              ? ` · ${analytics.byProjectType.length} partner tab${analytics.byProjectType.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>

        <nav className="mss-analytics-nav" aria-label="Analytics sections">
          {ANALYTICS_SECTIONS.map((section) => (
            <a key={section.id} className="mss-analytics-nav-link" href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="mss-analytics-hero" aria-label="Key metrics">
        <article className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${netSign}`}>
          <p className="mss-analytics-hero-label">Net MSS receivable</p>
          <p className={`mss-analytics-hero-value ${ledgerAmountClassName(netSign)}`}>
            {formatSignedLedgerAmount(summary.netMssReceivable)}
          </p>
          <p className="mss-analytics-hero-hint">{netBalanceLabel(summary.netMssReceivable)}</p>
        </article>
        <article className="mss-analytics-hero-card">
          <p className="mss-analytics-hero-label">Total sites</p>
          <p className="mss-analytics-hero-value">{summary.sitesByVendor.total}</p>
          <p className="mss-analytics-hero-hint">
            {PROJECT_VENDORS.MSS} {summary.sitesByVendor.mss} · {PROJECT_VENDORS.ARKSHAKTI}{" "}
            {summary.sitesByVendor.arkshakti}
          </p>
        </article>
        <article className="mss-analytics-hero-card">
          <p className="mss-analytics-hero-label">Total due to MSS</p>
          <p className="mss-analytics-hero-value mss-ledger-amount--credit">
            {formatSignedLedgerAmount(summary.totalDueToMss)}
          </p>
          <p className="mss-analytics-hero-hint">Pending from clients — will come to MSS</p>
        </article>
        <article className="mss-analytics-hero-card">
          <p className="mss-analytics-hero-label">Final deal with client</p>
          <p className="mss-analytics-hero-value">{formatSignedLedgerAmount(summary.totalFinalDealWithClient)}</p>
          <p className="mss-analytics-hero-hint">What partner charged clients</p>
        </article>
        <article className="mss-analytics-hero-card">
          <p className="mss-analytics-hero-label">Deal with MSS</p>
          <p className="mss-analytics-hero-value">{formatSignedLedgerAmount(summary.totalDealWithMss)}</p>
          <p className="mss-analytics-hero-hint">What partner paid MSS</p>
        </article>
        <article className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${profitSign}`}>
          <p className="mss-analytics-hero-label">Partner profit</p>
          <p className={`mss-analytics-hero-value ${ledgerAmountClassName(profitSign)}`}>
            {formatSignedLedgerAmount(summary.totalPartnerProfit)}
          </p>
          <p className="mss-analytics-hero-hint">Final deal with client − Deal with MSS</p>
        </article>
      </section>

      <div className="mss-analytics-grid">
        <section className="mss-sites-analytics-panel" id="analytics-overview">
          <header className="mss-sites-analytics-panel-header">
            <Building2 size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">Overview</h2>
              <p className="mss-sites-analytics-panel-subtitle">Site count split by data source</p>
            </div>
          </header>

          <div className="mss-analytics-overview-stats">
            <article className="mss-sites-analytics-card mss-sites-analytics-card--vendor-mss">
              <p className="mss-sites-analytics-card-label">{PROJECT_VENDORS.MSS}</p>
              <p className="mss-sites-analytics-card-value">{summary.sitesByVendor.mss}</p>
              <p className="mss-sites-analytics-card-hint">sites</p>
            </article>
            <article className="mss-sites-analytics-card mss-sites-analytics-card--vendor-arkshakti">
              <p className="mss-sites-analytics-card-label">{PROJECT_VENDORS.ARKSHAKTI}</p>
              <p className="mss-sites-analytics-card-value">{summary.sitesByVendor.arkshakti}</p>
              <p className="mss-sites-analytics-card-hint">sites</p>
            </article>
            <article className="mss-sites-analytics-card mss-sites-analytics-card--vendor-total">
              <p className="mss-sites-analytics-card-label">Combined</p>
              <p className="mss-sites-analytics-card-value">{summary.sitesByVendor.total}</p>
              <p className="mss-sites-analytics-card-hint">filtered sites</p>
            </article>
          </div>

          <VendorSplitBar breakdown={summary.sitesByVendor} />
        </section>

        <section className="mss-sites-analytics-panel" id="analytics-deals">
          <header className="mss-sites-analytics-panel-header">
            <IndianRupee size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">Deal totals</h2>
              <p className="mss-sites-analytics-panel-subtitle">
                Client billing vs MSS cost; per-row commission is in the projects table
              </p>
            </div>
          </header>

          <VendorDueTable
            neutralAmounts
            rows={[
              { label: "Final deal with client", breakdown: summary.finalDealWithClientByVendor },
              { label: "Deal with MSS", breakdown: summary.dealWithMssByVendor },
            ]}
            summaryRow={{
              label: "Partner profit (client − MSS)",
              breakdown: summary.partnerProfitByVendor,
            }}
          />
        </section>

        <section className="mss-sites-analytics-panel" id="analytics-dues">
          <header className="mss-sites-analytics-panel-header">
            <Landmark size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">MSS payment dues</h2>
              <p className="mss-sites-analytics-panel-subtitle">
                Pending client payments — positive amounts MSS will receive
              </p>
            </div>
          </header>

          <VendorDueTable
            neutralAmounts
            rows={[
              { label: "Cash due from client", breakdown: summary.cashDueFromClientByVendor },
              { label: "Bank due", breakdown: summary.bankDueByVendor },
              { label: "Cash due to MSS", breakdown: summary.cashDueToMssByVendor },
              { label: "Total due to MSS", breakdown: summary.totalDueToMssByVendor },
            ]}
          />
        </section>
      </div>

      <section
        className="mss-sites-analytics-panel mss-sites-analytics-panel--partner"
        id="analytics-ledger"
      >
        <header className="mss-sites-analytics-panel-header">
          <Handshake size={18} aria-hidden />
          <div>
            <h2 className="mss-sites-analytics-panel-title">Partner ledger</h2>
            <p className="mss-sites-analytics-panel-subtitle">
              Site dues rolled up, external payments itemised, running balance
            </p>
          </div>
        </header>

        <LedgerLegend />

        <div className="mss-sites-analytics-ledger-summary">
          <article className={`mss-sites-analytics-card mss-sites-analytics-card--balance mss-sites-analytics-card--balance-${netSign}`}>
            <p className="mss-sites-analytics-card-label">Net MSS receivable</p>
            <p className={`mss-sites-analytics-card-value ${ledgerAmountClassName(netSign)}`}>
              {formatSignedLedgerAmount(summary.netMssReceivable)}
            </p>
          </article>
          <article className="mss-sites-analytics-card">
            <p className="mss-sites-analytics-card-label">Receivables (credit)</p>
            <p className={`mss-sites-analytics-card-value ${ledgerAmountClassName("credit")}`}>
              {formatSignedLedgerAmount(summary.totalCredits)}
            </p>
          </article>
          <article className="mss-sites-analytics-card">
            <p className="mss-sites-analytics-card-label">Repayments (debit)</p>
            <p className={`mss-sites-analytics-card-value ${ledgerAmountClassName("debit")}`}>
              {formatSignedLedgerAmount(summary.totalDebits)}
            </p>
          </article>
          <article className="mss-sites-analytics-card">
            <p className="mss-sites-analytics-card-label">Ledger lines</p>
            <p className="mss-sites-analytics-card-value">{analytics.ledgerLines.length}</p>
          </article>
        </div>

        {analytics.ledgerLines.length === 0 ? (
          <div className="mss-analytics-empty">
            <p className="mss-analytics-empty-title">No ledger entries</p>
            <p className="mss-analytics-empty-text">Adjust filters to include partner tabs or site dues.</p>
          </div>
        ) : (
          <div className="mss-sites-analytics-table-wrap mss-sites-analytics-table-wrap--ledger">
            <table className="mss-sites-analytics-table mss-sites-analytics-table--ledger">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Entry</th>
                  <th>Type</th>
                  <th className="mss-sites-analytics-table-num">Amount</th>
                  <th className="mss-sites-analytics-table-num">Balance</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {analytics.ledgerLines.map((line) => {
                  const details = [line.method, line.date].filter(Boolean).join(" · ");
                  const isSiteSummary = line.source === "site";

                  return (
                    <tr
                      key={line.id}
                      className={isSiteSummary ? "mss-ledger-row--site-summary" : undefined}
                    >
                      <td className="mss-ledger-cell-partner">{line.projectType}</td>
                      <td>
                        <span className="mss-ledger-entry-label">{line.description}</span>
                        {line.source === "external" ? (
                          <span className="mss-ledger-entry-source">External</span>
                        ) : null}
                      </td>
                      <td>
                        <span className={`mss-ledger-badge mss-ledger-badge--${line.sign}`}>
                          {line.sign === "credit" ? <ArrowUp size={12} aria-hidden /> : <ArrowDown size={12} aria-hidden />}
                          {ledgerSignLabel(line.sign)}
                        </span>
                      </td>
                      <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(line.sign)}`}>
                        {formatSignedLedgerAmount(line.signedAmount)}
                      </td>
                      <td
                        className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(
                          getLedgerSign(line.runningBalance),
                        )}`}
                      >
                        {formatSignedLedgerAmount(line.runningBalance)}
                      </td>
                      <td className="mss-ledger-cell-details">{details || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Closing balance</td>
                  <td
                    className={`mss-sites-analytics-table-num ${ledgerAmountClassName(netSign)}`}
                    colSpan={2}
                  >
                    {formatSignedLedgerAmount(summary.netMssReceivable)}
                  </td>
                  <td>{netBalanceLabel(summary.netMssReceivable)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      <section className="mss-sites-analytics-panel" id="analytics-partners">
        <header className="mss-sites-analytics-panel-header">
          <Wallet size={18} aria-hidden />
          <div>
            <h2 className="mss-sites-analytics-panel-title">MSS receivable by partner</h2>
            <p className="mss-sites-analytics-panel-subtitle">
              Due from clients plus net partner advances MSS will recover
            </p>
          </div>
        </header>

        {analytics.byProjectType.length === 0 ? (
          <div className="mss-analytics-empty">
            <p className="mss-analytics-empty-title">No partners in view</p>
            <p className="mss-analytics-empty-text">Clear filters or pick a project type to see partner balances.</p>
          </div>
        ) : (
          <div className="mss-sites-analytics-table-wrap">
            <table className="mss-sites-analytics-table mss-sites-analytics-table--partners">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th className="mss-sites-analytics-table-num">Sites</th>
                  <th className="mss-sites-analytics-table-num">Due from clients</th>
                  <th className="mss-sites-analytics-table-num">Partner advances</th>
                  <th className="mss-sites-analytics-table-num">Net MSS receivable</th>
                </tr>
              </thead>
              <tbody>
                {analytics.byProjectType.map((entry) => {
                  const netSignForRow = signedSign(entry.netMssReceivable);
                  const hasActivity =
                    entry.netMssReceivable !== 0 || entry.partnerAdvancesRecoverable !== 0;

                  return (
                    <tr key={entry.projectType} className={hasActivity ? "mss-partner-row--active" : undefined}>
                      <td className="mss-ledger-cell-partner">{entry.projectType}</td>
                      <td className="mss-sites-analytics-table-num">{entry.count}</td>
                      <SignedAmount
                        amount={entry.dueFromClients}
                        sign={signedSign(entry.dueFromClients)}
                        dashWhenZero
                      />
                      <SignedAmount
                        amount={entry.partnerAdvancesRecoverable}
                        sign={signedSign(entry.partnerAdvancesRecoverable)}
                        dashWhenZero
                      />
                      <SignedAmount amount={entry.netMssReceivable} sign={netSignForRow} emphasis dashWhenZero />
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td className="mss-sites-analytics-table-num">{summary.sitesByVendor.total}</td>
                  <td
                    className={`mss-sites-analytics-table-num ${ledgerAmountClassName(signedSign(partnerTotals.dueFromClients))}`}
                  >
                    {formatSignedLedgerAmount(partnerTotals.dueFromClients)}
                  </td>
                  <td
                    className={`mss-sites-analytics-table-num ${ledgerAmountClassName(signedSign(partnerTotals.partnerAdvances))}`}
                  >
                    {formatSignedLedgerAmount(partnerTotals.partnerAdvances)}
                  </td>
                  <td
                    className={`mss-sites-analytics-table-num ${ledgerAmountClassName(signedSign(partnerTotals.net))}`}
                  >
                    {formatSignedLedgerAmount(partnerTotals.net)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
