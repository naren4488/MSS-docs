import type {
  QuotationData,
  QuotationLanguage,
  QuotationMaterialItem,
  QuotationPhase,
  QuotationSubsidyScope,
  QuotationTermItem,
} from "../types/quotation";
import {
  applyCommercialCapacityToMaterials,
  applyOffgridCapacityToMaterials,
  applyPhaseToMaterialItems,
  createDefaultQuotationData,
  defaultSubsidyNote,
  inverterUnit,
} from "./quotation-defaults";
import { computeEffectivePayable, stripSyncedCommercialRows } from "./quotation-formatters";
import {
  isAcCableDescription,
  isDcCableDescription,
  isMountingStructureDescription,
  isSolarInverterDescription,
  isSolarPvModulesDescription,
} from "./quotation-labels";

/**
 * PM SURYA GHAR package list (MSS price sheet).
 * Subsidies: MNRE ₹78,000 + state ₹17,000 (where applicable).
 * MNRE credited to customer account ~60 days after net metering.
 * Savings assumption: ₹8 / unit.
 */
export type QuotationTemplateKind = "residential" | "commercial" | "offgrid" | "special";

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
  | "offgrid"
  | "special-ritu-choudhary"
  | "special-lokesh-sharma";

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
  /** State subsidy (₹17,000). Empty for commercial / central-only deals. */
  stateSubsidy: string;
  /** Central only, or central + state. Defaults to both when omitted. */
  subsidyScope?: QuotationSubsidyScope;
  panels: number;
  wp: number;
  inverterKw: string;
  /** Commercial / off-grid / special module brand shown in BOM (warranty suffix added when applied). */
  moduleBrand?: string;
  /** Off-grid 12V 220Ah tubular count. */
  batteries?: number;
  /** Pre-filled client details for special / named quotes. */
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  address?: string;
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
}

