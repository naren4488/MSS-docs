import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { getCompanyFirmLabel } from "../lib/company-profile-defaults";
import type { CompanyProfileData } from "../types/company-profile";

interface CompanyProfileEditorProps {
  data: CompanyProfileData;
  onChange: (next: CompanyProfileData) => void;
}

function AccordionSection({
  title,
  helper,
  children,
  defaultOpen = false,
  toggle,
}: {
  title: string;
  helper?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  toggle?: { on: boolean; onChange: () => void };
}) {
  const [open, setOpen] = useState(defaultOpen);
  const dimmed = toggle ? !toggle.on : false;

  return (
    <section className="editor-section">
      <div className="accordion-trigger" style={{ gap: 12 }}>
        {toggle ? (
          <button
            className={`toggle ${toggle.on ? "on" : ""}`}
            type="button"
            title={toggle.on ? "This section will print" : "This section is hidden from the PDF"}
            onClick={(event) => {
              event.stopPropagation();
              toggle.onChange();
            }}
          >
            <span className="toggle-thumb" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            background: "transparent",
            border: "none",
            font: "inherit",
            cursor: "pointer",
            color: "inherit",
            padding: 0,
            opacity: dimmed ? 0.5 : 1,
          }}
        >
          <span>{title}</span>
          <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 0.2s ease" }} />
        </button>
      </div>
      {open ? (
        <div className="accordion-content">
          {helper ? <p className="helper-text">{helper}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function CompanyProfileEditor({ data, onChange }: CompanyProfileEditorProps) {
  function update<K extends keyof CompanyProfileData>(key: K, value: CompanyProfileData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="stack">
      <AccordionSection title="Header & Branding" helper="Logo, firm name and tagline." defaultOpen>
        <ImageUploader label="Logo" value={data.logoUrl} onChange={(value) => update("logoUrl", value)} />
        <div className="field-grid">
          <div className="field">
            <label>Firm</label>
            <input value={getCompanyFirmLabel(data.firm)} readOnly />
          </div>
          <div className="field">
            <label>Document Title</label>
            <input value={data.title} onChange={(event) => update("title", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Legal / Trade Name *</label>
            <input value={data.legalName} onChange={(event) => update("legalName", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Tagline</label>
            <input value={data.tagline} onChange={(event) => update("tagline", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Contact Details"
        toggle={{ on: data.showContact, onChange: () => update("showContact", !data.showContact) }}
      >
        <div className="field-grid">
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={2} value={data.address} onChange={(event) => update("address", event.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={data.phone} onChange={(event) => update("phone", event.target.value)} />
          </div>
          <div className="field">
            <label>Alternate Phone</label>
            <input value={data.altPhone} onChange={(event) => update("altPhone", event.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={data.email} onChange={(event) => update("email", event.target.value)} />
          </div>
          <div className="field">
            <label>Website</label>
            <input value={data.website} placeholder="e.g. www.example.com" onChange={(event) => update("website", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Statutory & Tax"
        toggle={{ on: data.showStatutory, onChange: () => update("showStatutory", !data.showStatutory) }}
      >
        <div className="field-grid">
          <div className="field">
            <label>GST Number</label>
            <input value={data.gst} placeholder="e.g. 08XXXXX0000X1ZX" onChange={(event) => update("gst", event.target.value)} />
          </div>
          <div className="field">
            <label>PAN</label>
            <input value={data.pan} onChange={(event) => update("pan", event.target.value)} />
          </div>
          <div className="field">
            <label>CIN</label>
            <input value={data.cin} onChange={(event) => update("cin", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Bank Details"
        toggle={{ on: data.showBank, onChange: () => update("showBank", !data.showBank) }}
      >
        <div className="field-grid">
          <div className="field full-span">
            <label>Account Name</label>
            <input value={data.bankAccountName} onChange={(event) => update("bankAccountName", event.target.value)} />
          </div>
          <div className="field">
            <label>Bank</label>
            <input value={data.bankName} onChange={(event) => update("bankName", event.target.value)} />
          </div>
          <div className="field">
            <label>A/c No.</label>
            <input value={data.bankAccountNo} onChange={(event) => update("bankAccountNo", event.target.value)} />
          </div>
          <div className="field">
            <label>IFSC Code</label>
            <input value={data.bankIfsc} onChange={(event) => update("bankIfsc", event.target.value)} />
          </div>
          <div className="field">
            <label>Branch</label>
            <input value={data.bankBranch} onChange={(event) => update("bankBranch", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Authorised Contact"
        toggle={{ on: data.showContactPerson, onChange: () => update("showContactPerson", !data.showContactPerson) }}
      >
        <div className="field-grid">
          <div className="field">
            <label>Name</label>
            <input value={data.contactName} onChange={(event) => update("contactName", event.target.value)} />
          </div>
          <div className="field">
            <label>Title</label>
            <input value={data.contactTitle} onChange={(event) => update("contactTitle", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="Notes"
        defaultOpen={false}
        toggle={{ on: data.showNotes, onChange: () => update("showNotes", !data.showNotes) }}
      >
        <div className="field full-span">
          <label>Notes (optional)</label>
          <textarea rows={3} value={data.notes} onChange={(event) => update("notes", event.target.value)} />
        </div>
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
