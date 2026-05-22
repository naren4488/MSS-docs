import type { AgreementCompany, AgreementData, AgreementParty } from "../types/agreement";

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

export function buildPlaceholderScope(data: AgreementData) {
  return {
    company: data.company as unknown as Record<string, unknown>,
    party: data.party as unknown as Record<string, unknown>,
    var: data.variables as unknown as Record<string, unknown>,
    title: data.title,
    effectiveDate: data.effectiveDate,
    effectiveDateFormatted: data.effectiveDate ? formatDate(data.effectiveDate) : "",
  } as Record<string, unknown>;
}

export function fillTemplate(input: string, data: AgreementData): string {
  if (!input) {
    return "";
  }

  const scope = buildPlaceholderScope(data);

  return input.replace(PLACEHOLDER_PATTERN, (_match, path: string) => {
    const value = readPath(scope, path).trim();
    return value || "___________";
  });
}

export function partyAddressLine(party: AgreementParty): string {
  return [party.entityName, party.address].filter(Boolean).join(", ");
}

export function companyAddressLine(company: AgreementCompany): string {
  return [company.name, company.address].filter(Boolean).join(", ");
}

export function joinNonEmpty(values: (string | undefined)[], sep: string) {
  return values.filter((value) => value && value.trim()).join(sep);
}

export function placeholderOr(value: string) {
  return filledValue(value);
}
