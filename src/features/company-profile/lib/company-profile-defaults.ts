import type { AnnexureProjectReference, CompanyFirm, CompanyProfileData, EmpanelmentAnnexure } from "../types/company-profile";

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
  {
    id: "mss-letterhead",
    label: "MSS Letterhead",
    description: "Printable letterhead for Mahi Solar Solution Private Limited — header and footer only, blank page for letters.",
  },
  {
    id: "mse-letterhead",
    label: "MSE Letterhead",
    description: "Printable letterhead for Mahi Solar Energy — header and footer only, blank page for letters.",
  },
  {
    id: "mss-empanelment-annexure",
    label: "MSS Empanelment Annexure",
    description: "Partner empanelment annexure (experience, project references and bureau consent) on MSS letterhead.",
  },
  {
    id: "mse-empanelment-annexure",
    label: "MSE Empanelment Annexure",
    description: "Partner empanelment annexure (experience, project references and bureau consent) on MSE letterhead.",
  },
];

const COMPANY_FIRM_IDS: CompanyFirm[] = [
  "mahi-solar-solution",
  "mahi-solar-energy",
  "mss-letterhead",
  "mse-letterhead",
  "mss-empanelment-annexure",
  "mse-empanelment-annexure",
];

export function isCompanyFirm(value: string | null): value is CompanyFirm {
  return value !== null && (COMPANY_FIRM_IDS as string[]).includes(value);
}

export function isLetterheadFirm(firm: CompanyFirm): boolean {
  return firm === "mss-letterhead" || firm === "mse-letterhead";
}

export function isAnnexureFirm(firm: CompanyFirm): boolean {
  return firm === "mss-empanelment-annexure" || firm === "mse-empanelment-annexure";
}

export function usesLetterheadChrome(firm: CompanyFirm): boolean {
  return isLetterheadFirm(firm) || isAnnexureFirm(firm);
}

export function isMseFirm(firm: CompanyFirm): boolean {
  return firm === "mahi-solar-energy" || firm === "mse-letterhead" || firm === "mse-empanelment-annexure";
}

export function getLetterheadVendorLine(firm: CompanyFirm): string {
  return isMseFirm(firm)
    ? "Rooftop Solar Design, Procurement & Installation"
    : "JVVNL & Government Registered Solar Vendor";
}

export function getCompanyFirmLabel(firm: CompanyFirm): string {
  return COMPANY_FIRMS.find((item) => item.id === firm)?.label ?? "Company";
}

// Shared between the two firms (same premises, same proprietor/contact line).
const SHARED_ADDRESS = "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302012";
const SHARED_PHONE = "+91 9928413501";
const SHARED_ALT_PHONE = "";
const SHARED_TAGLINE = "Powering Homes with Clean & Sustainable Energy";

export const MSS_LOGO_URL = "/assets/Mahi2.svg";
export const MSE_LOGO_URL = "/assets/Mahi_Solar_Energy_logo.svg";

function emptyReference(): AnnexureProjectReference {
  return { details: "", address: "", contactName: "", mobile: "" };
}

/** MSE GST registration: December 2024 — used for “years at current office”. */
const MSE_GST_SINCE = new Date(2024, 11, 1);

function yearsSinceMseGst(asOf: Date = new Date()): string {
  const months =
    (asOf.getFullYear() - MSE_GST_SINCE.getFullYear()) * 12 + (asOf.getMonth() - MSE_GST_SINCE.getMonth());
  const totalMonths = Math.max(0, months);
  const years = Math.floor(totalMonths / 12);
  const remMonths = totalMonths % 12;
  if (years === 0) {
    return remMonths <= 1 ? "1 month" : `${remMonths} months`;
  }
  if (remMonths === 0) {
    return years === 1 ? "1 year" : `${years} years`;
  }
  const yearPart = years === 1 ? "1 year" : `${years} years`;
  const monthPart = remMonths === 1 ? "1 month" : `${remMonths} months`;
  return `${yearPart} ${monthPart}`;
}

