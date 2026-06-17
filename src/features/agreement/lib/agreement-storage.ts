import {
  createNarpatSinghVendorAgreementData,
  createRaviSharmaVendorAgreementData,
  createSunnyMeenaVendorAgreementData,
  normalizeAgreementData,
  NARPAT_SINGH_VENDOR_AGREEMENT_ID,
  RAVI_SHARMA_VENDOR_AGREEMENT_ID,
  SUNNY_MEENA_VENDOR_AGREEMENT_ID,
} from "./agreement-defaults";
import type { AgreementData, AgreementRecord } from "../types/agreement";

const RECORDS_KEY = "agreement-records";
const DRAFT_KEY = "agreement-draft";

function readRecords() {
  const raw = localStorage.getItem(RECORDS_KEY);
  if (!raw) {
    return [] as AgreementRecord[];
  }

  try {
    return JSON.parse(raw) as AgreementRecord[];
  } catch {
    return [];
  }
}

function writeRecords(records: AgreementRecord[]) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function listAgreements() {
  return readRecords().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getAgreement(id: string) {
  return readRecords().find((record) => record.id === id) ?? null;
}

export function saveAgreementRecord(input: { id?: string; name: string; content: AgreementData }) {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = input.id ? records.find((record) => record.id === input.id) : undefined;

  const record: AgreementRecord = existing
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

export function deleteAgreementRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id));
}

export function saveAgreementDraft(content: AgreementData) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
}

export function getAgreementDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AgreementData;
  } catch {
    return null;
  }
}

export function clearAgreementDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

const SEEDED_VENDOR_AGREEMENTS = [
  {
    id: SUNNY_MEENA_VENDOR_AGREEMENT_ID,
    name: "Vikrant Meena — Vendor Code Agreement",
    create: createSunnyMeenaVendorAgreementData,
  },
  {
    id: RAVI_SHARMA_VENDOR_AGREEMENT_ID,
    name: "Ravi Sharma — Vendor Code Agreement",
    create: createRaviSharmaVendorAgreementData,
  },
  {
    id: NARPAT_SINGH_VENDOR_AGREEMENT_ID,
    name: "Narpat Singh — Vendor Code Agreement",
    create: createNarpatSinghVendorAgreementData,
  },
] as const;

/** Creates sample vendor agreements on first run; never overwrites user edits on reload. */
export function seedSampleAgreements() {
  let records = readRecords();
  const now = new Date().toISOString();

  for (const seed of SEEDED_VENDOR_AGREEMENTS) {
    const seedContent = seed.create();
    const existing = records.find((record) => record.id === seed.id);

    if (!existing) {
      records = [
        {
          id: seed.id,
          name: seed.name,
          content: seedContent,
          createdAt: now,
          updatedAt: now,
        },
        ...records,
      ];
      continue;
    }

    const content = normalizeAgreementData(existing.content);
    const nextContent: AgreementData = {
      ...content,
      partyIsIndividual: seedContent.partyIsIndividual,
      party: { ...content.party, ...seedContent.party },
      showVendorChargePerWatt: seedContent.showVendorChargePerWatt,
      vendorChargePerWatt: seedContent.vendorChargePerWatt,
    };

    if (JSON.stringify(existing.content) === JSON.stringify(nextContent)) {
      continue;
    }

    records = records.map((item) =>
      item.id === seed.id
        ? {
            ...item,
            name: seed.name,
            content: nextContent,
            updatedAt: now,
          }
        : item,
    );
  }

  writeRecords(records);
}
