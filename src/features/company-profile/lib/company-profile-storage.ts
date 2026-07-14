import type { CompanyProfileData, CompanyProfileRecord } from "../types/company-profile";

function readRecords() {
  return [] as CompanyProfileRecord[];
}

function writeRecords(_records: CompanyProfileRecord[]) {
  // Real-time only, no persistence to localStorage
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

export function saveCompanyProfileDraft(_content: CompanyProfileData) {
  // Real-time only, no persistence to localStorage
}

export function getCompanyProfileDraft() {
  return null;
}

export function clearCompanyProfileDraft() {
  // Real-time only, no persistence to localStorage
}
