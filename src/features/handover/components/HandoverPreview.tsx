import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CompanyLogo, LETTERHEAD_LOGO_WRAP } from "@/components/CompanyLogo";
import {
  FIRST_PAGE_CAPACITY,
  FOLLOWING_PAGE_CAPACITY,
  PAGE_HEIGHT,
  PAGE_NUMBER_FOOTER_HEIGHT,
  PAGE_SIDE_PADDING,
  PAGE_TOP_BOTTOM_PADDING,
  PAGE_WIDTH,
} from "@/features/offer-letter/constants/sheet-layout";
import { filledValue, formatDate } from "@/features/offer-letter/lib/offer-letter-formatters";
import type { HandoverData } from "../types/handover";

const NAVY = "#14306b";
const NAVY2 = "#1f4aa0";
const INK = "#111827";
const MUTED = "#4b5563";
const LINE = "1px solid #e5e7eb";

interface HandoverPreviewProps {
  data: HandoverData;
}

interface PreviewBlock {
  key: string;
  estimate: number;
  node: ReactNode;
  keepWithNext?: boolean;
}

const pageBodyStyle: CSSProperties = {
  padding: `${PAGE_TOP_BOTTOM_PADDING}px ${PAGE_SIDE_PADDING}px`,
};

function sectionBar(title: string): CSSProperties {
  return {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#ffffff",
    background: `linear-gradient(90deg, ${NAVY}, ${NAVY2})`,
    padding: "7px 12px",
    borderRadius: 6,
    margin: "0 0 10px",
  };
}

function Header({ data }: { data: HandoverData }) {
  return (
    <div style={{ background: "#ffffff", textAlign: "center", borderBottom: "2px solid #e5e7eb", padding: "22px 28px 16px" }}>
      {data.company.logoUrl ? (
        <div style={LETTERHEAD_LOGO_WRAP}>
          <CompanyLogo alt="Company logo" src={data.company.logoUrl} />
        </div>
      ) : null}
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: INK }}>
        {filledValue(data.company.name)}
      </div>
      <div style={{ fontSize: 10.5, marginTop: 3, fontWeight: 600, color: NAVY2 }}>JVVNL / Govt. registered vendor</div>
      <div style={{ fontSize: 10, marginTop: 6, color: MUTED }}>{filledValue(data.company.address)}</div>
      <div style={{ fontSize: 10, marginTop: 3, color: MUTED }}>
        {[data.company.phone, data.company.email, data.company.website].filter(Boolean).join("  ·  ") || "___________"}
      </div>
      {data.company.gst ? <div style={{ fontSize: 9.5, marginTop: 3, color: MUTED }}>GST: {data.company.gst}</div> : null}
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
  data: HandoverData;
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
        color: INK,
        fontFamily: "Lexend, sans-serif",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {pageIndex === 0 && data.showLetterhead ? <Header data={data} /> : null}
      <div style={{ ...pageBodyStyle, flex: 1, minHeight: 0, overflow: "hidden", fontSize: 11 }}>{children}</div>
      {data.showPageNumbers ? (
        <div style={{ position: "absolute", right: PAGE_SIDE_PADDING, bottom: 16, fontSize: 10, color: "#6b7280" }}>
          Page {pageIndex + 1} of {pageCount}
        </div>
      ) : null}
    </div>
  );
}

function fact(label: string, value: string) {
  return { label, value: filledValue(value) };
}

