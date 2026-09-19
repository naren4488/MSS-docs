/** Sales enquiries workbook — Sep Updated tab. */
export const ENQUIRIES_SPREADSHEET_ID = "1z5xq6xFAdxqgQkmNlTjtPtHVhwYyJUvRauxn_4spwX4";
export const ENQUIRIES_SHEET_TAB = "sep updated";
/** gid for "sep updated" — CSV export preserves text like "3+5" that gviz drops from number columns. */
export const ENQUIRIES_SHEET_GID = "1899438846";

export function enquiriesSheetCsvUrl(gid = ENQUIRIES_SHEET_GID) {
  return `https://docs.google.com/spreadsheets/d/${ENQUIRIES_SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
}

/** @deprecated Prefer CSV — gviz nulls text in number-typed columns (e.g. kw "3+5"). */
export function enquiriesSheetGvizUrl(sheetName = ENQUIRIES_SHEET_TAB, headerRows = 1) {
  const params = new URLSearchParams({
    tqx: "out:json",
    sheet: sheetName,
    headers: String(headerRows),
  });
  return `https://docs.google.com/spreadsheets/d/${ENQUIRIES_SPREADSHEET_ID}/gviz/tq?${params}`;
}

/** Canonical column keys used in the app. */
export const ENQUIRY_COLUMNS = [
  "S No",
  "Enquiry date",
  "Enquiry status",
  "Client name",
  "Contact",
  "Location",
  "Geo location",
  "Email",
  "Source type",
  "Source name",
  "Source id",
  "Lead assigned",
  "kW",
  "Phase",
  "Estimate price",
  "Visit status",
  "Visit date",
  "Visit time",
  "Who visited",
  "Follow up date",
  "Follow up person",
  "Deal done",
  "Final amount",
  "Documents",
  "Document date",
  "Notes",
  "Pending",
] as const;

export type EnquiryColumn = (typeof ENQUIRY_COLUMNS)[number];

/** Columns shown in the main table. */
export const ENQUIRY_VISIBLE_COLUMNS: readonly EnquiryColumn[] = [
  "S No",
  "Enquiry date",
  "Enquiry status",
  "Client name",
  "Contact",
  "Location",
  "Source type",
  "Lead assigned",
  "kW",
  "Phase",
  "Visit status",
  "Deal done",
  "Documents",
  "Notes",
];

/** Columns tucked into the MORE cell. */
export const ENQUIRY_MORE_COLUMNS: readonly EnquiryColumn[] = [
  "Geo location",
  "Email",
  "Source name",
  "Source id",
  "Estimate price",
  "Visit date",
  "Visit time",
  "Who visited",
  "Follow up date",
  "Follow up person",
  "Final amount",
  "Document date",
  "Pending",
];

export const ENQUIRY_FILTER_COLUMNS = [
  "Enquiry status",
  "Visit status",
  "Source type",
  "Lead assigned",
  "Deal done",
  "Documents",
] as const satisfies readonly EnquiryColumn[];

export type EnquiryFilterColumn = (typeof ENQUIRY_FILTER_COLUMNS)[number];

const HEADER_ALIASES: Record<string, EnquiryColumn> = {
  aa: "S No",
  "enquiry date": "Enquiry date",
  "enquiry status": "Enquiry status",
  "client name": "Client name",
  "contact details": "Contact",
  location: "Location",
  "geo location": "Geo location",
  email: "Email",
  "source type": "Source type",
  "source name": "Source name",
  "source id": "Source id",
  "lead assigned": "Lead assigned",
  kw: "kW",
  phase: "Phase",
  "estimate price": "Estimate price",
  "visit status": "Visit status",
  "visit date": "Visit date",
  "visit time": "Visit time",
  "who visited or will visit": "Who visited",
  "follow up date": "Follow up date",
  "follow up person": "Follow up person",
  "deal done": "Deal done",
  "final amount": "Final amount",
  "documents recieved": "Documents",
  "documents received": "Documents",
  "document date": "Document date",
  notes: "Notes",
  pending: "Pending",
};

export function canonicalizeEnquiryHeader(label: string): EnquiryColumn | "" {
  const key = label.replace(/\s+/g, " ").trim().toLowerCase();
  if (!key) return "";
  return HEADER_ALIASES[key] ?? "";
}
