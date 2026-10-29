import type { CSSProperties, ReactNode } from "react";
import { CompanyLogo, getLetterheadLogoSize, getLetterheadLogoWrap } from "@/components/CompanyLogo";
import type { CompanyProfileData, SiteSurveyForm } from "../types/company-profile";
import { filledValue, formatDate } from "../lib/company-profile-formatters";
import { getLetterheadVendorLine, SITE_SURVEY_TERMS } from "../lib/company-profile-defaults";
import { NAVY } from "./MssLetterheadChrome";
import { PAGE_HEIGHT, PAGE_SIDE_PADDING, PAGE_TOP_BOTTOM_PADDING, PAGE_WIDTH } from "../constants/sheet-layout";

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
  fontSize: 10.5,
  lineHeight: 1.35,
};

const cellStyle: CSSProperties = {
  border: `1px solid ${NAVY}`,
  padding: "5px 8px",
  verticalAlign: "top",
};

const labelCellStyle: CSSProperties = {
  ...cellStyle,
  width: "22%",
  fontWeight: 600,
  background: "#f4f7fb",
  color: "#1f2937",
};

const headerBarStyle: CSSProperties = {
  background: NAVY,
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: 0.4,
  textTransform: "uppercase",
  padding: "6px 10px",
  margin: "12px 0 0",
};

/** Every survey form table uses 4 fixed columns so rows align. */
function ColGroup() {
  return (
    <colgroup>
      <col style={{ width: "22%" }} />
      <col style={{ width: "28%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "28%" }} />
    </colgroup>
  );
}

function FormRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={labelCellStyle}>{label}</td>
      <td colSpan={3} style={{ ...cellStyle, minHeight: 22 }}>
        {value.trim() ? value : "\u00a0"}
      </td>
    </tr>
  );
}

function TwoColRow({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <tr>
      <td style={labelCellStyle}>{leftLabel}</td>
      <td style={cellStyle}>{leftValue.trim() ? leftValue : "\u00a0"}</td>
      <td style={labelCellStyle}>{rightLabel}</td>
      <td style={cellStyle}>{rightValue.trim() ? rightValue : "\u00a0"}</td>
    </tr>
  );
}

function ChoiceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr>
      <td style={{ ...labelCellStyle, verticalAlign: "middle" }}>{label}</td>
      <td colSpan={3} style={{ ...cellStyle, verticalAlign: "middle", padding: "8px 10px" }}>
        {children}
      </td>
    </tr>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <div style={headerBarStyle}>{children}</div>;
}

function CheckOption({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
      <span aria-hidden style={{ fontSize: 13, lineHeight: 1 }}>
        {checked ? "☑" : "☐"}
      </span>
      <span>{label}</span>
    </span>
  );
}

function OtherBlank({ checked, text }: { checked: boolean; text: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <CheckOption checked={checked} label="Other" />
      <span
        style={{
          display: "inline-block",
          minWidth: 88,
          borderBottom: `1px solid ${NAVY}`,
          lineHeight: "14px",
          fontSize: 10.5,
          padding: "0 2px",
          color: "#111827",
        }}
      >
        {text.trim() || "\u00a0"}
      </span>
    </span>
  );
}

