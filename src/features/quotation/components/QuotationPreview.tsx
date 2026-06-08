import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ComponentType, ReactNode } from "react";
import {
  BadgeCheck,
  ClipboardList,
  FileCheck2,
  PencilRuler,
  PlugZap,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import {
  FIRST_PAGE_CAPACITY,
  FOLLOWING_PAGE_CAPACITY,
  PAGE_HEIGHT,
  PAGE_NUMBER_FOOTER_HEIGHT,
  PAGE_SIDE_PADDING,
  PAGE_TOP_BOTTOM_PADDING,
  PAGE_WIDTH,
} from "../constants/sheet-layout";
import type { QuotationData } from "../types/quotation";
import { filledValue, formatDate } from "../lib/quotation-formatters";

interface QuotationPreviewProps {
  data: QuotationData;
}

interface PreviewBlock {
  key: string;
  estimate: number;
  node: ReactNode;
  keepWithNext?: boolean;
}

const MATERIAL_GRID = "24px 1.25fr 78px 84px 1.5fr";
const COMMERCIAL_GRID = "30px 1fr 1.7fr";

const TABLE_BORDER = "1px solid #c2cad6";
const NAVY = "#14306b";
const NAVY2 = "#1f4aa0";

const STEP_ICONS: ComponentType<{ size?: number; color?: string }>[] = [
  ClipboardList,
  PencilRuler,
  FileCheck2,
  Truck,
  Wrench,
  ShieldCheck,
  PlugZap,
  BadgeCheck,
];

const pageBodyStyle: CSSProperties = {
  padding: `${PAGE_TOP_BOTTOM_PADDING}px ${PAGE_SIDE_PADDING}px`,
};

const paragraphStyle: CSSProperties = {
  margin: "0 0 8px",
  lineHeight: 1.6,
  textAlign: "justify",
};

const sectionHeadingStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  margin: "16px 0 10px",
  color: "#ffffff",
  background: `linear-gradient(90deg, ${NAVY}, ${NAVY2})`,
  padding: "7px 12px",
  borderRadius: 4,
};

function estimateTextLines(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil((text || "").trim().length / charsPerLine));
}

function estimateParagraphHeight(text: string, charsPerLine = 80, lineHeight = 19) {
  return text.split("\n").reduce((total, line) => total + estimateTextLines(line, charsPerLine) * lineHeight + 4, 0);
}

function Header({ data }: { data: QuotationData }) {
  return (
    <div style={{ background: "#ffffff", textAlign: "center", borderBottom: "2px solid #e5e7eb", padding: "24px 0 18px" }}>
      {data.company.logoUrl ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <img alt="Company logo" crossOrigin="anonymous" src={data.company.logoUrl} style={{ maxHeight: 64, width: "auto", objectFit: "contain" }} />
        </div>
      ) : null}
      <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>{filledValue(data.company.name)}</div>
      <div style={{ fontSize: 10, marginTop: 8 }}>{filledValue(data.company.address)}</div>
      <div style={{ fontSize: 10, marginTop: 4 }}>
        {[data.company.phone, data.company.email, data.company.website].filter(Boolean).join(" | ") || filledValue("")}
      </div>
      {data.company.gst ? <div style={{ fontSize: 9.5, marginTop: 4 }}>GST: {data.company.gst}</div> : null}
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
  data: QuotationData;
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
      <div style={{ ...pageBodyStyle, flex: 1, minHeight: 0, overflow: "hidden", fontSize: 11 }}>{children}</div>
      {data.showPageNumbers ? (
        <div style={{ position: "absolute", right: PAGE_SIDE_PADDING, bottom: 16, fontSize: 10, color: "#6b7280" }}>
          Page {pageIndex + 1} of {pageCount}
        </div>
      ) : null}
    </div>
  );
}

