import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import { BulletListEditor } from "@/features/offer-letter/components/BulletListEditor";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import { applyHandoverKind } from "../lib/handover-defaults";
import type { HandoverData, HandoverEquipmentItem, HandoverKind, HandoverTerm } from "../types/handover";

interface HandoverEditorProps {
  data: HandoverData;
  onChange: (next: HandoverData) => void;
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

export function HandoverEditor({ data, onChange }: HandoverEditorProps) {
  const offgrid = data.kind === "offgrid";

  function update<K extends keyof HandoverData>(key: K, value: HandoverData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateCompany<K extends keyof AgreementCompany>(key: K, value: AgreementCompany[K]) {
    onChange({ ...data, company: { ...data.company, [key]: value } });
  }

  function updateEquipment(id: string, patch: Partial<HandoverEquipmentItem>) {
    update(
      "equipment",
      data.equipment.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function updateTerm(id: string, patch: Partial<HandoverTerm>) {
    update(
      "terms",
      data.terms.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function changeKind(kind: HandoverKind) {
    if (kind === data.kind) return;
    if (
      !window.confirm(
        "Switch plant type? Client name, phone, address and dates stay. Equipment, care notes, documents and terms reset to that plant type.",
      )
    ) {
      return;
    }
    onChange(applyHandoverKind(data, kind));
  }

  return (
    <div className="editor-stack">
      <AccordionSection title="Company (Letterhead)" helper="Shown at the top of the PDF.">
        <div className="field-grid">
          <div className="field">
            <label>Company name</label>
            <input value={data.company.name} onChange={(event) => updateCompany("name", event.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={data.company.phone} onChange={(event) => updateCompany("phone", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Address</label>
            <textarea rows={2} value={data.company.address} onChange={(event) => updateCompany("address", event.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={data.company.email} onChange={(event) => updateCompany("email", event.target.value)} />
          </div>
          <div className="field">
            <label>Website</label>
            <input value={data.company.website} onChange={(event) => updateCompany("website", event.target.value)} />
          </div>
          <div className="field">
            <label>GST</label>
            <input value={data.company.gst} onChange={(event) => updateCompany("gst", event.target.value)} />
          </div>
          <div className="field">
            <label>Logo</label>
            <ImageUploader label="Logo" value={data.company.logoUrl} onChange={(logoUrl) => updateCompany("logoUrl", logoUrl)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Client" helper="Name and site. Empty fields print as a blank line." defaultOpen>
        <div className="field-grid">
          <div className="field">
            <label>Plant type</label>
            <select value={data.kind} onChange={(event) => changeKind(event.target.value as HandoverKind)}>
              <option value="ongrid">Grid-connected</option>
              <option value="offgrid">Off-grid</option>
            </select>
          </div>
          <div className="field">
            <label>Handover number</label>
            <input
              value={data.handoverNo}
              placeholder="e.g. HO-104"
              onChange={(event) => update("handoverNo", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Client name</label>
            <input value={data.customerName} onChange={(event) => update("customerName", event.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input
              value={data.customerPhone}
              placeholder="e.g. 9876543210"
              onChange={(event) => update("customerPhone", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Email (optional)</label>
            <input
              value={data.customerEmail}
              placeholder="Shown only if filled"
              onChange={(event) => update("customerEmail", event.target.value)}
            />
          </div>
          <div className="field full-span">
            <label>Site address</label>
            <textarea rows={2} value={data.address} onChange={(event) => update("address", event.target.value)} />
          </div>
          {offgrid ? null : (
            <>
              <div className="field">
                <label>Consumer / K number</label>
                <input value={data.consumerNumber} onChange={(event) => update("consumerNumber", event.target.value)} />
              </div>
              <div className="field">
                <label>DISCOM</label>
                <input value={data.discom} onChange={(event) => update("discom", event.target.value)} />
              </div>
            </>
          )}
        </div>
      </AccordionSection>

      <AccordionSection title="Plant" helper="The summary printed under the greeting. Equipment lines are edited separately." defaultOpen>
        <div className="field-grid">
          <div className="field">
            <label>Capacity</label>
            <input value={data.capacity} placeholder="e.g. 3.54 KW" onChange={(event) => update("capacity", event.target.value)} />
          </div>
          <div className="field">
            <label>Plant type on PDF</label>
            <input value={data.plantTypeLabel} onChange={(event) => update("plantTypeLabel", event.target.value)} />
          </div>
          {offgrid ? null : (
            <div className="field">
              <label>Connection</label>
              <input value={data.phase} placeholder="e.g. Single phase" onChange={(event) => update("phase", event.target.value)} />
            </div>
          )}
          <div className="field">
            <label>Invoice number</label>
            <input value={data.invoiceNo} placeholder="Optional" onChange={(event) => update("invoiceNo", event.target.value)} />
          </div>
          <div className="field">
            <label>Installation date</label>
            <input type="date" value={data.installationDate} onChange={(event) => update("installationDate", event.target.value)} />
          </div>
          <div className="field">
            <label>Commissioning date</label>
            <input type="date" value={data.commissioningDate} onChange={(event) => update("commissioningDate", event.target.value)} />
          </div>
          <div className="field">
            <label>Handover date</label>
            <input type="date" value={data.handoverDate} onChange={(event) => update("handoverDate", event.target.value)} />
          </div>
          <div className="field">
            <label>Modules</label>
            <input value={data.moduleSummary} onChange={(event) => update("moduleSummary", event.target.value)} />
          </div>
          <div className="field">
            <label>Inverter</label>
            <input value={data.inverterSummary} onChange={(event) => update("inverterSummary", event.target.value)} />
          </div>
          {offgrid ? (
            <div className="field full-span">
              <label>Battery bank</label>
              <input value={data.batterySummary} onChange={(event) => update("batterySummary", event.target.value)} />
            </div>
          ) : (
            <div className="field full-span">
              <label>Net metering note</label>
              <textarea rows={2} value={data.netMeteringNote} onChange={(event) => update("netMeteringNote", event.target.value)} />
            </div>
          )}
        </div>
      </AccordionSection>

      <AccordionSection title="Installed equipment" helper="The system record. Delete a line if it was not supplied.">
        <div className="editor-stack">
          {data.equipment.map((item, index) => (
            <div className="editor-repeat" key={item.id}>
              <div className="editor-repeat-head">
                <span>Item {index + 1}</span>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Delete item"
                  onClick={() => update("equipment", data.equipment.filter((row) => row.id !== item.id))}
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="field-grid">
                <div className="field">
                  <label>Description</label>
                  <input value={item.description} onChange={(event) => updateEquipment(item.id, { description: event.target.value })} />
                </div>
                <div className="field">
                  <label>Qty</label>
                  <input value={item.qty} onChange={(event) => updateEquipment(item.id, { qty: event.target.value })} />
                </div>
                <div className="field full-span">
                  <label>Specification</label>
                  <input value={item.specification} onChange={(event) => updateEquipment(item.id, { specification: event.target.value })} />
                </div>
                <div className="field full-span">
                  <label>Remarks</label>
                  <input value={item.remarks} onChange={(event) => updateEquipment(item.id, { remarks: event.target.value })} />
                </div>
              </div>
            </div>
          ))}
          <button
            className="ghost-button"
            type="button"
            onClick={() =>
              update("equipment", [
                ...data.equipment,
                { id: crypto.randomUUID(), description: "", specification: "", qty: "", remarks: "" },
              ])
            }
          >
            <Plus size={15} />
            Add equipment
          </button>
        </div>
      </AccordionSection>

      <AccordionSection title="Greeting and note" helper="The letter at the top of the document." defaultOpen>
        <div className="field-grid">
          <div className="field">
            <label>Greeting</label>
            <input value={data.greeting} onChange={(event) => update("greeting", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Note</label>
            <textarea rows={7} value={data.note} onChange={(event) => update("note", event.target.value)} />
          </div>
          <div className="field full-span">
            <label>Closing line</label>
            <textarea rows={2} value={data.closingNote} onChange={(event) => update("closingNote", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Checked at handover" helper="What was shown and confirmed on site.">
        <BulletListEditor
          label="Checks"
          items={data.commissioningChecks}
          onChange={(commissioningChecks) => update("commissioningChecks", commissioningChecks)}
        />
      </AccordionSection>

      <AccordionSection title="Papers handed over">
        <div className="editor-stack">
          {data.documents.map((item) => (
            <label className="handover-check-row" key={item.id}>
              <input
                type="checkbox"
                checked={item.handed}
                onChange={(event) =>
                  update(
                    "documents",
                    data.documents.map((row) => (row.id === item.id ? { ...row, handed: event.target.checked } : row)),
                  )
                }
              />
              <input
                value={item.label}
                onChange={(event) =>
                  update(
                    "documents",
                    data.documents.map((row) => (row.id === item.id ? { ...row, label: event.target.value } : row)),
                  )
                }
              />
              <button
                className="icon-button"
                type="button"
                aria-label="Delete paper"
                onClick={() => update("documents", data.documents.filter((row) => row.id !== item.id))}
              >
                <Trash2 size={15} />
              </button>
            </label>
          ))}
          <button
            className="ghost-button"
            type="button"
            onClick={() => update("documents", [...data.documents, { id: crypto.randomUUID(), label: "", handed: true }])}
          >
            <Plus size={15} />
            Add paper
          </button>
        </div>
      </AccordionSection>

      <AccordionSection title="Plant care" helper="What the client must do for the plant to keep working." defaultOpen>
        <BulletListEditor label="Care notes" items={data.careNotes} onChange={(careNotes) => update("careNotes", careNotes)} />
      </AccordionSection>

      <AccordionSection title="Terms">
        <div className="editor-stack">
          {data.terms.map((item) => (
            <div className="editor-repeat" key={item.id}>
              <div className="editor-repeat-head">
                <input
                  value={item.title}
                  aria-label="Term title"
                  onChange={(event) => updateTerm(item.id, { title: event.target.value })}
                />
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Delete term"
                  onClick={() => update("terms", data.terms.filter((row) => row.id !== item.id))}
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <textarea rows={3} value={item.text} onChange={(event) => updateTerm(item.id, { text: event.target.value })} />
            </div>
          ))}
          <button
            className="ghost-button"
            type="button"
            onClick={() => update("terms", [...data.terms, { id: crypto.randomUUID(), title: "", text: "" }])}
          >
            <Plus size={15} />
            Add term
          </button>
        </div>
      </AccordionSection>

      <AccordionSection title="Acknowledgement and signatory">
        <div className="field-grid">
          <div className="field full-span">
            <label>Client acknowledgement</label>
            <textarea rows={4} value={data.acknowledgement} onChange={(event) => update("acknowledgement", event.target.value)} />
          </div>
          <div className="field">
            <label>Signatory name</label>
            <input value={data.repName} onChange={(event) => update("repName", event.target.value)} />
          </div>
          <div className="field">
            <label>Title</label>
            <input value={data.repTitle} onChange={(event) => update("repTitle", event.target.value)} />
          </div>
          <div className="field">
            <label>Company</label>
            <input value={data.repCompany} onChange={(event) => update("repCompany", event.target.value)} />
          </div>
          <div className="field">
            <label>Mobile</label>
            <input value={data.repMobiles} onChange={(event) => update("repMobiles", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Settings">
        <div className="toggle-row">
          <span>Show letterhead</span>
          <button className={`toggle ${data.showLetterhead ? "on" : ""}`} type="button" onClick={() => update("showLetterhead", !data.showLetterhead)}>
            <span className="toggle-thumb" />
          </button>
        </div>
        <div className="toggle-row">
          <span>Show page numbers</span>
          <button className={`toggle ${data.showPageNumbers ? "on" : ""}`} type="button" onClick={() => update("showPageNumbers", !data.showPageNumbers)}>
            <span className="toggle-thumb" />
          </button>
        </div>
      </AccordionSection>
    </div>
  );
}