function ChoiceGroup({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 18px",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

function PhaseChecks({ phase }: { phase: string }) {
  const value = phase.trim().toUpperCase();
  return (
    <ChoiceGroup>
      <CheckOption checked={value === "1PH" || value === "1"} label="1PH" />
      <CheckOption checked={value === "3PH" || value === "3"} label="3PH" />
    </ChoiceGroup>
  );
}

function PanelMakeChecks({ make, other }: { make: string; other: string }) {
  const value = make.trim();
  const isAdani = /^adani$/i.test(value);
  const isWaaree = /^waaree$|^waree$/i.test(value);
  const isIna = /^ina$/i.test(value);
  const isOther = /^other$/i.test(value);
  return (
    <ChoiceGroup>
      <CheckOption checked={isAdani} label="Adani" />
      <CheckOption checked={isWaaree} label="Waaree" />
      <CheckOption checked={isIna} label="INA" />
      <OtherBlank checked={isOther} text={other} />
    </ChoiceGroup>
  );
}

function InverterMakeChecks({ make, other }: { make: string; other: string }) {
  const value = make.trim();
  const isPolycab = /^polycab$/i.test(value);
  const isLuminous = /^luminous$/i.test(value);
  const isOther = /^other$/i.test(value);
  return (
    <ChoiceGroup>
      <CheckOption checked={isPolycab} label="Polycab" />
      <CheckOption checked={isLuminous} label="Luminous" />
      <OtherBlank checked={isOther} text={other} />
    </ChoiceGroup>
  );
}

function StructureBrandChecks({ brand }: { brand: string }) {
  const value = brand.trim();
  return (
    <ChoiceGroup>
      <CheckOption checked={/^apollo$/i.test(value)} label="Apollo" />
      <CheckOption checked={/^tata$/i.test(value)} label="Tata" />
    </ChoiceGroup>
  );
}

const structureHeaderCell: CSSProperties = {
  ...cellStyle,
  background: NAVY,
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 9.5,
  textAlign: "center",
  padding: "6px 5px",
};

function StructureTable({ survey }: { survey: SiteSurveyForm }) {
  const rows = [
    { name: "Leg", spec: survey.legSize, measure: survey.legHeight, qty: survey.legQty },
    { name: "Rafter", spec: survey.rafterSize, measure: survey.rafterLength, qty: survey.rafterQty },
    { name: "Purlin", spec: survey.purlinSize, measure: survey.purlinLength, qty: survey.purlinQty },
  ];
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...structureHeaderCell, width: "20%" }}>Member</th>
          <th style={{ ...structureHeaderCell, width: "25%" }}>Spec (size)</th>
          <th style={{ ...structureHeaderCell, width: "35%" }}>Height / Length</th>
          <th style={{ ...structureHeaderCell, width: "20%" }}>Qty</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td style={{ ...cellStyle, fontWeight: 700 }}>{row.name}</td>
            <td style={{ ...cellStyle, textAlign: "center" }}>{row.spec.trim() || "\u00a0"}</td>
            <td style={cellStyle}>{row.measure.trim() || "\u00a0"}</td>
            <td style={{ ...cellStyle, textAlign: "center" }}>{row.qty.trim() || "\u00a0"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CableTable({ survey }: { survey: SiteSurveyForm }) {
  const rows = [
    {
      name: "AC Cable",
      make: survey.acCableMake,
      size: survey.acCableSize,
      length: survey.acCableLengthM,
    },
    {
      name: "DC Cable",
      make: survey.dcCableMake,
      size: survey.dcCableSize,
      length: survey.dcCableLengthM,
    },
  ];
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...structureHeaderCell, width: "18%" }}>Cable</th>
          <th style={{ ...structureHeaderCell, width: "28%" }}>Make</th>
          <th style={{ ...structureHeaderCell, width: "28%" }}>Size</th>
          <th style={{ ...structureHeaderCell, width: "26%" }}>Length (approx. m)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td style={{ ...cellStyle, fontWeight: 700 }}>{row.name}</td>
            <td style={{ ...cellStyle, textAlign: "center" }}>{row.make.trim() || "\u00a0"}</td>
            <td style={{ ...cellStyle, textAlign: "center" }}>{row.size.trim() || "\u00a0"}</td>
            <td style={{ ...cellStyle, textAlign: "center" }}>{row.length.trim() || "\u00a0"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TitleBlock() {
  return (
    <div style={{ textAlign: "center", margin: "2px 0 10px" }}>
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.4, color: NAVY, textTransform: "uppercase" }}>
        Site Survey Confirmation
      </div>
      <div style={{ fontSize: 9.5, marginTop: 4, fontStyle: "italic", color: "#4b5563" }}>
        Pre-installation measurement &amp; layout lock-in — for site engineer visit after quotation approval
      </div>
    </div>
  );
}

