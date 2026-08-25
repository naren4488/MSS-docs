import type { QuotationData, QuotationLanguage, QuotationMaterialItem, QuotationPhase } from "../types/quotation";
import {
  applyPhaseToMaterialItems,
  createDefaultQuotationData,
  inverterUnit,
} from "./quotation-defaults";
import { computeEffectivePayable, stripSyncedCommercialRows } from "./quotation-formatters";
import { isSolarInverterDescription, isSolarPvModulesDescription } from "./quotation-labels";

/**
 * PM SURYA GHAR package list (MSS price sheet).
 * Subsidies: MNRE ₹78,000 + state ₹17,000 (where applicable).
 * MNRE credited to customer account ~60 days after net metering.
 * Savings assumption: ₹8 / unit.
 */
export type QuotationTemplateId =
  | "3kw-1ph"
  | "5kw-1ph"
  | "5kw-3ph"
  | "6kw-3ph"
  | "8kw-3ph"
  | "10kw-3ph";

/** Default package when opening a new quotation. */
export const DEFAULT_QUOTATION_TEMPLATE_ID: QuotationTemplateId = "3kw-1ph";

const MNRE_SUBSIDY = "78000";
const STATE_SUBSIDY = "17000";

export interface QuotationTemplateMeta {
  id: QuotationTemplateId;
  label: string;
  description: string;
  capacity: string;
  phase: QuotationPhase;
  projectAmount: string;
  /** MNRE / central subsidy transferred to customer. */
  centralSubsidy: string;
  /** State subsidy (₹17,000). */
  stateSubsidy: string;
  panels: number;
  wp: number;
  inverterKw: string;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
}

export function templateNetPayable(template: Pick<QuotationTemplateMeta, "projectAmount" | "centralSubsidy" | "stateSubsidy">): number {
  return (
    Number(template.projectAmount) -
    Number(template.centralSubsidy || 0) -
    Number(template.stateSubsidy || 0)
  );
}

export function formatTemplateInr(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return `₹${formatInr(n)}`;
}

function afterSubsidyLabel(projectAmount: number): string {
  const net = projectAmount - Number(MNRE_SUBSIDY) - Number(STATE_SUBSIDY);
  return `After subsidy ₹${formatInr(net)}`;
}

export const QUOTATION_TEMPLATES: readonly QuotationTemplateMeta[] = [
  {
    id: "3kw-1ph",
    label: "3 KW · 1PH",
    description: `₹1,90,000 · ${afterSubsidyLabel(190_000)} · Single phase`,
    capacity: "3 KW",
    phase: "1PH",
    projectAmount: "190000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: STATE_SUBSIDY,
    panels: 6,
    wp: 550,
    inverterKw: "3.6",
  },
  {
    id: "5kw-1ph",
    label: "5 KW · 1PH",
    description: `₹2,70,000 · ${afterSubsidyLabel(270_000)} · Single phase`,
    capacity: "5 KW",
    phase: "1PH",
    projectAmount: "270000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: STATE_SUBSIDY,
    panels: 10,
    wp: 550,
    inverterKw: "5",
  },
  {
    id: "5kw-3ph",
    label: "5 KW · 3PH",
    description: `₹2,85,000 · ${afterSubsidyLabel(285_000)} · Three phase`,
    capacity: "5 KW",
    phase: "3PH",
    projectAmount: "285000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: STATE_SUBSIDY,
    panels: 10,
    wp: 550,
    inverterKw: "5",
  },
  {
    id: "6kw-3ph",
    label: "6 KW · 3PH",
    description: `₹3,20,000 · ${afterSubsidyLabel(320_000)} · Three phase`,
    capacity: "6 KW",
    phase: "3PH",
    projectAmount: "320000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: STATE_SUBSIDY,
    panels: 12,
    wp: 550,
    inverterKw: "6",
  },
  {
    id: "8kw-3ph",
    label: "8 KW · 3PH",
    description: `₹3,95,000 · ${afterSubsidyLabel(395_000)} · Three phase`,
    capacity: "8 KW",
    phase: "3PH",
    projectAmount: "395000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: STATE_SUBSIDY,
    panels: 15,
    wp: 550,
    inverterKw: "8",
  },
  {
    id: "10kw-3ph",
    label: "10 KW · 3PH",
    description: `₹4,80,000 · ${afterSubsidyLabel(480_000)} · Three phase`,
    capacity: "10 KW",
    phase: "3PH",
    projectAmount: "480000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: STATE_SUBSIDY,
    panels: 18,
    wp: 550,
    inverterKw: "10",
  },
] as const;

