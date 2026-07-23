import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createSunsmartGreenEnergyServicesAgreementData() {
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
      entityName: "Sunsmart Green Energy Services",
      partyLabel: "Vendor",
      address: "34, Near Vatika City, Ajmer Road, Sanjharia, Jaipur, Rajasthan – 302026",
      representativeName: "Ravi Sharma",
      representativeTitle: "Proprietor",
      gst: "08HTDPS5809C1ZH",
      aadhaar: "8253 3187 3865",
      pan: "HTDPS5809C",
      consumerNumber: "",
      discom: "JVVNL",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export const sunsmartGreenEnergyServicesAgreement: AgreementRecord = {
  id: "vendor-agreement-sunsmart-green-energy-001",
  name: "Sunsmart Green Energy Services — Vendor Code Agreement",
  createdAt: "2026-07-22T00:00:00Z",
  updatedAt: "2026-07-22T00:00:00Z",
  content: createSunsmartGreenEnergyServicesAgreementData(),
};
