import { resolveGpsMapsUrl } from "./gps-maps-url";
import { PROJECT_TABLE_HEADERS } from "./projects-columns";

const NAME_INDEX = PROJECT_TABLE_HEADERS.indexOf("NAME");
const KW_INDEX = PROJECT_TABLE_HEADERS.indexOf("KW");
const PH_INDEX = PROJECT_TABLE_HEADERS.indexOf("PH");
const MOBILE_INDEX = PROJECT_TABLE_HEADERS.indexOf("MOBILE");
const GPS_INDEX = PROJECT_TABLE_HEADERS.indexOf("GPS / LINK");

export type ProjectRowCopyFieldKey = "maps" | "name" | "system" | "contact";

export interface ProjectRowCopyPayload {
  mapsUrl: string;
  name: string;
  system: string;
  contact: string;
  /** Clipboard body — only non-empty lines, in share order. */
  text: string;
  missing: ProjectRowCopyFieldKey[];
}

const FIELD_LABELS: Record<ProjectRowCopyFieldKey, string> = {
  maps: "Google Maps location",
  name: "Client name",
  system: "kW / phase",
  contact: "Contact details",
};

export function projectRowCopyFieldLabel(key: ProjectRowCopyFieldKey): string {
  return FIELD_LABELS[key];
}

function cell(row: readonly string[], index: number): string {
  if (index < 0 || index >= row.length) {
    return "";
  }
  return (row[index] ?? "").trim();
}

function formatSystemLine(kw: string, ph: string): string {
  const parts = [kw, ph].filter(Boolean);
  return parts.join(" · ");
}

export function buildProjectRowCopyPayload(row: readonly string[]): ProjectRowCopyPayload {
  const gpsRaw = cell(row, GPS_INDEX);
  const mapsUrl = resolveGpsMapsUrl(gpsRaw) ?? "";
  const name = cell(row, NAME_INDEX);
  const system = formatSystemLine(cell(row, KW_INDEX), cell(row, PH_INDEX));
  const contact = cell(row, MOBILE_INDEX);

  const missing: ProjectRowCopyFieldKey[] = [];
  if (!mapsUrl) missing.push("maps");
  if (!name) missing.push("name");
  if (!system) missing.push("system");
  if (!contact) missing.push("contact");

  const text = [mapsUrl, name, system, contact].filter((line) => line.length > 0).join("\n");

  return { mapsUrl, name, system, contact, text, missing };
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
