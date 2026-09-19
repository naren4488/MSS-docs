export type AgreementTemplate =
  | "partnership"
  | "project-referral"
  | "fixed-rate"
  | "inc-installation-assign"
  | "inc-goodwill-execution"
  | "client-agreement";

export type AgreementLanguage = "en" | "hi";

/** A single row in the fixed-rate schedule (e.g. "5 kW", "3 Phase", "265000"). */
export interface AgreementRateCard {
  id: string;
  capacity: string;
  phase: string;
  price: string;
}

/** A client / site listed on the fixed-rate annexure. */
export interface AgreementClientRow {
  id: string;
  name: string;
  /** System size, e.g. "3 kW". */
  capacity: string;
  /** Consumer / K.NO from the project register. */
  kNo: string;
  /** Deal with us (MSS) for that project, usually a rupee amount. */
  dealWithUs: string;
  workStatus: string;
  /** Optional note under the client name (e.g. first-site rate exception). */
  remark: string;
}

export interface AgreementCompany {
  name: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  cin: string;
  gst: string;
  representativeName: string;
  representativeTitle: string;
}

export interface AgreementParty {
  entityName: string;
  partyLabel: string;
  address: string;
  representativeName: string;
  representativeTitle: string;
  consumerNumber: string;
  discom: string;
  aadhaar?: string;
  gst?: string;
  pan?: string;
}

export interface AgreementVariableField {
  key: string;
  label: string;
  helper?: string;
  multiline?: boolean;
}

export interface AgreementClauseSubPoint {
  id: string;
  label: string;
  text: string;
}

export interface AgreementClause {
  id: string;
  number: string;
  title: string;
  content: string;
  subPoints: AgreementClauseSubPoint[];
}

export interface AgreementSection {
  id: string;
  heading: string;
  intro: string;
  clauses: AgreementClause[];
}

export interface AgreementWitness {
  id: string;
  name: string;
}

export interface AgreementData {
  template: AgreementTemplate;
  language: AgreementLanguage;
  title: string;
  effectiveDate: string;

  company: AgreementCompany;
  party: AgreementParty;

  variableFields: AgreementVariableField[];
  variables: Record<string, string>;

  introTemplate: string;
  recitals: string[];
  preambleAfterRecitals: string;

  sections: AgreementSection[];
  closingParagraph: string;

  governingLawParagraph: string;

  partyIsIndividual: boolean;
  showPartyPan: boolean;
  showVendorChargePerWatt: boolean;
  vendorChargePerWatt: string;
  /** Flat referral commission (e.g. "20,000") for project-referral deals. */
  showReferralCommission: boolean;
  referralCommissionAmount: string;

  /** Fixed-rate schedule (capacity / phase / MSS price). Used by template "fixed-rate". */
  dealHeading: string;
  dealIntro: string;
  rateCards: AgreementRateCard[];
  rateNote: string;

  /** Optional last-page annexure of clients logged under the vendor / partner code. */
  showClientSchedule: boolean;
  clientScheduleHeading: string;
  clientScheduleIntro: string;
  clientRows: AgreementClientRow[];
  clientScheduleNote: string;

  /** Separate block for sites not fully logged (e.g. structure-only). */
  otherClientScheduleHeading: string;
  otherClientScheduleIntro: string;
  otherClientRows: AgreementClientRow[];

  showWitnesses: boolean;
  witnesses: AgreementWitness[];
  showPageNumbers: boolean;
  showLetterhead: boolean;
}

export interface AgreementRecord {
  id: string;
  name: string;
  content: AgreementData;
  createdAt: string;
  updatedAt: string;
  /** Hard-copy signature kept for our records (not required on the PDF). */
  signed?: boolean;
  /** ISO date or datetime when the hard copy was signed. */
  signedAt?: string;
  /** Short note, e.g. "Hard copy signed". */
  signedNote?: string;
}
