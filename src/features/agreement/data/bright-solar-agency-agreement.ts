import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createBrightSolarAgencyAgreementData() {
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
      entityName: "Bright Solar Agency",
      partyLabel: "Vendor",
      address: "0, Ward No-5, Rojdi, Phulera, Jaipur Rural, Rajasthan – 303338",
      representativeName: "Amar Chand Kumawat",
      representativeTitle: "Proprietor",
      gst: "08GKUPK3034C1Z2",
      aadhaar: "6888 9854 5612",
      pan: "GKUPK3034C",
      consumerNumber: "",
      discom: "JVVNL",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export const brightSolarAgencyAgreement: AgreementRecord = {
  id: "vendor-agreement-bright-solar-agency-001",
  name: "Bright Solar Agency — Vendor Code Agreement",
  createdAt: "2026-07-23T00:00:00Z",
  updatedAt: "2026-07-23T00:00:00Z",
  content: createBrightSolarAgencyAgreementData(),
};
