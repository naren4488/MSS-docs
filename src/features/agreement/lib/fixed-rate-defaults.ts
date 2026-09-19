import type {
  AgreementClause,
  AgreementClauseSubPoint,
  AgreementClientRow,
  AgreementData,
  AgreementRateCard,
  AgreementSection,
  AgreementVariableField,
} from "../types/agreement";

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

export function createEmptyFixedRateFields(): Pick<
  AgreementData,
  | "dealHeading"
  | "dealIntro"
  | "rateCards"
  | "rateNote"
  | "showClientSchedule"
  | "clientScheduleHeading"
  | "clientScheduleIntro"
  | "clientRows"
  | "clientScheduleNote"
  | "otherClientScheduleHeading"
  | "otherClientScheduleIntro"
  | "otherClientRows"
> {
  return {
    dealHeading: "",
    dealIntro: "",
    rateCards: [],
    rateNote: "",
    showClientSchedule: false,
    clientScheduleHeading: "",
    clientScheduleIntro: "",
    clientRows: [],
    clientScheduleNote: "",
    otherClientScheduleHeading: "",
    otherClientScheduleIntro: "",
    otherClientRows: [],
  };
}

export function createDefaultFixedRateCards(): AgreementRateCard[] {
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

export const fixedRateVariableFields: AgreementVariableField[] = [
  { key: "region", label: "Operating Region / Territory", helper: "e.g. Jaipur Discom (JVVNL) area, Rajasthan" },
  { key: "scheme", label: "Scheme Name", helper: "e.g. PM Surya Ghar: Muft Bijli Yojana" },
  { key: "discom", label: "DISCOM", helper: "e.g. JVVNL" },
  { key: "oAndMYears", label: "Operation & Maintenance Tenure (years)" },
  { key: "arbitrationVenue", label: "Arbitration Venue", helper: "e.g. Jaipur" },
];

export const fixedRateVariableDefaults: Record<string, string> = {
  region: "Jaipur Discom (JVVNL) area, Rajasthan",
  scheme: "PM Surya Ghar: Muft Bijli Yojana",
  discom: "JVVNL",
  oAndMYears: "5",
  arbitrationVenue: "Jaipur",
};

export const fixedRateIntroTemplate =
  'THIS PARTNERSHIP AGREEMENT (the "Agreement") is made as of {{effectiveDateFormatted}} (the "Effective Date") by and between {{company.name}}, having its principal place of business at {{company.address}} ("MSS").\n\nAnd {{party.entityName}} ("Partner"), having its principal place of business at {{party.address}}.';

export const fixedRatePreamble =
  "NOW, THEREFORE, in consideration of the mutual promises set forth below, {{company.name}} and the Partner agree as follows:";

export const fixedRateRecitals = [
  "{{company.name}} is engaged in end-to-end execution of rooftop solar projects, including documentation, scheme / portal work, material procurement, transport, installation and commissioning.",
  "The Partner brings solar rooftop customers, sites and projects, is responsible for collection of payment from the customer, and earns commission / margin on a fixed-rate basis, while {{company.name}} takes care of the Project end to end.",
  "The Parties wish to record that {{company.name}} executes Projects at the agreed per-system fixed rates set out herein, and the amount realised from the customer over and above the applicable rate belongs to the Partner as commission / margin.",
];

export const fixedRateDealHeading = "Commercial Terms — Fixed Rate Schedule";

export const fixedRateDealIntro =
  "For each Project accepted under this Agreement on a fixed-rate basis: (i) the Partner brings the Project and is responsible for collection of payment from the customer; (ii) MSS takes care of the Project end to end and charges / retains the fixed per-system rate set out in the schedule below for that work; and (iii) the amount realised from the customer over and above the applicable rate belongs to the Partner as the Partner's commission / margin, released in accordance with the payment-flow provisions of this Agreement. The applicable rate depends on the system capacity and phase:";

export const fixedRateRateNote =
  "All rates are in Indian Rupees and represent MSS's charge for end-to-end execution of a system of the stated capacity and phase. The Partner's commission / margin is separate and is the surplus over these rates. Any change in scheme benefit, material cost or system configuration may require the Parties to revise this schedule by mutual written agreement.";

export const fixedRateClosing =
  "By signing below, the Parties agree that this Agreement constitutes the entire understanding between them in respect of the Projects covered hereby and may be modified only by a written instrument signed by an authorised representative of both Parties.";

export const fixedRateGoverningLaw =
  "In case any dispute arises in respect of the validity, interpretation, implementation or alleged breach of this Agreement, the Parties shall first attempt to resolve the same through negotiation. Failing resolution, either Party may refer the dispute to arbitration by a sole arbitrator in accordance with the Arbitration and Conciliation Act, 1996 or any amendment thereto, whose decision shall be binding on the Parties. The place of arbitration shall be {{var.arbitrationVenue}}. Each Party shall bear its own cost of arbitration.";

/** Default body sections for MSS fixed-rate partnerships (roles + payment flow + general). */
export function createFixedRateSections(): AgreementSection[] {
  return [
    section("Scope of Partnership", [
      clause({
        number: "1",
        content:
          'Under this Agreement, the Partner\'s role is to bring solar rooftop projects, sites and customers (each a "Project") to {{company.name}} ("MSS") and to collect customer payments. MSS shall take care of the Project end to end on the fixed-rate basis recorded herein — including documentation, scheme / portal work, procurement, transport, installation, commissioning and related execution — while the Partner earns commission / margin as the surplus over MSS\'s fixed rate.',
        subPoints: [
          {
            label: "a",
            text: "The Partner shall introduce genuine, ready Projects and the customer relationships required for MSS to execute.",
          },
          {
            label: "b",
            text:
              "MSS shall handle the Project end to end once accepted, including material procurement, transport, installation, commissioning and the execution / facilitation work required to complete the Project under {{var.scheme}}.",
          },
          {
            label: "c",
            text:
              "The Partner shall be responsible for collection of payment from the customer (cash component and any other amounts payable by the customer that are to be collected in person), and for handing such amounts over to MSS in accordance with the payment-flow provisions of this Agreement.",
          },
          {
            label: "d",
            text:
              "The Partner's commercial entitlement is commission / margin — being the amount realised from the customer over and above MSS's applicable fixed rate — and is not payment for execution work, which remains MSS's responsibility.",
          },
          {
            label: "e",
            text:
              "This arrangement is on a non-exclusive basis. Nothing in this Agreement constitutes either Party the agent, employee or legal partner of the other, save for the specific commercial sharing recorded herein.",
          },
        ],
      }),
    ]),
    section("Responsibilities of {{company.name}}", [
      clause({
        number: "2",
        content: "MSS shall take care of each accepted Project end to end. Without limiting that obligation, MSS shall:",
        subPoints: [
          {
            label: "a",
            text:
              "carry out material procurement, transport, installation and commissioning in accordance with manufacturer guidelines and recognised rooftop solar installation standards;",
          },
          {
            label: "b",
            text:
              "handle Project execution support including documentation, National Portal / scheme submissions, DISCOM and net-metering facilitation, and related on-ground coordination required to complete the Project;",
          },
          {
            label: "c",
            text: "provide reasonable telephonic and on-ground support for execution of the Project; and",
          },
          {
            label: "d",
            text:
              "maintain proper records of each Project and account to the Partner for the Partner's commission / margin in accordance with the Commercial Terms of this Agreement.",
          },
        ],
      }),
    ]),
    section("Responsibilities of the Partner", [
      clause({
        number: "3",
        content:
          "The Partner's role is limited to bringing the Project and collecting payment. The Partner shall, in respect of each Project:",
        subPoints: [
          {
            label: "a",
            text:
              "bring genuine Projects and provide true and complete customer, site and ownership information on which MSS may rely;",
          },
          {
            label: "b",
            text:
              "obtain customer consent and cooperation, and arrange site access, so that MSS can carry out end-to-end execution;",
          },
          {
            label: "c",
            text:
              "since the customer is the Partner's customer, own the customer relationship for lead generation and payment follow-up;",
          },
          {
            label: "d",
            text:
              "be responsible for collection of payment from the customer — including the cash component and any other customer amounts that must be collected — and hand such amounts over to MSS strictly in accordance with the payment-flow provisions below, before MSS is obliged to commence or continue procurement / execution as applicable; and",
          },
          {
            label: "e",
            text:
              "not assign the execution of any Project brought to MSS under this Agreement to any other execution firm without MSS's consent, and not circumvent MSS in respect of any such Project.",
          },
        ],
      }),
    ]),
    section("Payment Flow & Working Capital", [
      clause({
        number: "4",
        content: "Payment, collection and release of the Partner's commission / margin shall follow these rules:",
        subPoints: [
          {
            label: "a",
            text:
              "Loan files: Where a Project is financed by a bank loan, the loan amount is disbursed by the lender directly into MSS's bank account, typically in two and at times in three installments. MSS shall utilise such loan installments, as and when received, to carry out procurement and installation of the Project. Because the first installment is usually insufficient to meet the full cost of material, installation and execution, MSS shall fund the additional amount required over and above the installment(s) received out of its own resources to carry the Project forward, and shall recover the same from the subsequent installment(s) and the final payment as and when received from the lender. The Partner's entitlement in respect of such Project shall be released by MSS only after the Project is fully executed, net metering is completed, and the final installment / last payment has been received.",
          },
          {
            label: "b",
            text:
              "Cash files and Cash + Loan files: Where the customer pays wholly or partly in cash, the loan component (if any) shall be handled as in (a) above, and the Partner's entitlement and any final balance shall likewise be released only after net metering and receipt of the last payment. However, because the customer is the Partner's customer, collection of the cash component shall be done by the Partner directly from the customer, and the Partner shall hand over such cash amount to MSS before procurement of material for the site begins. Where the funds received at any stage fall short of the cost of executing the Project, MSS shall bridge the shortfall out of its own resources as described in (a) above.",
          },
          {
            label: "c",
            text:
              "Rationale: The Parties agree to the above because, unlike the loan installments which flow automatically from the bank after installation and over which neither Party has discretion, the cash component is within the Partner's control to collect. Accordingly, to ensure that procurement and execution of the Project are not delayed or funded by MSS on the Partner's behalf, the Partner shall provide the cash component upfront, before material procurement for that site commences.",
          },
          {
            label: "d",
            text:
              "MSS shall not be obliged to commence procurement of material for a Project until the cash component (where applicable) has been received from the Partner. Subject to MSS's funding of any working-capital shortfall described above, the Partner's entitlement / share shall be released only out of, and to the extent of, funds actually received from the lender and / or the customer, and only after the last payment for the Project has been received.",
          },
          {
            label: "e",
            text:
              "Working capital — all three modes: In each of the three payment modes above (loan, cash, and cash + loan), where the funds actually received at any stage are insufficient to meet the cost of material, installation and execution, MSS shall bridge such shortfall out of its own resources so that execution of the Project is not delayed, and shall recover the same from the subsequent installment(s) and / or the final payment.",
          },
          {
            label: "f",
            text:
              "Non-GST Partners — margin payment: Where the Partner does not hold a valid GST registration or has not provided a GST number under this Agreement, the Partner shall not retain margin for later settlement through invoicing. Instead, before MSS commences procurement of material for a Project, the Partner shall pay the estimated margin (on the fixed-rate basis) to MSS, calculated from the expected customer price and the applicable rate under this Agreement. Upon project completion, net metering and receipt of all customer payments, MSS shall reconcile the actual margin due and refund any excess paid by the Partner or collect any shortfall. MSS shall not commence procurement for a Project until such estimated amount has been received from a Partner who does not have GST.",
          },
        ],
      }),
    ]),
    section("Quality, Warranty & Operation and Maintenance", [
      clause({
        number: "5",
        content:
          "MSS shall carry out installation and commissioning work as per manufacturer guidelines and recognised rooftop solar installation standards. Responsibility for operation and maintenance and for back-to-back workmanship warranty in respect of each Project shall be borne for not less than {{var.oAndMYears}} years from commissioning. The Parties shall cooperate in good faith to resolve any customer complaint or punch point in a timely manner so as not to affect either Party's reputation or customer ratings.",
      }),
    ]),
    section("Confidentiality & Non-Circumvention", [
      clause({
        number: "6",
        content:
          "Each Party shall keep confidential all customer data, pricing, portal credentials and business information disclosed by the other in connection with this Agreement, and shall not use it except for performance of this Agreement. Neither Party shall circumvent the other in respect of any Project, customer or opportunity introduced under this Agreement, whether during the term or for a reasonable period thereafter.",
      }),
    ]),
    section("Non-Solicitation of Employees", [
      clause({
        number: "7",
        content:
          "During the term of this Agreement and for three (3) years thereafter, the Partner (including as a sub-vendor) shall not, without MSS's prior written permission, employ, engage, hire, solicit or take into service any person who is or was an employee, worker or consultant of MSS. Correspondingly, no person who has worked with MSS shall join or accept employment or engagement with the Partner during the same period without MSS's prior written permission. This restriction applies whether the engagement is as employee, contractor, partner, retainer or in any other capacity.",
      }),
    ]),
    section("Term & Termination", [
      clause({
        number: "8",
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
              'Termination for cause: MSS may terminate this Agreement immediately and without notice ("For Cause") upon fraud, misrepresentation, misuse of MSS\'s name or reputation, or any action by the Partner that brings MSS\'s reputation or business standing into disrepute.',
          },
          {
            label: "d",
            text:
              "Survival & effects: Termination shall not affect Projects already in execution, the Partner's entitlement already accrued, or obligations relating to operation & maintenance, back-to-back warranty, confidentiality, non-solicitation of employees and customer service for Projects already executed, all of which shall survive. Any amount payable to the Partner on termination is subject to MSS's right of set-off against losses and claims under this Agreement.",
          },
        ],
      }),
    ]),
  ];
}

export function mapAgreementClientRows(rows: Omit<AgreementClientRow, "id">[]): AgreementClientRow[] {
  return rows.map((row) => ({
    id: uuid(),
    name: row.name,
    capacity: row.capacity,
    kNo: row.kNo,
    dealWithUs: row.dealWithUs,
    workStatus: row.workStatus,
    remark: row.remark,
  }));
}
