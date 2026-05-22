import { FileText, Handshake } from "lucide-react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AllOfferLetters, OfferLetterMaker } from "@/features/offer-letter";
import { AgreementMaker, AllAgreements } from "@/features/agreement";

function FeatureNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isOfferList = location.pathname === "/offer-letters";
  const isAgreementList = location.pathname === "/agreements";

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
    </nav>
  );
}

export default function App() {
  const location = useLocation();
  const isMakerRoute =
    location.pathname.startsWith("/offer-letter") ||
    (location.pathname.startsWith("/agreement") && location.pathname !== "/agreements");

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
      </Routes>
    </div>
  );
}
