import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageUploader } from "@/features/offer-letter/components/ImageUploader";
import type { AgreementCompany } from "@/features/agreement/types/agreement";
import { RECEIPT_PAYMENT_MODES } from "../lib/receipt-defaults";
import type { ReceiptData, ReceiptPaymentMode } from "../types/receipt";

interface ReceiptEditorProps {
  data: ReceiptData;
  onChange: (next: ReceiptData) => void;
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

export function ReceiptEditor({ data, onChange }: ReceiptEditorProps) {
  function update<K extends keyof ReceiptData>(key: K, value: ReceiptData[K]) {
    onChange({ ...data, [key]: value });
  }

  function updateCompany<K extends keyof AgreementCompany>(key: K, value: AgreementCompany[K]) {
    onChange({ ...data, company: { ...data.company, [key]: value } });
  }

  const needsReference = data.paymentMode !== "Cash";

  return (
    <div className="editor-stack">
      <AccordionSection title="Client" helper="Who paid, and where the plant is." defaultOpen>
        <div className="field-grid">
          <div className="field">
            <label>Receipt number</label>
            <input value={data.receiptNo} placeholder="e.g. OCR-104" onChange={(event) => update("receiptNo", event.target.value)} />
          </div>
          <div className="field">
            <label>Receipt date</label>
            <input type="date" value={data.receiptDate} onChange={(event) => update("receiptDate", event.target.value)} />
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
          <div className="field full-span">
            <label>Site address</label>
            <textarea rows={2} value={data.address} onChange={(event) => update("address", event.target.value)} />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Project" helper="Only the basics. Leave quotation or project amount blank if you do not want them on the receipt." defaultOpen>
        <div className="field-grid">
          <div className="field">
            <label>Capacity</label>
            <input value={data.capacity} placeholder="e.g. 3 KW" onChange={(event) => update("capacity", event.target.value)} />
          </div>
          <div className="field">
            <label>Phase</label>
            <select value={data.phase} onChange={(event) => update("phase", event.target.value)}>
              <option value="">Not set</option>
              <option value="Single phase">Single phase</option>
              <option value="Three phase">Three phase</option>
            </select>
          </div>
          <div className="field">
            <label>Panels</label>
            <input
              value={data.panel}
              placeholder="e.g. 6 × Waaree 590 Wp"
              onChange={(event) => update("panel", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Inverter</label>
            <input
              value={data.inverter}
              placeholder="e.g. 3 kW MICROTEK"
              onChange={(event) => update("inverter", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Quotation number</label>
            <input value={data.quotationNo} placeholder="Optional" onChange={(event) => update("quotationNo", event.target.value)} />
          </div>
          <div className="field">
            <label>Project amount (₹)</label>
            <input
              value={data.projectAmount}
              placeholder="Optional — used for balance"
              onChange={(event) => update("projectAmount", event.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Payment received" helper="How much came in, and how." defaultOpen>
        <div className="field-grid">
          <div className="field">
            <label>Amount received (₹)</label>
            <input
              value={data.amountReceived}
              placeholder="e.g. 10000"
              onChange={(event) => update("amountReceived", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Received as</label>
            <input value={data.receivedAgainst} onChange={(event) => update("receivedAgainst", event.target.value)} />
          </div>
          <div className="field">
            <label>Payment date</label>
            <input type="date" value={data.paymentDate} onChange={(event) => update("paymentDate", event.target.value)} />
          </div>
          <div className="field">
            <label>Mode</label>
            <select
              value={data.paymentMode}
              onChange={(event) => update("paymentMode", event.target.value as ReceiptPaymentMode)}
            >
              {RECEIPT_PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          <div className="field full-span">
            <label>{needsReference ? "Reference" : "Reference (optional)"}</label>
            <input
              value={data.paymentReference}
              placeholder={data.paymentMode === "Cheque" ? "Cheque number" : "UPI ref / UTR"}
              onChange={(event) => update("paymentReference", event.target.value)}
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Note">
        <div className="field">
          <label>Note on the receipt</label>
          <textarea rows={4} value={data.note} onChange={(event) => update("note", event.target.value)} />
        </div>
      </AccordionSection>

      <AccordionSection title="Signatory">
        <div className="toggle-row">
          <span>Show signature on receipt</span>
          <button className={`toggle ${data.showSignature ? "on" : ""}`} type="button" onClick={() => update("showSignature", !data.showSignature)}>
            <span className="toggle-thumb" />
          </button>
        </div>
        {data.showSignature ? (
          <div className="field-grid">
            <div className="field">
              <label>Name</label>
              <input value={data.repName} onChange={(event) => update("repName", event.target.value)} />
            </div>
            <div className="field">
              <label>Title</label>
              <input value={data.repTitle} onChange={(event) => update("repTitle", event.target.value)} />
            </div>
          </div>
        ) : null}
      </AccordionSection>

      <AccordionSection title="Company (Letterhead)">
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
            <label>GST</label>
            <input value={data.company.gst} onChange={(event) => updateCompany("gst", event.target.value)} />
          </div>
          <div className="field">
            <label>Logo</label>
            <ImageUploader label="Logo" value={data.company.logoUrl} onChange={(logoUrl) => updateCompany("logoUrl", logoUrl)} />
          </div>
        </div>
        <div className="toggle-row">
          <span>Show letterhead</span>
          <button className={`toggle ${data.showLetterhead ? "on" : ""}`} type="button" onClick={() => update("showLetterhead", !data.showLetterhead)}>
            <span className="toggle-thumb" />
          </button>
        </div>
      </AccordionSection>
    </div>
  );
}
