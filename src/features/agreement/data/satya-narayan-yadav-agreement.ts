import type { AgreementClientRow, AgreementLedgerBook, AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";
import { mapAgreementClientRows } from "../lib/fixed-rate-defaults";
import {
  SATYANARAYAN_BS_ENTERPRISES_ROWS,
  SATYANARAYAN_BS_ENTERPRISES_SUMMARY,
  SATYANARAYAN_LEDGER_ROWS,
  SATYANARAYAN_LEDGER_SUMMARY,
} from "@/features/mss-sites/lib/satyanarayan-sub-vendor-ledger";
import {
  SATYANARAYAN_BS_ENTERPRISES_LEDGER,
  SATYANARAYAN_SUB_VENDOR_LEDGER,
} from "@/features/mss-sites/lib/projects-config";

function titleCaseName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(" ");
}

function normalizeCapacity(capacity: string) {
  const trimmed = capacity.trim();
  if (!trimmed) return "";
  if (/kW/i.test(trimmed)) return trimmed.replace(/\s+/g, " ");
  return `${trimmed} kW`;
}

function parseMoney(value: string): number {
  const numeric = Number(String(value ?? "").trim().replace(/[,\s₹]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * Prefer register NET DUE TO MSS. When negative, To return = |net|.
 * Negative register CASH is not shown under expected/pending (surfaced via To return / net).
 */
function applyRegisterNetSettlement(row: Omit<AgreementClientRow, "id">): Omit<AgreementClientRow, "id"> {
  const net = parseMoney(row.netDueToMss);
  const cashExpected = parseMoney(row.cashExpected);
  const cashPending = parseMoney(row.cashPending);

  return {
    ...row,
    cashExpected: cashExpected < 0 ? "0" : row.cashExpected,
    cashPending: cashPending < 0 ? "0" : row.cashPending,
    amountToReturn: net < 0 ? String(Math.abs(net)) : "0",
    netDueToMss: String(net),
  };
}

function fileNetAmount(row: Pick<AgreementClientRow, "netDueToMss">): number {
  return parseMoney(row.netDueToMss);
}

/**
 * Live MSS register · SATAYNARAYAN JI (snapshot 2026-10-26).
 * Annexure lists only sites with work status I&C Completed or Structure Work
 * (excludes Work Not Started Yet / Project On Hold / empty).
 * Loan / cash expected, received, and pending follow the live register columns.
 */
const SATYA_NARAYAN_VENDOR_CODE_CLIENTS: Omit<AgreementClientRow, "id">[] = [
  {
    name: "Prahlad Sahay Yadav",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211543033252",
    dealWithUs: "165000",
    workStatus: "I&C Completed",
    remark:
      "First site under this arrangement. Rates were lower at that time, so the deal of ₹1,65,000 is correct (not the current ₹1,70,000 card).",
    loanExpected: "180000",
    cashExpected: "0",
    loanReceived: "180000",
    cashReceived: "0",
    totalReceived: "180000",
    loanPending: "0",
    cashPending: "0",
    amountToReturn: "15000",
    netDueToMss: "-15000",
  },
  {
    name: "Chhotu Lal",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211543024429",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "180000",
    cashExpected: "0",
    loanReceived: "180000",
    cashReceived: "0",
    totalReceived: "180000",
    loanPending: "0",
    cashPending: "0",
    amountToReturn: "10000",
    netDueToMss: "-10000",
  },
  {
    name: "Mangi Devi",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211543031692",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "189000",
    cashExpected: "0",
    loanReceived: "189000",
    cashReceived: "0",
    totalReceived: "189000",
    loanPending: "0",
    cashPending: "0",
    amountToReturn: "19000",
    netDueToMss: "-19000",
  },
  {
    name: "Jagdish Narayan Yadav",
    capacity: "5 kW",
    phase: "1 Phase",
    kNo: "211543029486",
    dealWithUs: "250000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "200000",
    cashExpected: "55000",
    loanReceived: "200000",
    cashReceived: "0",
    totalReceived: "200000",
    loanPending: "0",
    cashPending: "55000",
    amountToReturn: "0",
    netDueToMss: "50000",
  },
  {
    name: "Saroj Kanwar",
    capacity: "6 kW",
    phase: "1 Phase",
    kNo: "211543002919",
    dealWithUs: "300000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "200000",
    cashExpected: "155000",
    loanReceived: "200000",
    cashReceived: "0",
    totalReceived: "200000",
    loanPending: "0",
    cashPending: "155000",
    amountToReturn: "0",
    netDueToMss: "100000",
  },
  {
    name: "Girdhari Lal Kumawat",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "110561009732",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "180000",
    cashExpected: "0",
    loanReceived: "126000",
    cashReceived: "0",
    totalReceived: "126000",
    loanPending: "54000",
    cashPending: "0",
    amountToReturn: "0",
    netDueToMss: "44000",
  },
  {
    name: "Raj Kumar Yadav",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211544002801",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "211000",
    cashExpected: "0",
    loanReceived: "211000",
    cashReceived: "0",
    totalReceived: "192000",
    loanPending: "0",
    cashPending: "0",
    amountToReturn: "41000",
    netDueToMss: "-41000",
  },
  {
    name: "Jagdish Prasad Sharma",
    capacity: "5 kW",
    phase: "3 Phase",
    kNo: "210474038323",
    dealWithUs: "265000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "200000",
    cashExpected: "70000",
    loanReceived: "200000",
    cashReceived: "0",
    totalReceived: "200000",
    loanPending: "0",
    cashPending: "70000",
    amountToReturn: "0",
    netDueToMss: "65000",
  },
  {
    name: "Mali Ram Yadav",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211543016284",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "189000",
    cashExpected: "0",
    loanReceived: "132300",
    cashReceived: "0",
    totalReceived: "132300",
    loanPending: "56700",
    cashPending: "0",
    amountToReturn: "0",
    netDueToMss: "37700",
  },
  {
    name: "Brijesh Kumar Jangid",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211543004068",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "185000",
    cashExpected: "0",
    loanReceived: "128800",
    cashReceived: "0",
    totalReceived: "128800",
    loanPending: "56200",
    cashPending: "0",
    amountToReturn: "0",
    netDueToMss: "41200",
  },
  {
    name: "Jagmala",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211544029437",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "189000",
    cashExpected: "0",
    loanReceived: "189000",
    cashReceived: "0",
    totalReceived: "189000",
    loanPending: "0",
    cashPending: "0",
    amountToReturn: "19000",
    netDueToMss: "-19000",
  },
  {
    name: "Rishabh Parwal",
    capacity: "5 kW",
    phase: "1 Phase",
    kNo: "211529031375",
    dealWithUs: "250000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "200000",
    cashExpected: "70000",
    loanReceived: "200000",
    cashReceived: "34000",
    totalReceived: "234000",
    loanPending: "0",
    cashPending: "36000",
    amountToReturn: "0",
    netDueToMss: "16000",
  },
  {
    name: "Kanaram Yadav",
    capacity: "3 kW",
    phase: "1 Phase",
    kNo: "211543010330",
    dealWithUs: "170000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "189000",
    cashExpected: "0",
    loanReceived: "147000",
    cashReceived: "0",
    totalReceived: "147000",
    loanPending: "42000",
    cashPending: "0",
    amountToReturn: "0",
    netDueToMss: "23000",
  },
  {
    name: "Narendra Kumar",
    capacity: "5 kW",
    phase: "3 Phase",
    kNo: "211529025044",
    dealWithUs: "265000",
    workStatus: "I&C Completed",
    remark: "",
    loanExpected: "200000",
    cashExpected: "78000",
    loanReceived: "116000",
    cashReceived: "0",
    totalReceived: "116000",
    loanPending: "84000",
    cashPending: "78000",
    amountToReturn: "0",
    netDueToMss: "149000",
  },
];

/** Structure-only / not fully logged — shown separately from the regular client table. */
const SATYA_NARAYAN_OTHER_CLIENTS: Omit<AgreementClientRow, "id">[] = [
  {
    name: "Lalchand Verma",
    capacity: "6 kW",
    phase: "",
    kNo: "",
    dealWithUs: "30000",
    workStatus: "Structure Work",
    remark: "File is not logged in. Only structure work was done; listed separately from regular logged clients.",
    loanExpected: "0",
    cashExpected: "40000",
    loanReceived: "0",
    cashReceived: "0",
    totalReceived: "40000",
    loanPending: "0",
    cashPending: "0",
    amountToReturn: "0",
    netDueToMss: "30000",
  },
];

function createClientRows(): AgreementClientRow[] {
  return mapAgreementClientRows(
    SATYA_NARAYAN_VENDOR_CODE_CLIENTS.map((row) =>
      applyRegisterNetSettlement({
        ...row,
        name: titleCaseName(row.name),
        capacity: normalizeCapacity(row.capacity),
        phase: row.phase.trim(),
        kNo: row.kNo.trim(),
        dealWithUs: row.dealWithUs.trim(),
        remark: row.remark.trim(),
      }),
    ),
  );
}

function createOtherClientRows(): AgreementClientRow[] {
  return mapAgreementClientRows(
    SATYA_NARAYAN_OTHER_CLIENTS.map((row) =>
      applyRegisterNetSettlement({
        ...row,
        name: titleCaseName(row.name),
        capacity: normalizeCapacity(row.capacity),
        phase: row.phase.trim(),
        kNo: row.kNo.trim(),
        dealWithUs: row.dealWithUs.trim(),
        remark: row.remark.trim(),
      }),
    ),
  );
}

/** Sum of register NET DUE TO MSS across logged + other annexure sites. */
const SATYA_NARAYAN_FILES_NET =
  SATYA_NARAYAN_VENDOR_CODE_CLIENTS.reduce((sum, row) => sum + fileNetAmount(row), 0) +
  SATYA_NARAYAN_OTHER_CLIENTS.reduce((sum, row) => sum + fileNetAmount(row), 0);

const SATYA_NARAYAN_SETTLEMENT_FINAL =
  SATYA_NARAYAN_FILES_NET +
  SATYANARAYAN_LEDGER_SUMMARY.closingBalance +
  SATYANARAYAN_BS_ENTERPRISES_SUMMARY.closingBalance;

function createLedgerBooks(): AgreementLedgerBook[] {
  return [
    {
      id: "satyanarayan-money-ledger",
      title: SATYANARAYAN_SUB_VENDOR_LEDGER.title,
      subtitle: `Sub Vendor Payment · ${SATYANARAYAN_SUB_VENDOR_LEDGER.sheetTab} · maps to Projects ${SATYANARAYAN_SUB_VENDOR_LEDGER.projectType}`,
      totalDr: String(SATYANARAYAN_LEDGER_SUMMARY.totalDr),
      totalCr: String(SATYANARAYAN_LEDGER_SUMMARY.totalCr),
      closingBalance: String(SATYANARAYAN_LEDGER_SUMMARY.closingBalance),
      rows: SATYANARAYAN_LEDGER_ROWS.map((row) => ({
        date: row.date,
        particular: row.particular,
        dr: String(row.dr),
        cr: String(row.cr),
        closingBalance: String(row.closingBalance),
        remark: row.remark,
      })),
    },
    {
      id: "satyanarayan-bs-enterprises-ledger",
      title: SATYANARAYAN_BS_ENTERPRISES_LEDGER.title,
      subtitle: `Sub Vendor Payment · ${SATYANARAYAN_BS_ENTERPRISES_LEDGER.sheetTab} · also Satyanarayan (${SATYANARAYAN_BS_ENTERPRISES_LEDGER.projectType})`,
      totalDr: String(SATYANARAYAN_BS_ENTERPRISES_SUMMARY.totalDr),
      totalCr: String(SATYANARAYAN_BS_ENTERPRISES_SUMMARY.totalCr),
      closingBalance: String(SATYANARAYAN_BS_ENTERPRISES_SUMMARY.closingBalance),
      rows: SATYANARAYAN_BS_ENTERPRISES_ROWS.map((row) => ({
        date: row.date,
        particular: row.particular,
        dr: String(row.dr),
        cr: String(row.cr),
        closingBalance: String(row.closingBalance),
        remark: row.remark,
      })),
    },
  ];
}

function createSatyaNarayanYadavAgreementData() {
  const base = createDefaultAgreementData("fixed-rate", "en");
  return {
    ...base,
    company: {
      ...base.company,
      website: "mahisolarsolution.com",
    },
    partyIsIndividual: true,
    showPartyPan: true,
    introTemplate:
      'THIS PARTNERSHIP AGREEMENT (the "Agreement") is made as of {{effectiveDateFormatted}} (the "Effective Date") by and between {{company.name}}, having its principal place of business at {{company.address}} ("MSS").\n\nAnd {{party.entityName}} ("Partner"), having its principal place of business at {{party.addressWithPan}}.',
    party: {
      ...base.party,
      entityName: "Satya Narayan Yadav",
      partyLabel: "Partner",
      address: "Deva Baba Ki Dhani, Village Sukhalpura, PO Mundoti, Dist. Jaipur, Rajasthan – 303328",
      representativeName: "",
      representativeTitle: "",
      gst: "",
      pan: "BFHPY2772N",
      aadhaar: "9247 7438 6436",
      consumerNumber: "",
      discom: "JVVNL",
    },
    variables: {
      ...base.variables,
      region: "Jaipur Discom (JVVNL) area, Rajasthan",
      scheme: "PM Surya Ghar: Muft Bijli Yojana",
      discom: "JVVNL",
    },
    recitals: [
      "{{company.name}} is a firm engaged in end-to-end execution of rooftop solar projects, including documentation, scheme / portal work, material procurement, transport, installation and commissioning.",
      "The Partner brings solar rooftop customers, sites and projects, is responsible for collection of payment from the customer, and earns commission / margin on a fixed-rate basis, while {{company.name}} takes care of the Project end to end.",
      "The Parties have been working together on this fixed-rate basis and continue to do so. The Partner has logged clients / sites under the Vendor Code (including on the MSS project register as SATAYNARAYAN JI); sites where work has progressed (I&C Completed or Structure Work) are identified in the annexure for record, without changing this commercial arrangement.",
      "The Parties wish to record that {{company.name}} executes Projects at the agreed per-system fixed rates set out herein, and the amount realised from the customer over and above the applicable rate belongs to the Partner as commission / margin.",
    ],
    showClientSchedule: true,
    clientScheduleHeading: "Annexure — Clients Logged under Vendor Code",
    clientScheduleIntro:
      "The Parties have worked, and continue to work, on the fixed-rate basis described in this Agreement: the Partner brings the Project and collects payment; MSS executes end to end; the Partner earns commission / margin. The following clients / sites were logged or enrolled by the Partner under the Vendor Code (MSS register · SATAYNARAYAN JI) and are listed here for identification and record. Only sites with work status I&C Completed or Structure Work are included. For each site: (i) deal with MSS; (ii) net = register NET DUE TO MSS (negative when MSS is over-collected); (iii) loan and cash expected / received / pending; and (iv) To return when net is negative. Totals and the Settlement summary use the sum of these nets. The listed sites remain subject to the customer-service, O&M, warranty and indemnity obligations of this Agreement where applicable.",
    clientRows: createClientRows(),
    otherClientScheduleHeading: "Other sites — not fully logged in",
    otherClientScheduleIntro:
      "The following site is listed separately because the file is not logged in under the Vendor Code; only structure work was done.",
    otherClientRows: createOtherClientRows(),
    clientScheduleNote:
      "This annexure is for identification and record only. It does not alter the fixed-rate commercial terms or the division of roles (Partner: bring project + collect payment; MSS: end-to-end execution). Figures are as per the live project register. Net for each file follows the register NET DUE TO MSS. When that net is negative, the surplus is shown as To return (e.g. Raj Kumar Yadav: deal ₹1,70,000 vs loan received ₹2,11,000 → net −₹41,000).",
    showLedgerAnnexure: true,
    ledgerAnnexureHeading: "Annexure — Sub Vendor Payment Ledgers",
    ledgerAnnexureIntro:
      "The following money ledgers from the Sub Vendor Payment workbook also relate to the Partner (SATAYNARAYAN JI): the Satyanarayan money ledger (closing ₹1,69,992) and the BS Enterprises ledger (closing ₹1,70,761). They are annexed for identification and record of advances / bills between MSS and the Partner, without changing the fixed-rate commercial terms of this Agreement. These closing balances are added to the files net in the Settlement summary.",
    ledgerBooks: createLedgerBooks(),
    ledgerAnnexureNote:
      "Ledger balances are as per the live Sub Vendor Payment workbook and may be updated by mutual written acknowledgement of the Parties. Closing balances used for settlement are ₹1,69,992 (Satyanarayan money) and ₹1,70,761 (BS Enterprises).",
    showSettlementSummary: true,
    settlementSummaryHeading: "Settlement summary — amount due",
    settlementSummaryIntro:
      "Files net is the sum of register NET DUE TO MSS across the annexed sites (over-collections count as negative). Adding the two Sub Vendor ledger closings gives the amount due / asked:",
    settlementLines: [
      {
        id: "settlement-files-net",
        label: "Net for files (NET DUE TO MSS)",
        amount: String(SATYA_NARAYAN_FILES_NET),
      },
      {
        id: "settlement-satyanarayan-ledger",
        label: "Satyanarayan money ledger (closing)",
        amount: String(SATYANARAYAN_LEDGER_SUMMARY.closingBalance),
      },
      {
        id: "settlement-bs-enterprises-ledger",
        label: "BS Enterprises ledger (closing)",
        amount: String(SATYANARAYAN_BS_ENTERPRISES_SUMMARY.closingBalance),
      },
    ],
    settlementFinalLabel: "Final amount asking",
    settlementFinalAmount: String(SATYA_NARAYAN_SETTLEMENT_FINAL),
    settlementSummaryNote:
      `₹${SATYA_NARAYAN_FILES_NET.toLocaleString("en-IN")} (files net) + ₹1,69,992 (Satyanarayan money) + ₹1,70,761 (BS Enterprises) = ₹${SATYA_NARAYAN_SETTLEMENT_FINAL.toLocaleString("en-IN")} final amount asking. This settlement summary is for record of the amount due between the Parties on the annexed files and ledgers; it does not alter the fixed-rate commercial terms of this Agreement.`,
  };
}

export const SATYA_NARAYAN_YADAV_AGREEMENT_ID = "agreement-satya-narayan-yadav-fixed-rate-001";

export const satyaNarayanYadavAgreement: AgreementRecord = {
  id: SATYA_NARAYAN_YADAV_AGREEMENT_ID,
  name: "Satya Narayan Yadav — Fixed Rate Partnership Agreement",
  createdAt: "2026-09-19T00:00:00Z",
  updatedAt: "2026-10-26T00:00:00Z",
  content: createSatyaNarayanYadavAgreementData(),
};
