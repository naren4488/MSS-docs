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
    label: "Sales Partner Agreement",
    description:
      "Engage a sales / installation partner under your vendorship code. Includes scope, payment split, confidentiality and termination.",
  },
  {
    id: "vendor",
    label: "Vendor Agreement (Customer)",
    description:
      "Installation contract between Mahi Solar (as Vendor) and a residential applicant under the Rooftop Solar Programme. Includes scope, warranties, performance guarantee and cancellation.",
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
  "vendor",
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
    name: "Mahi Solar Solutions",
    logoUrl: "",
    address: "Plot No. 44, Jai Bhawani Vihar Vistar, Kalwar Road, Govindpura, Jaipur, Rajasthan, 302012",
    phone: "+91 9928413501",
    email: "mahisolarsolution@gmail.com",
    website: "",
    cin: "",
    gst: "08GPEPK1479A1ZZ",
    representativeName: "Mahendra Kumawat",
    representativeTitle: "Founder",
  };
}

const today = new Date().toISOString().slice(0, 10);

// ---------- Partnership template ----------

const partnershipVariableFields: AgreementVariableField[] = [
  { key: "region", label: "Operating Region / Territory", helper: "e.g. Jaipur Rural, Rajasthan" },
  { key: "scheme", label: "Scheme Name", helper: "e.g. DBT Subsidy Scheme" },
  { key: "discom", label: "DISCOM", helper: "e.g. JVVNL" },
  { key: "oAndMYears", label: "Operation & Maintenance Tenure (years)" },
  { key: "advancePct", label: "Advance Release %", helper: "e.g. 90" },
  { key: "balancePct", label: "Balance Release %", helper: "e.g. 10" },
  { key: "commissionMonths", label: "Commission Survival Period (months)", helper: "e.g. 12" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const partnershipVariableDefaults: Record<string, string> = {
  region: "Jaipur Rural, Rajasthan",
  scheme: "DBT Subsidy Scheme",
  discom: "JVVNL",
  oAndMYears: "5",
  advancePct: "90",
  balancePct: "10",
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
            text: "Partner agrees to execute the services related to {{var.scheme}} in the region of {{var.region}} under the name of {{company.name}} for the same.",
          },
          { label: "b", text: "{{company.name}} and Partner shall perform the following during the term of this Agreement:" },
          {
            label: "c",
            text:
              "Partner is responsible for order finalization, material procurement, and execution of the installation process along with the work related to DISCOM and Net Metering.",
          },
          {
            label: "d",
            text:
              "Partner shall ensure the quality of products and installation as per the norms mentioned by the National Portal for Solar Rooftop.",
          },
          {
            label: "e",
            text:
              "Responsibility for operation and maintenance of such projects is solely of the Partner for at least {{var.oAndMYears}} years.",
          },
          {
            label: "f",
            text:
              "Partner shall provide the complete details of finalized customers to {{company.name}} representatives for applying for subsidy and for regular feedback on the performance of the plant installed.",
          },
          {
            label: "g",
            text:
              "Partner will provide the complete details of the plant including product specifications, data sheets, serial numbers, site coordinates, IDs, passwords and any other information required from time to time.",
          },
          {
            label: "h",
            text:
              "Partner is responsible for collection of all payments from the customer. {{company.name}} shall in no circumstances be responsible for any amount due from the customer.",
          },
          {
            label: "i",
            text:
              "Partner shall collect all payment from its customer under {{var.scheme}} into the bank account of {{company.name}}. {{company.name}} will release {{var.advancePct}}% of the funds to Partner for procurement and execution of the project. The balance {{var.balancePct}}% will be released, after deducting the mutually agreed charges for facilitating the scheme for customers, upon successful execution of the project along with net metering.",
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
              "{{company.name}} may visit and verify any project of a customer executed under this Agreement at any suitable time, with or without prior information to Partner.",
          },
          {
            label: "m",
            text:
              "Partner shall ensure that customer service rendered under this Agreement is genuine and that no negative ratings, complaints or punch points arise from customers. Any complaints or punch points raised by a customer shall be resolved by Partner at Partner's own cost within a reasonable time. If Partner fails to resolve them, {{company.name}} may undertake such resolution and recover the cost from Partner in accordance with {{company.name}}'s prevailing terms.",
          },
        ],
      }),
    ]),
    section("Compliance & Conduct", [
      clause({
        number: "2",
        title: "Safety, Insurance & Subcontracting",
        content: "Partner shall ensure compliance with the following obligations in connection with all projects under this Agreement:",
        subPoints: [
          {
            label: "a",
            text:
              "Partner is solely responsible for installer and worker safety, site safety, and compliance with applicable statutory and electrical safety norms at all installation sites. {{company.name}} shall not be liable for safety failures attributable to Partner or its personnel.",
          },
          {
            label: "b",
            text:
              "Partner shall maintain adequate workmen's compensation, third-party liability, or other insurance as applicable to its operations, where required by law or prudent business practice.",
          },
          {
            label: "c",
            text:
              "Partner shall not subcontract any work assigned under this Agreement without {{company.name}}'s prior written consent.",
          },
          {
            label: "d",
            text:
              "Partner shall not offer or accept improper inducements in connection with subsidy, DISCOM, or National Portal processes, and shall conduct business with integrity and in good faith.",
          },
        ],
      }),
    ]),
    section("General Terms", [
      clause({
        number: "3",
        title: "Independent Contractor & Limitation of Liability",
        content:
          "Partner agrees that Partner is an independent contractor, not {{company.name}}'s partner, agent or employee. Partner shall bear its own expenses in connection with this Agreement without any reimbursement by {{company.name}}. Partner understands and agrees that this arrangement is on a non-exclusive basis and that {{company.name}} may engage other parties to assist in its sales efforts with respect to the Services or any other services, as and wherever it desires.\n\nIN NO EVENT SHALL {{company.name}} BE LIABLE TO PARTNER, CUSTOMERS OR TO ANY THIRD PARTY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING, BUT NOT LIMITED TO, ANY DAMAGES FOR LOST PROFITS, LOST SAVINGS, INTERRUPTION OF BUSINESS, LOSS OF TECHNOLOGY OR LOST DATA, HOWEVER ARISING, WHETHER UNDER THEORIES OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, EVEN IF {{company.name}} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. {{company.name}}'S TOTAL CUMULATIVE LIABILITY UNDER THIS AGREEMENT SHALL BE LIMITED IN THE AGGREGATE TO THE TOTAL AMOUNT OF COMMISSIONS PAID TO {{company.name}} BY PARTNER AGAINST THE PARTICULAR CUSTOMER.",
      }),
      clause({
        number: "4",
        title: "Confidentiality",
        content:
          "All information that {{company.name}} discloses to Partner hereunder (\"Confidential Information\"), including any information concerning an approved prospect, shall always be treated as confidential by Partner during the term of this Agreement and thereafter, and shall not be disclosed to a third party without {{company.name}}'s prior written consent. Partner shall not use any of the Confidential Information except in the performance of its duties hereunder. All Information provided to Partner shall be returned to {{company.name}} immediately upon request.",
      }),
      clause({
        number: "5",
        title: "Term & Termination",
        content:
          "This Agreement shall be effective as of the Effective Date and shall continue until either Party sends the other written notice of termination. Termination of this Agreement shall be effective immediately. Commissions shall be paid only so long as such customer remains a {{company.name}} customer and provided this Agreement has not been terminated (for a period not to exceed {{var.commissionMonths}} months). Upon termination of this Agreement by {{company.name}} for cause, all payment of commissions by Partner shall be released immediately.",
      }),
    ]),
  ];
}

