import type { DragEvent } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { PartnerRateCard } from "../types/partner-agreement";

interface PartnerRateCardEditorProps {
  rateCards: PartnerRateCard[];
  onChange: (next: PartnerRateCard[]) => void;
}

function uuid() {
  return crypto.randomUUID();
}

export function PartnerRateCardEditor({ rateCards, onChange }: PartnerRateCardEditorProps) {
  function updateCard(index: number, next: PartnerRateCard) {
    onChange(rateCards.map((card, cardIndex) => (cardIndex === index ? next : card)));
  }

  function addCard() {
    onChange([...rateCards, { id: uuid(), capacity: "", phase: "", price: "" }]);
  }

  function deleteCard(index: number) {
    onChange(rateCards.filter((_, cardIndex) => cardIndex !== index));
  }

  function handleDragStart(index: number, event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDrop(index: number, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const startIndex = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isNaN(startIndex) || startIndex === index) {
      return;
    }
    const next = [...rateCards];
    const [moved] = next.splice(startIndex, 1);
    next.splice(index, 0, moved);
    onChange(next);
  }

  return (
    <div className="stack" style={{ gap: 8 }}>
      <div
        className="list-item-row"
        style={{ gridTemplateColumns: "auto 1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}
      >
        <span style={{ width: 18 }} />
        <strong style={{ fontSize: 12, color: "#65748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Capacity
        </strong>
        <strong style={{ fontSize: 12, color: "#65748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Phase
        </strong>
        <strong style={{ fontSize: 12, color: "#65748b", textTransform: "uppercase", letterSpacing: 0.5 }}>
          Rate (₹)
        </strong>
        <span style={{ width: 28 }} />
      </div>

      {rateCards.map((card, index) => (
        <div
          key={card.id}
          className="list-item-row"
          style={{ gridTemplateColumns: "auto 1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}
          draggable
          onDragOver={(event) => event.preventDefault()}
          onDragStart={(event) => handleDragStart(index, event)}
          onDrop={(event) => handleDrop(index, event)}
        >
          <GripVertical className="drag-handle" size={18} />
          <input
            aria-label="Capacity"
            value={card.capacity}
            placeholder="e.g. 5 kW"
            onChange={(event) => updateCard(index, { ...card, capacity: event.target.value })}
          />
          <input
            aria-label="Phase"
            value={card.phase}
            placeholder="1 Phase / 3 Phase / —"
            onChange={(event) => updateCard(index, { ...card, phase: event.target.value })}
          />
          <input
            aria-label="Rate"
            inputMode="numeric"
            value={card.price}
            placeholder="e.g. 250000"
            onChange={(event) => updateCard(index, { ...card, price: event.target.value })}
          />
          <button className="icon-button" type="button" title="Delete rate" onClick={() => deleteCard(index)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button className="ghost-button" type="button" onClick={addCard} style={{ alignSelf: "flex-start" }}>
        <Plus size={16} />
        Add Rate Row
      </button>
    </div>
  );
}
