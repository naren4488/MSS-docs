import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createEverestBuildSolarSolutionsAgreementData() {
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
      entityName: "Everest Build & Solar Solutions",
      partyLabel: "Vendor",
      address: "Plot No 25-A, Govind Nagar Vistar Gokulpura, Jhotwara, Jaipur, Rajasthan – 302012",
      representativeName: "",
      representativeTitle: "Partner",
      gst: "08AAMFE3425F1ZJ",
      pan: "AAMFE3425F",
      consumerNumber: "",
      discom: "JVVNL",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export const everestBuildSolarSolutionsAgreement: AgreementRecord = {
  id: "vendor-agreement-everest-build-solar-001",
  name: "Everest Build & Solar Solutions — Vendor Code Agreement",
  createdAt: "2026-09-16T00:00:00Z",
  updatedAt: "2026-09-16T00:00:00Z",
  content: createEverestBuildSolarSolutionsAgreementData(),
};
