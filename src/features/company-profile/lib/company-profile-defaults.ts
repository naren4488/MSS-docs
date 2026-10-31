import type {
  AnnexureProjectReference,
  CompanyFirm,
  CompanyProfileData,
  EmpanelmentAnnexure,
  FileRatesNotice,
  SiteSurveyForm,
} from "../types/company-profile";

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
  {
    id: "mss-site-survey",
    label: "MSS Site Survey Confirmation",
    description:
      "For the site engineer after quotation approval — measurement, structure & cable plan, placement lock-in and client sign-off on MSS letterhead.",
  },
  {
    id: "mse-site-survey",
    label: "MSE Site Survey Confirmation",
    description:
      "For the site engineer after quotation approval — measurement, structure & cable plan, placement lock-in and client sign-off on MSE letterhead.",
  },
  {
    id: "mss-file-rates",
    label: "MSS File Rates — Satyanarayan",
    description:
      "Circular on MSS letterhead for Satya Narayan Yadav — revised Deal-with-MSS / fixed file rates from today.",
  },
];

const COMPANY_FIRM_IDS: CompanyFirm[] = [
  "mahi-solar-solution",
  "mahi-solar-energy",
  "mss-letterhead",
  "mse-letterhead",
  "mss-empanelment-annexure",
  "mse-empanelment-annexure",
  "mss-site-survey",
  "mse-site-survey",
  "mss-file-rates",
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

export function isSiteSurveyFirm(firm: CompanyFirm): boolean {
  return firm === "mss-site-survey" || firm === "mse-site-survey";
}

export function isFileRatesFirm(firm: CompanyFirm): boolean {
  return firm === "mss-file-rates";
}

export function usesLetterheadChrome(firm: CompanyFirm): boolean {
  return isLetterheadFirm(firm) || isAnnexureFirm(firm) || isSiteSurveyFirm(firm) || isFileRatesFirm(firm);
}

export function isMseFirm(firm: CompanyFirm): boolean {
  return (
    firm === "mahi-solar-energy" ||
    firm === "mse-letterhead" ||
    firm === "mse-empanelment-annexure" ||
    firm === "mse-site-survey"
  );
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

export const SITE_SURVEY_TERMS = [
  "This form is filled during the site engineer’s visit after quotation approval. It records final measurements and layout for installation planning.",
  "Panel make, inverter, wiring, structure sizes, cable lengths and equipment positions decided and signed on this form are final for installation and override the approved quotation wherever they differ. A revised quotation may be issued if material or cost changes require it.",
  "By signing, the client confirms the physical quotation copy presented on site and agrees the structure sizes, cable lengths (approx.), equipment positions and cable paths recorded on this form.",
  "Cable lengths are approximate site estimates. Actual length used may vary based on final routing; material beyond the agreed scope may be charged extra.",
  "After this form is signed, any change in structure height/placement, inverter or DB position, or cable path requested by the client is treated as extra work and may incur re-work charges and/or a revised quotation.",
  "Site readiness (safe roof access, shadow-free area, load-bearing capacity, electricity for tools) remains the client’s responsibility. Installation start still depends on the agreed payment schedule.",
  "This survey does not by itself start material dispatch or installation. Work proceeds only as per the quotation payment terms and company schedule.",
  "Photos, sketches or mark-ups attached or drawn on this sheet form part of the agreed site record.",
] as const;

/** Current MSS Deal-with-MSS / fixed file rates (circular effective 31 Oct 2026). */
export const DEFAULT_MSS_FILE_RATE_ROWS = [
  { capacity: "3 kW", phase: "1 Phase", price: "160000" },
  { capacity: "4 kW", phase: "1 Phase", price: "190000" },
  { capacity: "5 kW", phase: "1 Phase", price: "240000" },
  { capacity: "5 kW", phase: "3 Phase", price: "250000" },
  { capacity: "6 kW", phase: "1 Phase", price: "290000" },
  { capacity: "6 kW", phase: "3 Phase", price: "300000" },
  { capacity: "7 kW", phase: "3 Phase", price: "330000" },
  { capacity: "8 kW", phase: "3 Phase", price: "370000" },
  { capacity: "10 kW", phase: "3 Phase", price: "445000" },
] as const;

export function createDefaultFileRates(overrides: Partial<FileRatesNotice> = {}): FileRatesNotice {
  const today = "2026-10-31";
  const { rows: overrideRows, ...rest } = overrides;
  return {
    addresseeName: "Satya Narayan Yadav",
    addresseeDetail: "Deva Baba Ki Dhani, Village Sukhalpura, PO Mundoti, Dist. Jaipur, Rajasthan – 303328",
    subject: "Revised fixed file rates (Deal with MSS) — effective 31 October 2026",
    intro:
      "Dear Satya Narayan Ji,\n\nThis is to confirm that with effect from 31 October 2026, all new files logged by you under the fixed-rate partnership with Mahi Solar Solution Private Limited shall be booked as per the Deal with MSS rates in the table below.",
    closing:
      "These rates apply to your new files enrolled on or after the effective date and supersede earlier fixed file rates for such new enrollments. Files already logged or under execution continue on their existing deal unless otherwise agreed in writing.\n\nThis circular forms part of the commercial record of our fixed-rate arrangement with you. Kindly acknowledge and keep a copy for your records.",
    effectiveDate: today,
    place: "Jaipur",
    date: today,
    signatoryName: "Mahendra Kumawat",
    signatoryTitle: "Director",
    ...rest,
    rows: (overrideRows ?? DEFAULT_MSS_FILE_RATE_ROWS.map((row) => ({ ...row }))).map((row) => ({
      capacity: row.capacity ?? "",
      phase: row.phase ?? "",
      price: row.price ?? "",
    })),
  };
}

export function createDefaultSiteSurvey(overrides: Partial<SiteSurveyForm> = {}): SiteSurveyForm {
  return {
    customerName: "",
    customerPhone: "",
    siteAddress: "",
    capacity: "",
    phase: "",
    surveyDate: new Date().toISOString().slice(0, 10),
    engineerName: "Yogesh Kumar Poonia",
    engineerMobile: "7023351302",
    panelMake: "",
    panelMakeOther: "",
    panelWp: "",
    panelQty: "",
    inverterMake: "",
    inverterMakeOther: "",
    inverterSize: "",
    structureBrand: "",
    legSize: "75×75 for Apollo / 72×72 for Tata",
    legHeight: "",
    legQty: "",
    rafterSize: "60×40",
    rafterLength: "",
    rafterQty: "",
    purlinSize: "40×40",
    purlinLength: "",
    purlinQty: "",
    structureNotes: "",
    acCableMake: "Ramsons",
    acCableSize: "",
    acCableLengthM: "",
    dcCableMake: "Polycab",
    dcCableSize: "4 sq mm",
    dcCableLengthM: "",
    inverterLocation: "",
    acDbLocation: "",
    dcDbLocation: "",
    acCablePath: "",
    earthingCablePath: "",
    earthingPits: "3 copper bound rods",
    roofType: "",
    shadowNotes: "",
    otherNotes: "",
    quotationSignedOnSite: "Yes",
    clientAgreesLayout: "Yes",
    place: "Jaipur",
    date: new Date().toISOString().slice(0, 10),
    clientSignName: "",
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
    siteSurvey: createDefaultSiteSurvey(),
    fileRates: createDefaultFileRates(),
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

  if (firm === "mss-site-survey") {
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
      siteSurvey: createDefaultSiteSurvey(),
    };
  }

  if (firm === "mse-site-survey") {
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
      siteSurvey: createDefaultSiteSurvey(),
    };
  }

  if (firm === "mss-file-rates") {
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
      fileRates: createDefaultFileRates(),
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
  merged.siteSurvey = {
    ...defaults.siteSurvey,
    ...input?.siteSurvey,
  };
  const fileRateDefaults = defaults.fileRates;
  merged.fileRates = {
    ...fileRateDefaults,
    ...input?.fileRates,
    addresseeName: input?.fileRates?.addresseeName ?? fileRateDefaults.addresseeName,
    addresseeDetail: input?.fileRates?.addresseeDetail ?? fileRateDefaults.addresseeDetail,
    rows:
      input?.fileRates?.rows && input.fileRates.rows.length > 0
        ? input.fileRates.rows.map((row) => ({
            capacity: row.capacity ?? "",
            phase: row.phase ?? "",
            price: row.price ?? "",
          }))
        : fileRateDefaults.rows.map((row) => ({ ...row })),
  };
  return merged;
}
