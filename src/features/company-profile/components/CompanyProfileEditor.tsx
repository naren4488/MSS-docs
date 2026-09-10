import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { getCompanyFirmLabel, isAnnexureFirm, isLetterheadFirm, usesLetterheadChrome } from "../lib/company-profile-defaults";
import type { CompanyProfileData, EmpanelmentAnnexure } from "../types/company-profile";

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

  const letterheadOnly = isLetterheadFirm(data.firm);
  const annexureDoc = isAnnexureFirm(data.firm);
  const letterheadChrome = usesLetterheadChrome(data.firm);

  function updateAnnexure<K extends keyof EmpanelmentAnnexure>(key: K, value: EmpanelmentAnnexure[K]) {
    onChange({ ...data, annexure: { ...data.annexure, [key]: value } });
  }

  function updateReference(index: number, key: "details" | "address" | "contactName" | "mobile", value: string) {
    const references = data.annexure.references.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row));
    updateAnnexure("references", references);
  }

  return (
    <div className="stack">
      <AccordionSection
        title="Header & Branding"
        helper={
          letterheadChrome
            ? "Logo and firm name. Address, phone, email, website and GST from the sections below print on the letterhead."
            : "Logo, firm name and tagline."
        }
        defaultOpen
      >
        <ImageUploader label="Logo" value={data.logoUrl} onChange={(value) => update("logoUrl", value)} />
        <div className="field-grid">
          <div className="field">
            <label>Firm</label>
            <input value={getCompanyFirmLabel(data.firm)} readOnly />
          </div>
          {letterheadChrome ? null : (
            <div className="field">
              <label>Document Title</label>
              <input value={data.title} onChange={(event) => update("title", event.target.value)} />
            </div>
          )}
          <div className="field full-span">
            <label>Legal / Trade Name *</label>
            <input value={data.legalName} onChange={(event) => update("legalName", event.target.value)} />
          </div>
          {letterheadChrome ? null : (
            <div className="field full-span">
              <label>Tagline</label>
              <input value={data.tagline} onChange={(event) => update("tagline", event.target.value)} />
            </div>
          )}
        </div>
      </AccordionSection>

      <AccordionSection
        title="Contact Details"
        helper={letterheadChrome ? "These print in the letterhead header and footer." : undefined}
        toggle={letterheadChrome ? undefined : { on: data.showContact, onChange: () => update("showContact", !data.showContact) }}
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
        helper={letterheadChrome ? "GST, PAN and CIN print in the letterhead header when filled." : undefined}
        toggle={letterheadChrome ? undefined : { on: data.showStatutory, onChange: () => update("showStatutory", !data.showStatutory) }}
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

      {letterheadChrome ? null : (
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
      )}

      {letterheadChrome ? null : (
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
      )}

      {annexureDoc ? (
        <>
          <AccordionSection title="Annexure 1 — Experience Details" defaultOpen helper="Printed on MSS letterhead. Company name, phone and email come from the sections above.">
            <div className="field-grid">
              <div className="field">
                <label>Constitution</label>
                <input
                  value={data.annexure.constitution}
                  placeholder="e.g. Private Limited"
                  onChange={(event) => updateAnnexure("constitution", event.target.value)}
                />
              </div>
              <div className="field">
                <label>Proprietors / Partners / Directors</label>
                <input value={data.annexure.proprietors} onChange={(event) => updateAnnexure("proprietors", event.target.value)} />
              </div>
              <div className="field full-span">
                <label>Office address</label>
                <textarea rows={2} value={data.annexure.officeAddress} onChange={(event) => updateAnnexure("officeAddress", event.target.value)} />
              </div>
              <div className="field full-span">
                <label>Registered address</label>
                <textarea
                  rows={2}
                  value={data.annexure.registeredAddress}
                  onChange={(event) => updateAnnexure("registeredAddress", event.target.value)}
                />
              </div>
              <div className="field">
                <label>Contact person</label>
                <input value={data.annexure.contactPerson} onChange={(event) => updateAnnexure("contactPerson", event.target.value)} />
              </div>
              <div className="field">
                <label>Years in current business</label>
                <input
                  value={data.annexure.yearsCurrentBusiness}
                  onChange={(event) => updateAnnexure("yearsCurrentBusiness", event.target.value)}
                />
              </div>
              <div className="field full-span">
                <label>Years in any other business (with segment)</label>
                <input
                  value={data.annexure.yearsOtherBusiness}
                  onChange={(event) => updateAnnexure("yearsOtherBusiness", event.target.value)}
                />
              </div>
              <div className="field full-span">
                <label>Infrastructure</label>
                <textarea rows={2} value={data.annexure.infrastructure} onChange={(event) => updateAnnexure("infrastructure", event.target.value)} />
              </div>
              <div className="field">
                <label>No of employees working</label>
                <input value={data.annexure.employeeCount} onChange={(event) => updateAnnexure("employeeCount", event.target.value)} />
              </div>
              <div className="field">
                <label>Years at current office address</label>
                <input value={data.annexure.yearsAtOffice} onChange={(event) => updateAnnexure("yearsAtOffice", event.target.value)} />
              </div>
              <div className="field full-span">
                <label>Other NBFCs / Banks (name & years)</label>
                <input value={data.annexure.nbfcBanks} onChange={(event) => updateAnnexure("nbfcBanks", event.target.value)} />
              </div>
              <div className="field full-span">
                <label>Profile / corporate presentation</label>
                <input value={data.annexure.attachProfile} onChange={(event) => updateAnnexure("attachProfile", event.target.value)} />
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="Annexure 1 — Project References" defaultOpen helper="Two references are mandatory.">
            {data.annexure.references.map((row, index) => (
              <div key={`ref-${index}`} className="field-grid" style={{ marginBottom: index === data.annexure.references.length - 1 ? 0 : 16 }}>
                <div className="field full-span">
                  <label>Reference {index + 1} — project details (type, capacity, commissioning date)</label>
                  <textarea rows={2} value={row.details} onChange={(event) => updateReference(index, "details", event.target.value)} />
                </div>
                <div className="field full-span">
                  <label>Installation / project address</label>
                  <input value={row.address} onChange={(event) => updateReference(index, "address", event.target.value)} />
                </div>
                <div className="field">
                  <label>Contact person for reference</label>
                  <input value={row.contactName} onChange={(event) => updateReference(index, "contactName", event.target.value)} />
                </div>
                <div className="field">
                  <label>Mobile no</label>
                  <input value={row.mobile} onChange={(event) => updateReference(index, "mobile", event.target.value)} />
                </div>
              </div>
            ))}
          </AccordionSection>

          <AccordionSection title="Annexure 2 — Bureau Consent" defaultOpen>
            <div className="field-grid">
              <div className="field full-span">
                <label>To (recipient)</label>
                <textarea rows={4} value={data.annexure.consentRecipient} onChange={(event) => updateAnnexure("consentRecipient", event.target.value)} />
              </div>
              <div className="field full-span">
                <label>Consent text</label>
                <textarea rows={6} value={data.annexure.consentBody} onChange={(event) => updateAnnexure("consentBody", event.target.value)} />
              </div>
            </div>
          </AccordionSection>

          <AccordionSection title="Signatory">
            <div className="field-grid">
              <div className="field">
                <label>Name</label>
                <input value={data.annexure.signatoryName} onChange={(event) => updateAnnexure("signatoryName", event.target.value)} />
              </div>
              <div className="field">
                <label>Title</label>
                <input value={data.annexure.signatoryTitle} onChange={(event) => updateAnnexure("signatoryTitle", event.target.value)} />
              </div>
              <div className="field">
                <label>Place</label>
                <input value={data.annexure.place} onChange={(event) => updateAnnexure("place", event.target.value)} />
              </div>
              <div className="field">
                <label>Date</label>
                <input type="date" value={data.annexure.date} onChange={(event) => updateAnnexure("date", event.target.value)} />
              </div>
            </div>
          </AccordionSection>
        </>
      ) : (
        <AccordionSection
          title={letterheadOnly ? "Letter Body" : "Notes"}
          defaultOpen={letterheadOnly}
          toggle={{ on: data.showNotes, onChange: () => update("showNotes", !data.showNotes) }}
        >
          <div className="field full-span">
            <label>{letterheadOnly ? "Letter text (optional)" : "Notes (optional)"}</label>
            <textarea
              rows={letterheadOnly ? 8 : 3}
              value={data.notes}
              placeholder={letterheadOnly ? "Leave blank to print empty stationery." : undefined}
              onChange={(event) => update("notes", event.target.value)}
            />
          </div>
        </AccordionSection>
      )}

      {letterheadChrome ? null : (
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
      )}
    </div>
  );
}
