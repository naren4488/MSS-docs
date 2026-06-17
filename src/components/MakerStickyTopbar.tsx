import { ArrowLeft, Columns2, Eye, Maximize2, Printer, RotateCcw, Save } from "lucide-react";
import type { ReactNode } from "react";
import { MakerFeatureNav } from "@/components/MakerFeatureNav";

export type MakerViewMode = "split" | "editor" | "preview";

interface MakerStickyTopbarProps {
  isDirty: boolean;
  viewMode: MakerViewMode;
  onViewModeChange: (mode: MakerViewMode) => void;
  onBack: () => void;
  onReset: () => void;
  onSaveAsPdf: () => void;
  onSave: () => void;
  extraControls?: ReactNode;
}

export function MakerStickyTopbar({
  isDirty,
  viewMode,
  onViewModeChange,
  onBack,
  onReset,
  onSaveAsPdf,
  onSave,
  extraControls,
}: MakerStickyTopbarProps) {
  return (
    <header className="sticky-topbar no-print">
      <div className="sticky-topbar-nav">
        <MakerFeatureNav isDirty={isDirty} />
      </div>

      <div className="sticky-topbar-controls">
        <div className="sticky-topbar-controls-start">
          <button className="ghost-button toolbar-button" type="button" onClick={onBack}>
            <ArrowLeft size={14} aria-hidden />
            Back
          </button>
          <div className={`status-pill ${isDirty ? "dirty" : ""}`} role="status">
            {isDirty ? "Unsaved" : "Saved"}
          </div>
        </div>

        <div className="sticky-topbar-controls-end">
          <div className="segmented-control" role="group" aria-label="Layout">
            <button
              className={`segment-button ${viewMode === "split" ? "active" : ""}`}
              type="button"
              title="Split view"
              onClick={() => onViewModeChange("split")}
            >
              <Columns2 size={14} aria-hidden />
              Split
            </button>
            <button
              className={`segment-button ${viewMode === "editor" ? "active" : ""}`}
              type="button"
              title="Editor only"
              onClick={() => onViewModeChange("editor")}
            >
              <Maximize2 size={14} aria-hidden />
              Editor
            </button>
            <button
              className={`segment-button ${viewMode === "preview" ? "active" : ""}`}
              type="button"
              title="Preview only"
              onClick={() => onViewModeChange("preview")}
            >
              <Eye size={14} aria-hidden />
              Preview
            </button>
          </div>

          {extraControls}

          <div className="sticky-topbar-action-group">
            <button
              className="ghost-button toolbar-button"
              type="button"
              onClick={onReset}
              title="Reset form to default values"
            >
              <RotateCcw size={14} aria-hidden />
              Reset
            </button>
            <button
              className="ghost-button toolbar-button"
              type="button"
              onClick={onSaveAsPdf}
              title="Save as PDF via print dialog"
            >
              <Printer size={14} aria-hidden />
              PDF
            </button>
            <button className="primary-button toolbar-button" type="button" onClick={onSave}>
              <Save size={14} aria-hidden />
              Save
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
