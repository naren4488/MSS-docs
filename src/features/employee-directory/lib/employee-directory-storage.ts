import {
  createMseEmployeeDirectoryData,
  MSE_EMPLOYEE_DIRECTORY_ID,
  normalizeEmployeeDirectoryData,
  SEEDED_EMPLOYEES,
} from "./employee-directory-defaults";
import type { EmployeeDirectoryData, EmployeeDirectoryRecord } from "../types/employee-directory";

function readRecords() {
  return [] as EmployeeDirectoryRecord[];
}

function writeRecords(_records: EmployeeDirectoryRecord[]) {
  // Real-time only, no persistence to localStorage
}

export function listEmployeeDirectories() {
  return readRecords().sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function getEmployeeDirectory(id: string) {
  return readRecords().find((record) => record.id === id) ?? null;
}

export function saveEmployeeDirectoryRecord(input: { id?: string; name: string; content: EmployeeDirectoryData }) {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = input.id ? records.find((record) => record.id === input.id) : undefined;

  const record: EmployeeDirectoryRecord = existing
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

export function deleteEmployeeDirectoryRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id));
}

export function saveEmployeeDirectoryDraft(_content: EmployeeDirectoryData) {
  // Real-time only, no persistence to localStorage
}

export function getEmployeeDirectoryDraft() {
  return null;
}

export function clearEmployeeDirectoryDraft() {
  // Real-time only, no persistence to localStorage
}

/** Creates the MSE employee register on first run; never overwrites user edits on reload. */
export function seedEmployeeDirectory() {
  const records = readRecords();
  const now = new Date().toISOString();
  const existing = records.find((record) => record.id === MSE_EMPLOYEE_DIRECTORY_ID);
  const seedContent = createMseEmployeeDirectoryData();

  if (!existing) {
    writeRecords([
      {
        id: MSE_EMPLOYEE_DIRECTORY_ID,
        name: "MSE Employee Register",
        content: seedContent,
        createdAt: now,
        updatedAt: now,
      },
      ...records,
    ]);
    return;
  }

  const content = normalizeEmployeeDirectoryData(existing.content);
  let employees = content.employees.map((employee) => {
    const seeded = SEEDED_EMPLOYEES.find((item) => item.id === employee.id);
    return seeded ? { ...seeded } : employee;
  });

  const missingSeeded = SEEDED_EMPLOYEES.filter((seeded) => !employees.some((employee) => employee.id === seeded.id));
  if (missingSeeded.length > 0) {
    employees = [...employees, ...missingSeeded.map((employee) => ({ ...employee }))];
  }

  const unchanged =
    employees.length === content.employees.length &&
    employees.every((employee, index) => {
      const current = content.employees[index];
      return current && current.id === employee.id && JSON.stringify(current) === JSON.stringify(employee);
    });

  if (unchanged) {
    return;
  }

  writeRecords(
    records.map((item) =>
      item.id === MSE_EMPLOYEE_DIRECTORY_ID
        ? {
            ...item,
            content: { ...content, employees },
            updatedAt: now,
          }
        : item,
    ),
  );
}