const partnershipGoverningLaw =
  "In case any dispute arises in respect of the validity, interpretation, implementation or alleged breach of this Agreement, the Parties shall attempt in the first instance to resolve the same through negotiation. If the disputes are not resolved through negotiation, either Party may refer the dispute for resolution to arbitration by a sole arbitrator in consonance with the provisions of the Arbitration and Conciliation Act, 1996 or any subsequent enactment or amendment thereto, and the decision of the arbitrator shall be binding upon the Parties. The place of arbitration shall be at {{var.arbitrationVenue}}. Each Party shall bear its own cost of arbitration.";

const partnershipClosing =
  "By signing below, the Parties agree that this Agreement constitutes the entire agreement between the Parties and shall only be modified by a written instrument executed by an authorized officer of both Parties.";

const partnershipIntroTemplate =
  "THIS AGREEMENT (the \"Agreement\") is made as of {{effectiveDateFormatted}} (the \"Effective Date\") by and between {{company.name}} with a principal place of business at {{company.address}}.\n\nAnd the business named {{party.entityName}} (\"Partner\") with a principal place of business located at {{party.address}}.";

const partnershipRecitals = [
  "{{company.name}} promotes, markets and sells certain solar energy solutions (the \"Services\");",
  "Partner has business contacts who could benefit from {{company.name}}'s services.",
  "{{company.name}} desires to grant to Partner, and Partner desires to obtain from {{company.name}}, the non-exclusive right to promote, market and execute the Services.",
];

const partnershipPreamble =
  "NOW, THEREFORE, in consideration of the mutual promises hereinafter set forth, {{company.name}} and Partner do hereby agree as follows:";

// ---------- Partnership template (Hindi) ----------

const partnershipTitleHi = "विक्रय पार्टनर समझौता";

const partnershipIntroTemplateHi =
  "यह समझौता (\"समझौता\") {{effectiveDateFormatted}} (\"प्रभावी तिथि\") को {{company.name}}, जिसका मुख्य कार्यस्थल {{company.address}} पर है, एवं {{party.entityName}} (\"पार्टनर\"), जिसका मुख्य कार्यस्थल {{party.address}} पर है, के मध्य निष्पादित किया गया है।";

const partnershipRecitalsHi = [
  "{{company.name}} कतिपय सौर ऊर्जा समाधानों (इसके पश्चात् \"सेवाएँ\") का प्रचार, विपणन एवं विक्रय करता है;",
  "पार्टनर के पास ऐसे व्यावसायिक संपर्क हैं जो {{company.name}} की सेवाओं से लाभान्वित हो सकते हैं;",
  "{{company.name}} इन सेवाओं के प्रचार, विपणन एवं निष्पादन का गैर-अनन्य अधिकार पार्टनर को प्रदान करने का इच्छुक है, तथा पार्टनर ऐसा अधिकार प्राप्त करने का इच्छुक है।",
];