function DualSign({ survey }: { survey: SiteSurveyForm }) {
  return (
    <div
      style={{
        marginTop: 18,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 28,
        fontSize: 10.5,
      }}
    >
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Site Engineer</div>
        <div style={{ height: 36, borderBottom: `1px solid ${NAVY}`, marginBottom: 6 }} />
        <div>Name: {survey.engineerName || "_______________________"}</div>
        <div style={{ marginTop: 2 }}>Mobile: {survey.engineerMobile || "_______________________"}</div>
        <div style={{ marginTop: 2 }}>Date: {formatDate(survey.surveyDate || survey.date)}</div>
      </div>
      <div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Client acknowledgment</div>
        <div style={{ height: 36, borderBottom: `1px solid ${NAVY}`, marginBottom: 6 }} />
        <div>Name: {survey.clientSignName || survey.customerName || "_______________________"}</div>
        <div style={{ marginTop: 2 }}>Place: {survey.place || "Jaipur"}</div>
        <div style={{ marginTop: 2 }}>Date: {formatDate(survey.date)}</div>
      </div>
    </div>
  );
}

function CompanyHeader({ data }: { data: CompanyProfileData }) {
  const logoSize = getLetterheadLogoSize(data.logoUrl);
  const contactLine = [data.phone, data.altPhone, data.email, data.website].filter((part) => part.trim()).join(" | ");
  return (
    <div style={{ background: "#ffffff", textAlign: "center", borderBottom: "2px solid #e5e7eb", padding: "22px 0 14px" }}>
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
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#111827" }}>
        {filledValue(data.legalName)}
      </div>
      <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: 600, color: "#1f4e79", letterSpacing: 0.2 }}>
        {getLetterheadVendorLine(data.firm)}
      </div>
      {data.address.trim() ? <div style={{ fontSize: 10, marginTop: 8 }}>{data.address}</div> : null}
      {contactLine ? <div style={{ fontSize: 10, marginTop: 4 }}>{contactLine}</div> : null}
      {data.gst.trim() ? <div style={{ fontSize: 9.5, marginTop: 4 }}>GST: {data.gst}</div> : null}
    </div>
  );
}

function SurveyPage({
  children,
  showCompanyHeader,
  data,
  pageIndex,
  pageCount,
}: {
  children: ReactNode;
  showCompanyHeader: boolean;
  data: CompanyProfileData;
  pageIndex: number;
  pageCount: number;
}) {
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
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {showCompanyHeader ? <CompanyHeader data={data} /> : null}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: showCompanyHeader
            ? `10px ${PAGE_SIDE_PADDING}px ${PAGE_TOP_BOTTOM_PADDING}px`
            : `${PAGE_TOP_BOTTOM_PADDING}px ${PAGE_SIDE_PADDING}px`,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <div style={{ position: "absolute", right: PAGE_SIDE_PADDING, bottom: 14, fontSize: 10, color: "#6b7280" }}>
        Page {pageIndex + 1} of {pageCount}
      </div>
    </div>
  );
}

