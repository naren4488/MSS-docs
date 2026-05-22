import type { DragEvent } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { AgreementClause, AgreementClauseSubPoint, AgreementSection } from "../types/agreement";

interface SectionEditorProps {
  section: AgreementSection;
  onChange: (next: AgreementSection) => void;
  onDelete?: () => void;
}

function uuid() {
  return crypto.randomUUID();
}

export function SectionEditor({ section, onChange, onDelete }: SectionEditorProps) {
  function updateSection<K extends keyof AgreementSection>(key: K, value: AgreementSection[K]) {
    onChange({ ...section, [key]: value });
  }

  function updateClause(index: number, next: AgreementClause) {
    onChange({
      ...section,
      clauses: section.clauses.map((clause, clauseIndex) => (clauseIndex === index ? next : clause)),
    });
  }

  function addClause() {
    const nextNumber = String(section.clauses.length + 1);
    onChange({
      ...section,
      clauses: [
        ...section.clauses,
        {
          id: uuid(),
          number: nextNumber,
          title: "",
          content: "",
          subPoints: [],
        },
      ],
    });
  }

  function deleteClause(index: number) {
    onChange({ ...section, clauses: section.clauses.filter((_, clauseIndex) => clauseIndex !== index) });
  }

  function handleClauseDragStart(index: number, event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleClauseDrop(index: number, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const startIndex = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isNaN(startIndex) || startIndex === index) {
      return;
    }
    const next = [...section.clauses];
    const [moved] = next.splice(startIndex, 1);
    next.splice(index, 0, moved);
    onChange({ ...section, clauses: next });
  }

  return (
    <div className="term-card" style={{ background: "#fbfdff" }}>
      <div className="section-title-row">
        <strong style={{ fontSize: 14 }}>Section: {section.heading || "Untitled"}</strong>
        {onDelete ? (
          <button className="icon-button" type="button" onClick={onDelete} title="Delete section">
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>
      <div className="field-grid">
        <div className="field full-span">
          <label>Section Heading</label>
          <input
            value={section.heading}
            onChange={(event) => updateSection("heading", event.target.value)}
          />
        </div>
        <div className="field full-span">
          <label>Intro Paragraph (optional)</label>
          <textarea
            rows={2}
            value={section.intro}
            onChange={(event) => updateSection("intro", event.target.value)}
          />
        </div>
      </div>

      <div className="stack" style={{ marginTop: 8 }}>
        {section.clauses.map((clause, index) => (
          <div
            key={clause.id}
            className="list-item-row"
            style={{ gridTemplateColumns: "auto 1fr auto", alignItems: "start" }}
            draggable
            onDragOver={(event) => event.preventDefault()}
            onDragStart={(event) => handleClauseDragStart(index, event)}
            onDrop={(event) => handleClauseDrop(index, event)}
          >
            <GripVertical className="drag-handle" size={18} style={{ marginTop: 12 }} />
            <ClauseEditor clause={clause} onChange={(next) => updateClause(index, next)} />
            <button
              className="icon-button"
              type="button"
              onClick={() => deleteClause(index)}
              title="Delete clause"
              style={{ marginTop: 8 }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button className="ghost-button" type="button" onClick={addClause}>
          <Plus size={16} />
          Add Clause
        </button>
      </div>
    </div>
  );
}

interface ClauseEditorProps {
  clause: AgreementClause;
  onChange: (next: AgreementClause) => void;
}

function ClauseEditor({ clause, onChange }: ClauseEditorProps) {
  function update<K extends keyof AgreementClause>(key: K, value: AgreementClause[K]) {
    onChange({ ...clause, [key]: value });
  }

  function updateSubPoint(index: number, next: AgreementClauseSubPoint) {
    onChange({
      ...clause,
      subPoints: clause.subPoints.map((point, pointIndex) => (pointIndex === index ? next : point)),
    });
  }

  function addSubPoint() {
    const nextLabel = String.fromCharCode("a".charCodeAt(0) + clause.subPoints.length);
    onChange({
      ...clause,
      subPoints: [...clause.subPoints, { id: uuid(), label: nextLabel, text: "" }],
    });
  }

  function deleteSubPoint(index: number) {
    onChange({ ...clause, subPoints: clause.subPoints.filter((_, pointIndex) => pointIndex !== index) });
  }

  return (
    <div className="stack" style={{ width: "100%" }}>
      <div className="field-grid">
        <div className="field">
          <label>Number</label>
          <input value={clause.number} onChange={(event) => update("number", event.target.value)} />
        </div>
        <div className="field">
          <label>Title (optional, bold)</label>
          <input value={clause.title} onChange={(event) => update("title", event.target.value)} />
        </div>
        <div className="field full-span">
          <label>Clause Content</label>
          <textarea
            rows={4}
            value={clause.content}
            onChange={(event) => update("content", event.target.value)}
            placeholder="Supports {{var.key}}, {{company.name}}, {{party.entityName}} placeholders."
          />
        </div>
      </div>

      {clause.subPoints.length > 0 ? (
        <div className="stack" style={{ gap: 8 }}>
          <strong style={{ fontSize: 12, color: "#65748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Sub-points
          </strong>
          {clause.subPoints.map((point, index) => (
            <div key={point.id} className="list-item-row" style={{ gridTemplateColumns: "80px 1fr auto" }}>
              <input
                aria-label="Sub-point label"
                value={point.label}
                onChange={(event) => updateSubPoint(index, { ...point, label: event.target.value })}
                style={{ width: "100%" }}
              />
              <textarea
                aria-label="Sub-point text"
                rows={2}
                value={point.text}
                onChange={(event) => updateSubPoint(index, { ...point, text: event.target.value })}
              />
              <button className="icon-button" type="button" onClick={() => deleteSubPoint(index)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button className="ghost-button" type="button" onClick={addSubPoint} style={{ alignSelf: "flex-start" }}>
        <Plus size={14} />
        Add Sub-point
      </button>
    </div>
  );
}