function FactGrid({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        border: LINE,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 4,
      }}
    >
      {rows.map((row, index) => (
        <div
          key={row.label}
          style={{
            display: "grid",
            gridTemplateColumns: "108px minmax(0, 1fr)",
            gap: 8,
            minWidth: 0,
            padding: "7px 10px",
            background: index % 4 < 2 ? "#f8fafc" : "#ffffff",
            borderBottom: LINE,
            borderRight: index % 2 === 0 ? LINE : undefined,
          }}
        >
          <span style={{ fontSize: 9.5, fontWeight: 700, color: NAVY, letterSpacing: 0.2 }}>{row.label}</span>
          <span style={{ fontSize: 10.5, color: INK, lineHeight: 1.35, overflowWrap: "anywhere" }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function createBlocks(data: HandoverData): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];
  const offgrid = data.kind === "offgrid";

  blocks.push({
    key: "title",
    estimate: 92,
    node: (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.6, color: NAVY2, textTransform: "uppercase" }}>
              Project handover
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: NAVY, letterSpacing: 0.2, marginTop: 2 }}>
              Plant handover document
            </div>
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: NAVY,
              background: "#eef3fb",
              border: `1px solid ${NAVY}`,
              borderRadius: 999,
              padding: "5px 10px",
              whiteSpace: "nowrap",
            }}
          >
            {data.plantTypeLabel || (offgrid ? "Off-grid" : "Grid-connected")}
          </div>
        </div>
      </div>
    ),
  });

  const summaryRows = [
    fact("Handover no.", data.handoverNo),
    fact("Handover date", formatDate(data.handoverDate)),
    fact("Capacity", data.capacity),
    fact("Plant", data.plantTypeLabel),
    ...(offgrid || !data.phase.trim() ? [] : [fact("Connection", data.phase)]),
    fact("Invoice", data.invoiceNo),
    fact("Installed", formatDate(data.installationDate)),
    fact("Commissioned", formatDate(data.commissioningDate)),
  ];

  blocks.push({
    key: "summary",
    estimate: 118,
    node: <FactGrid rows={summaryRows} />,
  });

  blocks.push({
    key: "letter",
    estimate: 150,
    node: (
      <div style={{ margin: "12px 0 4px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{data.greeting.trim() || "Dear Sir / Madam,"}</div>
        {data.note
          .split("\n")
          .filter((line) => line.trim())
          .map((line, index) => (
            <p key={index} style={{ margin: "0 0 8px", lineHeight: 1.6, textAlign: "justify", fontSize: 11 }}>
              {line}
            </p>
          ))}
      </div>
    ),
  });

  const clientRows = [
    fact("Client", data.customerName),
    fact("Phone", data.customerPhone),
    ...(data.customerEmail.trim() ? [fact("Email", data.customerEmail)] : []),
    fact("Site", data.address),
    ...(!offgrid && data.consumerNumber.trim() ? [fact("Consumer no.", data.consumerNumber)] : []),
    ...(!offgrid && data.discom.trim() ? [fact("DISCOM", data.discom)] : []),
  ];

  blocks.push({
    key: "client-heading",
    estimate: 36,
    keepWithNext: true,
    node: <div style={sectionBar("Client and site")}>Client and site</div>,
  });
  blocks.push({
    key: "client",
    estimate: 28 + clientRows.length * 16,
    node: <FactGrid rows={clientRows} />,
  });

  const plantRows = [
    ...(data.moduleSummary.trim() ? [fact("Modules", data.moduleSummary)] : []),
    ...(data.inverterSummary.trim() ? [fact("Inverter", data.inverterSummary)] : []),
    ...(offgrid && data.batterySummary.trim() ? [fact("Batteries", data.batterySummary)] : []),
  ];

  if (plantRows.length > 0 || data.netMeteringNote.trim()) {
    blocks.push({
      key: "plant-heading",
      estimate: 36,
      keepWithNext: true,
      node: <div style={sectionBar("System handed over")}>System handed over</div>,
    });
    if (plantRows.length > 0) {
      blocks.push({
        key: "plant",
        estimate: 28 + plantRows.length * 16,
        node: <FactGrid rows={plantRows} />,
      });
    }
    if (data.netMeteringNote.trim()) {
      blocks.push({
        key: "net-meter",
        estimate: 56,
        node: (
          <p style={{ margin: "8px 0 4px", fontSize: 10.5, lineHeight: 1.55, color: MUTED }}>
            {data.netMeteringNote}
          </p>
        ),
      });
    }
  }

  const equipment = data.equipment.filter((item) => item.description.trim() || item.specification.trim());
  if (equipment.length > 0) {
    blocks.push({
      key: "equip-heading",
      estimate: 36,
      keepWithNext: true,
      node: <div style={sectionBar("Installed equipment")}>Installed equipment</div>,
    });
    blocks.push({
      key: "equip-table",
      estimate: 36 + equipment.length * 36,
      node: (
        <div style={{ border: LINE, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "28px 1.1fr 1.5fr 72px 1fr", background: NAVY, color: "#fff" }}>
            {["#", "Item", "Specification", "Qty", "Remarks"].map((label) => (
              <div key={label} style={{ padding: "6px 8px", fontSize: 9, fontWeight: 700, letterSpacing: 0.3 }}>
                {label}
              </div>
            ))}
          </div>
          {equipment.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1.1fr 1.5fr 72px 1fr",
                borderTop: LINE,
                background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
              }}
            >
              {[String(index + 1), item.description, item.specification, item.qty, item.remarks].map((cell, cellIndex) => (
                <div key={`${item.id}-${cellIndex}`} style={{ padding: "6px 8px", fontSize: 9.5, lineHeight: 1.4, color: INK }}>
                  {cell.trim() || "—"}
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
    });
  }

  const checks = data.commissioningChecks.filter((item) => item.trim());
  if (checks.length > 0) {
    blocks.push({
      key: "checks-heading",
      estimate: 36,
      keepWithNext: true,
      node: <div style={sectionBar("Checked at handover")}>Checked at handover</div>,
    });
    checks.forEach((item, index) => {
      blocks.push({
        key: `check-${index}`,
        estimate: 28,
        node: (
          <div style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8, marginBottom: 5, fontSize: 10.5, lineHeight: 1.45 }}>
            <span style={{ color: "#1f7a4d", fontWeight: 800 }}>✓</span>
            <span>{item}</span>
          </div>
        ),
      });
    });
  }

  const papers = data.documents.filter((item) => item.label.trim());
  if (papers.length > 0) {
    blocks.push({
      key: "papers-heading",
      estimate: 36,
      keepWithNext: true,
      node: <div style={sectionBar("Papers handed over")}>Papers handed over</div>,
    });
    blocks.push({
      key: "papers",
      estimate: 16 + papers.length * 20,
      node: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", marginBottom: 6 }}>
          {papers.map((item) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 8, fontSize: 10.5, lineHeight: 1.4 }}>
              <span style={{ fontWeight: 800, color: item.handed ? "#1f7a4d" : "#9ca3af" }}>{item.handed ? "✓" : "○"}</span>
              <span style={{ color: item.handed ? INK : MUTED }}>{item.label}</span>
            </div>
          ))}
        </div>
      ),
    });
  }

  const care = data.careNotes.filter((item) => item.trim());
  if (care.length > 0) {
    blocks.push({
      key: "care-heading",
      estimate: 36,
      keepWithNext: true,
      node: <div style={sectionBar("For the plant to work properly")}>For the plant to work properly</div>,
    });
    care.forEach((item, index) => {
      blocks.push({
        key: `care-${index}`,
        estimate: 42,
        node: (
          <div style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 8, marginBottom: 7, alignItems: "start" }}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: NAVY,
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {index + 1}
            </span>
            <span style={{ fontSize: 10.5, lineHeight: 1.5 }}>{item}</span>
          </div>
        ),
      });
    });
  }

  if (data.closingNote.trim()) {
    blocks.push({
      key: "closing",
      estimate: 64,
      node: (
        <div
          style={{
            margin: "4px 0 8px",
            padding: "10px 12px",
            background: "#f4f7fb",
            borderLeft: `3px solid ${NAVY}`,
            borderRadius: "0 8px 8px 0",
            fontSize: 10.5,
            lineHeight: 1.55,
          }}
        >
          {data.closingNote}
        </div>
      ),
    });
  }

  const terms = data.terms.filter((item) => item.title.trim() || item.text.trim());
  if (terms.length > 0) {
    blocks.push({
      key: "terms-heading",
      estimate: 36,
      keepWithNext: true,
      node: <div style={sectionBar("Terms")}>Terms</div>,
    });
    terms.forEach((item, index) => {
      blocks.push({
        key: `term-${item.id}`,
        estimate: 52,
        node: (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: NAVY, marginBottom: 2 }}>
              {index + 1}. {item.title}
            </div>
            <div style={{ fontSize: 10.5, lineHeight: 1.5, color: "#1f2937" }}>{item.text}</div>
          </div>
        ),
      });
    });
  }

  blocks.push({
    key: "ack-heading",
    estimate: 36,
    keepWithNext: true,
    node: <div style={sectionBar("Acknowledgement")}>Acknowledgement</div>,
  });
  blocks.push({
    key: "ack",
    estimate: 210,
    node: (
      <div>
        <p style={{ margin: "0 0 14px", fontSize: 10.5, lineHeight: 1.55 }}>{data.acknowledgement}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 8 }}>
          <div>
            <div style={{ height: 42, borderBottom: "1px solid #111827", marginBottom: 8 }} />
            <div style={{ fontWeight: 800, fontSize: 11 }}>Received by the client</div>
            <div style={{ fontSize: 10.5, marginTop: 4 }}>{filledValue(data.customerName)}</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>Date: _________________</div>
          </div>
          <div>
            <div style={{ height: 42, borderBottom: "1px solid #111827", marginBottom: 8 }} />
            <div style={{ fontWeight: 800, fontSize: 11 }}>For Mahi Solar Solution</div>
            <div style={{ fontSize: 10.5, marginTop: 4 }}>{filledValue(data.repName)}</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>
              {[data.repTitle, data.repCompany].filter(Boolean).join(", ") || "___________"}
            </div>
            {data.repMobiles.trim() ? (
              <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>Mob. {data.repMobiles}</div>
            ) : null}
          </div>
        </div>
      </div>
    ),
  });

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
      if (currentPage.length > 0) pages.push(currentPage);
      currentPage = carryOver;
      remaining = nextCapacity - carryOver.reduce((sum, item) => sum + heightOf(item), 0);
    }
    currentPage.push(block);
    remaining -= blockHeight;
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}