const partnershipPreambleHi =
  "अतः, यहाँ उल्लिखित पारस्परिक वचनों के प्रतिफल में, {{company.name}} एवं पार्टनर निम्नलिखित शर्तों पर सहमत होते हैं:";

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
            text: "पार्टनर सहमत है कि वह {{var.scheme}} से संबंधित सेवाओं को {{var.region}} क्षेत्र में {{company.name}} के नाम से निष्पादित करेगा।",
          },
          { label: "ख", text: "{{company.name}} एवं पार्टनर इस समझौते की अवधि में निम्नलिखित कार्य करेंगे:" },
          {
            label: "ग",
            text:
              "ऑर्डर की पुष्टि, सामग्री की खरीद, स्थापना प्रक्रिया का निष्पादन तथा DISCOM एवं नेट मीटरिंग से संबंधित कार्य पार्टनर की ज़िम्मेदारी है।",
          },
          {
            label: "घ",
            text:
              "पार्टनर यह सुनिश्चित करेगा कि उत्पादों एवं स्थापना की गुणवत्ता राष्ट्रीय सौर रूफटॉप पोर्टल द्वारा निर्धारित मानकों के अनुरूप हो।",
          },
          {
            label: "ङ",
            text:
              "ऐसी परियोजनाओं के संचालन एवं रखरखाव की संपूर्ण ज़िम्मेदारी कम से कम {{var.oAndMYears}} वर्षों तक पार्टनर की होगी।",
          },
          {
            label: "च",
            text:
              "पार्टनर सब्सिडी के आवेदन तथा स्थापित संयंत्र की कार्यक्षमता पर नियमित प्रतिक्रिया हेतु अंतिम रूप दिए गए ग्राहकों का संपूर्ण विवरण {{company.name}} के प्रतिनिधियों को उपलब्ध कराएगा।",
          },
          {
            label: "छ",
            text:
              "पार्टनर संयंत्र का संपूर्ण विवरण, जिसमें उत्पाद विशिष्टताएँ, डेटा शीट, सीरियल नंबर, साइट निर्देशांक, आईडी, पासवर्ड एवं समय-समय पर अपेक्षित अन्य कोई जानकारी सम्मिलित है, प्रदान करेगा।",
          },
          {
            label: "ज",
            text:
              "ग्राहक से समस्त भुगतान एकत्रित करने की ज़िम्मेदारी पार्टनर की होगी। ग्राहक की ओर से देय किसी भी राशि के लिए {{company.name}} किसी भी परिस्थिति में उत्तरदायी नहीं होगा।",
          },
          {
            label: "झ",
            text:
              "पार्टनर {{var.scheme}} के अंतर्गत अपने ग्राहक से समस्त भुगतान {{company.name}} के बैंक खाते में एकत्रित करेगा। {{company.name}} परियोजना की खरीद एवं निष्पादन हेतु {{var.advancePct}}% राशि पार्टनर को निर्गत करेगा। शेष {{var.balancePct}}% राशि, ग्राहकों के लिए योजना के सुगम क्रियान्वयन हेतु पारस्परिक रूप से सहमत शुल्क की कटौती के पश्चात्, परियोजना के नेट मीटरिंग सहित सफल निष्पादन पर निर्गत की जाएगी।",
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
              "{{company.name}} इस समझौते के अंतर्गत किसी ग्राहक की निष्पादित परियोजना का निरीक्षण एवं सत्यापन, पार्टनर को पूर्व सूचना के साथ अथवा उसके बिना, किसी भी उपयुक्त समय पर कर सकता है।",
          },
          {
            label: "ड",
            text:
              "पार्टनर यह सुनिश्चित करेगा कि इस समझौते के अंतर्गत प्रदान की जाने वाली ग्राहक सेवा वास्तविक हो तथा ग्राहकों की ओर से कोई नकारात्मक रेटिंग, शिकायत अथवा पंच पॉइंट उत्पन्न न हो। ग्राहक द्वारा उठाई गई कोई भी शिकायत अथवा पंच पॉइंट का निवारण पार्टनर अपने व्यय पर उचित समयावधि में करेगा। यदि पार्टनर उनका निवारण करने में विफल रहता है, तो {{company.name}} स्वयं ऐसे निवारण का दायित्व ले सकता है तथा {{company.name}} की प्रचलित शर्तों के अनुसार उसका व्यय पार्टनर से वसूल कर सकता है।",
          },
        ],
      }),
    ]),
    section("अनुपालन एवं आचरण", [
      clause({
        number: "2",
        title: "सुरक्षा, बीमा एवं उपठेका",
        content: "पार्टनर इस समझौते के अंतर्गत समस्त परियोजनाओं के संबंध में निम्नलिखित दायित्वों का अनुपालन सुनिश्चित करेगा:",
        subPoints: [
          {
            label: "क",
            text:
              "इंस्टॉलर एवं श्रमिक सुरक्षा, साइट सुरक्षा, तथा सभी स्थापना स्थलों पर लागू सांविधिक एवं विद्युत सुरक्षा मानकों के अनुपालन की संपूर्ण ज़िम्मेदारी पार्टनर की होगी। पार्टनर अथवा उसके कार्मिकों से संबंधित किसी सुरक्षा विफलता हेतु {{company.name}} उत्तरदायी नहीं होगा।",
          },
          {
            label: "ख",
            text:
              "पार्टनर अपने संचालन पर लागू पर्याप्त श्रमिक मुआवजा, तृतीय-पक्ष दायित्व अथवा अन्य बीमा, जैसा विधि द्वारा अथवा विवेकपूर्ण व्यावसायिक प्रथा के अनुसार आवश्यक हो, बनाए रखेगा।",
          },
          {
            label: "ग",
            text:
              "पार्टनर {{company.name}} की पूर्व लिखित सहमति के बिना इस समझौते के अंतर्गत सौंपे गए किसी भी कार्य का उपठेका नहीं देगा।",
          },
          {
            label: "घ",
            text:
              "पार्टनर सब्सिडी, DISCOM अथवा राष्ट्रीय पोर्टल प्रक्रियाओं के संबंध में किसी अनुचित प्रलोभन की पेशकश अथवा स्वीकृति नहीं करेगा, तथा सद्भावना एवं ईमानदारी के साथ व्यवसाय का संचालन करेगा।",
          },
        ],
      }),
    ]),
    section("सामान्य शर्तें", [
      clause({
        number: "3",
        title: "स्वतंत्र ठेकेदार एवं दायित्व की सीमा",
        content:
          "पार्टनर सहमत है कि पार्टनर एक स्वतंत्र ठेकेदार है, न कि {{company.name}} का पार्टनर, एजेंट अथवा कर्मचारी। पार्टनर इस समझौते से संबंधित अपने व्ययों को {{company.name}} से किसी प्रतिपूर्ति की मांग किए बिना स्वयं वहन करेगा। पार्टनर समझता है एवं सहमत है कि यह व्यवस्था गैर-अनन्य आधार पर है तथा {{company.name}} सेवाओं अथवा किसी अन्य सेवा से संबंधित अपने विक्रय प्रयासों में सहायता हेतु अन्य पक्षों को जब एवं जहाँ चाहे संलग्न कर सकता है।\n\nकिसी भी परिस्थिति में {{company.name}} पार्टनर, ग्राहकों अथवा किसी तृतीय पक्ष के प्रति किसी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी अथवा दंडात्मक क्षति हेतु, जिसमें खोए हुए लाभ, खोई हुई बचत, व्यवसाय व्यवधान, प्रौद्योगिकी की हानि अथवा खोए हुए डेटा से संबंधित कोई भी क्षति सम्मिलित है, चाहे वह संविदा, अपकृत्य (लापरवाही सहित), कठोर दायित्व अथवा अन्य किसी सिद्धांत के अंतर्गत उत्पन्न हुई हो, उत्तरदायी नहीं होगा, भले ही {{company.name}} को ऐसी क्षतियों की संभावना से अवगत कराया गया हो। इस समझौते के अंतर्गत {{company.name}} का संपूर्ण संचयी दायित्व, संबंधित ग्राहक के विरुद्ध पार्टनर द्वारा {{company.name}} को भुगतान किए गए कुल कमीशन की राशि तक सीमित रहेगा।",
      }),
      clause({
        number: "4",
        title: "गोपनीयता",
        content:
          "{{company.name}} द्वारा पार्टनर को इस समझौते के अंतर्गत प्रकट की गई समस्त जानकारी (\"गोपनीय जानकारी\"), जिसमें किसी अनुमोदित संभावित ग्राहक से संबंधित कोई भी जानकारी सम्मिलित है, पार्टनर द्वारा इस समझौते की अवधि में एवं उसके पश्चात् भी सर्वदा गोपनीय रूप से संधारित की जाएगी, तथा {{company.name}} की पूर्व लिखित सहमति के बिना किसी तृतीय पक्ष को प्रकट नहीं की जाएगी। पार्टनर इस समझौते के अंतर्गत अपने कर्तव्यों के निष्पादन के अतिरिक्त किसी भी गोपनीय जानकारी का उपयोग नहीं करेगा। पार्टनर को प्रदत्त समस्त जानकारी मांग किए जाने पर अविलंब {{company.name}} को वापस की जाएगी।",
      }),
      clause({
        number: "5",
        title: "अवधि एवं समाप्ति",
        content:
          "यह समझौता प्रभावी तिथि से लागू होगा तथा तब तक प्रभावी रहेगा जब तक कोई एक पक्ष दूसरे को समाप्ति की लिखित सूचना प्रदान नहीं करता। इस समझौते की समाप्ति तत्काल प्रभावी होगी। कमीशन का भुगतान केवल तब तक किया जाएगा जब तक संबंधित ग्राहक {{company.name}} का ग्राहक बना रहता है तथा यह समझौता समाप्त नहीं हुआ हो (अधिकतम {{var.commissionMonths}} माह की अवधि हेतु)। {{company.name}} द्वारा किसी कारण से इस समझौते की समाप्ति पर, पार्टनर द्वारा देय समस्त कमीशन का भुगतान अविलंब निर्गत किया जाएगा।",
      }),
    ]),
  ];
}

