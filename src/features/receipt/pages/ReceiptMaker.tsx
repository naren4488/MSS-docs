import { useMemo, useState } from "react";
import { useBeforeUnload, useNavigate } from "react-router-dom";
import { MakerStickyTopbar } from "@/components/MakerStickyTopbar";
import { ReceiptEditor } from "../components/ReceiptEditor";
import { ReceiptPreview } from "../components/ReceiptPreview";
import { documentDownloadName } from "@/lib/document-filename";
import { createReceiptData } from "../lib/receipt-defaults";
import type { ReceiptData } from "../types/receipt";

export function ReceiptMaker() {
  const navigate = useNavigate();
  const initialData = useMemo(() => createReceiptData(), []);
  const [data, setData] = useState<ReceiptData>(initialData);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialData));
  const isDirty = JSON.stringify(data) !== savedSnapshot;

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
    document.title = documentDownloadName(data.customerName, "Project Confirmation Receipt");
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
    navigate("/receipts");
  }

  function handleReset() {
    if (!window.confirm("Reset this receipt? Your edits will be lost.")) return;
    const next = createReceiptData();
    setData(next);
    setSavedSnapshot(JSON.stringify(next));
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
                <p className="eyebrow">OCR</p>
                <h2>Project confirmation receipt</h2>
              </div>
              <p className="muted-text">Fill the client, the plant, and the payment. Amount in words is written on the PDF.</p>
            </div>
            <ReceiptEditor data={data} onChange={setData} />
          </section>
        ) : null}

        <section className={`content-card preview-shell ${viewMode === "editor" ? "preview-shell--offscreen-screen" : ""}`}>
          <div className="panel-header no-print">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>Receipt</h2>
            </div>
            <p className="muted-text">Save as PDF uses your browser — same layout as below.</p>
          </div>
          <div className="preview-a4-viewport">
            <ReceiptPreview data={data} />
          </div>
        </section>
      </div>
    </div>
  );
}
