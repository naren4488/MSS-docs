import type { CompanyProfileData, CompanyProfileRecord } from "../types/company-profile";

const RECORDS_KEY = "company-profile-records";
const DRAFT_KEY = "company-profile-draft";

function readRecords() {
  const raw = localStorage.getItem(RECORDS_KEY);
  if (!raw) {
    return [] as CompanyProfileRecord[];
  }

  try {
    return JSON.parse(raw) as CompanyProfileRecord[];
  } catch {
    return [];
  }
}

function writeRecords(records: CompanyProfileRecord[]) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function listCompanyProfiles() {
  return readRecords().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getCompanyProfile(id: string) {
  return readRecords().find((record) => record.id === id) ?? null;
}

export function saveCompanyProfileRecord(input: { id?: string; name: string; content: CompanyProfileData }) {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = input.id ? records.find((record) => record.id === input.id) : undefined;

  const record: CompanyProfileRecord = existing
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

export function deleteCompanyProfileRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id));
}

export function saveCompanyProfileDraft(content: CompanyProfileData) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
}

export function getCompanyProfileDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CompanyProfileData;
  } catch {
    return null;
  }
}

export function clearCompanyProfileDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
