import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createRjGreenSolarEnergyAgreementData() {
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
      entityName: "RJ Green Solar Energy",
      partyLabel: "Vendor",
      address:
        "Manethia Ki Dhani, Balaji Road, near Punjab National Bank, Phulera, Hirnoda, Jaipur, Rajasthan – 303338",
      representativeName: "Jitendra Manethiya",
      representativeTitle: "Proprietor",
      gst: "08GCLPM7106J1Z6",
      aadhaar: "4462 0302 1760",
      pan: "GCLPM7106J",
      consumerNumber: "",
      discom: "JVVNL",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export const rjGreenSolarEnergyAgreement: AgreementRecord = {
  id: "vendor-agreement-rj-green-solar-energy-001",
  name: "RJ Green Solar Energy — Vendor Code Agreement",
  createdAt: "2026-07-22T00:00:00Z",
  updatedAt: "2026-07-22T00:00:00Z",
  content: createRjGreenSolarEnergyAgreementData(),
};
