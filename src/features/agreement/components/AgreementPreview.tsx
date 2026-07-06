import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  FOLLOWING_PAGE_CAPACITY,
  HEADER_HEIGHT,
  PAGE_HEIGHT,
  PAGE_NUMBER_FOOTER_HEIGHT,
  PAGE_SIDE_PADDING,
  PAGE_TOP_BOTTOM_PADDING,
  PAGE_WIDTH,
} from "../constants/sheet-layout";
import type { AgreementData, AgreementLanguage, AgreementSection } from "../types/agreement";
import { fillTemplate, filledValue } from "../lib/agreement-formatters";
import { getPartnershipVendorChargeContent } from "../lib/agreement-defaults";

const LABELS: Record<AgreementLanguage, {
  whereas: string;
  governingLaw: string;
  witnesses: string;
  pageOf: (current: number, total: number) => string;
}> = {
  en: {
    whereas: "WHEREAS:",
    governingLaw: "Governing Law & Dispute Resolution",
    witnesses: "Witnesses:",
    pageOf: (current, total) => `Page ${current} of ${total}`,
  },
  hi: {
    whereas: "जबकि:",
    governingLaw: "शासी विधि एवं विवाद समाधान",
    witnesses: "साक्षी:",
    pageOf: (current, total) => `पृष्ठ ${current} / ${total}`,
  },
};

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
  textAlign: "justify",
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

function hardSplitAtWords(text: string, maxChars: number): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();
  while (remaining.length > maxChars) {
    let splitAt = remaining.lastIndexOf(" ", maxChars);
    if (splitAt <= 0) {
      splitAt = maxChars;
    }
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) {
    chunks.push(remaining);
  }
  return chunks.length ? chunks : [""];
}

function mergeSegmentsIntoChunks(segments: string[], maxChars: number): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const segment of segments) {
    const piece = segment.trim();
    if (!piece) {
      continue;
    }

    if (piece.length > maxChars) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      chunks.push(...hardSplitAtWords(piece, maxChars));
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

/** Break long legal paragraphs into page-sized chunks so text flows instead of jumping whole. */
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
    const chunks = mergeSegmentsIntoChunks(semicolonParts, maxChars);
    if (chunks.every((chunk) => chunk.length <= maxChars)) {
      return chunks;
    }
  }

  const sentenceParts = trimmed.split(/(?<=[.!?])\s+/);
  if (sentenceParts.length > 1) {
    const chunks = mergeSegmentsIntoChunks(sentenceParts, maxChars);
    if (chunks.every((chunk) => chunk.length <= maxChars)) {
      return chunks;
    }
  }

  return hardSplitAtWords(trimmed, maxChars);
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
            style={{ maxHeight: 88, width: "auto", objectFit: "contain", overflow: "visible" }}
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
          {LABELS[data.language].pageOf(pageIndex + 1, pageCount)}
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
      node: <p style={{ ...paragraphStyle, fontWeight: 700, margin: "12px 0 8px" }}>{LABELS[data.language].whereas}</p>,
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
    if (data.template === "partnership" && data.showVendorChargePerWatt && sectionIndex === 1) {
      appendVendorChargeBlocks(blocks, data);
    }
  });

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
              <span style={{ textAlign: "justify" }}>{para}</span>
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
