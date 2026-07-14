import { useEffect, useMemo, useRef, useState } from "react";
import { useBeforeUnload, useNavigate, useParams } from "react-router-dom";
import { MakerStickyTopbar } from "@/components/MakerStickyTopbar";
import { QuotationEditor } from "../components/QuotationEditor";
import { QuotationPreview } from "../components/QuotationPreview";
import { SaveQuotationDialog } from "../components/SaveQuotationDialog";
import { createDefaultQuotationData, normalizeQuotationData } from "../lib/quotation-defaults";
import {
  clearQuotationDraft,
  getQuotation,
  getQuotationDraft,
  saveQuotationDraft,
  saveQuotationRecord,
} from "../lib/quotation-storage";
import type { QuotationData } from "../types/quotation";

function cloneData(data: QuotationData) {
  return JSON.parse(JSON.stringify(data)) as QuotationData;
}

export function QuotationMaker() {
  const params = useParams();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement | null>(null);

  const initialData = useMemo(() => {
    const currentRecord = params.id ? getQuotation(params.id) : null;
    if (currentRecord) {
      return normalizeQuotationData(cloneData(currentRecord.content));
    }
    const draft = getQuotationDraft();
    return draft ? normalizeQuotationData(draft) : createDefaultQuotationData();
  }, [params.id]);

  const [data, setData] = useState<QuotationData>(initialData);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialData));
  const isDirty = JSON.stringify(data) !== savedSnapshot;

  useEffect(() => {
    setData(initialData);
    setSavedSnapshot(JSON.stringify(initialData));
  }, [initialData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!params.id) {
        saveQuotationDraft(data);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [data, params.id]);

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
    await document.fonts.ready;
    await new Promise((resolve) => window.setTimeout(resolve, 150));
    window.print();
  }

  function handleSave(name: string) {
    const saved = saveQuotationRecord({ id: params.id, name, content: data });
    clearQuotationDraft();
    setSavedSnapshot(JSON.stringify(data));
    setSaveDialogOpen(false);
    if (!params.id) {
      navigate(`/quotation/${saved.id}`, { replace: true });
    }
  }

  function handleBack() {
    if (isDirty && !window.confirm("You have unsaved changes. Go back to all quotations anyway?")) {
      return;
    }
    navigate("/quotations");
  }

  function handleReset() {
    if (!window.confirm("Reset the form to default values? Any unsaved edits will be lost.")) {
      return;
    }
    setData(createDefaultQuotationData());
  }

  const currentRecord = params.id ? getQuotation(params.id) : null;
  const defaultSaveName = data.customerName || currentRecord?.name || data.capacity || "Untitled Quotation";

  return (
    <div className="page-shell page-shell--maker page-shell--maker-agreement">
      <MakerStickyTopbar
        isDirty={isDirty}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBack={handleBack}
        onReset={handleReset}
        onSaveAsPdf={() => void handleSaveAsPdf()}
        onSave={() => setSaveDialogOpen(true)}
      />

      <div className={`layout-grid ${viewMode === "editor" ? "editor-only-grid" : viewMode === "preview" ? "preview-only-grid" : ""}`}>
        {viewMode !== "preview" ? (
          <section className="content-card editor-shell no-print">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>Quotation Details</h2>
              </div>
              <p className="muted-text">Fill each section — line totals and the grand total are calculated automatically.</p>
            </div>
            <QuotationEditor data={data} onChange={setData} />
          </section>
        ) : null}

        <section
          ref={previewRef}
          className={`content-card preview-shell ${viewMode === "editor" ? "preview-shell--offscreen-screen" : ""}`}
          aria-hidden={viewMode === "editor"}
        >
          <div className="panel-header no-print">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>Page-by-Page Document</h2>
            </div>
            <p className="muted-text">Save as PDF uses your browser — same layout as below.</p>
          </div>
          <div className="preview-scale-note no-print">
            Each page is <strong>210 × 297 mm (A4)</strong>. Use <strong>Save as PDF</strong> in the print dialog to download.
          </div>
          <div className="preview-a4-viewport">
            <QuotationPreview data={data} />
          </div>
        </section>
      </div>

      <SaveQuotationDialog
        defaultName={defaultSaveName}
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
