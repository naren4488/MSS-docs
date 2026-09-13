import type { AgreementCompany } from "@/features/agreement/types/agreement";

export type { AgreementCompany as HandoverCompany };

export type HandoverKind = "ongrid" | "offgrid";

export interface HandoverEquipmentItem {
  id: string;
  description: string;
  specification: string;
  qty: string;
  remarks: string;
}

export interface HandoverCheckItem {
  id: string;
  label: string;
  handed: boolean;
}

export interface HandoverTerm {
  id: string;
  title: string;
  text: string;
}

export interface HandoverData {
  kind: HandoverKind;
  handoverNo: string;
  handoverDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  consumerNumber: string;
  discom: string;
  capacity: string;
  plantTypeLabel: string;
  phase: string;
  invoiceNo: string;
  installationDate: string;
  commissioningDate: string;
  netMeteringNote: string;
  moduleSummary: string;
  inverterSummary: string;
  batterySummary: string;
  greeting: string;
  note: string;
  equipment: HandoverEquipmentItem[];
  documents: HandoverCheckItem[];
  commissioningChecks: string[];
  careNotes: string[];
  terms: HandoverTerm[];
  acknowledgement: string;
  closingNote: string;
  company: AgreementCompany;
  repName: string;
  repTitle: string;
  repCompany: string;
  repMobiles: string;
  showLetterhead: boolean;
  showPageNumbers: boolean;
}