const partnershipGoverningLawHi =
  "इस समझौते की वैधता, व्याख्या, क्रियान्वयन अथवा कथित उल्लंघन के संबंध में कोई विवाद उत्पन्न होने पर, पक्षकार प्रथमतः उसका समाधान आपसी विचार-विमर्श से करने का प्रयास करेंगे। यदि विवाद विचार-विमर्श से समाधान नहीं हो पाते, तो कोई भी पक्ष विवाद के समाधान हेतु एकमात्र मध्यस्थ द्वारा माध्यस्थम् के लिए संदर्भित कर सकता है, जो माध्यस्थम् एवं सुलह अधिनियम, 1996 अथवा उसके किसी पश्चातवर्ती अधिनियमन अथवा संशोधन के प्रावधानों के अनुरूप होगा, तथा मध्यस्थ का निर्णय पक्षकारों पर बाध्यकारी होगा। माध्यस्थम् का स्थान {{var.arbitrationVenue}} होगा। प्रत्येक पक्ष माध्यस्थम् का अपना व्यय स्वयं वहन करेगा।";

const partnershipClosingHi =
  "नीचे हस्ताक्षर करके, पक्षकार सहमत होते हैं कि यह समझौता पक्षकारों के मध्य संपूर्ण समझौता है तथा इसे केवल दोनों पक्षकारों के प्राधिकृत अधिकारियों द्वारा निष्पादित लिखित लिखत द्वारा ही संशोधित किया जा सकता है।";

// ---------- Vendor template ----------

const vendorVariableFields: AgreementVariableField[] = [
  { key: "scheme", label: "Programme / Scheme", helper: "e.g. Rooftop Solar Programme Ph-II" },
  { key: "ministry", label: "Issuing Ministry", helper: "e.g. MNRE" },
  { key: "capacity", label: "RTS System Capacity (kWp)" },
  { key: "moduleMake", label: "Solar Module Make" },
  { key: "moduleModel", label: "Solar Module Model" },
  { key: "moduleWp", label: "Module Wp Capacity (per module)" },
  { key: "moduleEfficiency", label: "Module Efficiency (%)" },
  { key: "inverterMake", label: "Solar Inverter Make" },
  { key: "inverterModel", label: "Solar Inverter Model" },
  { key: "inverterKw", label: "Inverter Rated Output (kW)" },
  { key: "costRs", label: "Total Cost (Rs.)" },
  { key: "costWords", label: "Total Cost (in words)" },
  { key: "advancePct", label: "Advance % on Order Confirmation" },
  { key: "dispatchPct", label: "% Against PI Before Dispatch" },
  { key: "commissioningPct", label: "% After Commissioning" },
  { key: "warrantyYears", label: "Workmanship Warranty (years)" },
  { key: "performanceRatio", label: "Performance Ratio Guarantee (%)" },
  { key: "approvalDays", label: "Drawing Approval Window (days)" },
  { key: "defectReportingDays", label: "Defect Reporting Window (days)" },
  { key: "cancellationDays", label: "Cancellation Cooling-Off (days)" },
  { key: "cancellationFeePct", label: "Post Cooling-Off Cancellation Fee %" },
  { key: "arbitrationVenue", label: "Arbitration Venue" },
];

