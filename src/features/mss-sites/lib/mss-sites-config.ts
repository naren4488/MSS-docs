export const MSS_SITES_SPREADSHEET_ID = "1fe4vitjQwMhw92QltKECwBylbJ8ORWK3TsaI6548SEg";
export const MSS_SITES_TAB_GID = "0";
export const MSS_SITES_TAB_TITLE = "MSS SITES";

export function mssSitesCsvExportUrl() {
  return `https://docs.google.com/spreadsheets/d/${MSS_SITES_SPREADSHEET_ID}/export?format=csv&gid=${MSS_SITES_TAB_GID}`;
}
