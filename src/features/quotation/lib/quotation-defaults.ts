import { MSS_LOGO_URL } from "@/features/company-profile/lib/company-profile-defaults";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import type {
  QuotationCommercialRow,
  QuotationData,
  QuotationKind,
  QuotationLanguage,
  QuotationMaterialItem,
  QuotationPhase,
  QuotationTermItem,
} from "../types/quotation";
import { stripSyncedCommercialRows } from "./quotation-formatters";
import {
  isAcCableDescription,
  isAcDbDcDbDescription,
  isBatteryBankDescription,
  isSolarInverterDescription,
  isSolarPvModulesDescription,
} from "./quotation-labels";

function uuid() {
  return crypto.randomUUID();
}

const today = new Date().toISOString().slice(0, 10);

function defaultCompany(): AgreementCompany {
  return {
    name: "Mahi Solar Solution Private Limited",
    logoUrl: MSS_LOGO_URL,
    address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302012",
    phone: "+91 9928413501",
    email: "mahisolarsolution@gmail.com",
    website: "mahisolarsolution.com",
    cin: "",
    gst: "08AAUCM4104G1ZD",
    representativeName: "Mahendra Kumawat",
    representativeTitle: "Director",
  };
}

function material(description: string, qty: string, unit: string, make: string): QuotationMaterialItem {
  return { id: uuid(), description, qty, unit, make };
}

export function acCableMake(phase: QuotationPhase, language: QuotationLanguage): string {
  if (language === "hi") {
    return phase === "3PH"
      ? "Ramsons 4 कोर 10 मिमी एल्युमिनियम आर्मर्ड केबल (3PH) · JVVNL अनुमोदित"
      : "Ramsons 2 कोर 10 मिमी एल्युमिनियम आर्मर्ड केबल (1PH) · JVVNL अनुमोदित";
  }
  return phase === "3PH"
    ? "Ramsons 4 Core 10 mm Aluminium Armoured Cable (3PH), JVVNL approved"
    : "Ramsons 2 Core 10 mm Aluminium Armoured Cable (1PH), JVVNL approved";
}

export function inverterUnit(phase: QuotationPhase, language: QuotationLanguage): string {
  if (language === "hi") {
    return phase === "3PH" ? "3 फेज" : "1 फेज";
  }
  return phase === "3PH" ? "3 Phase" : "1 Phase";
}

export function acDbDcDbUnit(phase: QuotationPhase): string {
  return phase === "3PH" ? "64 Amp / 1000 V" : "32 Amp / 600 V";
}

export function acDbDcDbMake(language: QuotationLanguage): string {
  return language === "hi" ? "AC — हैवेल्स · DC — सिबास" : "AC — Havells · DC — Sibass";
}

function stripPhaseFromCapacity(capacity: string): string {
  return capacity.replace(/\s*[13]\s*PH\s*$/i, "").replace(/\s*[13]\s*Phase\s*$/i, "").trim();
}

export function formatCapacityWithPhase(capacity: string, phase: QuotationPhase): string {
  const stripped = stripPhaseFromCapacity(capacity);
  return stripped ? `${stripped} ${phase}` : phase;
}

export function applyPhaseToMaterialItems(
  items: QuotationMaterialItem[],
  phase: QuotationPhase,
  language: QuotationLanguage,
): QuotationMaterialItem[] {
  return items.map((item) => {
    if (isAcCableDescription(item.description)) {
      return { ...item, make: acCableMake(phase, language) };
    }
    if (isSolarInverterDescription(item.description)) {
      return { ...item, unit: inverterUnit(phase, language) };
    }
    if (isAcDbDcDbDescription(item.description)) {
      return { ...item, unit: acDbDcDbUnit(phase), make: acDbDcDbMake(language) };
    }
    return item;
  });
}

function defaultMaterialItems(language: QuotationLanguage, phase: QuotationPhase = "1PH"): QuotationMaterialItem[] {
  if (language === "hi") {
    return [
      material("सोलर पीवी मॉड्यूल", "6 पैनल", "550 Wp", "अदानी टॉपकॉन बाइफेशियल · 30 वर्ष वारंटी"),
      material("सोलर इनवर्टर", "1", inverterUnit(phase, language), "3.6 किलोवाट POLYCAB इनवर्टर · 10 वर्ष वारंटी"),
      material("माउंटिंग स्ट्रक्चर (GI अपोलो)", "आवश्यकतानुसार", "", "लेग 75×75, रैफ्टर 60×40, पर्लिन 40×40"),
      material("AC केबल", "50 तक", "मी.", acCableMake(phase, language)),
      material("DC केबल", "60 तक", "मी.", "4 वर्ग मिमी कॉपर वायर, पॉलीकैब केबल"),
      material("लाइटनिंग अरेस्टर किट", "1 नं.", "1 नं.", "1 मी., कॉपर बाउंड"),
      material("अर्थिंग किट", "3 सेट", "सेट", "3 कॉपर बाउंड रॉड व अर्थिंग केमिकल बैग"),
      material("अर्थिंग वायर", "100 तक", "मी.", "6 वर्ग मिमी कॉपर क्लैड वायर (Indo) या 16 वर्ग मिमी एल्युमिनियम वायर (Ramsons)"),
      material("ACDB / DCDB / MCB डिस्ट्रीब्यूशन बॉक्स", "1, 1 नं.", acDbDcDbUnit(phase), acDbDcDbMake(language)),
      material("सोलर व नेट मीटर", "1, 1 नं.", "", "Avon मीटर उपलब्धता अनुसार, JVVNL द्वारा टेस्टेड"),
      material("कनेक्शन किट", "आवश्यकतानुसार", "—", "कनेक्टिंग केबल (4 वर्ग मिमी — पॉलीकैब), MC4, जम्पर"),
      material("डिज़ाइनेड इंस्टॉलेशन व कमीशनिंग", "", "साइट आवश्यकतानुसार", "टीम माही सोलर सॉल्यूशन"),
    ];
  }
  return [
    material("Solar PV Modules", "6 Panel", "550 Wp", "Adani Topcon Bifacial with 30 Year Warranty"),
    material("Solar Inverter", "1", inverterUnit(phase, language), "3.6 KW POLYCAB Inverter with 10 Year Warranty"),
    material("Mounting Structure (GI Apollo)", "As per Requirement", "", "Leg 75×75, Rafter 60×40, Purline 40×40"),
    material("AC Cable", "Upto 50", "Mtr", acCableMake(phase, language)),
    material("DC Cable", "Upto 60", "Mtr", "4 sq mm Copper Wire, Polycab cable"),
    material("Lightning Arrestor Kit", "1 No", "1 No", "1 M, Copper bound"),
    material("Earthing Kit", "3 Set", "Set", "3 copper bound rods and earthing chemical bag"),
    material("Earthing Wire", "Upto 100", "Mtr", "6 sq mm copper clad wire (Indo) or 16 sq mm aluminium wire (Ramsons)"),
    material("ACDB / DCDB / MCB Distribution Box", "1, 1 No", acDbDcDbUnit(phase), acDbDcDbMake(language)),
    material("Solar & Net Meter", "1, 1 No", "", "Avon Meter as per availability, tested by JVVNL"),
    material("Connection Kit", "As per Requirement", "—", "Connecting cable (4 sq mm — Polycab), MC4, jumper"),
    material("Designed Installation & Commissioning", "", "As per site requirement", "Team Mahi Solar Solution"),
  ];
}

export const COMMERCIAL_MODULE_WP = 550;

export function parseCapacityKw(capacity: string): number | null {
  const match = capacity.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return null;
  }
  const value = Number(match[1]);
  return value > 0 ? value : null;
}

function asPerSite(language: QuotationLanguage): string {
  return language === "hi" ? "साइट आवश्यकतानुसार" : "As per site requirement";
}

function formatKwLabel(kw: number): string {
  return String(Number(kw.toFixed(2))).replace(/\.0+$/, "");
}

function commercialAcCableMake(phase: QuotationPhase, language: QuotationLanguage, kw?: number | null): string {
  if (kw != null && kw >= 30) {
    return language === "hi"
      ? "पॉलीकैब 4 कोर 50 मिमी एल्युमिनियम आर्मर्ड केबल (3PH) · JVVNL अनुमोदित · इनवर्टर से LT / HT पैनल"
      : "Polycab 4 Core 50 mm Aluminium Armoured Cable (3PH), JVVNL approved · inverter to LT / HT panel";
  }
  const base = acCableMake(phase, language);
  return language === "hi" ? `${base} · इनवर्टर से LT / HT पैनल` : `${base} · inverter to LT / HT panel`;
}

function commercialModuleWp(item: QuotationMaterialItem): number {
  const match = item.unit.match(/(\d+)/);
  const wp = match ? Number(match[1]) : 0;
  return wp > 0 ? wp : COMMERCIAL_MODULE_WP;
}

function commercialInverterMake(kw: string, language: QuotationLanguage): string {
  return language === "hi"
    ? `${kw} किलोवाट POLYCAB ग्रिड-टाई स्ट्रिंग इनवर्टर · 10 वर्ष वारंटी`
    : `${kw} KW POLYCAB Grid Tie String Inverter with 10 Year Warranty`;
}

export function isCommercialQuotation(data: { kind?: QuotationKind; showSubsidySection?: boolean }): boolean {
  if (data.kind === "commercial") {
    return true;
  }
  if (data.kind === "residential" || data.kind === "offgrid") {
    return false;
  }
  return data.showSubsidySection === false;
}

export function isOffgridQuotation(data: { kind?: QuotationKind }): boolean {
  return data.kind === "offgrid";
}

export function commercialPanelConfigOffering(capacity: string, language: QuotationLanguage): string {
  const kw = parseCapacityKw(capacity) ?? 10;
  const panels = Math.max(1, Math.round((kw * 1000) / COMMERCIAL_MODULE_WP));
  const totalKw = formatKwLabel((panels * COMMERCIAL_MODULE_WP) / 1000);
  if (language === "hi") {
    return `${panels} × ${COMMERCIAL_MODULE_WP}W अदानी टॉपकॉन बाइफेशियल पैनल (कुल ${totalKw} किलोवाट)`;
  }
  return `${panels} x ${COMMERCIAL_MODULE_WP}W Adani Topcon Bifacial Panels (${totalKw} KW Total)`;
}

