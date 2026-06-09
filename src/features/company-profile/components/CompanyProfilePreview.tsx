import type { CSSProperties, ReactNode } from "react";
import { PAGE_HEIGHT, PAGE_SIDE_PADDING, PAGE_TOP_BOTTOM_PADDING, PAGE_WIDTH } from "../constants/sheet-layout";
import type { CompanyProfileData } from "../types/company-profile";
import { filledValue } from "../lib/company-profile-formatters";

interface CompanyProfilePreviewProps {
  data: CompanyProfileData;
}

const NAVY = "#14306b";
const NAVY2 = "#1f4aa0";

const sectionBarStyle: CSSProperties = {
  background: `linear-gradient(90deg, ${NAVY}, ${NAVY2})`,
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  padding: "7px 12px",
  borderRadius: 4,
  margin: "18px 0 10px",
};

interface Row {
  label: string;
  value: string;
}

function InfoSection({ title, rows, show = true }: { title: string; rows: Row[]; show?: boolean }) {
  const visible = rows.filter((row) => row.value.trim());
  if (!show || visible.length === 0) {
    return null;
  }
  return (
    <div>
      <div style={sectionBarStyle}>{title}</div>
      <div style={{ display: "grid", gap: 6 }}>
        {visible.map((row) => (
          <div key={row.label} style={{ display: "grid", gridTemplateColumns: "170px 1fr", fontSize: 12, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: "#374151" }}>{row.label}</span>
            <span>: {row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ data }: { data: CompanyProfileData }) {
  return (
    <div style={{ textAlign: "center", borderBottom: `3px solid ${NAVY}`, paddingBottom: 16, marginBottom: 4 }}>
      {data.logoUrl ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <img alt="Logo" crossOrigin="anonymous" src={data.logoUrl} style={{ maxHeight: 100, width: "auto", objectFit: "contain" }} />
        </div>
      ) : null}
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1, color: NAVY, textTransform: "uppercase" }}>
        {filledValue(data.legalName)}
      </div>
      {data.tagline ? <div style={{ fontSize: 11.5, marginTop: 6, color: "#4b5563", fontStyle: "italic" }}>{data.tagline}</div> : null}
    </div>
  );
}

export function CompanyProfilePreview({ data }: CompanyProfilePreviewProps) {
  const sections: ReactNode[] = [
    <InfoSection
      key="contact"
      title="Contact Details"
      show={data.showContact}
      rows={[
        { label: "Address", value: data.address },
        { label: "Phone", value: data.phone },
        { label: "Alternate Phone", value: data.altPhone },
        { label: "Email", value: data.email },
        { label: "Website", value: data.website },
      ]}
    />,
    <InfoSection
      key="statutory"
      title="Statutory & Tax Details"
      show={data.showStatutory}
      rows={[
        { label: "GST Number", value: data.gst },
        { label: "PAN", value: data.pan },
        { label: "CIN", value: data.cin },
      ]}
    />,
    <InfoSection
      key="bank"
      title="Bank Details"
      show={data.showBank}
      rows={[
        { label: "Account Name", value: data.bankAccountName },
        { label: "Bank", value: data.bankName },
        { label: "A/c No.", value: data.bankAccountNo },
        { label: "IFSC Code", value: data.bankIfsc },
        { label: "Branch", value: data.bankBranch },
      ]}
    />,
    <InfoSection
      key="contact-person"
      title="Authorised Contact"
      show={data.showContactPerson}
      rows={[
        { label: "Name", value: data.contactName },
        { label: "Designation", value: data.contactTitle },
      ]}
    />,
  ];

  return (
    <div id="company-profile-preview" style={{ width: PAGE_WIDTH, display: "grid", gap: 28, overflow: "visible" }}>
      <div
        data-export-page="true"
        className="preview-a4-page"
        style={{
          width: PAGE_WIDTH,
          minHeight: PAGE_HEIGHT,
          boxSizing: "border-box",
          background: "#ffffff",
          color: "#111827",
          fontFamily: "Lexend, sans-serif",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
          padding: `${PAGE_TOP_BOTTOM_PADDING}px ${PAGE_SIDE_PADDING}px`,
          position: "relative",
        }}
      >
        {data.showLetterhead ? <Header data={data} /> : null}

        <div style={{ textAlign: "center", margin: "18px 0 4px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2,
              color: NAVY,
              borderBottom: `2px solid ${NAVY}`,
              paddingBottom: 3,
            }}
          >
            {filledValue(data.title)}
          </span>
        </div>

        {sections}

        {data.showNotes && data.notes.trim() ? (
          <div>
            <div style={sectionBarStyle}>Notes</div>
            <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.6, whiteSpace: "pre-wrap", textAlign: "justify" }}>{data.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
