import { useEffect, useMemo, useState } from "react";
import {
  computeVisibleColumnTotals,
  filterRowsByClientName,
  filterRowsByProjectTypes,
  filterRowsByVendors,
  filterRowsByWorkStatuses,
  getHiddenProjectFields,
  getProjectTypesFromRows,
  getVendorsFromRows,
  getVisibleColumnIndices,
  getWorkStatusesFromRows,
  isProjectPrintHighlightColumn,
  PROJECT_MORE_COLUMN_HEADER,
  PROJECT_S_NO_COLUMN_INDEX,
  withSequentialSerialNumbers,
} from "../lib/projects-columns";
import type { MssSitesTable } from "../types/mss-sites";
import { ClientNameSearch } from "./ClientNameSearch";
import { MssSitesAnalytics } from "./MssSitesAnalytics";
import { ProjectRowMoreCell } from "./ProjectRowMoreCell";
import { ProjectsMultiselectFilter } from "./ProjectsMultiselectFilter";

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

export function MssSitesTablePreview({ table, viewMode }: MssSitesTablePreviewProps) {
  const visibleColumnIndices = useMemo(() => getVisibleColumnIndices(table.headers), [table.headers]);
  const projectTypes = useMemo(() => getProjectTypesFromRows(table.rows), [table.rows]);
  const vendors = useMemo(() => getVendorsFromRows(table.rows), [table.rows]);
  const workStatuses = useMemo(() => getWorkStatusesFromRows(table.rows), [table.rows]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<Set<string>>(() => new Set(projectTypes));
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(() => new Set(vendors));
  const [selectedWorkStatuses, setSelectedWorkStatuses] = useState<Set<string>>(() => new Set(workStatuses));
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
    const byName = filterRowsByClientName(byStatus, clientNameQuery);
    return withSequentialSerialNumbers(byName);
  }, [clientNameQuery, selectedProjectTypes, selectedVendors, selectedWorkStatuses, table.rows]);

  const isFiltered =
    (selectedProjectTypes.size > 0 && selectedProjectTypes.size < projectTypes.length) ||
    (selectedVendors.size > 0 && selectedVendors.size < vendors.length) ||
    (selectedWorkStatuses.size > 0 && selectedWorkStatuses.size < workStatuses.length) ||
    clientNameQuery.trim().length > 0;

  const columnTotals = useMemo(
    () => computeVisibleColumnTotals(table.headers, filteredRows, visibleColumnIndices),
    [filteredRows, table.headers, visibleColumnIndices],
  );

  return (
    <div id="mss-sites-preview" className="mss-sites-preview">
      <div className="mss-sites-preview-header">
        <div className="mss-sites-preview-header-main">
          <h1>{table.title}</h1>
          <p className="mss-sites-preview-meta">
            {isFiltered ? (
              <>
                {filteredRows.length} of {table.rows.length} projects · MSS, partner & Arkshakti tabs
              </>
            ) : (
              <>
                {table.rows.length} project{table.rows.length === 1 ? "" : "s"} · MSS, partner & Arkshakti tabs
              </>
            )}
          </p>
        </div>

        <div className="mss-sites-preview-filters no-print">
          <ClientNameSearch value={clientNameQuery} onChange={setClientNameQuery} />
          <ProjectsMultiselectFilter
            label="Vendor"
            options={vendors}
            selected={selectedVendors}
            onChange={setSelectedVendors}
            allSummaryLabel="All vendors"
            emptyOptionsLabel="No vendors"
          />
          <ProjectsMultiselectFilter
            label="Project Type"
            options={projectTypes}
            selected={selectedProjectTypes}
            onChange={setSelectedProjectTypes}
            allSummaryLabel="All types"
            emptyOptionsLabel="No types"
          />
          <ProjectsMultiselectFilter
            label="Work Status"
            options={workStatuses}
            selected={selectedWorkStatuses}
            onChange={setSelectedWorkStatuses}
            allSummaryLabel="All statuses"
            emptyOptionsLabel="No statuses"
          />
        </div>
      </div>

      <div className="mss-sites-table-wrap">
        {filteredRows.length === 0 ? (
          <div className="projects-empty-filter">
            <p>No projects match the selected filters.</p>
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
                  const highlightClass = isProjectPrintHighlightColumn(header)
                    ? " mss-sites-table-highlight-col"
                    : "";
                  return (
                  <th
                    key={`header-${columnIndex}`}
                    className={`mss-sites-table-col${highlightClass}`.trim()}
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
                  const highlightClass = isProjectPrintHighlightColumn(header)
                    ? " mss-sites-table-highlight-col"
                    : "";
                  return (
                    <td
                      key={`total-${columnIndex}`}
                      className={`mss-sites-table-col${highlightClass}`.trim()}
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
                    const highlightClass = isProjectPrintHighlightColumn(header)
                      ? " mss-sites-table-highlight-col"
                      : "";
                    return (
                    <td
                      key={`${rowIndex}-${columnIndex}`}
                      className={`mss-sites-table-col${highlightClass}`.trim()}
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