const vendorVariableDefaults: Record<string, string> = {
  scheme: "Rooftop Solar Programme Ph-II",
  ministry: "MNRE",
  capacity: "5",
  moduleMake: "Waaree",
  moduleModel: "WS-540",
  moduleWp: "540",
  moduleEfficiency: "21",
  inverterMake: "Growatt",
  inverterModel: "MIN 5000TL-X",
  inverterKw: "5",
  costRs: "3,00,000",
  costWords: "Three Lakhs only",
  advancePct: "25",
  dispatchPct: "70",
  commissioningPct: "5",
  warrantyYears: "5",
  performanceRatio: "75",
  approvalDays: "5",
  defectReportingDays: "15",
  cancellationDays: "7",
  cancellationFeePct: "10",
  arbitrationVenue: "Jaipur",
};

function createVendorSections(): AgreementSection[] {
  return [
    section("General Terms", [
      clause({
        number: "1.1",
        content:
          "The Applicant hereby represents and warrants that the Applicant has the sole legal capacity to enter into this Agreement and authorise the construction, installation and commissioning of the Rooftop Solar System (\"RTS System\") which is inclusive of Balance of System (\"BoS\") on the Applicant's premises (\"Applicant Site\"). The Vendor reserves its right to verify ownership of the Applicant Site and Applicant covenants to co-operate and provide all information and documentation required by the Vendor for the same.",
      }),
      clause({
        number: "1.2",
        content:
          "Vendor may propose changes to the scope, nature and/or schedule of the services being performed under this Agreement. All proposed changes must be mutually agreed between the Parties. If the Parties fail to agree on the variation proposed, either Party may terminate this Agreement by serving notice as per the Notices clause.",
      }),
      clause({
        number: "1.3",
        content:
          "The Applicant understands and agrees that future changes in load, electricity usage patterns and/or electricity tariffs may affect the economics of the RTS System and these factors have not been and cannot be considered in any analysis or quotation provided by Vendor or its Authorised Persons.",
      }),
      clause({
        number: "1.4",
        title: "Installation Safety",
        content:
          "The Vendor shall carry out installation using qualified personnel and in compliance with applicable electrical safety norms and good industry practice. The Applicant shall cooperate by providing safe and unobstructed site access and shall not interfere with the Vendor's safe work practices.",
      }),
    ]),
    section("RTS System", [
      clause({
        number: "2.1",
        content:
          "Total capacity of the RTS System will be minimum {{var.capacity}} kWp.",
        subPoints: [
          { label: "a", text: "The solar modules, inverters and BoS will conform to minimum specifications and DCR requirement of {{var.ministry}}." },
          {
            label: "b",
            text:
              "Solar modules of {{var.moduleMake}} make, {{var.moduleModel}} model, {{var.moduleWp}} Wp capacity each and {{var.moduleEfficiency}}% efficiency will be procured and installed by the Vendor.",
          },
          {
            label: "c",
            text:
              "Solar inverter of {{var.inverterMake}} make, {{var.inverterModel}} model, {{var.inverterKw}} kW rated output capacity will be procured and installed by the Vendor.",
          },
          {
            label: "d",
            text: "Module mounting structure shall withstand the minimum wind load pressure as specified by {{var.ministry}}.",
          },
          { label: "e", text: "Other BoS installations shall be as per best industry practice with all safety and protection gears installed by the Vendor." },
        ],
      }),
    ]),
    section("Price & Payment Terms", [
      clause({
        number: "3.1",
        content:
          "The cost of the RTS System will be Rs. {{var.costRs}}/- ({{var.costWords}}). The Applicant shall pay the total cost to the Vendor as under:",
        subPoints: [
          { label: "i", text: "{{var.advancePct}}% as an advance on confirmation of the order;" },
          { label: "ii", text: "{{var.dispatchPct}}% against Proforma Invoice (PI) before dispatch of solar panels, inverters and other BoS items;" },
          { label: "iii", text: "{{var.commissioningPct}}% after installation and commissioning of the RTS System." },
        ],
      }),
      clause({
        number: "3.2",
        content:
          "The order value and payment terms are fixed and will not be subject to any adjustment except as approved in writing by the Vendor. Payment shall be made only through banker's cheque / NEFT / RTGS / online payment portal as intimated by the Vendor. No cash payments shall be accepted by the Vendor or its Authorised Persons.",
      }),
    ]),
    section("Representations Made by the Applicant", [
      clause({
        number: "4.1",
        content:
          "Any timeline or schedule shared by the Vendor for the provision of services and delivery of the RTS System is only an estimate and the Vendor will not be liable for any delay that is not attributable to the Vendor.",
      }),
      clause({
        number: "4.2",
        content:
          "All information disclosed by the Applicant to the Vendor in connection with the supply of the RTS System, services and generation estimation (including, without limitation, the load profile and power bill) is true and accurate, and the Applicant acknowledges that the Vendor has relied on this information to customise the RTS System layout and BoS design for the purposes of this Agreement.",
      }),
      clause({
        number: "4.3",
        content:
          "All descriptive specifications, illustrations, drawings, data, dimensions, quotations, fact sheets, price lists and any advertising material circulated, published or provided by the Vendor are approximate only.",
      }),
      clause({
        number: "4.4",
        content:
          "Any drawings, pre-feasibility report, specifications and plans composed by the Vendor shall require the Applicant's approval within {{var.approvalDays}} days of receipt by electronic mail. If the Applicant does not respond within this period, the drawings, specifications or plans shall be final and deemed to have been approved by the Applicant.",
      }),
      clause({
        number: "4.5",
        content:
          "The Applicant shall not use the RTS System or any part thereof other than in accordance with the product manufacturer's specifications, and any risk arising from misuse or misappropriate use shall be to the account of the Applicant alone.",
      }),
      clause({
        number: "4.6",
        content: "The Applicant represents, warrants and covenants that:",
        subPoints: [
          { label: "i", text: "All electrical and plumbing infrastructure at the Applicant Site is in conformity with applicable laws;" },
          { label: "ii", text: "The Applicant has the legal capacity to permit unfettered access to the Vendor and its Authorised Persons for the purposes of execution and performance of this Agreement;" },
          { label: "iii", text: "The Applicant has and will provide the requisite power, water and other resources and storage facilities for construction, installation, operation and maintenance of the RTS System;" },
          { label: "iv", text: "The Applicant will provide support for site fabrication of structure, assembly and fitting of module mounting structure at the Applicant Site;" },
          { label: "v", text: "The Applicant will ensure that the Applicant Site is shadow-free and free of all encumbrances during the lifetime of the RTS System;" },
          { label: "vi", text: "The Applicant shall regularly clean and ensure accessibility and safety to the RTS System as required by the Vendor and the dusting frequency at the premises;" },
          { label: "vii", text: "The Vendor is entitled to permit geo-tagging of the Applicant Site as a Vendor installation site;" },
          { label: "viii", text: "Unless otherwise intimated by the Applicant in writing, the Vendor is entitled to take photographs, videos and testimonials of the Applicant and the Applicant Site and create content which becomes the property of the Vendor, freely usable as part of promotional and marketing activities;" },
          { label: "ix", text: "The Applicant validates the stability of the Applicant Site for the installation of the RTS System." },
        ],
      }),
    ]),
    section("Maintenance", [
      clause({
        number: "5.1",
        content:
          "The Vendor shall provide {{var.warrantyYears}}-year free workmanship maintenance. The Vendor shall visit the Applicant's premises at least once every quarter after commissioning of the RTS System for maintenance purposes.",
      }),
      clause({
        number: "5.2",
        content:
          "During such maintenance visits, the Vendor shall check all nuts and bolts, fuses, earth resistance and other consumables in respect of the RTS System to ensure that it is in good working condition.",
      }),
      clause({
        number: "5.3",
        content:
          "Cleaning is the Applicant's responsibility — the minimum expectation is that the system will be cleaned regularly as per the dusting frequency.",
      }),
    ]),
    section("Access & Right of Entry", [
      clause({
        number: "6.1",
        content:
          "The Applicant hereby grants permission to the Vendor and its authorized personnel, representatives, associates, officers, employees, financing agents and subcontractors (\"Authorised Persons\") to enter the Applicant Site for the purposes of:",
        subPoints: [
          { label: "a", text: "Conducting feasibility study;" },
          { label: "b", text: "Storing the RTS System or any part thereof;" },
          { label: "c", text: "Installing the RTS System;" },
          { label: "d", text: "Inspecting the RTS System;" },
          { label: "e", text: "Conducting repairs and maintenance to the RTS System;" },
          { label: "f", text: "Removing the RTS System (or any part thereof), if necessary for any reason whatsoever;" },
          { label: "g", text: "Any other matters necessary to execute and perform its rights and obligations under this Agreement." },
        ],
      }),
      clause({
        number: "6.2",
        content:
          "The Applicant shall ensure that third-party consents necessary for the Authorised Persons to access the Applicant Site are obtained prior to commencement of services under this Agreement.",
      }),
    ]),
    section("Warranties", [
      clause({
        number: "7.1",
        title: "Product Warranty",
        content:
          "The Applicant shall be entitled to the manufacturers' warranty. Any warranty in relation to the RTS System supplied to the Applicant by the Vendor under this Agreement is limited to the warranty given by the manufacturer of the RTS System (or any part thereof) to the Vendor.",
      }),
      clause({
        number: "7.2",
        title: "Installation Warranty",
        content:
          "The Vendor warrants that all installations shall be free from workmanship defects or BoS defects for a period of {{var.warrantyYears}} years from the date of installation of the RTS System. The warranty is limited to the Vendor rectifying the workmanship or BoS defects at the Vendor's expense in respect of those defects reported by the Applicant in writing. The Applicant is obliged to report such defects within {{var.defectReportingDays}} days of occurrence of such defect.",
      }),
      clause({
        number: "7.3",
        content:
          "Subject to manufacturer warranty, the Vendor warrants that the solar modules supplied herein shall have tolerance within a five-percentage range (+/-5%). The peak-power point voltage and the peak-power point current of any supplied solar module and/or any module string shall not vary by more than 5% from the respective arithmetic means, provided the RTS System is properly maintained and the Applicant Site is free from shadow at the time of operation.",
      }),
      clause({
        number: "7.4",
        title: "Exceptions",
        content:
          "Exceptions for warranty:",
        subPoints: [
          { label: "a", text: "Any attempt by any person other than the Vendor or its Authorised Persons to adjust, modify, repair or provide maintenance to the RTS System shall disentitle the Applicant of the warranty provided hereunder." },
          { label: "b", text: "The Vendor shall not be liable for any degeneration or damage to the RTS System due to any action or inaction on the part of the Applicant." },
          { label: "c", text: "The Vendor shall not be bound or liable to remedy any damage, fault, failure or malfunction of the RTS System owing to external causes, including but not limited to accidents, misuse, neglect, non-conforming usage / storage / installation, modifications by the Applicant leading to shading or accessibility issues, failure to perform required maintenance, normal wear and tear, Force Majeure Event, or negligence or default attributable to the Applicant." },
          { label: "d", text: "The Vendor shall not be liable to repair or remedy any accessories or parts added to the RTS System that were not originally sourced by the Vendor for the Applicant." },
        ],
      }),
    ]),
    section("Performance Guarantee", [
      clause({
        number: "8.1",
        content:
          "The Vendor guarantees a minimum system performance ratio of {{var.performanceRatio}}% as per the performance ratio test carried out in adherence to IEC 61724 or equivalent BIS for a period of {{var.warrantyYears}} years.",
      }),
    ]),
    section("Insurance", [
      clause({
        number: "9.1",
        content:
          "The Vendor may, at its sole discretion, obtain insurance covering risks of loss / damage to the RTS System (or any part thereof) during transit from the Vendor's warehouse until delivery to the Applicant Site and until installation and commissioning.",
      }),
      clause({
        number: "9.2",
        content: "Thereafter, all risk shall pass to the Applicant and the Applicant may accordingly procure relevant insurances.",
      }),
    ]),
    section("Cancellation", [
      clause({
        number: "10.1",
        content:
          "The Applicant may cancel the order placed on the Vendor within {{var.cancellationDays}} days from the date of remittance of advance money or the date of order acceptance, whichever is earlier (\"Order Confirmation\"), by serving notice as per the Notices clause.",
      }),
      clause({
        number: "10.2",
        content:
          "If the Applicant cancels the order after the expiry of {{var.cancellationDays}} days from the date of the Order Form, the Applicant shall be liable to pay the Vendor a cancellation fee of {{var.cancellationFeePct}}% of the total order value plus costs and expenses incurred by the Vendor, including, costs for labour, design, return of products, administrative costs and subvention costs.",
      }),
      clause({
        number: "10.3",
        content:
          "Notwithstanding the aforesaid, the Applicant shall not be entitled to cancel the Order Form after the Vendor has dispatched the RTS System (or any part thereof, including BoS) to the Applicant Site. If the Applicant chooses to terminate the Order Form after dispatch, the entire amount paid by the Applicant till date shall be forfeited by the Vendor.",
      }),
    ]),
    section("Limitation of Liability & Indemnity", [
      clause({
        number: "11.1",
        content:
          "To the extent that terms implied by law apply to the RTS System and the services rendered under this Agreement, the Vendor's liability for any breach of those terms is limited to:",
        subPoints: [
          { label: "a", text: "Repairing or replacing the RTS System or any part thereof, as applicable; or" },
          { label: "b", text: "Refund of the moneys paid by the Applicant to the Vendor, if the Vendor cannot fulfil the order." },
        ],
      }),
      clause({
        number: "11.2",
        content:
          "The Vendor shall not be liable for delays, defects, or losses arising from the Applicant's failure to maintain site safety, shadow-free access, timely approvals, or cooperation required under this Agreement.",
      }),
    ]),
    section("Suspension & Termination", [
      clause({
        number: "12.1",
        content:
          "If the Applicant fails to pay any sum due under this Agreement on the due date, the Vendor may, in addition to its other rights under this Agreement, suspend its obligations under this Agreement until all outstanding amounts (including interest due) are paid.",
      }),
    ]),
    section("Notices", [
      clause({
        number: "13.1",
        content:
          "Any notice or other communication under this Agreement to the Vendor and/or to the Applicant shall be in writing, in the English language, and shall be delivered or sent (a) by electronic mail and/or (b) by hand delivery or registered post / courier, at the registered address of the Applicant or Vendor.",
      }),
    ]),
    section("Force Majeure Event", [
      clause({
        number: "14.1",
        content:
          "Neither Party shall be in default due to any delay or failure to perform its obligations under this Agreement which arises from or is a consequence of the occurrence of an event beyond the reasonable control of such Party, which makes performance impossible or so impractical as reasonably to be considered impossible — including, but not limited to, war, riot, civil disorder, earthquake, fire, explosion, storm, flood or other adverse weather conditions, pandemic, epidemic, embargo, strikes, lockouts, labour difficulties, other industrial action, acts of government, unavailability of equipment from a vendor, and changes requested by the Applicant (\"Force Majeure Event\").",
      }),
    ]),
  ];
}

