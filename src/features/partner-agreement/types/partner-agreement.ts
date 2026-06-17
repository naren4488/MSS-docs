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
export type PartnerDealType = "fixed-rate" | "profit-share";

export type PartnerAgreementLanguage = "en" | "hi";

/** A single row in the fixed-rate schedule (e.g. "5 kW", "3 Phase", "265000"). */
export interface PartnerRateCard {
  id: string;
  capacity: string;
  phase: string;
  price: string;
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

  // The "actual deal" between the two parties. For a fixed-rate deal the
  // rateCards hold the price schedule; for a profit-share deal the split is
  // described in dealIntro using {{var.mssShare}} / {{var.partnerShare}}.
  dealHeading: string;
  dealIntro: string;
  rateCards: PartnerRateCard[];
  rateNote: string;

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
