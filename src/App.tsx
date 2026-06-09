import { Building2, FileText, Handshake, HeartHandshake, ReceiptIndianRupee } from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AllOfferLetters, OfferLetterMaker } from "@/features/offer-letter";
import { AgreementMaker, AllAgreements } from "@/features/agreement";
import { AllPartnerAgreements, PartnerAgreementMaker } from "@/features/partner-agreement";
import { AllQuotations, QuotationMaker } from "@/features/quotation";
import { AllCompanyProfiles, CompanyProfileMaker } from "@/features/company-profile";

function FeatureNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isOfferList = location.pathname === "/offer-letters";
  const isAgreementList = location.pathname === "/agreements";
  const isPartnerList = location.pathname === "/partner-agreements";
  const isQuotationList = location.pathname === "/quotations";
  const isCompanyList = location.pathname === "/company-profiles";

  return (
    <nav className="feature-nav no-print">
      <button
        className={`feature-nav-link ${isOfferList ? "active" : ""}`}
        type="button"
        onClick={() => navigate("/offer-letters")}
      >
        <FileText size={16} />
        Offer Letters
      </button>
      <button
        className={`feature-nav-link ${isAgreementList ? "active" : ""}`}
        type="button"
        onClick={() => navigate("/agreements")}
      >
        <Handshake size={16} />
        Agreements
      </button>
      <button
        className={`feature-nav-link ${isPartnerList ? "active" : ""}`}
        type="button"
        onClick={() => navigate("/partner-agreements")}
      >
        <HeartHandshake size={16} />
        Partner Agreements
      </button>
      <button
        className={`feature-nav-link ${isQuotationList ? "active" : ""}`}
        type="button"
        onClick={() => navigate("/quotations")}
      >
        <ReceiptIndianRupee size={16} />
        Quotations
      </button>
      <button
        className={`feature-nav-link ${isCompanyList ? "active" : ""}`}
        type="button"
        onClick={() => navigate("/company-profiles")}
      >
        <Building2 size={16} />
        Company Details
      </button>
    </nav>
  );
}

export default function App() {
  const location = useLocation();
  const isMakerRoute =
    (location.pathname.startsWith("/offer-letter") && location.pathname !== "/offer-letters") ||
    (location.pathname.startsWith("/agreement") && location.pathname !== "/agreements") ||
    (location.pathname.startsWith("/partner-agreement") && location.pathname !== "/partner-agreements") ||
    (location.pathname.startsWith("/quotation") && location.pathname !== "/quotations") ||
    (location.pathname.startsWith("/company-profile") && location.pathname !== "/company-profiles");

  return (
    <div className="app-root">
      {!isMakerRoute && <FeatureNavigation />}
      <Routes>
        <Route path="/" element={<Navigate replace to="/offer-letters" />} />
        <Route path="/offer-letter" element={<OfferLetterMaker />} />
        <Route path="/offer-letter/:id" element={<OfferLetterMaker />} />
        <Route path="/offer-letters" element={<AllOfferLetters />} />
        <Route path="/agreement" element={<AgreementMaker />} />
        <Route path="/agreement/:id" element={<AgreementMaker />} />
        <Route path="/agreements" element={<AllAgreements />} />
        <Route path="/partner-agreement" element={<PartnerAgreementMaker />} />
        <Route path="/partner-agreement/:id" element={<PartnerAgreementMaker />} />
        <Route path="/partner-agreements" element={<AllPartnerAgreements />} />
        <Route path="/quotation" element={<QuotationMaker />} />
        <Route path="/quotation/:id" element={<QuotationMaker />} />
        <Route path="/quotations" element={<AllQuotations />} />
        <Route path="/company-profile" element={<CompanyProfileMaker />} />
        <Route path="/company-profile/:id" element={<CompanyProfileMaker />} />
        <Route path="/company-profiles" element={<AllCompanyProfiles />} />
      </Routes>
    </div>
  );
}
