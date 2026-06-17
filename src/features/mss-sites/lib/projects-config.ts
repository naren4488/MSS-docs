export const PROJECTS_SPREADSHEET_ID = "1fe4vitjQwMhw92QltKECwBylbJ8ORWK3TsaI6548SEg";

export const DEC_TO_FEB_SPREADSHEET_ID = "1tkNFHBLjpOZkzayqObWO1VMYkGsD5uy-wrXaBcqHglE";

export const PROJECT_VENDORS = {
  MSS: "MSS",
  ARKSHAKTI: "Arkshakti",
} as const;

/** MSS site register tabs — summary tab is intentionally excluded. */
export const PROJECT_SHEET_TABS = [
  { sheetName: "MSS SITES", projectType: "MSS" },
  { sheetName: "RAVI JI SITES", projectType: "Ravi Ji" },
  { sheetName: "SHRIPAL JI", projectType: "Shripal Ji" },
  { sheetName: "AJAY JI", projectType: "Ajay Ji" },
  { sheetName: "ROHIT JI (SHREE SHYAM", projectType: "Rohit Ji" },
  { sheetName: "KAVITA MAAM", projectType: "Kavita Maa" },
  { sheetName: "SUNNY JI", projectType: "Sunny Ji" },
  { sheetName: "ROHIT JI PHULERA", projectType: "Rohit Ji Phuler" },
  { sheetName: "DHERAJ JI SITES", projectType: "Dheraj Ji" },
] as const;

/** Arkshakti (DEC to FEB) tabs — add more tabs here as they are enabled. */
export const ARKSHAKTI_SHEET_TABS = [{ sheetName: "MSS res", projectType: "MSS res" }] as const;

function spreadsheetGvizUrl(spreadsheetId: string, sheetName: string, headerRows = 1) {
  const params = new URLSearchParams({
    tqx: "out:json",
    sheet: sheetName,
    headers: String(headerRows),
  });
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${params}`;
}

export function projectsSheetGvizUrl(sheetName: string, headerRows = 1) {
  return spreadsheetGvizUrl(PROJECTS_SPREADSHEET_ID, sheetName, headerRows);
}

export function decToFebSheetGvizUrl(sheetName: string, headerRows = 1) {
  return spreadsheetGvizUrl(DEC_TO_FEB_SPREADSHEET_ID, sheetName, headerRows);
}
