import { MSE_LOGO_URL } from "@/features/company-profile/lib/company-profile-defaults";
import type { Employee, EmployeeDirectoryData } from "../types/employee-directory";

export const MSE_EMPLOYEE_DIRECTORY_ID = "a1b2c3d4-e5f6-4789-a012-mseemployees";

const MSE_ADDRESS = "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044";

function uuid() {
  return crypto.randomUUID();
}

export function createEmptyEmployee(): Employee {
  return {
    id: uuid(),
    name: "",
    employeeId: "",
    designation: "",
    department: "",
    address: "",
    phone: "",
    email: "",
    aadhaar: "",
    pan: "",
    dateOfJoining: "",
    bankAccountName: "",
    bankName: "",
    bankAccountNo: "",
    bankAccountType: "",
    bankIfsc: "",
    bankBranch: "",
  };
}

export function createDineshYadavEmployee(): Employee {
  return {
    ...createEmptyEmployee(),
    id: "dinesh-yadav-employee-01",
    name: "Dinesh Kumar Yadav",
    designation: "Site Supervisor",
    address: "Karansar, Jaipur",
    bankAccountName: "Dinesh Kumar Yadav",
    bankName: "Federal Bank",
    bankAccountNo: "55550120044134",
    bankIfsc: "FDRL0002122",
  };
}

export function createKailashKumawatEmployee(): Employee {
  return {
    ...createEmptyEmployee(),
    id: "kailash-kumawat-employee-01",
    name: "Kailash Kumawat",
    designation: "Admin Support",
    address: "Royal City, Jaipur",
    bankAccountName: "Kailash Kumawat",
    bankName: "SBI",
    bankAccountNo: "61254696944",
    bankAccountType: "Savings Account",
    bankBranch: "BORAJ",
    bankIfsc: "SBIN0031976",
  };
}

export const SEEDED_EMPLOYEES: Employee[] = [createDineshYadavEmployee(), createKailashKumawatEmployee()];

export function createDefaultEmployeeDirectoryData(): EmployeeDirectoryData {
  return {
    title: "EMPLOYEE DETAILS",

    companyName: "MAHI SOLAR ENERGY",
    companyLogoUrl: MSE_LOGO_URL,
    companyAddress: MSE_ADDRESS,
    companyPhone: "+91 9928413501",
    companyEmail: "mahisolarenergy77@gmail.com",
    companyGst: "08GPEPK1479A1ZZ",

    employees: [],

    showLetterhead: true,
    showPageNumbers: true,
  };
}

export function createMseEmployeeDirectoryData(): EmployeeDirectoryData {
  return {
    ...createDefaultEmployeeDirectoryData(),
    employees: SEEDED_EMPLOYEES.map((employee) => ({ ...employee })),
  };
}

export function normalizeEmployeeDirectoryData(input?: Partial<EmployeeDirectoryData> | null): EmployeeDirectoryData {
  const defaults = createDefaultEmployeeDirectoryData();
  const merged = {
    ...defaults,
    ...input,
    employees: input?.employees?.length ? input.employees : defaults.employees,
    showLetterhead: input?.showLetterhead ?? defaults.showLetterhead,
    showPageNumbers: input?.showPageNumbers ?? defaults.showPageNumbers,
  };

  if (merged.companyName.trim().toUpperCase() === "MAHI SOLAR ENERGY" && !merged.companyLogoUrl.trim()) {
    merged.companyLogoUrl = MSE_LOGO_URL;
  }

  return merged;
}

export function normalizeEmployee(input?: Partial<Employee> | null): Employee {
  const defaults = createEmptyEmployee();
  return { ...defaults, ...input, id: input?.id ?? defaults.id };
}
