import type { QuotationLanguage } from "../types/quotation";

export const QUOTATION_LABELS: Record<
  QuotationLanguage,
  {
    pageOf: (current: number, total: number) => string;
    gst: string;
    jvvnlGovRegisteredVendor: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    capacity: string;
    sanctionLoad: string;
    shadowFreeArea: string;
    connectionType: string;
    roofType: string;
    address: string;
    proposalDate: string;
    sno: string;
    description: string;
    qty: string;
    unit: string;
    specification: string;
    sr: string;
    parameter: string;
    offering: string;
    totalSystemWattage: string;
    panelsTimes: (panels: number, wp: number, watt: string, kw: string) => string;
    genPerDay: string;
    genPerMonth: string;
    genPerYear: string;
    savingPerYear: string;
    genPeriod: string;
    genYear1: string;
    genYears2to5: string;
    genAssumptionsNote: string;
    bankName: string;
    bank: string;
    accountNo: string;
    ifsc: string;
    gstNo: string;
    representedBy: string;
    mobNo: string;
    upTo: string;
    years: string;
    solarPanelWarranty: string;
    inverterWarranty: string;
    setupBosWarranty: string;
    batteryWarranty: string;
    asPerMicrotekWarranty: string;
    microtekBrand: string;
    asPerCompanyWarranty: string;
    emiGovSupport: string;
    emiZeroDown: string;
    emiInterest: string;
    emiExamples: string;
    tenure5: string;
    tenure7: string;
    tenure10: string;
    emiDisclaimer: string;
    component: string;
    warrantyPeriod: string;
    yearsN: (n: number) => string;
    solarPanelsProduct: string;
    solarPanelsPerformance: string;
    inverter: string;
    mountingStructure: string;
    bos: string;
    installationService: string;
    includedHeader: string;
    excludedHeader: string;
    includedItems: string[];
    excludedItems: string[];
    afterFreePeriod: string;
    afterFreePeriodBody: string;
    freeMaintenanceTitle: (frequency: string) => string;
    maintenanceIncluded: string;
    maintenanceNotIncluded: string;
    maintenanceIncludedItems: string[];
    maintenanceExcludedItems: string[];
    afterYear5: string;
    effectiveInvestment: string;
    projectAmount: string;
    lessSubsidy: string;
    effectivePayable: string;
    step: (n: number) => string;
    materialDescription: string;
    installationWork: string;
    assumptions: string;
    customerScope: string;
    scopeOfWork: string;
    onGridTitle: string;
    offGridTitle: string;
    priceSchedule: string;
    priceIncluded: string;
    priceIncludedItems: string[];
    offgridPriceIncludedItems: string[];
    discomCharges: string;
    commercialOffer: string;
    customerNetPayable: string;
    emiFinancing: string;
    componentWarranty: string;
    whatsCovered: string;
    manufacturingWarranty: string;
    warrantyCoverage: string;
    solarGeneration: string;
    installationProcess: string;
    subsidyDocuments: string;
    bankDetails: string;
    termsConditions: string;
    includedCableNote: string;
    includedDcCableNote: string;
    clientSignature: string;
    authorizedSignatory: string;
    date: string;
    mob: string;
  }
