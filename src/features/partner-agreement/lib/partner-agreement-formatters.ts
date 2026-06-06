import type { PartnerAgreementData } from "../types/partner-agreement";

export { formatDate, filledValue, formatRecordDate } from "@/features/offer-letter/lib/offer-letter-formatters";

import { filledValue, formatDate } from "@/features/offer-letter/lib/offer-letter-formatters";

const PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

function readPath(scope: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let cursor: unknown = scope;
  for (const part of parts) {
    if (cursor && typeof cursor === "object" && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return "";
    }
  }
  return cursor == null ? "" : String(cursor);
}

export function buildPlaceholderScope(data: PartnerAgreementData) {
  return {
    company: data.company as unknown as Record<string, unknown>,
    party: data.party as unknown as Record<string, unknown>,
    var: data.variables as unknown as Record<string, unknown>,
    title: data.title,
    effectiveDate: data.effectiveDate,
    effectiveDateFormatted: data.effectiveDate ? formatDate(data.effectiveDate) : "",
  } as Record<string, unknown>;
}

export function fillTemplate(input: string, data: PartnerAgreementData): string {
  if (!input) {
    return "";
  }

  const scope = buildPlaceholderScope(data);

  return input.replace(PLACEHOLDER_PATTERN, (_match, path: string) => {
    const value = readPath(scope, path).trim();
    return value || "___________";
  });
}

/**
 * Formats a rate card price. If the value is a plain number (optionally with
 * grouping commas) it is rendered as Indian Rupees with no decimals; otherwise
 * the raw string is returned so partners can type free-form rates.
 */
export function formatRate(price: string): string {
  const trimmed = (price ?? "").trim();
  if (!trimmed) {
    return "—";
  }

  const numeric = Number(trimmed.replace(/[,\s₹]/g, ""));
  if (Number.isFinite(numeric) && numeric > 0 && /^[₹]?[\d,\s]+$/.test(trimmed)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return trimmed;
}

export function placeholderOr(value: string) {
  return filledValue(value);
}
