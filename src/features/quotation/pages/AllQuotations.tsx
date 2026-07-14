import { useMemo, useState } from "react";
import { FilePlus2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRecordDate } from "../lib/quotation-formatters";
import { deleteQuotationRecord, listQuotations } from "../lib/quotation-storage";

export function AllQuotations() {
  const [refreshToken, setRefreshToken] = useState(0);
  const records = useMemo(() => listQuotations(), [refreshToken]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this saved quotation?")) {
      return;
    }
    deleteQuotationRecord(id);
    setRefreshToken((value) => value + 1);
  }

  return (
    <div className="page-shell">
      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Saved Documents</p>
          <h1>Quotations</h1>
          <p>Create a new quotation, or open a saved one to continue editing it.</p>
        </div>
        <Link className="primary-button" to="/quotation?new=1">
          <FilePlus2 size={16} />
          New Quotation
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="empty-card">
          <p className="eyebrow">Nothing Saved Yet</p>
          <h2 style={{ marginTop: 0 }}>No saved quotations yet</h2>
          <p className="muted-text">Click "New Quotation" above to create your first one. Saved quotations will appear here.</p>
        </div>
      ) : (
        <div className="saved-grid">
          {records.map((record) => (
            <article className="saved-card" key={record.id}>
              <div>
                <p className="eyebrow">{record.content.capacity || "Solar Proposal"}</p>
                <h3>{record.name || record.content.customerName || "Untitled Quotation"}</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Last updated {formatRecordDate(record.updatedAt)}
                </p>
              </div>
              <div className="saved-card-actions">
                <Link className="primary-button" to={`/quotation/${record.id}`}>
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
