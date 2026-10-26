import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CompanyLogo, LETTERHEAD_LOGO_WRAP } from "@/components/CompanyLogo";
import {
  FOLLOWING_PAGE_CAPACITY,
  HEADER_HEIGHT,
  PAGE_HEIGHT,
  PAGE_NUMBER_FOOTER_HEIGHT,
  PAGE_SIDE_PADDING,
  PAGE_TOP_BOTTOM_PADDING,
  PAGE_WIDTH,
} from "../constants/sheet-layout";
import type {
  AgreementClientRow,
  AgreementData,
  AgreementLanguage,
  AgreementLedgerBook,
  AgreementRateCard,
  AgreementSection,
  AgreementSettlementLine,
} from "../types/agreement";
import { fillTemplate, filledValue, formatAnnexureAmount, formatRate } from "../lib/agreement-formatters";
import { getPartnershipVendorChargeContent } from "../lib/agreement-defaults";

const LABELS: Record<AgreementLanguage, {
  whereas: string;
  governingLaw: string;
  witnesses: string;
  pageOf: (current: number, total: number) => string;
  rateHeaders: { capacity: string; phase: string; price: string };
  clientHeaders: {
    sno: string;
    name: string;
    dealWithUs: string;
    expected: string;
    received: string;
    pending: string;
    workStatus: string;
    loan: string;
    cash: string;
    cashToMss: string;
    total: string;
    toReturn: string;
    net: string;
    totals: string;
  };
  ledgerHeaders: {
    date: string;
    particular: string;
    dr: string;
    cr: string;
    closing: string;
    remark: string;
    totalDr: string;
    totalCr: string;
    closingBalance: string;
  };
}> = {
  en: {
    whereas: "WHEREAS:",
    governingLaw: "Governing Law & Dispute Resolution",
    witnesses: "Witnesses:",
    pageOf: (current, total) => `Page ${current} of ${total}`,
    rateHeaders: { capacity: "Capacity", phase: "Phase", price: "MSS Rate (₹)" },
    clientHeaders: {
      sno: "S.No",
      name: "Client",
      dealWithUs: "Deal with us",
      expected: "To receive (file)",
      received: "Received so far",
      pending: "Pending",
      workStatus: "Work status",
      loan: "Loan",
      cash: "Cash",
      cashToMss: "Cash to MSS",
      total: "Total",
      toReturn: "To return",
      net: "Net",
      totals: "Totals",
    },
    ledgerHeaders: {
      date: "Date",
      particular: "Particular",
      dr: "DR",
      cr: "CR",
      closing: "Closing",
      remark: "Remark",
      totalDr: "Total DR",
      totalCr: "Total CR",
      closingBalance: "Closing balance",
    },
  },
  hi: {
    whereas: "जबकि:",
    governingLaw: "शासी विधि एवं विवाद समाधान",
    witnesses: "साक्षी:",
    pageOf: (current, total) => `पृष्ठ ${current} / ${total}`,
    rateHeaders: { capacity: "क्षमता", phase: "फेज़", price: "MSS दर (₹)" },
    clientHeaders: {
      sno: "क्र.",
      name: "ग्राहक",
      dealWithUs: "हमसे डील",
      expected: "प्राप्त होना (फ़ाइल)",
      received: "अब तक प्राप्त",
      pending: "बकाया",
      workStatus: "कार्य स्थिति",
      loan: "लोन",
      cash: "नकद",
      cashToMss: "MSS को नकद",
      total: "कुल",
      toReturn: "वापसी योग्य",
      net: "नेट",
      totals: "कुल योग",
    },
    ledgerHeaders: {
      date: "दिनांक",
      particular: "विवरण",
      dr: "DR",
      cr: "CR",
      closing: "शेष",
      remark: "टिप्पणी",
      totalDr: "कुल DR",
      totalCr: "कुल CR",
      closingBalance: "अंतिम शेष",
    },
  },
};

/** Rows per client-table chunk so annexure tables paginate instead of clipping into the footer. */
const CLIENT_TABLE_ROWS_PER_CHUNK = 4;

interface AgreementPreviewProps {
  data: AgreementData;
}

interface PreviewBlock {
  key: string;
  estimate: number;
  node: ReactNode;
  keepWithNext?: boolean;
}

/** Small cushion so minor measure/render drift never clips the last line on a page. */
const PAGINATION_BLOCK_BUFFER = 4;
const BODY_CHARS_PER_LINE = 78;
const SUB_POINT_CHARS_PER_LINE = 58;
const BODY_MAX_LINES_PER_CHUNK = 7;
const SUB_POINT_MAX_LINES_PER_CHUNK = 5;

const pageBodyStyle: CSSProperties = {
  padding: `${PAGE_TOP_BOTTOM_PADDING}px ${PAGE_SIDE_PADDING}px`,
};

const sectionHeadingStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  margin: "16px 0 10px",
  color: "#152036",
};

const paragraphStyle: CSSProperties = {
  margin: "0 0 12px",
  lineHeight: 1.7,
  textAlign: "left",
};

const vendorChargeHighlightStyle: CSSProperties = {
  fontWeight: 700,
};

function highlightVendorChargePhrase(text: string, language: AgreementLanguage): ReactNode {
  const pattern =
    language === "hi" ? /(₹\s[\d.]+\s+प्रति वाट)/ : /(₹\s[\d.]+\s+per watt)/i;
  const match = text.match(pattern);
  if (!match || match.index === undefined) {
    return text;
  }

  const phrase = match[1];
  const start = match.index;
  return (
    <>
      {text.slice(0, start)}
      <span style={vendorChargeHighlightStyle}>{phrase}</span>
      {text.slice(start + phrase.length)}
    </>
  );
}

function estimateTextLines(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil((text || "").trim().length / charsPerLine));
}