function defaultCommercialMaterialItems(language: QuotationLanguage, phase: QuotationPhase): QuotationMaterialItem[] {
  const site = asPerSite(language);
  const acMake = commercialAcCableMake(phase, language);

  if (language === "hi") {
    return [
      material("सोलर पीवी मॉड्यूल", "18 पैनल", `${COMMERCIAL_MODULE_WP} Wp`, "अदानी टॉपकॉन बाइफेशियल · 30 वर्ष वारंटी"),
      material("सोलर इनवर्टर", "1", inverterUnit(phase, language), commercialInverterMake("10", language)),
      material("माउंटिंग स्ट्रक्चर (GI अपोलो)", "आवश्यकतानुसार", "", "लेग 75×75, रैफ्टर 60×40, पर्लिन 40×40"),
      material("AC केबल", site, "मी.", acMake),
      material("DC केबल", site, "मी.", "4 वर्ग मिमी कॉपर, 1 kV UV रेज़िस्टेंट, पॉलीकैब केबल"),
      material("केबल एक्सेसरीज़", site, "नं.", "Cu व Al लग्स, ग्लैंड, HDPE कंड्यूट, फेरुलिंग, UV केबल टाई"),
      material("लाइटनिंग अरेस्टर", site, "नं.", "ESE टाइप LA, बेस प्लेट, माउंटिंग व पोर्सिलेन इंसुलेटर बुशिंग"),
      material(
        "अर्थिंग किट",
        site,
        "सेट",
        "GI स्ट्रिप 25×3 वर्ग मिमी / ग्रीन वायर, GI/CU इलेक्ट्रोड 3 मी. रासायनिक अर्थिंग, अर्थ पिट चैंबर व केमिकल बैग",
      ),
      material("अर्थिंग वायर", site, "मी.", "6 वर्ग मिमी कॉपर क्लैड वायर (Indo) या 16 वर्ग मिमी एल्युमिनियम वायर (Ramsons)"),
      material("ACDB पैनल", "1 नं.", "", "AC SPD, AL/CU बस बार, MCCB — L&T / हैवेल्स / Elmex"),
      material("जनरेशन मीटर", "1 नं.", "", "HT एनर्जी जनरेशन मीटर — Secure, उपलब्धता अनुसार"),
      material("कनेक्शन किट", site, "—", "कनेक्टिंग केबल (4 वर्ग मिमी — पॉलीकैब), MC4, जम्पर"),
      material("केबल ट्रे", site, "मी.", "GI परफोरेटेड केबल ट्रे व असेम्बली"),
      material("वॉकवे", site, "मी.", "FRP वॉकवे"),
      material("MCS / UPVC पाइप", site, "मी.", "मॉड्यूल सफाई हेतु UPVC पाइप"),
      material("डिज़ाइनेड इंस्टॉलेशन व कमीशनिंग", "", "साइट आवश्यकतानुसार", "टीम माही सोलर सॉल्यूशन"),
    ];
  }

  return [
    material("Solar PV Modules", "18 Panel", `${COMMERCIAL_MODULE_WP} Wp`, "Adani Topcon Bifacial with 30 Year Warranty"),
    material("Solar Inverter", "1", inverterUnit(phase, language), commercialInverterMake("10", language)),
    material("Mounting Structure (GI Apollo)", "As per Requirement", "", "Leg 75×75, Rafter 60×40, Purline 40×40"),
    material("AC Cable", site, "Mtr", acMake),
    material("DC Cable", site, "Mtr", "4 sq mm Copper Wire, 1 kV grade UV resistant, Polycab cable"),
    material("Cable Accessories", site, "Nos", "Cu & Al lugs, gland, HDPE conduit, ferruling, UV protected cable tie"),
    material("Lightning Arrestor", site, "Nos", "ESE type LA with base plate, mounting assembly and porcelain insulator bushing"),
    material(
      "Earthing Kit",
      site,
      "Set",
      "GI strip 25×3 sq mm / green wire, GI/CU electrode 3 mtr with chemical earthing, earth pit chamber and chemical bags",
    ),
    material("Earthing Wire", site, "Mtr", "6 sq mm copper clad wire (Indo) or 16 sq mm aluminium wire (Ramsons)"),
    material("ACDB Panel", "1 No", "", "AC SPDs, AL/CU bus bar, MCCBs — L&T / Havells / Elmex"),
    material("Generation Meter", "1 No", "", "HT energy generation meter — Secure, as per availability"),
    material("Connection Kit", site, "—", "Connecting cable (4 sq mm — Polycab), MC4, jumper"),
    material("Cable Tray", site, "Mtr", "GI perforated cable tray with assembly"),
    material("Walkway", site, "Mtr", "FRP walkway"),
    material("MCS / UPVC Pipes", site, "Mtr", "UPVC pipes for module cleaning system"),
    material("Designed Installation & Commissioning", "", "As per site requirement", "Team Mahi Solar Solution"),
  ];
}

function panelQtyLabel(panels: number, language: QuotationLanguage): string {
  return language === "hi" ? `${panels} पैनल` : `${panels} Panel`;
}

export function applyCommercialCapacityToMaterials(
  items: QuotationMaterialItem[],
  capacity: string,
  phase: QuotationPhase,
  language: QuotationLanguage,
): QuotationMaterialItem[] {
  const kw = parseCapacityKw(capacity);
  const sized = items.map((item) => {
    if (kw && isSolarPvModulesDescription(item.description)) {
      const wp = commercialModuleWp(item);
      const panels = Math.max(1, Math.round((kw * 1000) / wp));
      return { ...item, qty: panelQtyLabel(panels, language), unit: `${wp} Wp` };
    }
    if (kw && isSolarInverterDescription(item.description)) {
      return {
        ...item,
        unit: inverterUnit(phase, language),
        make: commercialInverterMake(formatKwLabel(kw), language),
      };
    }
    return item;
  });
  return applyPhaseToMaterialItems(sized, phase, language).map((item) => {
    if (isAcCableDescription(item.description)) {
      return { ...item, make: commercialAcCableMake(phase, language, kw) };
    }
    return item;
  });
}

export const OFFGRID_MODULE_WP = 590;
export const OFFGRID_PRICE_PER_KW = 100_000;
export const OFFGRID_BATTERY_AH = 220;
export const OFFGRID_DEFAULT_INVERTER_KW = "5.1";

export function offgridPanelCount(kw: number): number {
  // 3 kW kit uses 5 × 590 Wp (~2.95 kW); round keeps that sizing for the base package.
  return Math.max(1, Math.round((kw * 1000) / OFFGRID_MODULE_WP));
}

/**
 * 3 kW kit = 5 × 12V 220Ah tubulars.
 * Other sizes scale from that count.
 */
export function offgridBatteryCount(kw: number): number {
  return Math.max(1, Math.round((kw / 3) * 5));
}

export function offgridProjectAmount(capacity: string): string {
  const kw = parseCapacityKw(capacity);
  if (!kw) {
    return "";
  }
  // Base 3 kW off-grid package is ₹2,90,000; other sizes scale from ₹1,00,000 / kW.
  if (kw === 3) {
    return "290000";
  }
  return String(Math.round(kw * OFFGRID_PRICE_PER_KW));
}

function offgridInverterUnit(language: QuotationLanguage): string {
  return language === "hi" ? "ऑफ-ग्रिड" : "Off-Grid";
}

function offgridInverterMake(kw: string, language: QuotationLanguage): string {
  return language === "hi"
    ? `${kw} किलोवाट MICROTEK ऑफ-ग्रिड PCU (48V) · वारंटी कंपनी के अनुसार`
    : `${kw} KW MICROTEK Off-Grid PCU (48V) with warranty as per company`;
}

function offgridModuleMake(language: QuotationLanguage): string {
  return language === "hi"
    ? "Waaree Topcon Bifacial · 30 वर्ष वारंटी"
    : "Waaree Topcon Bifacial with 30 Year Warranty";
}

function offgridBatteryMake(language: QuotationLanguage): string {
  return language === "hi"
    ? "Luminous नॉन-लिथियम ट्यूबुलर · वारंटी कंपनी के अनुसार"
    : "Luminous non-lithium tubular with warranty as per company";
}

function offgridBatteryQty(count: number, language: QuotationLanguage): string {
  return language === "hi" ? `${count} नं.` : `${count} Nos`;
}

export function offgridPanelConfigOffering(capacity: string, language: QuotationLanguage): string {
  const kw = parseCapacityKw(capacity) ?? 3;
  const panels = offgridPanelCount(kw);
  const totalKw = formatKwLabel((panels * OFFGRID_MODULE_WP) / 1000);
  if (language === "hi") {
    return `${panels} × ${OFFGRID_MODULE_WP}W Waaree Topcon Bifacial (कुल ${totalKw} किलोवाट)`;
  }
  return `${panels} x ${OFFGRID_MODULE_WP}W Waaree Topcon Bifacial (${totalKw} KW Total)`;
}

export function offgridBatteryOffering(capacity: string, language: QuotationLanguage): string {
  const kw = parseCapacityKw(capacity) ?? 3;
  const count = offgridBatteryCount(kw);
  if (language === "hi") {
    return `${count} × 12V ${OFFGRID_BATTERY_AH} Ah Luminous नॉन-लिथियम ट्यूबुलर`;
  }
  return `${count} × 12V ${OFFGRID_BATTERY_AH} Ah Luminous non-lithium tubular`;
}

export function syncOffgridOfferToCapacity(
  rows: QuotationCommercialRow[],
  capacity: string,
  language: QuotationLanguage,
): QuotationCommercialRow[] {
  return rows.map((row) => {
    const parameter = row.parameter.trim();
    if (parameter === "Battery Bank" || parameter === "बैटरी बैंक") {
      return { ...row, offering: offgridBatteryOffering(capacity, language) };
    }
    return row;
  });
}

function defaultOffgridMaterialItems(language: QuotationLanguage): QuotationMaterialItem[] {
  const inverterMake = offgridInverterMake(OFFGRID_DEFAULT_INVERTER_KW, language);
  const batteryMake = offgridBatteryMake(language);
  const moduleMake = offgridModuleMake(language);

  if (language === "hi") {
    return [
      material("सोलर पीवी मॉड्यूल", "5 पैनल", `${OFFGRID_MODULE_WP} Wp`, moduleMake),
      material("सोलर इनवर्टर", "1", offgridInverterUnit(language), inverterMake),
      material("माउंटिंग स्ट्रक्चर (GI अपोलो)", "आवश्यकतानुसार", "", "लेग 75×75, रैफ्टर 60×40, पर्लिन 40×40"),
      material("DC केबल", "60 तक", "मी.", "4 वर्ग मिमी कॉपर वायर, पॉलीकैब केबल"),
      material("कनेक्शन किट", "आवश्यकतानुसार", "—", "कनेक्टिंग केबल (4 वर्ग मिमी — पॉलीकैब), MC4, जम्पर"),
      material("ट्यूबुलर बैटरी बैंक", offgridBatteryQty(5, language), `12V ${OFFGRID_BATTERY_AH} Ah`, batteryMake),
      material("डिज़ाइनेड इंस्टॉलेशन व कमीशनिंग", "", "साइट आवश्यकतानुसार", "टीम माही सोलर सॉल्यूशन"),
    ];
  }

  return [
    material("Solar PV Modules", "5 Panel", `${OFFGRID_MODULE_WP} Wp`, moduleMake),
    material("Solar Inverter", "1", offgridInverterUnit(language), inverterMake),
    material("Mounting Structure (GI Apollo)", "As per Requirement", "", "Leg 75×75, Rafter 60×40, Purline 40×40"),
    material("DC Cable", "Upto 60", "Mtr", "4 sq mm Copper Wire, Polycab cable"),
    material("Connection Kit", "As per Requirement", "—", "Connecting cable (4 sq mm — Polycab), MC4, jumper"),
    material("Tubular Battery Bank", offgridBatteryQty(5, language), `12V ${OFFGRID_BATTERY_AH} Ah`, batteryMake),
    material("Designed Installation & Commissioning", "", "As per site requirement", "Team Mahi Solar Solution"),
  ];
}