export function HandoverPreview({ data }: HandoverPreviewProps) {
  const allBlocks = useMemo(() => createBlocks(data), [data]);
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [blockHeights, setBlockHeights] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const nextHeights = Object.fromEntries(
      allBlocks.map((block) => [block.key, Math.ceil(measureRefs.current[block.key]?.offsetHeight ?? block.estimate) + 2]),
    );
    const changed = allBlocks.some((block) => nextHeights[block.key] !== blockHeights[block.key]);
    if (changed) setBlockHeights(nextHeights);
  }, [allBlocks, blockHeights]);

  const packingBuffer = 28;
  const footerReserve = data.showPageNumbers ? PAGE_NUMBER_FOOTER_HEIGHT : 0;
  const firstCapacity = (data.showLetterhead ? FIRST_PAGE_CAPACITY : FOLLOWING_PAGE_CAPACITY) - footerReserve - packingBuffer;
  const followingCapacity = FOLLOWING_PAGE_CAPACITY - footerReserve - packingBuffer;
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
          fontFamily: "Lexend, sans-serif",
          color: INK,
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

      <div id="handover-preview" style={{ width: PAGE_WIDTH, display: "grid", gap: 28, overflow: "visible" }}>
        {pages.map((pageBlocks, pageIndex) => (
          <Page data={data} key={`handover-page-${pageIndex + 1}`} pageIndex={pageIndex} pageCount={pages.length}>
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