function estimateParagraphHeight(text: string, charsPerLine = BODY_CHARS_PER_LINE) {
  return text.split("\n").reduce((total, line) => total + estimateTextLines(line, charsPerLine) * 22 + 4, 0);
}

function mergeSegmentsIntoChunks(segments: string[], maxChars: number): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const segment of segments) {
    const piece = segment.trim();
    if (!piece) {
      continue;
    }

    // Keep an overlong segment intact so phrases like "Authorised Firm" are never cut mid-way.
    if (piece.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      chunks.push(piece);
      continue;
    }

    const candidate = current ? `${current} ${piece}` : piece;
    if (candidate.length > maxChars && current) {
      chunks.push(current);
      current = piece;
    } else {
      current = candidate;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length ? chunks : [""];
}

/** Break long legal paragraphs at sentence / clause boundaries only — never mid-phrase. */
function splitParagraphForPagination(text: string, charsPerLine: number, maxLines: number): string[] {
  const trimmed = text.trim();
  if (!trimmed) {
    return [""];
  }

  const maxChars = charsPerLine * maxLines;
  if (trimmed.length <= maxChars) {
    return [trimmed];
  }

  const semicolonParts = trimmed.split(/(?<=;)\s+/);
  if (semicolonParts.length > 1) {
    return mergeSegmentsIntoChunks(semicolonParts, maxChars);
  }

  const sentenceParts = trimmed.split(/(?<=[.!?])\s+/);
  if (sentenceParts.length > 1) {
    return mergeSegmentsIntoChunks(sentenceParts, maxChars);
  }

  // Single long sentence: keep whole so continuous wording is not visually broken.
  return [trimmed];
}

function Header({ data }: { data: AgreementData }) {
  return (
    <div
      style={{
        background: "#ffffff",
        textAlign: "center",
        borderBottom: "2px solid #e5e7eb",
        padding: "24px 0 18px",
        overflow: "visible",
      }}
    >
      {data.company.logoUrl ? (
        <div style={LETTERHEAD_LOGO_WRAP}>
          <CompanyLogo alt="Company logo" src={data.company.logoUrl} />
        </div>
      ) : null}
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
        {filledValue(data.company.name)}
      </div>
      <div style={{ fontSize: 10, marginTop: 8 }}>{filledValue(data.company.address)}</div>
      <div style={{ fontSize: 10, marginTop: 4 }}>
        {[data.company.phone, data.company.email, data.company.website].filter(Boolean).join(" | ") || filledValue("")}
      </div>
      {data.company.cin || data.company.gst ? (
        <div style={{ fontSize: 9.5, marginTop: 4 }}>
          {[data.company.cin ? `CIN: ${data.company.cin}` : "", data.company.gst ? `GST: ${data.company.gst}` : ""]
            .filter(Boolean)
            .join(" | ")}
        </div>
      ) : null}
    </div>
  );
}

function Page({
  children,
  data,
  pageIndex,
  pageCount,
}: {
  children: ReactNode;
  data: AgreementData;
  pageIndex: number;
  pageCount: number;
}) {
  const showHeader = pageIndex === 0 && data.showLetterhead;

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
      {showHeader ? <Header data={data} /> : null}
      <div
        style={{
          ...pageBodyStyle,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          paddingBottom: data.showPageNumbers
            ? PAGE_TOP_BOTTOM_PADDING + PAGE_NUMBER_FOOTER_HEIGHT
            : PAGE_TOP_BOTTOM_PADDING,
        }}
      >
        {children}
      </div>
      {data.showPageNumbers ? (
        <div
          style={{
            position: "absolute",
            right: PAGE_SIDE_PADDING,
            bottom: 16,
            fontSize: 10,
            color: "#6b7280",
          }}
        >
          {LABELS[data.language].pageOf(pageIndex + 1, pageCount)}
        </div>
      ) : null}
    </div>
  );
}

