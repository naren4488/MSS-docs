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
    name: "Mahi Solar Solution",
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
  { key: "commissionMonths", label: "Commission Survival Period (months)", helper: "e.g. 12" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

const partnershipVariableDefaults: Record<string, string> = {
  region: "Jaipur Rural, Rajasthan",
  scheme: "DBT Subsidy Scheme",
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
              "Payment collection and release shall depend on the customer's chosen mode of payment under {{var.scheme}}: (a) where the customer pays in cash, Partner may collect such cash directly from the customer and use it to commence and execute the project, provided that Partner intimates {{company.name}} of each such cash transaction promptly with supporting details; (b) where the customer pays through a bank loan, the loan amount shall be disbursed by the lender directly into {{company.name}}'s bank account, typically in two and at times in three installments. {{company.name}} shall release funds to Partner from such loan proceeds only to the extent actually received from the bank, and after deducting the mutually agreed charges for facilitating the scheme. {{company.name}} shall not be obliged to advance any amount that has not yet been received from the lender; (c) where the customer pays through a combination of cash and loan, the cash component shall be handled as in (a) and the loan component as in (b). Any final balance retained by {{company.name}} shall be released upon successful execution of the project along with net metering.",
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

const partnershipTitleHi = "विक्रेता कोड प्राधिकरण समझौता";

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
              "{{var.scheme}} के अंतर्गत भुगतान का संग्रहण एवं निर्गमन ग्राहक द्वारा चयनित भुगतान विधि पर निर्भर होगा: (क) जहाँ ग्राहक नकद भुगतान करता है, वहाँ पार्टनर ऐसी नकद राशि सीधे ग्राहक से एकत्रित कर सकता है तथा परियोजना के क्रियान्वयन एवं निष्पादन हेतु उपयोग कर सकता है, बशर्ते कि पार्टनर ऐसे प्रत्येक नकद लेन-देन की सूचना समर्थक विवरणों सहित {{company.name}} को अविलंब प्रदान करे; (ख) जहाँ ग्राहक बैंक ऋण के माध्यम से भुगतान करता है, वहाँ ऋण राशि ऋणदाता द्वारा सीधे {{company.name}} के बैंक खाते में, सामान्यतः दो तथा कभी-कभी तीन किस्तों में, संवितरित की जाएगी। {{company.name}} ऐसी ऋण राशि से पार्टनर को केवल उतनी ही धनराशि निर्गत करेगा जितनी वस्तुतः बैंक से प्राप्त हुई है, तथा योजना के सुगम क्रियान्वयन हेतु पारस्परिक रूप से सहमत शुल्क की कटौती के पश्चात्। {{company.name}} ऐसी कोई राशि अग्रिम देने हेतु बाध्य नहीं होगा जो अभी तक ऋणदाता से प्राप्त नहीं हुई है; (ग) जहाँ ग्राहक नकद एवं ऋण के संयोजन से भुगतान करता है, वहाँ नकद घटक (क) के अनुसार एवं ऋण घटक (ख) के अनुसार संभाला जाएगा। {{company.name}} के पास शेष कोई भी अंतिम राशि परियोजना के नेट मीटरिंग सहित सफल निष्पादन पर निर्गत की जाएगी।",
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
    title: isHindi ? partnershipTitleHi : "VENDOR CODE AUTHORISATION AGREEMENT",
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
