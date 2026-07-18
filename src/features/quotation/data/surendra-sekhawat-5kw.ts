import type { QuotationRecord } from "../types/quotation";

export const surendraSekhawat5kwQuotation: QuotationRecord = {
  id: "q-surendra-sekhawat-5kw-001",
  name: "Surendra Sekhawat - 5KW 3PH",
  createdAt: "2026-07-17T00:00:00Z",
  updatedAt: "2026-07-17T00:00:00Z",
  content: {
    title: "SOLAR PROPOSAL",
    tagline: "SMART  |  SUSTAINABLE  |  COST EFFECTIVE",
    coverImageUrl: "",
    customerName: "Surendra Sekhawat",
    capacity: "5 KW 3PH",
    systemPhase: "3 Phase",
    phase: "3PH",
    address: "Sekhawat Marg, Ravan Gate, Jaipur, 302012",
    proposalDate: "2026-07-17",
    company: {
      name: "Mahi Solar Solution Private Limited",
      logoUrl: "/assets/mss-logo.png",
      address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
      phone: "+91 9928413501",
      email: "mahisolarsolution@gmail.com",
      website: "mahisolarsolution.com",
      cin: "",
      gst: "08AAUCM4104G1ZD",
      representativeName: "Mahendra Kumawat",
      representativeTitle: "Director",
    },
    materialItems: [
      {
        id: "mat-001",
        description: "Solar PV Modules",
        qty: "9 Panel",
        unit: "550 Wp",
        make: "Adani Topcon Bifacial / Silicon Technology with 30 Year Warranty",
      },
      {
        id: "mat-002",
        description: "Solar Inverter",
        qty: "1",
        unit: "3 Phase",
        make: "5 KW POLYCAB Inverter with 10 Year Warranty",
      },
      {
        id: "mat-003",
        description: "Mounting Structure (GI Apollo)",
        qty: "As per Requirement",
        unit: "",
        make: "Leg 75×75, Rafter 60×40, Purline 40×40",
      },
      {
        id: "mat-004",
        description: "AC Cable",
        qty: "As per Requirement",
        unit: "M",
        make: "4 Core 16 mm Aluminium Armoured Cable (3PH)",
      },
      {
        id: "mat-005",
        description: "DC Cable",
        qty: "As per Requirement",
        unit: "M",
        make: "6 sq mm Copper Wire, Polycab cable",
      },
      {
        id: "mat-006",
        description: "Lightning Arrestor Kit",
        qty: "1 No",
        unit: "1 No",
        make: "1 M, Copper bound",
      },
      {
        id: "mat-007",
        description: "Earthing Kit",
        qty: "3 Set",
        unit: "Set",
        make: "Earthing single core copper, cement earthing with GI and chemical solution, 1 Mtr",
      },
      {
        id: "mat-008",
        description: "ACDB / DCDB / MCB Distribution Box",
        qty: "1, 1 No",
        unit: "63 Amp / 1000 V DC",
        make: "L&T, Schneider",
      },
      {
        id: "mat-009",
        description: "Solar & Net Meter LT-CT",
        qty: "1, 1 No",
        unit: "",
        make: "Genus or HPL as per availability, tested by JVVNL",
      },
      {
        id: "mat-010",
        description: "DC Wire Duct & Casing, Connecting Cable, MC-4 Connector",
        qty: "20 M, 5 Set",
        unit: "6/4 mm 1500 V DC",
        make: "Polycab Copper 6 mm",
      },
      {
        id: "mat-011",
        description: "Designed Installation & Commissioning",
        qty: "",
        unit: "As per site requirement",
        make: "Team Mahi Solar Solution",
      },
    ],
    installationWork: [
      "Feeder / LT panel for connection to grid will be made available at site and shall be in the Client's scope.",
      "Net metering and approval of DISCOM.",
      "Warranty as per terms and conditions mentioned herein.",
    ],
    assumptions: [
      "Peak sunshine availability of 5 hours average as per the geographical site conditions.",
      "It is assumed that sufficient shadow-free area is available for installation of modules. In case of restriction due to already installed equipment, other roof (as available at site) may have to be used keeping minimum impact on generation.",
      "Load bearing capacity of the roof should be adequate to carry the load of the MMS system considering the wind load of the zone.",
      "Cable tray / trench shall not be in our scope of work.",
    ],
    customerScope: [
      "Customer to provide space for storing of material.",
      "Making the site ready and cleaning the terrace / roof of any unwanted items is not included in scope of work. Necessary support will be extended to our installation team for taking material inside the premises and to the rooftop; the same has to be kept at a proper and secure place till completion of installation.",
      "Safety of material supplied would be in customer scope after delivery at site.",
      "Customer shall provide access to feed-in solar power to the LT panel located on the ground floor of the building; the feeder / LT panel for connection to grid will be made available at site and shall be in customer scope.",
      "Customer to provide LAN (internet facility) for cloud monitoring.",
      "Cleaning of modules is not in our scope; customer is requested to clean the panels once a week.",
      "Net metering file charges would be in the scope of customer.",
    ],
    commercialOffer: [
      {
        id: "comm-001",
        parameter: "Solar PV Plant Capacity",
        offering: "5 KWp, On-grid SPV System",
      },
      {
        id: "comm-002",
        parameter: "Panel Configuration",
        offering: "9 x 550W Adani Topcon Bifacial Panels (4.95 KW Total)",
      },
      {
        id: "comm-003",
        parameter: "Price Basis",
        offering: "Turnkey EPC",
      },
      {
        id: "comm-004",
        parameter: "Project Price",
        offering: "Rs. 57.48 / Watt — Net Payable Amount INR 2,85,000/-",
      },
      {
        id: "comm-005",
        parameter: "Customer Net Payable Amount",
        offering: "INR 2,85,000/- (Including Tax)",
      },

    ],
    warrantyText: "12 year product manufacturing warranty. Power performance guarantee: power degradation < 2% in the first year and < 0.50% per year in years 2–27. BOS — 1 Year Warranty.",
    showGeneration: true,
    generation: {
      perDay: "18 Units / Day",
      perMonth: "540 Units / Month",
      perYear: "6480 Units / Year",
      savingPerYear: "₹ 51,840",
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
    projectAmount: "285000",
    centralSubsidy: "78000",
    stateSubsidy: "17000",
    effectivePayableAmount: "190000",
    subsidyNote: "*State Government Subsidy (₹17,000) will be provided only where 100 units free benefit is currently available.",
    showEmiSection: true,
    emiInfo: {
      uptoLoanAmount: "₹2,90,000",
      interestRate: "~6% per annum",
      tenure5YearEmi: "₹6,282/month",
      tenure7YearEmi: "₹4,533/month",
      tenure10YearEmi: "₹3,228/month",
    },
    showComponentWarranty: true,
    maintenanceFrequency: "Quarterly",
    maintenanceAfterYears: "Available at competitive rates",
    netMeteringNote: "Net metering period will be covered in 25–30 days.",
    loadExtensionNote: "Load extension cost would be extra as per JVVNL terms, and the net metering period will start when the load is increased.",
    terms: [
      {
        id: "term-001",
        label: "Quotation Validity",
        text: "This quotation is valid for 15 days from the date of issue. Prices and specifications are subject to change after the validity period expires. A fresh quotation will be required for orders placed after this period.",
      },
      {
        id: "term-002",
        label: "Transit Insurance",
        text: "Up to delivery of material at site.",
      },
      {
        id: "term-003",
        label: "Payment Terms & Project Phases",
        text: `Payment schedule depends on the financing method:

100% CASH PAYMENT
• Advance: 20% with order confirmation
• 2nd Payment: 70% before material dispatch & installation begins
• Final Payment: 10% after net metering approval from DISCOM

100% LOAN FINANCING
• Installation work begins immediately upon receipt of first loan installment from bank
• Subsequent payments follow bank's loan disbursement schedule
• Installation completion not dependent on remaining loan tranches

HYBRID (LOAN + CASH MIX)
• 1st Installment (Before Installation Starts): Bank's 1st loan disbursement + Client's cash contribution
  Example: Total cost ₹2.5L | Loan ₹2L (1st disbursement ₹1.4L) + Client cash ₹50k = ₹1.9L received → Installation begins
• Subsequent Payments (After Net Metering Approval): Remaining bank disbursements + Client's deferred 10%
  Example: Bank 2nd disbursement ₹60k + Client deferred 10% (₹25k) = ₹85k
• Client's cash contribution = Amount of project not covered by loan (can defer max 10% until net metering)
• Installation proceeds immediately once 1st bank installment + client's cash contribution are received

IMPORTANT NOTE
• In CASH method: Client defers max 10% of total project cost until after net metering approval
• In HYBRID method: Client's cash is paid upfront with 1st bank installment; max 10% can be deferred until after net metering
• Net metering approval timeline does not impact installation work completion
• Once 1st installment (bank payment + client cash) is received, installation work commences immediately`,
      },
      {
        id: "term-004",
        label: "Project Timeline & Installation Process",
        text: "PHASE 1 - Site Inspection & Agreement (Before Material Dispatch):\n• Mahi Solar Solution's engineer will conduct site inspection and measurements.\n• Client reviews and signs the Installation Agreement with final specifications.\n• Duration: 3–5 working days from quotation acceptance.\n\nPHASE 2 - Material Supply:\n• Material dispatch: 3–5 working days after receipt of required initial payment (as per your payment method).\n\nPHASE 3 - Installation Work (MSS Responsibility):\n• Team installation and system commissioning: 7–10 working days.\n• Includes: Mounting structure, solar panel installation, inverter setup, BOS components, electrical connections, testing & system commissioning.\n• Timeline subject to site readiness and weather conditions.\n\nIMPORTANT - External Dependencies (NOT included in above timeline):\n• Net Metering approval: Handled by DISCOM (JVVNL) — typically 20–30 days. Timeline beyond Mahi Solar's control.\n• Government Subsidy processing: Handled by PM Surya Ghar authority — timeline depends on government approval. Not part of installation completion.",
      },
      {
        id: "term-005",
        label: "Net Metering Approval",
        text: "Net metering approval from DISCOM (JVVNL) is essential for grid-connected solar systems. The approval timeline typically ranges from 7–15 working days after installation completion and submission of required documents. This timeline is beyond Mahi Solar Solution's control and depends on DISCOM processing. Net metering approval does not impact the installation work completion.",
      },
      {
        id: "term-006",
        label: "Customer's Roof & Site Requirements",
        text: "The client must ensure:\n• Shadow-free rooftop with minimum obstruction from trees, buildings, or structures.\n• Safe and unobstructed access for installation team and equipment movement.\n• Roof load-bearing capacity adequate for solar system weight and wind load as per the site's geographical zone.\n• Safe working environment with proper ventilation and access to electricity supply for installation equipment.\n• Any structural issues or modifications must be communicated to Mahi Solar Solution before installation begins.",
      },
      {
        id: "term-007",
        label: "Additional Work Charges",
        text: "The quotation covers only the scope mentioned in the Commercial Offer. Any additional work required, such as:\n• Load extension with DISCOM\n• Additional electrical work or rewiring\n• Structural repairs or modifications to the roof\n• Extra cable runs or mounting adjustments\n• Any changes requested after the installation agreement is signed\n\nwill be charged separately at Mahi Solar Solution's prevailing rates (minimum ₹3,000 per day for re-work or additional services).",
      },
      {
        id: "term-008",
        label: "Material Safety & Responsibility",
        text: "Mahi Solar Solution is responsible for material safety during transit and up to delivery at the project site. After delivery at the site:\n• The client becomes responsible for the safety and security of all supplied materials.\n• Mahi Solar Solution is not liable for theft, damage, vandalism, or loss of materials at the site.\n• The client must store materials in a safe, secure location until installation.\n• Any damage to materials after delivery due to negligence or improper storage will result in additional charges for replacement.",
      },
      {
        id: "term-009",
        label: "Panel Cleaning & Maintenance",
        text: "For optimal solar system performance, we recommend:\n• Regular cleaning of solar panels once every week or once every 15 days, depending on local dust/pollution levels.\n• Dust and dirt accumulation reduces generation efficiency by 15–25%, depending on dust density.\n• Panel cleaning should be done with soft cloth and distilled water; avoid harsh chemicals or abrasive materials.\n• The client is responsible for regular cleaning. Mahi Solar Solution can provide cleaning services on a paid basis.",
      },
      {
        id: "term-010",
        label: "Electricity Generation & Seasonal Variation",
        text: "Annual energy generation is calculated as 4–4.5 kWh per kW of installed capacity per day on average across the year.\n\nSeasonal Variation:\n• SUMMER (March–May): Higher generation — typically 20–25% above annual average due to increased sunlight hours.\n• MONSOON (June–September): Lower generation — typically 30–40% below annual average due to cloud cover and rain.\n• WINTER (October–February): Moderate generation — typically 5–10% below annual average.\n\nNote: Annual generation is an average across all seasons. Monthly generation will vary based on weather conditions, cloud cover, and daylight hours. The above generation figures assume 4.5 hours of peak sun equivalent per day on average.",
      },
      {
        id: "term-011",
        label: "Warranty Coverage & Limitations",
        text: "Warranty Coverage:\n• Panels: 30-year product warranty (manufacturing defects) + 25-year performance warranty\n• Inverter: 10-year manufacturer warranty\n• BOS & Installation: 5-year warranty\n\nWarranty WILL NOT Cover:\n• Damage due to natural disasters (floods, earthquakes, storms, lightning)\n• Theft or vandalism\n• Fire or electrical damage due to external causes\n• Damage due to improper maintenance or cleaning\n• Unauthorized modifications or repairs\n• Damage due to user negligence or misuse\n• Impact damage or structural damage to the roof\n\nWarranty claims are subject to the original equipment manufacturer's terms and conditions.",
      },
      {
        id: "term-012",
        label: "Government Subsidy Dependency",
        text: "Government subsidy under PM Surya Ghar: Muft Bijli Yojana is subject to:\n• Latest government guidelines and scheme eligibility criteria\n• Approval by concerned government authorities (SECI, state nodal agency)\n• Timely submission of required documents and approvals from DISCOM\n• Beneficiary's eligibility status (residential property, income limits, etc.)\n\nSubsidy amount and approval timeline are beyond Mahi Solar Solution's control. Any delay in subsidy approval will not impact installation work. Subsidy disbursement timeline depends on government processing.",
      },
      {
        id: "term-013",
        label: "Jurisdiction & Dispute Resolution",
        text: "This quotation and all related agreements are governed by the laws of Rajasthan, India. All disputes, claims, or differences arising from this quotation or the installation work shall be subject to the exclusive jurisdiction of Jaipur Civil Court. Both parties agree to resolve disputes amicably through negotiation first, followed by arbitration if necessary, as per applicable law.",
      },
      {
        id: "term-014",
        label: "Warranty",
        text: "Plant designed for 25 years with linear efficiency. The plant will produce minimum power up to 90% of the rated capacity for 10 years and thereafter 80% of the rated capacity up to 25 years, with sun availability of 4.5 hours a day during sun radiation availability. We also provide 5 years warranty support; however, the warranty will be owned by the original equipment manufacturer of the solar panel and inverter.",
      },
      {
        id: "term-015",
        label: "Photography & Content Creation",
        text: "Mahi Solar Solution reserves the right to conduct photography, video shoots, and content creation during installation and thereafter for marketing, advertising, and promotional purposes. All captured content and intellectual property rights belong to the Company.",
      },
    ],
    subsidyDocuments: [
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
    ],
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
  },
};
