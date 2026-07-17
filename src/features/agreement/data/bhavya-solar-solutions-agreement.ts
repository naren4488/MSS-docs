import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createBhavyaSolarSolutionsAgreementData() {
  const base = createDefaultAgreementData("partnership", "en");
  return {
    ...base,
    company: {
      ...base.company,
      website: "mahisolarsolution.com",
    },
    partyIsIndividual: false,
    party: {
      ...base.party,
      entityName: "Bhavya Solar Solutions",
      partyLabel: "Vendor",
      address: "House No 09 Tejajiwali Dhani, Asti Kalan, Jaipur, Rajasthan – 303602",
      representativeName: "Pooran Mal Kumawat",
      representativeTitle: "Proprietor",
      gst: "08JGVPK9818N1Z0",
      consumerNumber: "",
      discom: "JVVNL",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export const bhavyaSolarSolutionsAgreement: AgreementRecord = {
  id: "vendor-agreement-bhavya-solar-001",
  name: "Bhavya Solar Solutions — Vendor Code Agreement",
  createdAt: "2026-07-17T00:00:00Z",
  updatedAt: "2026-07-17T00:00:00Z",
  content: createBhavyaSolarSolutionsAgreementData(),
};
