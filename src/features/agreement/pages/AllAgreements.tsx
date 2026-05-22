import { useMemo, useState } from "react";
import { FilePlus2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AGREEMENT_TEMPLATES } from "../lib/agreement-defaults";
import { formatRecordDate } from "../lib/agreement-formatters";
import { deleteAgreementRecord, listAgreements } from "../lib/agreement-storage";

export function AllAgreements() {
  const [refreshToken, setRefreshToken] = useState(0);
  const records = useMemo(() => listAgreements(), [refreshToken]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this saved agreement?")) {
      return;
    }
    deleteAgreementRecord(id);
    setRefreshToken((value) => value + 1);
  }

  return (
    <div className="page-shell">
      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Saved Documents</p>
          <h1>Agreements</h1>
          <p>Open any saved agreement to continue editing it, or delete old drafts you no longer need.</p>
        </div>
      </div>

      <section className="template-picker" style={{ marginBottom: 32 }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Create New</p>
            <h2 style={{ margin: "4px 0 0" }}>Pick a template</h2>
          </div>
          <p className="muted-text">
            Each template pre-fills different clauses and deal variables so you start from the right baseline.
          </p>
        </div>
        <div className="template-grid">
          {AGREEMENT_TEMPLATES.map((template) => (
            <Link
              className="template-card"
              key={template.id}
              to={`/agreement?template=${template.id}`}
            >
              <div className="template-card-icon">
                <FilePlus2 size={20} />
              </div>
              <div>
                <h3>{template.label}</h3>
                <p className="muted-text" style={{ margin: 0 }}>{template.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {records.length === 0 ? (
        <div className="empty-card">
          <p className="eyebrow">Nothing Saved Yet</p>
          <h2 style={{ marginTop: 0 }}>No saved agreements yet</h2>
          <p className="muted-text">
            Pick a template above to start a new agreement. Saved agreements will appear here.
          </p>
        </div>
      ) : (
        <div className="saved-grid">
          {records.map((record) => (
            <article className="saved-card" key={record.id}>
              <div>
                <p className="eyebrow">
                  {record.content.template === "vendor" ? "Vendor Agreement" : "Sales Partner Agreement"}
                </p>
                <h3>{record.name || "Untitled Agreement"}</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Last updated {formatRecordDate(record.updatedAt)}
                </p>
              </div>
              <div className="saved-card-actions">
                <Link className="primary-button" to={`/agreement/${record.id}`}>
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