export function CompanyProfileSiteSurveyPreview({ data }: { data: CompanyProfileData }) {
  const s = data.siteSurvey;
  const pageCount = 2;

  return (
    <div id="company-profile-preview" style={{ width: PAGE_WIDTH, display: "grid", gap: 28, overflow: "visible" }}>
      <SurveyPage showCompanyHeader data={data} pageIndex={0} pageCount={pageCount}>
        <TitleBlock />

        <SectionTitle>Customer &amp; quotation</SectionTitle>
        <table style={tableStyle}>
          <ColGroup />
          <tbody>
            <TwoColRow
              leftLabel="Customer name"
              leftValue={s.customerName}
              rightLabel="Contact number"
              rightValue={s.customerPhone}
            />
            <FormRow label="Site address" value={s.siteAddress} />
            <TwoColRow
              leftLabel="Capacity"
              leftValue={s.capacity}
              rightLabel="Survey date"
              rightValue={s.surveyDate ? formatDate(s.surveyDate) : ""}
            />
            <ChoiceRow label="Phase">
              <PhaseChecks phase={s.phase} />
            </ChoiceRow>
            <TwoColRow
              leftLabel="Site engineer"
              leftValue={s.engineerName}
              rightLabel="Engineer mobile"
              rightValue={s.engineerMobile}
            />
          </tbody>
        </table>

        <SectionTitle>Confirmed materials (as per approved quotation)</SectionTitle>
        <table style={tableStyle}>
          <ColGroup />
          <tbody>
            <ChoiceRow label="Solar panel make">
              <PanelMakeChecks make={s.panelMake} other={s.panelMakeOther} />
            </ChoiceRow>
            <TwoColRow leftLabel="Panel Wp" leftValue={s.panelWp} rightLabel="Panel quantity" rightValue={s.panelQty} />
            <ChoiceRow label="Inverter make">
              <InverterMakeChecks make={s.inverterMake} other={s.inverterMakeOther} />
            </ChoiceRow>
            <FormRow label="Inverter size" value={s.inverterSize} />
          </tbody>
        </table>

        <SectionTitle>Structure measurement</SectionTitle>
        <table style={{ ...tableStyle, marginBottom: 0 }}>
          <ColGroup />
          <tbody>
            <ChoiceRow label="Structure brand">
              <StructureBrandChecks brand={s.structureBrand} />
            </ChoiceRow>
          </tbody>
        </table>
        <StructureTable survey={s} />
        <table style={{ ...tableStyle, marginTop: 0 }}>
          <ColGroup />
          <tbody>
            <FormRow label="Structure notes" value={s.structureNotes} />
          </tbody>
        </table>

        <SectionTitle>Cable schedule (approximate)</SectionTitle>
        <CableTable survey={s} />
      </SurveyPage>

      <SurveyPage showCompanyHeader={false} data={data} pageIndex={1} pageCount={pageCount}>
        <SectionTitle>Equipment placement &amp; cable path</SectionTitle>
        <table style={tableStyle}>
          <ColGroup />
          <tbody>
            <FormRow label="Inverter position" value={s.inverterLocation} />
            <FormRow label="ACDB position" value={s.acDbLocation} />
            <FormRow label="DCDB position" value={s.dcDbLocation} />
            <FormRow label="AC cable / wiring path" value={s.acCablePath} />
            <FormRow label="Earthing cable path" value={s.earthingCablePath} />
            <FormRow label="Earthing pits / kit" value={s.earthingPits} />
          </tbody>
        </table>

        <SectionTitle>Site notes</SectionTitle>
        <table style={tableStyle}>
          <ColGroup />
          <tbody>
            <TwoColRow leftLabel="Roof type" leftValue={s.roofType} rightLabel="Shadow notes" rightValue={s.shadowNotes} />
            <FormRow label="Other notes / sketch reference" value={s.otherNotes} />
            <TwoColRow
              leftLabel="Quotation signed on site"
              leftValue={s.quotationSignedOnSite}
              rightLabel="Client agrees layout"
              rightValue={s.clientAgreesLayout}
            />
          </tbody>
        </table>

        <SectionTitle>Terms &amp; conditions</SectionTitle>
        <ol style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 10, lineHeight: 1.45, color: "#1f2937" }}>
          {SITE_SURVEY_TERMS.map((term) => (
            <li key={term} style={{ marginBottom: 4 }}>
              {term}
            </li>
          ))}
        </ol>

        <DualSign survey={s} />
      </SurveyPage>
    </div>
  );
}
