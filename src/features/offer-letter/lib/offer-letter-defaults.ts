import type { OfferLetterData, OfferLetterTerm } from "../types/offer-letter";

export type OfferLetterTemplate = "fresh" | "full-time-conversion" | "direct-full-time";

export const OFFER_LETTER_TEMPLATES: { id: OfferLetterTemplate; label: string; description: string }[] = [
  {
    id: "fresh",
    label: "Fresh Employment",
    description: "New hire with a probation period. Probation terms and post-probation salary revision are included.",
  },
  {
    id: "full-time-conversion",
    label: "Full-time Conversion",
    description: "Confirming full-time after probation. No probation clause; includes a salary review schedule.",
  },
  {
    id: "direct-full-time",
    label: "Direct Full-time",
    description: "Hired directly as full-time. No probation clause; includes a salary review schedule.",
  },
];

const today = new Date().toISOString().slice(0, 10);

function createTerm(title: string, content: string): OfferLetterTerm {
  return {
    id: crypto.randomUUID(),
    title,
    content,
  };
}

function parseLegacyResponsibilities(responsibilities?: string) {
  if (!responsibilities?.trim()) {
    return null;
  }

  const lines = responsibilities.split("\n").map((line) => line.trimEnd());
  const bullets = lines.filter((line) => line.startsWith("- ")).map((line) => line.replace(/^- /, ""));
  const paragraphs = lines.filter((line) => line.trim() && !line.match(/^\s*- /));

  return {
    roleOverview: paragraphs[0] ?? "In this role, you will be responsible for:",
    responsibilityPoints: bullets,
  };
}

export function buildLegacyResponsibilities(data: Pick<
  OfferLetterData,
  "roleOverview" | "responsibilityPoints"
>) {
  return [
    data.roleOverview,
    "",
    ...data.responsibilityPoints.map((item) => `- ${item}`),
  ]
    .filter((line, index, arr) => !(line === "" && arr[index - 1] === ""))
    .join("\n");
}

export function normalizeOfferLetterData(input?: Partial<OfferLetterData> | null): OfferLetterData {
  const defaults = createDefaultOfferLetterData();
  const legacy = parseLegacyResponsibilities(input?.responsibilities);
  const legacyInsuranceCoverageValues = new Set([
    "",
    " insurnace upto Rs. 10,000/year",
    "insurance upto Rs. 10,000/year",
    "Insurance upto Rs. 10,000/year",
  ]);
  const legacyInsuranceMinTenureValues = new Set(["", "6 months"]);

  const normalized: OfferLetterData = {
    ...defaults,
    ...input,
    company: {
      ...defaults.company,
      ...input?.company,
    },
    roleOverview: input?.roleOverview ?? legacy?.roleOverview ?? defaults.roleOverview,
    responsibilityPoints: input?.responsibilityPoints ?? legacy?.responsibilityPoints ?? defaults.responsibilityPoints,
  };

  if (legacyInsuranceCoverageValues.has((input?.insuranceCoverage ?? "").trim())) {
    normalized.insuranceCoverage = defaults.insuranceCoverage;
  }

  if (legacyInsuranceMinTenureValues.has((input?.insuranceMinTenure ?? "").trim())) {
    normalized.insuranceMinTenure = defaults.insuranceMinTenure;
  }

  normalized.terms = normalized.terms.map((term) => {
    if (
      term.title === "Probation" &&
      !term.content.includes("salary may be revised and increased based on your performance during the probation phase")
    ) {
      return {
        ...term,
        content: `${term.content}\n- Upon successful completion of the probation period, your salary may be revised and increased based on your performance during the probation phase.`,
      };
    }

    if (term.title === "Employee Insurance Policy") {
      return {
        ...term,
        content:
          "The Company will provide insurance coverage to the employee up to Rs. 10,000 per year.\n\n- The insurance may be provided either as per the employee's choice or as per Company policy.\n- If the employee leaves the Company before completing six (6) months of employment, the insurance premium amount must be reimbursed to the Company by the employee.",
      };
    }

    return term;
  });

  normalized.responsibilities = buildLegacyResponsibilities(normalized);
  return normalized;
}