export function isQuotationTemplate(value: string | null | undefined): value is QuotationTemplateId {
  return QUOTATION_TEMPLATES.some((template) => template.id === value);
}

export function getQuotationTemplate(id: QuotationTemplateId): QuotationTemplateMeta {
  const found = QUOTATION_TEMPLATES.find((template) => template.id === id);
  if (!found) {
    return QUOTATION_TEMPLATES[0];
  }
  return found;
}

function inverterMake(inverterKw: string, language: QuotationLanguage): string {
  return language === "hi"
    ? `${inverterKw} किलोवाट POLYCAB इनवर्टर · 10 वर्ष वारंटी`
    : `${inverterKw} KW POLYCAB Inverter with 10 Year Warranty`;
}

function panelQtyLabel(panels: number, language: QuotationLanguage): string {
  return language === "hi" ? `${panels} पैनल` : `${panels} Panel`;
}

function panelConfigOffering(template: QuotationTemplateMeta, language: QuotationLanguage): string {
  const totalKw = ((template.panels * template.wp) / 1000).toFixed(1).replace(/\.0$/, "");
  if (language === "hi") {
    return `${template.panels} × ${template.wp}W अदानी टॉपकॉन बाइफेशियल पैनल (कुल ${totalKw} किलोवाट)`;
  }
  return `${template.panels} x ${template.wp}W Adani Topcon Bifacial Panels (${totalKw} KW Total)`;
}

function subsidyNoteForLanguage(language: QuotationLanguage): string {
  return language === "hi"
    ? "*MNRE सब्सिडी (₹78,000) नेट मीटरिंग के ~60 दिन बाद ग्राहक खाते में ट्रांसफर होती है। राज्य सब्सिडी (₹17,000) वहाँ लागू जहाँ वर्तमान में 100 यूनिट मुफ्त लाभ उपलब्ध है।"
    : "*MNRE subsidy (₹78,000) is transferred to the customer account ~60 days after net metering. State subsidy (₹17,000) applies where 100 units free benefit is currently available.";
}

function applyTemplateSizing(
  items: QuotationMaterialItem[],
  template: QuotationTemplateMeta,
  language: QuotationLanguage,
): QuotationMaterialItem[] {
  const sized = items.map((item) => {
    if (isSolarPvModulesDescription(item.description)) {
      return {
        ...item,
        qty: panelQtyLabel(template.panels, language),
        unit: `${template.wp} Wp`,
      };
    }
    if (isSolarInverterDescription(item.description)) {
      return {
        ...item,
        unit: inverterUnit(template.phase, language),
        make: inverterMake(template.inverterKw, language),
      };
    }
    return item;
  });

  return applyPhaseToMaterialItems(sized, template.phase, language);
}

export function createQuotationFromTemplate(
  templateId: QuotationTemplateId = DEFAULT_QUOTATION_TEMPLATE_ID,
  language: QuotationLanguage = "en",
): QuotationData {
  const template = getQuotationTemplate(templateId);
  const base = createDefaultQuotationData(language);
  const projectAmount = template.projectAmount;
  const centralSubsidy = template.centralSubsidy;
  const stateSubsidy = template.stateSubsidy;
  const effectivePayable = computeEffectivePayable(projectAmount, centralSubsidy, stateSubsidy);

  return {
    ...base,
    capacity: template.capacity,
    phase: template.phase,
    projectAmount,
    centralSubsidy,
    stateSubsidy,
    subsidyNote: subsidyNoteForLanguage(language),
    generation: {
      unitRate: "8",
    },
    effectivePayableAmount: String(Math.max(0, effectivePayable)),
    materialItems: applyTemplateSizing(base.materialItems, template, language),
    commercialOffer: stripSyncedCommercialRows([
      {
        id: crypto.randomUUID(),
        parameter: language === "hi" ? "पैनल कॉन्फ़िगरेशन" : "Panel Configuration",
        offering: panelConfigOffering(template, language),
      },
      {
        id: crypto.randomUUID(),
        parameter: language === "hi" ? "मूल्य आधार" : "Price Basis",
        offering: language === "hi" ? "टर्नकी EPC" : "Turnkey EPC",
      },
    ]),
  };
}
