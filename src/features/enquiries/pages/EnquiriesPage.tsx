import { PhoneCall, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EnquiriesTablePreview } from "../components/EnquiriesTablePreview";
import {
  DEFAULT_ENQUIRY_SHEET_TAB_ID,
  ENQUIRY_SHEET_TABS,
  getEnquirySheetTab,
  type EnquirySheetTabId,
} from "../lib/enquiries-config";
import { fetchEnquiriesTable } from "../lib/fetch-enquiries";
import type { EnquiriesTable } from "../types/enquiries";

export function EnquiriesPage() {
  const [tabId, setTabId] = useState<EnquirySheetTabId>(DEFAULT_ENQUIRY_SHEET_TAB_ID);
  const [table, setTable] = useState<EnquiriesTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab = getEnquirySheetTab(tabId);

  const load = useCallback(async (nextTabId: EnquirySheetTabId) => {
    setLoading(true);
    setError(null);
    setTable((prev) => (prev?.tabId === nextTabId ? prev : null));
    try {
      const data = await fetchEnquiriesTable(nextTabId);
      setTable(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enquiries");
      setTable(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(tabId);
  }, [tabId, load]);

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
            Month registers from the sales sheet — view only. Filter by status, source, lead and visit.
          </p>
        </div>
        <div className="topbar-actions">
          <button className="ghost-button" type="button" onClick={() => void load(tabId)} disabled={loading}>
            <RefreshCw size={16} />
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="projects-sheet-tab-filter no-print" aria-label="Enquiry month">
        <p className="projects-sheet-tab-filter-title">Month</p>
        <div className="projects-sheet-tab-filter-groups">
          <div className="projects-sheet-tab-filter-group">
            <div className="projects-sheet-tab-filter-chips" role="group" aria-label="Enquiry month tabs">
              {ENQUIRY_SHEET_TABS.map((tab) => {
                const active = tab.id === tabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`projects-sheet-tab-chip${active ? " projects-sheet-tab-chip--active" : ""}`}
                    aria-pressed={active}
                    disabled={loading && active}
                    onClick={() => {
                      if (tab.id !== tabId) setTabId(tab.id);
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {loading && !table ? (
        <div className="empty-card">
          <p className="eyebrow">Loading</p>
          <h2 style={{ marginTop: 0 }}>Fetching enquiries…</h2>
          <p className="muted-text">Reading the {activeTab.title.split(" · ")[0]} sheet.</p>
        </div>
      ) : null}

      {error ? (
        <div className="empty-card">
          <p className="eyebrow">Could not load</p>
          <h2 style={{ marginTop: 0 }}>Enquiries unavailable</h2>
          <p className="muted-text">{error}</p>
          <button className="primary-button" type="button" onClick={() => void load(tabId)} style={{ marginTop: 12 }}>
            Try again
          </button>
        </div>
      ) : null}

      {table ? (
        <div className="content-card mss-sites-preview-shell">
          <EnquiriesTablePreview key={`${table.tabId ?? tabId}-${table.fetchedAt}`} table={table} />
        </div>
      ) : null}
    </div>
  );
}
