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
    material("Solar Inverter", "1", "1 Phase", "3.6 KW POLYCAB Inverter with 10 Year Warranty"),
    material("Mounting Structure (GI Apollo)", "As per Requirement", "", "Leg 75×75, Rafter 60×40, Purline 40×40"),
    material("AC Cable", "As per Requirement", "M", "2 Core 10 mm Aluminium Armoured Cable (1PH) / 4 Core 10 mm (3PH)"),
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
    commercial("5 Year Maintenance", "FREE"),
  ];
}

function term(label: string, text: string): QuotationTermItem {
  return { id: uuid(), label, text };
}

function defaultTerms(): QuotationTermItem[] {
  return [
    term(
      "Quotation Validity",
      "This quotation is valid for 15 days from the date of issue. Prices and specifications are subject to change after the validity period expires. A fresh quotation will be required for orders placed after this period.",
    ),
    term("Transit Insurance", "Up to delivery of material at site."),
    term(
      "Payment Terms & Project Phases",
      "Payment schedule depends on the financing method:\n\n• 100% CASH PAYMENT: 20% advance with order, 70% before material dispatch & installation, 10% after installation & commissioning.\n\n• 100% LOAN FINANCING: Installation work begins upon receipt of the first loan installment from the bank. Payment schedule follows bank loan disbursement process.\n\n• HYBRID (LOAN + CASH): The combined amount (first loan installment + customer's cash contribution) must be received before installation work begins. Only the second payment remains pending. Maximum cash contribution: 10% of total project cost.\n\nNote: In all cases, maximum upfront cash payment should not exceed 10% of the total project value.",
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
      "Material Safety & Responsibility",
      "Mahi Solar Solution is responsible for material safety during transit and up to delivery at the project site. After delivery at the site:\n• The client becomes responsible for the safety and security of all supplied materials.\n• Mahi Solar Solution is not liable for theft, damage, vandalism, or loss of materials at the site.\n• The client must store materials in a safe, secure location until installation.\n• Any damage to materials after delivery due to negligence or improper storage will result in additional charges for replacement.",
    ),
    term(
      "Panel Cleaning & Maintenance",
      "For optimal solar system performance, we recommend:\n• Regular cleaning of solar panels once every week or once every 15 days, depending on local dust/pollution levels.\n• Dust and dirt accumulation reduces generation efficiency by 15–25%, depending on dust density.\n• Panel cleaning should be done with soft cloth and distilled water; avoid harsh chemicals or abrasive materials.\n• The client is responsible for regular cleaning. Mahi Solar Solution can provide cleaning services on a paid basis.",
    ),
    term(
      "Electricity Generation & Seasonal Variation",
      "Annual energy generation is calculated as 4–4.5 kWh per kW of installed capacity per day on average across the year.\n\nSeasonal Variation:\n• SUMMER (March–May): Higher generation — typically 20–25% above annual average due to increased sunlight hours.\n• MONSOON (June–September): Lower generation — typically 30–40% below annual average due to cloud cover and rain.\n• WINTER (October–February): Moderate generation — typically 5–10% below annual average.\n\nNote: Annual generation is an average across all seasons. Monthly generation will vary based on weather conditions, cloud cover, and daylight hours. The above generation figures assume 4.5 hours of peak sun equivalent per day on average.",
    ),
    term(
      "Warranty Coverage & Limitations",
      "Warranty Coverage:\n• Panels: 30-year product warranty (manufacturing defects) + 25-year performance warranty\n• Inverter: 10-year manufacturer warranty\n• BOS & Installation: 5-year warranty\n\nWarranty WILL NOT Cover:\n• Damage due to natural disasters (floods, earthquakes, storms, lightning)\n• Theft or vandalism\n• Fire or electrical damage due to external causes\n• Damage due to improper maintenance or cleaning\n• Unauthorized modifications or repairs\n• Damage due to user negligence or misuse\n• Impact damage or structural damage to the roof\n\nWarranty claims are subject to the original equipment manufacturer's terms and conditions.",
    ),
    term(
      "Government Subsidy Dependency",
      "Government subsidy under PM Surya Ghar: Muft Bijli Yojana is subject to:\n• Latest government guidelines and scheme eligibility criteria\n• Approval by concerned government authorities (SECI, state nodal agency)\n• Timely submission of required documents and approvals from DISCOM\n• Beneficiary's eligibility status (residential property, income limits, etc.)\n\nSubsidy amount and approval timeline are beyond Mahi Solar Solution's control. Any delay in subsidy approval will not impact installation work. Subsidy disbursement timeline depends on government processing.",
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
    systemPhase: "1 Phase",
    phase: "1PH",
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
    warrantySolarPanelYears: "30",
    warrantyInverterYears: "10",
    warrantySetupBosYears: "5",
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
    showWattageInfo: true,
    projectAmount: "",
    centralSubsidy: "78000",
    stateSubsidy: "",
    effectivePayableAmount: "",
    subsidyNote: "*Subject to subsidy eligibility — state subsidy applies only where 100 units free benefit is currently available.",
    showEmiSection: true,
    emiInfo: {
      uptoLoanAmount: "₹2,00,000",
      interestRate: "~6% per annum",
      tenure5YearEmi: "₹3,865/month",
      tenure7YearEmi: "₹2,790/month",
      tenure10YearEmi: "₹1,983/month",
    },
    showComponentWarranty: true,
    maintenanceFrequency: "Quarterly",
    maintenanceAfterYears: "Available at competitive rates",
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
