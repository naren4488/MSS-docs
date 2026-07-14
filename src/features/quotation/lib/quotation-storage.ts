import type { QuotationData, QuotationRecord } from "../types/quotation";
import { malchandJangidQuotation } from "../data/malchand-jangid-3kw";

function readRecords() {
  return [malchandJangidQuotation];
}

function writeRecords(_records: QuotationRecord[]) {
  // Real-time only, no persistence to localStorage
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

export function saveQuotationDraft(_content: QuotationData) {
  // Real-time only, no persistence to localStorage
}

export function getQuotationDraft() {
  return null;
}

export function clearQuotationDraft() {
  // Real-time only, no persistence to localStorage
}