export function applyOffgridCapacityToMaterials(
  items: QuotationMaterialItem[],
  capacity: string,
  phase: QuotationPhase,
  language: QuotationLanguage,
): QuotationMaterialItem[] {
  const kw = parseCapacityKw(capacity);
  const sized = items.map((item) => {
    if (kw && isSolarPvModulesDescription(item.description)) {
      const panels = offgridPanelCount(kw);
      return { ...item, qty: panelQtyLabel(panels, language), unit: `${OFFGRID_MODULE_WP} Wp` };
    }
    if (kw && isSolarInverterDescription(item.description)) {
      return {
        ...item,
        unit: offgridInverterUnit(language),
        make: offgridInverterMake(OFFGRID_DEFAULT_INVERTER_KW, language),
      };
    }
    if (kw && isBatteryBankDescription(item.description)) {
      const count = offgridBatteryCount(kw);
      return {
        ...item,
        qty: offgridBatteryQty(count, language),
        unit: `12V ${OFFGRID_BATTERY_AH} Ah`,
        make: offgridBatteryMake(language),
      };
    }
    return item;
  });
  return applyPhaseToMaterialItems(sized, phase, language).map((item) => {
    if (isSolarInverterDescription(item.description)) {
      return { ...item, unit: offgridInverterUnit(language) };
    }
    return item;
  });
}

function defaultAssumptions(language: QuotationLanguage): string[] {
  if (language === "hi") {
    return [
      "भौगोलिक साइट स्थितियों के अनुसार औसत 6 घंटे पीक धूप उपलब्धता।",
      "यह माना गया है कि मॉड्यूल इंस्टॉलेशन हेतु पर्याप्त छाया-मुक्त क्षेत्र उपलब्ध है। पहले से लगे उपकरण के कारण प्रतिबंध होने पर, उत्पादन पर न्यूनतम प्रभाव रखते हुए अन्य छत (साइट पर उपलब्ध) का उपयोग करना पड़ सकता है।",
      "छत की भार वहन क्षमता MMS सिस्टम का भार व क्षेत्र के विंड लोड को वहन करने के लिए पर्याप्त होनी चाहिए।",
    ];
  }
  return [
    "Peak sunshine availability of 6 hours average as per the geographical site conditions.",
    "It is assumed that sufficient shadow-free area is available for installation of modules. In case of restriction due to already installed equipment, other roof (as available at site) may have to be used keeping minimum impact on generation.",
    "Load bearing capacity of the roof should be adequate to carry the load of the MMS system considering the wind load of the zone.",
  ];
}

function defaultCustomerScope(language: QuotationLanguage, options?: { commercial?: boolean; offgrid?: boolean }): string[] {
  const residential =
    language === "hi"
      ? [
          "साइट तैयार करना व छत/टेरेस से अवांछित सामग्री हटाना कार्यक्षेत्र में शामिल नहीं है। परिसर व छत तक सामग्री ले जाने में इंस्टॉलेशन टीम को आवश्यक सहयोग देना होगा; इंस्टॉलेशन पूर्ण होने तक सामग्री सुरक्षित स्थान पर रखनी होगी।",
          "साइट पर डिलीवरी के बाद आपूर्ति की गई सामग्री की सुरक्षा ग्राहक के दायरे में होगी।",
          "क्लाउड मॉनिटरिंग हेतु LAN (इंटरनेट सुविधा) ग्राहक प्रदान करेगा।",
          "मॉड्यूल सफाई हमारे दायरे में नहीं है; ग्राहक से सप्ताह में एक बार पैनल साफ करने का अनुरोध है।",
        ]
      : [
          "Making the site ready and cleaning the terrace / roof of any unwanted items is not included in scope of work. Necessary support will be extended to our installation team for taking material inside the premises and to the rooftop; the same has to be kept at a proper and secure place till completion of installation.",
          "Safety of material supplied would be in customer scope after delivery at site.",
          "Customer to provide LAN (internet facility) for cloud monitoring.",
          "Cleaning of modules is not in our scope; customer is requested to clean the panels once a week.",
        ];

  if (options?.offgrid) {
    const batteryRoom =
      language === "hi"
        ? "ट्यूबुलर बैटरी बैंक हेतु सूखा, हवादार इनडोर स्थान ग्राहक प्रदान करेगा — बारिश या सीधी धूप में नहीं।"
        : "Customer to provide a dry, ventilated indoor space for the tubular battery bank (not in rain or direct sun).";
    return [...residential, batteryRoom];
  }

  if (!options?.commercial) {
    return residential;
  }

  const extra =
    language === "hi"
      ? [
          "कार्य दल को सप्ताह के 7 दिन साइट पहुँच देनी होगी, सामग्री डिलीवरी सहित।",
          "प्रोजेक्ट हेतु आवश्यक सभी वैधानिक अनुमतियाँ, यदि हों, ग्राहक के दायरे में हैं।",
          "सिस्टम इंस्टॉलेशन हेतु अतिरिक्त साइट-विशिष्ट सिविल कार्य, संशोधन या परिवर्तन ग्राहक के दायरे में हैं।",
          "मॉड्यूल सफाई हेतु पानी का स्रोत ग्राहक प्रदान करेगा।",
        ]
      : [
          "Facilitate access for the work crew 7 days a week, including for delivery of equipment and materials.",
          "All statutory clearances required for the project, if any, are in the client's scope.",
          "Additional site-specific civil work, modification or alteration required for system installation is in the client's scope.",
          "Source of water for module cleaning is to be provided by the client.",
        ];

  return [...residential, ...extra];
}

function defaultOurScope(language: QuotationLanguage): string[] {
  if (language === "hi") {
    return [
      "सिविल, स्ट्रक्चरल, विद्युत व मैकेनिकल सहित पूर्ण सिस्टम डिज़ाइन, निर्माण ड्रॉइंग व विशिष्टताओं के साथ।",
      "उपकरण व सामग्री खरीदकर साइट पर डिलीवरी।",
      "निर्माता निर्देशों के अनुसार विद्युत घटकों का परीक्षण।",
      "प्लांट का इंस्टॉलेशन, परीक्षण व कमीशनिंग।",
    ];
  }
  return [
    "Prepare full system design covering civil, structural, electrical and mechanical components, with construction drawings and specifications.",
    "Procure equipment and materials and deliver to site.",
    "Test electrical components in accordance with manufacturer instructions.",
    "Installation, testing and commissioning of the plant.",
  ];
}

function defaultOnGridNote(language: QuotationLanguage): string {
  return language === "hi"
    ? "यह ग्रिड-कनेक्टेड (ऑन-ग्रिड) रूफटॉप प्लांट है: पैनलों से DC बिजली इनवर्टर द्वारा AC में बदलकर साइट पर उपयोग होती है। अतिरिक्त यूनिट मीटर के माध्यम से DISCOM ग्रिड में निर्यात होती हैं।"
    : "This is a grid-connected (on-grid) rooftop plant: DC from the modules is converted to AC by the inverter and used on site. Surplus units export to the DISCOM grid through the meter.";
}

function defaultDiscomChargesNote(language: QuotationLanguage): string {
  return language === "hi"
    ? "अतिरिक्त — ग्राहक द्वारा वास्तविक के अनुसार देय"
    : "Extra — payable by client as actual";
}

function defaultOffGridNote(language: QuotationLanguage): string {
  return language === "hi"
    ? "यह ऑफ-ग्रिड (स्टैंडअलोन) प्लांट है: पैनलों से DC बिजली बैटरी बैंक को चार्ज करती है और Microtek ऑफ-ग्रिड इनवर्टर द्वारा AC में बदलकर साइट पर उपयोग होती है। यह DISCOM ग्रिड में निर्यात नहीं करता और पीएम सूर्य घर सब्सिडी के लिए पात्र नहीं है।"
    : "This is an off-grid (standalone) plant: DC from the modules charges the battery bank and is converted to AC by the Microtek off-grid inverter for on-site use. It does not export to the DISCOM grid and is not eligible for PM Surya Ghar subsidy.";
}

function commercial(parameter: string, offering: string): QuotationCommercialRow {
  return { id: uuid(), parameter, offering };
}

function defaultCommercialOffer(
  language: QuotationLanguage,
  options?: { commercial?: boolean; offgrid?: boolean; capacity?: string },
): QuotationCommercialRow[] {
  const capacity = options?.capacity || (options?.offgrid ? "3 KW" : "10 KW");

  if (options?.offgrid) {
    if (language === "hi") {
      return [
        commercial("बैटरी बैंक", offgridBatteryOffering(capacity, language)),
        commercial("मूल्य आधार", "टर्नकी EPC"),
      ];
    }
    return [
      commercial("Battery Bank", offgridBatteryOffering(capacity, language)),
      commercial("Price Basis", "Turnkey EPC"),
    ];
  }

  if (options?.commercial) {
    if (language === "hi") {
      return [
        commercial("मूल्य आधार", "टर्नकी EPC"),
        commercial("DISCOM / वैधानिक शुल्क", defaultDiscomChargesNote(language)),
      ];
    }
    return [
      commercial("Price Basis", "Turnkey EPC"),
      commercial("DISCOM / statutory charges", defaultDiscomChargesNote(language)),
    ];
  }

  if (language === "hi") {
    return [commercial("मूल्य आधार", "टर्नकी EPC")];
  }
  return [commercial("Price Basis", "Turnkey EPC")];
}

function term(label: string, text: string): QuotationTermItem {
  return { id: uuid(), label, text };
}

