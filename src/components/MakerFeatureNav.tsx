import { Building2, FileText, FolderKanban, Handshake, HeartHandshake, ReceiptIndianRupee, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface MakerFeatureNavProps {
  isDirty?: boolean;
}

export function MakerFeatureNav({ isDirty = false }: MakerFeatureNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isPartnerMaker = location.pathname.startsWith("/partner-agreement");
  const isOfferMaker = location.pathname.startsWith("/offer-letter");
  const isAgreementMaker = location.pathname.startsWith("/agreement") && !isPartnerMaker;
  const isQuotationMaker = location.pathname.startsWith("/quotation");
  const isCompanyMaker = location.pathname.startsWith("/company-profile");
  const isEmployeeMaker = location.pathname.startsWith("/employee-directory");

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
        Offers
      </button>
      <button
        className={`maker-feature-nav-link ${isAgreementMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/agreements")}
      >
        <Handshake size={14} />
        Agreements
      </button>
      <button
        className={`maker-feature-nav-link ${isPartnerMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/partner-agreements")}
      >
        <HeartHandshake size={14} />
        Partners
      </button>
      <button
        className={`maker-feature-nav-link ${isQuotationMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/quotations")}
      >
        <ReceiptIndianRupee size={14} />
        Quotations
      </button>
      <button
        className={`maker-feature-nav-link ${isCompanyMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/company-profiles")}
      >
        <Building2 size={14} />
        Company
      </button>
      <button
        className={`maker-feature-nav-link ${location.pathname === "/projects" ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/projects")}
      >
        <FolderKanban size={14} />
        Projects
      </button>
      <button
        className={`maker-feature-nav-link ${isEmployeeMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigateTo("/employees")}
      >
        <Users size={14} />
        Employees
      </button>
    </div>
  );
}
