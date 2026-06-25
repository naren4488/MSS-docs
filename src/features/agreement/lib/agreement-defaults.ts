import type {
  AgreementClause,
  AgreementClauseSubPoint,
  AgreementCompany,
  AgreementData,
  AgreementLanguage,
  AgreementSection,
  AgreementTemplate,
  AgreementVariableField,
} from "../types/agreement";

export const AGREEMENT_TEMPLATES: { id: AgreementTemplate; label: string; description: string }[] = [
  {
    id: "partnership",
    label: "Vendor Code Authorisation Agreement",
    description:
      "Authorise a regional partner to operate under your National Portal vendor code. Covers scope, payment flow by customer payment mode, confidentiality and termination.",
  },
  {
    id: "inc-installation-assign",
    label: "INC Project — Installation Assignment",
    description:
      "Assign INC / subsidy installation work to a third-party installer. Covers scope, safety responsibility, materials, payments and conduct.",
  },
  {
    id: "inc-goodwill-execution",
    label: "INC Project — Goodwill Execution Letter",
    description:
      "Goodwill commitment to execute a beneficiary's INC project with agreed scope, materials where needed, and beneficiary cooperation.",
  },
];

const AGREEMENT_TEMPLATE_IDS: AgreementTemplate[] = [
  "partnership",
  "inc-installation-assign",
  "inc-goodwill-execution",
];

export function isAgreementTemplate(value: string | null): value is AgreementTemplate {
  return value !== null && (AGREEMENT_TEMPLATE_IDS as string[]).includes(value);
}

export function getAgreementTemplateLabel(template: AgreementTemplate): string {
  return AGREEMENT_TEMPLATES.find((item) => item.id === template)?.label ?? "Agreement";
}

function uuid() {
  return crypto.randomUUID();
}

function clause(input: {
  number: string;
  title?: string;
  content: string;
  subPoints?: { label: string; text: string }[];
}): AgreementClause {
  return {
    id: uuid(),
    number: input.number,
    title: input.title ?? "",
    content: input.content,
    subPoints: (input.subPoints ?? []).map<AgreementClauseSubPoint>((point) => ({
      id: uuid(),
      label: point.label,
      text: point.text,
    })),
  };
}

function section(heading: string, clauses: AgreementClause[], intro = ""): AgreementSection {
  return {
    id: uuid(),
    heading,
    intro,
    clauses,
  };
}

function defaultCompany(): AgreementCompany {
  return {
    name: "Mahi Solar Solution Private Limited",
    logoUrl: "/assets/mss-logo.png",
    address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
    phone: "+91 9928413501",
    email: "mahisolarsolution@gmail.com",
    website: "",
    cin: "",
    gst: "08AAUCM4104G1ZD",
    representativeName: "Mahendra Kumawat",
    representativeTitle: "Director",
  };
}

const today = new Date().toISOString().slice(0, 10);

// ---------- Partnership template ----------