function renderInlineBold(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={`${keyPrefix}-b-${index}`} style={{ fontWeight: 700 }}>
          {bold[1]}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-t-${index}`}>{part}</span>;
  });
}

function renderMultiline(text: string, baseKey: string) {
  return text.split(/\n\n+/).map((paragraph, index) => (
    <p key={`${baseKey}-p-${index}`} style={paragraphStyle}>
      {paragraph.split("\n").map((line, lineIndex, all) => (
        <span key={`${baseKey}-line-${lineIndex}`}>
          {renderInlineBold(line, `${baseKey}-line-${lineIndex}`)}
          {lineIndex < all.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  ));
}

function createBlocks(data: AgreementData): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];

  blocks.push({
    key: "title",
    estimate: 56,
    keepWithNext: true,
    node: (
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2.5,
            textDecoration: "underline",
            textUnderlineOffset: 4,
          }}
        >
          {filledValue(data.title)}
        </div>
      </div>
    ),
  });

  const introText = fillTemplate(data.introTemplate, data);
  if (introText.trim()) {
    blocks.push({
      key: "intro",
      estimate: 28 + estimateParagraphHeight(introText, 78),
      node: <div>{renderMultiline(introText, "intro")}</div>,
    });
  }

  if (data.recitals.length > 0) {
    blocks.push({
      key: "whereas-heading",
      estimate: 28,
      keepWithNext: true,
      node: <p style={{ ...paragraphStyle, fontWeight: 700, margin: "12px 0 8px" }}>{LABELS[data.language].whereas}</p>,
    });

    data.recitals.forEach((recital, index) => {
      const filled = fillTemplate(recital, data);
      blocks.push({
        key: `whereas-${index}`,
        estimate: 16 + estimateParagraphHeight(filled, 70),
        node: (
          <ul style={{ margin: "0 0 8px", paddingLeft: 22, lineHeight: 1.7 }}>
            <li style={{ marginBottom: 4, textAlign: "left" }}>{filled}</li>
          </ul>
        ),
      });
    });
  }

  if (data.preambleAfterRecitals.trim()) {
    const filled = fillTemplate(data.preambleAfterRecitals, data);
    blocks.push({
      key: "preamble",
      estimate: 20 + estimateParagraphHeight(filled, 78),
      node: <p style={{ ...paragraphStyle, marginTop: 14 }}>{filled}</p>,
    });
  }

  data.sections.forEach((section, sectionIndex) => {
    appendSectionBlocks(blocks, section, sectionIndex, data);
    if (data.template === "partnership" && data.showVendorChargePerWatt && sectionIndex === 1) {
      appendVendorChargeBlocks(blocks, data);
    }
  });

  if (data.template === "fixed-rate") {
    appendDealBlocks(blocks, data);
  }

  if (data.governingLawParagraph.trim()) {
    const filled = fillTemplate(data.governingLawParagraph, data);
    blocks.push({
      key: "governing-law-heading",
      estimate: 26,
      keepWithNext: true,
      node: <h3 style={sectionHeadingStyle}>{LABELS[data.language].governingLaw}</h3>,
    });
    blocks.push({
      key: "governing-law-body",
      estimate: 18 + estimateParagraphHeight(filled, 78),
      node: <p style={paragraphStyle}>{filled}</p>,
    });
  }

  if (data.closingParagraph.trim()) {
    const filled = fillTemplate(data.closingParagraph, data);
    blocks.push({
      key: "closing",
      estimate: 18 + estimateParagraphHeight(filled, 78),
      node: <p style={{ ...paragraphStyle, marginTop: 18 }}>{filled}</p>,
    });
  }

  blocks.push({
    key: "signature-block",
    estimate: 170,
    keepWithNext: true,
    node: <SignatureBlock data={data} />,
  });

  if (data.showWitnesses) {
    blocks.push({
      key: "witnesses",
      estimate: 90,
      node: <WitnessBlock data={data} />,
    });
  }

  if (data.template === "fixed-rate") {
    appendClientScheduleBlocks(blocks, data);
    appendLedgerAnnexureBlocks(blocks, data);
    appendSettlementSummaryBlocks(blocks, data);
  }

  return blocks;
}

function appendVendorChargeBlocks(blocks: PreviewBlock[], data: AgreementData) {
  const { heading, text } = getPartnershipVendorChargeContent(data);
  const filled = fillTemplate(text, data);

  blocks.push({
    key: "vendor-charge-heading",
    estimate: 30,
    keepWithNext: true,
    node: <h3 style={sectionHeadingStyle}>{heading}</h3>,
  });
  blocks.push({
    key: "vendor-charge-body",
    estimate: 18 + estimateParagraphHeight(filled, 78),
    node: <p style={paragraphStyle}>{highlightVendorChargePhrase(filled, data.language)}</p>,
  });
}

function RateTable({ rateCards, language }: { rateCards: AgreementRateCard[]; language: AgreementLanguage }) {
  const headers = LABELS[language].rateHeaders;
  const cellStyle: CSSProperties = {
    border: "1px solid #c7ced9",
    padding: "7px 10px",
    fontSize: 11.5,
    textAlign: "left",
  };
  const headerCellStyle: CSSProperties = {
    ...cellStyle,
    background: "#152036",
    color: "#ffffff",
    fontWeight: 700,
    letterSpacing: 0.4,
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        margin: "4px 0 12px",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, width: "40%" }}>{headers.capacity}</th>
          <th style={{ ...headerCellStyle, width: "30%" }}>{headers.phase}</th>
          <th style={{ ...headerCellStyle, width: "30%", textAlign: "right" }}>{headers.price}</th>
        </tr>
      </thead>
      <tbody>
        {rateCards.map((card) => (
          <tr key={card.id}>
            <td style={cellStyle}>{card.capacity || "—"}</td>
            <td style={cellStyle}>{card.phase || "—"}</td>
            <td style={{ ...cellStyle, textAlign: "right", fontWeight: 600 }}>{formatRate(card.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MoneyStack({
  lines,
}: {
  lines: { label: string; value: string; strong?: boolean; tone?: "danger" | "success" }[];
}) {
  return (
    <div style={{ display: "grid", gap: 3, lineHeight: 1.35 }}>
      {lines.map((line) => {
        const toneColor =
          line.tone === "danger" ? "#b91c1c" : line.tone === "success" ? "#15803d" : line.strong ? "#152036" : "#4b5563";
        return (
          <div
            key={line.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              fontWeight: line.strong || line.tone ? 700 : 500,
              color: toneColor,
            }}
          >
            <span>{line.label}</span>
            <span style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {formatAnnexureAmount(line.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function parseAnnexureNumber(value: string): number {
  const numeric = Number((value ?? "").trim().replace(/[,\s₹]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function sumAnnexureField(rows: readonly AgreementClientRow[], key: keyof AgreementClientRow): string {
  const total = rows.reduce((sum, row) => sum + parseAnnexureNumber(String(row[key] ?? "")), 0);
  return String(total);
}

/** Register NET DUE TO MSS (falls back to deal − total received). */
function clientRowNet(row: AgreementClientRow): number {
  if (String(row.netDueToMss ?? "").trim() !== "") {
    return parseAnnexureNumber(row.netDueToMss);
  }
  return parseAnnexureNumber(row.dealWithUs) - parseAnnexureNumber(row.totalReceived);
}

function chunkClientRows(rows: AgreementClientRow[], size: number): AgreementClientRow[][] {
  if (rows.length === 0) {
    return [];
  }
  const chunks: AgreementClientRow[][] = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks;
}

function ClientTable({
  rows,
  allRows,
  language,
  startIndex = 0,
  showFooter = true,
}: {
  rows: AgreementClientRow[];
  /** Full annexure list — footer totals always cover every site, not only this page chunk. */
  allRows: AgreementClientRow[];
  language: AgreementLanguage;
  startIndex?: number;
  showFooter?: boolean;
}) {
  const headers = LABELS[language].clientHeaders;
  const cellStyle: CSSProperties = {
    border: "1px solid #c7ced9",
    padding: "5px 6px",
    fontSize: 9.5,
    textAlign: "left",
    verticalAlign: "top",
  };
  const headerCellStyle: CSSProperties = {
    ...cellStyle,
    background: "#152036",
    color: "#ffffff",
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 9,
  };
  const footerCellStyle: CSSProperties = {
    ...cellStyle,
    background: "#f3f4f6",
    fontWeight: 700,
  };

  const totalsSource = showFooter ? allRows : rows;
  const totalsNet = totalsSource.reduce((sum, row) => sum + clientRowNet(row), 0);
  const totals = {
    dealWithUs: sumAnnexureField(totalsSource, "dealWithUs"),
    loanExpected: sumAnnexureField(totalsSource, "loanExpected"),
    cashExpected: sumAnnexureField(totalsSource, "cashExpected"),
    loanReceived: sumAnnexureField(totalsSource, "loanReceived"),
    cashReceived: sumAnnexureField(totalsSource, "cashReceived"),
    totalReceived: sumAnnexureField(totalsSource, "totalReceived"),
    loanPending: sumAnnexureField(totalsSource, "loanPending"),
    cashPending: sumAnnexureField(totalsSource, "cashPending"),
    amountToReturn: sumAnnexureField(totalsSource, "amountToReturn"),
    net: String(totalsNet),
  };

  const receivedSettlementLines = (net: number, toReturn: string) => {
    const lines: { label: string; value: string; strong: true; tone: "danger" | "success" }[] = [];
    const returnAmount = parseAnnexureNumber(toReturn);
    // Over-collected vs deal → To return (red). Still short of deal → Net due (green).
    if (returnAmount > 0) {
      lines.push({ label: headers.toReturn, value: String(returnAmount), strong: true, tone: "danger" });
    } else if (net < 0) {
      lines.push({ label: headers.toReturn, value: String(Math.abs(net)), strong: true, tone: "danger" });
    }
    if (net > 0) {
      lines.push({ label: headers.net, value: String(net), strong: true, tone: "success" });
    }
    return lines;
  };

  const totalsSettlementLines = receivedSettlementLines(totalsNet, totals.amountToReturn);

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        margin: "4px 0 10px",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, width: "4%" }}>{headers.sno}</th>
          <th style={{ ...headerCellStyle, width: "20%" }}>{headers.name}</th>
          <th style={{ ...headerCellStyle, width: "12%", textAlign: "right" }}>{headers.dealWithUs}</th>
          <th style={{ ...headerCellStyle, width: "15%" }}>{headers.expected}</th>
          <th style={{ ...headerCellStyle, width: "20%" }}>{headers.received}</th>
          <th style={{ ...headerCellStyle, width: "15%" }}>{headers.pending}</th>
          <th style={{ ...headerCellStyle, width: "14%" }}>{headers.workStatus}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const metaParts = [row.capacity?.trim(), row.phase?.trim(), row.kNo?.trim() ? `K.NO ${row.kNo.trim()}` : ""]
            .filter(Boolean)
            .join(" · ");
          const net = clientRowNet(row);
          const receivedLines = [
            { label: headers.loan, value: row.loanReceived },
            { label: headers.cashToMss, value: row.cashReceived },
            { label: headers.total, value: row.totalReceived, strong: true },
            ...receivedSettlementLines(net, row.amountToReturn),
          ];
          return (
            <tr key={row.id}>
              <td style={cellStyle}>{startIndex + index + 1}</td>
              <td style={cellStyle}>
                <div style={{ fontWeight: 700, color: "#152036", lineHeight: 1.3 }}>{row.name || "—"}</div>
                {metaParts ? (
                  <div
                    style={{
                      marginTop: 3,
                      fontWeight: 500,
                      fontSize: 8.5,
                      color: "#4b5563",
                      lineHeight: 1.4,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                  >
                    {metaParts}
                  </div>
                ) : null}
                {row.remark?.trim() ? (
                  <div style={{ marginTop: 4, fontWeight: 500, fontSize: 8.5, color: "#4b5563", lineHeight: 1.4 }}>
                    {row.remark.trim()}
                  </div>
                ) : null}
              </td>
              <td style={{ ...cellStyle, textAlign: "right", fontWeight: 700 }}>
                {formatAnnexureAmount(row.dealWithUs)}
              </td>
              <td style={cellStyle}>
                <MoneyStack
                  lines={[
                    { label: headers.loan, value: row.loanExpected },
                    { label: headers.cash, value: row.cashExpected },
                  ]}
                />
              </td>
              <td style={cellStyle}>
                <MoneyStack lines={receivedLines} />
              </td>
              <td style={cellStyle}>
                <MoneyStack
                  lines={[
                    { label: headers.loan, value: row.loanPending },
                    { label: headers.cash, value: row.cashPending },
                  ]}
                />
              </td>
              <td style={{ ...cellStyle, fontSize: 9, lineHeight: 1.35 }}>{row.workStatus || "—"}</td>
            </tr>
          );
        })}
      </tbody>
      {showFooter ? (
        <tfoot>
          <tr>
            <td style={footerCellStyle} colSpan={2}>
              {headers.totals}
            </td>
            <td style={{ ...footerCellStyle, textAlign: "right" }}>{formatAnnexureAmount(totals.dealWithUs)}</td>
            <td style={footerCellStyle}>
              <MoneyStack
                lines={[
                  { label: headers.loan, value: totals.loanExpected },
                  { label: headers.cash, value: totals.cashExpected },
                ]}
              />
            </td>
            <td style={footerCellStyle}>
              <MoneyStack
                lines={[
                  { label: headers.loan, value: totals.loanReceived },
                  { label: headers.cashToMss, value: totals.cashReceived },
                  { label: headers.total, value: totals.totalReceived, strong: true },
                  ...totalsSettlementLines,
                ]}
              />
            </td>
            <td style={footerCellStyle}>
              <MoneyStack
                lines={[
                  { label: headers.loan, value: totals.loanPending },
                  { label: headers.cash, value: totals.cashPending },
                ]}
              />
            </td>
            <td style={footerCellStyle} />
          </tr>
        </tfoot>
      ) : null}
    </table>
  );
}

function appendClientTableChunks(
  blocks: PreviewBlock[],
  keyPrefix: string,
  rows: AgreementClientRow[],
  language: AgreementLanguage,
) {
  const chunks = chunkClientRows(rows, CLIENT_TABLE_ROWS_PER_CHUNK);
  chunks.forEach((chunk, chunkIndex) => {
    const isLast = chunkIndex === chunks.length - 1;
    blocks.push({
      key: `${keyPrefix}-${chunkIndex}`,
      estimate: 42 + chunk.length * 88 + (isLast ? 78 : 0),
      node: (
        <ClientTable
          rows={chunk}
          allRows={rows}
          language={language}
          startIndex={chunkIndex * CLIENT_TABLE_ROWS_PER_CHUNK}
          showFooter={isLast}
        />
      ),
    });
  });
}

function LedgerBookTable({ book, language }: { book: AgreementLedgerBook; language: AgreementLanguage }) {
  const headers = LABELS[language].ledgerHeaders;
  const cellStyle: CSSProperties = {
    border: "1px solid #c7ced9",
    padding: "4px 6px",
    fontSize: 9,
    textAlign: "left",
    verticalAlign: "top",
  };
  const headerCellStyle: CSSProperties = {
    ...cellStyle,
    background: "#152036",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 8.5,
  };
  const numStyle: CSSProperties = { ...cellStyle, textAlign: "right", fontVariantNumeric: "tabular-nums" };

  return (
    <div style={{ margin: "0 0 14px" }}>
      <h4 style={{ margin: "0 0 2px", fontSize: 12, color: "#152036" }}>{book.title}</h4>
      {book.subtitle.trim() ? (
        <p style={{ margin: "0 0 6px", fontSize: 9.5, color: "#4b5563", lineHeight: 1.4 }}>{book.subtitle}</p>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
          marginBottom: 6,
          fontSize: 9.5,
        }}
      >
        <div>
          <span style={{ color: "#6b7280" }}>{headers.totalDr}: </span>
          <strong>{formatAnnexureAmount(book.totalDr)}</strong>
        </div>
        <div>
          <span style={{ color: "#6b7280" }}>{headers.totalCr}: </span>
          <strong>{formatAnnexureAmount(book.totalCr)}</strong>
        </div>
        <div>
          <span style={{ color: "#6b7280" }}>{headers.closingBalance}: </span>
          <strong>{formatAnnexureAmount(book.closingBalance)}</strong>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, width: "14%" }}>{headers.date}</th>
            <th style={{ ...headerCellStyle, width: "28%" }}>{headers.particular}</th>
            <th style={{ ...headerCellStyle, width: "12%", textAlign: "right" }}>{headers.dr}</th>
            <th style={{ ...headerCellStyle, width: "12%", textAlign: "right" }}>{headers.cr}</th>
            <th style={{ ...headerCellStyle, width: "14%", textAlign: "right" }}>{headers.closing}</th>
            <th style={{ ...headerCellStyle, width: "20%" }}>{headers.remark}</th>
          </tr>
        </thead>
        <tbody>
          {book.rows.map((row, index) => (
            <tr key={`${book.id}-${index}-${row.particular}`}>
              <td style={cellStyle}>{row.date || "—"}</td>
              <td style={cellStyle}>{row.particular || "—"}</td>
              <td style={numStyle}>{formatAnnexureAmount(row.dr)}</td>
              <td style={numStyle}>{formatAnnexureAmount(row.cr)}</td>
              <td style={{ ...numStyle, fontWeight: 700 }}>{formatAnnexureAmount(row.closingBalance)}</td>
              <td style={cellStyle}>{row.remark || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function appendDealBlocks(blocks: PreviewBlock[], data: AgreementData) {
  const dealNumber = data.sections.length + 1;
  const heading = fillTemplate(data.dealHeading, data);

  if (heading.trim()) {
    blocks.push({
      key: "deal-heading",
      estimate: 30,
      keepWithNext: true,
      node: (
        <h3 style={sectionHeadingStyle}>
          {dealNumber}. {heading}
        </h3>
      ),
    });
  }

  const introText = fillTemplate(data.dealIntro, data);
  if (introText.trim()) {
    blocks.push({
      key: "deal-intro",
      estimate: 18 + estimateParagraphHeight(introText, 78),
      keepWithNext: data.rateCards.length > 0,
      node: <p style={paragraphStyle}>{introText}</p>,
    });
  }

  if (data.rateCards.length > 0) {
    blocks.push({
      key: "deal-rate-table",
      estimate: 40 + data.rateCards.length * 30,
      node: <RateTable rateCards={data.rateCards} language={data.language} />,
    });

    if (data.rateNote.trim()) {
      const note = fillTemplate(data.rateNote, data);
      blocks.push({
        key: "deal-rate-note",
        estimate: 14 + estimateParagraphHeight(note, 80),
        node: <p style={{ ...paragraphStyle, fontSize: 11, color: "#374151" }}>{note}</p>,
      });
    }
  }
}

function appendClientScheduleBlocks(blocks: PreviewBlock[], data: AgreementData) {
  const hasLogged = data.showClientSchedule && data.clientRows.length > 0;
  const hasOther = data.showClientSchedule && data.otherClientRows.length > 0;
  if (!hasLogged && !hasOther) return;

  if (hasLogged) {
    const heading = fillTemplate(data.clientScheduleHeading, data);
    if (heading.trim()) {
      blocks.push({
        key: "client-schedule-heading",
        estimate: 30,
        keepWithNext: true,
        node: <h3 style={sectionHeadingStyle}>{heading}</h3>,
      });
    }

    const introText = fillTemplate(data.clientScheduleIntro, data);
    if (introText.trim()) {
      blocks.push({
        key: "client-schedule-intro",
        estimate: 18 + estimateParagraphHeight(introText, 78),
        keepWithNext: true,
        node: <p style={paragraphStyle}>{introText}</p>,
      });
    }

    appendClientTableChunks(blocks, "client-schedule-table", data.clientRows, data.language);
  }

  if (hasOther) {
    const heading = fillTemplate(data.otherClientScheduleHeading, data);
    if (heading.trim()) {
      blocks.push({
        key: "other-client-schedule-heading",
        estimate: 30,
        keepWithNext: true,
        node: <h3 style={sectionHeadingStyle}>{heading}</h3>,
      });
    }

    const introText = fillTemplate(data.otherClientScheduleIntro, data);
    if (introText.trim()) {
      blocks.push({
        key: "other-client-schedule-intro",
        estimate: 16 + estimateParagraphHeight(introText, 78),
        keepWithNext: true,
        node: <p style={paragraphStyle}>{introText}</p>,
      });
    }

    appendClientTableChunks(blocks, "other-client-schedule-table", data.otherClientRows, data.language);
  }

  if (data.clientScheduleNote.trim()) {
    const note = fillTemplate(data.clientScheduleNote, data);
    blocks.push({
      key: "client-schedule-note",
      estimate: 14 + estimateParagraphHeight(note, 80),
      node: <p style={{ ...paragraphStyle, fontSize: 11, color: "#374151" }}>{note}</p>,
    });
  }
}

function appendLedgerAnnexureBlocks(blocks: PreviewBlock[], data: AgreementData) {
  if (!data.showLedgerAnnexure || data.ledgerBooks.length === 0) {
    return;
  }

  const heading = fillTemplate(data.ledgerAnnexureHeading, data);
  if (heading.trim()) {
    blocks.push({
      key: "ledger-annexure-heading",
      estimate: 30,
      keepWithNext: true,
      node: <h3 style={sectionHeadingStyle}>{heading}</h3>,
    });
  }

  const introText = fillTemplate(data.ledgerAnnexureIntro, data);
  if (introText.trim()) {
    blocks.push({
      key: "ledger-annexure-intro",
      estimate: 18 + estimateParagraphHeight(introText, 78),
      keepWithNext: true,
      node: <p style={paragraphStyle}>{introText}</p>,
    });
  }

  for (const book of data.ledgerBooks) {
    blocks.push({
      key: `ledger-book-${book.id}`,
      estimate: 70 + book.rows.length * 18,
      node: <LedgerBookTable book={book} language={data.language} />,
    });
  }

  if (data.ledgerAnnexureNote.trim()) {
    const note = fillTemplate(data.ledgerAnnexureNote, data);
    blocks.push({
      key: "ledger-annexure-note",
      estimate: 14 + estimateParagraphHeight(note, 80),
      node: <p style={{ ...paragraphStyle, fontSize: 11, color: "#374151" }}>{note}</p>,
    });
  }
}

function SettlementSummaryBox({
  lines,
  finalLabel,
  finalAmount,
}: {
  lines: AgreementSettlementLine[];
  finalLabel: string;
  finalAmount: string;
}) {
  const rowStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "baseline",
    padding: "6px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 11,
  };

  return (
    <div
      style={{
        margin: "8px 0 12px",
        border: "1px solid #c7ced9",
        borderRadius: 4,
        background: "#f8fafc",
        padding: "10px 12px",
      }}
    >
      {lines.map((line) => (
        <div key={line.id} style={rowStyle}>
          <span style={{ color: "#374151", lineHeight: 1.4 }}>{line.label}</span>
          <strong style={{ fontVariantNumeric: "tabular-nums", color: "#152036", whiteSpace: "nowrap" }}>
            {formatAnnexureAmount(line.amount)}
          </strong>
        </div>
      ))}
      <div
        style={{
          ...rowStyle,
          borderBottom: "none",
          paddingTop: 10,
          marginTop: 2,
          fontSize: 12.5,
          fontWeight: 700,
        }}
      >
        <span style={{ color: "#152036" }}>{finalLabel}</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: "#152036", whiteSpace: "nowrap" }}>
          {formatAnnexureAmount(finalAmount)}
        </span>
      </div>
    </div>
  );
}

function appendSettlementSummaryBlocks(blocks: PreviewBlock[], data: AgreementData) {
  if (!data.showSettlementSummary || data.settlementLines.length === 0 || !data.settlementFinalAmount.trim()) {
    return;
  }

  const heading = fillTemplate(data.settlementSummaryHeading, data);
  if (heading.trim()) {
    blocks.push({
      key: "settlement-summary-heading",
      estimate: 30,
      keepWithNext: true,
      node: <h3 style={sectionHeadingStyle}>{heading}</h3>,
    });
  }

  const introText = fillTemplate(data.settlementSummaryIntro, data);
  if (introText.trim()) {
    blocks.push({
      key: "settlement-summary-intro",
      estimate: 16 + estimateParagraphHeight(introText, 78),
      keepWithNext: true,
      node: <p style={paragraphStyle}>{introText}</p>,
    });
  }

  blocks.push({
    key: "settlement-summary-box",
    estimate: 48 + data.settlementLines.length * 22,
    keepWithNext: Boolean(data.settlementSummaryNote.trim()),
    node: (
      <SettlementSummaryBox
        lines={data.settlementLines}
        finalLabel={fillTemplate(data.settlementFinalLabel, data) || "Final amount"}
        finalAmount={data.settlementFinalAmount}
      />
    ),
  });

  if (data.settlementSummaryNote.trim()) {
    const note = fillTemplate(data.settlementSummaryNote, data);
    blocks.push({
      key: "settlement-summary-note",
      estimate: 14 + estimateParagraphHeight(note, 80),
      node: <p style={{ ...paragraphStyle, fontSize: 11, color: "#374151" }}>{note}</p>,
    });
  }
}

function appendSectionBlocks(
  blocks: PreviewBlock[],
  section: AgreementSection,
  sectionIndex: number,
  data: AgreementData,
) {
  // When a section holds a single clause, the clause number rides on the
  // section heading and is suppressed in the body (avoids "2. … 2. …"). When a
  // section groups several clauses, the heading is unnumbered and each clause
  // keeps its own number.
  const soleClause = section.clauses.length === 1;

  if (section.heading.trim()) {
    const headingNumber = soleClause && section.clauses[0] ? `${section.clauses[0].number}. ` : "";
    blocks.push({
      key: `section-${section.id}-heading`,
      estimate: 30,
      keepWithNext: true,
      node: (
        <h3 style={sectionHeadingStyle}>
          {headingNumber}
          {section.heading}
        </h3>
      ),
    });
  }

  if (section.intro.trim()) {
    const filled = fillTemplate(section.intro, data);
    splitParagraphForPagination(filled, BODY_CHARS_PER_LINE, BODY_MAX_LINES_PER_CHUNK).forEach((para, pIndex) => {
      blocks.push({
        key: `section-${section.id}-intro-${pIndex}`,
        estimate: 18 + estimateParagraphHeight(para, BODY_CHARS_PER_LINE),
        node: <p style={paragraphStyle}>{para}</p>,
      });
    });
  }

  section.clauses.forEach((clause) => {
    const filledContent = fillTemplate(clause.content, data);
    // Split the clause body on blank lines so each paragraph is its own block.
    // This lets a long clause flow across a page boundary instead of jumping to
    // a fresh page whole and leaving a gap. The number/title rides on para 1.
    const contentParas = filledContent.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    const flatParas = (contentParas.length ? contentParas : [""]).flatMap((para) =>
      splitParagraphForPagination(para, BODY_CHARS_PER_LINE, BODY_MAX_LINES_PER_CHUNK),
    );
    flatParas.forEach((para, pIndex) => {
      blocks.push({
        key: `clause-${clause.id}-content-${pIndex}`,
        estimate: 14 + estimateParagraphHeight(para, BODY_CHARS_PER_LINE) + (pIndex === 0 && clause.title ? 18 : 0),
        keepWithNext: false,
        node: (
          <div style={{ marginBottom: 8 }}>
            <p style={{ ...paragraphStyle, marginBottom: 4 }}>
              {pIndex === 0 ? (
                <>
                  {soleClause ? null : <strong>{clause.number}.</strong>}
                  {clause.title ? (
                    <strong>
                      {soleClause ? "" : " "}
                      {clause.title}:{" "}
                    </strong>
                  ) : (
                    !soleClause && " "
                  )}
                </>
              ) : null}
              {para}
            </p>
          </div>
        ),
      });
    });

    clause.subPoints.forEach((sub) => {
      const filledSub = fillTemplate(sub.text, data);
      const subParas = filledSub.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
      const flatParas = (subParas.length ? subParas : [""]).flatMap((para) =>
        splitParagraphForPagination(para, SUB_POINT_CHARS_PER_LINE, SUB_POINT_MAX_LINES_PER_CHUNK),
      );
      flatParas.forEach((para, pIndex) => {
        blocks.push({
          key: `clause-${clause.id}-sub-${sub.id}-${pIndex}`,
          estimate: 12 + estimateParagraphHeight(para, SUB_POINT_CHARS_PER_LINE),
          node: (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 8,
                marginLeft: 28,
                marginBottom: 6,
                lineHeight: 1.7,
              }}
            >
              <span style={{ fontWeight: 600 }}>{pIndex === 0 ? `${sub.label}.` : ""}</span>
              <span style={{ textAlign: "left" }}>{para}</span>
            </div>
          ),
        });
      });
    });
  });
}

function SignatureBlock({ data }: { data: AgreementData }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 36,
        marginTop: 36,
      }}
    >
      <div>
        <div style={{ height: 48, borderBottom: "1px solid #111827", marginBottom: 8 }} />
        <p style={{ margin: "0 0 2px", fontWeight: 700 }}>{filledValue(data.company.representativeName)}</p>
        {data.company.representativeTitle ? (
          <p style={{ margin: "0 0 2px", fontSize: 11 }}>{data.company.representativeTitle}</p>
        ) : null}
        <p style={{ margin: 0, fontSize: 11 }}>{filledValue(data.company.name)}</p>
      </div>
      <div>
        <div style={{ height: 48, borderBottom: "1px solid #111827", marginBottom: 8 }} />
        {data.partyIsIndividual ? (
          <>
            <p style={{ margin: "0 0 2px", fontWeight: 700 }}>{filledValue(data.party.entityName)}</p>
            {data.party.aadhaar?.trim() ? (
              <p style={{ margin: 0, fontSize: 11 }}>Aadhaar No.: {data.party.aadhaar}</p>
            ) : null}
            {data.party.pan?.trim() ? (
              <p style={{ margin: "2px 0 0", fontSize: 11, fontWeight: 700 }}>PAN: {data.party.pan}</p>
            ) : null}
          </>
        ) : (
          <>
            <p style={{ margin: "0 0 2px", fontWeight: 700 }}>{filledValue(data.party.representativeName)}</p>
            {data.party.representativeTitle ? (
              <p style={{ margin: "0 0 2px", fontSize: 11 }}>{data.party.representativeTitle}</p>
            ) : null}
            <p style={{ margin: 0, fontSize: 11 }}>{filledValue(data.party.entityName)}</p>
            {data.party.gst?.trim() ? (
              <p style={{ margin: "2px 0 0", fontSize: 11 }}>GST: {data.party.gst}</p>
            ) : null}
            {data.party.aadhaar?.trim() ? (
              <p style={{ margin: "2px 0 0", fontSize: 11 }}>Aadhaar No.: {data.party.aadhaar}</p>
            ) : null}
            {data.party.pan?.trim() ? (
              <p style={{ margin: "2px 0 0", fontSize: 11, fontWeight: 700 }}>PAN: {data.party.pan}</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function WitnessBlock({ data }: { data: AgreementData }) {
  return (
    <div style={{ marginTop: 28 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 700 }}>{LABELS[data.language].witnesses}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
        {data.witnesses.map((witness, index) => (
          <div key={witness.id}>
            <div style={{ height: 28, borderBottom: "1px solid #111827", marginBottom: 6 }} />
            <p style={{ margin: 0, fontSize: 11 }}>
              {index + 1}. {witness.name || "______________________"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function blockHeight(heights: Record<string, number>, block: PreviewBlock) {
  return (heights[block.key] ?? block.estimate) + PAGINATION_BLOCK_BUFFER;
}

function paginateBlocks(blocks: PreviewBlock[], heights: Record<string, number>, firstCapacity: number, nextCapacity: number) {
  const pages: PreviewBlock[][] = [];
  let currentPage: PreviewBlock[] = [];
  let pageUsed = 0;
  let pageLimit = firstCapacity;

  for (const block of blocks) {
    const height = blockHeight(heights, block);

    if (currentPage.length > 0 && pageUsed + height > pageLimit) {
      const carryOver: PreviewBlock[] = [];
      while (currentPage.length > 0 && currentPage[currentPage.length - 1].keepWithNext) {
        carryOver.unshift(currentPage.pop() as PreviewBlock);
      }

      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      currentPage = carryOver;
      pageUsed = carryOver.reduce((sum, item) => sum + blockHeight(heights, item), 0);
      pageLimit = nextCapacity;
    }

    currentPage.push(block);
    pageUsed += height;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

export function AgreementPreview({ data }: AgreementPreviewProps) {
  const allBlocks = useMemo(() => createBlocks(data), [data]);
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const headerMeasureRef = useRef<HTMLDivElement | null>(null);
  const [blockHeights, setBlockHeights] = useState<Record<string, number>>({});
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(HEADER_HEIGHT);

  useLayoutEffect(() => {
    const nextHeights = Object.fromEntries(
      allBlocks.map((block) => [block.key, Math.ceil(measureRefs.current[block.key]?.offsetHeight ?? block.estimate)]),
    );

    const changed = allBlocks.some((block) => nextHeights[block.key] !== blockHeights[block.key]);
    if (changed) {
      setBlockHeights(nextHeights);
    }
  }, [allBlocks, blockHeights]);

  useLayoutEffect(() => {
    const nextHeaderHeight = data.showLetterhead
      ? Math.ceil(headerMeasureRef.current?.offsetHeight ?? HEADER_HEIGHT)
      : 0;
    if (nextHeaderHeight !== measuredHeaderHeight) {
      setMeasuredHeaderHeight(nextHeaderHeight);
    }
  }, [data.showLetterhead, data.company, measuredHeaderHeight]);

  const footerReserve = data.showPageNumbers ? PAGE_NUMBER_FOOTER_HEIGHT : 0;
  const firstCapacity =
    (data.showLetterhead
      ? PAGE_HEIGHT - measuredHeaderHeight - PAGE_TOP_BOTTOM_PADDING * 2
      : FOLLOWING_PAGE_CAPACITY) - footerReserve;
  const followingCapacity = FOLLOWING_PAGE_CAPACITY - footerReserve;

  const pages = useMemo(
    () => paginateBlocks(allBlocks, blockHeights, firstCapacity, followingCapacity),
    [allBlocks, blockHeights, firstCapacity, followingCapacity],
  );

  return (
    <>
      <div
        aria-hidden="true"
        className="agreement-measure-layer no-print"
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          width: PAGE_WIDTH - PAGE_SIDE_PADDING * 2,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        {data.showLetterhead ? (
          <div ref={headerMeasureRef}>
            <Header data={data} />
          </div>
        ) : null}
        {allBlocks.map((block) => (
          <div
            key={`measure-${block.key}`}
            ref={(node) => {
              measureRefs.current[block.key] = node;
            }}
            style={{ width: "100%", display: "flow-root" }}
          >
            {block.node}
          </div>
        ))}
      </div>

      <div
        id="agreement-preview"
        style={{
          width: PAGE_WIDTH,
          display: "grid",
          gap: 28,
          overflow: "visible",
        }}
      >
        {pages.map((pageBlocks, pageIndex) => (
          <Page
            data={data}
            key={`agreement-page-${pageIndex + 1}`}
            pageIndex={pageIndex}
            pageCount={pages.length}
          >
            {pageBlocks.map((block) => (
              <div key={block.key} style={{ display: "flow-root" }}>
                {block.node}
              </div>
            ))}
          </Page>
        ))}
      </div>
    </>
  );
}
