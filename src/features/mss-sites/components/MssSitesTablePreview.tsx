import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  computeVisibleColumnTotals,
  DUE_TO_MSS_FILTER_OPTIONS,
  filterRowsByClientName,
  filterRowsByDueToMss,
  filterRowsByPaymentReceived,
  filterRowsByProjectTypes,
  filterRowsByVendors,
  filterRowsByWorkStatuses,
  getHiddenProjectFields,
  getProjectTypesFromRows,
  getVendorsFromRows,
  getVisibleColumnIndices,
  getWorkStatusesFromRows,
  isProjectPrintHighlightColumn,
  isProjectPdfOmitColumn,
  PAYMENT_RECEIVED_FILTER_OPTIONS,
  PROJECT_MORE_COLUMN_HEADER,
  PROJECT_S_NO_COLUMN_INDEX,
  type DueToMssFilter,
  withSequentialSerialNumbers,
} from "../lib/projects-columns";
import type { MssSitesTable } from "../types/mss-sites";
import { ClientNameSearch } from "./ClientNameSearch";
import { MssSitesAnalytics } from "./MssSitesAnalytics";
import { ProjectRowMoreCell } from "./ProjectRowMoreCell";
import { ProjectsMultiselectFilter } from "./ProjectsMultiselectFilter";
import { ProjectsSelectFilter } from "./ProjectsSelectFilter";

export type MssSitesViewMode = "table" | "analytics";

interface MssSitesTablePreviewProps {
  table: MssSitesTable;
  viewMode: MssSitesViewMode;
}

const thStyle = {
  padding: "8px 10px",
  textAlign: "left" as const,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 0.3,
  textTransform: "uppercase" as const,
  background: "#14306b",
  color: "#ffffff",
  borderBottom: "2px solid #0f234d",
  whiteSpace: "nowrap" as const,
  verticalAlign: "bottom" as const,
};

const tdStyle = {
  padding: "6px 10px",
  fontSize: 10,
  lineHeight: 1.45,
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "top" as const,
  wordBreak: "break-word" as const,
};

const sNoTdStyle = {
  ...tdStyle,
  textAlign: "center" as const,
  whiteSpace: "nowrap" as const,
  width: 48,
};

const sNoThStyle = {
  ...thStyle,
  textAlign: "center" as const,
  width: 48,
};

const moreThStyle = {
  ...thStyle,
  textAlign: "center" as const,
  width: 56,
};

const moreTdStyle = {
  ...tdStyle,
  textAlign: "center" as const,
  width: 56,
  verticalAlign: "middle" as const,
};

const totalsTdStyle = {
  ...tdStyle,
  fontWeight: 700,
  background: "#eef2ff",
  color: "#14306b",
  borderBottom: "2px solid #c7d2fe",
  whiteSpace: "nowrap" as const,
};

const totalsSNoTdStyle = {
  ...totalsTdStyle,
  textAlign: "center" as const,
};

function tableColumnClassName(header: string): string {
  const classes = ["mss-sites-table-col"];
  if (isProjectPrintHighlightColumn(header)) {
    classes.push("mss-sites-table-highlight-col");
  }
  if (isProjectPdfOmitColumn(header)) {
    classes.push("mss-sites-table-omit-pdf-col");
  }
  return classes.join(" ");
}

