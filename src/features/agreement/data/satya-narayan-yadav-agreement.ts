import type { AgreementClientRow, AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";
import { mapAgreementClientRows } from "../lib/fixed-rate-defaults";

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

/** Live MSS register · SATAYNARAYAN JI: logged clients with deal set. */
const SATYA_NARAYAN_VENDOR_CODE_CLIENTS: Omit<AgreementClientRow, "id">[] = [
  {
    name: "Prahlad Sahay Yadav",
    capacity: "3 kW",
    kNo: "211543033252",
    dealWithUs: "165000",
    workStatus: "I&C Completed",
    remark:
      "First site under this arrangement. Rates were lower at that time, so the deal of ₹1,65,000 is correct (not the current ₹1,70,000 card).",
  },
  { name: "Chhotu Ram", capacity: "3 kW", kNo: "211543024429", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Mangi Devi", capacity: "3 kW", kNo: "211543031692", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Jagdish Narayan Yadav", capacity: "5 kW", kNo: "211543029486", dealWithUs: "250000", workStatus: "I&C Completed", remark: "" },
  { name: "Saroj Kanwar", capacity: "6 kW", kNo: "211543002919", dealWithUs: "300000", workStatus: "I&C Completed", remark: "" },
  { name: "Girdhari Lal Kumawat", capacity: "3 kW", kNo: "110561009732", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Raj Kumar Yadav", capacity: "3 kW", kNo: "211544002801", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Jagdish Prasad Sharma", capacity: "5 kW", kNo: "210474038323", dealWithUs: "265000", workStatus: "I&C Completed", remark: "" },
  { name: "Mali Ram Yadav", capacity: "3 kW", kNo: "211543016284", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Brijesh Kumar Jangid", capacity: "3 kW", kNo: "211543004068", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Jagmala", capacity: "3 kW", kNo: "211544029437", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Rishabh Parwal", capacity: "5 kW", kNo: "211529031375", dealWithUs: "250000", workStatus: "I&C Completed", remark: "" },
  { name: "Kanaram Yadav", capacity: "3 kW", kNo: "211543010330", dealWithUs: "170000", workStatus: "I&C Completed", remark: "" },
  { name: "Narendra Kumar", capacity: "5 kW", kNo: "211529025044", dealWithUs: "265000", workStatus: "Structure Work", remark: "" },
  { name: "Chitra Mal", capacity: "3 kW", kNo: "211543004116", dealWithUs: "170000", workStatus: "Work Not Started Yet", remark: "" },
  { name: "Kajod Mal Yadav", capacity: "3 kW", kNo: "211543032330", dealWithUs: "170000", workStatus: "Work Not Started Yet", remark: "" },
  { name: "Atul Sharma", capacity: "3 kW", kNo: "211525051970", dealWithUs: "170000", workStatus: "Work Not Started Yet", remark: "" },
  { name: "Balu Ram Yadav", capacity: "5 kW", kNo: "210474080523", dealWithUs: "250000", workStatus: "Project On Hold", remark: "" },
];

/** Structure-only / not fully logged — shown separately from the regular client table. */
const SATYA_NARAYAN_OTHER_CLIENTS: Omit<AgreementClientRow, "id">[] = [
  {
    name: "Lalchand Verma",
    capacity: "6 kW",
    kNo: "",
    dealWithUs: "30000",
    workStatus: "Structure Work",
    remark: "File is not logged in. Only structure work was done; listed separately from regular logged clients.",
  },
];

function createClientRows(): AgreementClientRow[] {
  return mapAgreementClientRows(
    SATYA_NARAYAN_VENDOR_CODE_CLIENTS.map((row) => ({
      ...row,
      name: titleCaseName(row.name),
      capacity: normalizeCapacity(row.capacity),
      kNo: row.kNo.trim(),
      dealWithUs: row.dealWithUs.trim(),
      remark: row.remark.trim(),
    })),
  );
}

function createOtherClientRows(): AgreementClientRow[] {
  return mapAgreementClientRows(
    SATYA_NARAYAN_OTHER_CLIENTS.map((row) => ({
      ...row,
      name: titleCaseName(row.name),
      capacity: normalizeCapacity(row.capacity),
      kNo: row.kNo.trim(),
      dealWithUs: row.dealWithUs.trim(),
      remark: row.remark.trim(),
    })),
  );
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
      'THIS PARTNERSHIP AGREEMENT (the "Agreement") is made as of {{effectiveDateFormatted}} (the "Effective Date") by and between {{company.name}}, having its principal place of business at {{company.address}} ("MSS").\n\nAnd {{party.entityName}} ("Partner"), having its principal place of business at {{party.address}} (**PAN: {{party.pan}}**).',
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
      "The Parties have been working together on this fixed-rate basis and continue to do so. The Partner has logged clients / sites under the Vendor Code (including on the MSS project register as SATAYNARAYAN JI); those clients are identified in the annexure for record, without changing this commercial arrangement.",
      "The Parties wish to record that {{company.name}} executes Projects at the agreed per-system fixed rates set out herein, and the amount realised from the customer over and above the applicable rate belongs to the Partner as commission / margin.",
    ],
    showClientSchedule: true,
    clientScheduleHeading: "Annexure — Clients Logged under Vendor Code",
    clientScheduleIntro:
      "The Parties have worked, and continue to work, on the fixed-rate basis described in this Agreement: the Partner brings the Project and collects payment; MSS executes end to end; the Partner earns commission / margin. The following clients / sites were logged or enrolled by the Partner under the Vendor Code (MSS register · SATAYNARAYAN JI) and are listed here for identification and record. The listed sites remain subject to the customer-service, O&M, warranty and indemnity obligations of this Agreement where applicable.",
    clientRows: createClientRows(),
    otherClientScheduleHeading: "Other sites — not fully logged in",
    otherClientScheduleIntro:
      "The following site is listed separately because the file is not logged in under the Vendor Code; only structure work was done.",
    otherClientRows: createOtherClientRows(),
    clientScheduleNote:
      "This annexure is for identification and record only. It does not alter the fixed-rate commercial terms or the division of roles (Partner: bring project + collect payment; MSS: end-to-end execution). Client name, kW, K.NO, deal with us and work status are as per the live project register and may be updated by mutual written acknowledgement of the Parties.",
  };
}

export const SATYA_NARAYAN_YADAV_AGREEMENT_ID = "agreement-satya-narayan-yadav-fixed-rate-001";

export const satyaNarayanYadavAgreement: AgreementRecord = {
  id: SATYA_NARAYAN_YADAV_AGREEMENT_ID,
  name: "Satya Narayan Yadav — Fixed Rate Partnership Agreement",
  createdAt: "2026-09-19T00:00:00Z",
  updatedAt: "2026-09-19T06:00:00Z",
  content: createSatyaNarayanYadavAgreementData(),
};
