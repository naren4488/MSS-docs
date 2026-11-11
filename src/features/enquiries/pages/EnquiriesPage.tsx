import { PhoneCall, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EnquiriesTablePreview } from "../components/EnquiriesTablePreview";
import { fetchAllEnquiriesTable, type AllEnquiriesResult } from "../lib/fetch-enquiries";

export function EnquiriesPage() {
  const [result, setResult] = useState<AllEnquiriesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await fetchAllEnquiriesTable());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enquiries");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const table = result?.table ?? null;
  const failedMonths = result?.failedMonths ?? [];

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
            All month registers from the sales sheet in one table — view only. Pick a month below the filters, or
            filter by status, source, lead and visit.
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
          <p className="muted-text">Reading every month tab of the sales sheet.</p>
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

      {failedMonths.length > 0 ? (
        <div className="empty-card no-print">
          <p className="muted-text" style={{ margin: 0 }}>
            Not loaded: {failedMonths.map((month) => `${month.label} (${month.message})`).join(", ")}. Other months are
            shown.
          </p>
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
