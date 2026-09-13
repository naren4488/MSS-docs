import { useEffect, useMemo, useState } from "react";
import { useBeforeUnload, useNavigate, useSearchParams } from "react-router-dom";
import { MakerStickyTopbar } from "@/components/MakerStickyTopbar";
import { HandoverEditor } from "../components/HandoverEditor";
import { HandoverPreview } from "../components/HandoverPreview";
import { createHandoverData, isHandoverKind } from "../lib/handover-defaults";
import type { HandoverData } from "../types/handover";

export function HandoverMaker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const kindParam = searchParams.get("kind");
  const kind = isHandoverKind(kindParam) ? kindParam : "ongrid";
  const initialData = useMemo(() => createHandoverData(kind), [kind]);

  const [data, setData] = useState<HandoverData>(initialData);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialData));
  const isDirty = JSON.stringify(data) !== savedSnapshot;

  useEffect(() => {
    setData(initialData);
    setSavedSnapshot(JSON.stringify(initialData));
  }, [initialData]);

  useBeforeUnload(
    (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    },
    { capture: true },
  );

  async function handleSaveAsPdf() {
    const previousTitle = document.title;
    const clientName = data.customerName.trim();
    document.title = clientName ? `${clientName} - MSS Handover` : "MSS Project Handover";
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);
    try {
      await document.fonts.ready;
      await new Promise((resolve) => window.setTimeout(resolve, 150));
      window.print();
    } catch {
      restoreTitle();
    }
  }

  function handleBack() {
    if (isDirty && !window.confirm("You have unsaved changes. Go back anyway?")) return;
    navigate("/handovers");
  }

  function handleReset() {
    if (!window.confirm("Reset this handover to the template? Your edits will be lost.")) return;
    setData(createHandoverData(data.kind));
  }

  return (
    <div className="page-shell page-shell--maker page-shell--maker-agreement">
      <MakerStickyTopbar
        isDirty={isDirty}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBack={handleBack}
        onReset={handleReset}
        onSaveAsPdf={() => void handleSaveAsPdf()}
      />

      <div className={`layout-grid ${viewMode === "editor" ? "editor-only-grid" : viewMode === "preview" ? "preview-only-grid" : ""}`}>
        {viewMode !== "preview" ? (
          <section className="content-card editor-shell no-print">
            <div className="panel-header">
              <div>
                <p className="eyebrow">{data.kind === "offgrid" ? "Off-grid" : "Grid-connected"}</p>
                <h2>Handover details</h2>
              </div>
              <p className="muted-text">Fill the client and plant. The letter, care notes and terms are already written — edit only what this site needs.</p>
            </div>
            <HandoverEditor data={data} onChange={setData} />
          </section>
        ) : null}

        <section className={`content-card preview-shell ${viewMode === "editor" ? "preview-shell--offscreen-screen" : ""}`}>
          <div className="panel-header no-print">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>Page-by-page document</h2>
            </div>
            <p className="muted-text">Save as PDF uses your browser — same layout as below.</p>
          </div>
          <div className="preview-a4-viewport">
            <HandoverPreview data={data} />
          </div>
        </section>
      </div>
    </div>
  );
}
