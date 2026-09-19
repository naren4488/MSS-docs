import { PhoneCall, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EnquiriesTablePreview } from "../components/EnquiriesTablePreview";
import { fetchEnquiriesTable } from "../lib/fetch-enquiries";
import type { EnquiriesTable } from "../types/enquiries";

export function EnquiriesPage() {
  const [table, setTable] = useState<EnquiriesTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEnquiriesTable();
      setTable(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enquiries");
      setTable(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="page-shell page-shell--mss-sites">
      <div className="mss-sites-toolbar no-print">
        <div className="maker-heading">
          <p className="eyebrow">
            <PhoneCall size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
            Sales Pipeline
          </p>
          <h1>Enquiries</h1>
          <p className="muted-text" style={{ marginBottom: 0 }}>
            Sep Updated register — view only. Filter by status, source, lead and visit.
          </p>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button" type="button" onClick={() => void load()} disabled={loading}>
            <RefreshCw size={16} />
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {loading && !table ? (
        <div className="empty-card">
          <p className="eyebrow">Loading</p>
          <h2 style={{ marginTop: 0 }}>Fetching enquiries…</h2>
          <p className="muted-text">Reading the Sep Updated sheet.</p>
        </div>
      ) : null}

      {error ? (
        <div className="empty-card">
          <p className="eyebrow">Could not load</p>
          <h2 style={{ marginTop: 0 }}>Enquiries unavailable</h2>
          <p className="muted-text">{error}</p>
          <button className="primary-button" type="button" onClick={() => void load()} style={{ marginTop: 12 }}>
            Try again
          </button>
        </div>
      ) : null}

      {table ? (
        <div className="content-card mss-sites-preview-shell">
          <EnquiriesTablePreview key={table.fetchedAt} table={table} />
        </div>
      ) : null}
    </div>
  );
}
