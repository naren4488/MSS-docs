import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { FeatureNavigation } from "@/components/FeatureNavigation";
import { AllOfferLetters, OfferLetterMaker } from "@/features/offer-letter";
import { AgreementMaker, AllAgreements } from "@/features/agreement";
import { AllPartnerAgreements, PartnerAgreementMaker } from "@/features/partner-agreement";
import { AllQuotations, QuotationMaker } from "@/features/quotation";
import { AllCompanyProfiles, CompanyProfileMaker } from "@/features/company-profile";
import { AllEmployeeDirectories, EmployeeDirectoryMaker } from "@/features/employee-directory";
import { MssSitesPage } from "@/features/mss-sites";
import BrochurePage from "@/features/brochure/pages/BrochurePage";

export default function App() {
  const location = useLocation();
  const isMakerRoute =
    (location.pathname.startsWith("/offer-letter") && location.pathname !== "/offer-letters") ||
    (location.pathname.startsWith("/agreement") && location.pathname !== "/agreements") ||
    (location.pathname.startsWith("/partner-agreement") && location.pathname !== "/partner-agreements") ||
    (location.pathname.startsWith("/quotation") && location.pathname !== "/quotations") ||
    (location.pathname.startsWith("/company-profile") && location.pathname !== "/company-profiles") ||
    (location.pathname.startsWith("/employee-directory") && location.pathname !== "/employees");

  return (
    <div className="app-root">
      {!isMakerRoute && <FeatureNavigation />}
      <Routes location={location} key={location.pathname}>
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
        <Route path="/employee-directory" element={<EmployeeDirectoryMaker />} />
        <Route path="/employee-directory/:id" element={<EmployeeDirectoryMaker />} />
        <Route path="/employees" element={<AllEmployeeDirectories />} />
        <Route path="/mss-sites" element={<Navigate replace to="/projects" />} />
        <Route path="/projects" element={<MssSitesPage />} />
        <Route path="/brochure" element={<BrochurePage />} />
      </Routes>
    </div>
  );
}
