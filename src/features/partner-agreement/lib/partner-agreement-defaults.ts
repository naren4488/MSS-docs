import type {
  PartnerAgreementData,
  PartnerAgreementLanguage,
  PartnerClause,
  PartnerClauseSubPoint,
  PartnerCompany,
  PartnerDealType,
  PartnerRateCard,
  PartnerSection,
  PartnerVariableField,
} from "../types/partner-agreement";
import { MSE_LOGO_URL } from "@/features/company-profile/lib/company-profile-defaults";

export const PARTNER_TEMPLATES: { id: PartnerDealType; label: string; description: string }[] = [
  {
    id: "fixed-rate",
    label: "Fixed-Rate Partnership",
    description:
      "Partner brings projects; MSE accepts each project on a fixed-rate basis and completes on-site execution work — procurement, transport, installation and commissioning (3kW–10kW). Partner keeps the surplus realised from the customer as margin.",
  },
  {
    id: "profit-share",
    label: "Profit-Share Partnership",
    description:
      "Partner brings projects; MSE accepts each project on a profit-sharing basis and completes on-site execution work — procurement, transport, installation and commissioning. The net profit of each completed project is shared between the Parties in an agreed ratio.",
  },
];

const PARTNER_DEAL_IDS: PartnerDealType[] = ["fixed-rate", "profit-share"];

export function isPartnerDealType(value: string | null): value is PartnerDealType {
  return value !== null && (PARTNER_DEAL_IDS as string[]).includes(value);
}

export function getPartnerTemplateLabel(dealType: PartnerDealType): string {
  return PARTNER_TEMPLATES.find((item) => item.id === dealType)?.label ?? "Partnership Agreement";
}

function uuid() {
  return crypto.randomUUID();
}

function clause(input: {
  number: string;
  title?: string;
  content: string;
  subPoints?: { label: string; text: string }[];
}): PartnerClause {
  return {
    id: uuid(),
    number: input.number,
    title: input.title ?? "",
    content: input.content,
    subPoints: (input.subPoints ?? []).map<PartnerClauseSubPoint>((point) => ({
      id: uuid(),
      label: point.label,
      text: point.text,
    })),
  };
}

function section(heading: string, clauses: PartnerClause[], intro = ""): PartnerSection {
  return {
    id: uuid(),
    heading,
    intro,
    clauses,
  };
}

function defaultCompany(): PartnerCompany {
  return {
    name: "MAHI SOLAR ENERGY",
    logoUrl: MSE_LOGO_URL,
    address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
    phone: "+91 9928413501",
    email: "mahisolarenergy77@gmail.com",
    website: "",
    cin: "",
    gst: "08GPEPK1479A1ZZ",
    representativeName: "Mahendra Kumawat",
    representativeTitle: "Proprietor",
  };
}

const today = new Date().toISOString().slice(0, 10);

// ---------- Default fixed-rate schedule ----------

function defaultRateCards(): PartnerRateCard[] {
  return [
    { id: uuid(), capacity: "3 kW", phase: "1 Phase", price: "170000" },
    { id: uuid(), capacity: "4 kW", phase: "1 Phase", price: "200000" },
    { id: uuid(), capacity: "5 kW", phase: "1 Phase", price: "250000" },
    { id: uuid(), capacity: "5 kW", phase: "3 Phase", price: "265000" },
    { id: uuid(), capacity: "6 kW", phase: "1 Phase", price: "300000" },
    { id: uuid(), capacity: "6 kW", phase: "3 Phase", price: "315000" },
    { id: uuid(), capacity: "7 kW", phase: "3 Phase", price: "340000" },
    { id: uuid(), capacity: "8 kW", phase: "3 Phase", price: "385000" },
    { id: uuid(), capacity: "10 kW", phase: "3 Phase", price: "455000" },
  ];
}

// =====================================================================
// Variable fields
// =====================================================================

