export type CompanyFirm = "mahi-solar-solution" | "mahi-solar-energy";

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
