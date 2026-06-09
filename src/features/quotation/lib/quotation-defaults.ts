import type { AgreementCompany } from "@/features/agreement/types/agreement";
import type {
  QuotationCommercialRow,
  QuotationData,
  QuotationMaterialItem,
  QuotationTermItem,
} from "../types/quotation";

function uuid() {
  return crypto.randomUUID();
}

const today = new Date().toISOString().slice(0, 10);

function defaultCompany(): AgreementCompany {
  return {
    name: "Mahi Solar Solution Private Limited",
    logoUrl: "/assets/mss-logo.png",
    address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
    phone: "+91 9928413501",
    email: "mahisolarsolution@gmail.com",
    website: "",
    cin: "",
    gst: "08AAUCM4104G1ZD",
    representativeName: "Mahendra Kumawat",
    representativeTitle: "Director",
  };
}

function material(description: string, qty: string, unit: string, make: string): QuotationMaterialItem {
  return { id: uuid(), description, qty, unit, make };
}

function defaultMaterialItems(): QuotationMaterialItem[] {
  return [
    material("Solar PV Modules", "6 Panel", "555 Wp", "Adani Bifacial / Silicon Technology with 30 Year Warranty"),
    material("Solar Inverter", "1", "1 Phase", "3 KW POLYCAB Inverter with 10 Year Warranty"),
    material("Mounting Structure (GI Apollo)", "2 mm", "Super Structure", "Leg 75×75, Rafter 60×40, Purline 40×40"),
    material("AC Cable", "As per Requirement", "M", "2 Core 10 mm Aluminium Armoured Cable, standard approved by JVVNL"),
    material("DC Cable", "As per Requirement", "M", "4 sq mm Copper Wire, Polycab cable"),
    material("Lightning Arrestor Kit", "1 No", "1 No", "1 M, Copper bound"),
    material("Earthing Kit", "3 Set", "Set", "Earthing single core copper, cement earthing with GI and chemical solution, 1 Mtr"),
    material("ACDB / DCDB / MCB Distribution Box", "1, 1 No", "32 Amp / 1000 V DC", "L&T, Schneider"),
    material("Solar & Net Meter LT-CT", "1, 1 No", "", "Genus or HPL as per availability, tested by JVVNL"),
    material("DC Wire Duct & Casing, Connecting Cable, MC-4 Connector", "15 M, 4 Set", "6/4 mm 1500 V DC", "Polycab Copper 4 mm"),
    material("Designed Installation & Commissioning", "", "As per site requirement", "Team Mahi Solar Solution"),
  ];
}

const defaultInstallationWork = [
  "Feeder / LT panel for connection to grid will be made available at site and shall be in the Client's scope.",
  "Net metering and approval of DISCOM.",
  "Warranty as per terms and conditions mentioned herein.",
];

const defaultAssumptions = [
  "Peak sunshine availability of 5 hours average as per the geographical site conditions.",
  "It is assumed that sufficient shadow-free area is available for installation of modules. In case of restriction due to already installed equipment, other roof (as available at site) may have to be used keeping minimum impact on generation.",
  "Load bearing capacity of the roof should be adequate to carry the load of the MMS system considering the wind load of the zone.",
  "Cable tray / trench shall not be in our scope of work.",
];

const defaultCustomerScope = [
  "Customer to provide space for storing of material.",
  "Making the site ready and cleaning the terrace / roof of any unwanted items is not included in scope of work. Necessary support will be extended to our installation team for taking material inside the premises and to the rooftop; the same has to be kept at a proper and secure place till completion of installation.",
  "Safety of material supplied would be in customer scope after delivery at site.",
  "Customer shall provide access to feed-in solar power to the LT panel located on the ground floor of the building; the feeder / LT panel for connection to grid will be made available at site and shall be in customer scope.",
  "Customer to provide LAN (internet facility) for cloud monitoring.",
  "Cleaning of modules is not in our scope; customer is requested to clean the panels once a week.",
  "Net metering file charges would be in the scope of customer.",
  "Civil foundation material will be provided by customer.",
];

function commercial(parameter: string, offering: string): QuotationCommercialRow {
  return { id: uuid(), parameter, offering };
}