function SummaryBox({ data }: { data: QuotationData }) {
  const rowStyle: CSSProperties = { display: "grid", gridTemplateColumns: "150px 1fr", fontSize: 11.5, padding: "4px 0" };
  const labelStyle: CSSProperties = { fontWeight: 700, color: "#374151" };
  return (
    <div style={{ border: TABLE_BORDER, borderRadius: 8, padding: "10px 14px", margin: "4px 0 14px", background: "#fafbfc" }}>
      <div style={rowStyle}>
        <span style={labelStyle}>Name of the Customer</span>
        <span>: {filledValue(data.customerName)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Capacity of Power Plant</span>
        <span>: {filledValue(data.capacity)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Address</span>
        <span>: {filledValue(data.address)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Date of Proposal</span>
        <span>: {data.proposalDate ? formatDate(data.proposalDate) : "___________"}</span>
      </div>
    </div>
  );
}

// ---------- Tables ----------

function tableCell(extra?: CSSProperties): CSSProperties {
  return {
    padding: "5px 7px",
    fontSize: 9.8,
    lineHeight: 1.45,
    borderBottom: TABLE_BORDER,
    borderRight: TABLE_BORDER,
    boxSizing: "border-box",
    ...extra,
  };
}

function headerCell(extra?: CSSProperties): CSSProperties {
  return tableCell({ borderTop: TABLE_BORDER, background: NAVY, color: "#ffffff", fontWeight: 700, ...extra });
}

function MaterialHeader() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: MATERIAL_GRID }}>
      <div style={headerCell({ borderLeft: TABLE_BORDER, textAlign: "center" })}>S.No</div>
      <div style={headerCell()}>Description</div>
      <div style={headerCell({ textAlign: "center" })}>Qty</div>
      <div style={headerCell({ textAlign: "center" })}>Unit</div>
      <div style={headerCell()}>Make / Specification</div>
    </div>
  );
}

function MaterialRow({ index, data }: { index: number; data: QuotationData }) {
  const item = data.materialItems[index];
  return (
    <div style={{ display: "grid", gridTemplateColumns: MATERIAL_GRID }}>
      <div style={tableCell({ borderLeft: TABLE_BORDER, textAlign: "center" })}>{index + 1}</div>
      <div style={tableCell({ fontWeight: 600 })}>{filledValue(item.description)}</div>
      <div style={tableCell({ textAlign: "center" })}>{item.qty || "—"}</div>
      <div style={tableCell({ textAlign: "center" })}>{item.unit || "—"}</div>
      <div style={tableCell()}>{item.make || "—"}</div>
    </div>
  );
}

function CommercialHeader() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: COMMERCIAL_GRID }}>
      <div style={headerCell({ borderLeft: TABLE_BORDER, textAlign: "center" })}>Sr.</div>
      <div style={headerCell()}>Parameter</div>
      <div style={headerCell()}>Offering</div>
    </div>
  );
}

function CommercialRow({ index, data }: { index: number; data: QuotationData }) {
  const row = data.commercialOffer[index];
  return (
    <div style={{ display: "grid", gridTemplateColumns: COMMERCIAL_GRID }}>
      <div style={tableCell({ borderLeft: TABLE_BORDER, textAlign: "center" })}>{index + 1}</div>
      <div style={tableCell({ fontWeight: 600 })}>{filledValue(row.parameter)}</div>
      <div style={tableCell()}>{filledValue(row.offering)}</div>
    </div>
  );
}

function GenerationTable({ data }: { data: QuotationData }) {
  const g = data.generation;
  const cols = [
    { label: "Per Day Generation", value: g.perDay },
    { label: "Per Month Generation", value: g.perMonth },
    { label: "Per Year Generation", value: g.perYear },
    { label: "Saving Per Year", value: g.savingPerYear },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
      {cols.map((col, index) => (
        <div key={col.label} style={headerCell({ borderLeft: index === 0 ? TABLE_BORDER : undefined, textAlign: "center" })}>
          {col.label}
        </div>
      ))}
      {cols.map((col, index) => (
        <div key={`${col.label}-v`} style={tableCell({ borderLeft: index === 0 ? TABLE_BORDER : undefined, textAlign: "center", fontWeight: 600 })}>
          {filledValue(col.value)}
        </div>
      ))}
    </div>
  );
}

function BankBlock({ data }: { data: QuotationData }) {
  const line = (label: string, value: string) =>
    value ? (
      <div style={{ display: "flex", gap: 6, fontSize: 11, padding: "1.5px 0" }}>
        <span style={{ fontWeight: 700, minWidth: 96 }}>{label}</span>
        <span>: {value}</span>
      </div>
    ) : null;
  return (
    <div style={{ border: TABLE_BORDER, borderRadius: 8, padding: "10px 14px", background: "#fafbfc" }}>
      {line("Name", data.bankAccountName)}
      {line("Bank", data.bankName)}
      {line("A/c No.", data.bankAccountNo)}
      {line("IFSC Code", data.bankIfsc)}
      {line("GST No.", data.bankGst)}
    </div>
  );
}

