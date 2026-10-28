export type CompanyFirm =
  | "mahi-solar-solution"
  | "mahi-solar-energy"
  | "mss-letterhead"
  | "mss-empanelment-annexure"
  | "mse-letterhead"
  | "mse-empanelment-annexure"
  | "mss-site-survey"
  | "mse-site-survey";

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

/**
 * Pre-installation site survey — used by the site engineer after quotation
 * approval for measurement, layout lock-in and physical quotation signature.
 */
export interface SiteSurveyForm {
  customerName: string;
  customerPhone: string;
  siteAddress: string;
  capacity: string;
  /** "1PH" | "3PH" | "" — printed as checkboxes. */
  phase: string;
  surveyDate: string;
  engineerName: string;
  engineerMobile: string;

  /** "Adani" | "Waaree" | "INA" | "Other" | "" — printed as checkboxes. */
  panelMake: string;
  /** Filled when panelMake is Other. */
  panelMakeOther: string;
  panelWp: string;
  panelQty: string;
  /** "Polycab" | "Luminous" | "Other" | "" — printed as checkboxes. */
  inverterMake: string;
  inverterMakeOther: string;
  inverterSize: string;

  structureBrand: string;
  legSize: string;
  legHeight: string;
  legQty: string;
  rafterSize: string;
  rafterLength: string;
  rafterQty: string;
  purlinSize: string;
  purlinLength: string;
  purlinQty: string;
  structureNotes: string;

  acCableMake: string;
  acCableSize: string;
  acCableLengthM: string;
  dcCableMake: string;
  dcCableSize: string;
  dcCableLengthM: string;

  inverterLocation: string;
  acDbLocation: string;
  dcDbLocation: string;
  acCablePath: string;
  earthingCablePath: string;
  earthingPits: string;

  roofType: string;
  shadowNotes: string;
  otherNotes: string;

  quotationSignedOnSite: string;
  clientAgreesLayout: string;

  place: string;
  date: string;
  clientSignName: string;
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
  siteSurvey: SiteSurveyForm;

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
