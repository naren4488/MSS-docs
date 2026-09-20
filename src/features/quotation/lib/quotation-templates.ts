import type { QuotationData, QuotationLanguage, QuotationMaterialItem, QuotationPhase } from "../types/quotation";
import {
  applyCommercialCapacityToMaterials,
  applyOffgridCapacityToMaterials,
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
export type QuotationTemplateKind = "residential" | "commercial" | "offgrid";

export type QuotationTemplateId =
  | "3kw-1ph"
  | "5kw-1ph"
  | "5kw-3ph"
  | "6kw-3ph"
  | "8kw-3ph"
  | "10kw-3ph"
  | "commercial"
  | "commercial-15kw"
  | "commercial-30kw"
  | "offgrid";

/** Default package when opening a new quotation. */
export const DEFAULT_QUOTATION_TEMPLATE_ID: QuotationTemplateId = "3kw-1ph";

const MNRE_SUBSIDY = "78000";
const STATE_SUBSIDY = "17000";

export interface QuotationTemplateMeta {
  id: QuotationTemplateId;
  kind: QuotationTemplateKind;
  label: string;
  description: string;
  capacity: string;
  phase: QuotationPhase;
  projectAmount: string;
  /** MNRE / central subsidy transferred to customer. Empty for commercial. */
  centralSubsidy: string;
  /** State subsidy (₹17,000). Empty for commercial. */
  stateSubsidy: string;
  panels: number;
  wp: number;
  inverterKw: string;
  /** Commercial / off-grid module brand shown in BOM (warranty suffix added when applied). */
  moduleBrand?: string;
  /** Off-grid 12V 220Ah tubular count. */
  batteries?: number;
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
    kind: "residential",
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
    kind: "residential",
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
    kind: "residential",
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
    kind: "residential",
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
    kind: "residential",
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
    kind: "residential",
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
  {
    id: "commercial",
    kind: "commercial",
    label: "Commercial",
    description: "Commercial rooftop — MSS layout, commercial BOM and terms. No PM Surya Ghar subsidy.",
    capacity: "10 KW",
    phase: "3PH",
    projectAmount: "",
    centralSubsidy: "",
    stateSubsidy: "",
    panels: 18,
    wp: 550,
    inverterKw: "10",
  },
  {
    id: "commercial-15kw",
    kind: "commercial",
    label: "15 KW · 3PH",
    description: "₹6,00,000 · 26 × 590W Waaree Topcon · HT three phase · no subsidy",
    capacity: "15 KW",
    phase: "3PH",
    projectAmount: "600000",
    centralSubsidy: "",
    stateSubsidy: "",
    panels: 26,
    wp: 590,
    inverterKw: "15",
    moduleBrand: "Waaree Topcon Bifacial",
  },
  {
    id: "commercial-30kw",
    kind: "commercial",
    label: "30 KW · 3PH",
    description: "₹10,20,000 · 51 × 590W Waaree Topcon · HT three phase · no subsidy",
    capacity: "30 KW",
    phase: "3PH",
    projectAmount: "1020000",
    centralSubsidy: "",
    stateSubsidy: "",
    panels: 51,
    wp: 590,
    inverterKw: "30",
    moduleBrand: "Waaree Topcon Bifacial",
  },
  {
    id: "offgrid",
    kind: "offgrid",
    label: "Off-grid",
    description:
      "Devandra Ji · ₹2,60,000 · no subsidy · 5 × Waaree 590 Wp · Microtek 5.1 kW · 5 × Luminous 220 Ah",
    capacity: "3 KW",
    phase: "1PH",
    projectAmount: "260000",
    centralSubsidy: "",
    stateSubsidy: "",
    panels: 5,
    wp: 590,
    inverterKw: "5.1",
    batteries: 5,
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

function subsidyNoteForLanguage(language: QuotationLanguage): string {
  return language === "hi"
    ? "*MNRE सब्सिडी (₹78,000) नेट मीटरिंग के ~60 दिन बाद ग्राहक खाते में ट्रांसफर होती है। राज्य सब्सिडी (₹17,000) वहाँ लागू जहाँ वर्तमान में 100 यूनिट मुफ्त लाभ उपलब्ध है।"
    : "*MNRE subsidy (₹78,000) is transferred to the customer account ~60 days after net metering. State subsidy (₹17,000) applies where 100 units free benefit is currently available.";
}

function applyCommercialModuleSpec(
  items: QuotationMaterialItem[],
  template: QuotationTemplateMeta,
  language: QuotationLanguage,
): QuotationMaterialItem[] {
  const brand = template.moduleBrand?.trim();
  if (!brand && template.wp === 550) {
    return items;
  }

  return items.map((item) => {
    if (!isSolarPvModulesDescription(item.description)) {
      return item;
    }

    const make = brand
      ? language === "hi"
        ? `${brand} · 30 वर्ष वारंटी`
        : `${brand} with 30 Year Warranty`
      : item.make;

    return {
      ...item,
      qty: panelQtyLabel(template.panels, language),
      unit: `${template.wp} Wp`,
      make,
    };
  });
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
  const offgrid = template.kind === "offgrid";
  const commercial = template.kind === "commercial";
  const includeSubsidy = !commercial && !offgrid;
  const base = createDefaultQuotationData(language, { includeSubsidy, commercial, offgrid });
  const projectAmount = template.projectAmount;
  const centralSubsidy = includeSubsidy ? template.centralSubsidy : "";
  const stateSubsidy = includeSubsidy ? template.stateSubsidy : "";
  const effectivePayable = includeSubsidy
    ? computeEffectivePayable(projectAmount, centralSubsidy, stateSubsidy)
    : 0;

  return {
    ...base,
    capacity: template.capacity,
    phase: template.phase,
    projectAmount,
    centralSubsidy,
    stateSubsidy,
    subsidyNote: includeSubsidy ? subsidyNoteForLanguage(language) : "",
    showSubsidySection: includeSubsidy,
    ...(offgrid
      ? {
          customerName: "Devandra Ji",
          customerPhone: "9131311167",
        }
      : {}),
    generation: {
      unitRate: "8",
    },
    effectivePayableAmount: includeSubsidy ? String(Math.max(0, effectivePayable)) : "",
    materialItems: offgrid
      ? applyOffgridCapacityToMaterials(base.materialItems, template.capacity, template.phase, language)
      : commercial
        ? applyCommercialCapacityToMaterials(
            applyCommercialModuleSpec(base.materialItems, template, language),
            template.capacity,
            template.phase,
            language,
            { panels: template.panels },
          )
        : applyTemplateSizing(base.materialItems, template, language),
    commercialOffer: stripSyncedCommercialRows(base.commercialOffer),
  };
}
