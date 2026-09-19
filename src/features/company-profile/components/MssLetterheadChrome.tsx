import type { ReactNode } from "react";
import { CompanyLogo, getLetterheadLogoSize, getLetterheadLogoWrap } from "@/components/CompanyLogo";
import { PAGE_HEIGHT, PAGE_SIDE_PADDING, PAGE_WIDTH } from "../constants/sheet-layout";
import type { CompanyProfileData } from "../types/company-profile";
import { filledValue } from "../lib/company-profile-formatters";
import { getLetterheadVendorLine, isMseFirm } from "../lib/company-profile-defaults";

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
  const vendorLine = getLetterheadVendorLine(data.firm);
  const compact = isMseFirm(data.firm);
  const logoSize = getLetterheadLogoSize(data.logoUrl);

  return (
    <div style={{ background: "#ffffff" }}>
      <div style={{ textAlign: "center", padding: compact ? "12px 56px 8px" : "22px 56px 14px" }}>
        {data.logoUrl ? (
          <div style={getLetterheadLogoWrap(data.logoUrl)}>
            <CompanyLogo
              alt={`${filledValue(data.legalName)} logo`}
              src={data.logoUrl}
              maxHeight={logoSize.maxHeight}
              maxWidth={logoSize.maxWidth}
            />
          </div>
        ) : null}
        <div
          style={{
            fontSize: compact ? 17 : 20,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: NAVY,
            textTransform: "uppercase",
            lineHeight: 1.1,
            marginTop: compact ? 2 : 0,
          }}
        >
          {filledValue(data.legalName)}
        </div>
        <div
          style={{
            fontSize: compact ? 10 : 10.5,
            marginTop: compact ? 2 : 5,
            fontWeight: 600,
            color: "#1f4e79",
            letterSpacing: 0.2,
            lineHeight: 1.2,
          }}
        >
          {vendorLine}
        </div>
        {data.address.trim() ? (
          <div style={{ fontSize: 10, marginTop: compact ? 3 : 8, color: "#374151", lineHeight: 1.3 }}>
            {data.address}
          </div>
        ) : null}
        {contactLine ? (
          <div style={{ fontSize: 10, marginTop: compact ? 2 : 4, color: "#374151", lineHeight: 1.3 }}>{contactLine}</div>
        ) : null}
        {statutoryLine ? (
          <div style={{ fontSize: 9.5, marginTop: compact ? 2 : 4, color: "#4b5563", lineHeight: 1.3 }}>{statutoryLine}</div>
        ) : null}
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
