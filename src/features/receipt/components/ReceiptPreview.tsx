import { CompanyLogo, LETTERHEAD_LOGO_WRAP } from "@/components/CompanyLogo";
import { PAGE_HEIGHT, PAGE_SIDE_PADDING, PAGE_TOP_BOTTOM_PADDING, PAGE_WIDTH } from "@/features/offer-letter/constants/sheet-layout";
import { filledValue, formatDate } from "@/features/offer-letter/lib/offer-letter-formatters";
import { amountInWords, formatReceiptAmount, receiptBalance } from "../lib/receipt-defaults";
import type { ReceiptData } from "../types/receipt";

const NAVY = "#14306b";
const NAVY2 = "#1f4aa0";
const INK = "#111827";
const MUTED = "#4b5563";
const LINE = "1px solid #e5e7eb";

function row(label: string, value: string) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "148px 1fr",
        gap: 10,
        padding: "8px 0",
        borderBottom: LINE,
        fontSize: 12,
      }}
    >
      <span style={{ fontWeight: 700, color: NAVY }}>{label}</span>
      <span style={{ color: INK }}>{value}</span>
    </div>
  );
}

export function ReceiptPreview({ data }: { data: ReceiptData }) {
  const received = formatReceiptAmount(data.amountReceived);
  const words = amountInWords(data.amountReceived);
  const project = formatReceiptAmount(data.projectAmount);
  const balance = receiptBalance(data.projectAmount, data.amountReceived);
  const balanceLabel =
    balance == null ? "" : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.abs(balance));
  const paymentHow = [data.paymentMode, data.paymentReference.trim()].filter(Boolean).join(" · ");

  return (
    <div
      id="receipt-preview"
      data-export-page="true"
      className="preview-a4-page"
      style={{
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        maxHeight: PAGE_HEIGHT,
        boxSizing: "border-box",
        background: "#ffffff",
        color: INK,
        fontFamily: "Lexend, sans-serif",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {data.showLetterhead ? (
        <div style={{ background: "#ffffff", textAlign: "center", borderBottom: "2px solid #e5e7eb", padding: "24px 0 18px" }}>
          {data.company.logoUrl ? (
            <div style={LETTERHEAD_LOGO_WRAP}>
              <CompanyLogo alt="Company logo" src={data.company.logoUrl} />
            </div>
          ) : null}
          <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            {filledValue(data.company.name)}
          </div>
          <div style={{ fontSize: 10.5, marginTop: 4, fontWeight: 600, color: "#1f4e79", letterSpacing: 0.2 }}>
            JVVNL & Government Registered Solar Vendor
          </div>
          <div style={{ fontSize: 10, marginTop: 8 }}>{filledValue(data.company.address)}</div>
          <div style={{ fontSize: 10, marginTop: 4 }}>
            {[data.company.phone, data.company.email, data.company.website].filter(Boolean).join(" | ") || filledValue("")}
          </div>
          {data.company.gst ? <div style={{ fontSize: 9.5, marginTop: 4 }}>GST: {data.company.gst}</div> : null}
        </div>
      ) : null}

      <div style={{ padding: `${PAGE_TOP_BOTTOM_PADDING}px ${PAGE_SIDE_PADDING}px`, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.6, color: NAVY2 }}>PROJECT CONFIRMATION</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginTop: 2 }}>Receipt</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, lineHeight: 1.6 }}>
            {data.receiptNo.trim() ? (
              <div>
                <span style={{ color: MUTED }}>No. </span>
                <strong>{data.receiptNo.trim()}</strong>
              </div>
            ) : null}
            <div>
              <span style={{ color: MUTED }}>Date </span>
              <strong>{formatDate(data.receiptDate)}</strong>
            </div>
          </div>
        </div>

        <div
          style={{
            border: `2px solid ${NAVY}`,
            borderRadius: 12,
            padding: "16px 18px",
            background: "#f4f7fb",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: NAVY, textTransform: "uppercase" }}>
            Amount received
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, marginTop: 4 }}>
            {received ? `₹${received}` : "₹ ___________"}
          </div>
          <div style={{ fontSize: 12, marginTop: 4, color: INK }}>{words || "Amount in words will appear here"}</div>
          <div style={{ fontSize: 12, marginTop: 8, color: MUTED }}>
            {data.receivedAgainst || "Token amount"} · {paymentHow || "___________"} · {formatDate(data.paymentDate)}
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: "#fff", background: NAVY, padding: "6px 10px", borderRadius: 6, marginBottom: 4 }}>
          Client
        </div>
        {row("Name", filledValue(data.customerName))}
        {row("Phone", filledValue(data.customerPhone))}
        {row("Site", filledValue(data.address))}

        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, color: "#fff", background: NAVY, padding: "6px 10px", borderRadius: 6, margin: "16px 0 4px" }}>
          Project
        </div>
        {data.capacity.trim() ? row("Capacity", data.capacity.trim()) : null}
        {data.phase.trim() ? row("Phase", data.phase.trim()) : null}
        {data.panel.trim() ? row("Panels", data.panel.trim()) : null}
        {data.inverter.trim() ? row("Inverter", data.inverter.trim()) : null}
        {data.quotationNo.trim() ? row("Quotation", data.quotationNo) : null}
        {project ? row("Project amount", `₹${project}`) : null}
        {row("Received", received ? `₹${received}` : "___________")}
        {row("How paid", filledValue(paymentHow))}
        {balance != null ? (
          row(balance >= 0 ? "Balance" : "Received over project", `₹${balanceLabel}`)
        ) : null}

        <p style={{ margin: "16px 0 0", fontSize: 11, lineHeight: 1.6, color: "#1f2937" }}>{data.note}</p>

        {data.showSignature ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 36 }}>
            <div>
              <div style={{ height: 36, borderBottom: "1px solid #111827", marginBottom: 8 }} />
              <div style={{ fontWeight: 800, fontSize: 11 }}>Paid by</div>
              <div style={{ fontSize: 11, marginTop: 3 }}>{filledValue(data.customerName)}</div>
            </div>
            <div>
              <div style={{ height: 36, borderBottom: "1px solid #111827", marginBottom: 8 }} />
              <div style={{ fontWeight: 800, fontSize: 11 }}>Received by</div>
              <div style={{ fontSize: 11, marginTop: 3 }}>{filledValue(data.repName)}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>
                {[data.repTitle, data.company.name].filter(Boolean).join(", ")}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
