import { FilePlus2, FileSignature, FileText, Handshake } from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AllOfferLetters, OfferLetterMaker } from "@/features/offer-letter";
import { AgreementMaker, AllAgreements } from "@/features/agreement";

function FeatureNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isOfferList = location.pathname === "/offer-letters";
  const isOfferMaker = location.pathname.startsWith("/offer-letter");
  const isAgreementList = location.pathname === "/agreements";
  const isAgreementMaker = location.pathname.startsWith("/agreement") && !isAgreementList;

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
        className={`feature-nav-link ${isOfferMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigate("/offer-letter")}
      >
        <FilePlus2 size={16} />
        New Offer Letter
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
        className={`feature-nav-link ${isAgreementMaker ? "active" : ""}`}
        type="button"
        onClick={() => navigate("/agreement")}
      >
        <FileSignature size={16} />
        New Agreement
      </button>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app-root">
      <FeatureNavigation />
      <Routes>
        <Route path="/" element={<Navigate replace to="/offer-letters" />} />
        <Route path="/offer-letter" element={<OfferLetterMaker />} />
        <Route path="/offer-letter/:id" element={<OfferLetterMaker />} />
        <Route path="/offer-letters" element={<AllOfferLetters />} />
        <Route path="/agreement" element={<AgreementMaker />} />
        <Route path="/agreement/:id" element={<AgreementMaker />} />
        <Route path="/agreements" element={<AllAgreements />} />
      </Routes>
    </div>
  );
}