function createTermsForTemplate(template: OfferLetterTemplate): OfferLetterTerm[] {
  const probationTerm = createTerm(
    "Probation",
    "You will be on probation for an initial period of 2 months from your date of joining.\n\n- The probation period may be extended at the sole discretion of the Company based on performance, attendance, conduct, or business requirements.\n- Your employment will be confirmed only upon written communication from the Company.\n- During probation, your performance and suitability for the role will be reviewed on an ongoing basis.\n- Upon successful completion of the probation period, your salary may be revised and increased based on your performance during the probation phase.",
  );

  const salaryReviewTerm = createTerm(
    "Salary Review",
    "Your compensation will be reviewed periodically based on performance and Company policy.\n\n- After 6 months of continuous service in this role, you may be eligible for a salary increment of up to 10%, subject to performance review.\n- Further revisions, if any, will follow the Company's standard review cycle.\n- Any revision is at the sole discretion of the Company and is not an automatic entitlement.",
  );

  const commonTerms = [
    createTerm(
      "Code of Conduct",
      "You are required to comply with the Company's Code of Conduct and all applicable company policies at all times.\n\n- You must maintain strict professional conduct and ethical standards in all your interactions.\n- The Company has a zero-tolerance policy for any form of workplace harassment, sexual harassment, bullying, discrimination, or any form of child abuse.\n- Any violation of this code may result in disciplinary action, suspension, termination of employment, or legal proceedings as per applicable law.",
    ),
    createTerm(
      "Policy Compliance - POSH Act and POCSO Act",
      "You acknowledge that you have read, understood, and agree to comply with the Company's policies under the Prevention of Sexual Harassment (POSH) Act, 2013, and the Protection of Children from Sexual Offences (POCSO) Act, 2012.\n\n- The Company is committed to providing a safe, respectful, and harassment-free workplace for all employees and children.\n- You are obligated to adhere to all preventive measures, reporting mechanisms, and disciplinary procedures as outlined in the Company's POSH and POCSO policies.\n- Any suspected violation of these acts must be reported immediately to the HR Department or the Internal Complaints Committee (ICC).",
    ),
    createTerm(
      "Zero Tolerance Policy",
      "The Company maintains a strict zero-tolerance policy toward sexual harassment, child abuse, and any violations of children's rights.\n\n- Any employee found guilty of sexual harassment, child abuse, or exploitation will face immediate disciplinary action, including but not limited to suspension, termination of employment, and legal action under applicable laws.\n- The Company will cooperate fully with law enforcement and child protection authorities in investigating such matters.\n- Employees are encouraged to report any suspected misconduct without fear of retaliation.",
    ),
    createTerm(
      "Grievance Redressal Mechanism",
      "The Company provides a robust grievance redressal mechanism for all employees to report any policy violations, misconduct, or concerns.\n\n- Complaints can be reported to:\n  • HR Department: hr@mahisolarsolution.com\n  • Internal Complaints Committee (ICC): icc@mahisolarsolution.com\n  • Grievance Portal: [Internal grievance portal link]\n\n- All complaints will be treated with confidentiality and investigated impartially.\n- You will be updated on the status and outcome of your complaint.\n- The Company assures zero retaliation for good-faith complaints.",
    ),
    createTerm(
      "Notice Period",
      "Either party may terminate employment by giving 1 month prior written notice.\n\n- If you leave without serving the required notice period, the Company may withhold salary or other dues to the extent permitted by law and company policy.\n- Final release and settlement will be subject to proper handover of work, documents, assets, and completion of all exit formalities.",
    ),
    createTerm(
      "Termination of Employment",
      "The Company reserves the right to terminate your employment at any time in accordance with applicable law.\n\n- Termination may occur due to business restructuring, lack of performance, misconduct, violation of company policy, unauthorized absence, or any act prejudicial to the interests of the Company.\n- The Company may decide whether notice, payment in lieu of notice, or immediate separation is appropriate depending on the circumstances.",
    ),
    createTerm(
      "Confidential Information",
      "You shall maintain strict confidentiality regarding all proprietary and confidential information of the Company.\n\n- This includes business plans, pricing, customer data, client lists, bank-related documents, internal processes, vendor information, financial records, and any non-public operational details.\n- This obligation continues during and after your employment.",
    ),
    createTerm(
      "Non-Disclosure Agreement (NDA)",
      "You shall not disclose, copy, circulate, publish, remove, or use any confidential information except for official company purposes.\n\n- You may not use such information for personal gain.\n- You may not share such information with any third party without written permission from the Company.\n- All documents, files, and records created or handled during your employment remain the property of the Company.",
    ),
    createTerm(
      "Conflict of Interest",
      "You are expected to avoid any situation that creates a conflict between your personal interests and the interests of the Company.\n\n- You must promptly disclose any existing or potential conflict of interest to management.\n- You may not engage in any activity, relationship, or arrangement that compromises your ability to perform your duties honestly and in the best interests of the Company.",
    ),
    createTerm(
      "Non-Competition",
      "During your employment, you shall not directly or indirectly engage in any business or assignment that competes with the Company.\n\n- You may not work for, advise, or support any competing entity without written approval.\n- You may not solicit the Company's clients, vendors, or employees for any competing purpose while employed with the Company.",
    ),
    createTerm(
      "Workplace Safety and Liability Disclaimer",
      "You acknowledge that certain duties may involve field visits, travel, site coordination, document handling, and physical movement in operational areas.\n\n- You agree to follow safety instructions, use due care, and immediately report unsafe conditions.\n- The Company shall not be liable for injury, loss, or damage arising from your negligence, willful misconduct, or failure to follow safety protocols, subject to applicable law.",
    ),
    createTerm(
      "Employee Insurance Policy",
      "The Company will provide insurance coverage to the employee up to Rs. 10,000 per year.\n\n- The insurance may be provided either as per the employee's choice or as per Company policy.\n- If the employee leaves the Company before completing six (6) months of employment, the insurance premium amount must be reimbursed to the Company by the employee.",
    ),
    createTerm(
      "Employee Undertaking",
      "By accepting this offer and signing this Offer Letter, you hereby undertake and confirm that:\n\n- You have read, understood, and agree to comply with all the terms, conditions, and policies mentioned in this Offer Letter.\n- You are aware of and commit to adhering to the Company's Code of Conduct, workplace safety policies, and anti-harassment policies.\n- You acknowledge the Company's zero-tolerance policy toward sexual harassment, child abuse, and any form of misconduct.\n- You will comply with applicable laws including the POSH Act, 2013, and POCSO Act, 2012.\n- You understand the grievance redressal mechanism and will utilize it appropriately if needed.\n- You will maintain confidentiality of all proprietary and confidential information of the Company.\n- You agree to abide by all policies, procedures, and standards set by the Company from time to time.\n- You certify that all information provided in your application and during the hiring process is true and accurate.\n\nThis undertaking is binding and enforceable against you during and after your employment with the Company.",
    ),
  ];

  if (template === "fresh") {
    return [probationTerm, ...commonTerms];
  }

  return [salaryReviewTerm, ...commonTerms];
}