function stripSubsidyFromTimeline(text: string): string {
  return text
    .replace(/\n• सरकारी सब्सिडी प्रक्रिया:[^\n]*/u, "")
    .replace(/\n• Government Subsidy processing:[^\n]*/u, "");
}

function isSubsidyTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Government Subsidy Dependency" || label === "सरकारी सब्सिडी निर्भरता";
}

function isNetMeteringTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Net Metering Approval" || label === "नेट मीटरिंग अनुमोदन";
}

function isPaymentTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Payment Terms & Project Phases" || label === "भुगतान शर्तें व प्रोजेक्ट चरण";
}

function isAdditionalWorkTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Additional Work Charges" || label === "अतिरिक्त कार्य शुल्क";
}

function isPaymentDelayTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Payment Delay" || label === "भुगतान विलंब";
}

function isWarrantyCoverageTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Warranty Coverage & Limitations" || label === "वारंटी कवरेज व सीमाएँ";
}

function isTimelineTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Project Timeline & Installation Process" || label === "प्रोजेक्ट समयरेखा व इंस्टॉलेशन प्रक्रिया";
}

function isValidityTerm(item: QuotationTermItem): boolean {
  const label = item.label.trim();
  return label === "Quotation Validity" || label === "कोटेशन वैधता";
}

function commercialValidityText(language: QuotationLanguage): string {
  return language === "hi"
    ? "यह कोटेशन जारी होने की तिथि से 30 दिनों तक वैध है। वैधता अवधि समाप्त होने के बाद कीमतें व विशिष्टताएँ बदल सकती हैं। इस अवधि के बाद पुष्टि लेनी होगी; नया कोटेशन आवश्यक हो सकता है।"
    : "This quotation is valid for 30 days from the date of issue. Prices and specifications are subject to change after the validity period expires. After this period a confirmation has to be taken; a fresh quotation may be required.";
}

function commercialTimelineText(language: QuotationLanguage): string {
  return language === "hi"
    ? "डिलीवरी, इंस्टॉलेशन व कमीशनिंग सामान्यतः तकनीकी व वाणिज्यिक रूप से स्पष्ट ऑर्डर तथा अग्रिम भुगतान की तिथि से 1 माह में पूर्ण होते हैं — साइट तैयारी व मौसम पर निर्भर। यह तभी लागू जब सहमत भुगतान अनुसूची का पालन हो।\n\nमहत्वपूर्ण - बाहरी निर्भरताएँ (उपरोक्त समयरेखा में शामिल नहीं):\n• नेट मीटरिंग / DISCOM अनुमोदन: DISCOM (JVVNL) — सामान्यतः 20–30 दिन। माही सोलर के नियंत्रण से बाहर।"
    : "Delivery, installation and commissioning are typically completed within 1 month from the date of a technically and commercially clear order together with the advance payment, subject to site readiness and weather. This applies when the agreed payment schedule is followed.\n\nIMPORTANT - External Dependencies (NOT included in the above timeline):\n• Net Metering / DISCOM approval: handled by DISCOM (JVVNL) — typically 20–30 days. Timeline beyond Mahi Solar's control.";
}

function offgridPaymentTermsText(language: QuotationLanguage): string {
  return language === "hi"
    ? "भुगतान अनुसूची:\n\n• अग्रिम: ऑर्डर पुष्टि के साथ 20%\n• द्वितीय भुगतान: सामग्री डिस्पैच व इंस्टॉलेशन शुरू होने से पहले 70%\n• अंतिम भुगतान: इंस्टॉलेशन, परीक्षण व कमीशनिंग पूर्ण होने के बाद 10%\n\nऋण वित्त होने पर इंस्टॉलेशन बैंक की प्रथम किस्त मिलते ही शुरू होता है; शेष भुगतान बैंक वितरण अनुसूची के अनुसार। यह ऑफ-ग्रिड प्लांट है — DISCOM नेट मीटरिंग लागू नहीं।"
    : "Payment schedule:\n\n• Advance: 20% with order confirmation\n• 2nd Payment: 70% before material dispatch & installation begins\n• Final Payment: 10% after installation, testing and commissioning are complete\n\nIf loan-financed, installation begins on receipt of the bank's first installment; subsequent payments follow the bank disbursement schedule. This is an off-grid plant — DISCOM net metering does not apply.";
}

function offgridTimelineText(language: QuotationLanguage): string {
  return language === "hi"
    ? "डिलीवरी, इंस्टॉलेशन व कमीशनिंग सामान्यतः तकनीकी व वाणिज्यिक रूप से स्पष्ट ऑर्डर तथा अग्रिम भुगतान की तिथि से 1 माह में पूर्ण होते हैं — साइट तैयारी, बैटरी स्थान व मौसम पर निर्भर। यह तभी लागू जब सहमत भुगतान अनुसूची का पालन हो। नेट मीटरिंग / DISCOM अनुमोदन इस ऑफ-ग्रिड प्लांट पर लागू नहीं।"
    : "Delivery, installation and commissioning are typically completed within 1 month from the date of a technically and commercially clear order together with the advance payment, subject to site readiness, battery-room readiness and weather. This applies when the agreed payment schedule is followed. Net metering / DISCOM approval does not apply to this off-grid plant.";
}

function offgridAdditionalWorkText(language: QuotationLanguage): string {
  return language === "hi"
    ? "कोटेशन केवल वाणिज्यिक प्रस्ताव में उल्लिखित कार्यक्षेत्र कवर करता है। अतिरिक्त कार्य जैसे:\n• अतिरिक्त विद्युत कार्य या रीवायरिंग\n• छत की संरचनात्मक मरम्मत या संशोधन\n• अतिरिक्त केबल रन या माउंटिंग समायोजन\n• अतिरिक्त बैटरी, स्टैंड या बैटरी रूम सिविल कार्य\n• इंस्टॉलेशन समझौते पर हस्ताक्षर के बाद मांगे गए परिवर्तन\n\nमाही सोलर सॉल्यूशन की प्रचलित दरों पर अलग से शुल्क लगेगा (पुनः कार्य या अतिरिक्त सेवाओं हेतु न्यूनतम ₹3,000 प्रति दिन)।"
    : "The quotation covers only the scope mentioned in the Commercial Offer. Any additional work required, such as:\n• Additional electrical work or rewiring\n• Structural repairs or modifications to the roof\n• Extra cable runs or mounting adjustments\n• Extra batteries, stand or battery-room civil work\n• Any changes requested after the installation agreement is signed\n\nwill be charged separately at Mahi Solar Solution's prevailing rates (minimum ₹3,000 per day for re-work or additional services).";
}

function offgridPaymentDelayText(language: QuotationLanguage): string {
  return language === "hi"
    ? "यदि ग्राहक सहमत अनुसूची के अनुसार भुगतान नहीं करता, तो बकाया भुगतान साफ होने तक सामग्री डिस्पैच, इंस्टॉलेशन या प्रोजेक्ट पूर्णता स्थगित करने का अधिकार माही सोलर सॉल्यूशन प्राइवेट लिमिटेड के पास सुरक्षित है।"
    : "If the customer fails to make payments as per the agreed schedule, Mahi Solar Solution Private Limited reserves the right to suspend material dispatch, installation work, or project completion until all outstanding payments are cleared.";
}

function patchOffgridWarrantyText(text: string): string {
  return text
    .replace(
      "Inverter: 10-year manufacturer warranty",
      "Inverter: As per MICROTEK company warranty",
    )
    .replace(
      "Batteries (if applicable): Covered under respective manufacturer's warranty terms",
      "Batteries: As per MICROTEK company warranty",
    )
    .replace("इनवर्टर: 10 वर्ष निर्माता वारंटी", "इनवर्टर: MICROTEK कंपनी वारंटी के अनुसार")
    .replace("बैटरी (यदि लागू): संबंधित निर्माता की शर्तों के अंतर्गत", "बैटरी: MICROTEK कंपनी वारंटी के अनुसार");
}

