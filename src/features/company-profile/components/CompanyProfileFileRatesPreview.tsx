import type { CSSProperties } from "react";
import { PAGE_WIDTH } from "../constants/sheet-layout";
import type { CompanyProfileData, FileRateRow } from "../types/company-profile";
import { LetterheadPage, NAVY } from "./MssLetterheadChrome";

function formatRateDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (!match) return trimmed;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return trimmed;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function formatRupees(value: string): string {
  const numeric = Number(String(value ?? "").replace(/[,\s₹]/g, ""));
  if (!Number.isFinite(numeric)) return value || "—";
  return `₹${numeric.toLocaleString("en-IN")}`;
}

const thStyle: CSSProperties = {
  border: `1px solid ${NAVY}`,
  background: NAVY,
  color: "#ffffff",
  padding: "8px 10px",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.3,
  textAlign: "left",
};

const tdStyle: CSSProperties = {
  border: "1px solid #c7ced9",
  padding: "7px 10px",
  fontSize: 12,
  color: "#152036",
  verticalAlign: "middle",
};

function RateTable({ rows }: { rows: FileRateRow[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 14, tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th style={{ ...thStyle, width: "28%" }}>Capacity</th>
          <th style={{ ...thStyle, width: "28%" }}>Phase</th>
          <th style={{ ...thStyle, width: "44%", textAlign: "right" }}>File rate (Deal with MSS)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.capacity}-${row.phase}-${index}`} style={{ background: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
            <td style={tdStyle}>{row.capacity || "—"}</td>
            <td style={tdStyle}>{row.phase || "—"}</td>
            <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{formatRupees(row.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CompanyProfileFileRatesPreview({ data }: { data: CompanyProfileData }) {
  const notice = data.fileRates;
  const effectiveLabel = formatRateDate(notice.effectiveDate);
  const issuedLabel = formatRateDate(notice.date);

  return (
    <div id="company-profile-preview" style={{ width: PAGE_WIDTH, display: "grid", gap: 28, overflow: "visible" }}>
      <LetterheadPage data={data}>
        <div style={{ paddingTop: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "baseline",
              marginBottom: 14,
              fontSize: 11.5,
              color: "#374151",
            }}
          >
            <span>
              <strong style={{ color: NAVY }}>Ref:</strong> MSS/FILE-RATES/SATYA/
              {notice.effectiveDate.replaceAll("-", "") || "——"}
            </span>
            <span>
              <strong style={{ color: NAVY }}>Date:</strong> {issuedLabel}
            </span>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.4,
              color: NAVY,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Circular — Revised Fixed File Rates
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: "#4b5563", marginBottom: 14 }}>
            For Satya Narayan Yadav · Effective from {effectiveLabel}
          </div>

          {(notice.addresseeName.trim() || notice.addresseeDetail.trim()) ? (
            <div style={{ marginBottom: 14, fontSize: 12.5, lineHeight: 1.55, color: "#152036" }}>
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>To,</div>
              {notice.addresseeName.trim() ? (
                <div style={{ fontWeight: 700 }}>{notice.addresseeName.trim()}</div>
              ) : null}
              {notice.addresseeDetail.trim() ? (
                <div style={{ whiteSpace: "pre-wrap", color: "#374151" }}>{notice.addresseeDetail.trim()}</div>
              ) : null}
            </div>
          ) : null}

          {notice.subject.trim() ? (
            <p style={{ margin: "0 0 12px", fontSize: 12.5, lineHeight: 1.55, color: "#152036" }}>
              <strong>Subject:</strong> {notice.subject.trim()}
            </p>
          ) : null}

          <p style={{ margin: "0 0 8px", fontSize: 12.5, lineHeight: 1.65, color: "#152036", whiteSpace: "pre-wrap" }}>
            {notice.intro.trim() ||
              `Dear Satya Narayan Ji,\n\nWith effect from ${effectiveLabel}, all new files logged by you under the fixed-rate partnership with ${data.legalName || "Mahi Solar Solution Private Limited"} shall be booked as per the Deal with MSS rates in the table below.`}
          </p>

          <RateTable rows={notice.rows} />

          {notice.closing.trim() ? (
            <p style={{ margin: "14px 0 0", fontSize: 12.5, lineHeight: 1.65, color: "#152036", whiteSpace: "pre-wrap" }}>
              {notice.closing.trim()}
            </p>
          ) : null}

          <div style={{ marginTop: 36, display: "grid", gap: 4, fontSize: 12.5, color: "#152036" }}>
            <div>For {data.legalName || "Mahi Solar Solution Private Limited"}</div>
            <div style={{ height: 44 }} />
            <div style={{ fontWeight: 700 }}>{notice.signatoryName || data.contactName || "—"}</div>
            <div style={{ color: "#4b5563" }}>{notice.signatoryTitle || data.contactTitle || ""}</div>
            <div style={{ marginTop: 8, color: "#4b5563" }}>
              Place: {notice.place || "Jaipur"}
              {notice.date ? `  ·  Date: ${issuedLabel}` : ""}
            </div>
          </div>
        </div>
      </LetterheadPage>
    </div>
  );
}
