import { useMemo, useState } from "react";
import { FilePlus2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PARTNER_TEMPLATES, getPartnerTemplateLabel } from "../lib/partner-agreement-defaults";
import { formatRecordDate } from "../lib/partner-agreement-formatters";
import { deletePartnerAgreementRecord, listPartnerAgreements } from "../lib/partner-agreement-storage";

export function AllPartnerAgreements() {
  const [refreshToken, setRefreshToken] = useState(0);
  const records = useMemo(() => listPartnerAgreements(), [refreshToken]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this saved partner agreement?")) {
      return;
    }
    deletePartnerAgreementRecord(id);
    setRefreshToken((value) => value + 1);
  }

  return (
    <div className="page-shell">
      <section className="template-picker" style={{ marginBottom: 32 }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Create New</p>
            <h2 style={{ margin: "4px 0 0" }}>Pick a deal type</h2>
            <p className="muted-text" style={{ marginTop: 8, marginBottom: 0 }}>
              Choose how this partner deal is structured. Saved partner agreements appear further down.
            </p>
          </div>
          <p className="muted-text">
            Both deal types share the same scope, responsibilities and payment-flow terms — only the commercial
            arrangement differs.
          </p>
        </div>
        <div className="template-grid">
          {PARTNER_TEMPLATES.map((template) => (
            <Link className="template-card" key={template.id} to={`/partner-agreement?deal=${template.id}`}>
              <div className="template-card-icon">
                <FilePlus2 size={20} />
              </div>
              <div>
                <h3>{template.label}</h3>
                <p className="muted-text" style={{ margin: 0 }}>
                  {template.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Saved Documents</p>
          <h1>Partner Agreements</h1>
          <p>Open any saved partner agreement to continue editing it, or delete old drafts you no longer need.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-card">
          <p className="eyebrow">Nothing Saved Yet</p>
          <h2 style={{ marginTop: 0 }}>No saved partner agreements yet</h2>
          <p className="muted-text">
            Pick a deal type above to start a new partner agreement. Saved documents will appear here.
          </p>
        </div>
      ) : (
        <div className="saved-grid">
          {records.map((record) => (
            <article className="saved-card" key={record.id}>
              <div>
                <p className="eyebrow">{getPartnerTemplateLabel(record.content.dealType)}</p>
                <h3>{record.name || "Untitled Partner Agreement"}</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Last updated {formatRecordDate(record.updatedAt)}
                </p>
              </div>
              <div className="saved-card-actions">
                <Link className="primary-button" to={`/partner-agreement/${record.id}`}>
                  Open
                </Link>
                <button className="danger-button" type="button" onClick={() => handleDelete(record.id)}>
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
