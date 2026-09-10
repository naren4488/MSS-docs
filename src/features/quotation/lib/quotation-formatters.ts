export { formatDate, filledValue, formatRecordDate } from "@/features/offer-letter/lib/offer-letter-formatters";
import type {
  QuotationCommercialRow,
  QuotationData,
  QuotationKind,
  QuotationLanguage,
  QuotationMaterialItem,
} from "../types/quotation";
import { isSolarPvModulesDescription, quotationLabels } from "./quotation-labels";

/** Year-1 generation assumption (units per kW per day). */
export const GENERATION_YEAR1_UNITS_PER_KW = 4;
/** Years 2–5 generation assumption (units per kW per day). */
export const GENERATION_YEARS_2_5_UNITS_PER_KW = 3.9;
export const GENERATION_DAYS_PER_MONTH = 30;
export const GENERATION_DAYS_PER_YEAR = 360;
export const DEFAULT_GENERATION_UNIT_RATE = 8;

export function parseWattageFromMaterials(
  materialItems: readonly QuotationMaterialItem[],
): { panels: number; wattage: number; kw: number } | null {
  const solarPanelItem = materialItems.find((item) => isSolarPvModulesDescription(item.description));
  if (!solarPanelItem) {
    return null;
  }

  const qtyMatch = solarPanelItem.qty.match(/\d+/);
  const unitMatch = solarPanelItem.unit.match(/\d+/);
  if (!qtyMatch || !unitMatch) {
    return null;
  }

  const panels = Number.parseInt(qtyMatch[0], 10);
  const wattagePerPanel = Number.parseInt(unitMatch[0], 10);
  const wattage = panels * wattagePerPanel;
  return { panels, wattage, kw: wattage / 1000 };
}

function formatUnitCount(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatGenerationAmount(
  value: number,
  language: QuotationLanguage,
  period: "day" | "month" | "year",
): string {
  const count = formatUnitCount(value);
  if (language === "hi") {
    if (period === "day") return `${count} यूनिट / दिन`;
    if (period === "month") return `${count} यूनिट / माह`;
    return `${count} यूनिट / वर्ष`;
  }
  if (period === "day") return `${count} Units / Day`;
  if (period === "month") return `${count} Units / Month`;
  return `${count} Units / Year`;
}

export function formatGenerationSaving(value: number): string {
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(value));
  return `₹ ${formatted}`;
}

export interface ComputedGenerationRow {
  periodKey: "year1" | "years2to5";
  unitsPerKw: number;
  perDay: number;
  perMonth: number;
  perYear: number;
  savingPerYear: number;
}

export function computeGenerationRows(
  materialItems: readonly QuotationMaterialItem[],
  unitRateRaw: string | undefined,
): ComputedGenerationRow[] | null {
  const wattage = parseWattageFromMaterials(materialItems);
  if (!wattage || wattage.kw <= 0) {
    return null;
  }

  const unitRate = parseNum(unitRateRaw ?? "") || DEFAULT_GENERATION_UNIT_RATE;
  const { kw } = wattage;

  return [
    {
      periodKey: "year1",
      unitsPerKw: GENERATION_YEAR1_UNITS_PER_KW,
      perDay: kw * GENERATION_YEAR1_UNITS_PER_KW,
      perMonth: kw * GENERATION_YEAR1_UNITS_PER_KW * GENERATION_DAYS_PER_MONTH,
      perYear: kw * GENERATION_YEAR1_UNITS_PER_KW * GENERATION_DAYS_PER_YEAR,
      savingPerYear: kw * GENERATION_YEAR1_UNITS_PER_KW * GENERATION_DAYS_PER_YEAR * unitRate,
    },
    {
      periodKey: "years2to5",
      unitsPerKw: GENERATION_YEARS_2_5_UNITS_PER_KW,
      perDay: kw * GENERATION_YEARS_2_5_UNITS_PER_KW,
      perMonth: kw * GENERATION_YEARS_2_5_UNITS_PER_KW * GENERATION_DAYS_PER_MONTH,
      perYear: kw * GENERATION_YEARS_2_5_UNITS_PER_KW * GENERATION_DAYS_PER_YEAR,
      savingPerYear: kw * GENERATION_YEARS_2_5_UNITS_PER_KW * GENERATION_DAYS_PER_YEAR * unitRate,
    },
  ];
}

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

export function isSolarPlantCapacityParameter(parameter: string) {
  const value = parameter.trim().toLowerCase();
  return (
    value.includes("solar plant capacity") ||
    value.includes("solar pv plant capacity") ||
    parameter.includes("सोलर प्लांट क्षमता") ||
    parameter.includes("सोलर पीवी प्लांट क्षमता")
  );
}

/** Derived commercial rows — keep them out of the editable table. */
export function stripSyncedCommercialRows(rows: QuotationCommercialRow[]) {
  return rows.filter(
    (row) =>
      !isProjectPriceParameter(row.parameter) &&
      !isCustomerNetPayableParameter(row.parameter) &&
      !isSolarPlantCapacityParameter(row.parameter),
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

export function solarPlantCapacityOffering(
  materialItems: readonly QuotationMaterialItem[],
  language: QuotationLanguage,
  kind?: QuotationKind,
): string {
  const wattage = parseWattageFromMaterials(materialItems);
  if (!wattage || wattage.kw <= 0) {
    return "";
  }
  const kw = formatUnitCount(wattage.kw);
  if (kind === "offgrid") {
    return language === "hi" ? `${kw} किलोवाट, ऑफ-ग्रिड सोलर सिस्टम` : `${kw} KW, Off-grid solar system`;
  }
  return language === "hi"
    ? `${kw} किलोवाट, ऑन-ग्रिड सोलर सिस्टम`
    : `${kw} KW, On-grid solar system`;
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
  const L = quotationLabels(language);
  const synced: QuotationCommercialRow[] = [];

  const capacityOffering = solarPlantCapacityOffering(data.materialItems, language, data.kind);
  if (capacityOffering) {
    synced.push({
      id: "synced-solar-plant-capacity",
      parameter: language === "hi" ? "सोलर प्लांट क्षमता" : "Solar Plant Capacity",
      offering: capacityOffering,
    });
  }

  const netPayable = customerNetPayableOffering(data.projectAmount, language);
  if (netPayable) {
    synced.push({
      id: "synced-customer-net-payable",
      parameter: L.customerNetPayable,
      offering: netPayable,
    });
  }

  return [...synced.filter((row) => row.id === "synced-solar-plant-capacity"), ...rows, ...synced.filter((row) => row.id === "synced-customer-net-payable")];
}