export function createDefaultOfferLetterData(template: OfferLetterTemplate = "fresh"): OfferLetterData {
  return {
    company: {
      name: "Mahi Solar Solution Private Limited",
      logoUrl: "/assets/mss-logo.png",
      address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
      phone: "+91 9928413501",
      email: "mahisolarsolution@gmail.com",
      website: "mahisolarsolution.com",
      cin: "",
      gst: "08AAUCM4104G1ZD",
      founderName: "Mahendra Kumawat",
      founderTitle: "Director",
    },
    employeeName: "Yogesh Poonia",
    employeeAddress: "Sikar, Rajasthan",
    role: "Site Supervisor",
    dateOfJoining: '1 May, 2026',
    location: "Jaipur, Rajasthan",
    monthlySalary: 18000,
    reportingTo: "Mahendra Kumawat (Director)",
    offerValidityDays: 15,
    roleOverview: "In this role, you will be responsible for:",
    responsibilityPoints: [
      "Monitoring and supervising solar installation sites to ensure work is progressing as per schedule and quality standards",
      "Coordinating with project managers, engineers, and site teams to facilitate smooth operations and timely completion of projects",
      "Ensuring compliance with safety protocols and company policies at all times",
      "Maintaining accurate documentation related to site activities, progress reports, and any incidents or issues that arise",
      "Assisting in procurement and inventory management of materials required for site operations",
      "Facilitating communication between on-site teams and management to address any challenges or requirements promptly",
      "Conducting regular site visits to monitor work quality, identify potential issues, and ensure adherence to project specifications",
      "Providing support in coordinating with clients, vendors, and other stakeholders as needed to ensure successful project execution",

    ],
    leavePolicy: [
      "1 paid leave per month",
      "1 holiday on Amavasya / Sunday per month",
      "1 Fun Day every month (Games / Team activity day / Entertainmnent day / etc.)",
      "Major festival holidays as per company calendar",
      "Fun days and holidays are at the sole discretion of the Company and may be changed at any time. The Company may provide additional bonus or compensation in case of holiday or fun day cancellation, at its discretion.",
    ],
    otherBenefits: [
      "Gifts on Diwali",
      "Travel, rent, and food expenses covered for out-of-city site assignments",
      "Bonus on one-year completion, including salary-based bonus and performance bonus",
    ],
    insuranceCoverage:
      "The Company will provide insurance coverage to the employee up to Rs. 10,000 per year, either as per the employee's choice or as per Company policy.",
    insuranceMinTenure:
      "If the employee leaves the Company before completing six (6) months of employment, the insurance premium amount must be reimbursed to the Company by the employee.",
    terms: createTermsForTemplate(template),
    showAcceptance: true,
    showSeal: false,
    showSignature: false,
    sealUrl: "",
    signatureUrl: "",
    signatoryName: "Mahendra Kumawat",
    showPageNumbers: true,
  };
}