function defaultTerms(
  language: QuotationLanguage,
  includeSubsidy = true,
  variant: "residential" | "commercial" | "offgrid" = "residential",
): QuotationTermItem[] {
  const terms =
    language === "hi"
      ? [
      term(
        "कोटेशन वैधता",
        "यह कोटेशन जारी होने की तिथि से 15 दिनों तक वैध है। वैधता अवधि समाप्त होने के बाद कीमतें व विशिष्टताएँ बदल सकती हैं। इस अवधि के बाद दिए गए ऑर्डर के लिए नया कोटेशन आवश्यक होगा।",
      ),
      term("ट्रांजिट बीमा", "साइट पर सामग्री डिलीवरी तक।"),
      term(
        "भुगतान शर्तें व प्रोजेक्ट चरण",
        "भुगतान अनुसूची वित्त विधि पर निर्भर करती है:\n\n100% नकद भुगतान\n• अग्रिम: ऑर्डर पुष्टि के साथ 20%\n• द्वितीय भुगतान: सामग्री डिस्पैच व इंस्टॉलेशन शुरू होने से पहले 70%\n• अंतिम भुगतान: DISCOM से नेट मीटरिंग अनुमोदन के बाद 10%\n\n100% ऋण वित्त\n• बैंक से प्रथम ऋण किस्त प्राप्त होते ही इंस्टॉलेशन कार्य शुरू\n• आगे के भुगतान बैंक की ऋण वितरण अनुसूची के अनुसार\n• इंस्टॉलेशन पूर्णता शेष ऋण किस्तों पर निर्भर नहीं\n\nहाइब्रिड (ऋण + नकद मिश्रण)\n• प्रथम किस्त (इंस्टॉलेशन से पहले): बैंक की पहली ऋण वितरण + ग्राहक का नकद योगदान\n• आगे के भुगतान (नेट मीटरिंग अनुमोदन के बाद): शेष बैंक वितरण + ग्राहक का स्थगित अधिकतम 10%\n• ग्राहक का नकद योगदान = ऋण से न ढकी प्रोजेक्ट राशि (नेट मीटरिंग तक अधिकतम 10% स्थगित किया जा सकता है)\n• पहली बैंक किस्त + ग्राहक नकद प्राप्त होते ही इंस्टॉलेशन तुरंत शुरू\n\nमहत्वपूर्ण नोट\n• नकद विधि में: ग्राहक कुल प्रोजेक्ट लागत का अधिकतम 10% नेट मीटरिंग अनुमोदन तक स्थगित कर सकता है\n• हाइब्रिड में: ग्राहक का नकद पहली बैंक किस्त के साथ अग्रिम; अधिकतम 10% नेट मीटरिंग तक स्थगित\n• नेट मीटरिंग अनुमोदन समयरेखा इंस्टॉलेशन पूर्णता को प्रभावित नहीं करती\n• पहली किस्त (बैंक + ग्राहक नकद) मिलते ही इंस्टॉलेशन तुरंत शुरू होता है",
      ),
      term(
        "प्रोजेक्ट समयरेखा व इंस्टॉलेशन प्रक्रिया",
        "चरण 1 - साइट निरीक्षण व समझौता (सामग्री डिस्पैच से पहले):\n• माही सोलर सॉल्यूशन का इंजीनियर साइट निरीक्षण व माप करेगा।\n• ग्राहक अंतिम विशिष्टताओं सहित इंस्टॉलेशन समझौते पर हस्ताक्षर करेगा।\n• अवधि: कोटेशन स्वीकृति से 3–5 कार्य दिवस।\n\nचरण 2 - सामग्री आपूर्ति:\n• आवश्यक प्रारंभिक भुगतान प्राप्त होने के 3–5 कार्य दिवस में सामग्री डिस्पैच।\n\nचरण 3 - इंस्टॉलेशन कार्य (MSS जिम्मेदारी):\n• टीम इंस्टॉलेशन व सिस्टम कमीशनिंग: 7–10 कार्य दिवस।\n• शामिल: माउंटिंग स्ट्रक्चर, सोलर पैनल, इनवर्टर, BOS, विद्युत कनेक्शन, परीक्षण व कमीशनिंग।\n• समयरेखा साइट तैयारी व मौसम पर निर्भर।\n\nमहत्वपूर्ण - बाहरी निर्भरताएँ (उपरोक्त समयरेखा में शामिल नहीं):\n• नेट मीटरिंग अनुमोदन: DISCOM (JVVNL) — सामान्यतः 20–30 दिन। माही सोलर के नियंत्रण से बाहर।\n• सरकारी सब्सिडी प्रक्रिया: पीएम सूर्य घर प्राधिकरण — सरकारी अनुमोदन पर निर्भर। इंस्टॉलेशन पूर्णता का भाग नहीं।",
      ),
      term(
        "नेट मीटरिंग अनुमोदन",
        "ग्रिड-कनेक्टेड सोलर सिस्टम के लिए DISCOM (JVVNL) से नेट मीटरिंग अनुमोदन आवश्यक है। इंस्टॉलेशन पूर्ण व दस्तावेज़ जमा करने के बाद सामान्यतः 7–15 कार्य दिवस लगते हैं। यह समयरेखा माही सोलर सॉल्यूशन के नियंत्रण से बाहर है और DISCOM प्रक्रिया पर निर्भर है। नेट मीटरिंग अनुमोदन इंस्टॉलेशन कार्य पूर्णता को प्रभावित नहीं करता।",
      ),
      term(
        "ग्राहक की छत व साइट आवश्यकताएँ",
        "ग्राहक सुनिश्चित करे:\n• पेड़, भवन या संरचनाओं से न्यूनतम रुकावट वाली छाया-मुक्त छत।\n• इंस्टॉलेशन टीम व उपकरण आवागमन हेतु सुरक्षित पहुँच।\n• साइट के भौगोलिक क्षेत्र के अनुसार सोलर सिस्टम भार व विंड लोड हेतु पर्याप्त छत भार क्षमता।\n• इंस्टॉलेशन उपकरण हेतु उचित वेंटिलेशन व बिजली आपूर्ति सहित सुरक्षित कार्य वातावरण।\n• किसी भी संरचनात्मक समस्या या संशोधन की जानकारी इंस्टॉलेशन शुरू होने से पहले माही सोलर सॉल्यूशन को दें।",
      ),
      term(
        "अतिरिक्त कार्य शुल्क",
        "कोटेशन केवल वाणिज्यिक प्रस्ताव में उल्लिखित कार्यक्षेत्र कवर करता है। अतिरिक्त कार्य जैसे:\n• DISCOM के साथ लोड एक्सटेंशन\n• अतिरिक्त विद्युत कार्य या रीवायरिंग\n• छत की संरचनात्मक मरम्मत या संशोधन\n• अतिरिक्त केबल रन या माउंटिंग समायोजन\n• इंस्टॉलेशन समझौते पर हस्ताक्षर के बाद मांगे गए परिवर्तन\n\nमाही सोलर सॉल्यूशन की प्रचलित दरों पर अलग से शुल्क लगेगा (पुनः कार्य या अतिरिक्त सेवाओं हेतु न्यूनतम ₹3,000 प्रति दिन)।",
      ),
      term(
        "माप, योजना व इंस्टॉलेशन के बाद परिवर्तन",
        "माही सोलर सॉल्यूशन का इंजीनियर साइट पर माप व इंस्टॉलेशन योजना करेगा। ग्राहक द्वारा उस योजना / लेआउट / विशिष्टताओं पर सहमति देने के बाद, इंस्टॉलेशन पूर्ण होने पर यदि ग्राहक किसी भी प्रकार का परिवर्तन, शिफ्टिंग, री-वर्क या लेआउट संशोधन मांगता है, तो वह माही सोलर सॉल्यूशन की जिम्मेदारी नहीं होगा। ऐसे परिवर्तन अतिरिक्त कार्य माने जाएँगे और कंपनी की प्रचलित दरों पर अलग से शुल्क लगेगा।",
      ),
      term(
        "सामग्री सुरक्षा व जिम्मेदारी",
        "ट्रांजिट के दौरान व प्रोजेक्ट साइट पर डिलीवरी तक सामग्री सुरक्षा माही सोलर सॉल्यूशन की जिम्मेदारी है। साइट पर डिलीवरी के बाद:\n• सभी आपूर्ति सामग्री की सुरक्षा व सुरक्षा ग्राहक की जिम्मेदारी।\n• साइट पर चोरी, क्षति, तोड़फोड़ या हानि हेतु माही सोलर उत्तरदायी नहीं।\n• इंस्टॉलेशन तक सामग्री सुरक्षित स्थान पर रखें।\n• डिलीवरी के बाद लापरवाही या अनुचित भंडारण से क्षति पर रिप्लेसमेंट हेतु अतिरिक्त शुल्क लगेगा।",
      ),
      term(
        "पैनल सफाई व मेंटेनेंस",
        "इष्टतम प्रदर्शन हेतु अनुशंसा:\n• स्थानीय धूल/प्रदूषण स्तर के अनुसार सप्ताह में एक बार या 15 दिनों में एक बार पैनल साफ करें।\n• धूल जमा होने से उत्पादन दक्षता 15–25% तक घट सकती है।\n• मुलायम कपड़े व डिस्टिल्ड पानी से साफ करें; कठोर रसायन या अपघर्षक से बचें।\n• नियमित सफाई ग्राहक की जिम्मेदारी है। माही सोलर सशुल्क सफाई सेवा दे सकता है।",
      ),
      term(
        "विद्युत उत्पादन व मौसमी भिन्नता",
        "उत्पादन अनुमान सिस्टम किलोवाट (पैनल वॉट × मात्रा) पर आधारित है:\n• प्रथम वर्ष: औसत 4 यूनिट प्रति किलोवाट प्रति दिन\n• वर्ष 2–5: औसत 3.9 यूनिट प्रति किलोवाट प्रति दिन\n\nमौसमी भिन्नता:\n• गर्मी (मार्च–मई): उच्च उत्पादन — वार्षिक औसत से लगभग 20–25% अधिक।\n• मानसून (जून–सितंबर): कम उत्पादन — बादल व बारिश के कारण औसत से लगभग 30–40% कम।\n• सर्दी (अक्टूबर–फरवरी): मध्यम उत्पादन — औसत से लगभग 5–10% कम।\n\nनोट: मासिक उत्पादन मौसम, बादल व दिन की लंबाई पर निर्भर करता है।",
      ),
      term(
        "वारंटी कवरेज व सीमाएँ",
        "दायित्व व वर्कमैनशिप वारंटी:\n• माही सोलर सॉल्यूशन की जिम्मेदारी सहमत सोलर सिस्टम इंस्टॉलेशन कार्यक्षेत्र तक सीमित है।\n• माउंटिंग स्ट्रक्चर व इंस्टॉलेशन पर 5 वर्ष वर्कमैनशिप वारंटी, तथा इंस्टॉलेशन तिथि से इंस्टॉलेशन संबंधी संरचनात्मक व तकनीकी मुद्दों हेतु 5 वर्ष मेंटेनेंस सहायता।\n\nवारंटी कवरेज:\n• पैनल: 30 वर्ष उत्पाद वारंटी (निर्माण दोष) + 25 वर्ष प्रदर्शन वारंटी\n• इनवर्टर: 10 वर्ष निर्माता वारंटी\n• बैटरी (यदि लागू): संबंधित निर्माता की शर्तों के अंतर्गत\n• BOS व इंस्टॉलेशन: 5 वर्ष वारंटी\n\nनिर्माता वारंटी:\n• सोलर पैनल, इनवर्टर, बैटरी व अन्य घटक केवल संबंधित निर्माता की वारंटी शर्तों के अंतर्गत कवर हैं।\n\nप्राकृतिक आपदाएँ:\n• तूफान, बाढ़, बिजली, भूकंप, आग या अन्य प्राकृतिक आपदाओं से क्षति ग्राहक की एकमात्र जिम्मेदारी।\n\nवारंटी कवर नहीं करेगी:\n• जला, भौतिक क्षतिग्रस्त, छेड़छाड़, चोरी, या अनुचित उपयोग वाले उत्पाद\n• प्राकृतिक आपदा से क्षति\n• चोरी या तोड़फोड़\n• बाहरी कारणों से आग या विद्युत क्षति\n• अनुचित मेंटेनेंस या सफाई से क्षति\n• अनधिकृत संशोधन या मरम्मत\n• उपयोगकर्ता लापरवाही या दुरुपयोग\n• छत पर प्रभाव या संरचनात्मक क्षति\n\nवारंटी दावे मूल उपकरण निर्माता की शर्तों के अधीन हैं।",
      ),
      term(
        "सरकारी सब्सिडी निर्भरता",
        "पीएम सूर्य घर: मुफ्त बिजली योजना के अंतर्गत सरकारी सब्सिडी निम्न पर निर्भर है:\n• नवीनतम सरकारी दिशानिर्देश व योजना पात्रता\n• संबंधित सरकारी प्राधिकरण (SECI, राज्य नोडल एजेंसी) की स्वीकृति\n• आवश्यक दस्तावेज़ व DISCOM अनुमोदन समय पर जमा करना\n• लाभार्थी की पात्रता (आवासीय संपत्ति, आय सीमा आदि)\n\nसब्सिडी राशि व अनुमोदन समयरेखा माही सोलर सॉल्यूशन के नियंत्रण से बाहर है। सब्सिडी अनुमोदन में विलंब इंस्टॉलेशन कार्य को प्रभावित नहीं करेगा। सब्सिडी वितरण सरकारी प्रक्रिया पर निर्भर है।\n\nभुगतान शर्तें:\n• पात्र सरकारी सब्सिडी सीधे ग्राहक के पंजीकृत बैंक खाते में जमा होगी।\n• ग्राहक को स्वीकृत ऋण राशि को छोड़कर पूर्ण अनुबंध राशि माही सोलर सॉल्यूशन प्राइवेट लिमिटेड को चुकानी होगी।\n• सब्सिडी विक्रेता को ग्राहक भुगतान से समायोजित नहीं की जाएगी।",
      ),
      term(
        "न्यायाधिकार व विवाद समाधान",
        "यह कोटेशन व सभी संबंधित समझौते राजस्थान, भारत के कानूनों से शासित हैं। इस कोटेशन या इंस्टॉलेशन कार्य से उत्पन्न सभी विवाद जयपुर सिविल कोर्ट के अनन्य न्यायाधिकार के अधीन होंगे। दोनों पक्ष पहले बातचीत से, फिर आवश्यकतानुसार मध्यस्थता से विवाद सुलझाने पर सहमत हैं।",
      ),
      term(
        "वारंटी",
        "प्लांट 25 वर्ष रैखिक दक्षता हेतु डिज़ाइन किया गया है। 4.5 घंटे प्रति दिन सन उपलब्धता मानकर, प्लांट 10 वर्ष तक रेटेड क्षमता का न्यूनतम 90% व उसके बाद 25 वर्ष तक 80% न्यूनतम शक्ति उत्पन्न करेगा। हम 5 वर्ष वारंटी सहायता भी देते हैं; तथापि वारंटी सोलर पैनल व इनवर्टर के मूल उपकरण निर्माता की होगी।",
      ),
      term(
        "फोटोग्राफी व कंटेंट निर्माण",
        "माही सोलर सॉल्यूशन इंस्टॉलेशन के दौरान व बाद में मार्केटिंग, विज्ञापन व प्रचार हेतु फोटोग्राफी, वीडियो व कंटेंट निर्माण का अधिकार सुरक्षित रखता है। सभी कैप्चर किए गए कंटेंट व बौद्धिक संपदा अधिकार कंपनी के हैं।",
      ),
      term(
        "रद्दीकरण नीति",
        "यदि ग्राहक पुष्टि या सामग्री डिस्पैच के बाद ऑर्डर रद्द करता है, तो खरीदी गई सामग्री, परिवहन व अन्य खर्चों की वास्तविक लागत काटी जाएगी। ऐसी कटौती के बाद ही वापसी योग्य राशि संसाधित होगी।",
      ),
      term(
        "अप्रत्याशित घटना (Force Majeure)",
        "प्राकृतिक आपदा, भारी वर्षा, बाढ़, भूकंप, आग, हड़ताल, सरकारी प्रतिबंध, युद्ध, महामारी या अन्य अप्रत्याशित घटनाओं के कारण प्रोजेक्ट निष्पादन में विलंब या विफलता हेतु माही सोलर सॉल्यूशन प्राइवेट लिमिटेड उत्तरदायी नहीं होगा।",
      ),
      term(
        "सामग्री का स्वामित्व",
        "पूर्ण प्रोजेक्ट भुगतान प्राप्त होने तक सभी आपूर्ति सामग्री व उपकरण माही सोलर सॉल्यूशन प्राइवेट लिमिटेड की संपत्ति रहेंगे। भुगतान न होने या सहमत भुगतान शर्तों के उल्लंघन पर कंपनी आपूर्ति सामग्री वापस लेने का अधिकार रखती है।",
      ),
      term(
        "छत की स्थिति व जल रिसाव",
        "इंस्टॉलेशन से पहले छत संरचनात्मक रूप से मजबूत व किसी मौजूदा जल रिसाव या क्षति से मुक्त हो, यह सुनिश्चित करना ग्राहक की जिम्मेदारी है। पूर्व-मौजूद छत दोषों हेतु माही सोलर उत्तरदायी नहीं। तथापि हमारे इंस्टॉलेशन कार्य से सीधे हुई क्षति कंपनी द्वारा मरम्मत की जाएगी।",
      ),
      term(
        "भुगतान विलंब",
        "यदि ग्राहक सहमत अनुसूची के अनुसार भुगतान नहीं करता, तो बकाया भुगतान साफ होने तक सामग्री डिस्पैच, इंस्टॉलेशन, नेट मीटरिंग दस्तावेज़ीकरण या प्रोजेक्ट पूर्णता स्थगित करने का अधिकार माही सोलर सॉल्यूशन प्राइवेट लिमिटेड के पास सुरक्षित है।",
      ),
      term(
        "अंतिम भुगतान व मूल्य अंतिमता",
        "कार्य पूर्ण होने के बाद या अंतिम भुगतान के समय सहमत मूल्य में कोई छूट या संशोधन स्वीकार नहीं किया जाएगा।",
      ),
      term(
        "विलंबित भुगतान व कानूनी वसूली",
        "प्रोजेक्ट पूर्णता के 21 दिनों के भीतर भुगतान न मिलने पर, लागू कानून के अंतर्गत कानूनी वसूली कार्यवाही शुरू करने का अधिकार माही सोलर सॉल्यूशन प्राइवेट लिमिटेड के पास सुरक्षित है।",
      ),
    ]
      : [
    term(
      "Quotation Validity",
      "This quotation is valid for 15 days from the date of issue. Prices and specifications are subject to change after the validity period expires. A fresh quotation will be required for orders placed after this period.",
    ),
    term("Transit Insurance", "Up to delivery of material at site."),
    term(
      "Payment Terms & Project Phases",
      "Payment schedule depends on the financing method:\n\n100% CASH PAYMENT\n• Advance: 20% with order confirmation\n• 2nd Payment: 70% before material dispatch & installation begins\n• Final Payment: 10% after net metering approval from DISCOM\n\n100% LOAN FINANCING\n• Installation work begins immediately upon receipt of first loan installment from bank\n• Subsequent payments follow bank's loan disbursement schedule\n• Installation completion not dependent on remaining loan tranches\n\nHYBRID (LOAN + CASH MIX)\n• 1st Installment (Before Installation Starts): Bank's 1st loan disbursement + Client's cash contribution\n  Example: Total cost ₹2.5L | Loan ₹2L (1st disbursement ₹1.4L) + Client cash ₹50k = ₹1.9L received → Installation begins\n• Subsequent Payments (After Net Metering Approval): Remaining bank disbursements + Client's deferred 10%\n  Example: Bank 2nd disbursement ₹60k + Client deferred 10% (₹25k) = ₹85k\n• Client's cash contribution = Amount of project not covered by loan (can defer max 10% until net metering)\n• Installation proceeds immediately once 1st bank installment + client's cash contribution are received\n\nIMPORTANT NOTE\n• In CASH method: Client defers max 10% of total project cost until after net metering approval\n• In HYBRID method: Client's cash is paid upfront with 1st bank installment; max 10% can be deferred until after net metering\n• Net metering approval timeline does not impact installation work completion\n• Once 1st installment (bank payment + client cash) is received, installation work commences immediately",
    ),
    term(
      "Project Timeline & Installation Process",
      "PHASE 1 - Site Inspection & Agreement (Before Material Dispatch):\n• Mahi Solar Solution's engineer will conduct site inspection and measurements.\n• Client reviews and signs the Installation Agreement with final specifications.\n• Duration: 3–5 working days from quotation acceptance.\n\nPHASE 2 - Material Supply:\n• Material dispatch: 3–5 working days after receipt of required initial payment (as per your payment method).\n\nPHASE 3 - Installation Work (MSS Responsibility):\n• Team installation and system commissioning: 7–10 working days.\n• Includes: Mounting structure, solar panel installation, inverter setup, BOS components, electrical connections, testing & system commissioning.\n• Timeline subject to site readiness and weather conditions.\n\nIMPORTANT - External Dependencies (NOT included in above timeline):\n• Net Metering approval: Handled by DISCOM (JVVNL) — typically 20–30 days. Timeline beyond Mahi Solar's control.\n• Government Subsidy processing: Handled by PM Surya Ghar authority — timeline depends on government approval. Not part of installation completion.",
    ),
    term(
      "Net Metering Approval",
      "Net metering approval from DISCOM (JVVNL) is essential for grid-connected solar systems. The approval timeline typically ranges from 7–15 working days after installation completion and submission of required documents. This timeline is beyond Mahi Solar Solution's control and depends on DISCOM processing. Net metering approval does not impact the installation work completion.",
    ),
    term(
      "Customer's Roof & Site Requirements",
      "The client must ensure:\n• Shadow-free rooftop with minimum obstruction from trees, buildings, or structures.\n• Safe and unobstructed access for installation team and equipment movement.\n• Roof load-bearing capacity adequate for solar system weight and wind load as per the site's geographical zone.\n• Safe working environment with proper ventilation and access to electricity supply for installation equipment.\n• Any structural issues or modifications must be communicated to Mahi Solar Solution before installation begins.",
    ),
    term(
      "Additional Work Charges",
      "The quotation covers only the scope mentioned in the Commercial Offer. Any additional work required, such as:\n• Load extension with DISCOM\n• Additional electrical work or rewiring\n• Structural repairs or modifications to the roof\n• Extra cable runs or mounting adjustments\n• Any changes requested after the installation agreement is signed\n\nwill be charged separately at Mahi Solar Solution's prevailing rates (minimum ₹3,000 per day for re-work or additional services).",
    ),
    term(
      "Measurement, Planning & Post-Installation Changes",
      "Once Mahi Solar Solution's engineer has completed site measurement and installation planning, and the client has agreed to that plan / layout / specifications, any changes, shifting, re-work, or layout modifications requested by the client after installation is complete shall not be Mahi Solar Solution's responsibility. Such changes will be treated as extra work and charged separately at the Company's prevailing rates.",
    ),
    term(
      "Material Safety & Responsibility",
      "Mahi Solar Solution is responsible for material safety during transit and up to delivery at the project site. After delivery at the site:\n• The client becomes responsible for the safety and security of all supplied materials.\n• Mahi Solar Solution is not liable for theft, damage, vandalism, or loss of materials at the site.\n• The client must store materials in a safe, secure location until installation.\n• Any damage to materials after delivery due to negligence or improper storage will result in additional charges for replacement.",
    ),
    term(
      "Panel Cleaning & Maintenance",
      "For optimal solar system performance, we recommend:\n• Regular cleaning of solar panels once every week or once every 15 days, depending on local dust/pollution levels.\n• Dust and dirt accumulation reduces generation efficiency by 15–25%, depending on dust density.\n• Panel cleaning should be done with soft cloth and distilled water; avoid harsh chemicals or abrasive materials.\n• The client is responsible for regular cleaning. Mahi Solar Solution can provide cleaning services on a paid basis.",
    ),
    term(
      "Electricity Generation & Seasonal Variation",
      "Generation estimates are based on system kW (panel watt × quantity):\n• Year 1: average 4 units per kW per day\n• Years 2–5: average 3.9 units per kW per day\n\nSeasonal Variation:\n• SUMMER (March–May): Higher generation — typically 20–25% above annual average due to increased sunlight hours.\n• MONSOON (June–September): Lower generation — typically 30–40% below annual average due to cloud cover and rain.\n• WINTER (October–February): Moderate generation — typically 5–10% below annual average.\n\nNote: Monthly generation will vary based on weather conditions, cloud cover, and daylight hours.",
    ),
    term(
      "Warranty Coverage & Limitations",
      "Scope of Responsibility & Workmanship Warranty:\n• Mahi Solar Solution's responsibility is limited to the agreed scope of solar system installation.\n• We provide a 5-year workmanship warranty on the mounting structure and installation, along with 5 years of maintenance support for installation-related structural and technical issues from the date of installation.\n\nWarranty Coverage:\n• Panels: 30-year product warranty (manufacturing defects) + 25-year performance warranty\n• Inverter: 10-year manufacturer warranty\n• Batteries (if applicable): Covered under respective manufacturer's warranty terms\n• BOS & Installation: 5-year warranty\n\nManufacturer's Warranty:\n• Solar panels, inverter, batteries (if applicable), and other system components are covered solely under the respective manufacturer's warranty terms and conditions.\n\nNatural Calamities:\n• Any damage caused by storms, floods, lightning, earthquakes, fire, or other natural calamities shall be the sole responsibility of the customer.\n\nWarranty WILL NOT Cover:\n• Burnt, physically damaged, tampered with, stolen (theft), or improperly used products\n• Damage due to natural disasters (floods, earthquakes, storms, lightning)\n• Theft or vandalism\n• Fire or electrical damage due to external causes\n• Damage due to improper maintenance or cleaning\n• Unauthorized modifications or repairs\n• Damage due to user negligence or misuse\n• Impact damage or structural damage to the roof\n\nWarranty claims are subject to the original equipment manufacturer's terms and conditions.",
    ),
    term(
      "Government Subsidy Dependency",
      "Government subsidy under PM Surya Ghar: Muft Bijli Yojana is subject to:\n• Latest government guidelines and scheme eligibility criteria\n• Approval by concerned government authorities (SECI, state nodal agency)\n• Timely submission of required documents and approvals from DISCOM\n• Beneficiary's eligibility status (residential property, income limits, etc.)\n\nSubsidy amount and approval timeline are beyond Mahi Solar Solution's control. Any delay in subsidy approval will not impact installation work. Subsidy disbursement timeline depends on government processing.\n\nPayment Terms:\n• Any eligible government subsidy will be credited directly to the customer's registered bank account.\n• The customer must pay the full contract amount (excluding any approved loan amount) to Mahi Solar Solution Private Limited.\n• The subsidy shall not be adjusted against the customer's payment to the seller.",
    ),
    term(
      "Jurisdiction & Dispute Resolution",
      "This quotation and all related agreements are governed by the laws of Rajasthan, India. All disputes, claims, or differences arising from this quotation or the installation work shall be subject to the exclusive jurisdiction of Jaipur Civil Court. Both parties agree to resolve disputes amicably through negotiation first, followed by arbitration if necessary, as per applicable law.",
    ),
    term(
      "Warranty",
      "Plant designed for 25 years with linear efficiency. The plant will produce minimum power up to 90% of the rated capacity for 10 years and thereafter 80% of the rated capacity up to 25 years, with sun availability of 4.5 hours a day during sun radiation availability. We also provide 5 years warranty support; however, the warranty will be owned by the original equipment manufacturer of the solar panel and inverter.",
    ),
    term(
      "Photography & Content Creation",
      "Mahi Solar Solution reserves the right to conduct photography, video shoots, and content creation during installation and thereafter for marketing, advertising, and promotional purposes. All captured content and intellectual property rights belong to the Company.",
    ),
    term(
      "Cancellation Policy",
      "If the customer cancels the order after confirmation or after material dispatch, the actual cost of procured materials, transportation, and other expenses incurred by Mahi Solar Solution Private Limited shall be deducted. Any refundable amount will be processed after adjusting such charges.",
    ),
    term(
      "Force Majeure",
      "Mahi Solar Solution Private Limited shall not be held responsible for delays or failure in project execution due to events beyond its reasonable control, including but not limited to natural disasters, heavy rainfall, floods, earthquakes, fire, strikes, government restrictions, war, pandemic, or any other force majeure event.",
    ),
    term(
      "Ownership of Materials",
      "All supplied materials and equipment shall remain the property of Mahi Solar Solution Private Limited until the full project payment has been received. The Company reserves the right to recover the supplied materials in case of non-payment or breach of the agreed payment terms.",
    ),
    term(
      "Roof Condition & Water Leakage",
      "The customer is responsible for ensuring that the rooftop is structurally sound and free from any existing water leakage or damage before installation. Mahi Solar Solution Private Limited shall not be liable for pre-existing roof defects. However, any damage directly caused by our installation work will be repaired by the Company.",
    ),
    term(
      "Payment Delay",
      "If the customer fails to make payments as per the agreed schedule, Mahi Solar Solution Private Limited reserves the right to suspend material dispatch, installation work, net metering documentation, or project completion until all outstanding payments are cleared.",
    ),
    term(
      "Final Payment & Price Finality",
      "No discount or revision of the agreed price will be accepted after completion of the work or at the time of final payment.",
    ),
    term(
      "Delayed Payment & Legal Recovery",
      "If payment is not received within 21 days of project completion, Mahi Solar Solution Private Limited reserves the right to initiate legal recovery proceedings as permitted under applicable law.",
    ),
  ];

  const withoutSubsidy = includeSubsidy
    ? terms
    : terms
        .filter((item) => !isSubsidyTerm(item) && (variant !== "offgrid" || !isNetMeteringTerm(item)))
        .map((item) => (isTimelineTerm(item) ? { ...item, text: stripSubsidyFromTimeline(item.text) } : item));

  if (variant === "offgrid") {
    return withoutSubsidy.map((item) => {
      if (isPaymentTerm(item)) {
        return { ...item, text: offgridPaymentTermsText(language) };
      }
      if (isTimelineTerm(item)) {
        return { ...item, text: offgridTimelineText(language) };
      }
      if (isAdditionalWorkTerm(item)) {
        return { ...item, text: offgridAdditionalWorkText(language) };
      }
      if (isPaymentDelayTerm(item)) {
        return { ...item, text: offgridPaymentDelayText(language) };
      }
      if (isWarrantyCoverageTerm(item)) {
        return { ...item, text: patchOffgridWarrantyText(item.text) };
      }
      return item;
    });
  }

  if (variant !== "commercial") {
    return withoutSubsidy;
  }

  return withoutSubsidy.map((item) => {
    if (isValidityTerm(item)) {
      return { ...item, text: commercialValidityText(language) };
    }
    if (isTimelineTerm(item)) {
      return { ...item, text: commercialTimelineText(language) };
    }
    return item;
  });
}

