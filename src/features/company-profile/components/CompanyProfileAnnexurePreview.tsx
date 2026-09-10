import type { CSSProperties } from "react";
import type { AnnexureProjectReference, CompanyProfileData, EmpanelmentAnnexure } from "../types/company-profile";
import { filledValue, formatDate } from "../lib/company-profile-formatters";
import { LetterheadPage, NAVY } from "./MssLetterheadChrome";
import { PAGE_WIDTH } from "../constants/sheet-layout";

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
  width: "38%",
  fontWeight: 600,
  background: "#f4f7fb",
  color: "#1f2937",
};

const headerCellStyle: CSSProperties = {
  ...cellStyle,
  background: NAVY,
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 9.5,
  textAlign: "center",
  padding: "6px 5px",
};

function FormRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={labelCellStyle}>{label}</td>
      <td style={{ ...cellStyle, minHeight: 22 }}>{value || "\u00a0"}</td>
    </tr>
  );
}

function SignatureBlock({ data, annexure }: { data: CompanyProfileData; annexure: EmpanelmentAnnexure }) {
  return (
    <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 10.5 }}>
      <div>
        <div>Place: {annexure.place || "Jaipur"}</div>
        <div style={{ marginTop: 4 }}>Date: {formatDate(annexure.date)}</div>
      </div>
      <div style={{ textAlign: "center", minWidth: 220 }}>
        <div style={{ fontWeight: 700 }}>For {filledValue(data.legalName)}</div>
        <div style={{ marginTop: 36, borderTop: `1px solid ${NAVY}`, paddingTop: 6, fontWeight: 700 }}>
          {annexure.signatoryName || data.contactName}
        </div>
        <div>{annexure.signatoryTitle || data.contactTitle || "Authorised Signatory"}</div>
        <div style={{ marginTop: 2, fontSize: 9.5, color: "#4b5563" }}>(Sign & stamp)</div>
      </div>
    </div>
  );
}

function AnnexureTitle({ title, note }: { title: string; note: string }) {
  return (
    <div style={{ textAlign: "center", margin: "4px 0 12px" }}>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.3, color: NAVY, textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontSize: 9.5, marginTop: 4, fontStyle: "italic", color: "#4b5563" }}>{note}</div>
    </div>
  );
}

function ReferenceTable({ rows }: { rows: AnnexureProjectReference[] }) {
  const displayRows = rows.length >= 2 ? rows : [...rows, { details: "", address: "", contactName: "", mobile: "" }];
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, width: "8%" }}>S. No</th>
          <th style={{ ...headerCellStyle, width: "32%" }}>Brief details of projects executed (Type, capacity, commissioning date)</th>
          <th style={{ ...headerCellStyle, width: "24%" }}>Address of installation / project</th>
          <th style={{ ...headerCellStyle, width: "20%" }}>Name of contact person for reference check</th>
          <th style={{ ...headerCellStyle, width: "16%" }}>Mobile No of contact person</th>
        </tr>
      </thead>
      <tbody>
        {displayRows.map((row, index) => (
          <tr key={`ref-${index}`}>
            <td style={{ ...cellStyle, textAlign: "center", fontWeight: 700 }}>{index + 1}</td>
            <td style={{ ...cellStyle, height: 48 }}>{row.details || "\u00a0"}</td>
            <td style={cellStyle}>{row.address || "\u00a0"}</td>
            <td style={cellStyle}>{row.contactName || "\u00a0"}</td>
            <td style={cellStyle}>{row.mobile || "\u00a0"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function CompanyProfileAnnexurePreview({ data }: { data: CompanyProfileData }) {
  const annexure = data.annexure;

  return (
    <div id="company-profile-preview" style={{ width: PAGE_WIDTH, display: "grid", gap: 28, overflow: "visible" }}>
      <LetterheadPage data={data}>
        <AnnexureTitle
          title="Annexure 1 — Experience Certificate and Reference Details of Projects Executed"
          note="(To be provided on Company letter head along with sign and stamp)"
        />

        <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Experience Details</div>
        <table style={tableStyle}>
          <tbody>
            <FormRow label="Name of the Company" value={data.legalName} />
            <FormRow label="Constitution (Pvt Ltd, Partnership etc)" value={annexure.constitution} />
            <FormRow label="Name of Proprietors / Partners / Directors (Please mention all)" value={annexure.proprietors} />
            <FormRow label="Communication & Address – Office (With Pincode and Landmark)" value={annexure.officeAddress} />
            <FormRow label="Registered Address (With Pincode and Landmark)" value={annexure.registeredAddress} />
            <FormRow label="Contact Person" value={annexure.contactPerson} />
            <FormRow label="Phone No" value={data.phone} />
            <FormRow label="Email Address" value={data.email} />
            <FormRow label="No of years experience in current business" value={annexure.yearsCurrentBusiness} />
            <FormRow
              label="No of years experience in any other business (Please provide segment details also)"
              value={annexure.yearsOtherBusiness}
            />
            <tr>
              <td colSpan={2} style={{ ...labelCellStyle, width: "auto" }}>
                Business Details (Brief)
              </td>
            </tr>
            <FormRow label="Infrastructure" value={annexure.infrastructure} />
            <FormRow label="No of employees working" value={annexure.employeeCount} />
            <FormRow label="Total years at current office address" value={annexure.yearsAtOffice} />
            <FormRow
              label="If working with other NBFCs / Banks — name & years of association"
              value={annexure.nbfcBanks}
            />
            <FormRow label="Attach profile / corporate presentation (If available)" value={annexure.attachProfile} />
          </tbody>
        </table>
      </LetterheadPage>

      <LetterheadPage data={data}>
        <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, margin: "2px 0 8px" }}>
          Details and references of projects executed (2 references to be provided mandatory)
        </div>
        <ReferenceTable rows={annexure.references} />
        <SignatureBlock data={data} annexure={annexure} />

        <div style={{ height: 1, background: "#d1d5db", margin: "22px 0 16px" }} />

        <AnnexureTitle
          title="Annexure 2 — Consent Form for Bureau"
          note="(To be provided on Company letter head along with sign and stamp)"
        />

        <div style={{ fontSize: 11.5, lineHeight: 1.55 }}>
          <div>To,</div>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap", fontWeight: 600 }}>{annexure.consentRecipient}</div>
          <p style={{ margin: "14px 0 0", textAlign: "justify", fontSize: 11, lineHeight: 1.6 }}>{annexure.consentBody}</p>
        </div>
        <SignatureBlock data={data} annexure={annexure} />
      </LetterheadPage>
    </div>
  );
}
