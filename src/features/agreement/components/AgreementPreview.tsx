import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  FIRST_PAGE_CAPACITY,
  FOLLOWING_PAGE_CAPACITY,
  PAGE_HEIGHT,
  PAGE_SIDE_PADDING,
  PAGE_TOP_BOTTOM_PADDING,
  PAGE_WIDTH,
} from "../constants/sheet-layout";
import type { AgreementData, AgreementSection } from "../types/agreement";
import { fillTemplate, filledValue } from "../lib/agreement-formatters";

interface AgreementPreviewProps {
  data: AgreementData;
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
  textAlign: "justify",
};

function estimateTextLines(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil((text || "").trim().length / charsPerLine));
}

function estimateParagraphHeight(text: string, charsPerLine = 78) {
  return text.split("\n").reduce((total, line) => total + estimateTextLines(line, charsPerLine) * 22 + 4, 0);
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
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, overflow: "visible" }}>
          <img
            alt="Company logo"
            crossOrigin="anonymous"
            src={data.company.logoUrl}
            style={{ maxHeight: 64, width: "auto", objectFit: "contain", overflow: "visible" }}
          />
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
      <div style={{ ...pageBodyStyle, flex: 1, minHeight: 0, overflow: "hidden" }}>{children}</div>
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
          Page {pageIndex + 1} of {pageCount}
        </div>
      ) : null}
    </div>
  );
}

function renderMultiline(text: string, baseKey: string) {
  return text.split(/\n\n+/).map((paragraph, index) => (
    <p key={`${baseKey}-p-${index}`} style={paragraphStyle}>
      {paragraph.split("\n").map((line, lineIndex, all) => (
        <span key={`${baseKey}-line-${lineIndex}`}>
          {line}
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
      node: <p style={{ ...paragraphStyle, fontWeight: 700, margin: "12px 0 8px" }}>WHEREAS:</p>,
    });

    data.recitals.forEach((recital, index) => {
      const filled = fillTemplate(recital, data);
      blocks.push({
        key: `whereas-${index}`,
        estimate: 16 + estimateParagraphHeight(filled, 70),
        node: (
          <ul style={{ margin: "0 0 8px", paddingLeft: 22, lineHeight: 1.7 }}>
            <li style={{ marginBottom: 4, textAlign: "justify" }}>{filled}</li>
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
  });

  if (data.governingLawParagraph.trim()) {
    const filled = fillTemplate(data.governingLawParagraph, data);
    blocks.push({
      key: "governing-law-heading",
      estimate: 26,
      keepWithNext: true,
      node: <h3 style={sectionHeadingStyle}>Governing Law & Dispute Resolution</h3>,
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

  return blocks;
}

function appendSectionBlocks(
  blocks: PreviewBlock[],
  section: AgreementSection,
  sectionIndex: number,
  data: AgreementData,
) {
  if (section.heading.trim()) {
    blocks.push({
      key: `section-${section.id}-heading`,
      estimate: 30,
      keepWithNext: true,
      node: (
        <h3 style={sectionHeadingStyle}>
          {sectionIndex + 1}. {section.heading}
        </h3>
      ),
    });
  }

  if (section.intro.trim()) {
    const filled = fillTemplate(section.intro, data);
    blocks.push({
      key: `section-${section.id}-intro`,
      estimate: 18 + estimateParagraphHeight(filled, 78),
      node: <p style={paragraphStyle}>{filled}</p>,
    });
  }

  section.clauses.forEach((clause) => {
    const filledContent = fillTemplate(clause.content, data);
    blocks.push({
      key: `clause-${clause.id}-content`,
      estimate: 18 + estimateParagraphHeight(filledContent, 78) + (clause.title ? 18 : 0),
      keepWithNext: clause.subPoints.length > 0,
      node: (
        <div style={{ marginBottom: 12 }}>
          <p style={{ ...paragraphStyle, marginBottom: 6 }}>
            <strong>{clause.number}.</strong>
            {clause.title ? <strong> {clause.title}: </strong> : " "}
            {filledContent}
          </p>
        </div>
      ),
    });

    clause.subPoints.forEach((sub, subIndex) => {
      const filledSub = fillTemplate(sub.text, data);
      blocks.push({
        key: `clause-${clause.id}-sub-${sub.id}`,
        estimate: 14 + estimateParagraphHeight(filledSub, 72),
        keepWithNext: subIndex < clause.subPoints.length - 1,
        node: (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr",
              gap: 8,
              marginLeft: 28,
              marginBottom: 8,
              lineHeight: 1.7,
            }}
          >
            <span style={{ fontWeight: 600 }}>{sub.label}.</span>
            <span style={{ textAlign: "justify" }}>{filledSub}</span>
          </div>
        ),
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
        <p style={{ margin: "0 0 2px", fontWeight: 700 }}>{filledValue(data.party.representativeName)}</p>
        {data.party.representativeTitle ? (
          <p style={{ margin: "0 0 2px", fontSize: 11 }}>{data.party.representativeTitle}</p>
        ) : null}
        <p style={{ margin: 0, fontSize: 11 }}>{filledValue(data.party.entityName)}</p>
      </div>
    </div>
  );
}

function WitnessBlock({ data }: { data: AgreementData }) {
  return (
    <div style={{ marginTop: 28 }}>
      <p style={{ margin: "0 0 12px", fontWeight: 700 }}>Witnesses:</p>
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

export function AgreementPreview({ data }: AgreementPreviewProps) {
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

  const firstCapacity = data.showLetterhead ? FIRST_PAGE_CAPACITY : FOLLOWING_PAGE_CAPACITY;
  const pages = paginateBlocks(allBlocks, blockHeights, firstCapacity, FOLLOWING_PAGE_CAPACITY);

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