function defaultSubsidyDocuments(language: QuotationLanguage): string[] {
  if (language === "hi") {
    return [
      "आधार कार्ड",
      "बिजली बिल",
      "फोटो",
      "कैंसल्ड चेक / बैंक पासबुक",
      "पैन कार्ड",
      "मोबाइल नंबर",
      "जीमेल ID",
      "लोकेशन",
      "GPS मैप कैमरा सहित साइट फोटो",
      "छत का माप (वर्ग फीट)",
      "संपत्ति दस्तावेज़",
    ];
  }
  return [
    "Aadhar Card",
    "Electricity Bill",
    "Photo",
    "Cancelled Cheque / Bank Passbook",
    "PAN Card",
    "Mobile Number",
    "Gmail ID",
    "Location",
    "Site photo with GPS map camera",
    "Rooftop measurement in sq. feet",
    "Property document",
  ];
}

function defaultInstallationSteps(language: QuotationLanguage, offgrid = false): string[] {
  const steps =
    language === "hi"
      ? [
          "साइट सर्वे",
          "सिस्टम डिज़ाइन",
          "दस्तावेज़ीकरण",
          "सामग्री डिस्पैच",
          "इंस्टॉलेशन",
          "परीक्षण व कमीशनिंग",
          "नेट मीटरिंग व सक्रियण",
          "हैंडओवर",
        ]
      : [
          "Site Survey",
          "System Design",
          "Documentation",
          "Material Dispatch",
          "Installation",
          "Testing & Commissioning",
          "Net Metering & Activation",
          "Handover",
        ];

  if (!offgrid) {
    return steps;
  }

  return steps.map((step) => {
    if (step === "Net Metering & Activation") return "Battery Commissioning";
    if (step === "नेट मीटरिंग व सक्रियण") return "बैटरी कमीशनिंग";
    return step;
  });
}

