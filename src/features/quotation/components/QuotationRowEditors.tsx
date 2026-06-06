import type { DragEvent } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type {
  QuotationCommercialRow,
  QuotationMaterialItem,
  QuotationTermItem,
} from "../types/quotation";

function uuid() {
  return crypto.randomUUID();
}

function reorder<T>(list: T[], startIndex: number, index: number): T[] {
  const next = [...list];
  const [moved] = next.splice(startIndex, 1);
  next.splice(index, 0, moved);
  return next;
}

function dragProps<T>(
  list: T[],
  index: number,
  onChange: (next: T[]) => void,
) {
  return {
    draggable: true,
    onDragOver: (event: DragEvent<HTMLDivElement>) => event.preventDefault(),
    onDragStart: (event: DragEvent<HTMLDivElement>) => event.dataTransfer.setData("text/plain", String(index)),
    onDrop: (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const start = Number(event.dataTransfer.getData("text/plain"));
      if (Number.isNaN(start) || start === index) {
        return;
      }
      onChange(reorder(list, start, index));
    },
  };
}

// ---------- Material items ----------

export function MaterialItemEditor({
  items,
  onChange,
}: {
  items: QuotationMaterialItem[];
  onChange: (next: QuotationMaterialItem[]) => void;
}) {
  function update(index: number, next: QuotationMaterialItem) {
    onChange(items.map((item, i) => (i === index ? next : item)));
  }

  return (
    <div className="stack" style={{ gap: 10 }}>
      {items.map((item, index) => (
        <div key={item.id} className="term-card" style={{ background: "#fbfdff" }} {...dragProps(items, index, onChange)}>
          <div className="section-title-row">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#65748b" }}>
              <GripVertical className="drag-handle" size={16} />
              Item {index + 1}
            </span>
            <button className="icon-button" type="button" title="Delete item" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              <Trash2 size={16} />
            </button>
          </div>
          <div className="field-grid">
            <div className="field full-span">
              <label>Description</label>
              <input value={item.description} onChange={(event) => update(index, { ...item, description: event.target.value })} />
            </div>
            <div className="field">
              <label>Qty</label>
              <input value={item.qty} placeholder="e.g. 6 Panel" onChange={(event) => update(index, { ...item, qty: event.target.value })} />
            </div>
            <div className="field">
              <label>Unit</label>
              <input value={item.unit} placeholder="e.g. 555 Wp" onChange={(event) => update(index, { ...item, unit: event.target.value })} />
            </div>
            <div className="field full-span">
              <label>Make / Specification</label>
              <textarea rows={2} value={item.make} onChange={(event) => update(index, { ...item, make: event.target.value })} />
            </div>
          </div>
        </div>
      ))}
      <button
        className="ghost-button"
        type="button"
        style={{ alignSelf: "flex-start" }}
        onClick={() => onChange([...items, { id: uuid(), description: "", qty: "", unit: "", make: "" }])}
      >
        <Plus size={16} />
        Add Material Item
      </button>
    </div>
  );
}

// ---------- Commercial offer rows ----------

export function CommercialOfferEditor({
  rows,
  onChange,
}: {
  rows: QuotationCommercialRow[];
  onChange: (next: QuotationCommercialRow[]) => void;
}) {
  function update(index: number, next: QuotationCommercialRow) {
    onChange(rows.map((row, i) => (i === index ? next : row)));
  }

  return (
    <div className="stack" style={{ gap: 8 }}>
      {rows.map((row, index) => (
        <div
          key={row.id}
          className="list-item-row"
          style={{ gridTemplateColumns: "auto 1fr auto", alignItems: "start" }}
          {...dragProps(rows, index, onChange)}
        >
          <GripVertical className="drag-handle" size={18} style={{ marginTop: 10 }} />
          <div className="field-grid" style={{ gap: 6 }}>
            <div className="field full-span">
              <label>Parameter</label>
              <input value={row.parameter} onChange={(event) => update(index, { ...row, parameter: event.target.value })} />
            </div>
            <div className="field full-span">
              <label>Offering</label>
              <textarea rows={2} value={row.offering} onChange={(event) => update(index, { ...row, offering: event.target.value })} />
            </div>
          </div>
          <button className="icon-button" type="button" style={{ marginTop: 8 }} onClick={() => onChange(rows.filter((_, i) => i !== index))}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        className="ghost-button"
        type="button"
        style={{ alignSelf: "flex-start" }}
        onClick={() => onChange([...rows, { id: uuid(), parameter: "", offering: "" }])}
      >
        <Plus size={16} />
        Add Row
      </button>
    </div>
  );
}

// ---------- Terms (label + text) ----------

export function TermItemEditor({
  items,
  onChange,
}: {
  items: QuotationTermItem[];
  onChange: (next: QuotationTermItem[]) => void;
}) {
  function update(index: number, next: QuotationTermItem) {
    onChange(items.map((item, i) => (i === index ? next : item)));
  }

  return (
    <div className="stack" style={{ gap: 8 }}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="list-item-row"
          style={{ gridTemplateColumns: "auto 1fr auto", alignItems: "start" }}
          {...dragProps(items, index, onChange)}
        >
          <GripVertical className="drag-handle" size={18} style={{ marginTop: 10 }} />
          <div className="field-grid" style={{ gap: 6 }}>
            <div className="field full-span">
              <label>Heading (optional, bold)</label>
              <input value={item.label} onChange={(event) => update(index, { ...item, label: event.target.value })} />
            </div>
            <div className="field full-span">
              <label>Text</label>
              <textarea rows={2} value={item.text} onChange={(event) => update(index, { ...item, text: event.target.value })} />
            </div>
          </div>
          <button className="icon-button" type="button" style={{ marginTop: 8 }} onClick={() => onChange(items.filter((_, i) => i !== index))}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        className="ghost-button"
        type="button"
        style={{ alignSelf: "flex-start" }}
        onClick={() => onChange([...items, { id: uuid(), label: "", text: "" }])}
      >
        <Plus size={16} />
        Add Term
      </button>
    </div>
  );
}
