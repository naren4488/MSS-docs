import { columnIndex } from "./enquiries-columns";
import type { EnquiryColumn } from "./enquiries-config";

function cell(headers: readonly string[], row: string[], column: EnquiryColumn): string {
  const index = columnIndex(headers, column);
  if (index < 0) return "";
  return row[index]?.trim() ?? "";
}

function joinPresent(parts: string[], sep: string): string {
  return parts.map((part) => part.trim()).filter(Boolean).join(sep);
}

/** Single value → "3 kW"; compound like 3+5 → "(3+5) kW". Keeps the sheet string as-is. */
export function formatKwLabel(kw: string): string {
  const trimmed = kw.trim();
  if (!trimmed) return "";
  if (/kw/i.test(trimmed)) return trimmed;

  const isCompound = /[+/&,]/.test(trimmed) || /\d\s*-\s*\d/.test(trimmed);
  if (isCompound && !/^\d+(\.\d+)?$/.test(trimmed)) {
    const inner = trimmed.replace(/^\(|\)$/g, "");
    return `(${inner}) kW`;
  }

  return `${trimmed} kW`;
}

function formatKwPhase(kw: string, phase: string): string {
  const kwPart = formatKwLabel(kw);
  const phasePart = phase ? (/ph/i.test(phase) ? phase.trim() : `${phase.trim()} PH`) : "";
  return joinPresent([kwPart, phasePart], ", ");
}

/** One enquiry → copyable text. Skips empty fields / empty lines. */
export function formatEnquiryExportText(headers: readonly string[], row: string[]): string {
  const name = cell(headers, row, "Client name");
  const contact = cell(headers, row, "Contact");
  const location = cell(headers, row, "Location");
  const kw = cell(headers, row, "kW");
  const phase = cell(headers, row, "Phase");
  const geo = cell(headers, row, "Geo location");

  const lines: string[] = [];
  const line1 = joinPresent([name, contact, location], ", ");
  if (line1) lines.push(line1);

  const line2 = formatKwPhase(kw, phase);
  if (line2) lines.push(line2);

  if (geo) lines.push(geo);

  return lines.join("\n");
}

export function formatEnquiriesExportText(headers: readonly string[], rows: string[][]): string {
  return rows
    .map((row) => formatEnquiryExportText(headers, row))
    .filter((block) => block.length > 0)
    .join("\n\n");
}

export function enquiryRowStableId(headers: readonly string[], row: string[]): string {
  return [
    cell(headers, row, "Client name"),
    cell(headers, row, "Contact"),
    cell(headers, row, "Enquiry date"),
    cell(headers, row, "Location"),
    cell(headers, row, "Geo location"),
  ].join("|");
}

/** Row backgrounds by enquiry status (tinted enough to read at a glance). */
export function enquiryStatusRowBackground(status: string): string {
  const key = status.trim().toLowerCase();
  if (key === "converted") return "#bbf7d0";
  if (key === "in progress") return "#bfdbfe";
  if (key === "lost") return "#fecaca";
  if (key === "new") return "#ddd6fe";
  return "#ffffff";
}
