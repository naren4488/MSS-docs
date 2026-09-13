import { MSS_LOGO_URL } from "@/features/company-profile/lib/company-profile-defaults";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import type {
  HandoverCheckItem,
  HandoverData,
  HandoverEquipmentItem,
  HandoverKind,
  HandoverTerm,
} from "../types/handover";

function uuid() {
  return crypto.randomUUID();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function company(): AgreementCompany {
  return {
    name: "Mahi Solar Solution Private Limited",
    logoUrl: MSS_LOGO_URL,
    address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
    phone: "+91 9928413501",
    email: "mahisolarsolution@gmail.com",
    website: "mahisolarsolution.com",
    cin: "",
    gst: "08AAUCM4104G1ZD",
    representativeName: "Mahendra Kumawat",
    representativeTitle: "Director",
  };
}

function equipment(description: string, specification: string, qty: string, remarks = ""): HandoverEquipmentItem {
  return { id: uuid(), description, specification, qty, remarks };
}

function doc(label: string, handed = true): HandoverCheckItem {
  return { id: uuid(), label, handed };
}

function term(title: string, text: string): HandoverTerm {
  return { id: uuid(), title, text };
}

const SHARED_TERMS: Array<[string, string]> = [
  [
    "What this document is",
    "This handover records the plant as installed, tested and commissioned. It is not a new quotation and does not change the agreed price or scope.",
  ],
  [
    "Ownership",
    "Materials and equipment remain the property of Mahi Solar Solution Private Limited until the full project amount is received. After that, title passes to the customer.",
  ],
  [
    "Manufacturer warranty",
    "Modules, inverter and batteries (where fitted) are covered only under the respective manufacturer's warranty and on their terms. We will help register a valid claim. Replacement timing follows the manufacturer, not a same-day promise.",
  ],
  [
    "Our workmanship",
    "Mounting, wiring and installation carried out by us carry a 5-year workmanship cover from the commissioning date, for defects in that installation only.",
  ],
  [
    "What warranty does not cover",
    "Dust, shade, overload, a flat battery, a tripped breaker, theft, misuse, unauthorised modification, or damage from storm, fire, flood or lightning is not a manufacturing or workmanship defect.",
  ],
  [
    "Generation",
    "Any unit figures discussed at quotation are estimates. Actual generation depends on sun, season, dust, shade and how the plant is used. This document does not guarantee a monthly unit count.",
  ],
  [
    "After today",
    "Site security, cleaning and day-to-day use are the customer's responsibility. Please tell us within 7 days if anything on site does not match this sheet. Extra cable, civil work or a visit for a customer-side fault is chargeable.",
  ],
];

function ongridEquipment(): HandoverEquipmentItem[] {
  return [
    equipment("Solar PV modules", "As installed — wattage and brand on the module label", "As installed", "Serials on the module backsheet"),
    equipment("On-grid inverter", "As installed — kW on the nameplate", "1", "Serial on the inverter nameplate"),
    equipment("Mounting structure", "Hot-dip GI, designed for the roof and wind load", "As per roof", ""),
    equipment("AC / DC cables", "As per the approved run", "As installed", "Extra length, if any, is charged separately"),
    equipment("ACDB / DCDB and protection", "Included with the plant", "1 set", "Do not bypass"),
    equipment("Earthing and lightning arrestor", "Included with the plant", "As installed", ""),
  ];
}

function offgridEquipment(): HandoverEquipmentItem[] {
  return [
    equipment("Solar PV modules", "Waaree Topcon Bifacial, 590 Wp, 30-year warranty", "6 Panel", "3.54 kW array"),
    equipment("Off-grid inverter", "3 kW MICROTEK Off-Grid PCU (48V)", "1", "Warranty as per MICROTEK"),
    equipment("Mounting structure", "GI Apollo — leg 75×75, rafter 60×40, purlin 40×40", "As per roof", "Hot-dip GI"),
    equipment("Battery bank", "12V 220 Ah non-lithium tubular", "5 Nos", "Warranty as per MICROTEK"),
    equipment("DC cable and connection kit", "Polycab 4 sq mm copper, MC4 connectors", "As installed", ""),
  ];
}

function ongridDocuments(): HandoverCheckItem[] {
  return [
    doc("Tax invoice"),
    doc("This handover document"),
    doc("Module warranty card / datasheet"),
    doc("Inverter warranty card"),
    doc("Copy of the net-metering file, if already submitted"),
    doc("Demonstration of the inverter display and ACDB"),
  ];
}

function offgridDocuments(): HandoverCheckItem[] {
  return [
    doc("Tax invoice"),
    doc("This handover document"),
    doc("Module warranty card / datasheet"),
    doc("MICROTEK inverter warranty card"),
    doc("Battery warranty card"),
    doc("Demonstration of the inverter display, charging and overload alarm"),
  ];
}

function ongridChecks(): string[] {
  return [
    "Array mounted, aligned and tightened on the agreed roof area.",
    "Inverter powered up and showing a normal status.",
    "ACDB and DCDB labelled. Customer shown which breaker is for the solar plant.",
    "Customer shown the inverter display, and what a fault or no-generation indication looks like.",
    "Net-metering process explained, including that the first bill credit follows the DISCOM cycle.",
  ];
}

function offgridChecks(): string[] {
  return [
    "Array mounted, aligned and tightened on the agreed roof area.",
    "Inverter powered up, charging from the array, and feeding the connected load.",
    "Battery bank connected, terminals tight, and placed in a dry ventilated space.",
    "Customer shown the display, the overload alarm, and why a heavy night load will shut the plant down.",
    "Customer shown that daytime is for heavy appliances, and night backup is for lights, fans and a light load.",
  ];
}

function ongridCare(): string[] {
  return [
    "Clean the modules with plain water and a soft cloth every 10–15 days in the dusty months. Do not use detergent, a hard brush or a pressure washer on the glass.",
    "Do not walk on the modules, or place a water tank, dish antenna, scaffolding or drying clothes on the array. New shade will cut generation even if the inverter looks healthy.",
    "Keep the inverter ventilated. Do not cover the vents or store material against it.",
    "Do not switch the solar inverter off at the ACDB unless we ask you to, or there is a fault. A plant that stays off does not generate.",
    "Do not let another electrician bypass the ACDB, change the meter wiring, or open the inverter. Call us first.",
    "A dusty array, a tripped breaker or a cloudy week is an operating condition, not a defect. Call us if the display shows a fault you cannot clear by checking the breaker.",
    "Net-metering credit follows the DISCOM bill. A delay in the first credit is not a plant fault.",
    "Keep the invoice, this handover and the warranty cards together. A claim without them is delayed.",
  ];
}

function offgridCare(): string[] {
  return [
    "Clean the modules with plain water and a soft cloth every 10–15 days in the dusty months. Do not use detergent, a hard brush or a pressure washer on the glass.",
    "Do not walk on the modules, or place a tank, dish or clothes on the array. New shade will cut charging even if the inverter display looks normal.",
    "Keep the battery bank indoors, dry and ventilated. Do not shut it in a sealed cupboard, and do not leave it in rain or direct sun.",
    "Do not run the bank flat every night. Motors, irons, geysers and air-conditioners should run in the day while the sun is up. Night use is for lights, fans and a small load.",
    "Check battery water as printed on the manufacturer card. Top up with distilled water only. Never add acid, and never mix old and new batteries.",
    "Keep terminals clean and tight. A loose or corroded lug is a common reason the inverter stops charging.",
    "If the inverter beeps or shuts down, reduce the load before treating it as a fault. Repeated overload is not a manufacturing defect.",
    "Do not open the inverter cover, add extra batteries, or let another electrician rewire the bank without calling us. That can void the workmanship cover.",
    "Keep the invoice, this handover and the warranty cards together. A claim without them is delayed.",
  ];
}

export function isHandoverKind(value: string | null | undefined): value is HandoverKind {
  return value === "ongrid" || value === "offgrid";
}

export function createHandoverData(kind: HandoverKind = "ongrid"): HandoverData {
  const firm = company();
  const offgrid = kind === "offgrid";
  const date = today();

  return {
    kind,
    handoverNo: "",
    handoverDate: date,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    consumerNumber: "",
    discom: offgrid ? "" : "JVVNL",
    capacity: offgrid ? "3.54 KW" : "3 KW",
    plantTypeLabel: offgrid ? "Off-grid (standalone)" : "Grid-connected rooftop",
    phase: offgrid ? "" : "Single phase",
    invoiceNo: "",
    installationDate: date,
    commissioningDate: date,
    netMeteringNote: offgrid
      ? ""
      : "Net-metering is a DISCOM process. Credit, once approved, follows the DISCOM billing cycle and is not controlled by us.",
    moduleSummary: offgrid ? "6 × Waaree 590 Wp Topcon Bifacial" : "",
    inverterSummary: offgrid ? "3 kW MICROTEK Off-Grid PCU (48V)" : "",
    batterySummary: offgrid ? "5 × 12V 220 Ah non-lithium tubular" : "",
    greeting: "Dear Sir / Madam,",
    note: offgrid
      ? "Thank you for trusting Mahi Solar Solution with your solar plant. The off-grid system described in this document has been installed, tested and commissioned at your site, and is handed over to you in working condition.\n\nThis plant charges its battery bank from the modules and supplies your connected load. It does not export to the DISCOM grid, and it is not a net-metering plant. Please keep this sheet with your tax invoice and the manufacturer warranty cards. If anything on site does not match this sheet, tell us within seven days of the handover date."
      : "Thank you for trusting Mahi Solar Solution with your solar plant. The grid-connected system described in this document has been installed, tested and commissioned at your site, and is handed over to you in working condition.\n\nPlease keep this sheet with your tax invoice and the manufacturer warranty cards. It is the record of what was installed, what was explained to you, and the care the plant needs so it keeps generating. If anything on site does not match this sheet, tell us within seven days of the handover date.",
    equipment: offgrid ? offgridEquipment() : ongridEquipment(),
    documents: offgrid ? offgridDocuments() : ongridDocuments(),
    commissioningChecks: offgrid ? offgridChecks() : ongridChecks(),
    careNotes: offgrid ? offgridCare() : ongridCare(),
    terms: SHARED_TERMS.map(([title, text]) => term(title, text)),
    acknowledgement:
      "I confirm that the plant described in this document has been installed at my premises, demonstrated to me, and handed over in working condition. I have received this document and the papers marked as handed over. I understand that cleaning, correct use and day-to-day care of the plant are my responsibility, and that overload, a flat battery, dust or shade is not a defect.",
    closingNote:
      "We remain available for a genuine fault in our installation. For the plant to keep working properly, the care notes above are part of this handover — not an optional remark.",
    company: firm,
    repName: firm.representativeName,
    repTitle: firm.representativeTitle,
    repCompany: firm.name,
    repMobiles: firm.phone,
    showLetterhead: true,
    showPageNumbers: true,
  };
}

/** Keep the client and dates, replace plant content when the kind changes. */
export function applyHandoverKind(data: HandoverData, kind: HandoverKind): HandoverData {
  const fresh = createHandoverData(kind);
  return {
    ...fresh,
    handoverNo: data.handoverNo,
    handoverDate: data.handoverDate,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail,
    address: data.address,
    invoiceNo: data.invoiceNo,
    installationDate: data.installationDate,
    commissioningDate: data.commissioningDate,
    company: data.company,
    repName: data.repName,
    repTitle: data.repTitle,
    repCompany: data.repCompany,
    repMobiles: data.repMobiles,
    showLetterhead: data.showLetterhead,
    showPageNumbers: data.showPageNumbers,
  };
}
