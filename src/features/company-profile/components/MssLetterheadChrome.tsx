import type { ReactNode } from "react";
import { CompanyLogo, LETTERHEAD_LOGO_WRAP } from "@/components/CompanyLogo";
import { PAGE_HEIGHT, PAGE_SIDE_PADDING, PAGE_WIDTH } from "../constants/sheet-layout";
import type { CompanyProfileData } from "../types/company-profile";
import { filledValue } from "../lib/company-profile-formatters";

export const NAVY = "#14306b";
export const NAVY2 = "#1f4aa0";
export const GOLD = "#E8A317";
export const MSS_VENDOR_LINE = "JVVNL & Government Registered Solar Vendor";
export const LETTERHEAD_FOOTER_PAD = 44;

export function joinParts(parts: Array<string | undefined>) {
  return parts
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join("  |  ");
}

export function LetterheadHeader({ data }: { data: CompanyProfileData }) {
  const contactLine = joinParts([data.phone, data.altPhone, data.email, data.website]);
  const statutoryLine = joinParts([
    data.gst ? `GST: ${data.gst}` : "",
    data.pan ? `PAN: ${data.pan}` : "",
    data.cin ? `CIN: ${data.cin}` : "",
  ]);

  return (
    <div style={{ background: "#ffffff" }}>
      <div style={{ textAlign: "center", padding: "22px 56px 14px" }}>
        {data.logoUrl ? (
          <div style={LETTERHEAD_LOGO_WRAP}>
            <CompanyLogo alt={`${filledValue(data.legalName)} logo`} src={data.logoUrl} />
          </div>
        ) : null}
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1.2, color: NAVY, textTransform: "uppercase", lineHeight: 1.15 }}>
          {filledValue(data.legalName)}
        </div>
        <div style={{ fontSize: 10.5, marginTop: 5, fontWeight: 600, color: "#1f4e79", letterSpacing: 0.2 }}>{MSS_VENDOR_LINE}</div>
        {data.address.trim() ? <div style={{ fontSize: 10, marginTop: 8, color: "#374151", lineHeight: 1.45 }}>{data.address}</div> : null}
        {contactLine ? <div style={{ fontSize: 10, marginTop: 4, color: "#374151" }}>{contactLine}</div> : null}
        {statutoryLine ? <div style={{ fontSize: 9.5, marginTop: 4, color: "#4b5563" }}>{statutoryLine}</div> : null}
      </div>
      <div style={{ height: 4, background: NAVY }} />
      <div style={{ height: 3, background: GOLD }} />
    </div>
  );
}

export function LetterheadFooter({ data }: { data: CompanyProfileData }) {
  const line = joinParts([data.website, data.phone, data.email]);
  if (!line) {
    return null;
  }
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
      <div style={{ height: 3, background: GOLD }} />
      <div
        style={{
          background: NAVY,
          color: "#ffffff",
          textAlign: "center",
          fontSize: 9.5,
          letterSpacing: 0.3,
          padding: "9px 56px",
        }}
      >
        {line}
      </div>
    </div>
  );
}

export function LetterheadPage({ data, children }: { data: CompanyProfileData; children: ReactNode }) {
  return (
    <div
      data-export-page="true"
      className="preview-a4-page"
      style={{
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        maxHeight: PAGE_HEIGHT,
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#111827",
        fontFamily: "Lexend, sans-serif",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
        padding: `0 0 ${LETTERHEAD_FOOTER_PAD}px`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LetterheadHeader data={data} />
      <div style={{ padding: `10px ${PAGE_SIDE_PADDING}px 0` }}>{children}</div>
      <LetterheadFooter data={data} />
    </div>
  );
}
