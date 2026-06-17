import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { BulletListEditor } from "@/features/offer-letter/components/BulletListEditor";
import { PartyEditor } from "@/features/agreement/components/PartyEditor";
import { SectionEditor } from "@/features/agreement/components/ClauseListEditor";
import { getPartnerTemplateLabel } from "../lib/partner-agreement-defaults";
import type {
  PartnerAgreementData,
  PartnerCompany,
  PartnerSection,
  PartnerWitness,
} from "../types/partner-agreement";
import { PartnerRateCardEditor } from "./PartnerRateCardEditor";

interface PartnerAgreementEditorProps {
  data: PartnerAgreementData;
  onChange: (next: PartnerAgreementData) => void;
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

export function PartnerAgreementEditor({ data, onChange }: PartnerAgreementEditorProps) {
  function update<K extends keyof PartnerAgreementData>(key: K, value: PartnerAgreementData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateCompany<K extends keyof PartnerCompany>(key: K, value: PartnerCompany[K]) {
    onChange({ ...data, company: { ...data.company, [key]: value } });
  }

  function updateVariable(key: string, value: string) {
    onChange({ ...data, variables: { ...data.variables, [key]: value } });
  }

  // Profit-share split: edit MSE's percentage, auto-derive the Partner's as the
  // remainder of 100%. Both are stored as "N%" so they flow into the clauses.
  function updateMssShare(raw: string) {
    if (raw.trim() === "") {
      onChange({ ...data, variables: { ...data.variables, mssShare: "", partnerShare: "" } });
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      return;
    }
    const clamped = Math.min(100, Math.max(0, n));
    const partner = Math.round((100 - clamped) * 1000) / 1000;
    const mssStr = clamped === n ? raw.trim() : String(clamped);
    onChange({
      ...data,
      variables: { ...data.variables, mssShare: `${mssStr}%`, partnerShare: `${partner}%` },
    });
  }

  function updateSection(index: number, next: PartnerSection) {
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

  function updateWitnesses(next: PartnerWitness[]) {
    onChange({ ...data, witnesses: next });
  }

  const isFixedRate = data.dealType === "fixed-rate";
  const PROFIT_SPLIT_KEYS = ["mssShare", "partnerShare"];
  const hasProfitSplit = data.variableFields.some((field) => field.key === "mssShare");
  const mssShareValue = (data.variables.mssShare ?? "").replace("%", "").trim();

  return (
    <div className="stack">
      <AccordionSection title="Document Header" helper="Title, deal type, effective date.">
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
            <label>Deal Type</label>
            <input value={getPartnerTemplateLabel(data.dealType)} readOnly />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Our Side (MSE)" helper="This appears in the letterhead on page 1 and in the left signature block.">
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

      <AccordionSection title="Partner (Counterparty)" helper="The partner who brings projects to MSE.">
        <div className="toggle-row" style={{ marginBottom: 12 }}>
          <span>Counterparty is an individual (no firm name)</span>
          <button
            className={`toggle ${data.partyIsIndividual ? "on" : ""}`}
            type="button"
            onClick={() => update("partyIsIndividual", !data.partyIsIndividual)}
          >
            <span className="toggle-thumb" />
          </button>
        </div>
        <PartyEditor
          party={data.party}
          showApplicantFields={false}
          individual={data.partyIsIndividual}
          onChange={(party) => update("party", party)}
        />
      </AccordionSection>

      {data.variableFields.length > 0 ? (
        <AccordionSection
          title="Deal Variables"
          helper="These values get substituted into the clauses below wherever you see {{var.key}} placeholders."
        >
          <div className="field-grid">
            {data.variableFields
              .filter((field) => !PROFIT_SPLIT_KEYS.includes(field.key))
              .map((field) => (
                <div className={`field ${field.multiline ? "full-span" : ""}`} key={field.key}>
                  <label>{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      rows={2}
                      value={data.variables[field.key] ?? ""}
                      placeholder={field.helper}
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

          {hasProfitSplit ? (
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Profit Split</label>
              <div className="field-grid">
                <div className="field">
                  <label>MSE Share (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.5"
                    value={mssShareValue}
                    placeholder="e.g. 50"
                    onChange={(event) => updateMssShare(event.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Partner Share (%) — auto</label>
                  <input value={data.variables.partnerShare ?? ""} readOnly tabIndex={-1} />
                </div>
              </div>
              <p className="helper-text">
                Enter MSE's share — the Partner's share is calculated automatically as the remainder of 100%.
              </p>
            </div>
          ) : null}
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

      <AccordionSection title="Body Sections & Clauses" helper="The numbered terms & conditions. Drag clauses to reorder.">
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

      <AccordionSection
        title="The Deal — Commercial Terms"
        helper={
          isFixedRate
            ? "The fixed per-system rate schedule. This renders as a table at the end of the agreement."
            : "How the net profit of each completed project is shared. Use the Deal Variables above for the split percentages."
        }
      >
        <div className="field full-span">
          <label>Commercial Terms Heading</label>
          <input value={data.dealHeading} onChange={(event) => update("dealHeading", event.target.value)} />
        </div>
        <div style={{ height: 14 }} />
        <div className="field full-span">
          <label>Commercial Terms Intro</label>
          <textarea
            rows={isFixedRate ? 4 : 6}
            value={data.dealIntro}
            onChange={(event) => update("dealIntro", event.target.value)}
            placeholder="Supports {{var.key}}, {{company.name}}, {{party.entityName}} placeholders."
          />
        </div>

        {isFixedRate ? (
          <>
            <div style={{ height: 16 }} />
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Fixed Rate Schedule</label>
            <PartnerRateCardEditor rateCards={data.rateCards} onChange={(next) => update("rateCards", next)} />
            <div style={{ height: 14 }} />
            <div className="field full-span">
              <label>Note Below the Rate Table (optional)</label>
              <textarea rows={3} value={data.rateNote} onChange={(event) => update("rateNote", event.target.value)} />
            </div>
          </>
        ) : null}
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
                  onClick={() => updateWitnesses(data.witnesses.filter((_, itemIndex) => itemIndex !== index))}
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
