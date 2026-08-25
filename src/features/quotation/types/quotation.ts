import type { AgreementCompany } from "@/features/agreement/types/agreement";

// Reuse the company (letterhead) shape used by the agreement features.
export type { AgreementCompany as QuotationCompany };

export type QuotationLanguage = "en" | "hi";
export type QuotationPhase = "1PH" | "3PH";

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
  address: string;
  proposalDate: string;

  company: AgreementCompany;

  materialItems: QuotationMaterialItem[];
  installationWork: string[];
  assumptions: string[];
  customerScope: string[];

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

  netMeteringNote: string;
  loadExtensionNote: string;

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
}

export interface QuotationRecord {
  id: string;
  name: string;
  content: QuotationData;
  createdAt: string;
  updatedAt: string;
}
