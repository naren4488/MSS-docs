import { MSS_LOGO_URL } from "@/features/company-profile/lib/company-profile-defaults";
import type { OfferLetterData, OfferLetterTerm, OfferLetterTemplate } from "../types/offer-letter";

export const OFFER_LETTER_TEMPLATES: { id: OfferLetterTemplate; label: string; description: string }[] = [
  {
    id: "direct-full-time",
    label: "Direct Full-time",
    description: "Hired directly as full-time. No probation clause; includes a salary review schedule.",
  },
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
];

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
  const defaults = createDefaultOfferLetterData(input?.templateId ?? "direct-full-time");
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
    templateId: input?.templateId ?? defaults.templateId,
    company: {
      ...defaults.company,
      ...input?.company,
    },
    issuanceDate: input?.issuanceDate ?? defaults.issuanceDate,
    employmentType: input?.employmentType ?? defaults.employmentType,
    workingHours: input?.workingHours ?? defaults.workingHours,
    salaryNotes: input?.salaryNotes ?? defaults.salaryNotes,
    roleOverview: input?.roleOverview ?? legacy?.roleOverview ?? defaults.roleOverview,
    responsibilityPoints: input?.responsibilityPoints ?? legacy?.responsibilityPoints ?? defaults.responsibilityPoints,
  };

  if (legacyInsuranceCoverageValues.has((input?.insuranceCoverage ?? "").trim())) {
    normalized.insuranceCoverage = defaults.insuranceCoverage;
  }

  if (legacyInsuranceMinTenureValues.has((input?.insuranceMinTenure ?? "").trim())) {
    normalized.insuranceMinTenure = defaults.insuranceMinTenure;
  }

  // Drop legacy duplicate insurance term if still present on older drafts.
  normalized.terms = (normalized.terms ?? defaults.terms).filter(
    (term) => term.title !== "Employee Insurance Policy",
  );

  normalized.responsibilities = buildLegacyResponsibilities(normalized);
  return normalized;
}

function createTermsForTemplate(template: OfferLetterTemplate): OfferLetterTerm[] {
  const probationTerm = createTerm(
    "Probation",
    "You will be on probation for an initial period of 2 months from your date of joining.\n\n- The probation period may be extended at the sole discretion of the Company based on performance, attendance, conduct, or business requirements.\n- Your employment will be confirmed only upon written communication from the Company.\n- During probation, your performance and suitability for the role will be reviewed on an ongoing basis.\n- Upon successful completion of the probation period, your salary may be revised and increased based on your performance during the probation phase.",
  );

  const compensationReviewTerm = createTerm(
    "Compensation Review",
    "Your compensation will be reviewed periodically based on performance and Company policy.\n\n- After 6 months of continuous service in this role, you may be eligible for a salary increment of up to 10%, subject to performance review.\n- Further revisions, if any, will follow the Company's standard review cycle.\n- Any revision is at the sole discretion of the Company and is not an automatic entitlement.",
  );

  const commonTerms = [
    createTerm(
      "Conduct, POSH & Workplace Respect",
      "You are required to comply with the Company's Code of Conduct and all applicable workplace policies at all times.\n\n- You must maintain professional conduct and ethical standards in all interactions.\n- The Company has a zero-tolerance policy toward workplace harassment, sexual harassment, bullying, discrimination, or any form of child abuse.\n- You acknowledge and agree to comply with the Company's policies under the Prevention of Sexual Harassment (POSH) Act, 2013.\n- Any suspected violation must be reported promptly to the HR Department or the Internal Complaints Committee (ICC).\n- Violation may result in disciplinary action, including suspension, termination, and/or legal proceedings as permitted by law.",
    ),
    createTerm(
      "Grievance Redressal",
      "The Company provides a grievance redressal mechanism for reporting policy violations, misconduct, or workplace concerns.\n\n- Complaints may be reported to the HR Department or to management at the contact details stated in this letter.\n- Complaints will be treated with confidentiality and investigated impartially, to the extent practicable.\n- The Company assures zero retaliation for good-faith complaints.",
    ),
    createTerm(
      "Working Hours",
      "Unless otherwise communicated in writing, the standard working arrangement is as follows:\n\n- Six (6) working days per week.\n- Regular working hours: 9:00 AM to 5:00 PM.\n- Site requirements, travel, or operational needs may require reasonable variation, with prior communication from management where practicable.",
    ),
    createTerm(
      "Notice Period",
      "Either party may terminate employment by giving one (1) month prior written notice, or payment in lieu of notice, as applicable.\n\n- If you leave without serving the required notice period, the Company may recover amounts to the extent permitted by applicable law and Company policy.\n- Final release and settlement will be subject to proper handover of work, documents, and Company assets, and completion of exit formalities.",
    ),
    createTerm(
      "Termination of Employment",
      "The Company may terminate employment in accordance with applicable law and Company policy.\n\n- Grounds may include lack of performance, misconduct, violation of Company policy, unauthorized absence, or any act prejudicial to the interests of the Company.\n- Depending on the circumstances, the Company may provide notice, payment in lieu of notice, or immediate separation where permitted by law.",
    ),
    createTerm(
      "Confidentiality & Non-Disclosure",
      "You shall maintain strict confidentiality regarding all proprietary and confidential information of the Company.\n\n- This includes business plans, pricing, customer data, client lists, bank-related documents, internal processes, vendor information, financial records, and any non-public operational details.\n- You shall not disclose, copy, circulate, publish, remove, or use such information except for official Company purposes, or share it with any third party without written permission from the Company.\n- You may not use such information for personal gain.\n- This obligation continues during and after your employment.\n- All documents, files, and records created or handled during employment remain the property of the Company.",
    ),
    createTerm(
      "Intellectual Property & Work Product",
      "All work product created by you in the course of employment belongs to the Company.\n\n- This includes documents, designs, drawings, photographs, site reports, customer data, process improvements, software, presentations, and any other materials created for Company work.\n- You assign to the Company all rights, title, and interest in such work product to the extent permitted by law.\n- Upon separation, you shall return all Company property and materials and shall not retain copies except where required by law.",
    ),
    createTerm(
      "Conflict of Interest & Dual Employment",
      "You are expected to avoid any situation that creates a conflict between your personal interests and the interests of the Company.\n\n- You must promptly disclose any existing or potential conflict of interest to management.\n- During employment, you shall not engage in any other employment, consultancy, business, or paid assignment without prior written approval from the Company.\n- You may not engage in any activity that compromises your ability to perform your duties honestly and in the best interests of the Company.",
    ),
    createTerm(
      "Non-Competition During Employment",
      "During your employment, you shall not directly or indirectly engage in any business or assignment that competes with the Company.\n\n- You may not work for, advise, or support any competing entity without written approval.\n- You may not solicit the Company's clients, vendors, or employees for any competing purpose while employed with the Company.",
    ),
    createTerm(
      "Workplace Safety",
      "Certain duties may involve field visits, travel, site coordination, document handling, and physical movement in operational areas.\n\n- You agree to follow safety instructions, use due care, and immediately report unsafe conditions.\n- The Company will provide reasonable safety guidance and expect compliance with site and operational safety protocols.\n- Nothing in this letter limits either party's rights or obligations under applicable law relating to workplace safety or compensation.",
    ),
    createTerm(
      "Document Preconditions",
      "This offer and your joining are subject to satisfactory completion of pre-employment formalities, including submission of documents as requested by the Company.\n\n- Typically required: identity proof, address proof, PAN, bank account details, educational / experience certificates (if applicable), and passport-size photographs.\n- The Company may also conduct reference or background checks as it considers appropriate.\n- If any information provided by you is found to be false or misleading, the Company may withdraw this offer or terminate employment.",
    ),
    createTerm(
      "Company Policies",
      "This Offer Letter, together with applicable Company policies and procedures as updated from time to time, forms the basis of your employment.\n\n- You agree to abide by all policies, procedures, and standards set by the Company.\n- In case of conflict between a summary in this letter and a detailed Company policy, the Company policy will prevail unless otherwise stated in writing.",
    ),
    createTerm(
      "Governing Law & Jurisdiction",
      "This Offer Letter shall be governed by the laws of India.\n\n- Subject to applicable law, courts at Jaipur, Rajasthan shall have jurisdiction over disputes arising out of or in connection with this offer and employment.",
    ),
  ];

  if (template === "fresh") {
    return [probationTerm, compensationReviewTerm, ...commonTerms];
  }

  if (template === "direct-full-time") {
    return [
      createTerm(
        "Nature of Employment",
        "You are appointed as a confirmed full-time employee with effect from your date of joining.\n\n- No probation period applies under this offer, unless otherwise agreed in writing.\n- This is regular full-time employment and is not a consultancy, contract-labour, or internship engagement.",
      ),
      compensationReviewTerm,
      ...commonTerms,
    ];
  }

  // full-time-conversion
  return [
    createTerm(
      "Nature of Employment",
      "This letter confirms your appointment as a full-time employee with effect from the date stated herein.\n\n- Any prior probation arrangement stands completed / superseded as applicable.\n- This is regular full-time employment going forward.",
      ),
      compensationReviewTerm,
      ...commonTerms,
    ];
}

