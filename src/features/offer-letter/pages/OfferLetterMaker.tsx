import { ArrowLeft, Columns2, Eye, Maximize2, Printer, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBeforeUnload, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { OfferLetterEditor } from "../components/OfferLetterEditor";
import { OfferLetterPreview } from "../components/OfferLetterPreview";
import { SaveOfferLetterDialog } from "../components/SaveOfferLetterDialog";
import {
  buildLegacyResponsibilities,
  createDefaultOfferLetterData,
  normalizeOfferLetterData,
  type OfferLetterTemplate,
} from "../lib/offer-letter-defaults";
import { clearDraft, getDraft, getOfferLetter, saveDraft, saveOfferLetterRecord } from "../lib/offer-letter-storage";
import type { OfferLetterData } from "../types/offer-letter";

const TEMPLATE_VALUES: OfferLetterTemplate[] = ["fresh", "full-time-conversion", "direct-full-time"];

function isOfferLetterTemplate(value: string | null): value is OfferLetterTemplate {
  return value !== null && (TEMPLATE_VALUES as string[]).includes(value);
}

function cloneData(data: OfferLetterData) {
  return JSON.parse(JSON.stringify(data)) as OfferLetterData;
}

export function OfferLetterMaker() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateParam = searchParams.get("template");
  const explicitTemplate: OfferLetterTemplate | null = isOfferLetterTemplate(templateParam) ? templateParam : null;
  const previewRef = useRef<HTMLDivElement | null>(null);
  const record = params.id ? getOfferLetter(params.id) : null;
  const initialData = useMemo(() => {
    if (record) {
      return normalizeOfferLetterData(cloneData(record.content));
    }

    if (explicitTemplate) {
      return createDefaultOfferLetterData(explicitTemplate);
    }

    const draft = getDraft();
    return draft ? normalizeOfferLetterData(draft) : createDefaultOfferLetterData();
  }, [record, explicitTemplate]);

  const [data, setData] = useState<OfferLetterData>(initialData);
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
      if (!record) {
        saveDraft({ ...data, responsibilities: buildLegacyResponsibilities(data) });
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [data, record]);

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
    const saved = saveOfferLetterRecord({
      id: record?.id,
      name,
      content: { ...data, responsibilities: buildLegacyResponsibilities(data) },
    });

    clearDraft();
    setSavedSnapshot(JSON.stringify(data));
    setSaveDialogOpen(false);

    if (!record) {
      navigate(`/offer-letter/${saved.id}`, { replace: true });
    }
  }

  function handleBack() {
    if (isDirty && !window.confirm("You have unsaved changes. Go back to all letters anyway?")) {
      return;
    }

    navigate("/offer-letters");
  }

  function handleReset() {
    if (!window.confirm("Reset the form to default values? Any unsaved edits will be lost.")) {
      return;
    }

    setData(createDefaultOfferLetterData(explicitTemplate ?? "fresh"));
  }

  return (
    <div className="page-shell page-shell--maker">
      <div className="sticky-topbar no-print">
        <button className="ghost-button" type="button" onClick={handleBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="topbar-actions">
          <div className={`status-pill ${isDirty ? "dirty" : ""}`}>{isDirty ? "Unsaved changes" : "All changes saved"}</div>
          <div className="segmented-control">
            <button className={`segment-button ${viewMode === "split" ? "active" : ""}`} type="button" onClick={() => setViewMode("split")}>
              <Columns2 size={16} />
              Split
            </button>
            <button className={`segment-button ${viewMode === "editor" ? "active" : ""}`} type="button" onClick={() => setViewMode("editor")}>
              <Maximize2 size={16} />
              Editor
            </button>
            <button className={`segment-button ${viewMode === "preview" ? "active" : ""}`} type="button" onClick={() => setViewMode("preview")}>
              <Eye size={16} />
              Preview
            </button>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={handleReset}
            title="Replace the current form with the default values"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => void handleSaveAsPdf()}
            title="Opens the print dialog — choose Save as PDF for a vector PDF matching the preview"
          >
            <Printer size={16} />
            Save as PDF
          </button>
          <button className="primary-button" type="button" onClick={() => setSaveDialogOpen(true)}>
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className={`layout-grid ${viewMode === "editor" ? "editor-only-grid" : viewMode === "preview" ? "preview-only-grid" : ""}`}>
        {viewMode !== "preview" ? (
          <section className="content-card editor-shell no-print">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>Offer Letter Details</h2>
              </div>
              <p className="muted-text">Fill each section in order and the document updates automatically.</p>
            </div>
            <OfferLetterEditor data={data} onChange={setData} />
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
            <OfferLetterPreview data={data} />
          </div>
        </section>
      </div>

      <SaveOfferLetterDialog
        defaultName={data.employeeName || record?.name || "Untitled Offer Letter"}
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
