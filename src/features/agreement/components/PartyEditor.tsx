import type { AgreementParty } from "../types/agreement";

interface PartyEditorProps {
  party: AgreementParty;
  showApplicantFields: boolean;
  onChange: (next: AgreementParty) => void;
}

export function PartyEditor({ party, showApplicantFields, onChange }: PartyEditorProps) {
  function update<K extends keyof AgreementParty>(key: K, value: AgreementParty[K]) {
    onChange({ ...party, [key]: value });
  }

  return (
    <div className="field-grid">
      <div className="field">
        <label>Entity / Business Name *</label>
        <input
          value={party.entityName}
          placeholder="e.g. Acme Solar Energy"
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
