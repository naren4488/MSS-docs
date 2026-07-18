import { BrochurePreview } from "../components/BrochurePreview";
import { createDefaultBrochureData } from "../lib/brochure-defaults";

export default function BrochurePage() {
  const brochureData = createDefaultBrochureData();

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <BrochurePreview data={brochureData} />
    </div>
  );
}