function RepBlock({ data }: { data: QuotationData }) {
  return (
    <div style={{ marginTop: 30 }}>
      <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Represented by:</p>
      <div style={{ height: 44, borderBottom: "1px solid #111827", width: 240, marginBottom: 8 }} />
      <p style={{ margin: "0 0 2px", fontWeight: 700 }}>
        {filledValue(data.repName)}
        {data.repTitle ? ` (${data.repTitle})` : ""}
      </p>
      {data.repCompany ? <p style={{ margin: "0 0 2px", fontSize: 11 }}>{data.repCompany}</p> : null}
      {data.repMobiles ? <p style={{ margin: 0, fontSize: 11 }}>Mob. No. {data.repMobiles}</p> : null}
    </div>
  );
}

function CoverBand({ data }: { data: QuotationData }) {
  const tagline = data.tagline.trim();
  return (
    <div style={{ margin: "2px 0 14px" }}>
      {data.coverImageUrl ? (
        <img
          alt="Cover"
          crossOrigin="anonymous"
          src={data.coverImageUrl}
          style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "8px 8px 0 0", display: "block" }}
        />
      ) : null}
      {tagline ? (
        <div
          style={{
            background: `linear-gradient(90deg, ${NAVY}, ${NAVY2})`,
            color: "#ffffff",
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: 1.5,
            fontSize: 11,
            padding: "8px 10px",
            borderRadius: data.coverImageUrl ? "0 0 8px 8px" : 6,
          }}
        >
          {tagline}
        </div>
      ) : null}
    </div>
  );
}