const vendorGoverningLaw =
  "The interpretation and enforcement of this Agreement shall be governed by the laws of India. In the event of any dispute, controversy or difference between the Parties arising out of, or relating to, this Agreement, both Parties shall make an effort to resolve the dispute in good faith. Failing such resolution, any Party shall be entitled to refer the dispute to arbitration in the manner set out herein. The rights and obligations of the Parties under this Agreement shall remain in full force and effect pending the award in such arbitration proceeding. The arbitration shall be governed by the provisions of the Arbitration and Conciliation Act, 1996 and shall be settled by a sole arbitrator mutually appointed by the Parties. The place of arbitration shall be at {{var.arbitrationVenue}}.";

const vendorClosing =
  "By signing below, the Parties confirm that they have read, understood and agreed to the terms and conditions of this Agreement.";

const vendorIntroTemplate =
  "This agreement is executed on {{effectiveDateFormatted}} for design, installation, commissioning and {{var.warrantyYears}}-year comprehensive maintenance of a rooftop solar system to be installed under the simplified procedure of {{var.scheme}}.\n\nBETWEEN: {{party.entityName}}, having residential electricity connection with Consumer Number {{party.consumerNumber}} from {{party.discom}} (DISCOM) at {{party.address}} (hereinafter referred to as the \"Applicant\").\n\nAND: {{company.name}}, registered / empanelled with {{party.discom}} and having registered / functional office at {{company.address}} (hereinafter referred to as the \"Vendor\").\n\nBoth Applicant and Vendor are jointly referred to as the Parties.";

