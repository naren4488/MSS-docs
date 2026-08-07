import type { AgreementRecord } from "../types/agreement";
import { createDefaultAgreementData } from "../lib/agreement-defaults";

function createNarendraKajlaManagementAuthorityAgreementData() {
  const base = createDefaultAgreementData("management-authority", "en");
  return {
    ...base,
    effectiveDate: "2026-07-26",
    company: {
      ...base.company,
      website: "mahisolarsolution.com",
    },
    partyIsIndividual: true,
    showPartyPan: true,
    party: {
      ...base.party,
      entityName: "Narendra Kajla",
      partyLabel: "Manager",
      address: "Jaipur, Rajasthan (Mobile: +91 6376755072)",
      representativeName: "",
      representativeTitle: "",
      aadhaar: "9740 2357 0788",
      pan: "HIMPK6713B",
      gst: "",
      consumerNumber: "",
      discom: "",
    },
    variables: {
      ...base.variables,
      mseName: "Mahi Solar Energy",
      mseGst: "08GPEPK1479A1ZZ",
      mobile: "+91 6376755072",
      engagementStart: "December 2025",
      phase1End: "February 2026",
      phase1Target: "₹10,00,000 (Ten Lakh)",
      extensionStart: "March 2026",
      targetProfit: "approximately ₹1.25 Crore (One Crore Twenty-Five Lakh)",
      targetDate: "31 December 2026",
      outstandingDebts: "",
      outstandingDebtTotal: "approximately ₹35,00,000 (Thirty-Five Lakh)",
      arbitrationVenue: "Jaipur",
    },
  };
}

export const narendraKajlaManagementAuthorityAgreement: AgreementRecord = {
  id: "management-authority-narendra-kajla-001",
  name: "Narendra Kajla — Management Authority Agreement",
  createdAt: "2026-07-24T00:00:00Z",
  updatedAt: "2026-07-24T00:00:00Z",
  content: createNarendraKajlaManagementAuthorityAgreementData(),
};
