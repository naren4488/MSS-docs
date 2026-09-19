import type {
  AgreementClause,
  AgreementClauseSubPoint,
  AgreementCompany,
  AgreementParty,
  AgreementSection,
  AgreementVariableField,
  AgreementWitness,
} from "@/features/agreement/types/agreement";

// The partnership agreement reuses the structural shapes of the regular
// agreement (company, party, sections, clauses, witnesses) so that the
// existing PartyEditor / SectionEditor components can be shared. Re-export
// them under partner names for clarity at call sites.
export type {
  AgreementClause as PartnerClause,
  AgreementClauseSubPoint as PartnerClauseSubPoint,
  AgreementCompany as PartnerCompany,
  AgreementParty as PartnerParty,
  AgreementSection as PartnerSection,
  AgreementVariableField as PartnerVariableField,
  AgreementWitness as PartnerWitness,
};

/** The two kinds of partner deal we currently support. */
export type PartnerDealType = "fixed-rate";

export type PartnerAgreementLanguage = "en" | "hi";

/** A single row in the fixed-rate schedule (e.g. "5 kW", "3 Phase", "265000"). */
export interface PartnerRateCard {
  id: string;
  capacity: string;
  phase: string;
  price: string;
}

/** A client / site previously logged under the vendor code (annexure on last pages). */
export interface PartnerClientRow {
  id: string;
  name: string;
  /** System size, e.g. "3 kW". */
  capacity: string;
  /** Consumer / K.NO from the project register. */
  kNo: string;
  /** Deal with us (MSE / MSS) for that project, usually a rupee amount. */
  dealWithUs: string;
  workStatus: string;
  /** Optional note under the client name (e.g. first-site rate exception). */
  remark: string;
}

export interface PartnerAgreementData {
  dealType: PartnerDealType;
  language: PartnerAgreementLanguage;
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

  // The commercial deal between the two parties. rateCards hold the fixed
  // per-system price schedule; dealIntro describes how Partner margin is calculated.
  dealHeading: string;
  dealIntro: string;
  rateCards: PartnerRateCard[];
  rateNote: string;

  /** Optional last-page annexure of clients logged under the vendor code. */
  showClientSchedule: boolean;
  clientScheduleHeading: string;
  clientScheduleIntro: string;
  clientRows: PartnerClientRow[];
  clientScheduleNote: string;

  /** Separate block for sites not fully logged (e.g. structure-only). */
  otherClientScheduleHeading: string;
  otherClientScheduleIntro: string;
  otherClientRows: PartnerClientRow[];

  closingParagraph: string;
  governingLawParagraph: string;

  partyIsIndividual: boolean;
  showWitnesses: boolean;
  witnesses: AgreementWitness[];
  showPageNumbers: boolean;
  showLetterhead: boolean;
}

export interface PartnerAgreementRecord {
  id: string;
  name: string;
  content: PartnerAgreementData;
  createdAt: string;
  updatedAt: string;
}
