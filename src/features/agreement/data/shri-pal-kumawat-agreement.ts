import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createShriPalKumawatAgreementData() {
  const base = createDefaultAgreementData("project-referral", "en");
  return {
    ...base,
    company: {
      ...base.company,
      website: "mahisolarsolution.com",
    },
    partyIsIndividual: true,
    showPartyPan: true,
    showReferralCommission: true,
    referralCommissionAmount: "20,000",
    introTemplate:
      'THIS AGREEMENT (the "Agreement") is made as of {{effectiveDateFormatted}} (the "Effective Date") by and between {{company.name}} with a principal place of business at {{company.address}}.\n\nAnd {{party.entityName}} ("Referrer") with address at {{party.addressWithPan}}.',
    party: {
      ...base.party,
      entityName: "Shri Pal Kumawat",
      partyLabel: "Referrer",
      address: "385, Radha Vihar, Hathoj, Kalwar Road, Jaipur – 302012",
      representativeName: "",
      representativeTitle: "",
      gst: "",
      pan: "GAGPK4607B",
      aadhaar: "7433 5961 3732",
      consumerNumber: "",
      discom: "JVVNL",
    },
  };
}

export const shriPalKumawatAgreement: AgreementRecord = {
  id: "vendor-agreement-shri-pal-kumawat-001",
  name: "Shri Pal Kumawat — Project Referral Agreement",
  createdAt: "2026-09-17T00:00:00Z",
  updatedAt: "2026-09-17T00:00:00Z",
  content: createShriPalKumawatAgreementData(),
};
