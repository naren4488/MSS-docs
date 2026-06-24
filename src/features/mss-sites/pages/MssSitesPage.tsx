import { FolderKanban, LayoutGrid, Printer, RefreshCw, Table2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MssSitesTablePreview, type MssSitesViewMode } from "../components/MssSitesTablePreview";
import { fetchMssSitesTable } from "../lib/fetch-mss-sites";
import { prepareMssSitesPrint } from "../lib/prepare-mss-sites-print";
import type { MssSitesTable } from "../types/mss-sites";

export function MssSitesPage() {
  const [table, setTable] = useState<MssSitesTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeMoreColumnInPdf, setIncludeMoreColumnInPdf] = useState(true);
  const [viewMode, setViewMode] = useState<MssSitesViewMode>("table");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMssSitesTable();
      setTable(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
      setTable(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePrint() {
    await document.fonts.ready;
    await new Promise((resolve) => window.setTimeout(resolve, 150));
    const cleanupPrint = prepareMssSitesPrint({ includeMoreColumn: includeMoreColumnInPdf });
    const cleanup = () => {
      cleanupPrint();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  return (
    <div className="page-shell page-shell--mss-sites">
      <div className="mss-sites-toolbar no-print">
        <div className="maker-heading">
          <p className="eyebrow">
            <FolderKanban size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
            Project Register
          </p>
          <h1>Projects</h1>
          <p className="muted-text" style={{ marginBottom: 0 }}>
            All site tabs merged from Google Sheets — read-only tabular view.
          </p>
        </div>
        <div className="topbar-actions">
          <div className="segmented-control mss-sites-view-toggle" role="group" aria-label="Projects view">
            <button
              className={`segment-button ${viewMode === "table" ? "active" : ""}`}
              type="button"
              title="Table view"
              onClick={() => setViewMode("table")}
            >
              <Table2 size={14} aria-hidden />
              Table
            </button>
            <button
              className={`segment-button ${viewMode === "analytics" ? "active" : ""}`}
              type="button"
              title="Analytics view"
              onClick={() => setViewMode("analytics")}
            >
              <LayoutGrid size={14} aria-hidden />
              Analytics
            </button>
          </div>
          {viewMode === "table" ? (
            <div className="mss-sites-pdf-option no-print">
              <span className="mss-sites-pdf-option-label">MORE column in PDF</span>
              <button
                type="button"
                className={`toggle ${includeMoreColumnInPdf ? "on" : ""}`}
                aria-pressed={includeMoreColumnInPdf}
                aria-label="Include MORE column in PDF"
                onClick={() => setIncludeMoreColumnInPdf((current) => !current)}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          ) : null}
          <button className="ghost-button" type="button" disabled={loading} onClick={() => void load()}>
            <RefreshCw size={16} />
            Refresh
          </button>
          {viewMode === "table" ? (
            <button className="primary-button" type="button" disabled={!table || loading} onClick={() => void handlePrint()}>
              <Printer size={16} />
              Save as PDF
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="empty-card">
          <p className="muted-text">Loading projects from Google Sheet…</p>
        </div>
      ) : null}

      {error ? (
        <div className="empty-card">
          <p className="eyebrow">Could not load sheet</p>
          <h2 style={{ marginTop: 0 }}>Failed to fetch data</h2>
          <p className="muted-text">{error}</p>
          <button className="primary-button" type="button" onClick={() => void load()}>
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      ) : null}

      {table && !loading ? (
        <section className="content-card mss-sites-preview-shell">
          <MssSitesTablePreview table={table} viewMode={viewMode} />
        </section>
      ) : null}
    </div>
  );
}