export function MssSitesTablePreview({ table, viewMode }: MssSitesTablePreviewProps) {
  const visibleColumnIndices = useMemo(() => getVisibleColumnIndices(table.headers), [table.headers]);
  const projectTypes = useMemo(() => getProjectTypesFromRows(table.rows), [table.rows]);
  const vendors = useMemo(() => getVendorsFromRows(table.rows), [table.rows]);
  const workStatuses = useMemo(() => getWorkStatusesFromRows(table.rows), [table.rows]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<Set<string>>(() => new Set(projectTypes));
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(() => new Set(vendors));
  const [selectedWorkStatuses, setSelectedWorkStatuses] = useState<Set<string>>(() => new Set(workStatuses));
  const [dueToMssFilter, setDueToMssFilter] = useState<DueToMssFilter>("all");
  const [selectedPaymentReceived, setSelectedPaymentReceived] = useState<Set<string>>(
    () => new Set(PAYMENT_RECEIVED_FILTER_OPTIONS),
  );
  const [clientNameQuery, setClientNameQuery] = useState("");

  useEffect(() => {
    setSelectedProjectTypes(new Set(projectTypes));
  }, [projectTypes]);

  useEffect(() => {
    setSelectedVendors(new Set(vendors));
  }, [vendors]);

  useEffect(() => {
    setSelectedWorkStatuses(new Set(workStatuses));
  }, [workStatuses]);

  const filteredRows = useMemo(() => {
    const byVendor = filterRowsByVendors(table.rows, selectedVendors);
    const byType = filterRowsByProjectTypes(byVendor, selectedProjectTypes);
    const byStatus = filterRowsByWorkStatuses(byType, selectedWorkStatuses);
    const byDue = filterRowsByDueToMss(byStatus, dueToMssFilter);
    const byPayment = filterRowsByPaymentReceived(byDue, selectedPaymentReceived);
    const byName = filterRowsByClientName(byPayment, clientNameQuery);
    return withSequentialSerialNumbers(byName);
  }, [
    clientNameQuery,
    dueToMssFilter,
    selectedPaymentReceived,
    selectedProjectTypes,
    selectedVendors,
    selectedWorkStatuses,
    table.rows,
  ]);

  const isFiltered =
    (selectedProjectTypes.size > 0 && selectedProjectTypes.size < projectTypes.length) ||
    (selectedVendors.size > 0 && selectedVendors.size < vendors.length) ||
    (selectedWorkStatuses.size > 0 && selectedWorkStatuses.size < workStatuses.length) ||
    dueToMssFilter !== "all" ||
    (selectedPaymentReceived.size > 0 &&
      selectedPaymentReceived.size < PAYMENT_RECEIVED_FILTER_OPTIONS.length) ||
    clientNameQuery.trim().length > 0;

  const columnTotals = useMemo(
    () => computeVisibleColumnTotals(table.headers, filteredRows, visibleColumnIndices),
    [filteredRows, table.headers, visibleColumnIndices],
  );

  const clearAllFilters = useCallback(() => {
    setSelectedProjectTypes(new Set(projectTypes));
    setSelectedVendors(new Set(vendors));
    setSelectedWorkStatuses(new Set(workStatuses));
    setDueToMssFilter("all");
    setSelectedPaymentReceived(new Set(PAYMENT_RECEIVED_FILTER_OPTIONS));
    setClientNameQuery("");
  }, [projectTypes, vendors, workStatuses]);

  const vendorFilterActive = selectedVendors.size > 0 && selectedVendors.size < vendors.length;
  const partnerFilterActive = selectedProjectTypes.size > 0 && selectedProjectTypes.size < projectTypes.length;
  const statusFilterActive = selectedWorkStatuses.size > 0 && selectedWorkStatuses.size < workStatuses.length;
  const dueFilterActive = dueToMssFilter !== "all";
  const paymentFilterActive =
    selectedPaymentReceived.size > 0 &&
    selectedPaymentReceived.size < PAYMENT_RECEIVED_FILTER_OPTIONS.length;
  const searchActive = clientNameQuery.trim().length > 0;

  return (
    <div id="mss-sites-preview" className="mss-sites-preview">
      <div className="mss-sites-preview-header">
        <div className="mss-sites-preview-toolbar">
          <div className="mss-sites-preview-stats">
            <p className="mss-sites-preview-count">
              <span className="mss-sites-preview-count-value">{filteredRows.length}</span>
              {isFiltered ? (
                <span className="mss-sites-preview-count-total"> of {table.rows.length}</span>
              ) : null}
              <span className="mss-sites-preview-count-label">
                project{filteredRows.length === 1 ? "" : "s"}
              </span>
            </p>

            <div className="mss-sites-preview-sources no-print" aria-label="Data sources">
              <span className="mss-sites-source-badge mss-sites-source-badge--mss">MSS</span>
              <span className="mss-sites-source-badge mss-sites-source-badge--partner">Partners</span>
              <span className="mss-sites-source-badge mss-sites-source-badge--arkshakti">Arkshakti</span>
            </div>
          </div>

          {isFiltered ? (
            <button type="button" className="mss-sites-clear-filters no-print" onClick={clearAllFilters}>
              <RotateCcw size={14} aria-hidden />
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="mss-sites-preview-filters no-print">
          <ClientNameSearch
            value={clientNameQuery}
            onChange={setClientNameQuery}
            isActive={searchActive}
            className="projects-filter--search"
          />
          <ProjectsMultiselectFilter
            label="Vendor"
            options={vendors}
            selected={selectedVendors}
            onChange={setSelectedVendors}
            allSummaryLabel="All vendors"
            emptyOptionsLabel="No vendors"
            isActive={vendorFilterActive}
          />
          <ProjectsMultiselectFilter
            label="Partner"
            options={projectTypes}
            selected={selectedProjectTypes}
            onChange={setSelectedProjectTypes}
            allSummaryLabel="All partners"
            emptyOptionsLabel="No partners"
            isActive={partnerFilterActive}
          />
          <ProjectsMultiselectFilter
            label="Work status"
            options={workStatuses}
            selected={selectedWorkStatuses}
            onChange={setSelectedWorkStatuses}
            allSummaryLabel="All statuses"
            emptyOptionsLabel="No statuses"
            isActive={statusFilterActive}
          />
          <ProjectsSelectFilter
            label="Due to MSS"
            value={dueToMssFilter}
            options={DUE_TO_MSS_FILTER_OPTIONS}
            onChange={setDueToMssFilter}
            isActive={dueFilterActive}
          />
          <ProjectsMultiselectFilter
            label="Payment"
            options={[...PAYMENT_RECEIVED_FILTER_OPTIONS]}
            selected={selectedPaymentReceived}
            onChange={setSelectedPaymentReceived}
            allSummaryLabel="All"
            emptyOptionsLabel="None"
            isActive={paymentFilterActive}
          />
        </div>
      </div>

      <div className="mss-sites-table-wrap">
        {filteredRows.length === 0 ? (
          <div className="projects-empty-filter">
            <p className="projects-empty-filter-title">No projects match your filters</p>
            <p className="projects-empty-filter-text">Try clearing filters or broadening your search.</p>
            {isFiltered ? (
              <button type="button" className="mss-sites-clear-filters" onClick={clearAllFilters}>
                <RotateCcw size={14} aria-hidden />
                Clear filters
              </button>
            ) : null}
          </div>
        ) : viewMode === "analytics" ? (
          <MssSitesAnalytics
            headers={table.headers}
            rows={filteredRows}
            totalRowCount={table.rows.length}
          />
        ) : (
          <table className="mss-sites-table">
            <thead>
              <tr>
                {visibleColumnIndices.map((columnIndex) => {
                  const header = table.headers[columnIndex];
                  return (
                  <th
                    key={`header-${columnIndex}`}
                    className={tableColumnClassName(header)}
                    style={columnIndex === 0 ? sNoThStyle : thStyle}
                  >
                    {header}
                  </th>
                  );
                })}
                <th className="mss-sites-table-more-col" style={moreThStyle}>{PROJECT_MORE_COLUMN_HEADER}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="mss-sites-table-totals-row">
                {visibleColumnIndices.map((columnIndex) => {
                  const totalValue = columnTotals.get(columnIndex);
                  const header = table.headers[columnIndex];
                  return (
                    <td
                      key={`total-${columnIndex}`}
                      className={tableColumnClassName(header)}
                      style={columnIndex === PROJECT_S_NO_COLUMN_INDEX ? totalsSNoTdStyle : totalsTdStyle}
                    >
                      {totalValue ?? (columnIndex === PROJECT_S_NO_COLUMN_INDEX + 1 ? "TOTAL" : "—")}
                    </td>
                  );
                })}
                <td className="mss-sites-table-more-col" style={moreTdStyle}>—</td>
              </tr>
              {filteredRows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} style={{ background: rowIndex % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                  {visibleColumnIndices.map((columnIndex) => {
                    const header = table.headers[columnIndex];
                    return (
                    <td
                      key={`${rowIndex}-${columnIndex}`}
                      className={tableColumnClassName(header)}
                      style={columnIndex === 0 ? sNoTdStyle : tdStyle}
                    >
                      {row[columnIndex] || (columnIndex === 0 ? String(rowIndex + 1) : "—")}
                    </td>
                    );
                  })}
                  <td className="mss-sites-table-more-col" style={moreTdStyle}>
                    <ProjectRowMoreCell fields={getHiddenProjectFields(table.headers, row)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
