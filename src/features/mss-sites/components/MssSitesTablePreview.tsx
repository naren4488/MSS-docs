import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  computeVisibleColumnTotals,
  filterRowsByClientName,
  filterRowsByNonzeroDues,
  filterRowsByProjectsScope,
  filterRowsByProjectTypes,
  filterRowsByVendors,
  filterRowsByWorkStatuses,
  getDefaultSelectedWorkStatuses,
  getHiddenProjectFields,
  getProjectTypesFromRows,
  getVendorsFromRows,
  getVisibleColumnIndices,
  getWorkStatusesFromRows,
  isProjectPrintHighlightColumn,
  isProjectPdfOmitColumn,
  NONZERO_DUES_FILTER_OPTIONS,
  workStatusSelectionMatchesDefault,
  PROJECT_MORE_COLUMN_HEADER,
  PROJECT_S_NO_COLUMN_INDEX,
  withSequentialSerialNumbers,
} from "../lib/projects-columns";
import type { MssSitesTable } from "../types/mss-sites";
import { ClientNameSearch } from "./ClientNameSearch";
import { MssSitesAnalytics } from "./MssSitesAnalytics";
import { ProjectRowMoreCell } from "./ProjectRowMoreCell";
import { ProjectsMultiselectFilter } from "./ProjectsMultiselectFilter";
import { ProjectsSheetTabFilter } from "./ProjectsSheetTabFilter";
import type { ProjectSheetTabShortcut, ProjectsScope } from "../lib/projects-config";

export type MssSitesViewMode = "table" | "analytics";

