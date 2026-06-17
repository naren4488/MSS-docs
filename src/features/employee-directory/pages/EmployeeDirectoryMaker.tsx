import { useEffect, useMemo, useState } from "react";
import { Navigate, useBeforeUnload, useNavigate, useParams } from "react-router-dom";
import { MakerStickyTopbar } from "@/components/MakerStickyTopbar";
import { EmployeeDirectoryEditor } from "../components/EmployeeDirectoryEditor";
import { EmployeeDirectoryPreview } from "../components/EmployeeDirectoryPreview";
import { SaveEmployeeDirectoryDialog } from "../components/SaveEmployeeDirectoryDialog";
import { createDefaultEmployeeDirectoryData, normalizeEmployeeDirectoryData } from "../lib/employee-directory-defaults";
import {
  clearEmployeeDirectoryDraft,
  getEmployeeDirectory,
  getEmployeeDirectoryDraft,
  saveEmployeeDirectoryDraft,
  saveEmployeeDirectoryRecord,
} from "../lib/employee-directory-storage";
import type { EmployeeDirectoryData } from "../types/employee-directory";

function cloneData(data: EmployeeDirectoryData) {
  return JSON.parse(JSON.stringify(data)) as EmployeeDirectoryData;
}

export function EmployeeDirectoryMaker() {
  const params = useParams();
  const navigate = useNavigate();
  const recordId = params.id;
  const record = recordId ? getEmployeeDirectory(recordId) : null;
  const draft = !record ? getEmployeeDirectoryDraft() : null;
  const shouldRedirectToList = !record && !draft;

  const initialData = useMemo(() => {
    if (recordId) {
      const loaded = getEmployeeDirectory(recordId);
      if (loaded) {
        return normalizeEmployeeDirectoryData(cloneData(loaded.content));
      }
    }
    const existingDraft = getEmployeeDirectoryDraft();
    return existingDraft ? normalizeEmployeeDirectoryData(existingDraft) : createDefaultEmployeeDirectoryData();
  }, [recordId]);

  const [data, setData] = useState<EmployeeDirectoryData>(initialData);
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
        saveEmployeeDirectoryDraft(data);
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
    const saved = saveEmployeeDirectoryRecord({ id: record?.id, name, content: data });
    clearEmployeeDirectoryDraft();
    setSavedSnapshot(JSON.stringify(data));
    setSaveDialogOpen(false);
    if (!record) {
      navigate(`/employee-directory/${saved.id}`, { replace: true });
    }
  }

  function handleBack() {
    if (isDirty && !window.confirm("You have unsaved changes. Go back to all employee registers anyway?")) {
      return;
    }
    navigate("/employees");
  }

  function handleReset() {
    if (!window.confirm("Reset the form to default values? Any unsaved edits will be lost.")) {
      return;
    }
    setData(createDefaultEmployeeDirectoryData());
  }

  const defaultSaveName = record?.name || data.companyName || "Employee Register";

  if (shouldRedirectToList) {
    return <Navigate replace to="/employees" />;
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
      />

      <div className={`layout-grid ${viewMode === "editor" ? "editor-only-grid" : viewMode === "preview" ? "preview-only-grid" : ""}`}>
        {viewMode !== "preview" ? (
          <section className="content-card editor-shell no-print">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>Employee Register</h2>
              </div>
              <p className="muted-text">Add all employees here — they appear together in one PDF.</p>
            </div>
            <EmployeeDirectoryEditor data={data} onChange={setData} />
          </section>
        ) : null}

        <section
          className={`content-card preview-shell ${viewMode === "editor" ? "preview-shell--offscreen-screen" : ""}`}
          aria-hidden={viewMode === "editor"}
        >
          <div className="panel-header no-print">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>Employee Details PDF</h2>
            </div>
            <p className="muted-text">All employees in one document — paginated for print.</p>
          </div>
          <div className="preview-scale-note no-print">
            Each page is <strong>210 × 297 mm (A4)</strong>. Use <strong>Save as PDF</strong> in the print dialog to download.
          </div>
          <div className="preview-a4-viewport">
            <EmployeeDirectoryPreview data={data} />
          </div>
        </section>
      </div>

      <SaveEmployeeDirectoryDialog
        defaultName={defaultSaveName}
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
