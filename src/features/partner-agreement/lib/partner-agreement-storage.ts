import type { PartnerAgreementData, PartnerAgreementRecord } from "../types/partner-agreement";

const RECORDS_KEY = "partner-agreement-records";
const DRAFT_KEY = "partner-agreement-draft";

function readRecords() {
  const raw = localStorage.getItem(RECORDS_KEY);
  if (!raw) {
    return [] as PartnerAgreementRecord[];
  }

  try {
    return JSON.parse(raw) as PartnerAgreementRecord[];
  } catch {
    return [];
  }
}

function writeRecords(records: PartnerAgreementRecord[]) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
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

export function savePartnerAgreementDraft(content: PartnerAgreementData) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
}

export function getPartnerAgreementDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PartnerAgreementData;
  } catch {
    return null;
  }
}

export function clearPartnerAgreementDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
