import { useMemo, useState } from "react";
import { Building2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY_FIRMS, getCompanyFirmLabel } from "../lib/company-profile-defaults";
import { formatRecordDate } from "../lib/company-profile-formatters";
import { deleteCompanyProfileRecord, listCompanyProfiles } from "../lib/company-profile-storage";

export function AllCompanyProfiles() {
  const [refreshToken, setRefreshToken] = useState(0);
  const records = useMemo(() => listCompanyProfiles(), [refreshToken]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this saved company details sheet?")) {
      return;
    }
    deleteCompanyProfileRecord(id);
    setRefreshToken((value) => value + 1);
  }

  return (
    <div className="page-shell">
      <section className="template-picker" style={{ marginBottom: 32 }}>
        <div className="panel-header">
          <div>
            <p className="eyebrow">Create New</p>
            <h2 style={{ margin: "4px 0 0" }}>Pick a firm</h2>
            <p className="muted-text" style={{ marginTop: 8, marginBottom: 0 }}>
              Choose a firm to create a shareable company details sheet. Saved sheets appear further down.
            </p>
          </div>
          <p className="muted-text">Each firm pre-fills its own name, contact, statutory and bank details.</p>
        </div>
        <div className="template-grid">
          {COMPANY_FIRMS.map((firm) => (
            <Link className="template-card" key={firm.id} to={`/company-profile?firm=${firm.id}`}>
              <div className="template-card-icon">
                <Building2 size={20} />
              </div>
              <div>
                <h3>{firm.label}</h3>
                <p className="muted-text" style={{ margin: 0 }}>
                  {firm.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Saved Documents</p>
          <h1>Company Details</h1>
          <p>Open any saved company details sheet to continue editing, or delete ones you no longer need.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-card">
          <p className="eyebrow">Nothing Saved Yet</p>
          <h2 style={{ marginTop: 0 }}>No saved company details yet</h2>
          <p className="muted-text">Pick a firm above to create a sheet. Saved sheets will appear here.</p>
        </div>
      ) : (
        <div className="saved-grid">
          {records.map((record) => (
            <article className="saved-card" key={record.id}>
              <div>
                <p className="eyebrow">{getCompanyFirmLabel(record.content.firm)}</p>
                <h3>{record.name || record.content.legalName || "Company Details"}</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Last updated {formatRecordDate(record.updatedAt)}
                </p>
              </div>
              <div className="saved-card-actions">
                <Link className="primary-button" to={`/company-profile/${record.id}`}>
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
