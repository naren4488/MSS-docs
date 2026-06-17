export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  address: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  dateOfJoining: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountType: string;
  bankIfsc: string;
  bankBranch: string;
}

export interface EmployeeDirectoryData {
  title: string;

  companyName: string;
  companyLogoUrl: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyGst: string;

  employees: Employee[];

  showLetterhead: boolean;
  showPageNumbers: boolean;
}

export interface EmployeeDirectoryRecord {
  id: string;
  name: string;
  content: EmployeeDirectoryData;
  createdAt: string;
  updatedAt: string;
}
