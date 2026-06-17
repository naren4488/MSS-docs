import { Plus, Trash2 } from "lucide-react";
import type { Employee } from "../types/employee-directory";

interface EmployeeCardEditorProps {
  employee: Employee;
  index: number;
  onChange: (next: Employee) => void;
  onDelete: () => void;
}

export function EmployeeCardEditor({ employee, index, onChange, onDelete }: EmployeeCardEditorProps) {
  function update<K extends keyof Employee>(key: K, value: Employee[K]) {
    onChange({ ...employee, [key]: value });
  }

  return (
    <div className="term-card" style={{ background: "#fbfdff" }}>
      <div className="section-title-row">
        <span style={{ fontWeight: 700, color: "#65748b" }}>
          {index + 1}. {employee.name.trim() || "New Employee"}
        </span>
        <button className="icon-button" type="button" title="Remove employee" onClick={onDelete}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>Full Name *</label>
          <input value={employee.name} onChange={(event) => update("name", event.target.value)} />
        </div>
        <div className="field">
          <label>Employee ID</label>
          <input value={employee.employeeId} onChange={(event) => update("employeeId", event.target.value)} />
        </div>
        <div className="field">
          <label>Designation</label>
          <input value={employee.designation} onChange={(event) => update("designation", event.target.value)} />
        </div>
        <div className="field">
          <label>Department</label>
          <input value={employee.department} onChange={(event) => update("department", event.target.value)} />
        </div>
        <div className="field full-span">
          <label>Address</label>
          <textarea rows={2} value={employee.address} onChange={(event) => update("address", event.target.value)} />
        </div>
        <div className="field">
          <label>Phone</label>
          <input value={employee.phone} onChange={(event) => update("phone", event.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={employee.email} onChange={(event) => update("email", event.target.value)} />
        </div>
        <div className="field">
          <label>Aadhaar Number</label>
          <input value={employee.aadhaar} placeholder="XXXX XXXX XXXX" onChange={(event) => update("aadhaar", event.target.value)} />
        </div>
        <div className="field">
          <label>PAN</label>
          <input value={employee.pan} onChange={(event) => update("pan", event.target.value)} />
        </div>
        <div className="field">
          <label>Date of Joining</label>
          <input type="date" value={employee.dateOfJoining} onChange={(event) => update("dateOfJoining", event.target.value)} />
        </div>
      </div>

      <p className="helper-text" style={{ margin: "12px 0 8px" }}>
        Bank account details
      </p>
      <div className="field-grid">
        <div className="field full-span">
          <label>Account Holder Name</label>
          <input
            value={employee.bankAccountName}
            placeholder={employee.name || "As per bank records"}
            onChange={(event) => update("bankAccountName", event.target.value)}
          />
        </div>
        <div className="field">
          <label>Bank Name</label>
          <input value={employee.bankName} onChange={(event) => update("bankName", event.target.value)} />
        </div>
        <div className="field">
          <label>Branch</label>
          <input value={employee.bankBranch} onChange={(event) => update("bankBranch", event.target.value)} />
        </div>
        <div className="field">
          <label>Account Number</label>
          <input value={employee.bankAccountNo} onChange={(event) => update("bankAccountNo", event.target.value)} />
        </div>
        <div className="field">
          <label>Account Type</label>
          <input
            value={employee.bankAccountType}
            placeholder="e.g. Savings Account"
            onChange={(event) => update("bankAccountType", event.target.value)}
          />
        </div>
        <div className="field">
          <label>IFSC Code</label>
          <input value={employee.bankIfsc} onChange={(event) => update("bankIfsc", event.target.value)} />
        </div>
      </div>
    </div>
  );
}

interface EmployeeListEditorProps {
  employees: Employee[];
  onChange: (next: Employee[]) => void;
  onAdd: () => void;
}

export function EmployeeListEditor({ employees, onChange, onAdd }: EmployeeListEditorProps) {
  return (
    <div className="stack" style={{ gap: 14 }}>
      {employees.map((employee, index) => (
        <EmployeeCardEditor
          key={employee.id}
          employee={employee}
          index={index}
          onChange={(next) => onChange(employees.map((item, i) => (i === index ? next : item)))}
          onDelete={() => {
            if (!window.confirm(`Remove ${employee.name.trim() || "this employee"} from the register?`)) {
              return;
            }
            onChange(employees.filter((_, i) => i !== index));
          }}
        />
      ))}
      <button className="ghost-button" type="button" onClick={onAdd}>
        <Plus size={16} />
        Add Employee
      </button>
    </div>
  );
}