export function createDefaultQuotationData(
  language: QuotationLanguage = "en",
  options?: { includeSubsidy?: boolean; commercial?: boolean; offgrid?: boolean },
): QuotationData {
  const isHindi = language === "hi";
  const offgrid = options?.offgrid === true;
  const commercial = !offgrid && options?.commercial === true;
  const includeSubsidy = commercial || offgrid ? false : options?.includeSubsidy !== false;
  const phase: QuotationPhase = commercial ? "3PH" : "1PH";
  const capacity = commercial ? "10 KW" : "3 KW";
  const termsVariant: "residential" | "commercial" | "offgrid" = offgrid
    ? "offgrid"
    : commercial
      ? "commercial"
      : "residential";
  const materialItems = offgrid
    ? applyOffgridCapacityToMaterials(defaultOffgridMaterialItems(language), capacity, phase, language)
    : commercial
      ? applyCommercialCapacityToMaterials(defaultCommercialMaterialItems(language, phase), capacity, phase, language)
      : defaultMaterialItems(language, phase);

  return {
    language: isHindi ? "hi" : "en",
    kind: offgrid ? "offgrid" : commercial ? "commercial" : "residential",
    title: isHindi ? "सोलर प्रस्ताव" : "SOLAR PROPOSAL",
    tagline: isHindi ? "स्मार्ट  |  टिकाऊ  |  किफायती" : "SMART  |  SUSTAINABLE  |  COST EFFECTIVE",
    coverImageUrl: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    capacity,
    phase,
    address: "Jaipur",
    proposalDate: today,
    sanctionLoad: "",
    shadowFreeArea: "",
    connectionType: commercial ? (isHindi ? "HT थ्री फेज" : "HT Three Phase") : "",
    roofType: commercial ? (isHindi ? "टिन शेड / RCC छत" : "Tin shed / RCC rooftop") : "",
    company: defaultCompany(),
    materialItems,
    installationWork: [],
    assumptions: defaultAssumptions(language),
    customerScope: defaultCustomerScope(language, { commercial, offgrid }),
    ourScope: commercial || offgrid ? defaultOurScope(language) : [],
    commercialOffer: defaultCommercialOffer(language, { commercial, offgrid, capacity }),
    warrantyText: "",
    showGeneration: !offgrid,
    generation: {
      unitRate: "8",
    },
    showWarrantyBadges: true,
    warrantySolarPanelYears: "30",
    warrantyInverterYears: offgrid ? "" : "10",
    warrantySetupBosYears: "5",
    showInstallationProcess: true,
    installationSteps: defaultInstallationSteps(language, offgrid),
    showWattageInfo: true,
    projectAmount: offgrid ? offgridProjectAmount(capacity) : includeSubsidy ? "190000" : "",
    centralSubsidy: includeSubsidy ? "78000" : "",
    stateSubsidy: includeSubsidy ? "17000" : "",
    effectivePayableAmount: includeSubsidy ? "95000" : "",
    subsidyNote: includeSubsidy
      ? isHindi
        ? "*MNRE सब्सिडी (₹78,000) नेट मीटरिंग के ~60 दिन बाद ग्राहक खाते में ट्रांसफर होती है। राज्य सब्सिडी (₹17,000) वहाँ लागू जहाँ वर्तमान में 100 यूनिट मुफ्त लाभ उपलब्ध है।"
        : "*MNRE subsidy (₹78,000) is transferred to the customer account ~60 days after net metering. State subsidy (₹17,000) applies where 100 units free benefit is currently available."
      : "",
    showSubsidySection: includeSubsidy,
    showEmiSection: includeSubsidy,
    emiInfo: {
      uptoLoanAmount: "₹2,00,000",
      interestRate: isHindi ? "~6% प्रति वर्ष" : "~6% per annum",
      tenure5YearEmi: "₹3,865/month",
      tenure7YearEmi: "₹2,790/month",
      tenure10YearEmi: "₹1,983/month",
    },
    showComponentWarranty: true,
    maintenanceFrequency: isHindi ? "त्रैमासिक" : "Quarterly",
    maintenanceAfterYears: isHindi
      ? "प्रतिस्पर्धी दरों पर उपलब्ध"
      : "Available at competitive rates",
    netMeteringNote: offgrid
      ? ""
      : isHindi
        ? "नेट मीटरिंग अवधि 25–30 दिनों में कवर होगी।"
        : "Net metering period will be covered in 25–30 days.",
    loadExtensionNote: offgrid
      ? ""
      : isHindi
        ? "लोड एक्सटेंशन लागत JVVNL शर्तों के अनुसार अतिरिक्त होगी, और लोड बढ़ने पर नेट मीटरिंग अवधि शुरू होगी।"
        : "Load extension cost would be extra as per JVVNL terms, and the net metering period will start when the load is increased.",
    onGridNote: offgrid ? defaultOffGridNote(language) : commercial ? defaultOnGridNote(language) : "",
    discomChargesNote: commercial ? defaultDiscomChargesNote(language) : "",
    terms: defaultTerms(language, includeSubsidy, termsVariant),
    subsidyDocuments: includeSubsidy ? defaultSubsidyDocuments(language) : [],
    bankAccountName: "MAHI SOLAR SOLUTION PRIVATE LIMITED",
    bankName: "AU Small Finance Bank",
    bankAccountNo: "7740889928413501",
    bankIfsc: "AUBL0002206",
    bankGst: "08AAUCM4104G1ZD",
    repName: "MAHENDRA KUMAWAT",
    repTitle: "Director",
    repCompany: "MAHI SOLAR SOLUTION PRIVATE LIMITED",
    repMobiles: "9928413501",
    showLetterhead: true,
    showPageNumbers: true,
  };
}

