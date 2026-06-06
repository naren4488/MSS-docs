import type { QuotationData, QuotationRecord } from "../types/quotation";

const RECORDS_KEY = "quotation-records";
const DRAFT_KEY = "quotation-draft";

function readRecords() {
  const raw = localStorage.getItem(RECORDS_KEY);
  if (!raw) {
    return [] as QuotationRecord[];
  }

  try {
    return JSON.parse(raw) as QuotationRecord[];
  } catch {
    return [];
  }
}

function writeRecords(records: QuotationRecord[]) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function listQuotations() {
  return readRecords().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getQuotation(id: string) {
  return readRecords().find((record) => record.id === id) ?? null;
}

export function saveQuotationRecord(input: { id?: string; name: string; content: QuotationData }) {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = input.id ? records.find((record) => record.id === input.id) : undefined;

  const record: QuotationRecord = existing
    ? { ...existing, name: input.name, content: input.content, updatedAt: now }
    : {
        id: crypto.randomUUID(),
        name: input.name,
        content: input.content,
        createdAt: now,
        updatedAt: now,
      };

  const nextRecords = existing
    ? records.map((item) => (item.id === record.id ? record : item))
    : [record, ...records];

  writeRecords(nextRecords);
  return record;
}

export function deleteQuotationRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id));
}

export function saveQuotationDraft(content: QuotationData) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
}

export function getQuotationDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as QuotationData;
  } catch {
    return null;
  }
}

export function clearQuotationDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
