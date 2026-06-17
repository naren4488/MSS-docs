import type { CompanyFirm, CompanyProfileData } from "../types/company-profile";

export const COMPANY_FIRMS: { id: CompanyFirm; label: string; description: string }[] = [
  {
    id: "mahi-solar-solution",
    label: "Mahi Solar Solution Pvt Ltd",
    description: "Company details sheet for Mahi Solar Solution Private Limited — contact, statutory and bank details.",
  },
  {
    id: "mahi-solar-energy",
    label: "Mahi Solar Energy",
    description: "Company details sheet for Mahi Solar Energy — contact, statutory and bank details.",
  },
];

const COMPANY_FIRM_IDS: CompanyFirm[] = ["mahi-solar-solution", "mahi-solar-energy"];

export function isCompanyFirm(value: string | null): value is CompanyFirm {
  return value !== null && (COMPANY_FIRM_IDS as string[]).includes(value);
}

export function getCompanyFirmLabel(firm: CompanyFirm): string {
  return COMPANY_FIRMS.find((item) => item.id === firm)?.label ?? "Company";
}

// Shared between the two firms (same premises, same proprietor/contact line).
const SHARED_ADDRESS = "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044";
const SHARED_PHONE = "+91 9928413501";
const SHARED_ALT_PHONE = "";
const SHARED_TAGLINE = "Powering Homes with Clean & Sustainable Energy";

export const MSE_LOGO_URL = "/assets/mse-logo.png";

const MSE_BANK_DETAILS = {
  bankAccountName: "MAHI SOLAR ENERGY",
  bankName: "AU Small Finance Bank",
  bankAccountNo: "2021244429857480",
  bankIfsc: "AUBL0002444",
  bankBranch: "Kalwar Road Jaipur",
} as const;

export function createDefaultCompanyProfileData(firm: CompanyFirm = "mahi-solar-solution"): CompanyProfileData {
  const base: CompanyProfileData = {
    firm,
    title: "COMPANY DETAILS",
    logoUrl: "/assets/mss-logo.png",
    legalName: "",
    tagline: SHARED_TAGLINE,
    address: SHARED_ADDRESS,
    phone: SHARED_PHONE,
    altPhone: SHARED_ALT_PHONE,
    email: "",
    website: "",
    gst: "",
    pan: "",
    cin: "",
    bankAccountName: "",
    bankName: "",
    bankAccountNo: "",
    bankIfsc: "",
    bankBranch: "",
    contactName: "Mahendra Kumawat",
    contactTitle: "",
    notes: "",
    showContact: true,
    showStatutory: true,
    showBank: true,
    showContactPerson: true,
    showNotes: true,
    showLetterhead: true,
    showPageNumbers: false,
  };

  if (firm === "mahi-solar-energy") {
    return {
      ...base,
      logoUrl: MSE_LOGO_URL,
      legalName: "MAHI SOLAR ENERGY",
      email: "mahisolarenergy77@gmail.com",
      gst: "08GPEPK1479A1ZZ",
      contactTitle: "Proprietor",
      ...MSE_BANK_DETAILS,
    };
  }

  // mahi-solar-solution
  return {
    ...base,
    legalName: "MAHI SOLAR SOLUTION PRIVATE LIMITED",
    email: "mahisolarsolution@gmail.com",
    gst: "08AAUCM4104G1ZD",
    bankAccountName: "MAHI SOLAR SOLUTION PRIVATE LIMITED",
    bankName: "AU Small Finance Bank",
    bankAccountNo: "7740889928413501",
    bankIfsc: "AUBL0002206",
    contactTitle: "Director",
  };
}

export function normalizeCompanyProfileData(input?: Partial<CompanyProfileData> | null): CompanyProfileData {
  const rawFirm = input?.firm ?? null;
  const firm: CompanyFirm = isCompanyFirm(rawFirm) ? rawFirm : "mahi-solar-solution";
  const defaults = createDefaultCompanyProfileData(firm);
  const merged = {
    ...defaults,
    ...input,
    firm,
  };
  if (firm === "mahi-solar-energy" && !merged.logoUrl.trim()) {
    merged.logoUrl = MSE_LOGO_URL;
  }
  if (firm === "mahi-solar-energy") {
    for (const key of Object.keys(MSE_BANK_DETAILS) as (keyof typeof MSE_BANK_DETAILS)[]) {
      if (!merged[key].trim()) {
        merged[key] = MSE_BANK_DETAILS[key];
      }
    }
  }
  return merged;
}
