export interface EnquiriesTable {
  title: string;
  headers: string[];
  rows: string[][];
  fetchedAt: string;
  /** Month sheet tab id (sep, oct, …). */
  tabId?: string;
}
