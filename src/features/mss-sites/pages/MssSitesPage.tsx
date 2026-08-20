import { Building2, FolderKanban, Handshake, LayoutGrid, Printer, RefreshCw, Table2, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MssSitesTablePreview, type MssSitesViewMode } from "../components/MssSitesTablePreview";
import { fetchMssSitesTable } from "../lib/fetch-mss-sites";
import { prepareMssSitesPrint } from "../lib/prepare-mss-sites-print";
import { prepareMssSitesAnalyticsPrint } from "../lib/prepare-mss-sites-analytics-print";
import type { ProjectsScope } from "../lib/projects-config";
import type { MssSitesTable } from "../types/mss-sites";

export function MssSitesPage() {
  const [table, setTable] = useState<MssSitesTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeMoreColumnInPdf, setIncludeMoreColumnInPdf] = useState(true);
  const [scope, setScope] = useState<ProjectsScope>("our");
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

  async function handleAnalyticsPrint() {
    await document.fonts.ready;
    await new Promise((resolve) => window.setTimeout(resolve, 200));
    const previousTitle = document.title;
    document.title =
      scope === "shripal"
        ? "Shripal sites — Analytics"
        : scope === "satyanarayan"
          ? "Satyanarayan sites — Analytics"
          : scope === "rjgreen"
            ? "RJ Green sites — Analytics"
            : scope === "ajay"
              ? "Ajay sites — Analytics"
              : scope === "partner"
                ? "Partner projects — Analytics"
                : "Our projects — Analytics";
    const cleanupPrint = prepareMssSitesAnalyticsPrint();
    const cleanup = () => {
      cleanupPrint();
      document.title = previousTitle;
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  const scopeSubtitle =
    scope === "our"
      ? "MSS residential & commercial sites (MSS + Arkshakti registers)."
      : scope === "shripal"
        ? "Shripal Ji sites from MSS and Arkshakti — separate register for special cases."
        : scope === "ajay"
          ? "Ajay Ji sites from MSS and Arkshakti — separate register for Ajay (everest)."
          : scope === "satyanarayan"
            ? "Satyanarayan Ji sites from the MSS workbook — separate register with Sub Vendor ledger."
            : scope === "rjgreen"
              ? "Rohit (RJ GREEN) sites from MSS and Arkshakti — separate register."
              : "Remaining partner-led site registers (excluding Shripal, Ajay, Satyanarayan, RJ Green).";

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
            {scopeSubtitle}
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
              <span className="mss-sites-pdf-option-label">Extra columns in PDF</span>
              <button
                type="button"
                className={`toggle ${includeMoreColumnInPdf ? "on" : ""}`}
                aria-pressed={includeMoreColumnInPdf}
                aria-label="Include MORE, quotation, status, remark and commission columns in PDF"
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
          {viewMode === "analytics" &&
          (scope === "our" ||
            scope === "shripal" ||
            scope === "ajay" ||
            scope === "satyanarayan" ||
            scope === "rjgreen" ||
            scope === "partner") ? (
            <button
              className="primary-button"
              type="button"
              disabled={!table || loading}
              onClick={() => void handleAnalyticsPrint()}
            >
              <Printer size={16} />
              Download analytics
            </button>
          ) : null}
        </div>
      </div>

      <div className="mss-sites-scope-tabs no-print" role="tablist" aria-label="Project scope">
        <button
          type="button"
          role="tab"
          aria-selected={scope === "our"}
          className={`mss-sites-scope-tab${scope === "our" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => setScope("our")}
        >
          <Building2 size={16} aria-hidden />
          Our projects
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === "shripal"}
          className={`mss-sites-scope-tab${scope === "shripal" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => setScope("shripal")}
        >
          <UserRound size={16} aria-hidden />
          Shripal sites
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === "ajay"}
          className={`mss-sites-scope-tab${scope === "ajay" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => setScope("ajay")}
        >
          <UserRound size={16} aria-hidden />
          Ajay sites
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === "satyanarayan"}
          className={`mss-sites-scope-tab${scope === "satyanarayan" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => setScope("satyanarayan")}
        >
          <UserRound size={16} aria-hidden />
          Satyanarayan
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === "rjgreen"}
          className={`mss-sites-scope-tab${scope === "rjgreen" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => setScope("rjgreen")}
        >
          <UserRound size={16} aria-hidden />
          RJ Green
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={scope === "partner"}
          className={`mss-sites-scope-tab${scope === "partner" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => setScope("partner")}
        >
          <Handshake size={16} aria-hidden />
          Partner projects
        </button>
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
          <MssSitesTablePreview table={table} viewMode={viewMode} scope={scope} />
        </section>
      ) : null}
    </div>
  );
}
