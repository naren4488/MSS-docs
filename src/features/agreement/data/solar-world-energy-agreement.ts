import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createSolarWorldEnergyAgreementData() {
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
      entityName: "Solar World Energy",
      partyLabel: "Vendor",
      address: "182, Shiv Nagar Hathoj, Sirsi Hathoj Road, Hathoj, Jaipur, Rajasthan – 302012",
      representativeName: "Sohan Lal",
      representativeTitle: "Proprietor",
      gst: "08AQCPL3071A1ZC",
      aadhaar: "6996 2913 1397",
      pan: "AQCPL3071A",
      consumerNumber: "",
      discom: "JVVNL",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export const solarWorldEnergyAgreement: AgreementRecord = {
  id: "vendor-agreement-solar-world-energy-001",
  name: "Solar World Energy — Vendor Code Agreement",
  createdAt: "2026-07-18T00:00:00Z",
  updatedAt: "2026-07-18T00:00:00Z",
  content: createSolarWorldEnergyAgreementData(),
};
