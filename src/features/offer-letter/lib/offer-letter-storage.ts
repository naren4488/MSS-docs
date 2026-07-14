import type { OfferLetterData, OfferLetterRecord } from "../types/offer-letter";

function readRecords() {
  return [] as OfferLetterRecord[];
}

function writeRecords(_records: OfferLetterRecord[]) {
  // Real-time only, no persistence to localStorage
}

export function listOfferLetters() {
  return readRecords().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getOfferLetter(id: string) {
  return readRecords().find((record) => record.id === id) ?? null;
}

export function saveOfferLetterRecord(input: { id?: string; name: string; content: OfferLetterData }) {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = input.id ? records.find((record) => record.id === input.id) : undefined;

  const record: OfferLetterRecord = existing
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

export function deleteOfferLetterRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id));
}

export function saveDraft(_content: OfferLetterData) {
  // Real-time only, no persistence to localStorage
}

export function getDraft() {
  return null;
}

export function clearDraft() {
  // Real-time only, no persistence to localStorage
}
