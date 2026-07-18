import { useRef } from "react";
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
    <div className="w-full h-full bg-gray-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold text-gray-800">Mahi Solar Brochure</h1>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          📥 Download PDF
        </button>
      </div>
      <div className="flex-1 overflow-auto" ref={contentRef}>
        <BrochureContent data={data} />
      </div>
    </div>
  );
}
