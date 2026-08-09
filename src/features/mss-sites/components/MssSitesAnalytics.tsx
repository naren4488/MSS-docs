import { useMemo, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Building2, Handshake, Info, Sigma, Wallet } from "lucide-react";
import { AjaySubVendorLedgers } from "./AjaySubVendorLedgers";
import {
  AJAY_EVEREST_BILLS_SUMMARY,
  AJAY_MONEY_LEDGER_SUMMARY,
} from "../lib/ajay-sub-vendor-ledger";
import {
  computeProjectAnalytics,
  formatSignedLedgerAmount,
  getLedgerSign,
  ledgerAmountClassName,
  ledgerSignLabel,
  netBalanceLabel,
  type LedgerSign,
  type ProjectAnalyticsSummary,
  type VendorBreakdown,
} from "../lib/compute-project-analytics";
import { VENDOR_COLUMN_INDEX, WORK_STATUS_COLUMN_INDEX, normalizeWorkStatus, parseProjectAmount, PROJECT_TYPE_COLUMN_INDEX } from "../lib/projects-columns";
import { PROJECT_VENDORS, type ProjectsScope } from "../lib/projects-config";

interface MssSitesAnalyticsProps {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  totalRowCount?: number;
  scope?: ProjectsScope;
}

const OUR_ANALYTICS_SECTIONS = [{ id: "analytics-overview", label: "Overview" }] as const;

const PARTNER_ANALYTICS_SECTIONS = [
  { id: "analytics-overview", label: "Overview" },
  { id: "analytics-ledger", label: "Partner ledger" },
  { id: "analytics-partners", label: "By partner" },
] as const;

const AJAY_ANALYTICS_SECTIONS = [
  { id: "analytics-overview", label: "Overview" },
  { id: "analytics-subvendor", label: "Sub Vendor ledgers" },
] as const;

function AnalyticsInfoBanner({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mss-analytics-info-banner" role="note">
      <Info size={16} className="mss-analytics-info-banner-icon" aria-hidden />
      <div>
        <p className="mss-analytics-info-banner-title">{title}</p>
        <div className="mss-analytics-info-banner-text">{children}</div>
      </div>
    </div>
  );
}

