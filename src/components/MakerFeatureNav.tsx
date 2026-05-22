import { FileText, Handshake } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface MakerFeatureNavProps {
  isDirty?: boolean;
}

export function MakerFeatureNav({ isDirty = false }: MakerFeatureNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOfferMaker = location.pathname.startsWith("/offer-letter");
  const isAgreementMaker = location.pathname.startsWith("/agreement");

  function navigateTo(path: string) {
    if (isDirty && !window.confirm("You have unsaved changes. Leave this document anyway?")) {
      return;
    }
    navigate(path);
  }

  return (
    <div className="maker-feature-nav" role="navigation" aria-label="Document type">
      <button
        className={`maker-feature-nav-link ${isOfferMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/offer-letters")}
      >
        <FileText size={14} />
        Offer Letters
      </button>
      <button
        className={`maker-feature-nav-link ${isAgreementMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/agreements")}
      >
        <Handshake size={14} />
        Agreements
      </button>
    </div>
  );
}
