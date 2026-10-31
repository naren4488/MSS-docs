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
  /** Phase, e.g. "1 Phase" / "3 Phase". Shown under the client name with kW and K.NO. */
  phase: string;
  /** Consumer / K.NO from the project register. */
  kNo: string;
  /** Deal with us (MSS) for that project, usually a rupee amount. */
  dealWithUs: string;
  workStatus: string;
  /** Optional note under the client name (e.g. first-site rate exception). */
  remark: string;
  /** Deal with client — loan portion (register LOAN). */
  loanExpected: string;
  /** Deal with client — cash portion (register CASH). */
  cashExpected: string;
  /** Loan received so far (1st + 2nd installment amounts). */
  loanReceived: string;
  /** Cash received by MSS so far (register CASH TO MSS). */
  cashReceived: string;
  /** Total payment received (loan + cash parts; may mirror register TOTAL). */
  totalReceived: string;
  /** Loan still pending from bank (register BANK DUE) — assumed to land eventually. */
  loanPending: string;
  /** Cash still due to MSS (register CASH DUE TO MSS); kept for sync / legacy. */
  cashPending: string;
  /**
   * Legacy: surplus to return when register net is negative.
   * Annexure col 5 now uses deal − (loan received + loan pending + cash received).
   */
  amountToReturn: string;
  /** Register NET DUE TO MSS (kept for sync / reference). */
  netDueToMss: string;
}

/** One money-ledger book shown on a fixed-rate annexure (e.g. Satyanarayan / BS Enterprises). */
export interface AgreementLedgerRow {
  date: string;
  particular: string;
  dr: string;
  cr: string;
  closingBalance: string;
  remark: string;
}

export interface AgreementLedgerBook {
  id: string;
  title: string;
  subtitle: string;
  totalDr: string;
  totalCr: string;
  closingBalance: string;
  rows: AgreementLedgerRow[];
}

/** One line in the annexure settlement summary (files net + ledgers → final ask). */
export interface AgreementSettlementLine {
  id: string;
  label: string;
  amount: string;
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

  /** Optional Sub Vendor / partner money-ledger annexure (one or more books). */
  showLedgerAnnexure: boolean;
  ledgerAnnexureHeading: string;
  ledgerAnnexureIntro: string;
  ledgerBooks: AgreementLedgerBook[];
  ledgerAnnexureNote: string;

  /**
   * Optional settlement box after the client / ledger annexures
   * (e.g. files net + ledger closings = final amount asking).
   */
  showSettlementSummary: boolean;
  settlementSummaryHeading: string;
  settlementSummaryIntro: string;
  settlementLines: AgreementSettlementLine[];
  settlementFinalLabel: string;
  settlementFinalAmount: string;
  settlementSummaryNote: string;

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
  /** Hard copy is out for signature / signing underway (not yet signed). */
  signingInProgress?: boolean;
  /** ISO date or datetime when the hard copy was signed. */
  signedAt?: string;
  /** Short note, e.g. "Hard copy signed" or "Sign in progress". */
  signedNote?: string;
}
