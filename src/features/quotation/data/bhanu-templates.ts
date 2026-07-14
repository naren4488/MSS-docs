import { normalizeQuotationData } from "../lib/quotation-defaults";
import type { QuotationData } from "../types/quotation";

const today = new Date().toISOString().slice(0, 10);

/**
 * Bhanu - 10 KW Solar System Quotation Templates
 * 4 variations based on equipment brand (INA vs Adani) and subsidy eligibility (DCR vs Non-DCR)
 */

// Template 1: DCR INA 450k (with subsidy)
export const bhanuDCRINA: QuotationData = normalizeQuotationData({
  title: "SOLAR PROPOSAL",
  tagline: "SMART  |  SUSTAINABLE  |  COST EFFECTIVE",
  customerName: "Bhanu",
  capacity: "10 KW 3PH",
  systemPhase: "3 Phase",
  address: "Jaipur",
  proposalDate: today,
  materialItems: [
    { id: "1", description: "Solar PV Modules", qty: "18 Panel", unit: "555 Wp", make: "INA Solar Bifacial / Silicon Technology with 30 Year Warranty" },
    { id: "2", description: "Solar Inverter", qty: "1", unit: "3 Phase", make: "10 KW INA Three Phase Inverter with 10 Year Warranty" },
    { id: "3", description: "Mounting Structure (GI Apollo)", qty: "As per Requirement", unit: "", make: "Leg 75×75, Rafter 60×40, Purlin 40×40" },
    { id: "4", description: "AC Cable", qty: "As per Requirement", unit: "M", make: "4 Core Aluminium Armoured Cable (3 Phase)" },
    { id: "5", description: "DC Cable", qty: "As per Requirement", unit: "M", make: "6 sq mm Copper Wire, Polycab cable" },
    { id: "6", description: "Lightning Arrestor Kit", qty: "2 No", unit: "1 No", make: "1.5 M, Copper bound" },
    { id: "7", description: "Earthing Kit", qty: "4 Set", unit: "Set", make: "Earthing single core copper, 1.5 Mtr" },
    { id: "8", description: "ACDB / DCDB / MCB Distribution Box", qty: "1, 2 No", unit: "63 Amp", make: "L&T, Schneider" },
    { id: "9", description: "Solar & Net Meter LT-CT", qty: "1, 2 No", unit: "", make: "Genus or HPL as per availability" },
    { id: "10", description: "DC Wire Duct & Connecting Cable", qty: "40 M, 10 Set", unit: "6/4 mm 1500 V DC", make: "Polycab Copper 6 mm" },
    { id: "11", description: "Designed Installation & Commissioning", qty: "", unit: "As per site requirement", make: "Team Mahi Solar Solution" },
  ],
  commercialOffer: [
    { id: "1", parameter: "Solar PV Plant Capacity", offering: "10 KWp, On-grid SPV System" },
    { id: "2", parameter: "Equipment Type", offering: "INA Solar Modules with INA Inverter" },
    { id: "3", parameter: "Price Basis", offering: "Turnkey EPC" },
    { id: "4", parameter: "Project Price", offering: "Rs. 45 / Watt — ₹4,50,000/-" },
    { id: "5", parameter: "GST Head", offering: "5% GST on 70% & 18% on rest" },
    { id: "6", parameter: "Government Subsidy", offering: "₹78,000/- (Under DCR Scheme)" },
    { id: "7", parameter: "Customer Net Payable", offering: "₹3,72,000/- (After Subsidy + Tax)" },
    { id: "8", parameter: "2 Year Maintenance", offering: "FREE" },
  ],
  generation: { perDay: "40 Units / Day", perMonth: "1200 Units / Month", perYear: "14400 Units / Year", savingPerYear: "₹ 1,15,200" },
  projectAmount: "5,00,000",
  centralSubsidy: "78,000",
  stateSubsidy: "17,000",
  effectivePayableAmount: "4,05,000",
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
  showWarrantyBadges: true,
  warrantySolarPanelYears: "30",
  warrantyInverterYears: "10",
  warrantySetupBosYears: "5",
});