export function templateNetPayable(
  template: Pick<QuotationTemplateMeta, "projectAmount" | "centralSubsidy" | "stateSubsidy" | "subsidyScope">,
): number {
  const includeState = template.subsidyScope !== "central";
  return (
    Number(template.projectAmount) -
    Number(template.centralSubsidy || 0) -
    (includeState ? Number(template.stateSubsidy || 0) : 0)
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
  {
    id: "special-ritu-choudhary",
    kind: "special",
    label: "Ritu Choudhary",
    description:
      "₹2,30,000 · 5 KW 3PH · 8 × Adani 625W · MNRE only · no structure / AC-DC cable (client)",
    capacity: "5 KW",
    phase: "3PH",
    projectAmount: "230000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: "",
    subsidyScope: "central",
    panels: 8,
    wp: 625,
    inverterKw: "5",
    moduleBrand: "Adani Topcon Bifacial",
    customerName: "RITU CHOUDHARY",
    customerPhone: "9413337137 / +91 9079930862",
    customerEmail: "MUKESHCHOUDHARY6111@GMAIL.COM",
    address: "Jobner",
  },
  {
    id: "special-lokesh-sharma",
    kind: "special",
    label: "Lokesh Sharma",
    description: "₹2,40,000 · 5 KW 1PH · 8 × Adani 625W · MNRE only · no structure (client)",
    capacity: "5 KW",
    phase: "1PH",
    projectAmount: "240000",
    centralSubsidy: MNRE_SUBSIDY,
    stateSubsidy: "",
    subsidyScope: "central",
    panels: 8,
    wp: 625,
    inverterKw: "5",
    moduleBrand: "Adani Topcon Bifacial",
    customerName: "Lokesh Sharma",
    customerPhone: "8003830109",
    address: "Jaipur",
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

function subsidyNoteForLanguage(
  language: QuotationLanguage,
  scope: "central" | "both" = "both",
): string {
  return defaultSubsidyNote(language, scope);
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

function withoutMountingStructure(items: QuotationMaterialItem[]): QuotationMaterialItem[] {
  return items.filter((item) => !isMountingStructureDescription(item.description));
}

function withoutClientScopeMaterials(items: QuotationMaterialItem[]): QuotationMaterialItem[] {
  return items.filter(
    (item) =>
      !isMountingStructureDescription(item.description) &&
      !isAcCableDescription(item.description) &&
      !isDcCableDescription(item.description),
  );
}

function isEarthingKitDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("earthing kit") || description.includes("अर्थिंग किट");
}

function applyRituEarthingKit(items: QuotationMaterialItem[], language: QuotationLanguage): QuotationMaterialItem[] {
  return items.map((item) => {
    if (!isEarthingKitDescription(item.description)) return item;
    return {
      ...item,
      qty: language === "hi" ? "3 सेट" : "3 Set",
      unit: language === "hi" ? "सेट" : "Set",
      make:
        language === "hi"
          ? "3 कॉपर बाउंड रॉड"
          : "3 copper bound rods",
    };
  });
}

function rituClientScopeWarrantyNote(language: QuotationLanguage): string {
  if (language === "hi") {
    return [
      "महत्वपूर्ण — ग्राहक स्ट्रक्चर, AC/DC केबल व वायरिंग (यह कोटेशन):",
      "• माउंटिंग स्ट्रक्चर MSS के कार्यक्षेत्र में नहीं है और माही सोलर सॉल्यूशन द्वारा आपूर्ति नहीं की जाती। स्ट्रक्चर, उसके डिज़ाइन, मजबूती, इंस्टॉलेशन या संबंधित किसी भी समस्या के लिए MSS जिम्मेदार नहीं है।",
      "• AC केबल व DC केबल MSS द्वारा आपूर्ति नहीं की जातीं — ग्राहक की जिम्मेदारी।",
      "• विद्युत वायरिंग ग्राहक की आवश्यकता के अनुसार की जाती है और MSS मानक डिज़ाइन/प्रथा के अनुसार नहीं है। इस व्यवस्था में जनरेशन प्रदर्शन/मानकों की जिम्मेदारी MSS नहीं लेता।",
      "• वायरिंग, AC/DC केबल, स्ट्रक्चर या गैर-MSS-मानक कार्य से उत्पन्न कोई दोष, खराबी, जनरेशन कमी, क्षति या भविष्य की समस्या पूरी तरह ग्राहक की जिम्मेदारी होगी। इसके लिए MSS उत्तरदायी नहीं होगा।",
    ].join("\n");
  }
  return [
    "Important — Client-supplied structure, AC/DC cable & wiring (this quotation):",
    "• Mounting structure is not in MSS scope and is not supplied by Mahi Solar Solution. MSS is not responsible for the structure, its design, strength, installation, or any related issues.",
    "• AC cable and DC cable are not supplied by MSS — these are the client's responsibility.",
    "• Electrical wiring is as per the client's requirement and is not as per MSS standard design/practice. MSS does not take responsibility for generation performance or generation standards under this arrangement.",
    "• Any fault, failure, shortfall in generation, damage, or future issue arising from wiring, AC/DC cable, structure, or non-MSS-standard work shall be solely the client's responsibility. MSS shall not be liable for the same.",
  ].join("\n");
}

function rituWarrantyCoverageTerm(language: QuotationLanguage): QuotationTermItem {
  if (language === "hi") {
    return {
      id: crypto.randomUUID(),
      label: "वारंटी कवरेज व सीमाएँ",
      text: [
        "दायित्व व कार्यक्षेत्र:",
        "• माही सोलर सॉल्यूशन की जिम्मेदारी केवल सहमत आपूर्ति व इंस्टॉलेशन कार्यक्षेत्र तक सीमित है।",
        "• माउंटिंग स्ट्रक्चर ग्राहक द्वारा उपलब्ध/निर्धारित है — MSS आपूर्ति या स्ट्रक्चर वारंटी नहीं देता।",
        "• AC केबल व DC केबल MSS द्वारा आपूर्ति नहीं — ग्राहक की जिम्मेदारी।",
        "• वायरिंग ग्राहक आवश्यकतानुसार है (MSS मानक नहीं) — वायरिंग दोष, विद्युत खराबी या उससे जनरेशन प्रभाव हेतु MSS जिम्मेदार नहीं।",
        "• सेटअप व BOS की 5 वर्ष वर्कमैनशिप वारंटी इस कोटेशन पर लागू नहीं।",
        "",
        "वारंटी कवरेज (केवल आपूर्ति घटक):",
        "• पैनल: 30 वर्ष उत्पाद वारंटी (निर्माण दोष) + 25 वर्ष प्रदर्शन वारंटी — निर्माता शर्तों के अधीन",
        "• इनवर्टर: 10 वर्ष निर्माता वारंटी — निर्माता शर्तों के अधीन",
        "",
        "निर्माता वारंटी:",
        "• सोलर पैनल, इनवर्टर व अन्य आपूर्ति घटक केवल संबंधित निर्माता की वारंटी शर्तों के अंतर्गत कवर हैं।",
        "",
        "MSS जिम्मेदार नहीं होगा:",
        "• ग्राहक स्ट्रक्चर संबंधी कोई मुद्दा",
        "• AC/DC केबल या ग्राहक-निर्धारित/गैर-मानक वायरिंग से दोष या भविष्य की खराबी",
        "• जनरेशन मानकों/अनुमानों की गारंटी (इस व्यवस्था में)",
        "• प्राकृतिक आपदा, चोरी, तोड़फोड़, अनुचित उपयोग, अनधिकृत संशोधन",
        "",
        "वारंटी दावे मूल उपकरण निर्माता की शर्तों के अधीन हैं।",
      ].join("\n"),
    };
  }
  return {
    id: crypto.randomUUID(),
    label: "Warranty Coverage & Limitations",
    text: [
      "Scope of Responsibility:",
      "• Mahi Solar Solution's responsibility is limited to the agreed supply and installation scope under this quotation.",
      "• Mounting structure is client-provided / client-arranged — MSS does not supply it and provides no structure warranty.",
      "• AC cable and DC cable are not supplied by MSS — these are the client's responsibility.",
      "• Wiring is as per client requirement (not MSS standards) — MSS is not responsible for wiring faults, electrical failures, or generation impact arising therefrom.",
      "• The 5-year Setup & BOS workmanship warranty does not apply to this quotation.",
      "",
      "Warranty Coverage (supplied components only):",
      "• Panels: 30-year product warranty (manufacturing defects) + 25-year performance warranty — subject to manufacturer terms",
      "• Inverter: 10-year manufacturer warranty — subject to manufacturer terms",
      "",
      "Manufacturer's Warranty:",
      "• Solar panels, inverter and other supplied components are covered solely under the respective manufacturer's warranty terms.",
      "",
      "MSS shall NOT be responsible for:",
      "• Any issue related to the client structure",
      "• Faults or future failures due to AC/DC cable or client-specified / non-MSS-standard wiring",
      "• Generation standards or estimated generation guarantees under this arrangement",
      "• Natural calamities, theft, vandalism, improper use, or unauthorized modifications",
      "",
      "Warranty claims are subject to the original equipment manufacturer's terms and conditions.",
    ].join("\n"),
  };
}

function patchRituTimelineTerm(text: string, language: QuotationLanguage): string {
  if (language === "hi") {
    return text.replace(
      "• शामिल: माउंटिंग स्ट्रक्चर, सोलर पैनल, इनवर्टर, BOS, विद्युत कनेक्शन, परीक्षण व कमीशनिंग।",
      "• शामिल: सोलर पैनल, इनवर्टर, सहमत BOS आपूर्ति, परीक्षण व कमीशनिंग। माउंटिंग स्ट्रक्चर, AC केबल व DC केबल MSS कार्यक्षेत्र में नहीं। वायरिंग ग्राहक आवश्यकतानुसार (MSS मानक नहीं)।",
    );
  }
  return text.replace(
    "• Includes: Mounting structure, solar panel installation, inverter setup, BOS components, electrical connections, testing & system commissioning.",
    "• Includes: Solar panel installation, inverter setup, agreed BOS supply, testing & system commissioning. Mounting structure, AC cable and DC cable are not in MSS scope. Wiring is as per client requirement (not MSS standards).",
  );
}

function patchRituGenerationTerm(text: string, language: QuotationLanguage): string {
  const note =
    language === "hi"
      ? "\n\nविशेष नोट (यह कोटेशन): जनरेशन अनुमान केवल संकेतात्मक हैं। ग्राहक स्ट्रक्चर, AC/DC केबल व गैर-MSS-मानक वायरिंग के कारण MSS जनरेशन मानकों या अनुमानित यूनिट्स की गारंटी नहीं देता।"
      : "\n\nSpecial note (this quotation): Generation figures are indicative only. Because structure, AC/DC cable are client-side and wiring is not as per MSS standards, MSS does not guarantee generation standards or estimated units.";
  return `${text.trim()}${note}`;
}

function applyRituChoudharySpecialOverrides(data: QuotationData, language: QuotationLanguage): QuotationData {
  const terms = data.terms.map((item) => {
    const label = item.label.trim();
    if (label === "Warranty Coverage & Limitations" || label === "वारंटी कवरेज व सीमाएँ") {
      return rituWarrantyCoverageTerm(language);
    }
    if (label === "Project Timeline & Installation Process" || label === "प्रोजेक्ट समयरेखा व इंस्टॉलेशन प्रक्रिया") {
      return { ...item, text: patchRituTimelineTerm(item.text, language) };
    }
    if (label === "Electricity Generation & Seasonal Variation" || label === "विद्युत उत्पादन व मौसमी भिन्नता") {
      return { ...item, text: patchRituGenerationTerm(item.text, language) };
    }
    if (label === "Warranty" || label === "वारंटी") {
      return {
        ...item,
        text:
          language === "hi"
            ? "पैनल व इनवर्टर पर निर्माता वारंटी लागू। माउंटिंग स्ट्रक्चर, AC केबल व DC केबल MSS कार्यक्षेत्र में नहीं। वायरिंग ग्राहक आवश्यकतानुसार (MSS मानक नहीं)। सेटअप व BOS की 5 वर्ष वारंटी इस कोटेशन पर लागू नहीं। जनरेशन मानकों की गारंटी नहीं।"
            : "Manufacturer warranty applies on panels and inverter. Mounting structure, AC cable and DC cable are not in MSS scope. Wiring is as per client requirement (not MSS standards). The 5-year Setup & BOS warranty does not apply on this quotation. Generation standards are not guaranteed.",
      };
    }
    return item;
  });

  return {
    ...data,
    specialQuotation: "ritu-choudhary",
    proposalDate: "2026-09-15",
    materialItems: applyRituEarthingKit(withoutClientScopeMaterials(data.materialItems), language),
    warrantySetupBosYears: "",
    warrantyText: rituClientScopeWarrantyNote(language),
    showComponentWarranty: false,
    showGeneration: false,
    // Installation diagram often orphans onto a sparse page on this shorter special quote.
    showInstallationProcess: false,
    terms,
  };
}

function lokeshStructureWarrantyNote(language: QuotationLanguage): string {
  if (language === "hi") {
    return [
      "महत्वपूर्ण — ग्राहक स्ट्रक्चर (यह कोटेशन):",
      "• माउंटिंग स्ट्रक्चर MSS के कार्यक्षेत्र में नहीं है और माही सोलर सॉल्यूशन द्वारा आपूर्ति नहीं की जाती। स्ट्रक्चर, उसके डिज़ाइन, मजबूती, इंस्टॉलेशन या संबंधित किसी भी समस्या के लिए MSS जिम्मेदार नहीं है।",
      "• स्ट्रक्चर से उत्पन्न कोई दोष, खराबी, क्षति या भविष्य की समस्या पूरी तरह ग्राहक की जिम्मेदारी होगी। इसके लिए MSS उत्तरदायी नहीं होगा।",
    ].join("\n");
  }
  return [
    "Important — Client-supplied structure (this quotation):",
    "• Mounting structure is not in MSS scope and is not supplied by Mahi Solar Solution. MSS is not responsible for the structure, its design, strength, installation, or any related issues.",
    "• Any fault, failure, damage, or future issue arising from the structure shall be solely the client's responsibility. MSS shall not be liable for the same.",
  ].join("\n");
}

function lokeshWarrantyCoverageTerm(language: QuotationLanguage): QuotationTermItem {
  if (language === "hi") {
    return {
      id: crypto.randomUUID(),
      label: "वारंटी कवरेज व सीमाएँ",
      text: [
        "दायित्व व कार्यक्षेत्र:",
        "• माही सोलर सॉल्यूशन की जिम्मेदारी केवल सहमत आपूर्ति व इंस्टॉलेशन कार्यक्षेत्र तक सीमित है।",
        "• माउंटिंग स्ट्रक्चर ग्राहक द्वारा उपलब्ध/निर्धारित है — MSS आपूर्ति या स्ट्रक्चर वारंटी नहीं देता।",
        "• माउंटिंग स्ट्रक्चर व इंस्टॉलेशन पर 5 वर्ष वर्कमैनशिप वारंटी इस कोटेशन पर स्ट्रक्चर भाग के लिए लागू नहीं (स्ट्रक्चर MSS कार्यक्षेत्र में नहीं)।",
        "",
        "वारंटी कवरेज:",
        "• पैनल: 30 वर्ष उत्पाद वारंटी (निर्माण दोष) + 25 वर्ष प्रदर्शन वारंटी — निर्माता शर्तों के अधीन",
        "• इनवर्टर: 10 वर्ष निर्माता वारंटी — निर्माता शर्तों के अधीन",
        "• BOS व इंस्टॉलेशन (स्ट्रक्चर छोड़कर): 5 वर्ष वारंटी",
        "",
        "निर्माता वारंटी:",
        "• सोलर पैनल, इनवर्टर व अन्य आपूर्ति घटक केवल संबंधित निर्माता की वारंटी शर्तों के अंतर्गत कवर हैं।",
        "",
        "MSS जिम्मेदार नहीं होगा:",
        "• ग्राहक स्ट्रक्चर संबंधी कोई मुद्दा",
        "• प्राकृतिक आपदा, चोरी, तोड़फोड़, अनुचित उपयोग, अनधिकृत संशोधन",
        "",
        "वारंटी दावे मूल उपकरण निर्माता की शर्तों के अधीन हैं।",
      ].join("\n"),
    };
  }
  return {
    id: crypto.randomUUID(),
    label: "Warranty Coverage & Limitations",
    text: [
      "Scope of Responsibility:",
      "• Mahi Solar Solution's responsibility is limited to the agreed supply and installation scope under this quotation.",
      "• Mounting structure is client-provided / client-arranged — MSS does not supply it and provides no structure warranty.",
      "• The 5-year workmanship warranty on mounting structure does not apply on this quotation (structure is outside MSS scope).",
      "",
      "Warranty Coverage:",
      "• Panels: 30-year product warranty (manufacturing defects) + 25-year performance warranty — subject to manufacturer terms",
      "• Inverter: 10-year manufacturer warranty — subject to manufacturer terms",
      "• BOS & Installation (excluding structure): 5-year warranty",
      "",
      "Manufacturer's Warranty:",
      "• Solar panels, inverter and other supplied components are covered solely under the respective manufacturer's warranty terms.",
      "",
      "MSS shall NOT be responsible for:",
      "• Any issue related to the client structure",
      "• Natural calamities, theft, vandalism, improper use, or unauthorized modifications",
      "",
      "Warranty claims are subject to the original equipment manufacturer's terms and conditions.",
    ].join("\n"),
  };
}

function patchLokeshTimelineTerm(text: string, language: QuotationLanguage): string {
  if (language === "hi") {
    return text.replace(
      "• शामिल: माउंटिंग स्ट्रक्चर, सोलर पैनल, इनवर्टर, BOS, विद्युत कनेक्शन, परीक्षण व कमीशनिंग।",
      "• शामिल: सोलर पैनल, इनवर्टर, BOS, विद्युत कनेक्शन, परीक्षण व कमीशनिंग। माउंटिंग स्ट्रक्चर MSS कार्यक्षेत्र में नहीं (ग्राहक द्वारा)।",
    );
  }
  return text.replace(
    "• Includes: Mounting structure, solar panel installation, inverter setup, BOS components, electrical connections, testing & system commissioning.",
    "• Includes: Solar panel installation, inverter setup, BOS components, electrical connections, testing & system commissioning. Mounting structure is not in MSS scope (client-provided).",
  );
}

function applyLokeshEarthingKit(items: QuotationMaterialItem[], language: QuotationLanguage): QuotationMaterialItem[] {
  return items.map((item) => {
    if (!isEarthingKitDescription(item.description)) return item;
    return {
      ...item,
      qty: language === "hi" ? "3 सेट" : "3 Set",
      unit: language === "hi" ? "सेट" : "Set",
      make:
        language === "hi"
          ? "3 कॉपर बाउंड रॉड (प्रत्येक 2 मी.) व अर्थिंग केमिकल बैग"
          : "3 copper bound rods (2 mtr each) and earthing chemical bag",
    };
  });
}

function applyLokeshSharmaSpecialOverrides(data: QuotationData, language: QuotationLanguage): QuotationData {
  const terms = data.terms.map((item) => {
    const label = item.label.trim();
    if (label === "Warranty Coverage & Limitations" || label === "वारंटी कवरेज व सीमाएँ") {
      return lokeshWarrantyCoverageTerm(language);
    }
    if (label === "Project Timeline & Installation Process" || label === "प्रोजेक्ट समयरेखा व इंस्टॉलेशन प्रक्रिया") {
      return { ...item, text: patchLokeshTimelineTerm(item.text, language) };
    }
    if (label === "Warranty" || label === "वारंटी") {
      return {
        ...item,
        text:
          language === "hi"
            ? "पैनल व इनवर्टर पर निर्माता वारंटी लागू। माउंटिंग स्ट्रक्चर MSS कार्यक्षेत्र में नहीं — MSS स्ट्रक्चर के लिए जिम्मेदार नहीं। BOS व इंस्टॉलेशन (स्ट्रक्चर छोड़कर) पर 5 वर्ष वारंटी।"
            : "Manufacturer warranty applies on panels and inverter. Mounting structure is not in MSS scope — MSS is not responsible for the structure. 5-year warranty applies on BOS & installation excluding structure.",
      };
    }
    return item;
  });

  return {
    ...data,
    specialQuotation: "lokesh-sharma",
    proposalDate: "2026-10-26",
    materialItems: applyLokeshEarthingKit(withoutMountingStructure(data.materialItems), language),
    warrantyText: lokeshStructureWarrantyNote(language),
    terms,
  };
}

export function createQuotationFromTemplate(
  templateId: QuotationTemplateId = DEFAULT_QUOTATION_TEMPLATE_ID,
  language: QuotationLanguage = "en",
): QuotationData {
  const template = getQuotationTemplate(templateId);
  const offgrid = template.kind === "offgrid";
  const commercial = template.kind === "commercial";
  const special = template.kind === "special";
  const includeSubsidy = !commercial && !offgrid;
  const subsidyScope = template.subsidyScope === "central" ? "central" : "both";
  const base = createDefaultQuotationData(language, { includeSubsidy, commercial, offgrid });
  const projectAmount = template.projectAmount;
  const centralSubsidy = includeSubsidy ? template.centralSubsidy : "";
  const stateSubsidy = includeSubsidy && subsidyScope === "both" ? template.stateSubsidy : "";
  const effectivePayable = includeSubsidy
    ? computeEffectivePayable(projectAmount, centralSubsidy, stateSubsidy, subsidyScope)
    : 0;

  const namedCustomer =
    special || offgrid
      ? {
          customerName: template.customerName ?? (offgrid ? "Devandra Ji" : ""),
          customerPhone: template.customerPhone ?? (offgrid ? "9131311167" : ""),
          customerEmail: template.customerEmail ?? "",
          address: template.address ?? "",
        }
      : {};

  const residentialMaterials = applyTemplateSizing(base.materialItems, template, language);
  const specialMaterials = special
    ? applyCommercialModuleSpec(residentialMaterials, template, language)
    : residentialMaterials;

  const quotation: QuotationData = {
    ...base,
    capacity: template.capacity,
    phase: template.phase,
    projectAmount,
    centralSubsidy,
    stateSubsidy,
    subsidyNote: includeSubsidy ? subsidyNoteForLanguage(language, subsidyScope) : "",
    showSubsidySection: includeSubsidy,
    subsidyScope,
    ...namedCustomer,
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
            { panels: template.panels, acCableBrand: base.acCableBrand },
          )
        : specialMaterials,
    commercialOffer: stripSyncedCommercialRows(base.commercialOffer),
  };

  if (templateId === "special-ritu-choudhary") {
    return applyRituChoudharySpecialOverrides(quotation, language);
  }

  if (templateId === "special-lokesh-sharma") {
    return applyLokeshSharmaSpecialOverrides(quotation, language);
  }

  return quotation;
}
