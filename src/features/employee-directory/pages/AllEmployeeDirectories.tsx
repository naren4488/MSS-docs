import { useMemo, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRecordDate } from "../lib/employee-directory-formatters";
import { deleteEmployeeDirectoryRecord, listEmployeeDirectories } from "../lib/employee-directory-storage";

export function AllEmployeeDirectories() {
  const [refreshToken, setRefreshToken] = useState(0);
  const records = useMemo(() => listEmployeeDirectories(), [refreshToken]);

  function handleDelete(id: string) {
    if (!window.confirm("Delete this employee register?")) {
      return;
    }
    deleteEmployeeDirectoryRecord(id);
    setRefreshToken((value) => value + 1);
  }

  return (
    <div className="page-shell">
      <div className="maker-toolbar" style={{ marginBottom: 24 }}>
        <div className="maker-heading">
          <p className="eyebrow">Employee Register</p>
          <h1>Employee Details</h1>
          <p>Maintain all employee contact, identity and bank details in a single PDF for Mahi Solar Energy.</p>
        </div>
        <Link className="primary-button" to="/employee-directory">
          <Plus size={16} />
          New Register
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="empty-card">
          <Users size={32} style={{ color: "#94a3b8", marginBottom: 12 }} />
          <p className="eyebrow">Nothing Saved Yet</p>
          <h2 style={{ marginTop: 0 }}>No employee register yet</h2>
          <p className="muted-text">Create a register to add employees — all details export in one PDF.</p>
        </div>
      ) : (
        <div className="saved-grid">
          {records.map((record) => (
            <article className="saved-card" key={record.id}>
              <div>
                <p className="eyebrow">{record.content.employees.length} employee(s)</p>
                <h3>{record.name || record.content.companyName || "Employee Register"}</h3>
                <p className="muted-text" style={{ marginBottom: 0 }}>
                  Last updated {formatRecordDate(record.updatedAt)}
                </p>
              </div>
              <div className="saved-card-actions">
                <Link className="primary-button" to={`/employee-directory/${record.id}`}>
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