/**
 * Replace template text with the chosen language defaults while preserving
 * customer details, amounts, company/bank/rep fields, and show* flags.
 */
export function switchQuotationLanguage(data: QuotationData, language: QuotationLanguage): QuotationData {
  const offgrid = isOffgridQuotation(data);
  const commercial = isCommercialQuotation(data);
  const previous = createDefaultQuotationData(data.language, { includeSubsidy: !commercial && !offgrid, commercial, offgrid });
  const fresh = createDefaultQuotationData(language, { includeSubsidy: !commercial && !offgrid, commercial, offgrid });

  return {
    ...fresh,
    kind: offgrid ? "offgrid" : commercial ? "commercial" : "residential",
    coverImageUrl: data.coverImageUrl,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail,
    capacity: stripPhaseFromCapacity(data.capacity) || fresh.capacity,
    phase: data.phase,
    address: data.address,
    proposalDate: data.proposalDate,
    sanctionLoad: data.sanctionLoad,
    shadowFreeArea: data.shadowFreeArea,
    connectionType: data.connectionType === previous.connectionType ? fresh.connectionType : data.connectionType,
    roofType: data.roofType === previous.roofType ? fresh.roofType : data.roofType,
    company: { ...fresh.company, ...data.company },
    materialItems: offgrid
      ? applyOffgridCapacityToMaterials(fresh.materialItems, data.capacity, data.phase, language)
      : commercial
        ? applyCommercialCapacityToMaterials(fresh.materialItems, data.capacity, data.phase, language)
        : applyPhaseToMaterialItems(fresh.materialItems, data.phase, language),
    commercialOffer: offgrid
      ? stripSyncedCommercialRows(syncOffgridOfferToCapacity(fresh.commercialOffer, data.capacity, language))
      : stripSyncedCommercialRows(fresh.commercialOffer),
    showGeneration: offgrid ? false : data.showGeneration,
    generation: {
      unitRate: data.generation.unitRate || fresh.generation.unitRate,
    },
    showWarrantyBadges: data.showWarrantyBadges,
    warrantySolarPanelYears: offgrid ? fresh.warrantySolarPanelYears : data.warrantySolarPanelYears,
    warrantyInverterYears: offgrid ? fresh.warrantyInverterYears : data.warrantyInverterYears,
    warrantySetupBosYears: offgrid ? fresh.warrantySetupBosYears : data.warrantySetupBosYears,
    showInstallationProcess: data.showInstallationProcess,
    showWattageInfo: data.showWattageInfo,
    projectAmount: data.projectAmount,
    centralSubsidy: data.centralSubsidy,
    stateSubsidy: data.stateSubsidy,
    effectivePayableAmount: data.effectivePayableAmount,
    subsidyNote: data.showSubsidySection === false ? data.subsidyNote : fresh.subsidyNote,
    showSubsidySection: offgrid || commercial ? false : data.showSubsidySection !== false,
    showEmiSection: offgrid || commercial ? data.showEmiSection : data.showEmiSection,
    emiInfo: {
      uptoLoanAmount: data.emiInfo.uptoLoanAmount || fresh.emiInfo.uptoLoanAmount,
      interestRate: fresh.emiInfo.interestRate,
      tenure5YearEmi: data.emiInfo.tenure5YearEmi || fresh.emiInfo.tenure5YearEmi,
      tenure7YearEmi: data.emiInfo.tenure7YearEmi || fresh.emiInfo.tenure7YearEmi,
      tenure10YearEmi: data.emiInfo.tenure10YearEmi || fresh.emiInfo.tenure10YearEmi,
    },
    showComponentWarranty: data.showComponentWarranty,
    bankAccountName: data.bankAccountName,
    bankName: data.bankName,
    bankAccountNo: data.bankAccountNo,
    bankIfsc: data.bankIfsc,
    bankGst: data.bankGst,
    repName: data.repName,
    repTitle: data.repTitle,
    repCompany: data.repCompany,
    repMobiles: data.repMobiles,
    showLetterhead: data.showLetterhead,
    showPageNumbers: data.showPageNumbers,
  };
}

export function normalizeQuotationData(input?: Partial<QuotationData> | null): QuotationData {
  const language: QuotationLanguage = input?.language === "hi" ? "hi" : "en";
  const offgrid = input?.kind === "offgrid";
  const commercial = !offgrid && isCommercialQuotation(input ?? {});
  const defaults = createDefaultQuotationData(language, { includeSubsidy: !commercial && !offgrid, commercial, offgrid });
  const phase: QuotationPhase = input?.phase === "3PH" ? "3PH" : "1PH";
  return {
    ...defaults,
    ...input,
    language,
    phase,
    capacity: stripPhaseFromCapacity(input?.capacity ?? defaults.capacity) || defaults.capacity,
    customerEmail: input?.customerEmail ?? defaults.customerEmail,
    sanctionLoad: input?.sanctionLoad ?? defaults.sanctionLoad,
    shadowFreeArea: input?.shadowFreeArea ?? defaults.shadowFreeArea,
    connectionType: input?.connectionType ?? defaults.connectionType,
    roofType: input?.roofType ?? defaults.roofType,
    company: { ...defaults.company, ...input?.company },
    generation: {
      unitRate: input?.generation?.unitRate ?? defaults.generation.unitRate,
    },
    emiInfo: { ...defaults.emiInfo, ...input?.emiInfo },
    materialItems: input?.materialItems ?? defaults.materialItems,
    installationWork: input?.installationWork ?? defaults.installationWork,
    assumptions: input?.assumptions ?? defaults.assumptions,
    customerScope: input?.customerScope ?? defaults.customerScope,
    ourScope: input?.ourScope ?? defaults.ourScope,
    commercialOffer: stripSyncedCommercialRows(input?.commercialOffer ?? defaults.commercialOffer),
    onGridNote: input?.onGridNote ?? defaults.onGridNote,
    discomChargesNote: input?.discomChargesNote ?? defaults.discomChargesNote,
    terms: input?.terms ?? defaults.terms,
    subsidyDocuments: input?.subsidyDocuments ?? defaults.subsidyDocuments,
    installationSteps: input?.installationSteps ?? defaults.installationSteps,
    kind: offgrid ? "offgrid" : isCommercialQuotation({ ...defaults, ...input }) ? "commercial" : "residential",
    showSubsidySection: offgrid || commercial ? false : (input?.showSubsidySection ?? defaults.showSubsidySection),
    showGeneration: offgrid ? false : (input?.showGeneration ?? defaults.showGeneration),
  };
}