// Template 2: Non-DCR INA 340k
export const bhanuNonDCRINA: QuotationData = normalizeQuotationData({
  ...bhanuDCRINA,
  materialItems: bhanuDCRINA.materialItems,
  commercialOffer: [
    { id: "1", parameter: "Solar PV Plant Capacity", offering: "10 KWp, On-grid SPV System" },
    { id: "2", parameter: "Equipment Type", offering: "INA Solar Modules with INA Inverter" },
    { id: "3", parameter: "Price Basis", offering: "Turnkey EPC" },
    { id: "4", parameter: "Project Price", offering: "Rs. 34 / Watt — ₹3,40,000/-" },
    { id: "5", parameter: "GST Head", offering: "5% GST on 70% & 18% on rest" },
    { id: "6", parameter: "Government Subsidy", offering: "Not Applicable (Non-DCR)" },
    { id: "7", parameter: "Customer Net Payable", offering: "₹3,40,000/- (Including Tax)" },
    { id: "8", parameter: "2 Year Maintenance", offering: "FREE" },
  ],
  projectAmount: "3,77,000",
  centralSubsidy: "",
  stateSubsidy: "",
  effectivePayableAmount: "3,77,000",
  subsidyNote: "",
});

// Template 3: DCR Adani 490k
export const bhanuDCRAdani: QuotationData = normalizeQuotationData({
  ...bhanuDCRINA,
  materialItems: [
    { id: "1", description: "Solar PV Modules", qty: "18 Panel", unit: "555 Wp", make: "Adani Solar Bifacial / Silicon Technology" },
    { id: "2", description: "Solar Inverter", qty: "1", unit: "3 Phase", make: "10 KW Adani Three Phase Inverter" },
    ...bhanuDCRINA.materialItems.slice(2),
  ],
  commercialOffer: [
    { id: "1", parameter: "Solar PV Plant Capacity", offering: "10 KWp, On-grid SPV System" },
    { id: "2", parameter: "Equipment Type", offering: "Adani Solar Modules with Adani Inverter" },
    { id: "3", parameter: "Price Basis", offering: "Turnkey EPC" },
    { id: "4", parameter: "Project Price", offering: "Rs. 49 / Watt — ₹4,90,000/-" },
    { id: "5", parameter: "GST Head", offering: "5% GST on 70% & 18% on rest" },
    { id: "6", parameter: "Government Subsidy", offering: "₹78,000/- (Under DCR Scheme)" },
    { id: "7", parameter: "Customer Net Payable", offering: "₹4,12,000/- (After Subsidy + Tax)" },
    { id: "8", parameter: "2 Year Maintenance", offering: "FREE" },
  ],
  projectAmount: "5,43,000",
  centralSubsidy: "78,000",
  stateSubsidy: "17,000",
  effectivePayableAmount: "4,48,000",
  subsidyNote: "*Subject to subsidy eligibility — state subsidy applies only where 100 units free benefit is currently available.",
});

// Template 4: Non-DCR Adani 380k
export const bhanuNonDCRAdani: QuotationData = normalizeQuotationData({
  ...bhanuDCRAdani,
  commercialOffer: [
    { id: "1", parameter: "Solar PV Plant Capacity", offering: "10 KWp, On-grid SPV System" },
    { id: "2", parameter: "Equipment Type", offering: "Adani Solar Modules with Adani Inverter" },
    { id: "3", parameter: "Price Basis", offering: "Turnkey EPC" },
    { id: "4", parameter: "Project Price", offering: "Rs. 38 / Watt — ₹3,80,000/-" },
    { id: "5", parameter: "GST Head", offering: "5% GST on 70% & 18% on rest" },
    { id: "6", parameter: "Government Subsidy", offering: "Not Applicable (Non-DCR)" },
    { id: "7", parameter: "Customer Net Payable", offering: "₹3,80,000/- (Including Tax)" },
    { id: "8", parameter: "2 Year Maintenance", offering: "FREE" },
  ],
  projectAmount: "4,21,000",
  centralSubsidy: "",
  stateSubsidy: "",
  effectivePayableAmount: "4,21,000",
  subsidyNote: "",
});

export const bhanuTemplates = [
  { name: "Bhanu - DCR INA 450k (with subsidy)", data: bhanuDCRINA },
  { name: "Bhanu - Non-DCR INA 340k (no subsidy)", data: bhanuNonDCRINA },
  { name: "Bhanu - DCR Adani 490k (with subsidy)", data: bhanuDCRAdani },
  { name: "Bhanu - Non-DCR Adani 380k (no subsidy)", data: bhanuNonDCRAdani },
];
