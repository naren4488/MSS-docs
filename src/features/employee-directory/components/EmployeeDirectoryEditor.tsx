import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { createEmptyEmployee } from "../lib/employee-directory-defaults";
import type { EmployeeDirectoryData } from "../types/employee-directory";
import { EmployeeListEditor } from "./EmployeeCardEditor";

interface EmployeeDirectoryEditorProps {
  data: EmployeeDirectoryData;
  onChange: (next: EmployeeDirectoryData) => void;
}

function AccordionSection({
  title,
  helper,
  children,
  defaultOpen = true,
}: {
  title: string;
  helper?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="editor-section">
      <button className="accordion-trigger" type="button" onClick={() => setOpen((value) => !value)}>
        <span>{title}</span>
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s ease" }} />
      </button>
      {open ? (
        <div className="accordion-content">
          {helper ? <p className="helper-text">{helper}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function EmployeeDirectoryEditor({ data, onChange }: EmployeeDirectoryEditorProps) {
  function update<K extends keyof EmployeeDirectoryData>(key: K, value: EmployeeDirectoryData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="stack">
      <AccordionSection title="Document Header" helper="Title and letterhead for the employee register PDF.">
        <div className="field-grid">
          <div className="field full-span">
            <label>Document Title</label>
            <input value={data.title} onChange={(event) => update("title", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Company (Employer)" helper="Shown at the top of the PDF — Mahi Solar Energy by default." defaultOpen>
        <ImageUploader label="Company Logo" value={data.companyLogoUrl} onChange={(value) => update("companyLogoUrl", value)} />
        <div className="field-grid">
          <div className="field full-span">
            <label>Company Name *</label>
            <input value={data.companyName} onChange={(event) => update("companyName", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={2} value={data.companyAddress} onChange={(event) => update("companyAddress", event.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={data.companyPhone} onChange={(event) => update("companyPhone", event.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={data.companyEmail} onChange={(event) => update("companyEmail", event.target.value)} />
          </div>
          <div className="field">
            <label>GST Number</label>
            <input value={data.companyGst} onChange={(event) => update("companyGst", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Employees"
        helper="All employees appear in one PDF. Add each person's contact, identity and bank details."
        defaultOpen
      >
        <EmployeeListEditor
          employees={data.employees}
          onChange={(employees) => update("employees", employees)}
          onAdd={() => update("employees", [...data.employees, createEmptyEmployee()])}
        />
      </AccordionSection>

      <AccordionSection title="Settings" defaultOpen={false}>
        <div className="toggle-grid">
          <div className="toggle-row">
            <span>Show Letterhead Header</span>
            <button
              className={`toggle ${data.showLetterhead ? "on" : ""}`}
              type="button"
              onClick={() => update("showLetterhead", !data.showLetterhead)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
          <div className="toggle-row">
            <span>Show Page Numbers</span>
            <button
              className={`toggle ${data.showPageNumbers ? "on" : ""}`}
              type="button"
              onClick={() => update("showPageNumbers", !data.showPageNumbers)}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
}
