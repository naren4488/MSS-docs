export { formatDate, filledValue, formatRecordDate } from "@/features/offer-letter/lib/offer-letter-formatters";

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
