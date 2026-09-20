import { useMemo, useState } from "react";
import { CalendarDays, Check, Copy, RotateCcw, UserRound, Zap } from "lucide-react";
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
  enquiryStatusTone,
  formatEnquiriesExportText,
  formatEnquiryExportText,
  formatKwLabel,
  visitStatusTone,
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

function notesLines(raw: string): string[] {
  return raw
    .split(/\r\n|\r|\n/)
    .map((line) => line.replace(/^[\s•\-–—*]+/, "").trim())
    .filter(Boolean);
}

/** Prefer sheet newlines; also split multiple numbers jammed on one line. */
function contactLines(raw: string): string[] {
  const fromNewlines = raw
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (fromNewlines.length > 1) return fromNewlines;

  const single = fromNewlines[0] ?? raw.trim();
  if (!single) return [];

  const parts = single
    .split(/[,;/|]+|\s{2,}|\s+(?=\d{8,}\b)/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [single];
}

function NotesCell({ value }: { value: string }) {
  const lines = notesLines(value);
  if (lines.length === 0) return <>{"—"}</>;
  if (lines.length === 1) return <>{lines[0]}</>;
  return (
    <ul className="enquiries-notes-list">
      {lines.map((line, index) => (
        <li key={`${index}-${line.slice(0, 24)}`}>{line}</li>
      ))}
    </ul>
  );
}

function ContactCell({ value }: { value: string }) {
  const lines = contactLines(value);
  if (lines.length === 0) return <>{"—"}</>;
  if (lines.length === 1) return <>{lines[0]}</>;
  return (
    <div className="enquiries-contact-stack">
      {lines.map((line, index) => (
        <span key={`${index}-${line}`}>{line}</span>
      ))}
    </div>
  );
}

function VisitInfoCell({
  date,
  who,
  variant,
}: {
  date: string;
  who: string;
  variant: "visit" | "followup";
}) {
  const dateText = date.trim();
  const whoText = who.trim();
  if (!dateText && !whoText) {
    return <span className="enquiries-meta-empty">—</span>;
  }
  return (
    <div className={`enquiries-meta-card enquiries-meta-card--${variant}`}>
      {dateText ? (
        <div className="enquiries-meta-date">
          <CalendarDays size={11} aria-hidden />
          <span>{dateText}</span>
        </div>
      ) : null}
      {whoText ? (
        <div className="enquiries-meta-person">
          <UserRound size={11} aria-hidden />
          <span>{whoText}</span>
        </div>
      ) : null}
    </div>
  );
}

function EnquiryInfoCell({
  date,
  status,
  statusTone,
}: {
  date: string;
  status: string;
  statusTone: ReturnType<typeof enquiryStatusTone>;
}) {
  const dateText = date.trim();
  const statusText = status.trim();
  if (!dateText && !statusText) {
    return <span className="enquiries-meta-empty">—</span>;
  }
  return (
    <div className={`enquiries-meta-card enquiries-meta-card--enquiry enquiries-meta-card--${statusTone}`}>
      {dateText ? (
        <div className="enquiries-meta-date">
          <CalendarDays size={11} aria-hidden />
          <span>{dateText}</span>
        </div>
      ) : null}
      {statusText ? (
        <span className={`enquiries-status-badge enquiries-status-badge--${statusTone}`}>{statusText}</span>
      ) : null}
    </div>
  );
}

function formatPhaseLabel(phase: string): string {
  const trimmed = phase.trim();
  if (!trimmed) return "";
  if (/ph/i.test(trimmed)) return trimmed.replace(/\s+/g, "").toUpperCase();
  return `${trimmed} PH`;
}

function PlantSizeCell({ kw, phase }: { kw: string; phase: string }) {
  const kwText = formatKwLabel(kw);
  const phaseText = formatPhaseLabel(phase);
  if (!kwText && !phaseText) {
    return <span className="enquiries-meta-empty">—</span>;
  }
  return (
    <div className="enquiries-meta-card enquiries-meta-card--plant">
      {kwText ? (
        <div className="enquiries-meta-date">
          <Zap size={11} aria-hidden />
          <span>{kwText}</span>
        </div>
      ) : null}
      {phaseText ? <span className="enquiries-phase-badge">{phaseText}</span> : null}
    </div>
  );
}

function VisitStatusBadge({ value }: { value: string }) {
  const text = value.trim();
  if (!text) return <span className="enquiries-meta-empty">—</span>;
  const tone = visitStatusTone(text);
  return <span className={`enquiries-visit-badge enquiries-visit-badge--${tone}`}>{text}</span>;
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
  const whoVisitedIndex = columnIndex(table.headers, "Who visited");
  const followUpPersonIndex = columnIndex(table.headers, "Follow up person");
  const phaseIndex = columnIndex(table.headers, "Phase");

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
            <span className="enquiries-status-badge enquiries-status-badge--converted">Converted</span>
            <span className="enquiries-status-badge enquiries-status-badge--progress">In Progress</span>
            <span className="enquiries-status-badge enquiries-status-badge--new">New</span>
            <span className="enquiries-status-badge enquiries-status-badge--lost">Lost</span>
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
                {visibleIndices.map((index) => {
                  const header = table.headers[index];
                  const isContact = header === "Contact";
                  const isVisit = header === "Visit date";
                  const isFollowUp = header === "Follow up date";
                  const isEnquiry = header === "Enquiry date";
                  const isPlant = header === "kW";
                  const pairedHeader = isEnquiry
                    ? "Enquiry"
                    : isVisit
                      ? "Visit"
                      : isFollowUp
                        ? "Follow up"
                        : isPlant
                          ? "Plant"
                          : header;
                  return (
                    <th
                      key={header}
                      style={{
                        ...thStyle,
                        ...(isContact ? { width: 96, maxWidth: 96 } : null),
                        ...(isVisit || isFollowUp || isEnquiry || isPlant ? { minWidth: 110 } : null),
                      }}
                    >
                      {pairedHeader}
                    </th>
                  );
                })}
                <th style={{ ...thStyle, textAlign: "center", width: 56 }}>More</th>
                <th style={{ ...thStyle, textAlign: "center", width: 44 }}>Export</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIndex) => {
                const id = enquiryRowStableId(table.headers, row);
                const status = statusIndex >= 0 ? row[statusIndex] ?? "" : "";
                const statusTone = enquiryStatusTone(status);
                const selected = selectedIds.has(id);
                return (
                  <tr
                    key={`${id}-${rowIndex}`}
                    className={[
                      "enquiries-row",
                      rowIndex % 2 === 1 ? "enquiries-row--alt" : "",
                      selected ? "enquiries-row--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
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
                      const isContact = header === "Contact";
                      const isVisit = header === "Visit date";
                      const isFollowUp = header === "Follow up date";
                      const isEnquiry = header === "Enquiry date";
                      const isVisitStatus = header === "Visit status";
                      const raw = row[index]?.trim() ?? "";
                      const whoVisited =
                        whoVisitedIndex >= 0 ? row[whoVisitedIndex]?.trim() ?? "" : "";
                      const followUpPerson =
                        followUpPersonIndex >= 0 ? row[followUpPersonIndex]?.trim() ?? "" : "";
                      const phase =
                        phaseIndex >= 0 ? row[phaseIndex]?.trim() ?? "" : "";
                      const display = raw || "—";
                      return (
                        <td
                          key={header}
                          style={{
                            ...tdStyle,
                            textAlign: header === "S No" ? "center" : "left",
                            maxWidth: isNotes ? 240 : isContact ? 96 : undefined,
                            width: isContact ? 96 : undefined,
                          }}
                        >
                          {isEnquiry ? (
                            <EnquiryInfoCell date={raw} status={status} statusTone={statusTone} />
                          ) : isKw ? (
                            <PlantSizeCell kw={raw} phase={phase} />
                          ) : isVisitStatus ? (
                            <VisitStatusBadge value={raw} />
                          ) : isNotes ? (
                            <NotesCell value={raw} />
                          ) : isContact ? (
                            <ContactCell value={raw} />
                          ) : isVisit ? (
                            <VisitInfoCell date={raw} who={whoVisited} variant="visit" />
                          ) : isFollowUp ? (
                            <VisitInfoCell date={raw} who={followUpPerson} variant="followup" />
                          ) : (
                            display
                          )}
                        </td>
                      );
                    })}
                    <td style={{ ...tdStyle, textAlign: "center", width: 56, verticalAlign: "middle" }}>
                      <ProjectRowMoreCell fields={moreFieldsForRow(table.headers, row)} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center", width: 44, verticalAlign: "middle" }}>
                      <button
                        type="button"
                        className="enquiries-export-row"
                        title={copiedId === id ? "Copied" : "Copy enquiry details"}
                        aria-label={copiedId === id ? "Copied" : "Copy enquiry details"}
                        onClick={() => void exportOne(row, id)}
                      >
                        {copiedId === id ? <Check size={14} /> : <Copy size={14} />}
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
