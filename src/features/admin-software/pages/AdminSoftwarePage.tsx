import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardCheck, LayoutGrid, MonitorCog } from "lucide-react";
import { StatusTab } from "../components/StatusTab";
import { TestingTab } from "../components/TestingTab";
import { buildStatusDoc, buildTestingDoc } from "../lib/doc-models";
import "../admin-software.css";

type TabKey = "status" | "testing";

export function AdminSoftwarePage() {
  const [params, setParams] = useSearchParams();
  const tab: TabKey = params.get("tab") === "testing" ? "testing" : "status";
  const statusDoc = useMemo(() => buildStatusDoc(), []);
  const testingDoc = useMemo(() => buildTestingDoc(), []);

  const select = (next: TabKey) => {
    const nextParams = new URLSearchParams(params);
    if (next === "status") nextParams.delete("tab");
    else nextParams.set("tab", next);
    setParams(nextParams, { replace: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="page-shell page-shell--mss-sites asw-root">
      <div className="mss-sites-toolbar no-print">
        <div className="maker-heading">
          <p className="eyebrow">
            <MonitorCog size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
            Admin Software
          </p>
          <h1>Admin Software</h1>
          <p className="muted-text" style={{ marginBottom: 0 }}>
            Where the Mahi Solar admin app stands: every module and its review, and what to test.
          </p>
        </div>
      </div>

      <div className="mss-sites-scope-tabs no-print" role="tablist" aria-label="Admin software">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "status"}
          className={`mss-sites-scope-tab${tab === "status" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => select("status")}
        >
          <LayoutGrid size={16} aria-hidden />
          Project status
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "testing"}
          className={`mss-sites-scope-tab${tab === "testing" ? " mss-sites-scope-tab--active" : ""}`}
          onClick={() => select("testing")}
        >
          <ClipboardCheck size={16} aria-hidden />
          Testing report
        </button>
      </div>

      {tab === "status" ? <StatusTab doc={statusDoc} /> : <TestingTab doc={testingDoc} />}
    </div>
  );
}