> = {
  en: {
    pageOf: (current, total) => `Page ${current} of ${total}`,
    gst: "GST",
    jvvnlGovRegisteredVendor: "JVVNL & Government Registered Solar Vendor",
    customerName: "Name of the Customer",
    customerPhone: "Customer Phone",
    customerEmail: "Customer Email",
    capacity: "Capacity of Power Plant",
    sanctionLoad: "Sanction load",
    shadowFreeArea: "Shadow-free area",
    connectionType: "Connection type",
    roofType: "Type of roof",
    address: "Address",
    proposalDate: "Date of Proposal",
    sno: "S.No",
    description: "Description",
    qty: "Qty",
    unit: "Unit",
    specification: "Specification",
    sr: "Sr.",
    parameter: "Parameter",
    offering: "Offering",
    totalSystemWattage: "TOTAL SYSTEM WATTAGE",
    panelsTimes: (panels, wp, watt, kw) =>
      `${panels} Panels × ${wp} Wp = ${watt} Watt (${kw} KW)`,
    genPerDay: "Per Day Generation",
    genPerMonth: "Per Month Generation",
    genPerYear: "Per Year Generation",
    savingPerYear: "Saving Per Year",
    genPeriod: "Period",
    genYear1: "1st Year (4 units / kW / day)",
    genYears2to5: "2nd–5th Year (3.9 units / kW / day)",
    genAssumptionsNote:
      "* Generation is auto-calculated from panel watt × quantity (system kW). Year 1 assumes 4 units/kW/day; years 2–5 assume 3.9 units/kW/day. Savings use the unit rate entered in the editor.",
    bankName: "Name",
    bank: "Bank",
    accountNo: "A/c No.",
    ifsc: "IFSC Code",
    gstNo: "GST No.",
    representedBy: "Represented by:",
    mobNo: "Mob. No.",
    solarPanelWarranty: "SOLAR PANEL WARRANTY",
    inverterWarranty: "INVERTER WARRANTY",
    setupBosWarranty: "SETUP & BOS WARRANTY",
    batteryWarranty: "BATTERY WARRANTY",
    asPerMicrotekWarranty: "As per MICROTEK\ncompany warranty",
    microtekBrand: "MICROTEK",
    asPerCompanyWarranty: "As per company\nwarranty",
    upTo: "Up to",
    years: "Years",
    emiGovSupport: "Government Bank Support Available Under PM Surya Ghar Scheme:",
    emiZeroDown: "Loans available up to {amount} with Zero Down Payment",
    emiInterest: "Interest rate: {rate} (subject to bank approval)",
    emiExamples: "EMI Examples (Indicative for {amount} loan):",
    tenure5: "5-Year Tenure",
    tenure7: "7-Year Tenure",
    tenure10: "10-Year Tenure",
    emiDisclaimer:
      "*Rates are indicative and subject to bank approval. Actual EMI may vary based on credit score and bank policy. Contact us for loan documentation and bank details.",
    component: "Component",
    warrantyPeriod: "Warranty Period",
    yearsN: (n) => `${n} Years`,
    solarPanelsProduct: "Solar Panels (Product)",
    solarPanelsPerformance: "Solar Panels (Performance)",
    inverter: "Inverter",
    mountingStructure: "Mounting Structure",
    bos: "Balance of System (BOS)",
    installationService: "Installation & Service",
    includedHeader: "✓ WHAT'S INCLUDED",
    excludedHeader: "✗ WHAT'S NOT INCLUDED",
    includedItems: [
      "Material & manufacturing defects",
      "Inverter malfunction",
      "Structure integrity issues",
      "Free maintenance checks (5 years)",
      "Generation performance monitoring",
    ],
    excludedItems: [
      "Panel cleaning (customer responsibility)",
      "External damage (accidents, vandalism)",
      "Natural disasters",
      "Unauthorized modifications",
      "Negligence or misuse",
    ],
    afterFreePeriod: "After 5-Year Free Period:",
    afterFreePeriodBody:
      "Optional maintenance packages available at competitive rates | Annual service check-ups recommended | Emergency repairs on paid call-out basis",
    freeMaintenanceTitle: (frequency) => `5 YEARS FREE MAINTENANCE CHECKS (${frequency} inspections)`,
    maintenanceIncluded: "✓ Included:",
    maintenanceNotIncluded: "✗ Not Included:",
    maintenanceIncludedItems: [
      "Structure inspection",
      "Electrical safety verification",
      "Generation performance analysis",
      "System monitoring & diagnostics",
      "Minor adjustments if needed",
    ],
    maintenanceExcludedItems: [
      "Panel cleaning (customer to clean monthly)",
      "Part replacements",
      "External damage repairs",
    ],
    afterYear5: "After Year 5:",
    effectiveInvestment: "YOUR EFFECTIVE INVESTMENT AFTER SUBSIDY",
    projectAmount: "Project amount (incl. GST)",
    lessSubsidy: "Less total Govt. subsidy",
    effectivePayable: "Effective payable amount",
    step: (n) => `Step ${String(n).padStart(2, "0")}`,
    materialDescription: "Material Description",
    installationWork: "Installation Work",
    assumptions: "Assumptions",
    customerScope: "Customer Scope",
    scopeOfWork: "Scope of Work",
    onGridTitle: "Grid-connected plant",
    offGridTitle: "Off-grid plant",
    priceSchedule: "Turnkey EPC price",
    priceIncluded: "Included",
    priceIncludedItems: [
      "SPV modules, module mounting structure, inverter",
      "AC / DC cables, ACDB, rest of BOM (earthing, LA, meter, cable tray, walkway, MCS, accessories)",
      "Installation, testing, commissioning and freight",
    ],
    offgridPriceIncludedItems: [
      "Waaree Topcon Bifacial modules, GI Apollo structure, Microtek off-grid inverter",
      "DC cables, connection kit, 5 × 12V 220 Ah Luminous non-lithium tubular batteries",
      "Installation, testing, commissioning and freight",
    ],
    discomCharges: "DISCOM / statutory charges",
    commercialOffer: "Commercial Offer",
    customerNetPayable: "Customer Net Payable Amount",
    emiFinancing: "EMI & Financing Options",
    componentWarranty: "Component Warranty Breakdown",
    whatsCovered: "What's Covered in Your Warranty",
    manufacturingWarranty: "Manufacturing Defect Warranty",
    warrantyCoverage: "Warranty Coverage",
    solarGeneration: "Solar Power Generation",
    installationProcess: "Installation Process",
    subsidyDocuments: "Required Documents for Subsidy",
    bankDetails: "Bank Details",
    termsConditions: "Terms & Conditions",
    includedCableNote:
      "* AC cable, DC cable, and earthing wire are included up to the lengths mentioned above. Extra length will be charged extra.",
    includedDcCableNote:
      "* DC cable is included up to the length mentioned above. Extra length will be charged extra.",
    clientSignature: "Client Signature",
    authorizedSignatory: "Authorized Signatory",
    date: "Date",
    mob: "Mob.",
  },
  hi: {
    pageOf: (current, total) => `पृष्ठ ${current} / ${total}`,
    gst: "जीएसटी",
    jvvnlGovRegisteredVendor: "JVVNL व सरकार पंजीकृत सोलर विक्रेता",
    customerName: "ग्राहक का नाम",
    customerPhone: "ग्राहक फोन",
    customerEmail: "ग्राहक ईमेल",
    capacity: "पावर प्लांट क्षमता",
    sanctionLoad: "स्वीकृत लोड",
    shadowFreeArea: "छाया-मुक्त क्षेत्र",
    connectionType: "कनेक्शन प्रकार",
    roofType: "छत का प्रकार",
    address: "पता",
    proposalDate: "प्रस्ताव की तिथि",
    sno: "क्र.",
    description: "विवरण",
    qty: "मात्रा",
    unit: "इकाई",
    specification: "विशिष्टता",
    sr: "क्र.",
    parameter: "पैरामीटर",
    offering: "प्रस्ताव",
    totalSystemWattage: "कुल सिस्टम वॉटेज",
    panelsTimes: (panels, wp, watt, kw) =>
      `${panels} पैनल × ${wp} Wp = ${watt} वॉट (${kw} किलोवाट)`,
    genPerDay: "प्रति दिन उत्पादन",
    genPerMonth: "प्रति माह उत्पादन",
    genPerYear: "प्रति वर्ष उत्पादन",
    savingPerYear: "प्रति वर्ष बचत",
    genPeriod: "अवधि",
    genYear1: "प्रथम वर्ष (4 यूनिट / किलोवाट / दिन)",
    genYears2to5: "वर्ष 2–5 (3.9 यूनिट / किलोवाट / दिन)",
    genAssumptionsNote:
      "* उत्पादन पैनल वॉट × मात्रा (सिस्टम किलोवाट) से स्वतः गणना होता है। प्रथम वर्ष 4 यूनिट/किलोवाट/दिन; वर्ष 2–5 में 3.9 यूनिट/किलोवाट/दिन। बचत संपादक में दी गई यूनिट दर से।",
    bankName: "नाम",
    bank: "बैंक",
    accountNo: "खाता संख्या",
    ifsc: "IFSC कोड",
    gstNo: "जीएसटी नं.",
    representedBy: "प्रतिनिधित्व:",
    mobNo: "मोबाइल नं.",
    upTo: "तक",
    years: "वर्ष",
    solarPanelWarranty: "सोलर पैनल वारंटी",
    inverterWarranty: "इनवर्टर वारंटी",
    setupBosWarranty: "सेटअप व BOS वारंटी",
    batteryWarranty: "बैटरी वारंटी",
    asPerMicrotekWarranty: "MICROTEK कंपनी\nवारंटी के अनुसार",
    microtekBrand: "MICROTEK",
    asPerCompanyWarranty: "कंपनी वारंटी\nके अनुसार",
    emiGovSupport: "पीएम सूर्य घर योजना के अंतर्गत सरकारी बैंक सहायता उपलब्ध:",
    emiZeroDown: "{amount} तक ऋण · शून्य डाउन पेमेंट",
    emiInterest: "ब्याज दर: {rate} (बैंक स्वीकृति के अधीन)",
    emiExamples: "EMI उदाहरण ({amount} ऋण के लिए सांकेतिक):",
    tenure5: "5 वर्ष अवधि",
    tenure7: "7 वर्ष अवधि",
    tenure10: "10 वर्ष अवधि",
    emiDisclaimer:
      "*दरें सांकेतिक हैं और बैंक स्वीकृति के अधीन हैं। वास्तविक EMI क्रेडिट स्कोर व बैंक नीति के अनुसार बदल सकती है। ऋण दस्तावेज़ व बैंक विवरण के लिए हमसे संपर्क करें।",
    component: "घटक",
    warrantyPeriod: "वारंटी अवधि",
    yearsN: (n) => `${n} वर्ष`,
    solarPanelsProduct: "सोलर पैनल (उत्पाद)",
    solarPanelsPerformance: "सोलर पैनल (प्रदर्शन)",
    inverter: "इनवर्टर",
    mountingStructure: "माउंटिंग स्ट्रक्चर",
    bos: "बैलेंस ऑफ सिस्टम (BOS)",
    installationService: "इंस्टॉलेशन व सेवा",
    includedHeader: "✓ क्या शामिल है",
    excludedHeader: "✗ क्या शामिल नहीं है",
    includedItems: [
      "सामग्री व निर्माण दोष",
      "इनवर्टर खराबी",
      "स्ट्रक्चर अखंडता संबंधी समस्याएँ",
      "निःशुल्क मेंटेनेंस जाँच (5 वर्ष)",
      "उत्पादन प्रदर्शन मॉनिटरिंग",
    ],
    excludedItems: [
      "पैनल सफाई (ग्राहक की जिम्मेदारी)",
      "बाहरी क्षति (दुर्घटना, तोड़फोड़)",
      "प्राकृतिक आपदाएँ",
      "अनधिकृत संशोधन",
      "लापरवाही या दुरुपयोग",
    ],
    afterFreePeriod: "5 वर्ष निःशुल्क अवधि के बाद:",
    afterFreePeriodBody:
      "प्रतिस्पर्धी दरों पर वैकल्पिक मेंटेनेंस पैकेज | वार्षिक सर्विस जाँच अनुशंसित | आपातकालीन मरम्मत भुगतान आधार पर",
    freeMaintenanceTitle: (frequency) => `5 वर्ष निःशुल्क मेंटेनेंस जाँच (${frequency} निरीक्षण)`,
    maintenanceIncluded: "✓ शामिल:",
    maintenanceNotIncluded: "✗ शामिल नहीं:",
    maintenanceIncludedItems: [
      "स्ट्रक्चर निरीक्षण",
      "विद्युत सुरक्षा सत्यापन",
      "उत्पादन प्रदर्शन विश्लेषण",
      "सिस्टम मॉनिटरिंग व डायग्नोस्टिक्स",
      "आवश्यकतानुसार छोटे समायोजन",
    ],
    maintenanceExcludedItems: [
      "पैनल सफाई (ग्राहक मासिक सफाई करें)",
      "पार्ट्स रिप्लेसमेंट",
      "बाहरी क्षति की मरम्मत",
    ],
    afterYear5: "वर्ष 5 के बाद:",
    effectiveInvestment: "सब्सिडी के बाद आपका प्रभावी निवेश",
    projectAmount: "प्रोजेक्ट राशि (जीएसटी सहित)",
    lessSubsidy: "घटाएँ कुल सरकारी सब्सिडी",
    effectivePayable: "प्रभावी देय राशि",
    step: (n) => `चरण ${String(n).padStart(2, "0")}`,
    materialDescription: "सामग्री विवरण",
    installationWork: "इंस्टॉलेशन कार्य",
    assumptions: "मान्यताएँ",
    customerScope: "ग्राहक का दायरा",
    scopeOfWork: "कार्यक्षेत्र (MSS)",
    onGridTitle: "ग्रिड-कनेक्टेड प्लांट",
    offGridTitle: "ऑफ-ग्रिड प्लांट",
    priceSchedule: "टर्नकी EPC मूल्य",
    priceIncluded: "शामिल",
    priceIncludedItems: [
      "SPV मॉड्यूल, माउंटिंग स्ट्रक्चर, इनवर्टर",
      "AC / DC केबल, ACDB, शेष BOM (अर्थिंग, LA, मीटर, केबल ट्रे, वॉकवे, MCS, एक्सेसरीज़)",
      "इंस्टॉलेशन, परीक्षण, कमीशनिंग व भाड़ा",
    ],
    offgridPriceIncludedItems: [
      "Waaree Topcon Bifacial मॉड्यूल, GI अपोलो स्ट्रक्चर, Microtek ऑफ-ग्रिड इनवर्टर",
      "DC केबल, कनेक्शन किट, 5 × 12V 220 Ah Luminous नॉन-लिथियम ट्यूबुलर बैटरी",
      "इंस्टॉलेशन, परीक्षण, कमीशनिंग व भाड़ा",
    ],
    discomCharges: "DISCOM / वैधानिक शुल्क",
    commercialOffer: "वाणिज्यिक प्रस्ताव",
    customerNetPayable: "ग्राहक नेट देय राशि",
    emiFinancing: "EMI व वित्त विकल्प",
    componentWarranty: "घटक वारंटी विवरण",
    whatsCovered: "आपकी वारंटी में क्या कवर है",
    manufacturingWarranty: "निर्माण दोष वारंटी",
    warrantyCoverage: "वारंटी कवरेज",
    solarGeneration: "सोलर पावर उत्पादन",
    installationProcess: "इंस्टॉलेशन प्रक्रिया",
    subsidyDocuments: "सब्सिडी के लिए आवश्यक दस्तावेज़",
    bankDetails: "बैंक विवरण",
    termsConditions: "नियम व शर्तें",
    includedCableNote:
      "* AC केबल, DC केबल व अर्थिंग वायर उपरोक्त उल्लिखित लंबाई तक शामिल हैं। अतिरिक्त लंबाई पर अलग से शुल्क लगेगा।",
    includedDcCableNote:
      "* DC केबल उपरोक्त उल्लिखित लंबाई तक शामिल है। अतिरिक्त लंबाई पर अलग से शुल्क लगेगा।",
    clientSignature: "ग्राहक हस्ताक्षर",
    authorizedSignatory: "अधिकृत हस्ताक्षरकर्ता",
    date: "तिथि",
    mob: "मो.",
  },
};