interface MssSitesTablePreviewProps {
  table: MssSitesTable;
  viewMode: MssSitesViewMode;
  scope: ProjectsScope;
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

export function MssSitesTablePreview({ table, viewMode, scope }: MssSitesTablePreviewProps) {
  const scopedRows = useMemo(() => filterRowsByProjectsScope(table.rows, scope), [scope, table.rows]);
  const visibleColumnIndices = useMemo(
    () => getVisibleColumnIndices(table.headers, scope),
    [scope, table.headers],
  );
  const projectTypes = useMemo(() => getProjectTypesFromRows(scopedRows), [scopedRows]);
  const vendors = useMemo(() => getVendorsFromRows(scopedRows), [scopedRows]);
  const workStatuses = useMemo(() => getWorkStatusesFromRows(scopedRows), [scopedRows]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<Set<string>>(() => new Set(projectTypes));
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(() => new Set(vendors));
  const [selectedWorkStatuses, setSelectedWorkStatuses] = useState<Set<string>>(() =>
    getDefaultSelectedWorkStatuses(workStatuses),
  );
  const [selectedNonzeroDues, setSelectedNonzeroDues] = useState<Set<string>>(() => new Set());
  const [clientNameQuery, setClientNameQuery] = useState("");

  const registerFilterLabel = scope === "partner" ? "Partner" : "Register";
  const registerAllLabel = scope === "partner" ? "All partners" : "All registers";
  const registerEmptyLabel = scope === "partner" ? "No partners" : "No registers";

  useEffect(() => {
    setSelectedProjectTypes(new Set(projectTypes));
  }, [projectTypes]);

  useEffect(() => {
    setSelectedVendors(new Set(vendors));
  }, [vendors]);

  useEffect(() => {
    setSelectedWorkStatuses(getDefaultSelectedWorkStatuses(workStatuses));
  }, [workStatuses]);

  useEffect(() => {
    setSelectedNonzeroDues(new Set());
    setClientNameQuery("");
  }, [scope]);

  const filteredRows = useMemo(() => {
    const byVendor = filterRowsByVendors(scopedRows, selectedVendors);
    const byType = filterRowsByProjectTypes(byVendor, selectedProjectTypes);
    const byStatus = filterRowsByWorkStatuses(byType, selectedWorkStatuses);
    const byDues = filterRowsByNonzeroDues(byStatus, selectedNonzeroDues);
    const byName = filterRowsByClientName(byDues, clientNameQuery);
    return withSequentialSerialNumbers(byName);
  }, [
    clientNameQuery,
    scopedRows,
    selectedNonzeroDues,
    selectedProjectTypes,
    selectedVendors,
    selectedWorkStatuses,
  ]);

  const workStatusAtDefault = workStatusSelectionMatchesDefault(selectedWorkStatuses, workStatuses);

  const isFiltered =
    (selectedProjectTypes.size > 0 && selectedProjectTypes.size < projectTypes.length) ||
    (selectedVendors.size > 0 && selectedVendors.size < vendors.length) ||
    !workStatusAtDefault ||
    selectedNonzeroDues.size > 0 ||
    clientNameQuery.trim().length > 0;

  const columnTotals = useMemo(
    () => computeVisibleColumnTotals(table.headers, filteredRows, visibleColumnIndices),
    [filteredRows, table.headers, visibleColumnIndices],
  );

  const clearAllFilters = useCallback(() => {
    setSelectedProjectTypes(new Set(projectTypes));
    setSelectedVendors(new Set(vendors));
    setSelectedWorkStatuses(getDefaultSelectedWorkStatuses(workStatuses));
    setSelectedNonzeroDues(new Set());
    setClientNameQuery("");
  }, [projectTypes, vendors, workStatuses]);

  const applySheetTabShortcut = useCallback(
    (shortcut: ProjectSheetTabShortcut) => {
      setSelectedProjectTypes(new Set([shortcut.projectType]));
      if (shortcut.vendor) {
        setSelectedVendors(new Set([shortcut.vendor]));
      } else {
        setSelectedVendors(new Set(vendors));
      }
    },
    [vendors],
  );

  const clearSheetTabShortcut = useCallback(() => {
    setSelectedVendors(new Set(vendors));
    setSelectedProjectTypes(new Set(projectTypes));
  }, [projectTypes, vendors]);

  const vendorFilterActive = selectedVendors.size > 0 && selectedVendors.size < vendors.length;
  const partnerFilterActive = selectedProjectTypes.size > 0 && selectedProjectTypes.size < projectTypes.length;
  const statusFilterActive = !workStatusAtDefault;
  const duesFilterActive = selectedNonzeroDues.size > 0;
  const searchActive = clientNameQuery.trim().length > 0;

  return (
    <div id="mss-sites-preview" className="mss-sites-preview">
      <div className="mss-sites-preview-header">
        <div className="mss-sites-preview-toolbar">
          <div className="mss-sites-preview-stats">
            <p className="mss-sites-preview-count">
              <span className="mss-sites-preview-count-value">{filteredRows.length}</span>
              {isFiltered ? (
                <span className="mss-sites-preview-count-total"> of {scopedRows.length}</span>
              ) : null}
              <span className="mss-sites-preview-count-label">
                project{filteredRows.length === 1 ? "" : "s"}
              </span>
            </p>

            <div className="mss-sites-preview-sources no-print" aria-label="Data sources">
              {scope === "our" ? (
                <>
                  <span className="mss-sites-source-badge mss-sites-source-badge--mss">MSS res / comm</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--arkshakti">Arkshakti</span>
                </>
              ) : scope === "shripal" ? (
                <>
                  <span className="mss-sites-source-badge mss-sites-source-badge--partner">Shripal Ji</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--mss">MSS</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--arkshakti">Arkshakti</span>
                </>
              ) : scope === "ajay" ? (
                <>
                  <span className="mss-sites-source-badge mss-sites-source-badge--partner">Ajay Ji</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--mss">MSS</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--arkshakti">Arkshakti</span>
                </>
              ) : (
                <>
                  <span className="mss-sites-source-badge mss-sites-source-badge--partner">Partners</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--mss">MSS</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--arkshakti">Arkshakti</span>
                </>
              )}
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
            label={registerFilterLabel}
            options={projectTypes}
            selected={selectedProjectTypes}
            onChange={setSelectedProjectTypes}
            allSummaryLabel={registerAllLabel}
            emptyOptionsLabel={registerEmptyLabel}
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
          <ProjectsMultiselectFilter
            label="Dues"
            options={[...NONZERO_DUES_FILTER_OPTIONS]}
            selected={selectedNonzeroDues}
            onChange={setSelectedNonzeroDues}
            allSummaryLabel="Any non-zero due"
            noneSummaryLabel="All sites"
            emptyOptionsLabel="No options"
            isActive={duesFilterActive}
          />
        </div>

        <ProjectsSheetTabFilter
          scope={scope}
          selectedVendors={selectedVendors}
          selectedProjectTypes={selectedProjectTypes}
          allVendors={vendors}
          onSelectShortcut={applySheetTabShortcut}
          onClearShortcut={clearSheetTabShortcut}
        />
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
            totalRowCount={scopedRows.length}
            scope={scope}
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
                <th className="mss-sites-table-more-col" style={moreThStyle}>
                  {PROJECT_MORE_COLUMN_HEADER}
                </th>
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
                <td className="mss-sites-table-more-col" style={moreTdStyle}>
                  —
                </td>
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
