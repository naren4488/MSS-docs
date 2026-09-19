import { useMemo, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { ProjectRowMoreCell } from "@/features/mss-sites/components/ProjectRowMoreCell";
import { ClientNameSearch } from "@/features/mss-sites/components/ClientNameSearch";
import { ProjectsMultiselectFilter } from "@/features/mss-sites/components/ProjectsMultiselectFilter";
import {
  columnIndex,
  createDefaultFilterSets,
  ENQUIRY_FILTER_COLUMNS,
  filterRowsByClientName,
  filterRowsBySelectedValues,
  getFilterOptions,
  moreFieldsForRow,
  visibleColumnIndices,
  withSequentialSerialNumbers,
} from "../lib/enquiries-columns";
import {
  enquiryRowStableId,
  enquiryStatusRowBackground,
  formatEnquiriesExportText,
  formatEnquiryExportText,
} from "../lib/enquiry-export";
import type { EnquiryFilterColumn } from "../lib/enquiries-config";
import type { EnquiriesTable } from "../types/enquiries";

interface EnquiriesTablePreviewProps {
  table: EnquiriesTable;
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

const FILTER_LABELS: Record<EnquiryFilterColumn, string> = {
  "Enquiry status": "Enquiry status",
  "Visit status": "Visit status",
  "Source type": "Source type",
  "Lead assigned": "Lead assigned",
  "Deal done": "Deal done",
  Documents: "Documents",
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function EnquiriesTablePreview({ table }: EnquiriesTablePreviewProps) {
  const [clientNameQuery, setClientNameQuery] = useState("");
  const [filterSets, setFilterSets] = useState(() => createDefaultFilterSets(table));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bulkCopied, setBulkCopied] = useState(false);

  const filterOptions = useMemo(() => {
    const map = {} as Record<EnquiryFilterColumn, string[]>;
    for (const column of ENQUIRY_FILTER_COLUMNS) {
      map[column] = getFilterOptions(table, column);
    }
    return map;
  }, [table]);

  const filteredRows = useMemo(() => {
    let rows = table.rows;
    for (const column of ENQUIRY_FILTER_COLUMNS) {
      rows = filterRowsBySelectedValues(table.headers, rows, column, filterSets[column], filterOptions[column]);
    }
    rows = filterRowsByClientName(table.headers, rows, clientNameQuery);
    return withSequentialSerialNumbers(table.headers, rows);
  }, [table, filterSets, filterOptions, clientNameQuery]);

  const visibleIndices = useMemo(() => visibleColumnIndices(table.headers), [table.headers]);
  const statusIndex = columnIndex(table.headers, "Enquiry status");

  const filteredIds = useMemo(
    () => filteredRows.map((row) => enquiryRowStableId(table.headers, row)),
    [filteredRows, table.headers],
  );

  const selectedVisibleCount = useMemo(
    () => filteredIds.filter((id) => selectedIds.has(id)).length,
    [filteredIds, selectedIds],
  );

  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  const filtersActive = useMemo(() => {
    if (clientNameQuery.trim()) return true;
    return ENQUIRY_FILTER_COLUMNS.some(
      (column) => filterSets[column].size !== filterOptions[column].length,
    );
  }, [clientNameQuery, filterSets, filterOptions]);

  function clearFilters() {
    setClientNameQuery("");
    setFilterSets(createDefaultFilterSets(table));
  }

  function updateFilter(column: EnquiryFilterColumn, next: Set<string>) {
    setFilterSets((prev) => ({ ...prev, [column]: next }));
  }

  function toggleRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        for (const id of filteredIds) next.delete(id);
      } else {
        for (const id of filteredIds) next.add(id);
      }
      return next;
    });
  }

  async function exportOne(row: string[], id: string) {
    const text = formatEnquiryExportText(table.headers, row);
    if (!text) return;
    await copyText(text);
    setCopiedId(id);
    setBulkCopied(false);
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1600);
  }

  async function exportSelected() {
    const rows = filteredRows.filter((row) => selectedIds.has(enquiryRowStableId(table.headers, row)));
    const text = formatEnquiriesExportText(table.headers, rows);
    if (!text) return;
    await copyText(text);
    setBulkCopied(true);
    setCopiedId(null);
    window.setTimeout(() => setBulkCopied(false), 1600);
  }

  return (
    <div className="mss-sites-preview" id="enquiries-preview">
      <div className="mss-sites-preview-header no-print">
        <div className="mss-sites-preview-toolbar">
          <div className="mss-sites-preview-stats">
            <p className="mss-sites-preview-count">
              <span className="mss-sites-preview-value">{filteredRows.length}</span>
              <span className="mss-sites-preview-total"> / {table.rows.length}</span>
              <span className="mss-sites-preview-label"> enquiries</span>
            </p>
            <div className="mss-sites-preview-sources">
              <span className="mss-sites-source-badge mss-sites-source-badge--mss">Sep Updated</span>
            </div>
            {filtersActive ? (
              <button type="button" className="mss-sites-clear-filters" onClick={clearFilters}>
                <RotateCcw size={14} />
                Clear filters
              </button>
            ) : null}
            <div className="enquiries-export-actions">
              <button
                type="button"
                className="ghost-button enquiries-export-bulk"
                disabled={selectedVisibleCount === 0}
                onClick={() => void exportSelected()}
              >
                {bulkCopied ? <Check size={14} /> : <Copy size={14} />}
                {bulkCopied
                  ? "Copied"
                  : selectedVisibleCount > 0
                    ? `Copy selected (${selectedVisibleCount})`
                    : "Copy selected"}
              </button>
            </div>
          </div>
          <div className="enquiries-status-legend" aria-label="Enquiry status colours">
            <span className="enquiries-status-swatch enquiries-status-swatch--converted">Converted</span>
            <span className="enquiries-status-swatch enquiries-status-swatch--progress">In Progress</span>
            <span className="enquiries-status-swatch enquiries-status-swatch--new">New</span>
            <span className="enquiries-status-swatch enquiries-status-swatch--lost">Lost</span>
          </div>
        </div>

        <div className="mss-sites-preview-filters">
          <ClientNameSearch
            value={clientNameQuery}
            onChange={setClientNameQuery}
            isActive={Boolean(clientNameQuery.trim())}
          />
          {ENQUIRY_FILTER_COLUMNS.map((column) => (
            <ProjectsMultiselectFilter
              key={column}
              label={FILTER_LABELS[column]}
              options={filterOptions[column]}
              selected={filterSets[column]}
              onChange={(next) => updateFilter(column, next)}
              isActive={filterSets[column].size !== filterOptions[column].length}
              allSummaryLabel="All"
            />
          ))}
        </div>
      </div>

      <div className="mss-sites-table-wrap">
        {filteredRows.length === 0 ? (
          <div className="projects-empty-filter">
            <p className="projects-empty-filter-title">No enquiries match</p>
            <p className="projects-empty-filter-text">Clear or widen filters to see rows again.</p>
          </div>
        ) : (
          <table className="mss-sites-table enquiries-table">
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: "center", width: 36 }}>
                  <input
                    type="checkbox"
                    className="enquiries-row-check"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                    aria-label="Select all visible enquiries"
                  />
                </th>
                {visibleIndices.map((index) => (
                  <th key={table.headers[index]} style={thStyle}>
                    {table.headers[index]}
                  </th>
                ))}
                <th style={{ ...thStyle, textAlign: "center", width: 56 }}>More</th>
                <th style={{ ...thStyle, textAlign: "center", width: 72 }}>Export</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIndex) => {
                const id = enquiryRowStableId(table.headers, row);
                const status = statusIndex >= 0 ? row[statusIndex] ?? "" : "";
                const selected = selectedIds.has(id);
                return (
                  <tr
                    key={`${id}-${rowIndex}`}
                    className={selected ? "enquiries-row--selected" : undefined}
                    style={{ background: enquiryStatusRowBackground(status) }}
                  >
                    <td style={{ ...tdStyle, textAlign: "center", width: 36, verticalAlign: "middle" }}>
                      <input
                        type="checkbox"
                        className="enquiries-row-check"
                        checked={selected}
                        onChange={() => toggleRow(id)}
                        aria-label={`Select enquiry ${row[0] || rowIndex + 1}`}
                      />
                    </td>
                    {visibleIndices.map((index) => {
                      const header = table.headers[index];
                      const isNotes = header === "Notes";
                      const isKw = header === "kW";
                      const raw = row[index]?.trim() ?? "";
                      // Keep kW strings like "3+5" as-is; never replace with an em dash.
                      const display = isKw ? raw : raw || "—";
                      return (
                        <td
                          key={header}
                          style={{
                            ...tdStyle,
                            textAlign: header === "S No" ? "center" : "left",
                            whiteSpace: isNotes ? "pre-wrap" : undefined,
                            maxWidth: isNotes ? 220 : undefined,
                          }}
                        >
                          {display}
                        </td>
                      );
                    })}
                    <td style={{ ...tdStyle, textAlign: "center", width: 56, verticalAlign: "middle" }}>
                      <ProjectRowMoreCell fields={moreFieldsForRow(table.headers, row)} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center", width: 72, verticalAlign: "middle" }}>
                      <button
                        type="button"
                        className="enquiries-export-row"
                        title="Copy enquiry details"
                        onClick={() => void exportOne(row, id)}
                      >
                        {copiedId === id ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedId === id ? "Copied" : "Copy"}</span>
                      </button>
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
}
