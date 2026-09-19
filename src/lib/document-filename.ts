const ILLEGAL_FILENAME_CHARS = /[\\/:*?"<>|]/g;

function collapse(value: string): string {
  return value.replace(ILLEGAL_FILENAME_CHARS, " ").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim().replace(/\.+$/, "");
}

function isShouting(value: string): boolean {
  const letters = value.replace(/[^A-Za-z]/g, "");
  return letters.length >= 4 && letters === letters.toUpperCase();
}

/** `{subject} - {brand} {document}`. Omits the subject when it is empty. Brand defaults to MSS. */
export function documentDownloadName(subject: string, documentName: string, brand = "MSS"): string {
  const who = readableName(subject);
  const what = readableName(documentName) || "Document";
  const prefix = collapse(brand) || "MSS";
  if (!who) return `${prefix} ${what}`;
  return `${who} - ${prefix} ${what}`;
}

export function readableName(value: string): string {
  const cleaned = collapse(value);
  if (!cleaned || !isShouting(cleaned)) return cleaned;
  return cleaned
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** `5 KW` / `5KW` / `5 kW` → `5KW`. Empty when there is no number. */
export function capacityFileLabel(capacity: string): string {
  const stripped = capacity.replace(/\s*[13]\s*PH\s*$/i, "").replace(/\s*[13]\s*Phase\s*$/i, "").trim();
  const match = stripped.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) return "";
  return `${String(Number(match[1]))}KW`;
}

/** `3PH`, `3 Phase`, and `Three phase` all become `3PH`. */
export function phaseFileLabel(phase: string): string {
  const compact = phase.replace(/\s+/g, "").toUpperCase();
  if (!compact) return "";
  if (compact === "1PH" || compact === "1PHASE" || compact.startsWith("SINGLE")) return "1PH";
  if (compact === "3PH" || compact === "3PHASE" || compact.startsWith("THREE")) return "3PH";
  return collapse(phase).replace(/\s+/g, "");
}

export function plantDocumentName(prefixParts: string[], documentName: string): string {
  return [...prefixParts.filter(Boolean), documentName].join(" ");
}
