import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MakerStickyTopbar } from "@/components/MakerStickyTopbar";
import { CompanyProfileEditor } from "../components/CompanyProfileEditor";
import { CompanyProfilePreview } from "../components/CompanyProfilePreview";
import { createDefaultCompanyProfileData, isAnnexureFirm, isCompanyFirm, isLetterheadFirm, isMseFirm, normalizeCompanyProfileData } from "../lib/company-profile-defaults";
import { documentDownloadName } from "@/lib/document-filename";
import { downloadAnnexureDocx } from "../lib/download-annexure-docx";
import {
  getCompanyProfile,
  getCompanyProfileDraft,
  saveCompanyProfileDraft,
} from "../lib/company-profile-storage";
import type { CompanyFirm, CompanyProfileData } from "../types/company-profile";

function companyDocumentName(data: CompanyProfileData): string {
  const brand = isMseFirm(data.firm) ? "MSE" : "MSS";
  if (isAnnexureFirm(data.firm)) return documentDownloadName("", "Empanelment Annexure", brand);
  if (isLetterheadFirm(data.firm)) return documentDownloadName("", "Letterhead", brand);
  return documentDownloadName(data.legalName, "Company Details", brand);
}

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
  const [docxBusy, setDocxBusy] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!record) {
        saveCompanyProfileDraft(data);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [data, record]);

  async function handleSaveAsPdf() {
    const previousTitle = document.title;
    document.title = companyDocumentName(data);
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

  function handleBack() {
    navigate("/company-profiles");
  }

  function handleReset() {
    if (!window.confirm("Reset the form to default values? Any edits will be lost.")) {
      return;
    }
    setData(createDefaultCompanyProfileData(explicitFirm ?? data.firm));
  }

  const letterheadOnly = isLetterheadFirm(data.firm);
  const annexureDoc = isAnnexureFirm(data.firm);
  const brandShort = isMseFirm(data.firm) ? "MSE" : "MSS";

  if (shouldRedirectToList) {
    return <Navigate replace to="/company-profiles" />;
  }

  return (
    <div className="page-shell page-shell--maker page-shell--maker-agreement">
      <MakerStickyTopbar
        isDirty={false}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onBack={handleBack}
        onReset={handleReset}
        onSaveAsPdf={() => void handleSaveAsPdf()}
        onSaveAsDocx={annexureDoc ? () => void handleSaveAsDocx() : undefined}
      />

      <div className={`layout-grid ${viewMode === "editor" ? "editor-only-grid" : viewMode === "preview" ? "preview-only-grid" : ""}`}>
        {viewMode !== "preview" ? (
          <section className="content-card editor-shell no-print">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>{annexureDoc ? "Empanelment Annexure" : letterheadOnly ? `${brandShort} Letterhead` : "Company Details"}</h2>
              </div>
              <p className="muted-text">
                {annexureDoc
                  ? `Experience certificate, project references and bureau consent printed on ${brandShort} letterhead.`
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
    </div>
  );
}