export function quotationLabels(language: QuotationLanguage | undefined) {
  return QUOTATION_LABELS[language === "hi" ? "hi" : "en"];
}

/** Match solar panel / net-meter rows whether content is English or Hindi. */
export function isSolarPvModulesDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("solar pv modules") || description.includes("सोलर पीवी मॉड्यूल");
}

export function isSolarNetMeterDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("solar & net meter") || description.includes("सोलर व नेट मीटर");
}

export function isAcDbDcDbDescription(description: string) {
  const value = description.toLowerCase();
  return (
    value.includes("acdb / dcdb") ||
    value.includes("dcdb") ||
    description.includes("ACDB / DCDB") ||
    description.includes("डिस्ट्रीब्यूशन बॉक्स")
  );
}

export function isAcCableDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("ac cable") || description.includes("AC केबल");
}

export function isDcCableDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("dc cable") || description.includes("DC केबल");
}

export function isSolarInverterDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("inverter") || description.includes("इनवर्टर");
}

export function isMountingStructureDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("mounting structure") || description.includes("माउंटिंग स्ट्रक्चर");
}

export function isBatteryBankDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("battery bank") || description.includes("बैटरी बैंक");
}

export function isEarthingWireDescription(description: string) {
  const value = description.toLowerCase();
  return value.includes("earthing wire") || description.includes("अर्थिंग वायर");
}
