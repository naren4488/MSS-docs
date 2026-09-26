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

export function partyAddressWithPan(
  party: Pick<AgreementParty, "address" | "pan">,
  language: AgreementData["language"] = "en",
): string {
  const address = party.address?.trim() ?? "";
  const pan = party.pan?.trim() ?? "";
  if (!pan) {
    return address;
  }
  const label = language === "hi" ? "पैन" : "PAN";
  const clause = `(**${label}: ${pan}**)`;
  return address ? `${address} ${clause}` : clause;
}

export function buildPlaceholderScope(data: AgreementData) {
  return {
    company: data.company as unknown as Record<string, unknown>,
    party: {
      ...(data.party as unknown as Record<string, unknown>),
      addressWithPan: partyAddressWithPan(data.party, data.language),
    },
    var: data.variables as unknown as Record<string, unknown>,
    vendorChargePerWatt: data.vendorChargePerWatt,
    referralCommissionAmount: data.referralCommissionAmount,
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
  const templateAlreadyHasPan =
    /\{\{\s*party\.pan\s*\}\}/.test(input) || /\{\{\s*party\.addressWithPan\s*\}\}/.test(input);

  return input.replace(PLACEHOLDER_PATTERN, (_match, path: string) => {
    let value = readPath(scope, path).trim();

    // Legacy intros only used {{party.address}} — append PAN when filled.
    if (path === "party.address" && !templateAlreadyHasPan) {
      const pan = readPath(scope, "party.pan").trim();
      if (pan) {
        value = partyAddressWithPan({ address: value, pan }, data.language);
      }
    }

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

/** Format a rupee amount stored as digits (e.g. "170000" → "₹1,70,000"). */
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
