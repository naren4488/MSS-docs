import { MSS_LOGO_URL } from "@/features/company-profile/lib/company-profile-defaults";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import type { ReceiptData, ReceiptPaymentMode } from "../types/receipt";

export const RECEIPT_PAYMENT_MODES: ReceiptPaymentMode[] = ["Cash", "UPI", "NEFT", "IMPS", "Cheque", "RTGS"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function company(): AgreementCompany {
  return {
    name: "Mahi Solar Solution Private Limited",
    logoUrl: MSS_LOGO_URL,
    address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302012",
    phone: "+91 9928413501",
    email: "mahisolarsolution@gmail.com",
    website: "mahisolarsolution.com",
    cin: "",
    gst: "08AAUCM4104G1ZD",
    representativeName: "Mahendra Kumawat",
    representativeTitle: "Director",
  };
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(value: number): string {
  if (value < 20) return ONES[value];
  const ten = Math.floor(value / 10);
  const one = value % 10;
  return one ? `${TENS[ten]} ${ONES[one]}` : TENS[ten];
}

function threeDigits(value: number): string {
  const hundred = Math.floor(value / 100);
  const rest = value % 100;
  const head = hundred ? `${ONES[hundred]} Hundred` : "";
  if (!rest) return head;
  return head ? `${head} ${twoDigits(rest)}` : twoDigits(rest);
}

export function parseReceiptAmount(value: string): number | null {
  const cleaned = value.replace(/[₹,\s]/g, "");
  if (!cleaned) return null;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount);
}

export function formatReceiptAmount(value: string): string {
  const amount = parseReceiptAmount(value);
  if (amount == null) return "";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
}

/** Indian grouping: 10,000 → "Ten Thousand Rupees only". */
export function amountInWords(value: string): string {
  const amount = parseReceiptAmount(value);
  if (amount == null) return "";
  if (amount === 0) return "Zero Rupees only";

  const crore = Math.floor(amount / 10_000_000);
  const lakh = Math.floor((amount % 10_000_000) / 100_000);
  const thousand = Math.floor((amount % 100_000) / 1000);
  const rest = amount % 1000;
  const parts = [
    crore ? `${threeDigits(crore)} Crore` : "",
    lakh ? `${threeDigits(lakh)} Lakh` : "",
    thousand ? `${threeDigits(thousand)} Thousand` : "",
    rest ? threeDigits(rest) : "",
  ].filter(Boolean);

  return `${parts.join(" ")} Rupees only`;
}

export function receiptBalance(projectAmount: string, amountReceived: string): number | null {
  const project = parseReceiptAmount(projectAmount);
  const received = parseReceiptAmount(amountReceived);
  if (project == null || received == null) return null;
  return project - received;
}

export function createReceiptData(): ReceiptData {
  const firm = company();
  const date = today();
  return {
    receiptNo: "",
    receiptDate: date,
    customerName: "",
    customerPhone: "",
    address: "",
    quotationNo: "",
    capacity: "",
    phase: "",
    panel: "",
    inverter: "",
    projectAmount: "",
    amountReceived: "",
    paymentDate: date,
    paymentMode: "Cash",
    paymentReference: "",
    receivedAgainst: "Token amount",
    note: "We acknowledge receipt of the amount below as a token against the solar plant order. This confirms the order, subject to the agreed quotation. The balance, if any, is payable as per that quotation. This is an acknowledgement of payment, not a tax invoice.",
    company: firm,
    repName: firm.representativeName,
    repTitle: firm.representativeTitle,
    showSignature: false,
    showLetterhead: true,
  };
}
