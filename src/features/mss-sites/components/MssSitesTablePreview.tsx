import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import {
  computeVisibleColumnTotals,
  filterRowsByClientName,
  filterRowsByFileIssues,
  filterRowsByNonzeroDues,
  filterRowsByProjectsScope,
  filterRowsByProjectTypes,
  filterRowsByVendors,
  filterRowsByWorkStatuses,
  getDefaultSelectedWorkStatuses,
  getFileIssuesFromRows,
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
import { getProjectRowKey } from "../lib/dedupe-project-rows";
import { buildBulkProjectRowsCopyText, copyTextToClipboard } from "../lib/project-row-copy";
import type { MssSitesTable } from "../types/mss-sites";
import { ClientNameSearch } from "./ClientNameSearch";
import { MssSitesAnalytics } from "./MssSitesAnalytics";
import { ProjectRowCopyCell } from "./ProjectRowCopyCell";
import { ProjectRowMoreCell } from "./ProjectRowMoreCell";
import { ProjectsMapView } from "./ProjectsMapView";
import { ProjectsMultiselectFilter } from "./ProjectsMultiselectFilter";
import { ProjectsSheetTabFilter } from "./ProjectsSheetTabFilter";
import type { ProjectSheetTabShortcut, ProjectsScope } from "../lib/projects-config";

export type MssSitesViewMode = "table" | "analytics" | "map";

export interface MssSitesTableExcelPayload {
  headers: string[];
  rows: string[][];
  visibleColumnIndices: number[];
}

export interface MssSitesTablePreviewHandle {
  getExcelExportPayload: () => MssSitesTableExcelPayload | null;
}

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

const selectThStyle = {
  ...thStyle,
  textAlign: "center" as const,
  width: 36,
  padding: "8px 6px",
};

const selectTdStyle = {
  ...tdStyle,
  textAlign: "center" as const,
  width: 36,
  padding: "6px",
  verticalAlign: "middle" as const,
};

const copyThStyle = {
  ...thStyle,
  textAlign: "center" as const,
  width: 44,
};

const copyTdStyle = {
  ...tdStyle,
  textAlign: "center" as const,
  width: 44,
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

export const MssSitesTablePreview = forwardRef<MssSitesTablePreviewHandle, MssSitesTablePreviewProps>(
  function MssSitesTablePreview({ table, viewMode, scope }, ref) {
  const scopedRows = useMemo(() => filterRowsByProjectsScope(table.rows, scope), [scope, table.rows]);
  const visibleColumnIndices = useMemo(
    () => getVisibleColumnIndices(table.headers, scope),
    [scope, table.headers],
  );
  const projectTypes = useMemo(() => getProjectTypesFromRows(scopedRows), [scopedRows]);
  const vendors = useMemo(() => getVendorsFromRows(scopedRows), [scopedRows]);
  const workStatuses = useMemo(() => getWorkStatusesFromRows(scopedRows), [scopedRows]);
  const fileIssues = useMemo(() => getFileIssuesFromRows(scopedRows), [scopedRows]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<Set<string>>(() => new Set(projectTypes));
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(() => new Set(vendors));
  const [selectedWorkStatuses, setSelectedWorkStatuses] = useState<Set<string>>(() =>
    getDefaultSelectedWorkStatuses(workStatuses),
  );
  const [selectedFileIssues, setSelectedFileIssues] = useState<Set<string>>(() => new Set(fileIssues));
  const [selectedNonzeroDues, setSelectedNonzeroDues] = useState<Set<string>>(() => new Set());
  const [clientNameQuery, setClientNameQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(() => new Set());
  const [bulkCopied, setBulkCopied] = useState(false);
  const [bulkCopyError, setBulkCopyError] = useState(false);

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
    setSelectedFileIssues(new Set(fileIssues));
  }, [fileIssues]);

  useEffect(() => {
    setSelectedNonzeroDues(new Set());
    setClientNameQuery("");
    setSelectedRowKeys(new Set());
  }, [scope]);

  const filteredRows = useMemo(() => {
    const byVendor = filterRowsByVendors(scopedRows, selectedVendors);
    const byType = filterRowsByProjectTypes(byVendor, selectedProjectTypes);
    const byStatus = filterRowsByWorkStatuses(byType, selectedWorkStatuses);
    const byFileIssue = filterRowsByFileIssues(byStatus, selectedFileIssues);
    const byDues = filterRowsByNonzeroDues(byFileIssue, selectedNonzeroDues, scope);
    const byName = filterRowsByClientName(byDues, clientNameQuery);
    return withSequentialSerialNumbers(byName);
  }, [
    clientNameQuery,
    scopedRows,
    selectedFileIssues,
    selectedNonzeroDues,
    selectedProjectTypes,
    selectedVendors,
    selectedWorkStatuses,
    scope,
  ]);

  const filteredRowKeys = useMemo(
    () => filteredRows.map((row) => getProjectRowKey(table.headers, row)),
    [filteredRows, table.headers],
  );

  useEffect(() => {
    setSelectedRowKeys((current) => {
      if (current.size === 0) return current;
      const visible = new Set(filteredRowKeys);
      let changed = false;
      const next = new Set<string>();
      for (const key of current) {
        if (visible.has(key)) {
          next.add(key);
        } else {
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [filteredRowKeys]);

  useEffect(() => {
    if (!bulkCopied) return undefined;
    const timer = window.setTimeout(() => setBulkCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [bulkCopied]);

  const workStatusAtDefault = workStatusSelectionMatchesDefault(selectedWorkStatuses, workStatuses);
  const fileIssueAtDefault =
    selectedFileIssues.size === fileIssues.length && fileIssues.every((value) => selectedFileIssues.has(value));

  const isFiltered =
    (selectedProjectTypes.size > 0 && selectedProjectTypes.size < projectTypes.length) ||
    (selectedVendors.size > 0 && selectedVendors.size < vendors.length) ||
    !workStatusAtDefault ||
    !fileIssueAtDefault ||
    selectedNonzeroDues.size > 0 ||
    clientNameQuery.trim().length > 0;

  const columnTotals = useMemo(
    () => computeVisibleColumnTotals(table.headers, filteredRows, visibleColumnIndices),
    [filteredRows, table.headers, visibleColumnIndices],
  );

  useImperativeHandle(
    ref,
    () => ({
      getExcelExportPayload: () => {
        if (viewMode !== "table" || filteredRows.length === 0) {
          return null;
        }
        return {
          headers: [...table.headers],
          rows: filteredRows.map((row) => [...row]),
          visibleColumnIndices: [...visibleColumnIndices],
        };
      },
    }),
    [filteredRows, table.headers, viewMode, visibleColumnIndices],
  );

  const clearAllFilters = useCallback(() => {
    setSelectedProjectTypes(new Set(projectTypes));
    setSelectedVendors(new Set(vendors));
    setSelectedWorkStatuses(getDefaultSelectedWorkStatuses(workStatuses));
    setSelectedFileIssues(new Set(fileIssues));
    setSelectedNonzeroDues(new Set());
    setClientNameQuery("");
  }, [fileIssues, projectTypes, vendors, workStatuses]);

  const applySheetTabShortcut = useCallback(
    (shortcut: ProjectSheetTabShortcut) => {
      // Register pills should only affect the register filter.
      setSelectedProjectTypes(new Set([shortcut.projectType]));
    },
    [],
  );

  const clearSheetTabShortcut = useCallback(() => {
    setSelectedVendors(new Set(vendors));
    setSelectedProjectTypes(new Set(projectTypes));
  }, [projectTypes, vendors]);

  const selectedVisibleCount = useMemo(() => {
    let count = 0;
    for (const key of filteredRowKeys) {
      if (selectedRowKeys.has(key)) count += 1;
    }
    return count;
  }, [filteredRowKeys, selectedRowKeys]);

  const allFilteredSelected =
    filteredRowKeys.length > 0 && selectedVisibleCount === filteredRowKeys.length;
  const someFilteredSelected = selectedVisibleCount > 0 && !allFilteredSelected;

  const toggleRowSelected = useCallback((key: string) => {
    setSelectedRowKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setBulkCopyError(false);
  }, []);

  const toggleSelectAllFiltered = useCallback(() => {
    setSelectedRowKeys((current) => {
      if (filteredRowKeys.length === 0) return current;
      const allSelected = filteredRowKeys.every((key) => current.has(key));
      if (allSelected) {
        const next = new Set(current);
        for (const key of filteredRowKeys) next.delete(key);
        return next;
      }
      const next = new Set(current);
      for (const key of filteredRowKeys) next.add(key);
      return next;
    });
    setBulkCopyError(false);
  }, [filteredRowKeys]);

  const clearRowSelection = useCallback(() => {
    setSelectedRowKeys(new Set());
    setBulkCopyError(false);
  }, []);

  const handleBulkCopy = useCallback(async () => {
    const rowsToCopy = filteredRows.filter((row) =>
      selectedRowKeys.has(getProjectRowKey(table.headers, row)),
    );
    const result = buildBulkProjectRowsCopyText(rowsToCopy);
    if (!result.text.trim()) {
      setBulkCopyError(true);
      setBulkCopied(false);
      return;
    }
    try {
      await copyTextToClipboard(result.text);
      setBulkCopied(true);
      setBulkCopyError(false);
    } catch {
      setBulkCopyError(true);
      setBulkCopied(false);
    }
  }, [filteredRows, selectedRowKeys, table.headers]);

  const vendorFilterActive = selectedVendors.size > 0 && selectedVendors.size < vendors.length;
  const partnerFilterActive = selectedProjectTypes.size > 0 && selectedProjectTypes.size < projectTypes.length;
  const statusFilterActive = !workStatusAtDefault;
  const fileIssueFilterActive = !fileIssueAtDefault;
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
                  <span className="mss-sites-source-badge mss-sites-source-badge--mss">MSS New / res / CALL</span>
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
              ) : scope === "satyanarayan" ? (
                <>
                  <span className="mss-sites-source-badge mss-sites-source-badge--partner">Satyanarayan Ji</span>
                  <span className="mss-sites-source-badge mss-sites-source-badge--mss">MSS</span>
                </>
              ) : scope === "rjgreen" ? (
                <>
                  <span className="mss-sites-source-badge mss-sites-source-badge--partner">RJ Green</span>
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

          <div className="mss-sites-preview-toolbar-actions no-print">
            {viewMode === "table" && selectedVisibleCount > 0 ? (
              <>
                <button
                  type="button"
                  className={`mss-sites-bulk-copy${bulkCopied ? " mss-sites-bulk-copy--copied" : ""}`}
                  onClick={() => void handleBulkCopy()}
                  title="Copy Maps link, name, kW/PH, contact for selected sites"
                >
                  {bulkCopied ? <Check size={14} strokeWidth={2.5} aria-hidden /> : <Copy size={14} aria-hidden />}
                  {bulkCopied ? "Copied" : `Copy selected (${selectedVisibleCount})`}
                </button>
                <button type="button" className="mss-sites-clear-filters" onClick={clearRowSelection}>
                  Clear selection
                </button>
              </>
            ) : null}
            {isFiltered ? (
              <button type="button" className="mss-sites-clear-filters" onClick={clearAllFilters}>
                <RotateCcw size={14} aria-hidden />
                Clear filters
              </button>
            ) : null}
            {bulkCopyError ? <span className="mss-sites-bulk-copy-error">Nothing to copy</span> : null}
          </div>
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
            label="File issue"
            options={fileIssues}
            selected={selectedFileIssues}
            onChange={setSelectedFileIssues}
            allSummaryLabel="All file issues"
            emptyOptionsLabel="No file issues"
            isActive={fileIssueFilterActive}
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
          selectedProjectTypes={selectedProjectTypes}
          onSelectShortcut={applySheetTabShortcut}
          onClearShortcut={clearSheetTabShortcut}
        />
      </div>

      <div className={`mss-sites-table-wrap${viewMode === "map" ? " mss-sites-table-wrap--map" : ""}`}>
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
        ) : viewMode === "map" ? (
          <ProjectsMapView
            headers={table.headers}
            rows={filteredRows}
            totalFilteredCount={filteredRows.length}
          />
        ) : (
          <table className="mss-sites-table">
            <thead>
              <tr>
                <th className="mss-sites-table-select-col" style={selectThStyle}>
                  <input
                    type="checkbox"
                    className="mss-sites-row-checkbox"
                    checked={allFilteredSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someFilteredSelected;
                    }}
                    onChange={toggleSelectAllFiltered}
                    aria-label={allFilteredSelected ? "Deselect all visible projects" : "Select all visible projects"}
                    title={allFilteredSelected ? "Deselect all" : "Select all"}
                  />
                </th>
                <th className="mss-sites-table-copy-col" style={copyThStyle} aria-label="Copy site details">
                  <span className="mss-sites-table-copy-heading">Copy</span>
                </th>
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
                <td className="mss-sites-table-select-col" style={{ ...totalsTdStyle, textAlign: "center" }}>
                  —
                </td>
                <td className="mss-sites-table-copy-col" style={{ ...totalsTdStyle, textAlign: "center" }}>
                  —
                </td>
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
              {filteredRows.map((row, rowIndex) => {
                const rowKey = filteredRowKeys[rowIndex] ?? getProjectRowKey(table.headers, row);
                const isSelected = selectedRowKeys.has(rowKey);
                return (
                  <tr
                    key={rowKey || `row-${rowIndex}`}
                    className={isSelected ? "mss-sites-table-row--selected" : undefined}
                    style={{ background: isSelected ? "#eef2ff" : rowIndex % 2 === 0 ? "#ffffff" : "#f8fafc" }}
                  >
                    <td className="mss-sites-table-select-col" style={selectTdStyle}>
                      <input
                        type="checkbox"
                        className="mss-sites-row-checkbox"
                        checked={isSelected}
                        onChange={() => toggleRowSelected(rowKey)}
                        aria-label={`Select project ${row[PROJECT_S_NO_COLUMN_INDEX] || rowIndex + 1}`}
                      />
                    </td>
                    <td className="mss-sites-table-copy-col" style={copyTdStyle}>
                      <ProjectRowCopyCell row={row} />
                    </td>
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});
