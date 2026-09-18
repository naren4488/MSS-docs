import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createTejasPowermaxAgreementData() {
  const base = createDefaultAgreementData("partnership", "en");
  return {
    ...base,
    company: {
      ...base.company,
      website: "mahisolarsolution.com",
    },
    partyIsIndividual: false,
    showPartyPan: true,
    party: {
      ...base.party,
      entityName: "Tejas PowerMax",
      partyLabel: "Vendor",
      address: "31, Ganpati Nagar, Madrampura Balaji, Sanganer, Jaipur, Rajasthan – 302029",
      representativeName: "Priya Kanwar",
      representativeTitle: "Proprietor",
      gst: "08RARPK5482A1Z3",
      pan: "RARPK5482A",
      aadhaar: "3048 0069 6818",
      consumerNumber: "",
      discom: "JVVNL",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export const tejasPowermaxAgreement: AgreementRecord = {
  id: "vendor-agreement-tejas-powermax-001",
  name: "Tejas PowerMax — Vendor Code Agreement",
  createdAt: "2026-09-16T00:00:00Z",
  updatedAt: "2026-09-16T00:00:00Z",
  content: createTejasPowermaxAgreementData(),
};