function WarrantyBadges({ data }: { data: QuotationData }) {
  const badge = (years: string, label: string) => (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${NAVY}, ${NAVY2})`,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 8px",
        }}
      >
        <span style={{ fontSize: 10, opacity: 0.9 }}>Up to</span>
        <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{years || "—"}</span>
        <span style={{ fontSize: 11, fontWeight: 600 }}>Years</span>
      </div>
      <div style={{ background: NAVY, color: "#ffffff", fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, padding: "4px 10px", borderRadius: 4, display: "inline-block" }}>
        {label}
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 60, margin: "10px 0 4px" }}>
      {badge(data.warrantyProductYears, "PRODUCT WARRANTY")}
      {badge(data.warrantyPerformanceYears, "PERFORMANCE WARRANTY")}
    </div>
  );
}

function InstallationProcess({ data }: { data: QuotationData }) {
  const steps = data.installationSteps.filter((step) => step.trim());
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px 8px", marginTop: 4 }}>
      {steps.map((step, index) => {
        const Icon = STEP_ICONS[index % STEP_ICONS.length];
        return (
          <div key={`${step}-${index}`} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${NAVY}, ${NAVY2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 6px",
              }}
            >
              <Icon size={22} color="#ffffff" />
            </div>
            <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 600 }}>Step {String(index + 1).padStart(2, "0")}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{step}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Block helpers ----------

function pushHeading(blocks: PreviewBlock[], key: string, text: string) {
  blocks.push({ key, estimate: 28, keepWithNext: true, node: <h3 style={sectionHeadingStyle}>{text}</h3> });
}

function pushBulletList(blocks: PreviewBlock[], keyBase: string, items: string[], ordered: boolean) {
  items.forEach((item, index) => {
    if (!item.trim()) return;
    blocks.push({
      key: `${keyBase}-${index}`,
      estimate: 10 + estimateParagraphHeight(item, 95),
      node: (
        <div style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 6, marginBottom: 5, fontSize: 11, lineHeight: 1.55 }}>
          <span style={{ fontWeight: 600, textAlign: ordered ? "right" : "center" }}>{ordered ? `${index + 1}.` : "•"}</span>
          <span style={{ textAlign: "justify" }}>{item}</span>
        </div>
      ),
    });
  });
}

function createBlocks(data: QuotationData): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];

  blocks.push({
    key: "title",
    estimate: 44,
    keepWithNext: true,
    node: (
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, textDecoration: "underline", textUnderlineOffset: 4 }}>
          {filledValue(data.title)}
        </div>
      </div>
    ),
  });

  if (data.coverImageUrl || data.tagline.trim()) {
    blocks.push({
      key: "cover-band",
      estimate: data.coverImageUrl ? 210 : 40,
      keepWithNext: true,
      node: <CoverBand data={data} />,
    });
  }

  blocks.push({ key: "summary", estimate: 120, keepWithNext: true, node: <SummaryBox data={data} /> });

  // Material Description
  if (data.materialItems.length > 0) {
    pushHeading(blocks, "material-heading", "Material Description");
    blocks.push({ key: "material-table-header", estimate: 26, keepWithNext: true, node: <MaterialHeader /> });
    data.materialItems.forEach((item, index) => {
      const tall = Math.max(estimateParagraphHeight(item.make, 34, 14), estimateParagraphHeight(item.description, 26, 14));
      blocks.push({ key: `material-${item.id}`, estimate: 16 + tall, node: <MaterialRow data={data} index={index} /> });
    });
  }

  // Installation Work
  if (data.installationWork.some((item) => item.trim())) {
    pushHeading(blocks, "install-heading", "Installation Work");
    pushBulletList(blocks, "install", data.installationWork, false);
  }

  // Assumptions
  if (data.assumptions.some((item) => item.trim())) {
    pushHeading(blocks, "assume-heading", "Assumptions");
    pushBulletList(blocks, "assume", data.assumptions, false);
  }

  // Customer Scope
  if (data.customerScope.some((item) => item.trim())) {
    pushHeading(blocks, "scope-heading", "Customer Scope");
    pushBulletList(blocks, "scope", data.customerScope, false);
  }

  // Commercial Offer
  if (data.commercialOffer.length > 0) {
    pushHeading(blocks, "commercial-heading", "Commercial Offer");
    blocks.push({ key: "commercial-table-header", estimate: 26, keepWithNext: true, node: <CommercialHeader /> });
    data.commercialOffer.forEach((row, index) => {
      const tall = estimateParagraphHeight(row.offering, 50, 14);
      blocks.push({ key: `commercial-${row.id}`, estimate: 16 + tall, node: <CommercialRow data={data} index={index} /> });
    });
  }

  // Manufacturing Defect Warranty
  if (data.warrantyText.trim()) {
    pushHeading(blocks, "warranty-heading", "Manufacturing Defect Warranty");
    blocks.push({
      key: "warranty-body",
      estimate: 12 + estimateParagraphHeight(data.warrantyText, 90),
      node: <p style={{ ...paragraphStyle, fontSize: 11 }}>{data.warrantyText}</p>,
    });
  }

  // Warranty Coverage badges
  if (data.showWarrantyBadges) {
    pushHeading(blocks, "warranty-badges-heading", "Warranty Coverage");
    blocks.push({ key: "warranty-badges", estimate: 150, node: <WarrantyBadges data={data} /> });
  }

  // Solar Power Generation
  if (data.showGeneration) {
    pushHeading(blocks, "gen-heading", "Solar Power Generation");
    blocks.push({ key: "gen-table", estimate: 52, node: <GenerationTable data={data} /> });
  }

  // Installation Process diagram
  if (data.showInstallationProcess && data.installationSteps.some((step) => step.trim())) {
    pushHeading(blocks, "install-process-heading", "Installation Process");
    const stepCount = data.installationSteps.filter((step) => step.trim()).length;
    blocks.push({
      key: "install-process",
      estimate: 20 + Math.ceil(stepCount / 4) * 84,
      node: <InstallationProcess data={data} />,
    });
  }

  // Subsidy & notes
  const subsidyLines: ReactNode[] = [];
  if (data.subsidyAmount.trim()) {
    subsidyLines.push(
      <p key="subsidy" style={{ ...paragraphStyle, fontSize: 11.5, fontWeight: 700, color: "#152036" }}>
        Subsidy Amount: ₹ {data.subsidyAmount}
      </p>,
    );
  }
  if (data.netMeteringNote.trim()) {
    subsidyLines.push(
      <p key="netmeter" style={{ ...paragraphStyle, fontSize: 11 }}>
        {data.netMeteringNote}
      </p>,
    );
  }
  if (data.loadExtensionNote.trim()) {
    subsidyLines.push(
      <p key="loadext" style={{ ...paragraphStyle, fontSize: 11 }}>
        {data.loadExtensionNote}
      </p>,
    );
  }
  if (subsidyLines.length > 0) {
    blocks.push({ key: "subsidy-block", estimate: 20 + subsidyLines.length * 26, node: <div style={{ marginTop: 8 }}>{subsidyLines}</div> });
  }

  // Terms & Conditions
  if (data.terms.some((term) => term.label.trim() || term.text.trim())) {
    pushHeading(blocks, "terms-heading", "Terms & Conditions");
    data.terms.forEach((term, index) => {
      if (!term.label.trim() && !term.text.trim()) return;
      blocks.push({
        key: `term-${term.id}`,
        estimate: 12 + estimateParagraphHeight(`${term.label} ${term.text}`, 92),
        node: (
          <div style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 6, marginBottom: 6, fontSize: 11, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 600 }}>{index + 1}.</span>
            <span style={{ textAlign: "justify" }}>
              {term.label.trim() ? <strong>{term.label}: </strong> : null}
              {term.text}
            </span>
          </div>
        ),
      });
    });
  }

  // Required Documents for Subsidy
  if (data.subsidyDocuments.some((item) => item.trim())) {
    pushHeading(blocks, "docs-heading", "Required Documents for Subsidy");
    pushBulletList(blocks, "docs", data.subsidyDocuments, true);
  }

  // Bank Details
  if ([data.bankAccountName, data.bankName, data.bankAccountNo, data.bankIfsc, data.bankGst].some((value) => value.trim())) {
    pushHeading(blocks, "bank-heading", "Bank Details");
    blocks.push({ key: "bank-block", estimate: 120, node: <BankBlock data={data} /> });
  }

  // Represented by
  if ([data.repName, data.repCompany, data.repMobiles].some((value) => value.trim())) {
    blocks.push({ key: "rep-block", estimate: 120, node: <RepBlock data={data} /> });
  }

  return blocks;
}

function paginateBlocks(blocks: PreviewBlock[], heights: Record<string, number>, firstCapacity: number, nextCapacity: number) {
  const heightOf = (block: PreviewBlock) => heights[block.key] ?? block.estimate;

  const pages: PreviewBlock[][] = [];
  let currentPage: PreviewBlock[] = [];
  let remaining = firstCapacity;

  for (const block of blocks) {
    const blockHeight = heightOf(block);

    if (currentPage.length > 0 && blockHeight > remaining) {
      const carryOver: PreviewBlock[] = [];
      while (currentPage.length > 0 && currentPage[currentPage.length - 1].keepWithNext) {
        carryOver.unshift(currentPage.pop() as PreviewBlock);
      }
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }
      currentPage = carryOver;
      remaining = nextCapacity - carryOver.reduce((sum, item) => sum + heightOf(item), 0);
    }

    currentPage.push(block);
    remaining -= blockHeight;
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

export function QuotationPreview({ data }: QuotationPreviewProps) {
  const allBlocks = useMemo(() => createBlocks(data), [data]);
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [blockHeights, setBlockHeights] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const nextHeights = Object.fromEntries(
      allBlocks.map((block) => [block.key, Math.ceil(measureRefs.current[block.key]?.offsetHeight ?? block.estimate)]),
    );
    const changed = allBlocks.some((block) => nextHeights[block.key] !== blockHeights[block.key]);
    if (changed) {
      setBlockHeights(nextHeights);
    }
  }, [allBlocks, blockHeights]);

  const footerReserve = data.showPageNumbers ? PAGE_NUMBER_FOOTER_HEIGHT : 0;
  const firstCapacity = (data.showLetterhead ? FIRST_PAGE_CAPACITY : FOLLOWING_PAGE_CAPACITY) - footerReserve;
  const followingCapacity = FOLLOWING_PAGE_CAPACITY - footerReserve;
  const pages = paginateBlocks(allBlocks, blockHeights, firstCapacity, followingCapacity);

  return (
    <>
      <div
        aria-hidden="true"
        className="quotation-measure-layer no-print"
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          width: PAGE_WIDTH - PAGE_SIDE_PADDING * 2,
          visibility: "hidden",
          pointerEvents: "none",
          fontSize: 11,
        }}
      >
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

      <div id="quotation-preview" style={{ width: PAGE_WIDTH, display: "grid", gap: 28, overflow: "visible" }}>
        {pages.map((pageBlocks, pageIndex) => (
          <Page data={data} key={`quotation-page-${pageIndex + 1}`} pageIndex={pageIndex} pageCount={pages.length}>
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
