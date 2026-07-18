import { BrochurePreview } from "../components/BrochurePreview";
import { createDefaultBrochureData } from "../lib/brochure-defaults";

export default function BrochurePage() {
  const brochureData = createDefaultBrochureData();

  return (
    <div className="brochure-page-shell">
      <BrochurePreview data={brochureData} />
    </div>
  );
}