export function createDefaultOfferLetterData(template: OfferLetterTemplate = "direct-full-time"): OfferLetterData {
  const today = new Date().toISOString().slice(0, 10);

  return {
    templateId: template,
    company: {
      name: "Mahi Solar Solution Private Limited",
      logoUrl: MSS_LOGO_URL,
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
    issuanceDate: today,
    dateOfJoining: "2026-05-01",
    employmentType:
      template === "direct-full-time"
        ? "Full-time confirmed employment (no probation)"
        : template === "full-time-conversion"
          ? "Full-time confirmed employment"
          : "Full-time employment (with probation)",
    location: "Jaipur, Rajasthan",
    monthlySalary: 18000,
    salaryNotes: [
      "Monthly salary stated above is the fixed monthly amount payable for this role.",
      "Applicable Tax Deducted at Source (TDS) will be deducted as per Income Tax laws, if applicable.",
      "Salary will be paid monthly to the employee's bank account as per the Company's payroll cycle.",
    ],
    workingHours: "6 working days a week · Regular hours 9:00 AM to 5:00 PM",
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
      "1 paid leave per month, as per Company leave policy.",
      "1 holiday per month on Amavasya or Sunday, as scheduled by the Company.",
      "Optional Fun Day / team activity day each month — at Company discretion, this may be observed as a leave day or as an entertainment / team activity day.",
      "Major festival holidays as per the Company holiday calendar.",
      "Leave, Fun Days, and holidays are at the sole discretion of the Company and may be changed with notice. Where a Fun Day or holiday is cancelled, the Company may provide alternate leave or other compensation at its discretion.",
    ],
    otherBenefits: [
      "Festival / Diwali gifts, at the sole discretion of the Company.",
      "Travel, lodging, and food expenses for approved out-of-city site assignments — payable only with prior approval and against bills / as per Company norms.",
      "Discretionary bonus on completion of one year of continuous service. Any such bonus (including salary-linked or performance-linked components) is not guaranteed and depends on performance, attendance, and Company policy.",
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
