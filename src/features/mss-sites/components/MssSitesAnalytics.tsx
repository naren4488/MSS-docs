import { useMemo, type ReactNode } from "react";
import { Building2, Info, Sigma, Wallet } from "lucide-react";
import { AjaySubVendorLedgers } from "./AjaySubVendorLedgers";
import { SatyanarayanSubVendorLedger } from "./SatyanarayanSubVendorLedger";
import { ShripalCashBankLedger } from "./ShripalCashBankLedger";
import {
  AJAY_EVEREST_BILLS_SUMMARY,
  AJAY_MONEY_LEDGER_SUMMARY,
} from "../lib/ajay-sub-vendor-ledger";
import { SATYANARAYAN_LEDGER_SUMMARY } from "../lib/satyanarayan-sub-vendor-ledger";
import { SHRIPAL_CASH_BANK_LEDGER_SUMMARY } from "../lib/shripal-cash-bank-ledger";
import {
  computeProjectAnalytics,
  formatSignedLedgerAmount,
  getLedgerSign,
  ledgerAmountClassName,
  netBalanceLabel,
  type LedgerSign,
  type ProjectAnalyticsSummary,
  type ProjectTypeLedgerSummary,
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

const SHRIPAL_ANALYTICS_SECTIONS = [
  { id: "analytics-overview", label: "Overview" },
  { id: "analytics-shripal-ledger", label: "Cash / Bank ledger" },
] as const;

const PARTNER_ANALYTICS_SECTIONS = [
  { id: "analytics-overview", label: "Overview" },
  { id: "analytics-partners", label: "By partner" },
] as const;

const AJAY_ANALYTICS_SECTIONS = [
  { id: "analytics-overview", label: "Overview" },
  { id: "analytics-subvendor", label: "Sub Vendor ledgers" },
] as const;

const SATYANARAYAN_ANALYTICS_SECTIONS = [
  { id: "analytics-overview", label: "Overview" },
  { id: "analytics-satyanarayan", label: "Sub Vendor ledger" },
] as const;

const RJGREEN_ANALYTICS_SECTIONS = [{ id: "analytics-overview", label: "Overview" }] as const;

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
                      <span>We will receive</span>
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
                      <span>We will receive</span>
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

interface ShripalVendorSlice {
  label: string;
  sites: number;
  netDue: number;
  cashDue: number;
  bankDue: number;
  paymentReceived: number;
  paymentWithPartner: number;
}

function ShripalOverviewDetails({
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
    const paymentWithPartnerIndex = headers.indexOf("Payment with partner");

    const vendors: Record<"mss" | "arkshakti", ShripalVendorSlice> = {
      mss: {
        label: `${PROJECT_VENDORS.MSS} workbook`,
        sites: 0,
        netDue: 0,
        cashDue: 0,
        bankDue: 0,
        paymentReceived: 0,
        paymentWithPartner: 0,
      },
      arkshakti: {
        label: PROJECT_VENDORS.ARKSHAKTI,
        sites: 0,
        netDue: 0,
        cashDue: 0,
        bankDue: 0,
        paymentReceived: 0,
        paymentWithPartner: 0,
      },
    };

    const netDueCounts = {
      mss: { credit: 0, debit: 0, settled: 0 },
      arkshakti: { credit: 0, debit: 0, settled: 0 },
    } satisfies Record<"mss" | "arkshakti", { credit: number; debit: number; settled: number }>;

    for (const row of rows) {
      const vendor = row[VENDOR_COLUMN_INDEX]?.trim() ?? "";
      const vendorKey =
        vendor === PROJECT_VENDORS.MSS ? "mss" : vendor === PROJECT_VENDORS.ARKSHAKTI ? "arkshakti" : null;
      if (!vendorKey) {
        continue;
      }

      const slice = vendors[vendorKey];
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
      if (paymentWithPartnerIndex >= 0) {
        slice.paymentWithPartner += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
      }

      if (netDueIndex >= 0) {
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
      vendors: Object.values(vendors),
      netDueCounts,
      paymentWithPartnerTotal: vendors.mss.paymentWithPartner + vendors.arkshakti.paymentWithPartner,
    };
  }, [headers, rows]);

  const paymentTotal = details.vendors.reduce((total, slice) => total + slice.paymentReceived, 0);
  const netDueSign = getLedgerSign(summary.totalDueToMss);

  return (
    <div className="mss-analytics-ajay-overview">
      <div className="mss-analytics-ajay-overview-grid">
        <article className="mss-analytics-ajay-detail-card">
          <p className="mss-analytics-ajay-detail-title">Register snapshot</p>
          <dl className="mss-analytics-ajay-detail-list">
            {details.vendors.map((slice) => (
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
                      <span>We will receive</span>
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
        <p className="mss-analytics-ajay-detail-title">Dues by vendor register</p>
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
                <th className="mss-sites-analytics-table-num">Payment with partner</th>
              </tr>
            </thead>
            <tbody>
              {details.vendors.map((slice) => (
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
                  <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(slice.paymentWithPartner))}`}>
                    {formatSignedLedgerAmount(slice.paymentWithPartner)}
                  </td>
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
                <td
                  className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(getLedgerSign(details.paymentWithPartnerTotal))}`}
                >
                  {formatSignedLedgerAmount(details.paymentWithPartnerTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <WorkStatusByVendor rows={rows} />
    </div>
  );
}

function PartnerOverviewDetails({
  headers,
  rows,
  summary,
  byProjectType,
}: {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  summary: ProjectAnalyticsSummary;
  byProjectType: readonly ProjectTypeLedgerSummary[];
}) {
  const details = useMemo(() => {
    const paymentReceivedIndex = headers.indexOf("TOTAL Payment recieved");
    const paymentWithPartnerIndex = headers.indexOf("Payment with partner");
    const finalDealIndex = headers.indexOf("FINAL DEAL with client");
    const dealWithMssIndex = headers.indexOf("Deal with MSS");

    let paymentReceived = 0;
    let paymentWithPartner = 0;

    for (const row of rows) {
      if (paymentReceivedIndex >= 0) {
        paymentReceived += parseProjectAmount(row[paymentReceivedIndex] ?? "");
      }
      if (paymentWithPartnerIndex >= 0) {
        paymentWithPartner += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
      }
    }

    const dealRows = byProjectType.map((entry) => {
      let finalDeal = 0;
      let dealWithMss = 0;
      let partnerPay = 0;
      let received = 0;
      for (const row of rows) {
        if ((row[PROJECT_TYPE_COLUMN_INDEX]?.trim() ?? "") !== entry.projectType) {
          continue;
        }
        if (finalDealIndex >= 0) {
          finalDeal += parseProjectAmount(row[finalDealIndex] ?? "");
        }
        if (dealWithMssIndex >= 0) {
          dealWithMss += parseProjectAmount(row[dealWithMssIndex] ?? "");
        }
        if (paymentWithPartnerIndex >= 0) {
          partnerPay += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
        }
        if (paymentReceivedIndex >= 0) {
          received += parseProjectAmount(row[paymentReceivedIndex] ?? "");
        }
      }
      return {
        ...entry,
        finalDeal,
        dealWithMss,
        partnerProfit: finalDeal - dealWithMss,
        paymentWithPartner: partnerPay,
        paymentReceived: received,
      };
    });

    return { paymentReceived, paymentWithPartner, dealRows };
  }, [byProjectType, headers, rows]);

  return (
    <div className="mss-analytics-ajay-overview">
      <div className="mss-analytics-ajay-overview-grid">
        <article className="mss-analytics-ajay-detail-card">
          <p className="mss-analytics-ajay-detail-title">Portfolio snapshot</p>
          <dl className="mss-analytics-ajay-detail-list">
            <div>
              <dt>Partners in view</dt>
              <dd>{byProjectType.length}</dd>
            </div>
            <div>
              <dt>Sites</dt>
              <dd>{summary.sitesByVendor.total}</dd>
            </div>
            <div>
              <dt>Payments logged</dt>
              <dd>{formatSignedLedgerAmount(details.paymentReceived)}</dd>
            </div>
            <div>
              <dt>Payment with partner</dt>
              <dd>{formatSignedLedgerAmount(details.paymentWithPartner)}</dd>
            </div>
          </dl>
        </article>

        <article className="mss-analytics-ajay-detail-card mss-analytics-deal-overview-card">
          <p className="mss-analytics-ajay-detail-title">Partner deal vs MSS</p>
          <p className="mss-analytics-ajay-detail-note">
            Client billing minus <strong>Deal with MSS</strong> is the partner margin on these registers.
          </p>
          <div className="mss-analytics-deal-equation mss-analytics-deal-equation--compact" aria-label="Deal equation">
            <div className="mss-analytics-deal-equation-term">
              <p className="mss-analytics-deal-equation-label">Final deal with client</p>
              <p className="mss-analytics-deal-equation-value">
                {formatSignedLedgerAmount(summary.totalFinalDealWithClient)}
              </p>
            </div>
            <span className="mss-analytics-deal-equation-op" aria-hidden>
              −
            </span>
            <div className="mss-analytics-deal-equation-term">
              <p className="mss-analytics-deal-equation-label">Deal with MSS</p>
              <p className="mss-analytics-deal-equation-value">
                {formatSignedLedgerAmount(summary.totalDealWithMss)}
              </p>
            </div>
            <span className="mss-analytics-deal-equation-op" aria-hidden>
              =
            </span>
            <div
              className={`mss-analytics-deal-equation-term mss-analytics-deal-equation-term--result mss-analytics-deal-equation-term--${getLedgerSign(summary.totalPartnerProfit)}`}
            >
              <p className="mss-analytics-deal-equation-label">Partner profit</p>
              <p
                className={`mss-analytics-deal-equation-value ${ledgerAmountClassName(getLedgerSign(summary.totalPartnerProfit))}`}
              >
                {formatSignedLedgerAmount(summary.totalPartnerProfit)}
              </p>
            </div>
          </div>
          <dl className="mss-analytics-ajay-detail-list mss-analytics-deal-overview-meta">
            <div>
              <dt>Net due to MSS (sites)</dt>
              <dd className={ledgerAmountClassName(getLedgerSign(summary.totalDueToMss))}>
                {formatSignedLedgerAmount(summary.totalDueToMss)}
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <div className="mss-analytics-ajay-sum-breakdown">
        <p className="mss-analytics-ajay-detail-title">Net due by vendor workbook</p>
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
                <td
                  className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(summary.totalDueToMssByVendor.arkshakti))}`}
                >
                  {formatSignedLedgerAmount(summary.totalDueToMssByVendor.arkshakti)}
                </td>
                <td>Partner registers on Arkshakti workbook</td>
              </tr>
              <tr>
                <th scope="row">Net due · {PROJECT_VENDORS.MSS}</th>
                <td
                  className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(summary.totalDueToMssByVendor.mss))}`}
                >
                  {formatSignedLedgerAmount(summary.totalDueToMssByVendor.mss)}
                </td>
                <td>Partner registers on MSS workbook</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="mss-analytics-ajay-sum-row">
                <th scope="row">Total due to MSS</th>
                <td
                  className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(getLedgerSign(summary.totalDueToMss))}`}
                >
                  {formatSignedLedgerAmount(summary.totalDueToMss)}
                </td>
                <td>{netBalanceLabel(summary.totalDueToMss)} across remaining partner registers</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mss-analytics-ajay-sum-breakdown">
        <p className="mss-analytics-ajay-detail-title">By partner register</p>
        <div className="mss-sites-analytics-table-wrap">
          <table className="mss-sites-analytics-table mss-sites-analytics-table--dues">
            <thead>
              <tr>
                <th>Partner</th>
                <th className="mss-sites-analytics-table-num">Sites</th>
                <th className="mss-sites-analytics-table-num">Final deal</th>
                <th className="mss-sites-analytics-table-num">Deal with MSS</th>
                <th className="mss-sites-analytics-table-num">Profit</th>
                <th className="mss-sites-analytics-table-num">Pay w/ partner</th>
                <th className="mss-sites-analytics-table-num">Net due</th>
              </tr>
            </thead>
            <tbody>
              {details.dealRows.map((row) => (
                <tr key={row.projectType}>
                  <th scope="row">{row.projectType}</th>
                  <td className="mss-sites-analytics-table-num">{row.count}</td>
                  <td className="mss-sites-analytics-table-num">{formatSignedLedgerAmount(row.finalDeal)}</td>
                  <td className="mss-sites-analytics-table-num">{formatSignedLedgerAmount(row.dealWithMss)}</td>
                  <td className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(row.partnerProfit))}`}>
                    {formatSignedLedgerAmount(row.partnerProfit)}
                  </td>
                  <td
                    className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(row.paymentWithPartner))}`}
                  >
                    {formatSignedLedgerAmount(row.paymentWithPartner)}
                  </td>
                  <td
                    className={`mss-sites-analytics-table-num ${ledgerAmountClassName(getLedgerSign(row.dueFromClients))}`}
                  >
                    {formatSignedLedgerAmount(row.dueFromClients)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="mss-analytics-ajay-sum-row">
                <th scope="row">Combined</th>
                <td className="mss-sites-analytics-table-num">{summary.sitesByVendor.total}</td>
                <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                  {formatSignedLedgerAmount(summary.totalFinalDealWithClient)}
                </td>
                <td className="mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis">
                  {formatSignedLedgerAmount(summary.totalDealWithMss)}
                </td>
                <td
                  className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(getLedgerSign(summary.totalPartnerProfit))}`}
                >
                  {formatSignedLedgerAmount(summary.totalPartnerProfit)}
                </td>
                <td
                  className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(getLedgerSign(details.paymentWithPartner))}`}
                >
                  {formatSignedLedgerAmount(details.paymentWithPartner)}
                </td>
                <td
                  className={`mss-sites-analytics-table-num mss-sites-analytics-table-num--emphasis ${ledgerAmountClassName(getLedgerSign(summary.totalDueToMss))}`}
                >
                  {formatSignedLedgerAmount(summary.totalDueToMss)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <WorkStatusByVendor rows={rows} />
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

export function MssSitesAnalytics({
  headers,
  rows,
  totalRowCount,
  scope = "partner",
}: MssSitesAnalyticsProps) {
  const isPartnerScope = scope === "partner";
  const isAjayScope = scope === "ajay";
  const isOurScope = scope === "our";
  const isShripalScope = scope === "shripal";
  const isSatyanarayanScope = scope === "satyanarayan";
  const isRjGreenScope = scope === "rjgreen";
  const isRegisterStyleScope = isOurScope || isShripalScope;
  const isPartnerStyleLayoutScope =
    isPartnerScope || isAjayScope || isSatyanarayanScope || isRjGreenScope;
  const analyticsSections = isAjayScope
    ? AJAY_ANALYTICS_SECTIONS
    : isShripalScope
      ? SHRIPAL_ANALYTICS_SECTIONS
      : isSatyanarayanScope
        ? SATYANARAYAN_ANALYTICS_SECTIONS
        : isRjGreenScope
          ? RJGREEN_ANALYTICS_SECTIONS
          : isOurScope
            ? OUR_ANALYTICS_SECTIONS
            : PARTNER_ANALYTICS_SECTIONS;
  const analytics = useMemo(() => computeProjectAnalytics(headers, rows), [headers, rows]);
  const { summary } = analytics;
  const netSign = getLedgerSign(summary.netMssReceivable);
  const moneyLedgerSign = getLedgerSign(AJAY_MONEY_LEDGER_SUMMARY.closingBalance);
  const everestBillsSign = getLedgerSign(AJAY_EVEREST_BILLS_SUMMARY.closingBalance);
  const shripalCashBankSign = getLedgerSign(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.closingBalance);
  const isFiltered = totalRowCount !== undefined && totalRowCount !== rows.length;

  const ajayHeroMetrics = useMemo(() => {
    if (!isAjayScope) {
      return null;
    }

    const paymentWithPartnerIndex = headers.indexOf("Payment with partner");
    let paymentWithPartnerTotal = 0;
    for (const row of rows) {
      if (paymentWithPartnerIndex >= 0) {
        paymentWithPartnerTotal += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
      }
    }

    const registerMss = summary.totalDueToMssByVendor.mss;
    const registerArk = summary.totalDueToMssByVendor.arkshakti;
    const cashDue = summary.totalCashDueFromClient;
    const bankDue = summary.totalBankDue;
    const dueFromClients = cashDue + bankDue;
    const totalDueToMss = summary.totalDueToMss;
    const moneyLedger = AJAY_MONEY_LEDGER_SUMMARY.closingBalance;
    const everestBills = AJAY_EVEREST_BILLS_SUMMARY.closingBalance;
    const finalSum = registerMss + registerArk + moneyLedger + everestBills;

    return {
      registerMss,
      registerArk,
      cashDue,
      bankDue,
      dueFromClients,
      totalDueToMss,
      paymentWithPartnerTotal,
      moneyLedger,
      everestBills,
      finalSum,
      dueFromClientsSign: getLedgerSign(dueFromClients),
      totalDueToMssSign: getLedgerSign(totalDueToMss),
      paymentWithPartnerSign: getLedgerSign(paymentWithPartnerTotal),
      registerMssSign: getLedgerSign(registerMss),
      registerArkSign: getLedgerSign(registerArk),
      finalSumSign: getLedgerSign(finalSum),
    };
  }, [
    headers,
    isAjayScope,
    rows,
    summary.totalBankDue,
    summary.totalCashDueFromClient,
    summary.totalDueToMss,
    summary.totalDueToMssByVendor.arkshakti,
    summary.totalDueToMssByVendor.mss,
  ]);

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

  const shripalHeroMetrics = useMemo(() => {
    if (!isShripalScope) {
      return null;
    }

    const paymentReceivedIndex = headers.indexOf("TOTAL Payment recieved");
    const paymentWithPartnerIndex = headers.indexOf("Payment with partner");
    let paymentReceivedTotal = 0;
    let paymentWithPartnerTotal = 0;

    for (const row of rows) {
      if (paymentReceivedIndex >= 0) {
        paymentReceivedTotal += parseProjectAmount(row[paymentReceivedIndex] ?? "");
      }
      if (paymentWithPartnerIndex >= 0) {
        paymentWithPartnerTotal += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
      }
    }

    const cashDue = summary.totalCashDueFromClient;
    const bankDue = summary.totalBankDue;
    const dueFromClients = cashDue + bankDue;
    const totalDueToMss = summary.totalDueToMss;

    return {
      netDueMss: summary.totalDueToMssByVendor.mss,
      netDueArk: summary.totalDueToMssByVendor.arkshakti,
      cashDue,
      bankDue,
      dueFromClients,
      totalDueToMss,
      paymentReceivedTotal,
      paymentWithPartnerTotal,
      dueFromClientsSign: getLedgerSign(dueFromClients),
      totalDueToMssSign: getLedgerSign(totalDueToMss),
      netDueMssSign: getLedgerSign(summary.totalDueToMssByVendor.mss),
      netDueArkSign: getLedgerSign(summary.totalDueToMssByVendor.arkshakti),
      paymentWithPartnerSign: getLedgerSign(paymentWithPartnerTotal),
    };
  }, [
    headers,
    isShripalScope,
    rows,
    summary.totalBankDue,
    summary.totalCashDueFromClient,
    summary.totalDueToMss,
    summary.totalDueToMssByVendor.arkshakti,
    summary.totalDueToMssByVendor.mss,
  ]);

  const partnerHeroMetrics = useMemo(() => {
    if (!isPartnerScope) {
      return null;
    }

    const paymentWithPartnerIndex = headers.indexOf("Payment with partner");
    let paymentWithPartnerTotal = 0;

    for (const row of rows) {
      if (paymentWithPartnerIndex >= 0) {
        paymentWithPartnerTotal += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
      }
    }

    const registerMss = summary.totalDueToMssByVendor.mss;
    const registerArk = summary.totalDueToMssByVendor.arkshakti;
    const cashDue = summary.totalCashDueFromClient;
    const bankDue = summary.totalBankDue;
    const dueFromClients = cashDue + bankDue;
    const totalDueToMss = summary.totalDueToMss;

    return {
      netDueMss: registerMss,
      netDueArk: registerArk,
      cashDue,
      bankDue,
      dueFromClients,
      totalDueToMss,
      paymentWithPartnerTotal,
      finalDeal: summary.totalFinalDealWithClient,
      dealWithMss: summary.totalDealWithMss,
      partnerProfit: summary.totalPartnerProfit,
      partnerCount: analytics.byProjectType.length,
      dueFromClientsSign: getLedgerSign(dueFromClients),
      totalDueToMssSign: getLedgerSign(totalDueToMss),
      netDueMssSign: getLedgerSign(registerMss),
      netDueArkSign: getLedgerSign(registerArk),
      partnerProfitSign: getLedgerSign(summary.totalPartnerProfit),
      paymentWithPartnerSign: getLedgerSign(paymentWithPartnerTotal),
    };
  }, [
    analytics.byProjectType.length,
    headers,
    rows,
    isPartnerScope,
    summary.totalBankDue,
    summary.totalCashDueFromClient,
    summary.totalDealWithMss,
    summary.totalDueToMss,
    summary.totalDueToMssByVendor.arkshakti,
    summary.totalDueToMssByVendor.mss,
    summary.totalFinalDealWithClient,
    summary.totalPartnerProfit,
  ]);

  const satyanarayanHeroMetrics = useMemo(() => {
    if (!isSatyanarayanScope) {
      return null;
    }

    const paymentWithPartnerIndex = headers.indexOf("Payment with partner");
    let paymentWithPartnerTotal = 0;
    for (const row of rows) {
      if (paymentWithPartnerIndex >= 0) {
        paymentWithPartnerTotal += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
      }
    }

    const registerMss = summary.totalDueToMssByVendor.mss;
    const registerArk = summary.totalDueToMssByVendor.arkshakti;
    const cashDue = summary.totalCashDueFromClient;
    const bankDue = summary.totalBankDue;
    const dueFromClients = cashDue + bankDue;
    const totalDueToMss = summary.totalDueToMss;
    const satyaLedger = SATYANARAYAN_LEDGER_SUMMARY.closingBalance;
    const finalSum = totalDueToMss + satyaLedger;

    return {
      netDueMss: registerMss,
      netDueArk: registerArk,
      cashDue,
      bankDue,
      dueFromClients,
      totalDueToMss,
      paymentWithPartnerTotal,
      finalDeal: summary.totalFinalDealWithClient,
      dealWithMss: summary.totalDealWithMss,
      partnerProfit: summary.totalPartnerProfit,
      satyaLedger,
      finalSum,
      dueFromClientsSign: getLedgerSign(dueFromClients),
      totalDueToMssSign: getLedgerSign(totalDueToMss),
      netDueMssSign: getLedgerSign(registerMss),
      netDueArkSign: getLedgerSign(registerArk),
      partnerProfitSign: getLedgerSign(summary.totalPartnerProfit),
      paymentWithPartnerSign: getLedgerSign(paymentWithPartnerTotal),
      satyaLedgerSign: getLedgerSign(satyaLedger),
      finalSumSign: getLedgerSign(finalSum),
    };
  }, [
    headers,
    isSatyanarayanScope,
    rows,
    summary.totalBankDue,
    summary.totalCashDueFromClient,
    summary.totalDealWithMss,
    summary.totalDueToMss,
    summary.totalDueToMssByVendor.arkshakti,
    summary.totalDueToMssByVendor.mss,
    summary.totalFinalDealWithClient,
    summary.totalPartnerProfit,
  ]);

  const rjgreenHeroMetrics = useMemo(() => {
    if (!isRjGreenScope) {
      return null;
    }

    const paymentWithPartnerIndex = headers.indexOf("Payment with partner");
    let paymentWithPartnerTotal = 0;
    for (const row of rows) {
      if (paymentWithPartnerIndex >= 0) {
        paymentWithPartnerTotal += parseProjectAmount(row[paymentWithPartnerIndex] ?? "");
      }
    }

    const registerMss = summary.totalDueToMssByVendor.mss;
    const registerArk = summary.totalDueToMssByVendor.arkshakti;
    const cashDue = summary.totalCashDueFromClient;
    const bankDue = summary.totalBankDue;
    const dueFromClients = cashDue + bankDue;
    const totalDueToMss = summary.totalDueToMss;

    return {
      netDueMss: registerMss,
      netDueArk: registerArk,
      cashDue,
      bankDue,
      dueFromClients,
      totalDueToMss,
      paymentWithPartnerTotal,
      finalDeal: summary.totalFinalDealWithClient,
      dealWithMss: summary.totalDealWithMss,
      partnerProfit: summary.totalPartnerProfit,
      dueFromClientsSign: getLedgerSign(dueFromClients),
      totalDueToMssSign: getLedgerSign(totalDueToMss),
      netDueMssSign: getLedgerSign(registerMss),
      netDueArkSign: getLedgerSign(registerArk),
      partnerProfitSign: getLedgerSign(summary.totalPartnerProfit),
      paymentWithPartnerSign: getLedgerSign(paymentWithPartnerTotal),
    };
  }, [
    headers,
    isRjGreenScope,
    rows,
    summary.totalBankDue,
    summary.totalCashDueFromClient,
    summary.totalDealWithMss,
    summary.totalDueToMss,
    summary.totalDueToMssByVendor.arkshakti,
    summary.totalDueToMssByVendor.mss,
    summary.totalFinalDealWithClient,
    summary.totalPartnerProfit,
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
    scope === "our"
      ? "register"
      : scope === "shripal"
        ? "Shripal register"
        : scope === "ajay"
          ? "Ajay register"
          : scope === "satyanarayan"
            ? "Satyanarayan register"
            : scope === "rjgreen"
              ? "RJ Green register"
              : "partner tab";
  const summaryTitle =
    scope === "our"
      ? "Our projects summary"
      : scope === "shripal"
        ? "Shripal sites summary"
        : scope === "ajay"
          ? "Ajay sites summary"
          : scope === "satyanarayan"
            ? "Satyanarayan sites summary"
            : scope === "rjgreen"
              ? "RJ Green sites summary"
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
          {isOurScope || isShripalScope || isSatyanarayanScope || isRjGreenScope || isPartnerScope || isAjayScope ? (
            <p className="mss-analytics-print-meta">
              {isShripalScope
                ? "Shripal sites"
                : isSatyanarayanScope
                  ? "Satyanarayan sites"
                  : isRjGreenScope
                    ? "RJ Green sites"
                    : isAjayScope
                      ? "Ajay sites"
                      : isOurScope
                        ? "Our projects"
                        : "Partner projects"}{" "}
              analytics · {rows.length} site
              {rows.length === 1 ? "" : "s"}
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

      {isShripalScope ? (
        <AnalyticsInfoBanner title="Shripal register">
          Same dues view as Our projects, plus <strong>Payment with partner</strong> on each site row.{" "}
          <strong>Cash / Bank</strong> money movements are tracked separately on the Loans Ledgers workbook
          (left block on the Shripal Ji tab).
        </AnalyticsInfoBanner>
      ) : null}

      {isPartnerScope ? (
        <AnalyticsInfoBanner title="Remaining partner portfolio">
          Aggregate partner registers excluding Our / Shripal / Ajay / Satyanarayan / RJ Green. Site dues and
          deal margins roll up here.
        </AnalyticsInfoBanner>
      ) : null}

      {isSatyanarayanScope ? (
        <AnalyticsInfoBanner title="Satyanarayan register">
          Partner-style site columns plus the <strong>Sub Vendor Payment</strong> money ledger for
          Satyanarayan (closing {formatSignedLedgerAmount(SATYANARAYAN_LEDGER_SUMMARY.closingBalance)}).
        </AnalyticsInfoBanner>
      ) : null}

      {isRjGreenScope ? (
        <AnalyticsInfoBanner title="RJ Green register">
          Rohit (RJ GREEN) sites from MSS and Arkshakti with the same partner money columns as Partner
          projects.
        </AnalyticsInfoBanner>
      ) : null}

      <section
        className={`mss-analytics-hero${isRegisterStyleScope || isPartnerStyleLayoutScope ? " mss-analytics-hero--ajay" : ""}`}
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
              className={`mss-analytics-hero-card mss-analytics-hero-card--client-dues mss-analytics-hero-card--balance-${ajayHeroMetrics.dueFromClientsSign}`}
            >
              <p className="mss-analytics-hero-label">Total due from client</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ajayHeroMetrics.dueFromClientsSign)}`}>
                {formatSignedLedgerAmount(ajayHeroMetrics.dueFromClients)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Cash + bank on register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>Cash due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(ajayHeroMetrics.cashDue))}>
                    {formatSignedLedgerAmount(ajayHeroMetrics.cashDue)}
                  </dd>
                </div>
                <div>
                  <dt>Bank due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(ajayHeroMetrics.bankDue))}>
                    {formatSignedLedgerAmount(ajayHeroMetrics.bankDue)}
                  </dd>
                </div>
              </dl>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${ajayHeroMetrics.paymentWithPartnerSign}`}
            >
              <p className="mss-analytics-hero-label">Payment with partner</p>
              <p
                className={`mss-analytics-hero-value ${ledgerAmountClassName(ajayHeroMetrics.paymentWithPartnerSign)}`}
              >
                {formatSignedLedgerAmount(ajayHeroMetrics.paymentWithPartnerTotal)}
              </p>
              <p className="mss-analytics-hero-hint">Cash / installments held or routed via Ajay</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${ajayHeroMetrics.totalDueToMssSign}`}
            >
              <p className="mss-analytics-hero-label">Total due to MSS</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(ajayHeroMetrics.totalDueToMssSign)}`}>
                {formatSignedLedgerAmount(ajayHeroMetrics.totalDueToMss)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Net due on site register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>{PROJECT_VENDORS.MSS}</dt>
                  <dd className={ledgerAmountClassName(ajayHeroMetrics.registerMssSign)}>
                    {formatSignedLedgerAmount(ajayHeroMetrics.registerMss)}
                  </dd>
                </div>
                <div>
                  <dt>{PROJECT_VENDORS.ARKSHAKTI}</dt>
                  <dd className={ledgerAmountClassName(ajayHeroMetrics.registerArkSign)}>
                    {formatSignedLedgerAmount(ajayHeroMetrics.registerArk)}
                  </dd>
                </div>
              </dl>
            </article>
            <article className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${moneyLedgerSign}`}>
              <p className="mss-analytics-hero-label">Sub Vendor · Money ledger</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(moneyLedgerSign)}`}>
                {formatSignedLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.closingBalance)}
              </p>
              <p className="mss-analytics-hero-hint">
                DR {formatSignedLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalDr)} out · CR{" "}
                {formatSignedLedgerAmount(AJAY_MONEY_LEDGER_SUMMARY.totalCr)} in ·{" "}
                {netBalanceLabel(AJAY_MONEY_LEDGER_SUMMARY.closingBalance)}
              </p>
            </article>
            <article className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${everestBillsSign}`}>
              <p className="mss-analytics-hero-label">Sub Vendor · Everest bills</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(everestBillsSign)}`}>
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
        ) : isShripalScope && shripalHeroMetrics ? (
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
              className={`mss-analytics-hero-card mss-analytics-hero-card--client-dues mss-analytics-hero-card--balance-${shripalHeroMetrics.dueFromClientsSign}`}
            >
              <p className="mss-analytics-hero-label">Total due from client</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(shripalHeroMetrics.dueFromClientsSign)}`}>
                {formatSignedLedgerAmount(shripalHeroMetrics.dueFromClients)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Cash + bank on register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>Cash due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(shripalHeroMetrics.cashDue))}>
                    {formatSignedLedgerAmount(shripalHeroMetrics.cashDue)}
                  </dd>
                </div>
                <div>
                  <dt>Bank due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(shripalHeroMetrics.bankDue))}>
                    {formatSignedLedgerAmount(shripalHeroMetrics.bankDue)}
                  </dd>
                </div>
              </dl>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${shripalHeroMetrics.paymentWithPartnerSign}`}
            >
              <p className="mss-analytics-hero-label">Payment with partner</p>
              <p
                className={`mss-analytics-hero-value ${ledgerAmountClassName(shripalHeroMetrics.paymentWithPartnerSign)}`}
              >
                {formatSignedLedgerAmount(shripalHeroMetrics.paymentWithPartnerTotal)}
              </p>
              <p className="mss-analytics-hero-hint">Cash / installments held or routed via Shripal</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${shripalHeroMetrics.totalDueToMssSign}`}
            >
              <p className="mss-analytics-hero-label">Total due to MSS</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(shripalHeroMetrics.totalDueToMssSign)}`}>
                {formatSignedLedgerAmount(shripalHeroMetrics.totalDueToMss)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Net due on site register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>{PROJECT_VENDORS.MSS}</dt>
                  <dd className={ledgerAmountClassName(shripalHeroMetrics.netDueMssSign)}>
                    {formatSignedLedgerAmount(shripalHeroMetrics.netDueMss)}
                  </dd>
                </div>
                <div>
                  <dt>{PROJECT_VENDORS.ARKSHAKTI}</dt>
                  <dd className={ledgerAmountClassName(shripalHeroMetrics.netDueArkSign)}>
                    {formatSignedLedgerAmount(shripalHeroMetrics.netDueArk)}
                  </dd>
                </div>
              </dl>
            </article>
            <article className="mss-analytics-hero-card">
              <p className="mss-analytics-hero-label">Payments received</p>
              <p className="mss-analytics-hero-value">
                {formatSignedLedgerAmount(shripalHeroMetrics.paymentReceivedTotal)}
              </p>
              <p className="mss-analytics-hero-hint">Loan / cash installments logged on register</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${shripalCashBankSign}`}
            >
              <p className="mss-analytics-hero-label">Loans ledger · Cash / Bank</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(shripalCashBankSign)}`}>
                {formatSignedLedgerAmount(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.closingBalance)}
              </p>
              <p className="mss-analytics-hero-hint">
                DR {formatSignedLedgerAmount(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.totalDr)} · CR{" "}
                {formatSignedLedgerAmount(SHRIPAL_CASH_BANK_LEDGER_SUMMARY.totalCr)}
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
        ) : isPartnerScope && partnerHeroMetrics ? (
          <>
            <article className="mss-analytics-hero-card">
              <p className="mss-analytics-hero-label">Total sites</p>
              <p className="mss-analytics-hero-value">{summary.sitesByVendor.total}</p>
              <p className="mss-analytics-hero-hint">
                {partnerHeroMetrics.partnerCount} partner
                {partnerHeroMetrics.partnerCount === 1 ? "" : "s"} · {PROJECT_VENDORS.MSS}{" "}
                {summary.sitesByVendor.mss} · {PROJECT_VENDORS.ARKSHAKTI} {summary.sitesByVendor.arkshakti}
              </p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--client-dues mss-analytics-hero-card--balance-${partnerHeroMetrics.dueFromClientsSign}`}
            >
              <p className="mss-analytics-hero-label">Total due from client</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(partnerHeroMetrics.dueFromClientsSign)}`}>
                {formatSignedLedgerAmount(partnerHeroMetrics.dueFromClients)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Cash + bank on register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>Cash due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(partnerHeroMetrics.cashDue))}>
                    {formatSignedLedgerAmount(partnerHeroMetrics.cashDue)}
                  </dd>
                </div>
                <div>
                  <dt>Bank due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(partnerHeroMetrics.bankDue))}>
                    {formatSignedLedgerAmount(partnerHeroMetrics.bankDue)}
                  </dd>
                </div>
              </dl>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${partnerHeroMetrics.paymentWithPartnerSign}`}
            >
              <p className="mss-analytics-hero-label">Payment with partner</p>
              <p
                className={`mss-analytics-hero-value ${ledgerAmountClassName(partnerHeroMetrics.paymentWithPartnerSign)}`}
              >
                {formatSignedLedgerAmount(partnerHeroMetrics.paymentWithPartnerTotal)}
              </p>
              <p className="mss-analytics-hero-hint">Cash / installments held on partner registers</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${partnerHeroMetrics.totalDueToMssSign}`}
            >
              <p className="mss-analytics-hero-label">Total due to MSS</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(partnerHeroMetrics.totalDueToMssSign)}`}>
                {formatSignedLedgerAmount(partnerHeroMetrics.totalDueToMss)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Net due on site registers</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>{PROJECT_VENDORS.MSS}</dt>
                  <dd className={ledgerAmountClassName(partnerHeroMetrics.netDueMssSign)}>
                    {formatSignedLedgerAmount(partnerHeroMetrics.netDueMss)}
                  </dd>
                </div>
                <div>
                  <dt>{PROJECT_VENDORS.ARKSHAKTI}</dt>
                  <dd className={ledgerAmountClassName(partnerHeroMetrics.netDueArkSign)}>
                    {formatSignedLedgerAmount(partnerHeroMetrics.netDueArk)}
                  </dd>
                </div>
              </dl>
            </article>
            <article className="mss-analytics-hero-card mss-analytics-hero-card--partner-deal">
              <p className="mss-analytics-hero-label">Client deal vs Deal with MSS</p>
              <p className="mss-analytics-hero-hint">
                Client billing minus MSS deal = partner margin on these registers
              </p>
              <div className="mss-analytics-deal-equation" aria-label="Deal equation">
                <div className="mss-analytics-deal-equation-term">
                  <p className="mss-analytics-deal-equation-label">Final deal with client</p>
                  <p className="mss-analytics-deal-equation-value">
                    {formatSignedLedgerAmount(partnerHeroMetrics.finalDeal)}
                  </p>
                </div>
                <span className="mss-analytics-deal-equation-op" aria-hidden>
                  −
                </span>
                <div className="mss-analytics-deal-equation-term">
                  <p className="mss-analytics-deal-equation-label">Deal with MSS</p>
                  <p className="mss-analytics-deal-equation-value">
                    {formatSignedLedgerAmount(partnerHeroMetrics.dealWithMss)}
                  </p>
                </div>
                <span className="mss-analytics-deal-equation-op" aria-hidden>
                  =
                </span>
                <div
                  className={`mss-analytics-deal-equation-term mss-analytics-deal-equation-term--result mss-analytics-deal-equation-term--${partnerHeroMetrics.partnerProfitSign}`}
                >
                  <p className="mss-analytics-deal-equation-label">Partner profit</p>
                  <p
                    className={`mss-analytics-deal-equation-value ${ledgerAmountClassName(partnerHeroMetrics.partnerProfitSign)}`}
                  >
                    {formatSignedLedgerAmount(partnerHeroMetrics.partnerProfit)}
                  </p>
                </div>
              </div>
            </article>
          </>
        ) : isSatyanarayanScope && satyanarayanHeroMetrics ? (
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
              className={`mss-analytics-hero-card mss-analytics-hero-card--client-dues mss-analytics-hero-card--balance-${satyanarayanHeroMetrics.dueFromClientsSign}`}
            >
              <p className="mss-analytics-hero-label">Total due from client</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(satyanarayanHeroMetrics.dueFromClientsSign)}`}>
                {formatSignedLedgerAmount(satyanarayanHeroMetrics.dueFromClients)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Cash + bank on register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>Cash due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(satyanarayanHeroMetrics.cashDue))}>
                    {formatSignedLedgerAmount(satyanarayanHeroMetrics.cashDue)}
                  </dd>
                </div>
                <div>
                  <dt>Bank due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(satyanarayanHeroMetrics.bankDue))}>
                    {formatSignedLedgerAmount(satyanarayanHeroMetrics.bankDue)}
                  </dd>
                </div>
              </dl>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${satyanarayanHeroMetrics.paymentWithPartnerSign}`}
            >
              <p className="mss-analytics-hero-label">Payment with partner</p>
              <p
                className={`mss-analytics-hero-value ${ledgerAmountClassName(satyanarayanHeroMetrics.paymentWithPartnerSign)}`}
              >
                {formatSignedLedgerAmount(satyanarayanHeroMetrics.paymentWithPartnerTotal)}
              </p>
              <p className="mss-analytics-hero-hint">Cash / installments held on Satyanarayan register</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${satyanarayanHeroMetrics.totalDueToMssSign}`}
            >
              <p className="mss-analytics-hero-label">Total due to MSS</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(satyanarayanHeroMetrics.totalDueToMssSign)}`}>
                {formatSignedLedgerAmount(satyanarayanHeroMetrics.totalDueToMss)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Net due on site register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>{PROJECT_VENDORS.MSS}</dt>
                  <dd className={ledgerAmountClassName(satyanarayanHeroMetrics.netDueMssSign)}>
                    {formatSignedLedgerAmount(satyanarayanHeroMetrics.netDueMss)}
                  </dd>
                </div>
                <div>
                  <dt>{PROJECT_VENDORS.ARKSHAKTI}</dt>
                  <dd className={ledgerAmountClassName(satyanarayanHeroMetrics.netDueArkSign)}>
                    {formatSignedLedgerAmount(satyanarayanHeroMetrics.netDueArk)}
                  </dd>
                </div>
              </dl>
            </article>
            <article className="mss-analytics-hero-card mss-analytics-hero-card--partner-deal">
              <p className="mss-analytics-hero-label">Client deal vs Deal with MSS</p>
              <p className="mss-analytics-hero-hint">
                Client billing minus MSS deal = partner margin on this register
              </p>
              <div className="mss-analytics-deal-equation" aria-label="Deal equation">
                <div className="mss-analytics-deal-equation-term">
                  <p className="mss-analytics-deal-equation-label">Final deal with client</p>
                  <p className="mss-analytics-deal-equation-value">
                    {formatSignedLedgerAmount(satyanarayanHeroMetrics.finalDeal)}
                  </p>
                </div>
                <span className="mss-analytics-deal-equation-op" aria-hidden>
                  −
                </span>
                <div className="mss-analytics-deal-equation-term">
                  <p className="mss-analytics-deal-equation-label">Deal with MSS</p>
                  <p className="mss-analytics-deal-equation-value">
                    {formatSignedLedgerAmount(satyanarayanHeroMetrics.dealWithMss)}
                  </p>
                </div>
                <span className="mss-analytics-deal-equation-op" aria-hidden>
                  =
                </span>
                <div
                  className={`mss-analytics-deal-equation-term mss-analytics-deal-equation-term--result mss-analytics-deal-equation-term--${satyanarayanHeroMetrics.partnerProfitSign}`}
                >
                  <p className="mss-analytics-deal-equation-label">Partner profit</p>
                  <p
                    className={`mss-analytics-deal-equation-value ${ledgerAmountClassName(satyanarayanHeroMetrics.partnerProfitSign)}`}
                  >
                    {formatSignedLedgerAmount(satyanarayanHeroMetrics.partnerProfit)}
                  </p>
                </div>
              </div>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${satyanarayanHeroMetrics.satyaLedgerSign}`}
            >
              <p className="mss-analytics-hero-label">Sub Vendor · Money ledger</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(satyanarayanHeroMetrics.satyaLedgerSign)}`}>
                {formatSignedLedgerAmount(satyanarayanHeroMetrics.satyaLedger)}
              </p>
              <p className="mss-analytics-hero-hint">
                DR {formatSignedLedgerAmount(SATYANARAYAN_LEDGER_SUMMARY.totalDr)} ·{" "}
                {netBalanceLabel(satyanarayanHeroMetrics.satyaLedger)}
              </p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--final mss-analytics-hero-card--balance-${satyanarayanHeroMetrics.finalSumSign}`}
            >
              <p className="mss-analytics-hero-label">
                <Sigma size={14} aria-hidden /> Final sum
              </p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(satyanarayanHeroMetrics.finalSumSign)}`}>
                {formatSignedLedgerAmount(satyanarayanHeroMetrics.finalSum)}
              </p>
              <p className="mss-analytics-hero-hint">
                Site register + Sub Vendor ledger · {netBalanceLabel(satyanarayanHeroMetrics.finalSum)}
              </p>
            </article>
          </>
        ) : isRjGreenScope && rjgreenHeroMetrics ? (
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
              className={`mss-analytics-hero-card mss-analytics-hero-card--client-dues mss-analytics-hero-card--balance-${rjgreenHeroMetrics.dueFromClientsSign}`}
            >
              <p className="mss-analytics-hero-label">Total due from client</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(rjgreenHeroMetrics.dueFromClientsSign)}`}>
                {formatSignedLedgerAmount(rjgreenHeroMetrics.dueFromClients)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Cash + bank on register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>Cash due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(rjgreenHeroMetrics.cashDue))}>
                    {formatSignedLedgerAmount(rjgreenHeroMetrics.cashDue)}
                  </dd>
                </div>
                <div>
                  <dt>Bank due</dt>
                  <dd className={ledgerAmountClassName(getLedgerSign(rjgreenHeroMetrics.bankDue))}>
                    {formatSignedLedgerAmount(rjgreenHeroMetrics.bankDue)}
                  </dd>
                </div>
              </dl>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${rjgreenHeroMetrics.paymentWithPartnerSign}`}
            >
              <p className="mss-analytics-hero-label">Payment with partner</p>
              <p
                className={`mss-analytics-hero-value ${ledgerAmountClassName(rjgreenHeroMetrics.paymentWithPartnerSign)}`}
              >
                {formatSignedLedgerAmount(rjgreenHeroMetrics.paymentWithPartnerTotal)}
              </p>
              <p className="mss-analytics-hero-hint">Cash / installments held on RJ Green register</p>
            </article>
            <article
              className={`mss-analytics-hero-card mss-analytics-hero-card--balance-${rjgreenHeroMetrics.totalDueToMssSign}`}
            >
              <p className="mss-analytics-hero-label">Total due to MSS</p>
              <p className={`mss-analytics-hero-value ${ledgerAmountClassName(rjgreenHeroMetrics.totalDueToMssSign)}`}>
                {formatSignedLedgerAmount(rjgreenHeroMetrics.totalDueToMss)}
              </p>
              <p className="mss-analytics-hero-hint mss-analytics-hero-hint--strong">Net due on site register</p>
              <dl className="mss-analytics-hero-dues-list">
                <div>
                  <dt>{PROJECT_VENDORS.MSS}</dt>
                  <dd className={ledgerAmountClassName(rjgreenHeroMetrics.netDueMssSign)}>
                    {formatSignedLedgerAmount(rjgreenHeroMetrics.netDueMss)}
                  </dd>
                </div>
                <div>
                  <dt>{PROJECT_VENDORS.ARKSHAKTI}</dt>
                  <dd className={ledgerAmountClassName(rjgreenHeroMetrics.netDueArkSign)}>
                    {formatSignedLedgerAmount(rjgreenHeroMetrics.netDueArk)}
                  </dd>
                </div>
              </dl>
            </article>
            <article className="mss-analytics-hero-card mss-analytics-hero-card--partner-deal">
              <p className="mss-analytics-hero-label">Client deal vs Deal with MSS</p>
              <p className="mss-analytics-hero-hint">
                Client billing minus MSS deal = partner margin on this register
              </p>
              <div className="mss-analytics-deal-equation" aria-label="Deal equation">
                <div className="mss-analytics-deal-equation-term">
                  <p className="mss-analytics-deal-equation-label">Final deal with client</p>
                  <p className="mss-analytics-deal-equation-value">
                    {formatSignedLedgerAmount(rjgreenHeroMetrics.finalDeal)}
                  </p>
                </div>
                <span className="mss-analytics-deal-equation-op" aria-hidden>
                  −
                </span>
                <div className="mss-analytics-deal-equation-term">
                  <p className="mss-analytics-deal-equation-label">Deal with MSS</p>
                  <p className="mss-analytics-deal-equation-value">
                    {formatSignedLedgerAmount(rjgreenHeroMetrics.dealWithMss)}
                  </p>
                </div>
                <span className="mss-analytics-deal-equation-op" aria-hidden>
                  =
                </span>
                <div
                  className={`mss-analytics-deal-equation-term mss-analytics-deal-equation-term--result mss-analytics-deal-equation-term--${rjgreenHeroMetrics.partnerProfitSign}`}
                >
                  <p className="mss-analytics-deal-equation-label">Partner profit</p>
                  <p
                    className={`mss-analytics-deal-equation-value ${ledgerAmountClassName(rjgreenHeroMetrics.partnerProfitSign)}`}
                  >
                    {formatSignedLedgerAmount(rjgreenHeroMetrics.partnerProfit)}
                  </p>
                </div>
              </div>
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

      <div
        className={`mss-analytics-grid${isRegisterStyleScope || isPartnerStyleLayoutScope ? " mss-analytics-grid--single" : ""}`}
      >
        <section
          className={`mss-sites-analytics-panel${isRegisterStyleScope || isPartnerStyleLayoutScope ? " mss-sites-analytics-panel--full" : ""}`}
          id="analytics-overview"
        >
          <header className="mss-sites-analytics-panel-header">
            <Building2 size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">Overview</h2>
              <p className="mss-sites-analytics-panel-subtitle">
                {isAjayScope
                  ? "Register split, payment activity, net-due mix, and how the final sum is built"
                  : isShripalScope
                    ? "Vendor registers, client dues, payment with partner, Cash / Bank ledger, and work status"
                    : isSatyanarayanScope
                      ? "Site register, deal margins, Sub Vendor money ledger, and work status"
                      : isRjGreenScope
                        ? "RJ Green register, deal margins, payment with partner, and work status"
                        : isOurScope
                          ? "Residential + commercial registers, client dues, payments, and work status"
                          : "Remaining partner registers, deal margins, and work status"}
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
          {isShripalScope ? <ShripalOverviewDetails headers={headers} rows={rows} summary={summary} /> : null}
          {isPartnerScope || isSatyanarayanScope || isRjGreenScope ? (
            <PartnerOverviewDetails
              headers={headers}
              rows={rows}
              summary={summary}
              byProjectType={analytics.byProjectType}
            />
          ) : null}
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

      {isShripalScope ? (
        <section
          className="mss-sites-analytics-panel mss-sites-analytics-panel--full"
          id="analytics-shripal-ledger"
        >
          <header className="mss-sites-analytics-panel-header">
            <Wallet size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">Loans Ledgers · Cash / Bank</h2>
              <p className="mss-sites-analytics-panel-subtitle">
                Left block from the <strong>Shripal Ji</strong> tab — cash, PhonePe, RTGS, and partner
                payments (loan EMI block excluded)
              </p>
            </div>
          </header>
          <ShripalCashBankLedger />
        </section>
      ) : null}

      {isSatyanarayanScope ? (
        <section
          className="mss-sites-analytics-panel mss-sites-analytics-panel--full"
          id="analytics-satyanarayan"
        >
          <header className="mss-sites-analytics-panel-header">
            <Wallet size={18} aria-hidden />
            <div>
              <h2 className="mss-sites-analytics-panel-title">Satyanarayan Sub Vendor ledger</h2>
              <p className="mss-sites-analytics-panel-subtitle">
                Money ledger from Sub Vendor Payment · maps to Projects{" "}
                <strong>SATAYNARAYAN JI</strong>
              </p>
            </div>
          </header>
          <SatyanarayanSubVendorLedger />
        </section>
      ) : null}

      {isPartnerScope ? (
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