const vendorRecitals = [
  "The Applicant intends to install a rooftop solar system under the simplified procedure of {{var.scheme}} of {{var.ministry}}.",
  "The Vendor is registered / empanelled with the DISCOM for installation of rooftop solar under {{var.ministry}} schemes. The Vendor satisfies all existing regulations pertaining to electrical safety and licence in the respective state and is not debarred or blacklisted from undertaking such installations by any state or central government agency.",
  "Both Parties have mutually agreed and understand their roles and responsibilities, and have no liability to any other agency, firm or stakeholder, especially the DISCOM and {{var.ministry}}.",
];

const vendorPreamble = "";

// ---------- INC Installation Assignment template ----------

const incAssignVariableFields: AgreementVariableField[] = [
  { key: "scheme", label: "Scheme / Programme", helper: "e.g. DBT Subsidy Scheme" },
  { key: "region", label: "Assigned Region / Territory", helper: "e.g. Jaipur Rural, Rajasthan" },
  { key: "safetyStandards", label: "Safety Standards Reference", helper: "e.g. applicable electrical and height-work safety norms" },
  { key: "advancePct", label: "Advance Release %", helper: "e.g. 90" },
  { key: "balancePct", label: "Balance Release %", helper: "e.g. 10" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const incAssignVariableDefaults: Record<string, string> = {
  scheme: "DBT Subsidy Scheme",
  region: "Jaipur Rural, Rajasthan",
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
  { key: "scheme", label: "Scheme / Programme", helper: "e.g. Rooftop Solar Programme Ph-II" },
  { key: "ministry", label: "Issuing Ministry", helper: "e.g. MNRE" },
  { key: "capacity", label: "RTS System Capacity (kWp)" },
  { key: "estimatedTimeline", label: "Estimated Timeline", helper: "e.g. 45–60 days from site readiness" },
  { key: "materialProvision", label: "Materials Summary", helper: "e.g. modules, inverter, BoS as per agreed scope" },
  { key: "maintenanceYears", label: "Workmanship / Maintenance Period (years)", helper: "e.g. 5" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const incGoodwillVariableDefaults: Record<string, string> = {
  scheme: "Rooftop Solar Programme Ph-II",
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

export function createDefaultAgreementData(
  template: AgreementTemplate = "partnership",
  language: AgreementLanguage = "en",
): AgreementData {
  const baseWitnesses = [
    { id: uuid(), name: "" },
    { id: uuid(), name: "" },
  ];

  if (template === "vendor") {
    return {
      template: "vendor",
      language: "en",
      title: "VENDOR AGREEMENT",
      effectiveDate: today,
      company: defaultCompany(),
      party: {
        entityName: "",
        partyLabel: "Applicant",
        address: "",
        representativeName: "",
        representativeTitle: "",
        consumerNumber: "",
        discom: "JVVNL",
      },
      variableFields: vendorVariableFields,
      variables: { ...vendorVariableDefaults },
      introTemplate: vendorIntroTemplate,
      recitals: vendorRecitals,
      preambleAfterRecitals: vendorPreamble,
      sections: createVendorSections(),
      closingParagraph: vendorClosing,
      governingLawParagraph: vendorGoverningLaw,
      showWitnesses: true,
      witnesses: baseWitnesses,
      showPageNumbers: true,
      showLetterhead: true,
    };
  }

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
      },
      variableFields: incAssignVariableFields,
      variables: { ...incAssignVariableDefaults },
      introTemplate: incAssignIntroTemplate,
      recitals: incAssignRecitals,
      preambleAfterRecitals: incAssignPreamble,
      sections: createIncInstallationAssignSections(),
      closingParagraph: incAssignClosing,
      governingLawParagraph: incAssignGoverningLaw,
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
      },
      variableFields: incGoodwillVariableFields,
      variables: { ...incGoodwillVariableDefaults },
      introTemplate: incGoodwillIntroTemplate,
      recitals: incGoodwillRecitals,
      preambleAfterRecitals: incGoodwillPreamble,
      sections: createIncGoodwillSections(),
      closingParagraph: incGoodwillClosing,
      governingLawParagraph: incGoodwillGoverningLaw,
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
    title: isHindi ? partnershipTitleHi : "SALES PARTNER AGREEMENT",
    effectiveDate: today,
    company: defaultCompany(),
    party: {
      entityName: "",
      partyLabel: isHindi ? "पार्टनर" : "Partner",
      address: "",
      representativeName: "",
      representativeTitle: "",
      consumerNumber: "",
      discom: "",
    },
    variableFields: partnershipVariableFields,
    variables: { ...partnershipVariableDefaults },
    introTemplate: isHindi ? partnershipIntroTemplateHi : partnershipIntroTemplate,
    recitals: isHindi ? partnershipRecitalsHi : partnershipRecitals,
    preambleAfterRecitals: isHindi ? partnershipPreambleHi : partnershipPreamble,
    sections: isHindi ? createPartnershipSectionsHi() : createPartnershipSections(),
    closingParagraph: isHindi ? partnershipClosingHi : partnershipClosing,
    governingLawParagraph: isHindi ? partnershipGoverningLawHi : partnershipGoverningLaw,
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
    language: defaults.language,
    company: { ...defaults.company, ...input?.company },
    party: { ...defaults.party, ...input?.party },
    variableFields: input?.variableFields?.length ? input.variableFields : defaults.variableFields,
    variables: { ...defaults.variables, ...input?.variables },
    recitals: input?.recitals ?? defaults.recitals,
    sections: input?.sections ?? defaults.sections,
    witnesses: input?.witnesses ?? defaults.witnesses,
  };
}
