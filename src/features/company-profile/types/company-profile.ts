export type CompanyFirm =
  | "mahi-solar-solution"
  | "mahi-solar-energy"
  | "mss-letterhead"
  | "mss-empanelment-annexure"
  | "mse-letterhead"
  | "mse-empanelment-annexure";

export interface AnnexureProjectReference {
  details: string;
  address: string;
  contactName: string;
  mobile: string;
}

export interface EmpanelmentAnnexure {
  constitution: string;
  proprietors: string;
  officeAddress: string;
  registeredAddress: string;
  contactPerson: string;
  yearsCurrentBusiness: string;
  yearsOtherBusiness: string;
  infrastructure: string;
  employeeCount: string;
  yearsAtOffice: string;
  nbfcBanks: string;
  attachProfile: string;
  references: AnnexureProjectReference[];
  consentRecipient: string;
  consentBody: string;
  signatoryName: string;
  signatoryTitle: string;
  place: string;
  date: string;
}

export interface CompanyProfileData {
  firm: CompanyFirm;
  title: string;

  logoUrl: string;
  legalName: string;
  tagline: string;

  address: string;
  phone: string;
  altPhone: string;
  email: string;
  website: string;

  gst: string;
  pan: string;
  cin: string;

  bankAccountName: string;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;

  contactName: string;
  contactTitle: string;

  notes: string;
  annexure: EmpanelmentAnnexure;

  // Per-section print toggles
  showContact: boolean;
  showStatutory: boolean;
  showBank: boolean;
  showContactPerson: boolean;
  showNotes: boolean;

  showLetterhead: boolean;
  showPageNumbers: boolean;
}

export interface CompanyProfileRecord {
  id: string;
  name: string;
  content: CompanyProfileData;
  createdAt: string;
  updatedAt: string;
}
