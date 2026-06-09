import type { AgreementParty } from "../types/agreement";

interface PartyEditorProps {
  party: AgreementParty;
  showApplicantFields: boolean;
  /** When true, the counterparty is an individual (no firm): name + Aadhaar, no representative. */
  individual?: boolean;
  onChange: (next: AgreementParty) => void;
}

export function PartyEditor({ party, showApplicantFields, individual = false, onChange }: PartyEditorProps) {
  function update<K extends keyof AgreementParty>(key: K, value: AgreementParty[K]) {
    onChange({ ...party, [key]: value });
  }

  return (
    <div className="field-grid">
      <div className="field">
        <label>{individual ? "Full Name *" : "Entity / Business Name *"}</label>
        <input
          value={party.entityName}
          placeholder={individual ? "e.g. Ramesh Kumar" : "e.g. Acme Solar Energy"}
          onChange={(event) => update("entityName", event.target.value)}
        />
      </div>
      <div className="field">
        <label>Party Label</label>
        <input
          value={party.partyLabel}
          placeholder="Partner / Applicant / Client"
          onChange={(event) => update("partyLabel", event.target.value)}
        />
      </div>
      <div className="field full-span">
        <label>Address</label>
        <textarea
          rows={3}
          value={party.address}
          onChange={(event) => update("address", event.target.value)}
        />
      </div>

      {individual ? (
        <div className="field">
          <label>Aadhaar Number</label>
          <input
            value={party.aadhaar ?? ""}
            placeholder="XXXX XXXX XXXX"
            onChange={(event) => update("aadhaar", event.target.value)}
          />
        </div>
      ) : (
        <>
          <div className="field">
            <label>Representative Name *</label>
            <input
              value={party.representativeName}
              placeholder="Signatory on their side"
              onChange={(event) => update("representativeName", event.target.value)}
            />
          </div>
          <div className="field">
            <label>Representative Title</label>
            <input
              value={party.representativeTitle}
              placeholder="e.g. Proprietor / Director"
              onChange={(event) => update("representativeTitle", event.target.value)}
            />
          </div>
          <div className="field">
            <label>GST Number</label>
            <input
              value={party.gst ?? ""}
              placeholder="Firm's GST number"
              onChange={(event) => update("gst", event.target.value)}
            />
          </div>
        </>
      )}

      {showApplicantFields ? (
        <>
          <div className="field">
            <label>Consumer Number</label>
            <input
              value={party.consumerNumber}
              placeholder="Residential electricity connection number"
              onChange={(event) => update("consumerNumber", event.target.value)}
            />
          </div>
          <div className="field">
            <label>DISCOM</label>
            <input
              value={party.discom}
              placeholder="e.g. JVVNL"
              onChange={(event) => update("discom", event.target.value)}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
