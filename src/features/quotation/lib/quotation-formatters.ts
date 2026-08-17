export { formatDate, filledValue, formatRecordDate } from "@/features/offer-letter/lib/offer-letter-formatters";
import type { QuotationCommercialRow, QuotationData, QuotationLanguage } from "../types/quotation";
import { quotationLabels } from "./quotation-labels";

export function parseNum(value: string): number {
  const n = Number(String(value ?? "").replace(/[,\s₹]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Formats a plain rupee number with Indian grouping; passes through free text. */
export function formatMoneyLoose(value: string): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return "—";
  }
  const numeric = parseNum(trimmed);
  if (numeric > 0 && /^[₹]?[\d,\s]+$/.test(trimmed)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numeric);
  }
  return trimmed;
}

export function isProjectPriceParameter(parameter: string) {
  const value = parameter.trim().toLowerCase();
  return value === "project price" || parameter.includes("प्रोजेक्ट मूल्य");
}

export function isCustomerNetPayableParameter(parameter: string) {
  const value = parameter.trim().toLowerCase();
  return value.includes("customer net payable") || parameter.includes("ग्राहक नेट देय");
}

/** Price rows are derived from projectAmount — keep them out of the editable table. */
export function stripSyncedCommercialRows(rows: QuotationCommercialRow[]) {
  return rows.filter(
    (row) => !isProjectPriceParameter(row.parameter) && !isCustomerNetPayableParameter(row.parameter),
  );
}

export function formatInrGrouped(value: string): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed) {
    return "";
  }
  const numeric = parseNum(trimmed);
  if (numeric > 0) {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(numeric);
  }
  return trimmed.replace(/^₹\s*/, "");
}

export function customerNetPayableOffering(projectAmount: string, language: QuotationLanguage) {
  const formatted = formatInrGrouped(projectAmount);
  if (!formatted) {
    return "";
  }
  return language === "hi" ? `INR ${formatted}/- (कर सहित)` : `INR ${formatted}/- (Including Tax)`;
}

export function totalGovtSubsidy(centralSubsidy: string, stateSubsidy: string) {
  return parseNum(centralSubsidy) + parseNum(stateSubsidy);
}

export function computeEffectivePayable(projectAmount: string, centralSubsidy: string, stateSubsidy: string) {
  return parseNum(projectAmount) - totalGovtSubsidy(centralSubsidy, stateSubsidy);
}

export function commercialRowsForPreview(data: QuotationData): QuotationCommercialRow[] {
  const rows = stripSyncedCommercialRows(data.commercialOffer);
  const language: QuotationLanguage = data.language === "hi" ? "hi" : "en";
  const offering = customerNetPayableOffering(data.projectAmount, language);
  if (!offering) {
    return rows;
  }
  return [
    ...rows,
    {
      id: "synced-customer-net-payable",
      parameter: quotationLabels(language).customerNetPayable,
      offering,
    },
  ];
}
