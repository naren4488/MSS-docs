import { Languages } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useBeforeUnload, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MakerStickyTopbar } from "@/components/MakerStickyTopbar";
import { SaveAgreementDialog } from "@/features/agreement/components/SaveAgreementDialog";
import { PartnerAgreementEditor } from "../components/PartnerAgreementEditor";
import { PartnerAgreementPreview } from "../components/PartnerAgreementPreview";
import {
  createDefaultPartnerAgreementData,
  isHindiSupported,
  isPartnerDealType,
  normalizePartnerAgreementData,
  switchPartnerAgreementLanguage,
} from "../lib/partner-agreement-defaults";
import {
  clearPartnerAgreementDraft,
  getPartnerAgreement,
  getPartnerAgreementDraft,
  savePartnerAgreementDraft,
  savePartnerAgreementRecord,
} from "../lib/partner-agreement-storage";
import type { PartnerAgreementData, PartnerAgreementLanguage, PartnerDealType } from "../types/partner-agreement";

function cloneData(data: PartnerAgreementData) {
  return JSON.parse(JSON.stringify(data)) as PartnerAgreementData;
}

export function PartnerAgreementMaker() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dealParam = searchParams.get("deal");
  const explicitDeal: PartnerDealType | null = isPartnerDealType(dealParam) ? dealParam : null;
  const previewRef = useRef<HTMLDivElement | null>(null);
  const agreementId = params.id;
  const record = agreementId ? getPartnerAgreement(agreementId) : null;
  const draft = !record ? getPartnerAgreementDraft() : null;
  const shouldRedirectToList = !record && !explicitDeal && !draft;
  const recordUpdatedAt = record?.updatedAt ?? null;

  const initialData = useMemo(() => {
    if (agreementId) {
      const loaded = getPartnerAgreement(agreementId);
      if (loaded) {
        return normalizePartnerAgreementData(cloneData(loaded.content));
      }
    }
    if (explicitDeal) {
      return createDefaultPartnerAgreementData(explicitDeal);
    }
    const existingDraft = getPartnerAgreementDraft();
    return existingDraft
      ? normalizePartnerAgreementData(existingDraft)
      : createDefaultPartnerAgreementData();
  }, [agreementId, recordUpdatedAt, explicitDeal]);

  const [data, setData] = useState<PartnerAgreementData>(initialData);
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
        savePartnerAgreementDraft(data);
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
    const saved = savePartnerAgreementRecord({
      id: record?.id,
      name,
      content: data,
    });

    clearPartnerAgreementDraft();
    setSavedSnapshot(JSON.stringify(data));
    setSaveDialogOpen(false);

    if (!record) {
      navigate(`/partner-agreement/${saved.id}`, { replace: true });
    }
  }

  function handleBack() {
    if (isDirty && !window.confirm("You have unsaved changes. Go back to all partner agreements anyway?")) {
      return;
    }
    navigate("/partner-agreements");
  }

  function handleReset() {
    if (!window.confirm("Reset the form to default values? Any unsaved edits will be lost.")) {
      return;
    }
    setData(createDefaultPartnerAgreementData(explicitDeal ?? data.dealType, data.language));
  }

  function handleLanguageChange(next: PartnerAgreementLanguage) {
    if (next === data.language) return;
    if (
      !window.confirm(
        next === "hi"
          ? "Switch to Hindi? Template text will be replaced with the Hindi version. Your filled-in details (company, party, variables, rates, witnesses) will be preserved, but any custom edits to clause text will be lost."
          : "Switch to English? Template text will be replaced with the English version. Your filled-in details will be preserved, but any custom edits to clause text will be lost.",
      )
    ) {
      return;
    }
    setData(switchPartnerAgreementLanguage(data, next));
  }

  const defaultSaveName = data.party.entityName || record?.name || data.title || "Untitled Partner Agreement";

  if (shouldRedirectToList) {
    return <Navigate replace to="/partner-agreements" />;
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
        onSave={() => setSaveDialogOpen(true)}
        extraControls={
          <div className="segmented-control" title="Switch document language">
            <button
              className={`segment-button ${data.language === "en" ? "active" : ""}`}
              type="button"
              onClick={() => handleLanguageChange("en")}
            >
              <Languages size={14} aria-hidden />
              EN
            </button>
            <button
              className={`segment-button ${data.language === "hi" ? "active" : ""}`}
              type="button"
              onClick={() => handleLanguageChange("hi")}
              disabled={!isHindiSupported(data.dealType)}
            >
              हिं
            </button>
          </div>
        }
      />

      <div className={`layout-grid ${viewMode === "editor" ? "editor-only-grid" : viewMode === "preview" ? "preview-only-grid" : ""}`}>
        {viewMode !== "preview" ? (
          <section className="content-card editor-shell no-print">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>Partner Agreement Details</h2>
              </div>
              <p className="muted-text">Fill each section in order — variables and rates flow into the document automatically.</p>
            </div>
            <PartnerAgreementEditor data={data} onChange={setData} />
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
            <PartnerAgreementPreview data={data} />
          </div>
        </section>
      </div>

      <SaveAgreementDialog
        defaultName={defaultSaveName}
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
