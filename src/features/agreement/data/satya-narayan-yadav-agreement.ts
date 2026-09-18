import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createSatyaNarayanYadavAgreementData() {
  const base = createDefaultAgreementData("partnership", "en");
  return {
    ...base,
    company: {
      ...base.company,
      website: "mahisolarsolution.com",
    },
    partyIsIndividual: true,
    showPartyPan: true,
    showVendorChargePerWatt: false,
    vendorChargePerWatt: "",
    party: {
      ...base.party,
      entityName: "Satya Narayan Yadav",
      partyLabel: "Party",
      address: "Deva Baba Ki Dhani, Village Sukhalpura, PO Mundoti, Dist. Jaipur, Rajasthan – 303328",
      representativeName: "",
      representativeTitle: "",
      gst: "",
      pan: "BFHPY2772N",
      aadhaar: "9247 7438 6436",
      consumerNumber: "",
      discom: "JVVNL",
    },
  };
}

export const satyaNarayanYadavAgreement: AgreementRecord = {
  id: "individual-agreement-satya-narayan-yadav-001",
  name: "Satya Narayan Yadav — Individual Agreement",
  createdAt: "2026-09-18T00:00:00Z",
  updatedAt: "2026-09-18T00:00:00Z",
  content: createSatyaNarayanYadavAgreementData(),
};