function defaultCommercialOffer(): QuotationCommercialRow[] {
  return [
    commercial("Solar PV Plant Capacity", "3 KWp, On-grid SPV System"),
    commercial("Price Basis", "Turnkey EPC"),
    commercial("Project Price", "Rs. 63.33 / Watt — Net Payable Amount INR 1,90,000/- + GST & Net Metering Charges"),
    commercial("GST Head", "5% GST on 70% of the project & 18% GST on the rest"),
    commercial("Customer Net Payable Amount", "INR 1,90,000/- (Including Tax)"),
    commercial("1 Year Maintenance & Cleaning Service", "INR 8,000/- — FREE"),
  ];
}

function term(label: string, text: string): QuotationTermItem {
  return { id: uuid(), label, text };
}

function defaultTerms(): QuotationTermItem[] {
  return [
    term("Transit Insurance", "Up to delivery of material at site."),
    term("System Installation", "System will be installed by our certified team."),
    term(
      "Delivery",
      "Material dispatched in 3–4 days from the date of receipt of your technically and commercially valid purchase order, and installation will be completed within 2 weeks from the date of receipt of materials at site, provided the site is ready for installation in all respects.",
    ),
    term(
      "Warranty",
      "Plant designed for 25 years with linear efficiency. The plant will produce minimum power up to 90% of the rated capacity for 10 years and thereafter 80% of the rated capacity up to 25 years, with sun availability of 4.5 hours a day during sun radiation availability. We also provide 5 years warranty support; however, the warranty will be owned by the original equipment manufacturer of the solar panel and inverter.",
    ),
    term(
      "Payment Terms",
      "30% advance payment along with the purchase order, 60% at the time of receiving solar panels and inverter, and 10% at the time of complete installation.",
    ),
  ];
}

const defaultSubsidyDocuments = [
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

export function createDefaultQuotationData(): QuotationData {
  return {
    title: "SOLAR PROPOSAL",
    tagline: "SMART  |  SUSTAINABLE  |  COST EFFECTIVE",
    coverImageUrl: "",
    customerName: "",
    capacity: "3 KW 1PH",
    address: "Jaipur",
    proposalDate: today,
    company: defaultCompany(),
    materialItems: defaultMaterialItems(),
    installationWork: defaultInstallationWork,
    assumptions: defaultAssumptions,
    customerScope: defaultCustomerScope,
    commercialOffer: defaultCommercialOffer(),
    warrantyText:
      "12 year product manufacturing warranty. Power performance guarantee: power degradation < 2% in the first year and < 0.50% per year in years 2–27. BOS — 1 Year Warranty.",
    showGeneration: true,
    generation: {
      perDay: "12 Units / Day",
      perMonth: "360 Units / Month",
      perYear: "4320 Units / Year",
      savingPerYear: "₹ 34,560",
    },
    showWarrantyBadges: true,
    warrantyProductYears: "12",
    warrantyPerformanceYears: "25",
    showInstallationProcess: true,
    installationSteps: [
      "Site Survey",
      "System Design",
      "Documentation",
      "Material Dispatch",
      "Installation",
      "Testing & Commissioning",
      "Net Metering & Activation",
      "Handover",
    ],
    subsidyAmount: "78000",
    netMeteringNote: "Net metering period will be covered in 25–30 days.",
    loadExtensionNote:
      "Load extension cost would be extra as per JVVNL terms, and the net metering period will start when the load is increased.",
    terms: defaultTerms(),
    subsidyDocuments: defaultSubsidyDocuments,
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

export function normalizeQuotationData(input?: Partial<QuotationData> | null): QuotationData {
  const defaults = createDefaultQuotationData();
  return {
    ...defaults,
    ...input,
    company: { ...defaults.company, ...input?.company },
    generation: { ...defaults.generation, ...input?.generation },
    materialItems: input?.materialItems ?? defaults.materialItems,
    installationWork: input?.installationWork ?? defaults.installationWork,
    assumptions: input?.assumptions ?? defaults.assumptions,
    customerScope: input?.customerScope ?? defaults.customerScope,
    commercialOffer: input?.commercialOffer ?? defaults.commercialOffer,
    terms: input?.terms ?? defaults.terms,
    subsidyDocuments: input?.subsidyDocuments ?? defaults.subsidyDocuments,
    installationSteps: input?.installationSteps ?? defaults.installationSteps,
  };
}