const partnershipVariableFields: AgreementVariableField[] = [
  { key: "region", label: "Operating Region / Territory", helper: "e.g. Jaipur Discom (JVVNL) area, Rajasthan" },
  { key: "scheme", label: "Scheme Name", helper: "e.g. PM Surya Ghar: Muft Bijli Yojana" },
  { key: "discom", label: "DISCOM", helper: "e.g. JVVNL" },
  { key: "oAndMYears", label: "Operation & Maintenance Tenure (years)" },
  { key: "commissionMonths", label: "Commission Survival Period (months)", helper: "e.g. 12" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const partnershipVariableDefaults: Record<string, string> = {
  region: "Jaipur Discom (JVVNL) area, Rajasthan",
  scheme: "PM Surya Ghar: Muft Bijli Yojana",
  discom: "JVVNL",
  oAndMYears: "5",
  commissionMonths: "12",
  arbitrationVenue: "Jaipur",
};

function createPartnershipSections(): AgreementSection[] {
  return [
    section("Scope of Engagement", [
      clause({
        number: "1",
        content:
          "{{company.name}} is an empanelled vendor on the National Portal for Solar Rooftop for installing solar rooftop power plants on residential property and registered group housing societies under {{var.scheme}}. {{company.name}} is eligible to provide its services in the entire state under this scheme.",
        subPoints: [
          {
            label: "a",
            text: "Authorised Firm agrees to execute the services related to {{var.scheme}} in the region of {{var.region}} under the name of {{company.name}} for the same.",
          },
          { label: "b", text: "{{company.name}} and Authorised Firm shall perform the following during the term of this Agreement:" },
          {
            label: "c",
            text:
              "Authorised Firm is responsible for order finalization, material procurement, and execution of the installation process along with the work related to DISCOM and Net Metering.",
          },
          {
            label: "d",
            text:
              "Authorised Firm shall ensure the quality of products and installation as per the norms mentioned by the National Portal for Solar Rooftop.",
          },
          {
            label: "e",
            text:
              "Responsibility for operation and maintenance of such projects is solely of the Authorised Firm for at least {{var.oAndMYears}} years.",
          },
          {
            label: "f",
            text:
              "Authorised Firm shall provide the complete details of finalized customers to {{company.name}} representatives for applying for subsidy and for regular feedback on the performance of the plant installed.",
          },
          {
            label: "g",
            text:
              "Authorised Firm will provide the complete details of the plant including product specifications, data sheets, serial numbers, site coordinates, IDs, passwords and any other information required from time to time.",
          },
          {
            label: "h",
            text:
              "Authorised Firm is responsible for collection of all payments from the customer. {{company.name}} shall in no circumstances be responsible for any amount due from the customer.",
          },
          {
            label: "i",
            text:
              "Payment collection and release shall depend on the customer's chosen mode of payment under {{var.scheme}}: (a) where the customer pays in cash, Authorised Firm may collect such cash directly from the customer and use it to commence and execute the project, provided that Authorised Firm intimates {{company.name}} of each such cash transaction promptly with supporting details; (b) where the customer pays through a bank loan, the loan amount shall be disbursed by the lender directly into {{company.name}}'s bank account, typically in two and at times in three installments. {{company.name}} shall release funds to Authorised Firm from such loan proceeds only to the extent actually received from the bank, and after deducting the mutually agreed charges for facilitating the scheme. {{company.name}} shall not be obliged to advance any amount that has not yet been received from the lender; (c) where the customer pays through a combination of cash and loan, the cash component shall be handled as in (a) and the loan component as in (b). Any final balance retained by {{company.name}} shall be released upon successful execution of the project along with net metering.",
          },
          { label: "j", text: "{{company.name}} will provide telephonic support for both sales and execution of the project." },
          {
            label: "k",
            text:
              "{{company.name}} will upload all the required details of the project on the National Portal from time to time for the process of disbursement of the subsidy directly into the bank account of the customer.",
          },
          {
            label: "l",
            text:
              "{{company.name}} may visit and verify any project of a customer executed under this Agreement at any suitable time, with or without prior information to Authorised Firm.",
          },
          {
            label: "m",
            text:
              "Authorised Firm shall ensure that customer service rendered under this Agreement is genuine and that no negative ratings, complaints or punch points arise from customers. Any complaints or punch points raised by a customer shall be resolved by Authorised Firm at Authorised Firm's own cost within a reasonable time. If Authorised Firm fails to resolve them, {{company.name}} may undertake such resolution and recover the cost from Authorised Firm in accordance with {{company.name}}'s prevailing terms.",
          },
        ],
      }),
    ]),
    section("Use of Vendor Code", [
      clause({
        number: "2",
        title: "Authorisation, Use & Misuse of Vendor Code",
        content:
          "{{company.name}} hereby authorises Authorised Firm, on a non-exclusive basis, to undertake services under {{var.scheme}} using {{company.name}}'s vendorship / empanelment on the National Portal for Solar Rooftop (\"Vendor Code\"), subject to the following:",
        subPoints: [
          {
            label: "a",
            text:
              "Authorised Firm's use of the Vendor Code is limited to executing projects under {{var.scheme}} in {{var.region}} on behalf of {{company.name}}, including portal entries, DISCOM submissions and customer correspondence properly attributable to {{company.name}}.",
          },
          {
            label: "b",
            text:
              "Authorised Firm shall represent itself to customers, DISCOMs and third parties truthfully as an authorised firm operating under {{company.name}}'s empanelment, and shall not present itself as {{company.name}} or as an officer, director, employee or branch of {{company.name}}.",
          },
          {
            label: "c",
            text:
              "Authorised Firm shall not (i) issue invoices, contracts, letters or formal communications on {{company.name}}'s letterhead or in {{company.name}}'s name without prior written authorisation from {{company.name}}; (ii) share, sub-license or onward-pass {{company.name}}'s portal credentials, scheme login details or empanelment documents to any third party; (iii) hold itself out as having authority to bind {{company.name}} in any matter beyond the scope of work expressly assigned under this Agreement; (iv) bid for, enrol with or operate under any other vendor's empanelment or vendor code in {{var.region}} during the term of this Agreement without {{company.name}}'s prior written consent; or (v) take any action that may bring {{company.name}}'s name, empanelment, reputation or scheme standing into disrepute.",
          },
          {
            label: "d",
            text:
              "{{company.name}} retains the right to (i) monitor and audit Authorised Firm's use of the Vendor Code at any time; (ii) reject or withdraw any portal entry or DISCOM submission made by Authorised Firm that does not meet scheme requirements; and (iii) suspend Authorised Firm's authorisation to use the Vendor Code with immediate effect upon any suspected misuse, pending investigation.",
          },
          {
            label: "e",
            text:
              "The authorisation to use the Vendor Code shall terminate automatically upon expiry or termination of this Agreement, and Authorised Firm shall thereafter cease all use of {{company.name}}'s name, brand, Vendor Code, empanelment and credentials in any new project, customer pitch or third-party communication.",
          },
        ],
      }),
    ]),
    section("Compliance & Conduct", [
      clause({
        number: "3",
        title: "Safety, Insurance & Subcontracting",
        content: "Authorised Firm shall ensure compliance with the following obligations in connection with all projects under this Agreement:",
        subPoints: [
          {
            label: "a",
            text:
              "Authorised Firm is solely responsible for installer and worker safety, site safety, and compliance with applicable statutory and electrical safety norms at all installation sites. {{company.name}} shall not be liable for safety failures attributable to Authorised Firm or its personnel.",
          },
          {
            label: "b",
            text:
              "Authorised Firm shall maintain adequate workmen's compensation, third-party liability, or other insurance as applicable to its operations, where required by law or prudent business practice.",
          },
          {
            label: "c",
            text:
              "Authorised Firm shall not subcontract any work assigned under this Agreement without {{company.name}}'s prior written consent.",
          },
          {
            label: "d",
            text:
              "Authorised Firm shall not offer or accept improper inducements in connection with subsidy, DISCOM, or National Portal processes, and shall conduct business with integrity and in good faith.",
          },
        ],
      }),
    ]),
    section("General Terms", [
      clause({
        number: "4",
        title: "Independent Contractor & Limitation of Liability",
        content:
          "Authorised Firm agrees that Authorised Firm is an independent contractor, not {{company.name}}'s partner, agent or employee. Authorised Firm shall bear its own expenses in connection with this Agreement without any reimbursement by {{company.name}}. Authorised Firm understands and agrees that this arrangement is on a non-exclusive basis and that {{company.name}} may engage other parties to assist in its sales efforts with respect to the Services or any other services, as and wherever it desires.\n\nIN NO EVENT SHALL {{company.name}} BE LIABLE TO AUTHORISED FIRM, CUSTOMERS OR TO ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING, BUT NOT LIMITED TO, ANY DAMAGES FOR LOST PROFITS, LOST SAVINGS, INTERRUPTION OF BUSINESS, LOSS OF TECHNOLOGY OR LOST DATA, HOWEVER ARISING, WHETHER UNDER THEORIES OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, EVEN IF {{company.name}} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. {{company.name}}'S TOTAL CUMULATIVE LIABILITY UNDER THIS AGREEMENT SHALL BE LIMITED IN THE AGGREGATE TO THE TOTAL AMOUNT OF COMMISSIONS PAID TO {{company.name}} BY AUTHORISED FIRM AGAINST THE PARTICULAR CUSTOMER.",
      }),
      clause({
        number: "5",
        title: "Indemnification, Back-to-Back Warranty & Subsidy Clawback",
        content:
          "Authorised Firm's liabilities and warranties to {{company.name}} under this Agreement include the following:",
        subPoints: [
          {
            label: "a",
            text:
              "Indemnification: Authorised Firm shall indemnify, defend and hold harmless {{company.name}}, its directors, officers, employees and representatives from and against any and all losses, damages, claims, fines, penalties, costs and expenses (including legal fees) arising out of or in connection with (i) any negligence, wilful misconduct, fraud or non-compliance with applicable law or scheme rules by Authorised Firm, its personnel or sub-contractors; (ii) any misuse or unauthorised use of {{company.name}}'s Vendor Code, name, brand, empanelment or credentials by Authorised Firm; (iii) any deficiency in installation, materials, workmanship or operation & maintenance of any project executed by Authorised Firm, including any consequent customer claim or warranty obligation borne by {{company.name}}; and (iv) any third-party claim, regulatory action, or DISCOM / government penalty attributable to Authorised Firm's acts or omissions.",
          },
          {
            label: "b",
            text:
              "Back-to-Back Warranty: Authorised Firm warrants to {{company.name}} that every project executed under this Agreement shall conform to the technical specifications, workmanship standards and performance guarantees applicable to {{company.name}} under the National Portal, {{var.scheme}} and applicable DISCOM norms. This warranty shall remain in force for the entire period during which {{company.name}} continues to be liable to the customer and/or any government authority under the scheme, and in any event for not less than {{var.oAndMYears}} years from commissioning. Any rectification, replacement, performance shortfall remediation or warranty obligation borne by {{company.name}} as a result of a defect in a project executed by Authorised Firm shall be promptly remedied by Authorised Firm at its own cost; failing which {{company.name}} may undertake such remediation and recover the full cost from Authorised Firm.",
          },
          {
            label: "c",
            text:
              "Subsidy Clawback: If any subsidy, incentive, grant or scheme benefit disbursed in respect of a project executed by Authorised Firm is, at any time, denied, reduced, clawed back, withheld or returned by any government authority, DISCOM or scheme administrator on grounds attributable to Authorised Firm (including but not limited to defective installation, non-conforming materials, false declarations, missing documentation, or non-compliance with scheme rules), Authorised Firm shall bear and reimburse the full amount of such clawback to {{company.name}}, together with any associated penalty, interest and recovery cost.",
          },
          {
            label: "d",
            text:
              "Right of Set-off: {{company.name}} shall be entitled to recover any amount payable by Authorised Firm under this clause (i) by set-off against any commission, balance, or other amount payable by {{company.name}} to Authorised Firm under this Agreement; and/or (ii) by separate written demand, payable by Authorised Firm within seven (7) days of receipt.",
          },
        ],
      }),
      clause({
        number: "6",
        title: "Confidentiality",
        content:
          "All information that {{company.name}} discloses to Authorised Firm hereunder (\"Confidential Information\"), including any information concerning an approved prospect, shall always be treated as confidential by Authorised Firm during the term of this Agreement and thereafter, and shall not be disclosed to a third party without {{company.name}}'s prior written consent. Authorised Firm shall not use any of the Confidential Information except in the performance of its duties hereunder. All Information provided to Authorised Firm shall be returned to {{company.name}} immediately upon request.",
      }),
      clause({
        number: "7",
        title: "Term & Termination",
        content: "The term and termination of this Agreement shall be governed as follows:",
        subPoints: [
          {
            label: "a",
            text:
              "This Agreement shall be effective from the Effective Date and shall continue in force until terminated in accordance with this clause.",
          },
          {
            label: "b",
            text:
              "Either Party may terminate this Agreement for convenience by giving thirty (30) days' prior written notice to the other Party.",
          },
          {
            label: "c",
            text:
              '{{company.name}} may terminate this Agreement immediately and without notice ("For Cause") upon the occurrence of any of the following: (i) misuse of {{company.name}}\'s Vendor Code, name, brand, empanelment or credentials by Authorised Firm; (ii) fraud, wilful misconduct, or material non-compliance with applicable law or scheme rules by Authorised Firm; (iii) suspension, blacklisting, debarment or other adverse action against Authorised Firm by any DISCOM or government authority; (iv) failure by Authorised Firm to remedy any customer complaint or punch point within the time required under this Agreement; or (v) any other material breach of this Agreement not cured within fifteen (15) days of written notice from {{company.name}}.',
          },
          {
            label: "d",
            text:
              "Survival: The provisions of this Agreement that by their nature are intended to survive termination shall survive, including without limitation confidentiality, indemnification, back-to-back warranty, operation & maintenance commitments to customers whose projects have already been executed, customer-service obligations for existing customers, and {{company.name}}'s right of set-off.",
          },
          {
            label: "e",
            text:
              "Effects of Termination: Upon termination, all amounts payable to Authorised Firm shall be subject to {{company.name}}'s right of set-off against any losses and indemnification claims under this Agreement. Commissions shall be paid only so long as the relevant customer remains a {{company.name}} customer and this Agreement has not been terminated, and in any event for a period not exceeding {{var.commissionMonths}} months from commissioning. Upon termination by {{company.name}} For Cause, no further commission shall be payable to Authorised Firm in respect of any customer.",
          },
        ],
      }),
    ]),
  ];
}

const partnershipGoverningLaw =
  "In case any dispute arises in respect of the validity, interpretation, implementation or alleged breach of this Agreement, the Parties shall attempt in the first instance to resolve the same through negotiation. If the disputes are not resolved through negotiation, either Party may refer the dispute for resolution to arbitration by a sole arbitrator in consonance with the provisions of the Arbitration and Conciliation Act, 1996 or any subsequent enactment or amendment thereto, and the decision of the arbitrator shall be binding upon the Parties. The place of arbitration shall be at {{var.arbitrationVenue}}. Each Party shall bear its own cost of arbitration.";

const partnershipClosing =
  "By signing below, the Parties agree that this Agreement constitutes the entire agreement between the Parties and shall only be modified by a written instrument executed by an authorized officer of both Parties.";

const partnershipIntroTemplate =
  "THIS AGREEMENT (the \"Agreement\") is made as of {{effectiveDateFormatted}} (the \"Effective Date\") by and between {{company.name}} with a principal place of business at {{company.address}}.\n\nAnd the business named {{party.entityName}} (\"Authorised Firm\") with a principal place of business located at {{party.address}}.";

const partnershipRecitals = [
  "{{company.name}} promotes, markets and sells certain solar energy solutions (the \"Services\");",
  "Authorised Firm has business contacts who could benefit from {{company.name}}'s services.",
  "{{company.name}} desires to grant to Authorised Firm, and Authorised Firm desires to obtain from {{company.name}}, the non-exclusive right to promote, market and execute the Services.",
];

const partnershipPreamble =
  "NOW, THEREFORE, in consideration of the mutual promises hereinafter set forth, {{company.name}} and Authorised Firm do hereby agree as follows:";

export const partnershipVendorChargeHeadingEn = "Vendor Charges";
export const partnershipVendorChargeTextEn =
  "As consideration for {{company.name}}'s authorisation to use the Vendor Code and for facilitation under {{var.scheme}}, Authorised Firm agrees to pay {{company.name}} a vendor charge of ₹ {{vendorChargePerWatt}} per watt of installed plant capacity for each project executed under this Agreement. This charge shall be calculated on the total installed capacity of the rooftop solar plant and may be deducted by {{company.name}} from loan disbursements or other amounts received on behalf of Authorised Firm before release of the balance to Authorised Firm, in accordance with the payment flow set out in Clause 1(i).";

export const partnershipVendorChargeHeadingHi = "विक्रेता शुल्क";
export const partnershipVendorChargeTextHi =
  "{{company.name}} द्वारा विक्रेता कोड के प्राधिकरण एवं {{var.scheme}} के अंतर्गत सुगम क्रियान्वयन के प्रतिफल में, अधिकृत फर्म सहमत है कि वह इस समझौते के अंतर्गत निष्पादित प्रत्येक परियोजना की कुल स्थापित क्षमता पर ₹ {{vendorChargePerWatt}} प्रति वाट का विक्रेता शुल्क {{company.name}} को देगा। यह शुल्क छत पर स्थापित सौर संयंत्र की कुल स्थापित कक्षमता पर गणना किया जाएगा तथा धारा 1(झ) में वर्णित भुगतान प्रवाह के अनुसार, ऋण संवितरण या अधिकृत फर्म की ओर से प्राप्त अन्य राशियों से कटौती कर {{company.name}} द्वारा अधिकृत फर्म को शेष राशि निर्गत करने से पूर्व वसूला जा सकता है।";

export function getPartnershipVendorChargeContent(data: AgreementData): { heading: string; text: string } {
  return data.language === "hi"
    ? { heading: partnershipVendorChargeHeadingHi, text: partnershipVendorChargeTextHi }
    : { heading: partnershipVendorChargeHeadingEn, text: partnershipVendorChargeTextEn };
}

// ---------- Partnership template (Hindi) ----------

const partnershipTitleHi = "विक्रेता कोड प्राधिकरण समझौता";

const partnershipIntroTemplateHi =
  "यह समझौता (\"समझौता\") {{effectiveDateFormatted}} (\"प्रभावी तिथि\") को {{company.name}}, जिसका मुख्य कार्यस्थल {{company.address}} पर है, एवं {{party.entityName}} (\"अधिकृत फर्म\"), जिसका मुख्य कार्यस्थल {{party.address}} पर है, के मध्य निष्पादित किया गया है।";

const partnershipRecitalsHi = [
  "{{company.name}} कतिपय सौर ऊर्जा समाधानों (इसके पश्चात् \"सेवाएँ\") का प्रचार, विपणन एवं विक्रय करता है;",
  "अधिकृत फर्म के पास ऐसे व्यावसायिक संपर्क हैं जो {{company.name}} की सेवाओं से लाभान्वित हो सकते हैं;",
  "{{company.name}} इन सेवाओं के प्रचार, विपणन एवं निष्पादन का गैर-अनन्य अधिकार अधिकृत फर्म को प्रदान करने का इच्छुक है, तथा अधिकृत फर्म ऐसा अधिकार प्राप्त करने का इच्छुक है।",
];

const partnershipPreambleHi =
  "अतः, यहाँ उल्लिखित पारस्परिक वचनों के प्रतिफल में, {{company.name}} एवं अधिकृत फर्म निम्नलिखित शर्तों पर सहमत होते हैं:";

function createPartnershipSectionsHi(): AgreementSection[] {
  return [
    section("कार्य का विस्तार", [
      clause({
        number: "1",
        content:
          "{{company.name}} {{var.scheme}} के अंतर्गत आवासीय संपत्ति एवं पंजीकृत सामूहिक आवास सोसायटियों पर सौर रूफटॉप पावर प्लांट स्थापित करने हेतु राष्ट्रीय सौर रूफटॉप पोर्टल पर एक सूचीबद्ध विक्रेता है। {{company.name}} इस योजना के अंतर्गत संपूर्ण राज्य में अपनी सेवाएँ प्रदान करने हेतु पात्र है।",
        subPoints: [
          {
            label: "क",
            text: "अधिकृत फर्म सहमत है कि वह {{var.scheme}} से संबंधित सेवाओं को {{var.region}} क्षेत्र में {{company.name}} के नाम से निष्पादित करेगा।",
          },
          { label: "ख", text: "{{company.name}} एवं अधिकृत फर्म इस समझौते की अवधि में निम्नलिखित कार्य करेंगे:" },
          {
            label: "ग",
            text:
              "ऑर्डर की पुष्टि, सामग्री की खरीद, स्थापना प्रक्रिया का निष्पादन तथा DISCOM एवं नेट मीटरिंग से संबंधित कार्य अधिकृत फर्म की ज़िम्मेदारी है।",
          },
          {
            label: "घ",
            text:
              "अधिकृत फर्म यह सुनिश्चित करेगा कि उत्पादों एवं स्थापना की गुणवत्ता राष्ट्रीय सौर रूफटॉप पोर्टल द्वारा निर्धारित मानकों के अनुरूप हो।",
          },
          {
            label: "ङ",
            text:
              "ऐसी परियोजनाओं के संचालन एवं रखरखाव की संपूर्ण ज़िम्मेदारी कम से कम {{var.oAndMYears}} वर्षों तक अधिकृत फर्म की होगी।",
          },
          {
            label: "च",
            text:
              "अधिकृत फर्म सब्सिडी के आवेदन तथा स्थापित संयंत्र की कार्यक्षमता पर नियमित प्रतिक्रिया हेतु अंतिम रूप दिए गए ग्राहकों का संपूर्ण विवरण {{company.name}} के प्रतिनिधियों को उपलब्ध कराएगा।",
          },
          {
            label: "छ",
            text:
              "अधिकृत फर्म संयंत्र का संपूर्ण विवरण, जिसमें उत्पाद विशिष्टताएँ, डेटा शीट, सीरियल नंबर, साइट निर्देशांक, आईडी, पासवर्ड एवं समय-समय पर अपेक्षित अन्य कोई जानकारी सम्मिलित है, प्रदान करेगा।",
          },
          {
            label: "ज",
            text:
              "ग्राहक से समस्त भुगतान एकत्रित करने की ज़िम्मेदारी अधिकृत फर्म की होगी। ग्राहक की ओर से देय किसी भी राशि के लिए {{company.name}} किसी भी परिस्थिति में उत्तरदायी नहीं होगा।",
          },
          {
            label: "झ",
            text:
              "{{var.scheme}} के अंतर्गत भुगतान का संग्रहण एवं निर्गमन ग्राहक द्वारा चयनित भुगतान विधि पर निर्भर होगा: (क) जहाँ ग्राहक नकद भुगतान करता है, वहाँ अधिकृत फर्म ऐसी नकद राशि सीधे ग्राहक से एकत्रित कर सकता है तथा परियोजना के क्रियान्वयन एवं निष्पादन हेतु उपयोग कर सकता है, बशर्ते कि अधिकृत फर्म ऐसे प्रत्येक नकद लेन-देन की सूचना समर्थक विवरणों सहित {{company.name}} को अविलंब प्रदान करे; (ख) जहाँ ग्राहक बैंक ऋण के माध्यम से भुगतान करता है, वहाँ ऋण राशि ऋणदाता द्वारा सीधे {{company.name}} के बैंक खाते में, सामान्यतः दो तथा कभी-कभी तीन किस्तों में, संवितरित की जाएगी। {{company.name}} ऐसी ऋण राशि से अधिकृत फर्म को केवल उतनी ही धनराशि निर्गत करेगा जितनी वस्तुतः बैंक से प्राप्त हुई है, तथा योजना के सुगम क्रियान्वयन हेतु पारस्परिक रूप से सहमत शुल्क की कटौती के पश्चात्। {{company.name}} ऐसी कोई राशि अग्रिम देने हेतु बाध्य नहीं होगा जो अभी तक ऋणदाता से प्राप्त नहीं हुई है; (ग) जहाँ ग्राहक नकद एवं ऋण के संयोजन से भुगतान करता है, वहाँ नकद घटक (क) के अनुसार एवं ऋण घटक (ख) के अनुसार संभाला जाएगा। {{company.name}} के पास शेष कोई भी अंतिम राशि परियोजना के नेट मीटरिंग सहित सफल निष्पादन पर निर्गत की जाएगी।",
          },
          { label: "ञ", text: "{{company.name}} परियोजना की बिक्री एवं निष्पादन दोनों हेतु दूरभाष आधारित सहायता प्रदान करेगा।" },
          {
            label: "ट",
            text:
              "{{company.name}} ग्राहक के बैंक खाते में सब्सिडी के सीधे संवितरण की प्रक्रिया हेतु परियोजना के समस्त अपेक्षित विवरण राष्ट्रीय पोर्टल पर समय-समय पर अपलोड करेगा।",
          },
          {
            label: "ठ",
            text:
              "{{company.name}} इस समझौते के अंतर्गत किसी ग्राहक की निष्पादित परियोजना का निरीक्षण एवं सत्यापन, अधिकृत फर्म को पूर्व सूचना के साथ अथवा उसके बिना, किसी भी उपयुक्त समय पर कर सकता है।",
          },
          {
            label: "ड",
            text:
              "अधिकृत फर्म यह सुनिश्चित करेगा कि इस समझौते के अंतर्गत प्रदान की जाने वाली ग्राहक सेवा वास्तविक हो तथा ग्राहकों की ओर से कोई नकारात्मक रेटिंग, शिकायत अथवा पंच पॉइंट उत्पन्न न हो। ग्राहक द्वारा उठाई गई कोई भी शिकायत अथवा पंच पॉइंट का निवारण अधिकृत फर्म अपने व्यय पर उचित समयावधि में करेगा। यदि अधिकृत फर्म उनका निवारण करने में विफल रहता है, तो {{company.name}} स्वयं ऐसे निवारण का दायित्व ले सकता है तथा {{company.name}} की प्रचलित शर्तों के अनुसार उसका व्यय अधिकृत फर्म से वसूल कर सकता है।",
          },
        ],
      }),
    ]),
    section("विक्रेता कोड का उपयोग", [
      clause({
        number: "2",
        title: "विक्रेता कोड का प्राधिकरण, उपयोग एवं दुरुपयोग",
        content:
          "{{company.name}} एतद्द्वारा अधिकृत फर्म को, गैर-अनन्य आधार पर, राष्ट्रीय सौर रूफटॉप पोर्टल पर {{company.name}} की विक्रेता-सूचीयन (\"विक्रेता कोड\") का उपयोग करते हुए {{var.scheme}} के अंतर्गत सेवाएँ निष्पादित करने हेतु प्राधिकृत करता है, निम्नलिखित शर्तों के अधीन:",
        subPoints: [
          {
            label: "क",
            text:
              "अधिकृत फर्म का विक्रेता कोड का उपयोग {{var.region}} में {{var.scheme}} के अंतर्गत {{company.name}} की ओर से परियोजनाएँ निष्पादित करने तक सीमित है, जिसमें पोर्टल प्रविष्टियाँ, DISCOM प्रस्तुतियाँ एवं {{company.name}} से उचित रूप से सम्बद्ध ग्राहक पत्राचार सम्मिलित हैं।",
          },
          {
            label: "ख",
            text:
              "अधिकृत फर्म ग्राहकों, DISCOM एवं तृतीय पक्षों को स्वयं को {{company.name}} की विक्रेता-सूचीयन के अंतर्गत संचालित एक अधिकृत फर्म के रूप में सत्यापूर्वक प्रस्तुत करेगा, तथा स्वयं को {{company.name}} अथवा {{company.name}} के किसी अधिकारी, निदेशक, कर्मचारी अथवा शाखा के रूप में प्रस्तुत नहीं करेगा।",
          },
          {
            label: "ग",
            text:
              "अधिकृत फर्म (i) {{company.name}} की पूर्व लिखित अनुमति के बिना {{company.name}} के लेटरहेड पर अथवा {{company.name}} के नाम से कोई बीजक, अनुबंध, पत्र अथवा औपचारिक पत्राचार जारी नहीं करेगा; (ii) {{company.name}} के पोर्टल क्रेडेंशियल, योजना लॉगिन विवरण अथवा सूचीयन दस्तावेज़ किसी तृतीय पक्ष को साझा, उप-लाइसेंस अथवा अग्रसारित नहीं करेगा; (iii) इस समझौते के अंतर्गत स्पष्ट रूप से सौंपे गए कार्य की सीमा से परे किसी भी मामले में {{company.name}} को बाध्य करने का अधिकार रखने का दावा नहीं करेगा; (iv) इस समझौते की अवधि के दौरान {{var.region}} में {{company.name}} की पूर्व लिखित सहमति के बिना किसी अन्य विक्रेता की सूचीयन अथवा विक्रेता कोड के अंतर्गत बोली नहीं लगाएगा, पंजीकरण नहीं कराएगा अथवा संचालन नहीं करेगा; अथवा (v) कोई ऐसा कार्य नहीं करेगा जिससे {{company.name}} का नाम, सूचीयन, प्रतिष्ठा अथवा योजना स्थिति प्रभावित हो।",
          },
          {
            label: "घ",
            text:
              "{{company.name}} को (i) किसी भी समय अधिकृत फर्म के विक्रेता कोड के उपयोग की निगरानी एवं लेखापरीक्षा करने; (ii) अधिकृत फर्म द्वारा की गई किसी भी ऐसी पोर्टल प्रविष्टि अथवा DISCOM प्रस्तुति को अस्वीकार अथवा वापस लेने जो योजना की आवश्यकताओं को पूरा न करती हो; तथा (iii) किसी भी संदिग्ध दुरुपयोग पर अधिकृत फर्म के विक्रेता कोड उपयोग के प्राधिकार को जाँच के लंबित होने तक तत्काल प्रभाव से निलंबित करने का अधिकार होगा।",
          },
          {
            label: "ङ",
            text:
              "विक्रेता कोड का उपयोग करने का प्राधिकार इस समझौते की समाप्ति अथवा अवसान पर स्वतः समाप्त हो जाएगा, तथा अधिकृत फर्म तत्पश्चात् किसी भी नई परियोजना, ग्राहक प्रस्तुति अथवा तृतीय-पक्ष पत्राचार में {{company.name}} के नाम, ब्रांड, विक्रेता कोड, सूचीयन एवं क्रेडेंशियल का समस्त उपयोग बंद कर देगा।",
          },
        ],
      }),
    ]),
    section("अनुपालन एवं आचरण", [
      clause({
        number: "3",
        title: "सुरक्षा, बीमा एवं उपठेका",
        content: "अधिकृत फर्म इस समझौते के अंतर्गत समस्त परियोजनाओं के संबंध में निम्नलिखित दायित्वों का अनुपालन सुनिश्चित करेगा:",
        subPoints: [
          {
            label: "क",
            text:
              "इंस्टॉलर एवं श्रमिक सुरक्षा, साइट सुरक्षा, तथा सभी स्थापना स्थलों पर लागू सांविधिक एवं विद्युत सुरक्षा मानकों के अनुपालन की संपूर्ण ज़िम्मेदारी अधिकृत फर्म की होगी। अधिकृत फर्म अथवा उसके कार्मिकों से संबंधित किसी सुरक्षा विफलता हेतु {{company.name}} उत्तरदायी नहीं होगा।",
          },
          {
            label: "ख",
            text:
              "अधिकृत फर्म अपने संचालन पर लागू पर्याप्त श्रमिक मुआवजा, तृतीय-पक्ष दायित्व अथवा अन्य बीमा, जैसा विधि द्वारा अथवा विवेकपूर्ण व्यावसायिक प्रथा के अनुसार आवश्यक हो, बनाए रखेगा।",
          },
          {
            label: "ग",
            text:
              "अधिकृत फर्म {{company.name}} की पूर्व लिखित सहमति के बिना इस समझौते के अंतर्गत सौंपे गए किसी भी कार्य का उपठेका नहीं देगा।",
          },
          {
            label: "घ",
            text:
              "अधिकृत फर्म सब्सिडी, DISCOM अथवा राष्ट्रीय पोर्टल प्रक्रियाओं के संबंध में किसी अनुचित प्रलोभन की पेशकश अथवा स्वीकृति नहीं करेगा, तथा सद्भावना एवं ईमानदारी के साथ व्यवसाय का संचालन करेगा।",
          },
        ],
      }),
    ]),
    section("सामान्य शर्तें", [
      clause({
        number: "4",
        title: "स्वतंत्र ठेकेदार एवं दायित्व की सीमा",
        content:
          "अधिकृत फर्म सहमत है कि अधिकृत फर्म एक स्वतंत्र ठेकेदार है, न कि {{company.name}} का साझेदार, एजेंट अथवा कर्मचारी। अधिकृत फर्म इस समझौते से संबंधित अपने व्ययों को {{company.name}} से किसी प्रतिपूर्ति की मांग किए बिना स्वयं वहन करेगा। अधिकृत फर्म समझता है एवं सहमत है कि यह व्यवस्था गैर-अनन्य आधार पर है तथा {{company.name}} सेवाओं अथवा किसी अन्य सेवा से संबंधित अपने विक्रय प्रयासों में सहायता हेतु अन्य पक्षों को जब एवं जहाँ चाहे संलग्न कर सकता है।\n\nकिसी भी परिस्थिति में {{company.name}} अधिकृत फर्म, ग्राहकों अथवा किसी तृतीय पक्ष के प्रति किसी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी अथवा दंडात्मक क्षति हेतु, जिसमें खोए हुए लाभ, खोई हुई बचत, व्यवसाय व्यवधान, प्रौद्योगिकी की हानि अथवा खोए हुए डेटा से संबंधित कोई भी क्षति सम्मिलित है, चाहे वह संविदा, अपकृत्य (लापरवाही सहित), कठोर दायित्व अथवा अन्य किसी सिद्धांत के अंतर्गत उत्पन्न हुई हो, उत्तरदायी नहीं होगा, भले ही {{company.name}} को ऐसी क्षतियों की संभावना से अवगत कराया गया हो। इस समझौते के अंतर्गत {{company.name}} का संपूर्ण संचयी दायित्व, संबंधित ग्राहक के विरुद्ध अधिकृत फर्म द्वारा {{company.name}} को भुगतान किए गए कुल कमीशन की राशि तक सीमित रहेगा।",
      }),
      clause({
        number: "5",
        title: "क्षतिपूर्ति, बैक-टू-बैक वारंटी एवं सब्सिडी की वापसी",
        content:
          "इस समझौते के अंतर्गत {{company.name}} के प्रति अधिकृत फर्म के दायित्व एवं वारंटी निम्नलिखित हैं:",
        subPoints: [
          {
            label: "क",
            text:
              "क्षतिपूर्ति: अधिकृत फर्म {{company.name}}, उसके निदेशकों, अधिकारियों, कर्मचारियों एवं प्रतिनिधियों को (i) अधिकृत फर्म, उसके कार्मिकों अथवा उपठेकेदारों द्वारा की गई किसी लापरवाही, जानबूझकर दुराचरण, धोखाधड़ी अथवा लागू विधि या योजना नियमों के अनुपालन की चूक से; (ii) अधिकृत फर्म द्वारा {{company.name}} के विक्रेता कोड, नाम, ब्रांड, सूचीयन अथवा क्रेडेंशियल के किसी दुरुपयोग अथवा अनधिकृत उपयोग से; (iii) अधिकृत फर्म द्वारा निष्पादित किसी परियोजना की स्थापना, सामग्री, कारीगरी अथवा संचालन व रखरखाव में किसी कमी से, जिसमें {{company.name}} द्वारा वहन किया गया कोई ग्राहक दावा अथवा वारंटी दायित्व सम्मिलित है; तथा (iv) अधिकृत फर्म के कृत्यों अथवा कार्य-अकर्म से उत्पन्न किसी तृतीय-पक्ष दावे, नियामक कार्रवाई अथवा DISCOM / सरकारी जुर्माने से उत्पन्न समस्त हानियों, क्षतियों, दावों, जुर्मानों, दंडों, लागतों एवं व्ययों (विधिक शुल्क सहित) से क्षतिपूर्ति, बचाव एवं हानि-मुक्त रखेगा।",
          },
          {
            label: "ख",
            text:
              "बैक-टू-बैक वारंटी: अधिकृत फर्म {{company.name}} को आश्वस्त करता है कि इस समझौते के अंतर्गत निष्पादित प्रत्येक परियोजना राष्ट्रीय पोर्टल, {{var.scheme}} एवं लागू DISCOM मानकों के अंतर्गत {{company.name}} पर लागू तकनीकी विशिष्टताओं, कारीगरी मानकों एवं कार्य-निष्पादन गारंटियों के अनुरूप होगी। यह वारंटी उस संपूर्ण अवधि तक प्रवृत्त रहेगी जिस दौरान {{company.name}} योजना के अंतर्गत ग्राहक एवं/अथवा किसी सरकारी प्राधिकरण के प्रति उत्तरदायी रहता है, तथा किसी भी स्थिति में कमीशनिंग से कम से कम {{var.oAndMYears}} वर्षों तक प्रवृत्त रहेगी। अधिकृत फर्म द्वारा निष्पादित किसी परियोजना में दोष के कारण {{company.name}} द्वारा वहन किया गया कोई भी सुधार, प्रतिस्थापन, कार्य-निष्पादन कमी का निवारण अथवा वारंटी दायित्व अधिकृत फर्म अपने व्यय पर अविलंब निवारित करेगा; ऐसा करने में विफल रहने पर {{company.name}} स्वयं ऐसा निवारण कर सकता है तथा उसका संपूर्ण व्यय अधिकृत फर्म से वसूल कर सकता है।",
          },
          {
            label: "ग",
            text:
              "सब्सिडी की वापसी: यदि अधिकृत फर्म द्वारा निष्पादित किसी परियोजना के संबंध में संवितरित कोई सब्सिडी, प्रोत्साहन, अनुदान अथवा योजना लाभ, किसी भी समय, किसी सरकारी प्राधिकरण, DISCOM अथवा योजना प्रशासक द्वारा अधिकृत फर्म से सम्बद्ध आधारों पर (जिसमें दोषपूर्ण स्थापना, गैर-अनुरूप सामग्री, झूठी घोषणाएँ, अनुपलब्ध दस्तावेज़, अथवा योजना नियमों का अनुपालन न करना सम्मिलित किन्तु सीमित नहीं है) अस्वीकृत, घटाया, वापस लिया, रोका अथवा वापस किया जाता है, तो अधिकृत फर्म ऐसी संपूर्ण वापसी राशि, किसी सम्बद्ध दंड, ब्याज एवं वसूली लागत सहित, {{company.name}} को वहन एवं प्रतिपूर्त करेगा।",
          },
          {
            label: "घ",
            text:
              "समायोजन का अधिकार: {{company.name}} इस खंड के अंतर्गत अधिकृत फर्म द्वारा देय किसी भी राशि को (i) इस समझौते के अंतर्गत {{company.name}} द्वारा अधिकृत फर्म को देय किसी भी कमीशन, शेष राशि अथवा अन्य राशि के साथ समायोजित करके; एवं/अथवा (ii) पृथक लिखित मांग द्वारा, जो प्राप्ति के सात (7) दिनों के भीतर अधिकृत फर्म द्वारा देय होगी, वसूल करने का अधिकारी होगा।",
          },
        ],
      }),
      clause({
        number: "6",
        title: "गोपनीयता",
        content:
          "{{company.name}} द्वारा अधिकृत फर्म को इस समझौते के अंतर्गत प्रकट की गई समस्त जानकारी (\"गोपनीय जानकारी\"), जिसमें किसी अनुमोदित संभावित ग्राहक से संबंधित कोई भी जानकारी सम्मिलित है, अधिकृत फर्म द्वारा इस समझौते की अवधि में एवं उसके पश्चात् भी सर्वदा गोपनीय रूप से संधारित की जाएगी, तथा {{company.name}} की पूर्व लिखित सहमति के बिना किसी तृतीय पक्ष को प्रकट नहीं की जाएगी। अधिकृत फर्म इस समझौते के अंतर्गत अपने कर्तव्यों के निष्पादन के अतिरिक्त किसी भी गोपनीय जानकारी का उपयोग नहीं करेगा। अधिकृत फर्म को प्रदत्त समस्त जानकारी मांग किए जाने पर अविलंब {{company.name}} को वापस की जाएगी।",
      }),
      clause({
        number: "7",
        title: "अवधि एवं समाप्ति",
        content: "इस समझौते की अवधि एवं समाप्ति निम्नानुसार शासित होगी:",
        subPoints: [
          {
            label: "क",
            text: "यह समझौता प्रभावी तिथि से लागू होगा एवं इस खंड के अनुसार समाप्त होने तक प्रवृत्त रहेगा।",
          },
          {
            label: "ख",
            text:
              "कोई भी पक्ष दूसरे पक्ष को तीस (30) दिनों की पूर्व लिखित सूचना देकर सुविधा के अनुसार इस समझौते को समाप्त कर सकता है।",
          },
          {
            label: "ग",
            text:
              '{{company.name}} निम्नलिखित में से किसी की घटना पर इस समझौते को बिना सूचना के तत्काल समाप्त कर सकता है ("वजह सहित"): (i) अधिकृत फर्म द्वारा {{company.name}} के विक्रेता कोड, नाम, ब्रांड, सूचीयन अथवा क्रेडेंशियल का दुरुपयोग; (ii) अधिकृत फर्म द्वारा धोखाधड़ी, जानबूझकर दुराचरण अथवा लागू विधि या योजना नियमों का सारवान् अननुपालन; (iii) किसी DISCOM अथवा सरकारी प्राधिकरण द्वारा अधिकृत फर्म के विरुद्ध निलंबन, ब्लैकलिस्ट, डिबारमेंट अथवा अन्य प्रतिकूल कार्रवाई; (iv) अधिकृत फर्म द्वारा इस समझौते के अंतर्गत अपेक्षित समयावधि में किसी ग्राहक शिकायत अथवा पंच पॉइंट का निवारण न करना; अथवा (v) इस समझौते का कोई अन्य सारवान् उल्लंघन जो {{company.name}} की लिखित सूचना के पंद्रह (15) दिनों के भीतर ठीक नहीं किया जाता।',
          },
          {
            label: "घ",
            text:
              "उत्तरजीविता: इस समझौते के वे प्रावधान जो स्वभाव से समाप्ति के पश्चात् प्रवृत्त रहने का अभिप्रेत हैं, प्रवृत्त रहेंगे, जिसमें सीमा के बिना गोपनीयता, क्षतिपूर्ति, बैक-टू-बैक वारंटी, पूर्व में निष्पादित परियोजनाओं के ग्राहकों के प्रति संचालन व रखरखाव प्रतिबद्धताएँ, मौजूदा ग्राहकों के प्रति ग्राहक-सेवा दायित्व एवं {{company.name}} का समायोजन का अधिकार सम्मिलित हैं।",
          },
          {
            label: "ङ",
            text:
              "समाप्ति का प्रभाव: समाप्ति पर, अधिकृत फर्म को देय समस्त राशियाँ इस समझौते के अंतर्गत किसी हानि एवं क्षतिपूर्ति दावों के विरुद्ध {{company.name}} के समायोजन के अधिकार के अधीन होंगी। कमीशन का भुगतान केवल तब तक किया जाएगा जब तक संबंधित ग्राहक {{company.name}} का ग्राहक बना रहता है तथा यह समझौता समाप्त नहीं हुआ हो, तथा किसी भी स्थिति में कमीशनिंग से अधिकतम {{var.commissionMonths}} माह की अवधि हेतु। {{company.name}} द्वारा वजह सहित समाप्ति पर, अधिकृत फर्म को किसी भी ग्राहक के संबंध में कोई और कमीशन देय नहीं होगा।",
          },
        ],
      }),
    ]),
  ];
}

const partnershipGoverningLawHi =
  "इस समझौते की वैधता, व्याख्या, क्रियान्वयन अथवा कथित उल्लंघन के संबंध में कोई विवाद उत्पन्न होने पर, पक्षकार प्रथमतः उसका समाधान आपसी विचार-विमर्श से करने का प्रयास करेंगे। यदि विवाद विचार-विमर्श से समाधान नहीं हो पाते, तो कोई भी पक्ष विवाद के समाधान हेतु एकमात्र मध्यस्थ द्वारा माध्यस्थम् के लिए संदर्भित कर सकता है, जो माध्यस्थम् एवं सुलह अधिनियम, 1996 अथवा उसके किसी पश्चातवर्ती अधिनियमन अथवा संशोधन के प्रावधानों के अनुरूप होगा, तथा मध्यस्थ का निर्णय पक्षकारों पर बाध्यकारी होगा। माध्यस्थम् का स्थान {{var.arbitrationVenue}} होगा। प्रत्येक पक्ष माध्यस्थम् का अपना व्यय स्वयं वहन करेगा।";

const partnershipClosingHi =
  "नीचे हस्ताक्षर करके, पक्षकार सहमत होते हैं कि यह समझौता पक्षकारों के मध्य संपूर्ण समझौता है तथा इसे केवल दोनों पक्षकारों के प्राधिकृत अधिकारियों द्वारा निष्पादित लिखित लिखत द्वारा ही संशोधित किया जा सकता है।";

// ---------- INC Installation Assignment template ----------

const incAssignVariableFields: AgreementVariableField[] = [
  { key: "scheme", label: "Scheme / Programme", helper: "e.g. PM Surya Ghar: Muft Bijli Yojana" },
  { key: "region", label: "Assigned Region / Territory", helper: "e.g. Jaipur Discom (JVVNL) area, Rajasthan" },
  { key: "safetyStandards", label: "Safety Standards Reference", helper: "e.g. applicable electrical and height-work safety norms" },
  { key: "advancePct", label: "Advance Release %", helper: "e.g. 90" },
  { key: "balancePct", label: "Balance Release %", helper: "e.g. 10" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const incAssignVariableDefaults: Record<string, string> = {
  scheme: "PM Surya Ghar: Muft Bijli Yojana",
  region: "Jaipur Discom (JVVNL) area, Rajasthan",
  safetyStandards: "applicable electrical safety, height-work, and site safety norms",
  advancePct: "90",
  balancePct: "10",
  arbitrationVenue: "Jaipur",
};

function createIncInstallationAssignSections(): AgreementSection[] {
  return [
    section("Assignment & Scope", [
      clause({
        number: "1",
        title: "Project Assignment",
        content:
          "{{company.name}} may assign specific INC / rooftop solar installation projects under {{var.scheme}} in the region of {{var.region}} to Contractor (\"Assigned Projects\"). Contractor agrees to perform installation and related site execution work only, in the name and under the empanelment of {{company.name}}, as per National Portal and applicable DISCOM norms.",
        subPoints: [
          {
            label: "a",
            text:
              "Contractor shall execute Assigned Projects with sincerity, diligence, professionalism, and good faith, and shall not engage in any conduct that harms {{company.name}}'s reputation or compliance standing.",
          },
          {
            label: "b",
            text:
              "Unless expressly agreed in writing, Contractor shall not independently solicit or finalize customers in {{company.name}}'s name without prior approval.",
          },
          {
            label: "c",
            text:
              "{{company.name}} may inspect, verify, or suspend any Assigned Project with or without prior notice.",
          },
        ],
      }),
    ]),
    section("Safety & Compliance", [
      clause({
        number: "2",
        title: "Safety Responsibility",
        content:
          "Contractor acknowledges that safety at the installation site is Contractor's sole responsibility. Contractor shall comply with {{var.safetyStandards}} and all applicable laws, permits, and site-access requirements.",
        subPoints: [
          {
            label: "a",
            text:
              "Contractor shall provide and maintain required PPE, safe work practices, qualified personnel, and equipment for safe execution of Assigned Projects.",
          },
          {
            label: "b",
            text:
              "{{company.name}} may, at its discretion, provide safety items, materials, or equipment as needed for a particular project, without assuming ongoing safety liability or supervision duty.",
          },
          {
            label: "c",
            text:
              "Contractor shall indemnify and hold harmless {{company.name}} against claims, penalties, or losses arising from Contractor's safety breaches, negligence, or non-compliance attributable to Contractor or its personnel.",
          },
        ],
      }),
    ]),
    section("Quality, Materials & Payments", [
      clause({
        number: "3",
        title: "Quality & Materials",
        content:
          "Contractor shall ensure installation quality as per National Portal specifications, manufacturer guidelines, and {{company.name}}'s written instructions. Defects attributable to Contractor's workmanship shall be rectified by Contractor at Contractor's cost.",
        subPoints: [
          {
            label: "a",
            text:
              "{{company.name}} may supply materials for Assigned Projects. Contractor shall use such materials only for the relevant project, account for them properly, and be liable for loss, damage, or misuse.",
          },
          {
            label: "b",
            text:
              "Customer payments collected for Assigned Projects shall be deposited in {{company.name}}'s designated bank account. {{company.name}} shall release {{var.advancePct}}% for procurement and execution and the balance {{var.balancePct}}% upon successful completion including net metering, subject to agreed deductions.",
          },
        ],
      }),
    ]),
    section("Independent Contractor", [
      clause({
        number: "4",
        content:
          "Contractor is an independent contractor and not an employee, agent, or partner of {{company.name}}. This arrangement is non-exclusive. Contractor shall bear its own expenses unless otherwise agreed in writing.",
      }),
    ]),
    section("Confidentiality", [
      clause({
        number: "5",
        content:
          "Customer data, portal credentials, serial numbers, site coordinates, pricing, and any information shared by {{company.name}} shall be treated as confidential. Contractor shall return or destroy such information upon request or termination.",
      }),
    ]),
    section("Limitation of Liability", [
      clause({
        number: "6",
        content:
          "IN NO EVENT SHALL {{company.name}} BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. {{company.name}}'S TOTAL LIABILITY FOR ANY ASSIGNED PROJECT SHALL NOT EXCEED THE FEES ACTUALLY PAID BY {{company.name}} TO CONTRACTOR FOR THAT PROJECT.",
      }),
    ]),
    section("Term & Termination", [
      clause({
        number: "7",
        content:
          "This Agreement is effective from the Effective Date until terminated by either Party on written notice. Upon termination, Contractor shall immediately stop work on Assigned Projects and return confidential information and unused materials belonging to {{company.name}}.",
      }),
    ]),
  ];
}

const incAssignGoverningLaw =
  "This Agreement shall be governed by the laws of India. Disputes shall first be resolved through good-faith negotiation. Failing resolution, disputes shall be referred to sole arbitration under the Arbitration and Conciliation Act, 1996 at {{var.arbitrationVenue}}. Each Party shall bear its own costs unless the arbitrator directs otherwise.";

const incAssignClosing =
  "By signing below, the Parties confirm that this Agreement constitutes the entire understanding between them regarding INC installation assignments and may be amended only in writing signed by both Parties.";

const incAssignIntroTemplate =
  "THIS INSTALLATION ASSIGNMENT AGREEMENT (the \"Agreement\") is made as of {{effectiveDateFormatted}} (the \"Effective Date\") between {{company.name}}, having its principal place of business at {{company.address}} (\"Company\"), and {{party.entityName}}, having its principal place of business at {{party.address}} (\"Contractor\").";

const incAssignRecitals = [
  "{{company.name}} undertakes rooftop solar installation projects under {{var.scheme}} and related programmes.",
  "Contractor is engaged to perform installation and site execution work for Assigned Projects on behalf of {{company.name}}.",
  "The Parties wish to record their respective rights, responsibilities, and safety obligations in connection with such assignments.",
];

const incAssignPreamble =
  "NOW, THEREFORE, in consideration of the mutual promises set forth herein, the Parties agree as follows:";

// ---------- INC Goodwill Execution template ----------

const incGoodwillVariableFields: AgreementVariableField[] = [
  { key: "scheme", label: "Scheme / Programme", helper: "e.g. PM Surya Ghar: Muft Bijli Yojana" },
  { key: "ministry", label: "Issuing Ministry", helper: "e.g. MNRE" },
  { key: "capacity", label: "RTS System Capacity (kWp)" },
  { key: "estimatedTimeline", label: "Estimated Timeline", helper: "e.g. 45–60 days from site readiness" },
  { key: "materialProvision", label: "Materials Summary", helper: "e.g. modules, inverter, BoS as per agreed scope" },
  { key: "maintenanceYears", label: "Workmanship / Maintenance Period (years)", helper: "e.g. 5" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const incGoodwillVariableDefaults: Record<string, string> = {
  scheme: "PM Surya Ghar: Muft Bijli Yojana",
  ministry: "MNRE",
  capacity: "5",
  estimatedTimeline: "45–60 days from site readiness and documentation completion",
  materialProvision: "solar modules, inverter, and balance of system items as required for the agreed scope",
  maintenanceYears: "5",
  arbitrationVenue: "Jaipur",
};

function createIncGoodwillSections(): AgreementSection[] {
  return [
    section("Goodwill Commitment", [
      clause({
        number: "1",
        title: "Voluntary Undertaking",
        content:
          "As a goodwill arrangement, {{company.name}} voluntarily agrees to undertake design, installation, commissioning, and {{var.maintenanceYears}}-year workmanship support for Beneficiary's rooftop solar project under {{var.scheme}} (capacity: minimum {{var.capacity}} kWp). This document records commitment terms and is not a commercial quotation unless separately agreed in writing.",
      }),
    ]),
    section("Scope of Work", [
      clause({
        number: "2",
        content:
          "{{company.name}} shall perform the work professionally and in accordance with applicable DISCOM, {{var.ministry}}, and National Portal procedures. Estimated timeline: {{var.estimatedTimeline}}.",
        subPoints: [
          { label: "a", text: "Scope includes supply and installation of RTS system components and BoS as per agreed layout." },
          { label: "b", text: "Beneficiary shall provide accurate site, load, and ownership information on which {{company.name}} has relied." },
        ],
      }),
    ]),
    section("Materials & Support", [
      clause({
        number: "3",
        content:
          "{{company.name}} shall provide {{var.materialProvision}} where needed for the agreed scope. Beneficiary shall cooperate on site access, approvals, documentation, and timely responses required for subsidy and net-metering processes.",
      }),
    ]),
    section("Beneficiary Responsibilities", [
      clause({
        number: "4",
        content: "Beneficiary agrees to:",
        subPoints: [
          { label: "a", text: "Keep the site shadow-free, accessible, and safe for installation and maintenance." },
          { label: "b", text: "Provide power, water, storage, and local support reasonably required for execution." },
          { label: "c", text: "Not misuse the RTS system or interfere with safe work practices of {{company.name}} personnel." },
          { label: "d", text: "Perform routine cleaning and basic upkeep after handover unless otherwise agreed." },
        ],
      }),
    ]),
    section("Timelines & Subsidy Disclaimer", [
      clause({
        number: "5",
        content:
          "All timelines are estimates only. {{company.name}} does not guarantee subsidy approval, portal disbursement, or DISCOM timelines. Delays caused by Beneficiary, authorities, or Force Majeure shall extend timelines accordingly.",
      }),
    ]),
    section("Limited Liability", [
      clause({
        number: "6",
        content:
          "{{company.name}}'s liability under this goodwill arrangement shall be limited to re-performance of defective workmanship or refund of amounts actually received from Beneficiary specifically for the project, to the extent permitted by law.",
      }),
    ]),
    section("Suspension & Termination", [
      clause({
        number: "7",
        content:
          "{{company.name}} may suspend or terminate this arrangement if Beneficiary fails to cooperate, provides false information, obstructs site access, or defaults on any agreed payment (if applicable), after reasonable notice where practicable.",
      }),
    ]),
  ];
}

const incGoodwillGoverningLaw =
  "This Agreement shall be governed by the laws of India. Disputes shall be resolved through negotiation, failing which by sole arbitration at {{var.arbitrationVenue}} under the Arbitration and Conciliation Act, 1996.";

const incGoodwillClosing =
  "By signing below, the Parties acknowledge that they have read and understood this goodwill project execution arrangement.";

const incGoodwillIntroTemplate =
  "THIS GOODWILL PROJECT EXECUTION AGREEMENT is executed on {{effectiveDateFormatted}} for a rooftop solar project under {{var.scheme}}.\n\nBETWEEN: {{party.entityName}}, Consumer No. {{party.consumerNumber}} ({{party.discom}}), residing at {{party.address}} (\"Beneficiary\").\n\nAND: {{company.name}}, having office at {{company.address}} (\"Company\").";

const incGoodwillRecitals = [
  "Beneficiary intends to install a rooftop solar system under {{var.scheme}} of {{var.ministry}}.",
  "{{company.name}} wishes to extend a goodwill commitment to execute the project on the terms set out herein.",
  "This arrangement is entered in good faith to support timely and professional project completion.",
];

const incGoodwillPreamble = "";

// ---------- Builders ----------

export const HINDI_SUPPORTED_TEMPLATES: AgreementTemplate[] = ["partnership"];

export function isHindiSupported(template: AgreementTemplate): boolean {
  return HINDI_SUPPORTED_TEMPLATES.includes(template);
}

export const SUNNY_MEENA_VENDOR_AGREEMENT_ID = "a1b2c3d4-e5f6-4789-a012-sunnymeena01";
export const RAVI_SHARMA_VENDOR_AGREEMENT_ID = "a1b2c3d4-e5f6-4789-a012-ravisharma01";
export const NARPAT_SINGH_VENDOR_AGREEMENT_ID = "a1b2c3d4-e5f6-4789-a012-narpatsingh01";

export function createSunnyMeenaVendorAgreementData(): AgreementData {
  const base = createDefaultAgreementData("partnership", "en");
  return {
    ...base,
    partyIsIndividual: true,
    party: {
      ...base.party,
      entityName: "Vikrant Meena",
      address: "Jobner",
      aadhaar: "9687 4732 3080",
      representativeName: "",
      representativeTitle: "",
      gst: "",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export function createRaviSharmaVendorAgreementData(): AgreementData {
  const base = createDefaultAgreementData("partnership", "en");
  return {
    ...base,
    partyIsIndividual: true,
    party: {
      ...base.party,
      entityName: "Ravi Sharma",
      address: "34, Ladu baba ki dhani, ajmer road, sanjhariya, thikariya, Sanganer, Jaipur, Rajasthan, 302026",
      aadhaar: "8253 3187 3865",
      representativeName: "",
      representativeTitle: "",
      gst: "",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export function createNarpatSinghVendorAgreementData(): AgreementData {
  const base = createDefaultAgreementData("partnership", "en");
  return {
    ...base,
    partyIsIndividual: false,
    party: {
      ...base.party,
      entityName: "Shri Harivansh Construction",
      address: "Rajpota ka mohalla, Dhanani, Nagaur, Rajasthan, 341022",
      representativeName: "Narpat Singh",
      representativeTitle: "Proprietor",
      aadhaar: "6220 0589 6993",
      gst: "08DYVPS1105L1ZT",
    },
    showVendorChargePerWatt: true,
    vendorChargePerWatt: "1",
  };
}

export function createDefaultAgreementData(
  template: AgreementTemplate = "partnership",
  language: AgreementLanguage = "en",
): AgreementData {
  const baseWitnesses = [
    { id: uuid(), name: "" },
    { id: uuid(), name: "" },
  ];

  if (template === "inc-installation-assign") {
    return {
      template: "inc-installation-assign",
      language: "en",
      title: "INSTALLATION ASSIGNMENT AGREEMENT (INC PROJECTS)",
      effectiveDate: today,
      company: defaultCompany(),
      party: {
        entityName: "",
        partyLabel: "Contractor",
        address: "",
        representativeName: "",
        representativeTitle: "",
        consumerNumber: "",
        discom: "",
        aadhaar: "",
        gst: "",
      },
      variableFields: incAssignVariableFields,
      variables: { ...incAssignVariableDefaults },
      introTemplate: incAssignIntroTemplate,
      recitals: incAssignRecitals,
      preambleAfterRecitals: incAssignPreamble,
      sections: createIncInstallationAssignSections(),
      closingParagraph: incAssignClosing,
      governingLawParagraph: incAssignGoverningLaw,
      partyIsIndividual: false,
      showVendorChargePerWatt: false,
      vendorChargePerWatt: "",
      showWitnesses: true,
      witnesses: baseWitnesses,
      showPageNumbers: true,
      showLetterhead: true,
    };
  }

  if (template === "inc-goodwill-execution") {
    return {
      template: "inc-goodwill-execution",
      language: "en",
      title: "GOODWILL PROJECT EXECUTION AGREEMENT (INC PROJECT)",
      effectiveDate: today,
      company: defaultCompany(),
      party: {
        entityName: "",
        partyLabel: "Beneficiary",
        address: "",
        representativeName: "",
        representativeTitle: "",
        consumerNumber: "",
        discom: "JVVNL",
        aadhaar: "",
        gst: "",
      },
      variableFields: incGoodwillVariableFields,
      variables: { ...incGoodwillVariableDefaults },
      introTemplate: incGoodwillIntroTemplate,
      recitals: incGoodwillRecitals,
      preambleAfterRecitals: incGoodwillPreamble,
      sections: createIncGoodwillSections(),
      closingParagraph: incGoodwillClosing,
      governingLawParagraph: incGoodwillGoverningLaw,
      partyIsIndividual: false,
      showVendorChargePerWatt: false,
      vendorChargePerWatt: "",
      showWitnesses: true,
      witnesses: baseWitnesses,
      showPageNumbers: true,
      showLetterhead: true,
    };
  }

  const isHindi = language === "hi";
  return {
    template: "partnership",
    language: isHindi ? "hi" : "en",
    title: isHindi ? partnershipTitleHi : "VENDOR CODE AUTHORISATION AGREEMENT",
    effectiveDate: today,
    company: defaultCompany(),
    party: {
      entityName: "",
      partyLabel: isHindi ? "अधिकृत फर्म" : "Authorised Firm",
      address: "",
      representativeName: "",
      representativeTitle: "",
      consumerNumber: "",
      discom: "",
      aadhaar: "",
      gst: "",
    },
    variableFields: partnershipVariableFields,
    variables: { ...partnershipVariableDefaults },
    introTemplate: isHindi ? partnershipIntroTemplateHi : partnershipIntroTemplate,
    recitals: isHindi ? partnershipRecitalsHi : partnershipRecitals,
    preambleAfterRecitals: isHindi ? partnershipPreambleHi : partnershipPreamble,
    sections: isHindi ? createPartnershipSectionsHi() : createPartnershipSections(),
    closingParagraph: isHindi ? partnershipClosingHi : partnershipClosing,
    governingLawParagraph: isHindi ? partnershipGoverningLawHi : partnershipGoverningLaw,
    partyIsIndividual: false,
    showVendorChargePerWatt: false,
    vendorChargePerWatt: "",
    showWitnesses: true,
    witnesses: baseWitnesses,
    showPageNumbers: true,
    showLetterhead: true,
  };
}

/**
 * Returns a copy of `data` with all template text replaced by the chosen
 * language's defaults. Preserves user-filled values: company info, party
 * info, variable values, witness names, effective date, and document flags.
 * Falls back to English if Hindi is not supported for the template.
 */
export function switchAgreementLanguage(
  data: AgreementData,
  language: AgreementLanguage,
): AgreementData {
  const effectiveLanguage: AgreementLanguage =
    language === "hi" && !isHindiSupported(data.template) ? "en" : language;
  const fresh = createDefaultAgreementData(data.template, effectiveLanguage);

  return {
    ...fresh,
    effectiveDate: data.effectiveDate,
    company: { ...fresh.company, ...data.company },
    party: { ...fresh.party, ...data.party, partyLabel: fresh.party.partyLabel },
    variables: { ...fresh.variables, ...data.variables },
    witnesses: data.witnesses.length ? data.witnesses : fresh.witnesses,
    partyIsIndividual: data.partyIsIndividual,
    showVendorChargePerWatt: data.showVendorChargePerWatt,
    vendorChargePerWatt: data.vendorChargePerWatt,
    showWitnesses: data.showWitnesses,
    showPageNumbers: data.showPageNumbers,
    showLetterhead: data.showLetterhead,
  };
}

export function normalizeAgreementData(input?: Partial<AgreementData> | null): AgreementData {
  const rawTemplate = input?.template ?? null;
  const template: AgreementTemplate = isAgreementTemplate(rawTemplate) ? rawTemplate : "partnership";
  const language: AgreementLanguage = input?.language === "hi" ? "hi" : "en";
  const defaults = createDefaultAgreementData(template, language);

  return {
    ...defaults,
    ...input,
    template,
    language:
      input?.language === "hi" && isHindiSupported(template) ? "hi" : defaults.language,
    company: { ...defaults.company, ...input?.company },
    party: { ...defaults.party, ...input?.party },
    variableFields: input?.variableFields?.length ? input.variableFields : defaults.variableFields,
    variables: { ...defaults.variables, ...input?.variables },
    recitals: input?.recitals ?? defaults.recitals,
    sections: input?.sections ?? defaults.sections,
    witnesses: input?.witnesses ?? defaults.witnesses,
    showVendorChargePerWatt: input?.showVendorChargePerWatt ?? defaults.showVendorChargePerWatt,
    vendorChargePerWatt: input?.vendorChargePerWatt ?? defaults.vendorChargePerWatt,
  };
}
