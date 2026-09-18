import type { AgreementCompany } from "@/features/agreement/types/agreement";

export type { AgreementCompany as ReceiptCompany };

export type ReceiptPaymentMode = "Cash" | "UPI" | "NEFT" | "IMPS" | "Cheque" | "RTGS";

export interface ReceiptData {
  receiptNo: string;
  receiptDate: string;
  customerName: string;
  customerPhone: string;
  address: string;
  quotationNo: string;
  capacity: string;
  phase: string;
  panel: string;
  inverter: string;
  projectAmount: string;
  amountReceived: string;
  paymentDate: string;
  paymentMode: ReceiptPaymentMode;
  paymentReference: string;
  receivedAgainst: string;
  note: string;
  company: AgreementCompany;
  repName: string;
  repTitle: string;
  showSignature: boolean;
  showLetterhead: boolean;
}
