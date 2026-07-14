import type { PartnerAgreementData, PartnerAgreementRecord } from "../types/partner-agreement";

function readRecords() {
  return [] as PartnerAgreementRecord[];
}

function writeRecords(_records: PartnerAgreementRecord[]) {
  // Real-time only, no persistence to localStorage
}

export function listPartnerAgreements() {
  return readRecords().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getPartnerAgreement(id: string) {
  return readRecords().find((record) => record.id === id) ?? null;
}

export function savePartnerAgreementRecord(input: {
  id?: string;
  name: string;
  content: PartnerAgreementData;
}) {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = input.id ? records.find((record) => record.id === input.id) : undefined;

  const record: PartnerAgreementRecord = existing
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

export function deletePartnerAgreementRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id));
}

export function savePartnerAgreementDraft(_content: PartnerAgreementData) {
  // Real-time only, no persistence to localStorage
}

export function getPartnerAgreementDraft() {
  return null;
}

export function clearPartnerAgreementDraft() {
  // Real-time only, no persistence to localStorage
}
