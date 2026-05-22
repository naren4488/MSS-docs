import { useMemo, useState } from "react";
import { FilePlus2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { OFFER_LETTER_TEMPLATES } from "../lib/offer-letter-defaults";
import { formatRecordDate } from "../lib/offer-letter-formatters";
import { deleteOfferLetterRecord, listOfferLetters } from "../lib/offer-letter-storage";

export function AllOfferLetters() {
  const [refreshToken, setRefreshToken] = useState(0);
  const records = useMemo(() => listOfferLetters(), [refreshToken]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this saved offer letter?")) {
      return;
    }

    deleteOfferLetterRecord(id);
    setRefreshToken((value) => value + 1);
  }

  return (
    <div className="page-shell">
      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Saved Documents</p>
          <h1>Offer Letters</h1>
          <p>Open any saved letter, continue editing it, or delete old drafts you no longer need.</p>
        </div>
      </div>

      <section className="template-picker" style={{ marginBottom: 32 }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Create New</p>
            <h2 style={{ margin: "4px 0 0" }}>Pick a template</h2>
          </div>
          <p className="muted-text">
            Each template pre-fills different terms (probation / salary review) so you start from the right baseline.
          </p>
        </div>
        <div className="template-grid">
          {OFFER_LETTER_TEMPLATES.map((template) => (
            <Link
              className="template-card"
              key={template.id}
              to={`/offer-letter?template=${template.id}`}
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
          <h2 style={{ marginTop: 0 }}>No saved letters yet</h2>
          <p className="muted-text">
            Pick a template above to start a new document. Saved letters will appear here.
          </p>
        </div>
      ) : (
        <div className="saved-grid">
          {records.map((record) => (
            <article className="saved-card" key={record.id}>
              <div>
                <p className="eyebrow">Offer Letter</p>
                <h3>{record.name || "Untitled Offer Letter"}</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Last updated {formatRecordDate(record.updatedAt)}
                </p>
              </div>
              <div className="saved-card-actions">
                <Link className="primary-button" to={`/offer-letter/${record.id}`}>
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
