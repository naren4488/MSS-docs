import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { BulletListEditor } from "@/features/offer-letter/components/BulletListEditor";
import { getAgreementTemplateLabel } from "../lib/agreement-defaults";
import type { AgreementCompany, AgreementData, AgreementSection, AgreementWitness } from "../types/agreement";
import { PartyEditor } from "./PartyEditor";
import { SectionEditor } from "./ClauseListEditor";

interface AgreementEditorProps {
  data: AgreementData;
  onChange: (next: AgreementData) => void;
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

function uuid() {
  return crypto.randomUUID();
}

export function AgreementEditor({ data, onChange }: AgreementEditorProps) {
  function update<K extends keyof AgreementData>(key: K, value: AgreementData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateCompany<K extends keyof AgreementCompany>(key: K, value: AgreementCompany[K]) {
    onChange({ ...data, company: { ...data.company, [key]: value } });
  }

  function updateVariable(key: string, value: string) {
    onChange({ ...data, variables: { ...data.variables, [key]: value } });
  }

  function updateSection(index: number, next: AgreementSection) {
    onChange({
      ...data,
      sections: data.sections.map((section, sectionIndex) => (sectionIndex === index ? next : section)),
    });
  }

  function addSection() {
    onChange({
      ...data,
      sections: [
        ...data.sections,
        {
          id: uuid(),
          heading: "New Section",
          intro: "",
          clauses: [],
        },
      ],
    });
  }

  function deleteSection(index: number) {
    if (!window.confirm("Delete this section and all its clauses?")) {
      return;
    }
    onChange({ ...data, sections: data.sections.filter((_, sectionIndex) => sectionIndex !== index) });
  }

  function updateWitnesses(next: AgreementWitness[]) {
    onChange({ ...data, witnesses: next });
  }

  const showApplicantFields = data.template === "inc-goodwill-execution";

  return (
    <div className="stack">
      <AccordionSection title="Document Header" helper="Title, effective date and letterhead toggle.">
        <div className="field-grid">
          <div className="field full-span">
            <label>Agreement Title</label>
            <input value={data.title} onChange={(event) => update("title", event.target.value)} />
          </div>
          <div className="field">
            <label>Effective Date</label>
            <input
              type="date"
              value={data.effectiveDate}
              onChange={(event) => update("effectiveDate", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Template</label>
            <input value={getAgreementTemplateLabel(data.template)} readOnly />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Our Side (Company)" helper="This appears in the letterhead on page 1 and in the left signature block.">
        <ImageUploader label="Company Logo" value={data.company.logoUrl} onChange={(value) => updateCompany("logoUrl", value)} />
        <div className="field-grid">
          <div className="field">
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
          <div className="field">
            <label>Website</label>
            <input value={data.company.website} onChange={(event) => updateCompany("website", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={3} value={data.company.address} onChange={(event) => updateCompany("address", event.target.value)} />
          </div>
          <div className="field">
            <label>CIN</label>
            <input value={data.company.cin} onChange={(event) => updateCompany("cin", event.target.value)} />
          </div>
          <div className="field">
            <label>GST Number</label>
            <input value={data.company.gst} onChange={(event) => updateCompany("gst", event.target.value)} />
          </div>
          <div className="field">
            <label>Our Signatory Name *</label>
            <input
              value={data.company.representativeName}
              onChange={(event) => updateCompany("representativeName", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Our Signatory Title</label>
            <input
              value={data.company.representativeTitle}
              onChange={(event) => updateCompany("representativeTitle", event.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Counterparty" helper="The other side of this agreement — partner / applicant / client.">
        <PartyEditor party={data.party} showApplicantFields={showApplicantFields} onChange={(party) => update("party", party)} />
      </AccordionSection>

      {data.variableFields.length > 0 ? (
        <AccordionSection
          title="Deal Variables"
          helper="These values get substituted into the clauses below wherever you see {{var.key}} placeholders."
        >
          <div className="field-grid">
            {data.variableFields.map((field) => (
              <div className={`field ${field.multiline ? "full-span" : ""}`} key={field.key}>
                <label>{field.label}</label>
                {field.multiline ? (
                  <textarea
                    rows={2}
                    value={data.variables[field.key] ?? ""}
                    onChange={(event) => updateVariable(field.key, event.target.value)}
                  />
                ) : (
                  <input
                    value={data.variables[field.key] ?? ""}
                    placeholder={field.helper}
                    onChange={(event) => updateVariable(field.key, event.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </AccordionSection>
      ) : null}

      <AccordionSection title="Intro & Recitals (WHEREAS)" helper="Edit the opening paragraph and the WHEREAS bullets.">
        <div className="field full-span">
          <label>Intro Paragraph</label>
          <textarea
            rows={5}
            value={data.introTemplate}
            onChange={(event) => update("introTemplate", event.target.value)}
          />
        </div>
        <div style={{ height: 14 }} />
        <BulletListEditor label="Recitals (WHEREAS)" items={data.recitals} onChange={(next) => update("recitals", next)} />
        <div style={{ height: 14 }} />
        <div className="field full-span">
          <label>"NOW, THEREFORE..." Preamble (optional)</label>
          <textarea
            rows={3}
            value={data.preambleAfterRecitals}
            onChange={(event) => update("preambleAfterRecitals", event.target.value)}
          />
        </div>
      </AccordionSection>

      <AccordionSection title="Body Sections & Clauses" helper="The numbered substance of the agreement. Drag clauses to reorder.">
        <div className="stack">
          {data.sections.map((section, index) => (
            <SectionEditor
              key={section.id}
              section={section}
              onChange={(next) => updateSection(index, next)}
              onDelete={() => deleteSection(index)}
            />
          ))}
          <button className="ghost-button" type="button" onClick={addSection}>
            <Plus size={16} />
            Add Section
          </button>
        </div>
      </AccordionSection>

      <AccordionSection title="Closing & Dispute Resolution">
        <div className="field full-span">
          <label>Closing Paragraph</label>
          <textarea
            rows={3}
            value={data.closingParagraph}
            onChange={(event) => update("closingParagraph", event.target.value)}
          />
        </div>
        <div style={{ height: 14 }} />
        <div className="field full-span">
          <label>Governing Law & Arbitration Paragraph</label>
          <textarea
            rows={6}
            value={data.governingLawParagraph}
            onChange={(event) => update("governingLawParagraph", event.target.value)}
          />
        </div>
      </AccordionSection>

      <AccordionSection title="Witnesses" helper="Optional witness lines below the signature blocks.">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Show Witnesses</span>
          <button
            className={`toggle ${data.showWitnesses ? "on" : ""}`}
            type="button"
            onClick={() => update("showWitnesses", !data.showWitnesses)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showWitnesses ? (
          <div className="stack">
            {data.witnesses.map((witness, index) => (
              <div className="list-item-row" key={witness.id} style={{ gridTemplateColumns: "32px 1fr auto" }}>
                <span style={{ fontWeight: 700, color: "#65748b" }}>{index + 1}.</span>
                <input
                  aria-label={`Witness ${index + 1} name`}
                  value={witness.name}
                  placeholder="Witness full name"
                  onChange={(event) => {
                    updateWitnesses(
                      data.witnesses.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: event.target.value } : item,
                      ),
                    );
                  }}
                />
                <button
                  className="icon-button"
                  type="button"
                  onClick={() =>
                    updateWitnesses(data.witnesses.filter((_, itemIndex) => itemIndex !== index))
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              className="ghost-button"
              type="button"
              onClick={() => updateWitnesses([...data.witnesses, { id: uuid(), name: "" }])}
            >
              <Plus size={16} />
              Add Witness Line
            </button>
          </div>
        ) : null}
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