export function createDefaultAnnexure(overrides: Partial<EmpanelmentAnnexure> = {}): EmpanelmentAnnexure {
  return {
    constitution: "",
    proprietors: "",
    officeAddress: SHARED_ADDRESS,
    registeredAddress: SHARED_ADDRESS,
    contactPerson: "Mahendra Kumawat",
    yearsCurrentBusiness: "",
    yearsOtherBusiness: "",
    infrastructure: "",
    employeeCount: "",
    yearsAtOffice: "",
    nbfcBanks: "",
    attachProfile: "",
    references: [emptyReference(), emptyReference()],
    consentRecipient: "Ecofy finance pvt ltd\nBirla Aurora,\n12th Floor, Dr. Annie Besant Road,\nCentury Bazaar, Worli,\nMumbai, MH 400030",
    consentBody:
      "I/We authorize ACFPL to conduct such credit checks as it considers necessary in its sole discretion, to make any enquiries with other finance companies/registered credit bureau/ other institutional regarding my application and to release such or any other information in its records for the purpose of credit appraisal/sharing for any other purpose. ACFPL reserves the right to retain the photographs and documents submitted with this application and will not return the same to the applicant.",
    signatoryName: "Mahendra Kumawat",
    signatoryTitle: "Director",
    place: "Jaipur",
    date: new Date().toISOString().slice(0, 10),
    ...overrides,
  };
}

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
    logoUrl: MSS_LOGO_URL,
    legalName: "",
    tagline: SHARED_TAGLINE,
    address: SHARED_ADDRESS,
    phone: SHARED_PHONE,
    altPhone: SHARED_ALT_PHONE,
    email: "",
    website: "mahisolarsolution.com",
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
    annexure: createDefaultAnnexure(),
    showContact: true,
    showStatutory: true,
    showBank: true,
    showContactPerson: true,
    showNotes: true,
    showLetterhead: true,
    showPageNumbers: false,
  };

  const mse: CompanyProfileData = {
    ...base,
    logoUrl: MSE_LOGO_URL,
    legalName: "MAHI SOLAR ENERGY",
    email: "mahisolarenergy77@gmail.com",
    website: "mahisolarenergy.com",
    gst: "08GPEPK1479A1ZZ",
    contactTitle: "Proprietor",
    ...MSE_BANK_DETAILS,
  };

  if (firm === "mahi-solar-energy") {
    return mse;
  }

  const mss: CompanyProfileData = {
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

  if (firm === "mss-letterhead" || firm === "mse-letterhead") {
    const source = firm === "mse-letterhead" ? mse : mss;
    return {
      ...source,
      title: "",
      tagline: "",
      showContact: false,
      showStatutory: false,
      showBank: false,
      showContactPerson: false,
      showNotes: true,
      showLetterhead: true,
    };
  }

  if (firm === "mss-empanelment-annexure") {
    return {
      ...mss,
      title: "",
      tagline: "",
      showContact: false,
      showStatutory: false,
      showBank: false,
      showContactPerson: false,
      showNotes: false,
      showLetterhead: true,
      annexure: createDefaultAnnexure({
        constitution: "Private Limited",
        proprietors: "Mahendra Kumawat",
        officeAddress: SHARED_ADDRESS,
        registeredAddress: SHARED_ADDRESS,
        contactPerson: "Mahendra Kumawat",
        infrastructure:
          "Rooftop solar design, procurement, installation and commissioning. JVVNL & Government registered solar vendor.",
        attachProfile: "Available on request",
        signatoryName: "Mahendra Kumawat",
        signatoryTitle: "Director",
      }),
    };
  }

  if (firm === "mse-empanelment-annexure") {
    return {
      ...mse,
      title: "",
      tagline: "",
      showContact: false,
      showStatutory: false,
      showBank: false,
      showContactPerson: false,
      showNotes: false,
      showLetterhead: true,
      annexure: createDefaultAnnexure({
        constitution: "Proprietorship",
        proprietors: "Mahendra Kumawat",
        officeAddress: SHARED_ADDRESS,
        registeredAddress: SHARED_ADDRESS,
        contactPerson: "Mahendra Kumawat",
        yearsCurrentBusiness: "3",
        infrastructure: "Rooftop solar design, procurement, installation and commissioning.",
        employeeCount: "25",
        yearsAtOffice: yearsSinceMseGst(),
        attachProfile: "Available on request",
        references: [
          {
            details: "99 kW",
            address: "Sarna Dungar Jaipur",
            contactName: "Mukesh Manwani",
            mobile: "8005627761",
          },
          {
            details: "15 kW",
            address: "Jhothwara Jaipur",
            contactName: "Kajodmal Yadav",
            mobile: "7568580192",
          },
        ],
        signatoryName: "Mahendra Kumawat",
        signatoryTitle: "Proprietor",
      }),
    };
  }

  return mss;
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
  if (merged.logoUrl === "/assets/mss-logo.png") {
    merged.logoUrl = MSS_LOGO_URL;
  }
  if (merged.logoUrl === "/assets/mse-logo.png") {
    merged.logoUrl = MSE_LOGO_URL;
  }
  if (isMseFirm(firm) && !merged.logoUrl.trim()) {
    merged.logoUrl = MSE_LOGO_URL;
  }
  if (isMseFirm(firm) && (!merged.website.trim() || merged.website === "mahisolarsolution.com")) {
    merged.website = "mahisolarenergy.com";
  }
  if (isMseFirm(firm)) {
    for (const key of Object.keys(MSE_BANK_DETAILS) as (keyof typeof MSE_BANK_DETAILS)[]) {
      if (!merged[key].trim()) {
        merged[key] = MSE_BANK_DETAILS[key];
      }
    }
  }
  if (usesLetterheadChrome(firm)) {
    merged.tagline = "";
  }
  const fixPincode = (value: string) => value.replaceAll("302044", "302012");
  merged.address = fixPincode(merged.address);
  const annexureDefaults = defaults.annexure;
  merged.annexure = {
    ...annexureDefaults,
    ...input?.annexure,
    references:
      input?.annexure?.references && input.annexure.references.length > 0
        ? input.annexure.references.map((row) => ({ ...emptyReference(), ...row }))
        : annexureDefaults.references,
  };
  merged.annexure.officeAddress = fixPincode(merged.annexure.officeAddress);
  merged.annexure.registeredAddress = fixPincode(merged.annexure.registeredAddress);
  return merged;
}
