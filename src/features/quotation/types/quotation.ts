import type { AgreementCompany } from "@/features/agreement/types/agreement";

// Reuse the company (letterhead) shape used by the agreement features.
export type { AgreementCompany as QuotationCompany };

export type QuotationLanguage = "en" | "hi";
export type QuotationPhase = "1PH" | "3PH";
export type QuotationStructureBrand = "Apollo" | "Tata";
export type QuotationAcCableBrand = "Ramsons" | "Polycab";
/** Solar PV module brand on the BOM. */
export type QuotationPanelBrand = "Adani" | "Waaree" | "INA";
/** Earthing wire BOM option — single make or Indo/Ramsons either-or. */
export type QuotationEarthingWireOption = "Polycab25" | "Indo6" | "Ramsons16" | "IndoOrRamsons";
/** Residential subsidy: MNRE only, or MNRE + state. Hide the block via showSubsidySection. */
export type QuotationSubsidyScope = "central" | "both";
export type QuotationKind = "residential" | "commercial" | "offgrid";
/** Letterhead / bank / signatory identity on the quotation. */
export type QuotationIssuer = "mss" | "mse";
/** One-off special quotation profiles with their own PDF packing / scope rules. */
export type QuotationSpecialId = "" | "ritu-choudhary" | "lokesh-sharma";
/** Signature block on the PDF: both parties, company only, or hidden. */
export type QuotationSignatureMode = "both" | "company" | "none";

export interface QuotationMaterialItem {
  id: string;
  description: string;
  qty: string;
  unit: string;
  make: string;
}

export interface QuotationCommercialRow {
  id: string;
  parameter: string;
  offering: string;
}

export interface QuotationTermItem {
  id: string;
  label: string;
  text: string;
}

export interface QuotationGeneration {
  /**
   * ₹ per unit used for the annual saving estimate.
   * Day / month / year figures are auto-calculated from panel watt × qty.
   */
  unitRate: string;
  /** @deprecated Kept for older saved quotations; ignored when auto-calculating. */
  perDay?: string;
  /** @deprecated Kept for older saved quotations; ignored when auto-calculating. */
  perMonth?: string;
  /** @deprecated Kept for older saved quotations; ignored when auto-calculating. */
  perYear?: string;
  /** @deprecated Kept for older saved quotations; ignored when auto-calculating. */
  savingPerYear?: string;
}

export interface QuotationData {
  language: QuotationLanguage;
  /** Residential PM Surya Ghar, commercial rooftop, or off-grid. Independent of the subsidy toggle. */
  kind: QuotationKind;
  /** MSS (Solution Pvt Ltd) or MSE (Energy) letterhead, bank and signatory. */
  issuer: QuotationIssuer;
  /** Special one-off profile (e.g. Ritu Choudhary). Empty for normal templates. */
  specialQuotation: QuotationSpecialId;
  title: string;
  tagline: string;
  coverImageUrl: string;

  // Top summary
  customerName: string;
  customerPhone: string;
  /** Optional — shown on PDF only when filled. */
  customerEmail: string;
  capacity: string;
  phase: QuotationPhase;
  /** GI mounting structure brand — drives leg size in the BOM. */
  structureBrand: QuotationStructureBrand;
  /** Solar PV module brand — Adani, Waaree, or INA in the BOM. */
  panelBrand: QuotationPanelBrand;
  /** AC armoured cable brand — Ramsons or Polycab in the BOM. */
  acCableBrand: QuotationAcCableBrand;
  /** Earthing wire make shown in the BOM. */
  earthingWire: QuotationEarthingWireOption;
  address: string;
  proposalDate: string;
  /** Commercial summary extras — shown when filled. */
  sanctionLoad: string;
  shadowFreeArea: string;
  connectionType: string;
  roofType: string;

  company: AgreementCompany;

  materialItems: QuotationMaterialItem[];
  installationWork: string[];
  assumptions: string[];
  customerScope: string[];
  /** MSS scope of work — used on commercial quotes. */
  ourScope: string[];

  commercialOffer: QuotationCommercialRow[];
  warrantyText: string;

  showGeneration: boolean;
  generation: QuotationGeneration;

  showWarrantyBadges: boolean;
  warrantySolarPanelYears: string;
  warrantyInverterYears: string;
  warrantySetupBosYears: string;

  showInstallationProcess: boolean;
  installationSteps: string[];

  showWattageInfo: boolean;

  projectAmount: string;
  centralSubsidy: string;
  stateSubsidy: string;
  effectivePayableAmount: string;
  subsidyNote: string;
  /** When false, Effective Investment and subsidy documents are hidden on the PDF. */
  showSubsidySection: boolean;
  /** Central (MNRE) only, or central + state — drives Effective payable. */
  subsidyScope: QuotationSubsidyScope;

  netMeteringNote: string;
  loadExtensionNote: string;
  onGridNote: string;
  discomChargesNote: string;

  showEmiSection: boolean;
  emiInfo: {
    uptoLoanAmount: string;
    interestRate: string;
    tenure5YearEmi: string;
    tenure7YearEmi: string;
    tenure10YearEmi: string;
  };

  showComponentWarranty: boolean;
  maintenanceFrequency: string;
  maintenanceAfterYears: string;

  terms: QuotationTermItem[];
  subsidyDocuments: string[];

  bankAccountName: string;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankGst: string;

  repName: string;
  repTitle: string;
  repCompany: string;
  repMobiles: string;

  showLetterhead: boolean;
  showPageNumbers: boolean;
  /** Client + company, company (Authorized Signatory) only, or hide signatures. */
  signatureMode: QuotationSignatureMode;
}

export interface QuotationRecord {
  id: string;
  name: string;
  content: QuotationData;
  createdAt: string;
  updatedAt: string;
}
