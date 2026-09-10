export type OfferLetterTemplate = "fresh" | "full-time-conversion" | "direct-full-time";

export interface OfferLetterCompany {
  name: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  cin: string;
  gst: string;
  founderName: string;
  founderTitle: string;
}

export interface OfferLetterTerm {
  id: string;
  title: string;
  content: string;
}

export interface OfferLetterData {
  /** Which baseline template this letter was created from. */
  templateId?: OfferLetterTemplate;
  company: OfferLetterCompany;
  employeeName: string;
  employeeAddress: string;
  role: string;
  /** Date this offer letter is issued. */
  issuanceDate: string;
  dateOfJoining: string;
  /** e.g. Full-time confirmed employment */
  employmentType: string;
  location: string;
  monthlySalary: number;
  /** Extra compensation notes (TDS, pay cycle, in-hand vs CTC, etc.). */
  salaryNotes: string[];
  /** e.g. 6 days a week, 9:00 AM – 5:00 PM */
  workingHours: string;
  reportingTo: string;
  offerValidityDays: number;
  responsibilities?: string;
  roleOverview: string;
  responsibilityPoints: string[];
  leavePolicy: string[];
  otherBenefits: string[];
  insuranceCoverage: string;
  insuranceMinTenure: string;
  terms: OfferLetterTerm[];
  showAcceptance: boolean;
  showSeal: boolean;
  showSignature: boolean;
  sealUrl: string;
  signatureUrl: string;
  signatoryName: string;
  showPageNumbers: boolean;
}

export interface OfferLetterRecord {
  id: string;
  name: string;
  content: OfferLetterData;
  createdAt: string;
  updatedAt: string;
}