const baseVariableFields: PartnerVariableField[] = [
  { key: "region", label: "Operating Region / Territory", helper: "e.g. Jaipur Discom (JVVNL) area, Rajasthan" },
  { key: "scheme", label: "Scheme Name", helper: "e.g. PM Surya Ghar: Muft Bijli Yojana" },
  { key: "discom", label: "DISCOM", helper: "e.g. JVVNL" },
  { key: "oAndMYears", label: "Operation & Maintenance Tenure (years)" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const profitShareVariableFields: PartnerVariableField[] = [
  ...baseVariableFields,
  { key: "mssShare", label: "MSE Profit Share", helper: "e.g. 50%" },
  { key: "partnerShare", label: "Partner Profit Share", helper: "e.g. 50%" },
  {
    key: "profitBasis",
    label: "Definition of Net Profit",
    helper: "How profit is computed for each project",
    multiline: true,
  },
];

const baseVariableDefaults: Record<string, string> = {
  region: "Jaipur Discom (JVVNL) area, Rajasthan",
  scheme: "PM Surya Ghar: Muft Bijli Yojana",
  discom: "JVVNL",
  oAndMYears: "5",
  arbitrationVenue: "Jaipur",
};

const profitShareVariableDefaults: Record<string, string> = {
  ...baseVariableDefaults,
  mssShare: "50%",
  partnerShare: "50%",
  profitBasis:
    "the amount remaining from the total amount realised for the project after deducting all material, installation, DISCOM / net-metering, scheme facilitation, applicable taxes and other direct project costs",
};

// =====================================================================
// English content
// =====================================================================

const introTemplateEn =
  'THIS PARTNERSHIP AGREEMENT (the "Agreement") is made as of {{effectiveDateFormatted}} (the "Effective Date") by and between {{company.name}}, having its principal place of business at {{company.address}} ("MSE").\n\nAnd {{party.entityName}} ("Partner"), having its principal place of business at {{party.address}}.';

const preambleEn =
  "NOW, THEREFORE, in consideration of the mutual promises set forth below, {{company.name}} and the Partner agree as follows:";

function recitalsEn(dealType: PartnerDealType): string[] {
  const common = [
    "{{company.name}} is a firm engaged in on-site execution work for rooftop solar projects, including material procurement, transport, installation and commissioning.",
    "The Partner is engaged in sourcing solar rooftop customers, sites and projects and wishes to assign such projects to {{company.name}} on either a fixed-rate or profit-sharing basis, with MSE completing the agreed on-site execution work comprising material procurement, transport, installation and commissioning.",
  ];
  const dealRecital =
    dealType === "fixed-rate"
      ? "The Parties wish to record a fixed-rate commercial arrangement under which {{company.name}} executes the Partner's Projects at the agreed per-system rates set out herein, the Partner retaining the surplus realised from the customer as its margin."
      : "The Parties wish to record a profit-sharing commercial arrangement under which {{company.name}} executes the Partner's Projects and the net profit of each completed Project is shared between the Parties in the agreed ratio.";
  return [...common, dealRecital];
}

function createPartnerSectionsEn(): PartnerSection[] {
  return [
    section("Scope of Partnership", [
      clause({
        number: "1",
        content:
          'Under this Agreement, the Partner shall source, refer and bring solar rooftop projects, sites and customers (each a "Project") to {{company.name}} ("MSE"), and MSE shall accept each such Project on the fixed-rate or profit-sharing basis recorded in this Agreement and complete the agreed execution work comprising material procurement, transport, installation and commissioning.',
        subPoints: [
          {
            label: "a",
            text:
              "The Partner shall introduce genuine, ready Projects together with the customer's complete documentation, site details and consent required for execution and for application under {{var.scheme}}.",
          },
          {
            label: "b",
            text:
              "MSE shall complete the on-site execution work for each Project, comprising material procurement, transport, installation and commissioning.",
          },
          {
            label: "c",
            text:
              "This arrangement is on a non-exclusive basis. Nothing in this Agreement constitutes either Party the agent, employee or legal partner of the other, save for the specific commercial sharing recorded herein.",
          },
          {
            label: "d",
            text:
              "The commercial basis of this Agreement — whether on a fixed-rate basis or a profit-sharing basis — is recorded in the Commercial Terms section below, and the Partner's entitlement shall be calculated and released strictly in accordance with those terms and the payment-flow provisions of this Agreement.",
          },
        ],
      }),
    ]),
    section("Responsibilities of {{company.name}}", [
      clause({
        number: "2",
        content: "MSE shall, in respect of each Project accepted under this Agreement:",
        subPoints: [
          {
            label: "a",
            text:
              "carry out material procurement, transport, installation and commissioning in accordance with manufacturer guidelines and recognised rooftop solar installation standards;",
          },
          { label: "b", text: "provide reasonable telephonic and on-ground support for execution of the Project; and" },
          {
            label: "c",
            text:
              "maintain proper records of each Project and account to the Partner for the Partner's entitlement in accordance with the Commercial Terms of this Agreement.",
          },
        ],
      }),
    ]),
    section("Responsibilities of the Partner", [
      clause({
        number: "3",
        content: "The Partner shall, in respect of each Project:",
        subPoints: [
          {
            label: "a",
            text: "bring genuine Projects and provide true and complete customer, site and ownership information on which MSE may rely;",
          },
          {
            label: "b",
            text:
              "obtain and hand over to MSE all customer documentation, site access and approvals required for MSE to carry out procurement, transport and installation;",
          },
          {
            label: "c",
            text:
              "handle bank / loan coordination, National Portal and scheme submissions, DISCOM and net-metering applications, and subsidy facilitation for each Project;",
          },
          {
            label: "d",
            text:
              "since the customer is the Partner's customer, own and manage the customer relationship, including coordination for site readiness and customer cooperation;",
          },
          {
            label: "e",
            text:
              "collect the customer's cash component (where applicable) and hand it over to MSE strictly in accordance with the payment-flow provisions below; and",
          },
          {
            label: "f",
            text:
              "not assign the execution of any Project brought to MSE under this Agreement to any other execution firm without MSE's consent, and not circumvent MSE in respect of any such Project.",
          },
        ],
      }),
    ]),
    section("Payment Flow & Fund Handling", [
      clause({
        number: "4",
        content:
          "The Parties acknowledge that customers under {{var.scheme}} pay through one of three modes — (i) a bank loan, (ii) cash, or (iii) a combination of cash and loan. The handling of Project funds and the release of the Partner's entitlement shall follow the customer's chosen mode of payment as set out below:",
        subPoints: [
          {
            label: "a",
            text:
              "Loan files: Where a Project is financed by a bank loan, the loan amount is disbursed by the lender directly into MSE's bank account, typically in two and at times in three installments. MSE shall utilise such loan installments, as and when received, to carry out procurement and installation of the Project. Because the first installment is usually insufficient to meet the full cost of material, installation and execution, MSE shall fund the additional amount required over and above the installment(s) received out of its own resources to carry the Project forward, and shall recover the same from the subsequent installment(s) and the final payment as and when received from the lender. The Partner's entitlement in respect of such Project shall be released by MSE only after the Project is fully executed, net metering is completed, and the final installment / last payment has been received.",
          },
          {
            label: "b",
            text:
              "Cash files and Cash + Loan files: Where the customer pays wholly or partly in cash, the loan component (if any) shall be handled as in (a) above, and the Partner's entitlement and any final balance shall likewise be released only after net metering and receipt of the last payment. However, because the customer is the Partner's customer, collection of the cash component shall be done by the Partner directly from the customer, and the Partner shall hand over such cash amount to MSE before procurement of material for the site begins. Where the funds received at any stage fall short of the cost of executing the Project, MSE shall bridge the shortfall out of its own resources as described in (a) above.",
          },
          {
            label: "c",
            text:
              "Rationale: The Parties agree to the above because, unlike the loan installments which flow automatically from the bank after installation and over which neither Party has discretion, the cash component is within the Partner's control to collect. Accordingly, to ensure that procurement and execution of the Project are not delayed or funded by MSE on the Partner's behalf, the Partner shall provide the cash component upfront, before material procurement for that site commences.",
          },
          {
            label: "d",
            text:
              "MSE shall not be obliged to commence procurement of material for a Project until the cash component (where applicable) has been received from the Partner. Subject to MSE's funding of any working-capital shortfall described above, the Partner's entitlement / share shall be released only out of, and to the extent of, funds actually received from the lender and / or the customer, and only after the last payment for the Project has been received.",
          },
          {
            label: "e",
            text:
              "Working capital — all three modes: In each of the three payment modes above (loan, cash, and cash + loan), where the funds actually received at any stage are insufficient to meet the cost of material, installation and execution, MSE shall bridge such shortfall out of its own resources so that execution of the Project is not delayed, and shall recover the same from the subsequent installment(s) and / or the final payment.",
          },
          {
            label: "f",
            text:
              "Non-GST Partners — margin payment: Where the Partner does not hold a valid GST registration or has not provided a GST number under this Agreement, the Partner shall not retain margin or profit share for later settlement through invoicing. Instead, before MSE commences procurement of material for a Project, the Partner shall pay the estimated margin (on a fixed-rate basis) or estimated profit share (on a profit-sharing basis) to MSE, calculated from the expected customer price and the applicable rate or share under this Agreement. Upon project completion, net metering and receipt of all customer payments, MSE shall reconcile the actual margin or share due and refund any excess paid by the Partner or collect any shortfall. MSE shall not commence procurement for a Project until such estimated amount has been received from a Partner who does not have GST.",
          },
        ],
      }),
    ]),
    section("Quality, Warranty & Operation and Maintenance", [
      clause({
        number: "5",
        content:
          "MSE shall carry out installation and commissioning work as per manufacturer guidelines and recognised rooftop solar installation standards. Responsibility for operation and maintenance and for back-to-back workmanship warranty in respect of each Project shall be borne for not less than {{var.oAndMYears}} years from commissioning. The Parties shall cooperate in good faith to resolve any customer complaint or punch point in a timely manner so as not to affect either Party's reputation or customer ratings.",
      }),
    ]),
    section("Confidentiality & Non-Circumvention", [
      clause({
        number: "6",
        content:
          "Each Party shall keep confidential all customer data, pricing, portal credentials and business information disclosed by the other in connection with this Agreement, and shall not use it except for performance of this Agreement. Neither Party shall circumvent the other in respect of any Project, customer or opportunity introduced under this Agreement, whether during the term or for a reasonable period thereafter.",
      }),
    ]),
    section("Term & Termination", [
      clause({
        number: "7",
        content: "The term and termination of this Agreement shall be governed as follows:",
        subPoints: [
          {
            label: "a",
            text:
              "Term: This Agreement is effective from the Effective Date and continues in force until terminated in accordance with this clause.",
          },
          {
            label: "b",
            text:
              "Termination for convenience: Either Party may terminate this Agreement for convenience by giving thirty (30) days' prior written notice to the other.",
          },
          {
            label: "c",
            text:
              'Termination for cause: MSE may terminate this Agreement immediately and without notice ("For Cause") upon fraud, misrepresentation, misuse of MSE\'s name or reputation, or any action by the Partner that brings MSE\'s reputation or business standing into disrepute.',
          },
          {
            label: "d",
            text:
              "Survival & effects: Termination shall not affect Projects already in execution, the Partner's entitlement already accrued, or obligations relating to operation & maintenance, back-to-back warranty, confidentiality and customer service for Projects already executed, all of which shall survive. Any amount payable to the Partner on termination is subject to MSE's right of set-off against losses and claims under this Agreement.",
          },
        ],
      }),
    ]),
  ];
}

function dealHeadingEn(dealType: PartnerDealType): string {
  return dealType === "fixed-rate"
    ? "Commercial Terms — Fixed Rate Schedule"
    : "Commercial Terms — Profit Share Arrangement";
}

function dealIntroEn(dealType: PartnerDealType): string {
  return dealType === "fixed-rate"
    ? "For each Project accepted under this Agreement on a fixed-rate basis, MSE shall charge and retain the fixed per-system rate set out in the schedule below for completing the agreed execution work (material procurement, transport, installation and commissioning). The amount realised from the customer over and above the applicable rate shall belong to the Partner as the Partner's margin, released in accordance with the payment-flow provisions of this Agreement. The applicable rate depends on the system capacity and phase:"
    : 'For each Project executed under this Agreement on a profit-sharing basis, the net profit of the Project shall be computed upon completion of the Project and shared between the Parties. "Net profit" means {{var.profitBasis}}. The net profit so computed shall be shared in the ratio of {{var.mssShare}} to MSE and {{var.partnerShare}} to the Partner. The Partner\'s share shall be released in accordance with the payment-flow provisions of this Agreement, that is, after net metering and receipt of the final payment for the Project.';
}

const rateNoteEn =
  "All rates are in Indian Rupees and represent MSE's charge for end-to-end execution of a system of the stated capacity and phase. Any change in scheme benefit, material cost or system configuration may require the Parties to revise this schedule by mutual written agreement.";

const governingLawEn =
  "In case any dispute arises in respect of the validity, interpretation, implementation or alleged breach of this Agreement, the Parties shall first attempt to resolve the same through negotiation. Failing resolution, either Party may refer the dispute to arbitration by a sole arbitrator in accordance with the Arbitration and Conciliation Act, 1996 or any amendment thereto, whose decision shall be binding on the Parties. The place of arbitration shall be {{var.arbitrationVenue}}. Each Party shall bear its own cost of arbitration.";

const closingEn =
  "By signing below, the Parties agree that this Agreement constitutes the entire understanding between them in respect of the Projects covered hereby and may be modified only by a written instrument signed by an authorised representative of both Parties.";

// =====================================================================
// Hindi content
// =====================================================================

const introTemplateHi =
  'यह साझेदारी समझौता ("समझौता") {{effectiveDateFormatted}} ("प्रभावी तिथि") को {{company.name}} ("MSE"), जिसका मुख्य कार्यस्थल {{company.address}} पर है, एवं {{party.entityName}} ("साझेदार"), जिसका मुख्य कार्यस्थल {{party.address}} पर है, के मध्य निष्पादित किया गया है।';

const preambleHi =
  "अतः, यहाँ उल्लिखित पारस्परिक वचनों के प्रतिफल में, {{company.name}} एवं साझेदार निम्नलिखित शर्तों पर सहमत होते हैं:";

function recitalsHi(dealType: PartnerDealType): string[] {
  const common = [
    "{{company.name}} सौर रूफटॉप परियोजनाओं के स्थल-स्तरीय निष्पादन कार्य में संलग्न एक फर्म है, जिसमें सामग्री खरीद, परिवहन, स्थापना एवं कमीशनिंग सम्मिलित है।",
    "साझेदार सौर रूफटॉप ग्राहकों, साइटों एवं परियोजनाओं को जुटाने के कार्य में संलग्न है तथा ऐसी परियोजनाएँ निश्चित-दर अथवा लाभ-साझाकरण आधार पर {{company.name}} को सौंपना चाहता है, जिसमें MSE सहमत स्थल-स्तरीय निष्पादन कार्य — सामग्री खरीद, परिवहन, स्थापना एवं कमीशनिंग — पूर्ण करेगा।",
  ];
  const dealRecital =
    dealType === "fixed-rate"
      ? "पक्षकार एक निश्चित-दर वाणिज्यिक व्यवस्था अभिलिखित करना चाहते हैं, जिसके अंतर्गत {{company.name}} साझेदार की परियोजनाओं को यहाँ निर्धारित प्रति-संयंत्र दरों पर निष्पादित करेगा, तथा साझेदार ग्राहक से प्राप्त अधिशेष राशि को अपने लाभ-अंतर के रूप में रखेगा।"
      : "पक्षकार एक लाभ-साझाकरण वाणिज्यिक व्यवस्था अभिलिखित करना चाहते हैं, जिसके अंतर्गत {{company.name}} साझेदार की परियोजनाओं को निष्पादित करेगा तथा प्रत्येक पूर्ण परियोजना का शुद्ध लाभ सहमत अनुपात में पक्षकारों के मध्य साझा किया जाएगा।";
  return [...common, dealRecital];
}

function createPartnerSectionsHi(): PartnerSection[] {
  return [
    section("साझेदारी का विस्तार", [
      clause({
        number: "1",
        content:
          'इस समझौते के अंतर्गत, साझेदार सौर रूफटॉप परियोजनाएँ, साइटें एवं ग्राहक (प्रत्येक एक "परियोजना") {{company.name}} ("MSE") को जुटाकर, संदर्भित करके एवं लाकर देगा, तथा MSE प्रत्येक ऐसी परियोजना को इस समझौते में अभिलिखित निश्चित-दर अथवा लाभ-साझाकरण आधार पर स्वीकार करेगा एवं सामग्री खरीद, परिवहन, स्थापना एवं कमीशनिंग से मिलकर बने सहमत निष्पादन कार्य को पूर्ण करेगा।',
        subPoints: [
          {
            label: "क",
            text:
              "साझेदार वास्तविक, तैयार परियोजनाएँ, ग्राहक के संपूर्ण दस्तावेज़, साइट विवरण एवं {{var.scheme}} के अंतर्गत निष्पादन तथा आवेदन हेतु आवश्यक सहमति सहित प्रस्तुत करेगा।",
          },
          {
            label: "ख",
            text:
              "MSE प्रत्येक परियोजना हेतु स्थल-स्तरीय निष्पादन कार्य — सामग्री खरीद, परिवहन, स्थापना एवं कमीशनिंग — पूर्ण करेगा।",
          },
          {
            label: "ग",
            text:
              "यह व्यवस्था गैर-अनन्य आधार पर है। इस समझौते में अभिलिखित विशिष्ट वाणिज्यिक साझाकरण के अतिरिक्त, इस समझौते का कोई भी अंश किसी पक्ष को दूसरे का एजेंट, कर्मचारी अथवा विधिक साझेदार नहीं बनाता।",
          },
          {
            label: "घ",
            text:
              "इस समझौते का वाणिज्यिक आधार — चाहे निश्चित-दर आधार पर हो अथवा लाभ-साझाकरण आधार पर — नीचे दिए गए वाणिज्यिक शर्तें खंड में अभिलिखित है, तथा साझेदार की हकदारी की गणना एवं निर्गमन कठोरतापूर्वक उन शर्तों एवं इस समझौते के भुगतान-प्रवाह प्रावधानों के अनुसार किया जाएगा।",
          },
        ],
      }),
    ]),
    section("{{company.name}} के दायित्व", [
      clause({
        number: "2",
        content: "MSE इस समझौते के अंतर्गत स्वीकृत प्रत्येक परियोजना के संबंध में:",
        subPoints: [
          {
            label: "क",
            text:
              "निर्माता दिशानिर्देशों एवं मान्यता प्राप्त सौर रूफटॉप स्थापना मानकों के अनुसार सामग्री खरीद, परिवहन, स्थापना एवं कमीशनिंग करेगा;",
          },
          { label: "ख", text: "परियोजना के निष्पादन हेतु उचित दूरभाष एवं स्थल-स्तरीय सहायता प्रदान करेगा; तथा" },
          {
            label: "ग",
            text:
              "प्रत्येक परियोजना का समुचित अभिलेख रखेगा तथा इस समझौते की वाणिज्यिक शर्तों के अनुसार साझेदार की हकदारी का हिसाब साझेदार को देगा।",
          },
        ],
      }),
    ]),
    section("साझेदार के दायित्व", [
      clause({
        number: "3",
        content: "साझेदार प्रत्येक परियोजना के संबंध में:",
        subPoints: [
          {
            label: "क",
            text: "वास्तविक परियोजनाएँ लाएगा तथा ग्राहक, साइट एवं स्वामित्व की सत्य एवं संपूर्ण जानकारी प्रदान करेगा जिस पर MSE निर्भर रह सके;",
          },
          {
            label: "ख",
            text:
              "MSE द्वारा सामग्री खरीद, परिवहन एवं स्थापना हेतु आवश्यक समस्त ग्राहक दस्तावेज़, साइट पहुँच एवं अनुमोदन प्राप्त करके MSE को सौंपेगा;",
          },
          {
            label: "ग",
            text:
              "प्रत्येक परियोजना हेतु बैंक / ऋण समन्वय, राष्ट्रीय पोर्टल एवं योजना प्रस्तुतियाँ, DISCOM एवं नेट-मीटरिंग आवेदन, तथा सब्सिडी सुविधा का प्रबंधन करेगा;",
          },
          {
            label: "घ",
            text:
              "चूँकि ग्राहक साझेदार का ग्राहक है, अतः ग्राहक संबंध का स्वामित्व एवं प्रबंधन करेगा, जिसमें साइट की तैयारी एवं ग्राहक सहयोग हेतु समन्वय सम्मिलित है;",
          },
          {
            label: "ङ",
            text:
              "ग्राहक का नकद घटक (जहाँ लागू हो) एकत्रित करेगा तथा नीचे दिए गए भुगतान-प्रवाह प्रावधानों के अनुसार कठोरतापूर्वक MSE को सौंपेगा; तथा",
          },
          {
            label: "च",
            text:
              "इस समझौते के अंतर्गत MSE को लाई गई किसी परियोजना का निष्पादन MSE की सहमति के बिना किसी अन्य निष्पादन फर्म को नहीं सौंपेगा, तथा ऐसी किसी परियोजना के संबंध में MSE को दरकिनार नहीं करेगा।",
          },
        ],
      }),
    ]),
    section("भुगतान प्रवाह एवं निधि प्रबंधन", [
      clause({
        number: "4",
        content:
          "पक्षकार स्वीकार करते हैं कि {{var.scheme}} के अंतर्गत ग्राहक तीन में से किसी एक विधि से भुगतान करते हैं — (i) बैंक ऋण, (ii) नकद, अथवा (iii) नकद एवं ऋण का संयोजन। परियोजना निधियों का प्रबंधन एवं साझेदार की हकदारी का निर्गमन ग्राहक द्वारा चयनित भुगतान विधि के अनुसार निम्नानुसार होगा:",
        subPoints: [
          {
            label: "क",
            text:
              "ऋण फाइलें: जहाँ कोई परियोजना बैंक ऋण द्वारा वित्तपोषित है, वहाँ ऋण राशि ऋणदाता द्वारा सीधे MSE के बैंक खाते में, सामान्यतः दो तथा कभी-कभी तीन किस्तों में, संवितरित की जाती है। MSE ऐसी ऋण किस्तों का, जैसे-जैसे प्राप्त हों, उपयोग परियोजना की खरीद एवं स्थापना हेतु करेगा। चूँकि पहली किस्त सामान्यतः सामग्री, स्थापना एवं निष्पादन की संपूर्ण लागत हेतु पर्याप्त नहीं होती, अतः MSE किसी भी चरण पर प्राप्त किस्त(किस्तों) से अधिक आवश्यक अतिरिक्त राशि अपने संसाधनों से लगाकर परियोजना को आगे बढ़ाएगा, तथा बाद की किस्त(किस्तों) एवं अंतिम भुगतान से, जैसे-जैसे ऋणदाता से प्राप्त हों, उसकी वसूली करेगा। ऐसी परियोजना के संबंध में साझेदार की हकदारी MSE द्वारा केवल तभी निर्गत की जाएगी जब परियोजना पूर्णतः निष्पादित हो जाए, नेट मीटरिंग पूर्ण हो जाए, तथा अंतिम किस्त / अंतिम भुगतान प्राप्त हो जाए।",
          },
          {
            label: "ख",
            text:
              "नकद फाइलें एवं नकद + ऋण फाइलें: जहाँ ग्राहक पूर्णतः अथवा आंशिक रूप से नकद भुगतान करता है, वहाँ ऋण घटक (यदि कोई हो) उपरोक्त (क) के अनुसार संभाला जाएगा, तथा साझेदार की हकदारी एवं कोई अंतिम शेष राशि भी केवल नेट मीटरिंग एवं अंतिम भुगतान प्राप्ति के पश्चात् ही निर्गत की जाएगी। तथापि, चूँकि ग्राहक साझेदार का ग्राहक है, अतः नकद घटक का संग्रहण साझेदार द्वारा सीधे ग्राहक से किया जाएगा, तथा साझेदार ऐसी नकद राशि साइट हेतु सामग्री की खरीद आरंभ होने से पूर्व MSE को सौंप देगा। जहाँ किसी भी चरण पर प्राप्त राशि परियोजना के निष्पादन की लागत से कम हो, वहाँ MSE उपरोक्त (क) के अनुसार ऐसी कमी की पूर्ति अपने संसाधनों से करेगा।",
          },
          {
            label: "ग",
            text:
              "औचित्य: पक्षकार उपरोक्त पर इसलिए सहमत हैं क्योंकि, ऋण किस्तों के विपरीत जो स्थापना के पश्चात् बैंक से स्वतः प्रवाहित होती हैं एवं जिन पर किसी पक्ष का विवेकाधिकार नहीं है, नकद घटक साझेदार के नियंत्रण में होता है। तदनुसार, यह सुनिश्चित करने हेतु कि परियोजना की खरीद एवं निष्पादन में विलंब न हो अथवा MSE द्वारा साझेदार की ओर से वित्तपोषण न करना पड़े, साझेदार नकद घटक उस साइट हेतु सामग्री खरीद आरंभ होने से पूर्व अग्रिम रूप से प्रदान करेगा।",
          },
          {
            label: "घ",
            text:
              "MSE किसी परियोजना हेतु तब तक सामग्री की खरीद आरंभ करने हेतु बाध्य नहीं होगा जब तक नकद घटक (जहाँ लागू हो) साझेदार से प्राप्त न हो जाए। उपरोक्त कार्यशील पूँजी व्यवस्था के अधीन, साझेदार की हकदारी / हिस्सा केवल ऋणदाता एवं/अथवा ग्राहक से वास्तव में प्राप्त राशि में से एवं उसकी सीमा तक, तथा परियोजना का अंतिम भुगतान प्राप्त होने के पश्चात् ही निर्गत किया जाएगा।",
          },
          {
            label: "ङ",
            text:
              "तीनों भुगतान विधियों हेतु कार्यशील पूँजी: उपरोक्त तीनों भुगतान विधियों (ऋण, नकद, तथा नकद + ऋण) में, जहाँ किसी भी चरण पर वास्तव में प्राप्त राशि सामग्री, स्थापना एवं निष्पादन की लागत हेतु अपर्याप्त हो, वहाँ MSE ऐसी कमी को अपने संसाधनों से पूरा करेगा ताकि परियोजना के निष्पादन में विलंब न हो, तथा बाद की किस्त(किस्तों) एवं/अथवा अंतिम भुगतान से उसकी वसूली करेगा।",
          },
          {
            label: "च",
            text:
              "गैर-GST साझेदार — लाभ-अंतर भुगतान: जहाँ साझेदार के पास वैध GST पंजीकरण नहीं है अथवा इस समझौते के अंतर्गत GST संख्या प्रदान नहीं की गई है, वहाँ साझेदार लाभ-अंतर अथवा लाभ हिस्से को बाद में चालान के माध्यम से निपटाने हेतु नहीं रखेगा। इसके स्थान पर, MSE द्वारा किसी परियोजना हेतु सामग्री की खरीद आरंभ करने से पूर्व, साझेदार अनुमानित लाभ-अंतर (निश्चित-दर आधार पर) अथवा अनुमानित लाभ हिस्सा (लाभ-साझाकरण आधार पर) MSE को भुगतान करेगा, जिसकी गणना अपेक्षित ग्राहक मूल्य तथा इस समझौते के अंतर्गत लागू दर अथवा हिस्से से की जाएगी। परियोजना पूर्ण होने, नेट मीटरिंग तथा ग्राहक से समस्त भुगतान प्राप्त होने के पश्चात्, MSE वास्तविक देय लाभ-अंतर अथवा हिस्से की समानता करेगा तथा साझेदार द्वारा अधिक भुगतान की गई राशि वापस करेगा अथवा कमी वसूल करेगा। GST रहित साझेदार के लिए MSE तब तक सामग्री की खरीद आरंभ नहीं करेगा जब तक ऐसी अनुमानित राशि प्राप्त न हो जाए।",
          },
        ],
      }),
    ]),
    section("गुणवत्ता, वारंटी एवं संचालन व रखरखाव", [
      clause({
        number: "5",
        content:
          "MSE स्थापना एवं कमीशनिंग कार्य निर्माता दिशानिर्देशों एवं मान्यता प्राप्त सौर रूफटॉप स्थापना मानकों के अनुसार करेगा। प्रत्येक परियोजना के संबंध में संचालन व रखरखाव तथा बैक-टू-बैक कारीगरी वारंटी का दायित्व कमीशनिंग से कम से कम {{var.oAndMYears}} वर्षों तक वहन किया जाएगा। पक्षकार किसी ग्राहक शिकायत अथवा पंच पॉइंट का समयबद्ध निवारण सद्भावनापूर्वक करने हेतु सहयोग करेंगे ताकि किसी भी पक्ष की प्रतिष्ठा अथवा ग्राहक रेटिंग प्रभावित न हो।",
      }),
    ]),
    section("गोपनीयता एवं गैर-दरकिनारी", [
      clause({
        number: "6",
        content:
          "प्रत्येक पक्ष इस समझौते के संबंध में दूसरे द्वारा प्रकट की गई समस्त ग्राहक जानकारी, मूल्य निर्धारण, पोर्टल क्रेडेंशियल एवं व्यावसायिक जानकारी को गोपनीय रखेगा, तथा इस समझौते के निष्पादन के अतिरिक्त उसका उपयोग नहीं करेगा। कोई भी पक्ष इस समझौते के अंतर्गत प्रस्तुत किसी परियोजना, ग्राहक अथवा अवसर के संबंध में दूसरे को दरकिनार नहीं करेगा, चाहे अवधि के दौरान हो अथवा उसके पश्चात् उचित अवधि तक।",
      }),
    ]),
    section("अवधि एवं समाप्ति", [
      clause({
        number: "7",
        content: "इस समझौते की अवधि एवं समाप्ति निम्नानुसार शासित होगी:",
        subPoints: [
          {
            label: "क",
            text: "अवधि: यह समझौता प्रभावी तिथि से लागू होगा एवं इस खंड के अनुसार समाप्त होने तक प्रवृत्त रहेगा।",
          },
          {
            label: "ख",
            text:
              "सुविधा हेतु समाप्ति: कोई भी पक्ष दूसरे को तीस (30) दिनों की पूर्व लिखित सूचना देकर सुविधा के अनुसार इस समझौते को समाप्त कर सकता है।",
          },
          {
            label: "ग",
            text:
              'वजह सहित समाप्ति: MSE धोखाधड़ी, मिथ्या-कथन, MSE के नाम अथवा प्रतिष्ठा के दुरुपयोग, अथवा साझेदार द्वारा ऐसे किसी कार्य पर जिससे MSE की प्रतिष्ठा अथवा व्यावसायिक स्थिति प्रभावित हो, इस समझौते को बिना सूचना के तत्काल समाप्त कर सकता है ("वजह सहित")।',
          },
          {
            label: "घ",
            text:
              "उत्तरजीविता एवं प्रभाव: समाप्ति से पहले से निष्पादनाधीन परियोजनाएँ, पहले से अर्जित साझेदार की हकदारी, अथवा पहले से निष्पादित परियोजनाओं के संबंध में संचालन व रखरखाव, बैक-टू-बैक वारंटी, गोपनीयता एवं ग्राहक सेवा से संबंधित दायित्व प्रभावित नहीं होंगे, जो सभी प्रवृत्त रहेंगे। समाप्ति पर साझेदार को देय कोई भी राशि इस समझौते के अंतर्गत हानियों एवं दावों के विरुद्ध MSE के समायोजन के अधिकार के अधीन होगी।",
          },
        ],
      }),
    ]),
  ];
}

function dealHeadingHi(dealType: PartnerDealType): string {
  return dealType === "fixed-rate"
    ? "वाणिज्यिक शर्तें — निश्चित दर अनुसूची"
    : "वाणिज्यिक शर्तें — लाभ साझाकरण व्यवस्था";
}

function dealIntroHi(dealType: PartnerDealType): string {
  return dealType === "fixed-rate"
    ? "इस समझौते के अंतर्गत निश्चित-दर आधार पर स्वीकृत प्रत्येक परियोजना हेतु, MSE सहमत निष्पादन कार्य (सामग्री खरीद, परिवहन, स्थापना एवं कमीशनिंग) पूर्ण करने हेतु नीचे दी गई अनुसूची में निर्धारित निश्चित प्रति-संयंत्र दर वसूल करेगा एवं रखेगा। लागू दर से अधिक ग्राहक से प्राप्त राशि साझेदार के लाभ-अंतर के रूप में साझेदार की होगी, जो इस समझौते के भुगतान-प्रवाह प्रावधानों के अनुसार निर्गत की जाएगी। लागू दर संयंत्र की क्षमता एवं फेज़ पर निर्भर करती है:"
    : 'इस समझौते के अंतर्गत लाभ-साझाकरण आधार पर निष्पादित प्रत्येक परियोजना हेतु, परियोजना का शुद्ध लाभ परियोजना के पूर्ण होने पर परिकलित किया जाएगा एवं पक्षकारों के मध्य साझा किया जाएगा। "शुद्ध लाभ" से तात्पर्य {{var.profitBasis}} से है। इस प्रकार परिकलित शुद्ध लाभ {{var.mssShare}} MSE को एवं {{var.partnerShare}} साझेदार को के अनुपात में साझा किया जाएगा। साझेदार का हिस्सा इस समझौते के भुगतान-प्रवाह प्रावधानों के अनुसार, अर्थात् नेट मीटरिंग एवं परियोजना के अंतिम भुगतान की प्राप्ति के पश्चात्, निर्गत किया जाएगा।';
}

const rateNoteHi =
  "समस्त दरें भारतीय रुपये में हैं तथा निर्धारित क्षमता एवं फेज़ के संयंत्र के संपूर्ण निष्पादन हेतु MSE के शुल्क को दर्शाती हैं। योजना लाभ, सामग्री लागत अथवा संयंत्र विन्यास में किसी परिवर्तन पर पक्षकारों को इस अनुसूची को पारस्परिक लिखित सहमति से संशोधित करना पड़ सकता है।";

const governingLawHi =
  "इस समझौते की वैधता, व्याख्या, क्रियान्वयन अथवा कथित उल्लंघन के संबंध में कोई विवाद उत्पन्न होने पर, पक्षकार प्रथमतः उसका समाधान विचार-विमर्श से करने का प्रयास करेंगे। समाधान न होने पर, कोई भी पक्ष विवाद को एकमात्र मध्यस्थ द्वारा माध्यस्थम् हेतु संदर्भित कर सकता है, जो माध्यस्थम् एवं सुलह अधिनियम, 1996 अथवा उसके किसी संशोधन के अनुरूप होगा, तथा मध्यस्थ का निर्णय पक्षकारों पर बाध्यकारी होगा। माध्यस्थम् का स्थान {{var.arbitrationVenue}} होगा। प्रत्येक पक्ष माध्यस्थम् का अपना व्यय स्वयं वहन करेगा।";

const closingHi =
  "नीचे हस्ताक्षर करके, पक्षकार सहमत होते हैं कि यह समझौता इसमें सम्मिलित परियोजनाओं के संबंध में उनके मध्य संपूर्ण समझ है तथा इसे केवल दोनों पक्षकारों के प्राधिकृत प्रतिनिधि द्वारा हस्ताक्षरित लिखित लिखत द्वारा ही संशोधित किया जा सकता है।";

const titleEn: Record<PartnerDealType, string> = {
  "fixed-rate": "PARTNERSHIP AGREEMENT — FIXED RATE BASIS",
  "profit-share": "PARTNERSHIP AGREEMENT — PROFIT SHARE BASIS",
};

const titleHi: Record<PartnerDealType, string> = {
  "fixed-rate": "साझेदारी समझौता — निश्चित दर आधार",
  "profit-share": "साझेदारी समझौता — लाभ साझाकरण आधार",
};

// =====================================================================
// Builders
// =====================================================================

export const HINDI_SUPPORTED_DEALS: PartnerDealType[] = ["fixed-rate", "profit-share"];

export function isHindiSupported(_dealType: PartnerDealType): boolean {
  return true;
}

export function createDefaultPartnerAgreementData(
  dealType: PartnerDealType = "fixed-rate",
  language: PartnerAgreementLanguage = "en",
): PartnerAgreementData {
  const isHindi = language === "hi";
  const isProfitShare = dealType === "profit-share";

  return {
    dealType,
    language: isHindi ? "hi" : "en",
    title: isHindi ? titleHi[dealType] : titleEn[dealType],
    effectiveDate: today,
    company: defaultCompany(),
    party: {
      entityName: "",
      partyLabel: isHindi ? "साझेदार" : "Partner",
      address: "",
      representativeName: "",
      representativeTitle: "",
      consumerNumber: "",
      discom: "",
      aadhaar: "",
      gst: "",
    },
    variableFields: isProfitShare ? profitShareVariableFields : baseVariableFields,
    variables: { ...(isProfitShare ? profitShareVariableDefaults : baseVariableDefaults) },
    introTemplate: isHindi ? introTemplateHi : introTemplateEn,
    recitals: isHindi ? recitalsHi(dealType) : recitalsEn(dealType),
    preambleAfterRecitals: isHindi ? preambleHi : preambleEn,
    sections: isHindi ? createPartnerSectionsHi() : createPartnerSectionsEn(),
    dealHeading: isHindi ? dealHeadingHi(dealType) : dealHeadingEn(dealType),
    dealIntro: isHindi ? dealIntroHi(dealType) : dealIntroEn(dealType),
    rateCards: isProfitShare ? [] : defaultRateCards(),
    rateNote: isProfitShare ? "" : isHindi ? rateNoteHi : rateNoteEn,
    closingParagraph: isHindi ? closingHi : closingEn,
    governingLawParagraph: isHindi ? governingLawHi : governingLawEn,
    partyIsIndividual: false,
    showWitnesses: true,
    witnesses: [
      { id: uuid(), name: "" },
      { id: uuid(), name: "" },
    ],
    showPageNumbers: true,
    showLetterhead: true,
  };
}

/**
 * Returns a copy of `data` with all template text replaced by the chosen
 * language's defaults. Preserves user-filled values: company info, party
 * info, variable values, witness names, the rate schedule, effective date,
 * and document flags.
 */
export function switchPartnerAgreementLanguage(
  data: PartnerAgreementData,
  language: PartnerAgreementLanguage,
): PartnerAgreementData {
  const fresh = createDefaultPartnerAgreementData(data.dealType, language);

  return {
    ...fresh,
    effectiveDate: data.effectiveDate,
    company: { ...fresh.company, ...data.company },
    party: { ...fresh.party, ...data.party, partyLabel: fresh.party.partyLabel },
    variables: { ...fresh.variables, ...data.variables },
    rateCards: data.rateCards.length ? data.rateCards : fresh.rateCards,
    witnesses: data.witnesses.length ? data.witnesses : fresh.witnesses,
    partyIsIndividual: data.partyIsIndividual,
    showWitnesses: data.showWitnesses,
    showPageNumbers: data.showPageNumbers,
    showLetterhead: data.showLetterhead,
  };
}

export function normalizePartnerAgreementData(
  input?: Partial<PartnerAgreementData> | null,
): PartnerAgreementData {
  const rawDealType = input?.dealType ?? null;
  const dealType: PartnerDealType = isPartnerDealType(rawDealType) ? rawDealType : "fixed-rate";
  const language: PartnerAgreementLanguage = input?.language === "hi" ? "hi" : "en";
  const defaults = createDefaultPartnerAgreementData(dealType, language);
  const company = { ...defaults.company, ...input?.company };
  if (company.name.trim().toUpperCase() === "MAHI SOLAR ENERGY" && !company.logoUrl.trim()) {
    company.logoUrl = MSE_LOGO_URL;
  }

  return {
    ...defaults,
    ...input,
    dealType,
    language: defaults.language,
    company,
    party: { ...defaults.party, ...input?.party },
    variableFields: input?.variableFields?.length ? input.variableFields : defaults.variableFields,
    variables: { ...defaults.variables, ...input?.variables },
    recitals: input?.recitals ?? defaults.recitals,
    sections: input?.sections ?? defaults.sections,
    rateCards: input?.rateCards ?? defaults.rateCards,
    witnesses: input?.witnesses ?? defaults.witnesses,
  };
}
