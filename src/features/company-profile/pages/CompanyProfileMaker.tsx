import { useEffect, useMemo, useState } from "react";
import { Navigate, useBeforeUnload, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MakerStickyTopbar } from "@/components/MakerStickyTopbar";
import { CompanyProfileEditor } from "../components/CompanyProfileEditor";
import { CompanyProfilePreview } from "../components/CompanyProfilePreview";
import { SaveCompanyProfileDialog } from "../components/SaveCompanyProfileDialog";
import { createDefaultCompanyProfileData, isAnnexureFirm, isCompanyFirm, isLetterheadFirm, normalizeCompanyProfileData } from "../lib/company-profile-defaults";
import { downloadAnnexureDocx } from "../lib/download-annexure-docx";
import {
  clearCompanyProfileDraft,
  getCompanyProfile,
  getCompanyProfileDraft,
  saveCompanyProfileDraft,
  saveCompanyProfileRecord,
} from "../lib/company-profile-storage";
import type { CompanyFirm, CompanyProfileData } from "../types/company-profile";

function cloneData(data: CompanyProfileData) {
  return JSON.parse(JSON.stringify(data)) as CompanyProfileData;
}

export function CompanyProfileMaker() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const firmParam = searchParams.get("firm");
  const explicitFirm: CompanyFirm | null = isCompanyFirm(firmParam) ? firmParam : null;
  const record = params.id ? getCompanyProfile(params.id) : null;
  const draft = !record ? getCompanyProfileDraft() : null;
  const shouldRedirectToList = !record && !explicitFirm && !draft;

  const initialData = useMemo(() => {
    if (record) {
      return normalizeCompanyProfileData(cloneData(record.content));
    }
    if (explicitFirm) {
      return createDefaultCompanyProfileData(explicitFirm);
    }
    const existingDraft = getCompanyProfileDraft();
    return existingDraft ? normalizeCompanyProfileData(existingDraft) : createDefaultCompanyProfileData();
  }, [record, explicitFirm]);

  const [data, setData] = useState<CompanyProfileData>(initialData);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(JSON.stringify(initialData));
  const [docxBusy, setDocxBusy] = useState(false);
  const isDirty = JSON.stringify(data) !== savedSnapshot;

  useEffect(() => {
    setData(initialData);
    setSavedSnapshot(JSON.stringify(initialData));
  }, [initialData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!record) {
        saveCompanyProfileDraft(data);
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

  async function handleSaveAsDocx() {
    if (docxBusy) {
      return;
    }
    setDocxBusy(true);
    try {
      await downloadAnnexureDocx(data);
    } catch (error) {
      console.error(error);
      window.alert("Could not create the Word file. Try again.");
    } finally {
      setDocxBusy(false);
    }
  }

  function handleSave(name: string) {
    const saved = saveCompanyProfileRecord({ id: record?.id, name, content: data });
    clearCompanyProfileDraft();
    setSavedSnapshot(JSON.stringify(data));
    setSaveDialogOpen(false);
    if (!record) {
      navigate(`/company-profile/${saved.id}`, { replace: true });
    }
  }

  function handleBack() {
    if (isDirty && !window.confirm("You have unsaved changes. Go back to all company details anyway?")) {
      return;
    }
    navigate("/company-profiles");
  }

  function handleReset() {
    if (!window.confirm("Reset the form to default values? Any unsaved edits will be lost.")) {
      return;
    }
    setData(createDefaultCompanyProfileData(explicitFirm ?? data.firm));
  }

  const letterheadOnly = isLetterheadFirm(data.firm);
  const annexureDoc = isAnnexureFirm(data.firm);
  const defaultSaveName = annexureDoc
    ? record?.name || "MSS Empanelment Annexure"
    : letterheadOnly
      ? record?.name || "MSS Letterhead"
      : data.legalName || record?.name || "Company Details";

  if (shouldRedirectToList) {
    return <Navigate replace to="/company-profiles" />;
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
        onSaveAsDocx={annexureDoc ? () => void handleSaveAsDocx() : undefined}
        onSave={() => setSaveDialogOpen(true)}
      />

      <div className={`layout-grid ${viewMode === "editor" ? "editor-only-grid" : viewMode === "preview" ? "preview-only-grid" : ""}`}>
        {viewMode !== "preview" ? (
          <section className="content-card editor-shell no-print">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>{annexureDoc ? "Empanelment Annexure" : letterheadOnly ? "MSS Letterhead" : "Company Details"}</h2>
              </div>
              <p className="muted-text">
                {annexureDoc
                  ? "Experience certificate, project references and bureau consent printed on MSS letterhead."
                  : letterheadOnly
                    ? "Edit the header and footer. Leave the body blank to print stationery, or type a letter."
                    : "Fill in the firm's contact, statutory and bank details."}
              </p>
            </div>
            <CompanyProfileEditor data={data} onChange={setData} />
          </section>
        ) : null}

        <section
          className={`content-card preview-shell ${viewMode === "editor" ? "preview-shell--offscreen-screen" : ""}`}
          aria-hidden={viewMode === "editor"}
        >
          <div className="panel-header no-print">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>{annexureDoc ? "Letterhead Annexure" : letterheadOnly ? "Letterhead" : "Shareable Sheet"}</h2>
            </div>
            <p className="muted-text">
              {annexureDoc
                ? "PDF uses the print dialog. DOCX downloads a Word file of this annexure."
                : "Save as PDF uses your browser — same layout as below."}
            </p>
          </div>
          <div className="preview-scale-note no-print">
            Each page is <strong>210 × 297 mm (A4)</strong>. Use <strong>Save as PDF</strong> in the print dialog to download &amp; share.
          </div>
          <div className="preview-a4-viewport">
            <CompanyProfilePreview data={data} />
          </div>
        </section>
      </div>

      <SaveCompanyProfileDialog
        defaultName={defaultSaveName}
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
