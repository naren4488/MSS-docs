import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { BulletListEditor } from "@/features/offer-letter/components/BulletListEditor";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import type { QuotationData, QuotationGeneration } from "../types/quotation";
import { CommercialOfferEditor, MaterialItemEditor, TermItemEditor } from "./QuotationRowEditors";

interface QuotationEditorProps {
  data: QuotationData;
  onChange: (next: QuotationData) => void;
}

function AccordionSection({
  title,
  helper,
  children,
  defaultOpen = false,
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

export function QuotationEditor({ data, onChange }: QuotationEditorProps) {
  function update<K extends keyof QuotationData>(key: K, value: QuotationData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateCompany<K extends keyof AgreementCompany>(key: K, value: AgreementCompany[K]) {
    onChange({ ...data, company: { ...data.company, [key]: value } });
  }

  function updateGeneration<K extends keyof QuotationGeneration>(key: K, value: QuotationGeneration[K]) {
    onChange({ ...data, generation: { ...data.generation, [key]: value } });
  }

  return (
    <div className="stack">
      <AccordionSection title="Proposal Header" helper="Customer, plant capacity and date.">
        <div className="field-grid">
          <div className="field full-span">
            <label>Title</label>
            <input value={data.title} onChange={(event) => update("title", event.target.value)} />
          </div>
          <div className="field">
            <label>Customer Name</label>
            <input value={data.customerName} onChange={(event) => update("customerName", event.target.value)} />
          </div>
          <div className="field">
            <label>Capacity of Power Plant</label>
            <input value={data.capacity} placeholder="e.g. 3 KW 1PH" onChange={(event) => update("capacity", event.target.value)} />
          </div>
          <div className="field">
            <label>Date of Proposal</label>
            <input type="date" value={data.proposalDate} onChange={(event) => update("proposalDate", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={2} value={data.address} onChange={(event) => update("address", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Cover & Branding" helper="Hero image and tagline shown at the top of the proposal.">
        <ImageUploader label="Cover / Hero Image" value={data.coverImageUrl} onChange={(value) => update("coverImageUrl", value)} />
        <div className="field full-span">
          <label>Tagline</label>
          <input value={data.tagline} onChange={(event) => update("tagline", event.target.value)} />
        </div>
      </AccordionSection>

      <AccordionSection title="Company (Letterhead)" helper="Appears in the header on page 1.">
        <ImageUploader label="Company Logo" value={data.company.logoUrl} onChange={(value) => updateCompany("logoUrl", value)} />
        <div className="field-grid">
          <div className="field full-span">
            <label>Company Name *</label>
            <input value={data.company.name} onChange={(event) => updateCompany("name", event.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={data.company.phone} onChange={(event) => updateCompany("phone", event.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={data.company.email} onChange={(event) => updateCompany("email", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={2} value={data.company.address} onChange={(event) => updateCompany("address", event.target.value)} />
          </div>
          <div className="field">
            <label>GST Number</label>
            <input value={data.company.gst} onChange={(event) => updateCompany("gst", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Material Description" helper="Bill of materials. Drag items to reorder.">
        <MaterialItemEditor items={data.materialItems} onChange={(next) => update("materialItems", next)} />
      </AccordionSection>

      <AccordionSection title="Installation Work">
        <BulletListEditor label="Installation Work" items={data.installationWork} onChange={(next) => update("installationWork", next)} />
      </AccordionSection>

      <AccordionSection title="Assumptions">
        <BulletListEditor label="Assumptions" items={data.assumptions} onChange={(next) => update("assumptions", next)} />
      </AccordionSection>

      <AccordionSection title="Customer Scope">
        <BulletListEditor label="Customer Scope" items={data.customerScope} onChange={(next) => update("customerScope", next)} />
      </AccordionSection>

      <AccordionSection title="Commercial Offer" helper="Parameter / offering rows.">
        <CommercialOfferEditor rows={data.commercialOffer} onChange={(next) => update("commercialOffer", next)} />
      </AccordionSection>

      <AccordionSection title="Manufacturing Defect Warranty">
        <div className="field full-span">
          <label>Warranty Text</label>
          <textarea rows={3} value={data.warrantyText} onChange={(event) => update("warrantyText", event.target.value)} />
        </div>
      </AccordionSection>

      <AccordionSection title="Solar Power Generation">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Generation Table</span>
          <button
            className={`toggle ${data.showGeneration ? "on" : ""}`}
            type="button"
            onClick={() => update("showGeneration", !data.showGeneration)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showGeneration ? (
          <div className="field-grid">
            <div className="field">
              <label>Per Day</label>
              <input value={data.generation.perDay} onChange={(event) => updateGeneration("perDay", event.target.value)} />
            </div>
            <div className="field">
              <label>Per Month</label>
              <input value={data.generation.perMonth} onChange={(event) => updateGeneration("perMonth", event.target.value)} />
            </div>
            <div className="field">
              <label>Per Year</label>
              <input value={data.generation.perYear} onChange={(event) => updateGeneration("perYear", event.target.value)} />
            </div>
            <div className="field">
              <label>Saving Per Year</label>
              <input value={data.generation.savingPerYear} onChange={(event) => updateGeneration("savingPerYear", event.target.value)} />
            </div>
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection title="Warranty Badges" helper="The 'Up to N Years' circular badges.">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Warranty Badges</span>
          <button
            className={`toggle ${data.showWarrantyBadges ? "on" : ""}`}
            type="button"
            onClick={() => update("showWarrantyBadges", !data.showWarrantyBadges)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showWarrantyBadges ? (
          <div className="field-grid">
            <div className="field">
              <label>Product Warranty (years)</label>
              <input value={data.warrantyProductYears} onChange={(event) => update("warrantyProductYears", event.target.value)} />
            </div>
            <div className="field">
              <label>Performance Warranty (years)</label>
              <input value={data.warrantyPerformanceYears} onChange={(event) => update("warrantyPerformanceYears", event.target.value)} />
            </div>
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection title="Installation Process" helper="Numbered step diagram. Edit or reorder the steps.">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Installation Process</span>
          <button
            className={`toggle ${data.showInstallationProcess ? "on" : ""}`}
            type="button"
            onClick={() => update("showInstallationProcess", !data.showInstallationProcess)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showInstallationProcess ? (
          <BulletListEditor label="Steps" items={data.installationSteps} onChange={(next) => update("installationSteps", next)} />
        ) : null}
      </AccordionSection>

      <AccordionSection title="Subsidy & Notes">
        <div className="field-grid">
          <div className="field">
            <label>Subsidy Amount (₹)</label>
            <input value={data.subsidyAmount} placeholder="e.g. 78000" onChange={(event) => update("subsidyAmount", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Net Metering Note</label>
            <input value={data.netMeteringNote} onChange={(event) => update("netMeteringNote", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Load Extension Note</label>
            <textarea rows={2} value={data.loadExtensionNote} onChange={(event) => update("loadExtensionNote", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Terms & Conditions">
        <TermItemEditor items={data.terms} onChange={(next) => update("terms", next)} />
      </AccordionSection>

      <AccordionSection title="Required Documents for Subsidy">
        <BulletListEditor label="Documents" items={data.subsidyDocuments} onChange={(next) => update("subsidyDocuments", next)} />
      </AccordionSection>

      <AccordionSection title="Bank Details">
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
            <label>GST No.</label>
            <input value={data.bankGst} onChange={(event) => update("bankGst", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Represented By">
        <div className="field-grid">
          <div className="field">
            <label>Name</label>
            <input value={data.repName} onChange={(event) => update("repName", event.target.value)} />
          </div>
          <div className="field">
            <label>Title</label>
            <input value={data.repTitle} onChange={(event) => update("repTitle", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Company</label>
            <input value={data.repCompany} onChange={(event) => update("repCompany", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Mobile Number(s)</label>
            <input value={data.repMobiles} onChange={(event) => update("repMobiles", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Settings">
        <div className="toggle-grid">
          <div className="toggle-row">
            <span>Show Letterhead Header on Page 1</span>
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
