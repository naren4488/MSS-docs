export type AgreementTemplate =
  | "partnership"
  | "inc-installation-assign"
  | "inc-goodwill-execution";

export type AgreementLanguage = "en" | "hi";

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
}