function WorkStatusByVendor({ rows }: { rows: readonly (readonly string[])[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, Map<string, number>>();

    for (const row of rows) {
      const vendor = row[VENDOR_COLUMN_INDEX]?.trim() || "Unknown";
      const status = normalizeWorkStatus(row[WORK_STATUS_COLUMN_INDEX] ?? "");
      const vendorMap = map.get(vendor) ?? new Map<string, number>();
      vendorMap.set(status, (vendorMap.get(status) ?? 0) + 1);
      map.set(vendor, vendorMap);
    }

    return [...map.entries()].sort(([left], [right]) => left.localeCompare(right));
  }, [rows]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="mss-analytics-status-by-vendor">
      {groups.map(([vendor, counts]) => (
        <article key={vendor} className="mss-analytics-status-vendor-card">
          <p className="mss-analytics-status-vendor-title">{vendor}</p>
          <ul className="mss-analytics-status-breakdown-list">
            {[...counts.entries()]
              .sort((left, right) => right[1] - left[1])
              .map(([status, count]) => (
                <li key={status}>
                  <span className="mss-analytics-status-breakdown-label">{status}</span>
                  <span className="mss-analytics-status-breakdown-count">{count}</span>
                </li>
              ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function AjayOverviewDetails({
  headers,
  rows,
  summary,
}: {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  summary: ProjectAnalyticsSummary;
}) {
  const details = useMemo(() => {
    const netDueIndex = headers.indexOf("Total Due to MSS");
    const paymentReceivedIndex = headers.indexOf("TOTAL Payment recieved");
    const registerMss = summary.totalDueToMssByVendor.mss;
    const registerArk = summary.totalDueToMssByVendor.arkshakti;
    const moneyLedger = AJAY_MONEY_LEDGER_SUMMARY.closingBalance;
    const everestBills = AJAY_EVEREST_BILLS_SUMMARY.closingBalance;
    const finalSum = registerMss + registerArk + moneyLedger + everestBills;

    const netDueCounts = {
      mss: { credit: 0, debit: 0, settled: 0 },
      arkshakti: { credit: 0, debit: 0, settled: 0 },
    } satisfies Record<keyof Omit<VendorBreakdown, "total">, { credit: number; debit: number; settled: number }>;

    const paymentReceived: VendorBreakdown = { mss: 0, arkshakti: 0, total: 0 };

    for (const row of rows) {
      const vendor = row[VENDOR_COLUMN_INDEX]?.trim();
      const vendorKey =
        vendor === PROJECT_VENDORS.MSS ? "mss" : vendor === PROJECT_VENDORS.ARKSHAKTI ? "arkshakti" : null;

      if (netDueIndex >= 0 && vendorKey) {
        const netDue = parseProjectAmount(row[netDueIndex] ?? "");
        if (netDue > 0) {
          netDueCounts[vendorKey].credit += 1;
        } else if (netDue < 0) {
          netDueCounts[vendorKey].debit += 1;
        } else {
          netDueCounts[vendorKey].settled += 1;
        }
      }

      if (paymentReceivedIndex >= 0 && vendorKey) {
        const amount = parseProjectAmount(row[paymentReceivedIndex] ?? "");
        paymentReceived[vendorKey] += amount;
        paymentReceived.total += amount;
      }
    }

    return {
      registerMss,
      registerArk,
      moneyLedger,
      everestBills,
      finalSum,
      netDueCounts,
      paymentReceived,
    };
  }, [headers, rows, summary.totalDueToMssByVendor.arkshakti, summary.totalDueToMssByVendor.mss]);

  const finalSign = getLedgerSign(details.finalSum);

  return (
    <div className="mss-analytics-ajay-overview">
      <div className="mss-analytics-ajay-overview-grid">
        <article className="mss-analytics-ajay-detail-card">
          <p className="mss-analytics-ajay-detail-title">Register snapshot</p>
          <dl className="mss-analytics-ajay-detail-list">
            <div>
              <dt>{PROJECT_VENDORS.MSS} pipeline</dt>
              <dd>{summary.sitesByVendor.mss} sites</dd>
            </div>
            <div>
              <dt>{PROJECT_VENDORS.ARKSHAKTI} backlog</dt>
              <dd>{summary.sitesByVendor.arkshakti} sites</dd>
            </div>
            <div>
              <dt>Payments logged</dt>
              <dd>{formatSignedLedgerAmount(details.paymentReceived.total)}</dd>
            </div>
            <div>
              <dt>{PROJECT_VENDORS.MSS} payments</dt>
              <dd>{formatSignedLedgerAmount(details.paymentReceived.mss)}</dd>
            </div>
            <div>
              <dt>{PROJECT_VENDORS.ARKSHAKTI} payments</dt>
              <dd>{formatSignedLedgerAmount(details.paymentReceived.arkshakti)}</dd>
            </div>
          </dl>
        </article>

        <article className="mss-analytics-ajay-detail-card">
          <p className="mss-analytics-ajay-detail-title">Net due mix by register</p>
          <p className="mss-analytics-ajay-detail-note">
            Counts sites by sign of <strong>Net due to MSS</strong> on each row.
          </p>
          <div className="mss-analytics-ajay-netdue-grid">
            {[PROJECT_VENDORS.MSS, PROJECT_VENDORS.ARKSHAKTI].map((vendor) => {
              const key = vendor === PROJECT_VENDORS.MSS ? "mss" : "arkshakti";
              const counts = details.netDueCounts[key];
              return (
                <div key={vendor} className="mss-analytics-ajay-netdue-group">
                  <p className="mss-analytics-ajay-netdue-vendor">{vendor}</p>
                  <ul>
                    <li>
                      <span>MSS will receive</span>
                      <strong>{counts.credit}</strong>
                    </li>
                    <li>
                      <span>Surplus / return</span>
                      <strong>{counts.debit}</strong>
                    </li>
                    <li>
                      <span>Settled / zero</span>
                      <strong>{counts.settled}</strong>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      <div className="mss-analytics-ajay-sum-breakdown">
        <p className="mss-analytics-ajay-detail-title">How the final sum is built</p>
        <div className="mss-sites-analytics-table-wrap">
          <table className="mss-sites-analytics-table mss-sites-analytics-table--dues">
            <thead>
              <tr>
                <th>Component</th>
                <th className="mss-sites-analytics-table-num">Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Net due · {PROJECT_VENDORS.ARKSHAKTI}</th>
                <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(details.registerArk))}`}>
                  {formatSignedLedgerAmount(details.registerArk)}
                </td>
                <td>Completed / hold backlog register</td>
              </tr>
              <tr>
                <th scope="row">Net due · {PROJECT_VENDORS.MSS}</th>
                <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(details.registerMss))}`}>
                  {formatSignedLedgerAmount(details.registerMss)}
                </td>
                <td>Forward pipeline register</td>
              </tr>
              <tr>
                <th scope="row">Sub Vendor · Money ledger</th>
                <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(details.moneyLedger))}`}>
                  {formatSignedLedgerAmount(details.moneyLedger)}
                </td>
                <td>Partner cash movements (PP / cash / NEFT)</td>
              </tr>
              <tr>
                <th scope="row">Sub Vendor · Everest bills</th>
                <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(details.everestBills))}`}>
                  {formatSignedLedgerAmount(details.everestBills)}
                </td>
                <td>MSE vendor invoices outstanding</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="mss-analytics-ajay-sum-row">
                <th scope="row">Final combined position</th>
                <td className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(finalSign)}`}>
                  {formatSignedLedgerAmount(details.finalSum)}
                </td>
                <td>{netBalanceLabel(details.finalSum)} across registers and ledgers</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <WorkStatusByVendor rows={rows} />
    </div>
  );
}

interface RegisterSlice {
  label: string;
  sites: number;
  netDue: number;
  cashDue: number;
  bankDue: number;
  paymentReceived: number;
}

function WorkStatusByProjectType({ rows }: { rows: readonly (readonly string[])[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, Map<string, number>>();

    for (const row of rows) {
      const projectType = row[PROJECT_TYPE_COLUMN_INDEX]?.trim() || "Unknown";
      const status = normalizeWorkStatus(row[WORK_STATUS_COLUMN_INDEX] ?? "");
      const typeMap = map.get(projectType) ?? new Map<string, number>();
      typeMap.set(status, (typeMap.get(status) ?? 0) + 1);
      map.set(projectType, typeMap);
    }

    return [...map.entries()].sort(([left], [right]) => left.localeCompare(right));
  }, [rows]);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="mss-analytics-status-by-vendor">
      {groups.map(([projectType, counts]) => (
        <article key={projectType} className="mss-analytics-status-vendor-card">
          <p className="mss-analytics-status-vendor-title">{projectType}</p>
          <ul className="mss-analytics-status-breakdown-list">
            {[...counts.entries()]
              .sort((left, right) => right[1] - left[1])
              .map(([status, count]) => (
                <li key={status}>
                  <span className="mss-analytics-status-breakdown-label">{status}</span>
                  <span className="mss-analytics-status-breakdown-count">{count}</span>
                </li>
              ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function OurOverviewDetails({
  headers,
  rows,
  summary,
}: {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  summary: ProjectAnalyticsSummary;
}) {
  const details = useMemo(() => {
    const netDueIndex = headers.indexOf("Total Due to MSS");
    const cashDueIndex = headers.indexOf("CASH DUE FROM CLIENT");
    const bankDueIndex = headers.indexOf("Bank due");
    const paymentReceivedIndex = headers.indexOf("TOTAL Payment recieved");

    const registers: Record<string, RegisterSlice> = {
      "MSS res · MSS": {
        label: `MSS res · ${PROJECT_VENDORS.MSS} workbook`,
        sites: 0,
        netDue: 0,
        cashDue: 0,
        bankDue: 0,
        paymentReceived: 0,
      },
      "MSS res · Ark": {
        label: `MSS res · ${PROJECT_VENDORS.ARKSHAKTI}`,
        sites: 0,
        netDue: 0,
        cashDue: 0,
        bankDue: 0,
        paymentReceived: 0,
      },
      "MSS COMMERCIAL": {
        label: "MSS COMMERCIAL · Arkshakti",
        sites: 0,
        netDue: 0,
        cashDue: 0,
        bankDue: 0,
        paymentReceived: 0,
      },
    };

    const netDueCounts = {
      mss: { credit: 0, debit: 0, settled: 0 },
      arkshakti: { credit: 0, debit: 0, settled: 0 },
    } satisfies Record<keyof Omit<VendorBreakdown, "total">, { credit: number; debit: number; settled: number }>;

    for (const row of rows) {
      const projectType = row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? "";
      const vendor = row[VENDOR_COLUMN_INDEX]?.trim() ?? "";
      const registerKey =
        projectType === "MSS COMMERCIAL"
          ? "MSS COMMERCIAL"
          : projectType === "MSS res" && vendor === PROJECT_VENDORS.MSS
            ? "MSS res · MSS"
            : projectType === "MSS res"
              ? "MSS res · Ark"
              : null;

      if (registerKey) {
        const slice = registers[registerKey];
        slice.sites += 1;
        if (netDueIndex >= 0) {
          slice.netDue += parseProjectAmount(row[netDueIndex] ?? "");
        }
        if (cashDueIndex >= 0) {
          slice.cashDue += parseProjectAmount(row[cashDueIndex] ?? "");
        }
        if (bankDueIndex >= 0) {
          slice.bankDue += parseProjectAmount(row[bankDueIndex] ?? "");
        }
        if (paymentReceivedIndex >= 0) {
          slice.paymentReceived += parseProjectAmount(row[paymentReceivedIndex] ?? "");
        }
      }

      const vendorKey =
        vendor === PROJECT_VENDORS.MSS ? "mss" : vendor === PROJECT_VENDORS.ARKSHAKTI ? "arkshakti" : null;

      if (netDueIndex >= 0 && vendorKey) {
        const netDue = parseProjectAmount(row[netDueIndex] ?? "");
        if (netDue > 0) {
          netDueCounts[vendorKey].credit += 1;
        } else if (netDue < 0) {
          netDueCounts[vendorKey].debit += 1;
        } else {
          netDueCounts[vendorKey].settled += 1;
        }
      }
    }

    return {
      registers: Object.values(registers),
      netDueCounts,
    };
  }, [headers, rows]);

  const paymentTotal = details.registers.reduce((total, slice) => total + slice.paymentReceived, 0);
  const netDueSign = getLedgerSign(summary.totalDueToMss);

  return (
    <div className="mss-analytics-ajay-overview">
      <div className="mss-analytics-ajay-overview-grid">
        <article className="mss-analytics-ajay-detail-card">
          <p className="mss-analytics-ajay-detail-title">Register snapshot</p>
          <dl className="mss-analytics-ajay-detail-list">
            {details.registers.map((slice) => (
              <div key={slice.label}>
                <dt>{slice.label}</dt>
                <dd>
                  {slice.sites} site{slice.sites === 1 ? "" : "s"}
                </dd>
              </div>
            ))}
            <div>
              <dt>Payments logged (all registers)</dt>
              <dd>{formatSignedLedgerAmount(paymentTotal)}</dd>
            </div>
          </dl>
        </article>

        <article className="mss-analytics-ajay-detail-card">
          <p className="mss-analytics-ajay-detail-title">Net due mix by vendor</p>
          <p className="mss-analytics-ajay-detail-note">
            Sites grouped by sign of <strong>Net due to MSS</strong> on each row.
          </p>
          <div className="mss-analytics-ajay-netdue-grid">
            {[PROJECT_VENDORS.MSS, PROJECT_VENDORS.ARKSHAKTI].map((vendor) => {
              const key = vendor === PROJECT_VENDORS.MSS ? "mss" : "arkshakti";
              const counts = details.netDueCounts[key];
              return (
                <div key={vendor} className="mss-analytics-ajay-netdue-group">
                  <p className="mss-analytics-ajay-netdue-vendor">{vendor}</p>
                  <ul>
                    <li>
                      <span>MSS will receive</span>
                      <strong>{counts.credit}</strong>
                    </li>
                    <li>
                      <span>Surplus / return</span>
                      <strong>{counts.debit}</strong>
                    </li>
                    <li>
                      <span>Settled / zero</span>
                      <strong>{counts.settled}</strong>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      <div className="mss-analytics-ajay-sum-breakdown">
        <p className="mss-analytics-ajay-detail-title">Dues by register</p>
        <div className="mss-sites-analytics-table-wrap">
          <table className="mss-sites-analytics-table mss-sites-analytics-table--dues">
            <thead>
              <tr>
                <th>Register</th>
                <th className="mss-sites-analytics-table-num">Sites</th>
                <th className="mss-sites-analytics-table-num">Cash due from client</th>
                <th className="mss-sites-analytics-table-num">Bank due</th>
                <th className="mss-sites-analytics-table-num">Net due to MSS</th>
                <th className="mss-sites-analytics-table-num">Payments received</th>
              </tr>
            </thead>
            <tbody>
              {details.registers.map((slice) => (
                <tr key={slice.label}>
                  <th scope="row">{slice.label}</th>
                  <td className="mss-sites-analytics-table-num">{slice.sites}</td>
                  <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(slice.cashDue))}`}>
                    {formatSignedLedgerAmount(slice.cashDue)}
                  </td>
                  <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(slice.bankDue))}`}>
                    {formatSignedLedgerAmount(slice.bankDue)}
                  </td>
                  <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(slice.netDue))}`}>
                    {formatSignedLedgerAmount(slice.netDue)}
                  </td>
                  <td className="mss-sites-analytics-table-num">{formatSignedLedgerAmount(slice.paymentReceived)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="mss-analytics-ajay-sum-row">
                <th scope="row">Combined</th>
                <td className="mss-sites-analytics-table-num">{summary.sitesByVendor.total}</td>
                <td
                  className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(summary.totalCashDueFromClient))}`}
                >
                  {formatSignedLedgerAmount(summary.totalCashDueFromClient)}
                </td>
                <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(summary.totalBankDue))}`}>
                  {formatSignedLedgerAmount(summary.totalBankDue)}
                </td>
                <td className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(netDueSign)}`}>
                  {formatSignedLedgerAmount(summary.totalDueToMss)}
                </td>
                <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                  {formatSignedLedgerAmount(paymentTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <WorkStatusByProjectType rows={rows} />
    </div>
  );
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

export function MssSitesAnalytics({
  headers,
  rows,
  totalRowCount,
  scope = "partner",
}: MssSitesAnalyticsProps) {
  const showPartnerMetrics = scope === "partner" || scope === "shripal" || scope === "ajay";
  const isAjayScope = scope === "ajay";
  const isOurScope = scope === "our";
  const analyticsSections = isAjayScope
    ? AJAY_ANALYTICS_SECTIONS
    : showPartnerMetrics
      ? PARTNER_ANALYTICS_SECTIONS
      : OUR_ANALYTICS_SECTIONS;
  const analytics = useMemo(() => computeProjectAnalytics(headers, rows), [headers, rows]);
  const { summary } = analytics;
  const netSign = getLedgerSign(summary.netMssReceivable);
  const moneyLedgerSign = getLedgerSign(AJAY_MONEY_LEDGER_SUMMARY.closingBalance);
  const isFiltered = totalRowCount !== undefined && totalRowCount !== rows.length;

  const ajayHeroMetrics = useMemo(() => {
    if (!isAjayScope) {
      return null;
    }

    const registerMss = summary.totalDueToMssByVendor.mss;
    const registerArk = summary.totalDueToMssByVendor.arkshakti;
    const moneyLedger = AJAY_MONEY_LEDGER_SUMMARY.closingBalance;
    const everestBills = AJAY_EVEREST_BILLS_SUMMARY.closingBalance;
    const finalSum = registerMss + registerArk + moneyLedger + everestBills;

    return {
      registerMss,
      registerArk,
      moneyLedger,
      everestBills,
      finalSum,
      registerMssSign: getLedgerSign(registerMss),
      registerArkSign: getLedgerSign(registerArk),
      finalSumSign: getLedgerSign(finalSum),
    };
  }, [isAjayScope, summary.totalDueToMssByVendor.arkshakti, summary.totalDueToMssByVendor.mss]);

  const ourHeroMetrics = useMemo(() => {
    if (!isOurScope) {
      return null;
    }

    const paymentReceivedIndex = headers.indexOf("TOTAL Payment recieved");
    let paymentReceivedTotal = 0;
    let mssResSites = 0;
    let commercialSites = 0;

    for (const row of rows) {
      const projectType = row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? "";
      if (projectType === "MSS res") {
        mssResSites += 1;
      } else if (projectType === "MSS COMMERCIAL") {
        commercialSites += 1;
      }
      if (paymentReceivedIndex >= 0) {
        paymentReceivedTotal += parseProjectAmount(row[paymentReceivedIndex] ?? "");
      }
    }

    return {
      netDueMss: summary.totalDueToMssByVendor.mss,
      netDueArk: summary.totalDueToMssByVendor.arkshakti,
      netDueTotal: summary.totalDueToMss,
      cashDue: summary.totalCashDueFromClient,
      bankDue: summary.totalBankDue,
      paymentReceivedTotal,
      mssResSites,
      commercialSites,
      netDueMssSign: getLedgerSign(summary.totalDueToMssByVendor.mss),
      netDueArkSign: getLedgerSign(summary.totalDueToMssByVendor.arkshakti),
      netDueTotalSign: getLedgerSign(summary.totalDueToMss),
    };
  }, [
    headers,
    isOurScope,
    rows,
    summary.totalBankDue,
    summary.totalCashDueFromClient,
    summary.totalDueToMss,
    summary.totalDueToMssByVendor.arkshakti,
    summary.totalDueToMssByVendor.mss,
  ]);

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

  const registerLabel =
    scope === "our" ? "register" : scope === "shripal" ? "Shripal register" : scope === "ajay" ? "Ajay register" : "partner tab";
  const summaryTitle =
    scope === "our"
      ? "Our projects summary"
      : scope === "shripal"
        ? "Shripal sites summary"
        : scope === "ajay"
          ? "Ajay sites summary"
          : "Partner projects summary";

  return (
    <div id="mss-sites-analytics" className="mss-sites-analytics">
      <header className="mss-analytics-top">
        <div className="mss-analytics-top-copy">
          <p className="mss-analytics-eyebrow">Projects analytics</p>
          <h1 className="mss-analytics-title">{summaryTitle}</h1>
          <p className="mss-analytics-subtitle">
            {rows.length} site{rows.length === 1 ? "" : "s"}
            {isFiltered ? ` of ${totalRowCount} total` : ""}
            {analytics.byProjectType.length > 0
              ? ` · ${analytics.byProjectType.length} ${registerLabel}${analytics.byProjectType.length === 1 ? "" : "s"}`
              : ""}
          </p>
          {isOurScope ? (
            <p className="mss-analytics-print-meta">
              Our projects analytics · {rows.length} site{rows.length === 1 ? "" : "s"}
              {isFiltered ? ` (filtered from ${totalRowCount})` : ""} · Generated{" "}
              {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          ) : null}
        </div>

        <nav className="mss-analytics-nav no-print" aria-label="Analytics sections">
          {analyticsSections.map((section) => (
            <a key={section.id} className="mss-analytics-nav-link" href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      {isFiltered ? (
        <AnalyticsInfoBanner title="Filtered view">
          Analytics below reflect your current table filters ({rows.length} of {totalRowCount} sites).
        </AnalyticsInfoBanner>
      ) : null}

      {isAjayScope ? (
        <AnalyticsInfoBanner title="Two registers, one partner">
          <strong>MSS</strong> rows are the forward pipeline (new sites).{" "}
          <strong>Arkshakti</strong> rows are the completed / hold backlog. Sub Vendor Payment ledgers
          (money + Everest bills) track cash separately from the site register.
        </AnalyticsInfoBanner>
      ) : null}

      {isOurScope ? (
        <AnalyticsInfoBanner title="Three registers, our sites">
          <strong>MSS res</strong> appears on both workbooks ({PROJECT_VENDORS.MSS} pipeline +{" "}
          {PROJECT_VENDORS.ARKSHAKTI} backlog). <strong>MSS COMMERCIAL</strong> is Arkshakti-only. Cash
          due, bank due, and net due to MSS come from each site row on the register.
        </AnalyticsInfoBanner>
      ) : null}

      <section
        className={`mss-analytics-hero${isAjayScope || isOurScope ? " mss-analytics-hero--ajay" : ""}`}
        aria-label="Key metrics"
      >
        {isAjayScope && ajayHeroMetrics ? (
          <>
            <article className="mss-analytics-hero-card">
              <p className="mss-analytics-hero-label">Total sites</p>
              <p className="mss-analytics-hero-value">{summary.sitesByVendor.total}</p>
              <p className="mss-analytics-hero-hint">
                {PROJECT_VENDORS.MSS} {summary.sitesByVendor.mss} · {PROJECT_VENDORS.ARKSHAKTI}{" "}
                {summary.sitesByVendor.arkshakti}
              </p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${ajayHeroMetrics.registerArkSign}`}
            >
              <p className="mss-analytics-hero-label">Net due · {PROJECT_VENDORS.ARKSHAKTI}</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ajayHeroMetrics.registerArkSign)}`}>
                {formatSignedLedgerAmount(ajayHeroMetrics.registerArk)}
              </p>
              <p className="mss-analytics-hero-hint">Completed / hold backlog register</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${ajayHeroMetrics.registerMssSign}`}
            >
              <p className="mss-analytics-hero-label">Net due · {PROJECT_VENDORS.MSS}</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ajayHeroMetrics.registerMssSign)}`}>
                {formatSignedLedgerAmount(ajayHeroMetrics.registerMss)}
              </p>
              <p className="mss-analytics-hero-hint">Forward pipeline register</p>
            </article>
            <article className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${moneyLedgerSign}`}>
              <p className="mss-analytics-hero-label">Sub Vendor · Money ledger</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(moneyLedgerSign)}`}>
                {formatSignedLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.closingBalance)}
              </p>
              <p className="mss-analytics-hero-hint">
                DR {formatSignedLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalDr)} out · CR{" "}
                {formatSignedLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalCr)} in
              </p>
            </article>
            <article className="mss-analytics-hero-card mss-analytics-hero-card--balance-debit">
              <p className="mss-analytics-hero-label">Sub Vendor · Everest bills</p>
              <p className="mss-analytics-hero-value mss-ledger-amount--debit">
                {formatSignedLedgerAmount(AJAY_EVEREST_BILLS_SUMMARY.closingBalance)}
              </p>
              <p className="mss-analytics-hero-hint">MSE vendor invoices outstanding</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--final mss-analytics-hero-card--balance-${ajayHeroMetrics.finalSumSign}`}
            >
              <p className="mss-analytics-hero-label">
                <Sigma size={14} aria-hidden /> Final sum
              </p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ajayHeroMetrics.finalSumSign)}`}>
                {formatSignedLedgerAmount(ajayHeroMetrics.finalSum)}
              </p>
              <p className="mss-analytics-hero-hint">
                Both registers + money ledger + Everest bills · {netBalanceLabel(ajayHeroMetrics.finalSum)}
              </p>
            </article>
          </>
        ) : isOurScope && ourHeroMetrics ? (
          <>
            <article className="mss-analytics-hero-card">
              <p className="mss-analytics-hero-label">Total sites</p>
              <p className="mss-analytics-hero-value">{summary.sitesByVendor.total}</p>
              <p className="mss-analytics-hero-hint">
                MSS res {ourHeroMetrics.mssResSites} · Commercial {ourHeroMetrics.commercialSites}
              </p>
              <p className="mss-analytics-hero-hint">
                {PROJECT_VENDORS.MSS} {summary.sitesByVendor.mss} · {PROJECT_VENDORS.ARKSHAKTI}{" "}
                {summary.sitesByVendor.arkshakti}
              </p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${ourHeroMetrics.netDueMssSign}`}
            >
              <p className="mss-analytics-hero-label">Net due · {PROJECT_VENDORS.MSS}</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ourHeroMetrics.netDueMssSign)}`}>
                {formatSignedLedgerAmount(ourHeroMetrics.netDueMss)}
              </p>
              <p className="mss-analytics-hero-hint">MSS res pipeline register</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${ourHeroMetrics.netDueArkSign}`}
            >
              <p className="mss-analytics-hero-label">Net due · {PROJECT_VENDORS.ARKSHAKTI}</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ourHeroMetrics.netDueArkSign)}`}>
                {formatSignedLedgerAmount(ourHeroMetrics.netDueArk)}
              </p>
              <p className="mss-analytics-hero-hint">MSS res backlog + MSS COMMERCIAL</p>
            </article>
            <article className="mss-analytics-hero-card">
              <p className="mss-analytics-hero-label">Payments received</p>
              <p className="mss-analytics-hero-value">{formatSignedLedgerAmount(ourHeroMetrics.paymentReceivedTotal)}</p>
              <p className="mss-analytics-hero-hint">Loan / cash installments logged on register</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--client-dues mss-analytics-hero-card--balance-${ourHeroMetrics.netDueTotalSign}`}
            >
              <p className="mss-analytics-hero-label">Due from clients</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ourHeroMetrics.netDueTotalSign)}`}>
                {formatSignedLedgerAmount(ourHeroMetrics.netDueTotal)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Net due to MSS</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>Cash due from client</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(ourHeroMetrics.cashDue))}>
                    {formatSignedLedgerAmount(ourHeroMetrics.cashDue)}
                  </dd>
                </div>
                <div>
                  <dt>Bank due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(ourHeroMetrics.bankDue))}>
                    {formatSignedLedgerAmount(ourHeroMetrics.bankDue)}
                  </dd>
                </div>
              </dl>
            </article>
          </>
        ) : (
          <>
            <article className="mss-analytics-hero-card">
              <p className="mss-analytics-hero-label">Total sites</p>
              <p className="mss-analytics-hero-value">{summary.sitesByVendor.total}</p>
              <p className="mss-analytics-hero-hint">
                {summary.sitesByVendor.mss > 0 || summary.sitesByVendor.arkshakti > 0
                  ? `${PROJECT_VENDORS.MSS} ${summary.sitesByVendor.mss} · ${PROJECT_VENDORS.ARKSHAKTI} ${summary.sitesByVendor.arkshakti}`
                  : "Filtered project rows"}
              </p>
            </article>
            <article className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${netSign}`}>
              <p className="mss-analytics-hero-label">Net MSS receivable</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(netSign)}`}>
                {formatSignedLedgerAmount(summary.netMssReceivable)}
              </p>
              <p className="mss-analytics-hero-hint">{netBalanceLabel(summary.netMssReceivable)}</p>
            </article>
          </>
        )}
      </section>

      <div className={`mss-analytics-grid${isAjayScope || isOurScope ? " mss-analytics-grid--single" : ""}`}>
        <section
          className={`mss-sites-analytics-panel${isAjayScope || isOurScope ? " mss-sites-analytics-panel--full" : ""}`}
          id="analytics-overview"
        >
          <header className="mss-sites-analytics-panel-header">
            <Building2 size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">Overview</h2>
              <p className="mss-sites-analytics-panel-subtitle">
                {isAjayScope
                  ? "Register split, payment activity, net-due mix, and how the final sum is built"
                  : isOurScope
                    ? "Residential + commercial registers, client dues, payments, and work status"
                    : "Site count split by data source"}
              </p>
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
          {isAjayScope ? <AjayOverviewDetails headers={headers} rows={rows} summary={summary} /> : null}
          {isOurScope ? <OurOverviewDetails headers={headers} rows={rows} summary={summary} /> : null}
        </section>
      </div>

      {isAjayScope ? (
        <section
          className="mss-sites-analytics-panel mss-sites-analytics-panel--full"
          id="analytics-subvendor"
        >
          <header className="mss-sites-analytics-panel-header">
            <Wallet size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">Sub Vendor Payment ledgers</h2>
              <p className="mss-sites-analytics-panel-subtitle">
                Live balances from the <strong>Ajay</strong> tab — money movements and Everest Solar
                vendor invoices
              </p>
            </div>
          </header>
          <AjaySubVendorLedgers />
        </section>
      ) : null}

      {showPartnerMetrics && !isAjayScope ? (
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
      ) : null}

      {showPartnerMetrics && !isAjayScope ? (
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
      ) : null}
    </div>
  );
}
