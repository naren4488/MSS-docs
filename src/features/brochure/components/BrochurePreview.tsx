import { useRef } from "react";
import { Download } from "lucide-react";
import type { BrochureData } from "../types/brochure";
import { BrochureContent } from "./BrochureContent";

interface BrochurePreviewProps {
  data: BrochureData;
}

export function BrochurePreview({ data }: BrochurePreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;
    window.print();
  };

  return (
    <div className="brochure-preview" style={{ background: "#e8edf5" }}>
      <div
        className="no-print brochure-preview-toolbar"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid rgba(20, 48, 107, 0.12)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0B2048", fontFamily: "Lexend, sans-serif" }}>
            Company Brochure
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#5b667a" }}>
            Client-ready preview · Print or save as PDF
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadPDF}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#0B2048",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "Lexend, sans-serif",
          }}
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>
      <div className="brochure-preview-scroll" ref={contentRef}>
        <BrochureContent data={data} />
      </div>
    </div>
  );
}
