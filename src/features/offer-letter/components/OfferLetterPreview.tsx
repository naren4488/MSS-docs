import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  FIRST_PAGE_CAPACITY,
  FOLLOWING_PAGE_CAPACITY,
  HEADER_HEIGHT,
  PAGE_HEIGHT,
  PAGE_SIDE_PADDING,
  PAGE_TOP_BOTTOM_PADDING,
  PAGE_WIDTH,
} from "../constants/sheet-layout";
import { filledValue, formatCurrency, formatDate } from "../lib/offer-letter-formatters";
import { renderRichText } from "../lib/offer-letter-parser";
import type { OfferLetterData } from "../types/offer-letter";

interface OfferLetterPreviewProps {
  data: OfferLetterData;
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

const headingStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 1,
  margin: "0 0 14px",
  color: "#152036",
};

const separatorStyle: CSSProperties = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "18px 0",
};

function estimateTextLines(text: string, charsPerLine: number) {
  return Math.max(1, Math.ceil((text || "").trim().length / charsPerLine));
}

function estimateRichTextHeight(text: string) {
  return text.split("\n").reduce((total, rawLine) => {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      return total + 10;
    }

    if (line.match(/^\s*-\s+/)) {
      return total + estimateTextLines(line.replace(/^\s*-\s+/, ""), 58) * 22;
    }

    return total + estimateTextLines(line, 72) * 22;
  }, 0);
}

function Header({ data }: { data: OfferLetterData }) {
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
        {[data.company.phone, data.company.email, data.company.website].filter(Boolean).join(" | ") ||
          filledValue("")}
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
}: {
  children: ReactNode;
  data: OfferLetterData;
  pageIndex: number;
}) {
  const showHeader = pageIndex === 0;

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
      }}
    >
      {showHeader ? <Header data={data} /> : null}
      <div
        style={{
          ...pageBodyStyle,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function bulletItemBlocks(
  items: string[],
  keyPrefix: string,
  options: { listStyleType?: string; bottomGap?: number } = {},
): PreviewBlock[] {
  const { listStyleType, bottomGap = 12 } = options;
  return items.map((item, index) => {
    const isLast = index === items.length - 1;
    return {
      key: `${keyPrefix}-${index}`,
      estimate: 12 + estimateTextLines(item, 58) * 22,
      node: (
        <ul
          style={{
            margin: isLast ? `0 0 ${bottomGap}px` : 0,
            paddingLeft: 22,
            lineHeight: 1.8,
            ...(listStyleType ? { listStyleType } : null),
          }}
        >
          <li style={{ marginBottom: 6 }}>{filledValue(item)}</li>
        </ul>
      ),
    };
  });
}

function createPrePolicyBlocks(data: OfferLetterData, signatory: string): PreviewBlock[] {
  return [
    {
      key: "title",
      estimate: 60,
      node: (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>OFFER LETTER</div>
        </div>
      ),
    },
    {
      key: "to-block",
      estimate: 90 + estimateTextLines(data.employeeAddress, 62) * 18,
      node: (
        <div style={{ marginBottom: 16, lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 4px" }}>To,</p>
          <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{filledValue(data.employeeName)}</p>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>{filledValue(data.employeeAddress)}</p>
        </div>
      ),
    },
    {
      key: "subject",
      estimate: 42,
      node: (
        <p style={{ margin: "0 0 14px", lineHeight: 1.7 }}>
          <strong>Subject:</strong> Offer for the role of <strong>{filledValue(data.role)}</strong>
        </p>
      ),
    },
    {
      key: "dear",
      estimate: 40,
      node: (
        <p style={{ margin: "0 0 14px", lineHeight: 1.7 }}>
          Dear <strong>{filledValue(data.employeeName)}</strong>,
        </p>
      ),
    },
    {
      key: "intro",
      estimate: 50 + estimateTextLines(data.role + data.company.name, 52) * 10,
      node: (
        <p style={{ margin: "0 0 14px", lineHeight: 1.8 }}>
          {filledValue(data.company.name)} is pleased to offer you the position of <strong>{filledValue(data.role)}</strong>{" "}
          with our organization.
        </p>
      ),
    },
    {
      key: "details",
      estimate: 110,
      node: (
        <div style={{ marginBottom: 14, lineHeight: 1.8 }}>
          <p style={{ margin: "0 0 4px" }}>
            <strong>Date of Joining:</strong> {formatDate(data.dateOfJoining)}
          </p>
          {data.location ? (
            <p style={{ margin: "0 0 4px" }}>
              <strong>Location:</strong> {filledValue(data.location)}
            </p>
          ) : null}
          <p style={{ margin: "0 0 4px" }}>
            <strong>Monthly Salary:</strong> {formatCurrency(data.monthlySalary)}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Reporting To:</strong> {filledValue(data.reportingTo)}
          </p>
        </div>
      ),
    },
    {
      key: "validity",
      estimate: 56,
      node: (
        <p style={{ margin: "0 0 18px", color: "#6b7280", fontStyle: "italic", lineHeight: 1.7 }}>
          This offer is valid for <strong>{data.offerValidityDays || 15} days</strong> from the date of issuance. Kindly
          confirm your acceptance within this period.
        </p>
      ),
    },
    {
      key: "pre-separator",
      estimate: 20,
      node: <hr style={separatorStyle} />,
    },
    {
      key: "role-heading",
      estimate: 34,
      keepWithNext: true,
      node: <h2 style={headingStyle}>ROLE & RESPONSIBILITIES</h2>,
    },
    {
      key: "role-overview",
      estimate: 26 + estimateTextLines(data.roleOverview, 72) * 22,
      keepWithNext: true,
      node: <div>{renderRichText(data.roleOverview, "role-overview")}</div>,
    },
    ...bulletItemBlocks(data.responsibilityPoints, "responsibility-point"),
    {
      key: "closing-line",
      estimate: 58,
      node: (
        <p style={{ margin: "0 0 26px", lineHeight: 1.8 }}>
          We look forward to having you as part of the team and hope for a successful and mutually rewarding association.
        </p>
      ),
    },
    {
      key: "signature-block",
      estimate: 180,
      node: (
        <div style={{ position: "relative", minHeight: 160, marginTop: 18 }}>
          <p style={{ margin: "0 0 18px", lineHeight: 1.7 }}>Warm regards,</p>
          <div style={{ position: "absolute", bottom: 0, left: 0 }}>
            <p style={{ margin: "0 0 4px", fontWeight: 700 }}>{signatory}</p>
            {data.company.founderTitle ? (
              <p style={{ margin: "0 0 4px" }}>{data.company.founderTitle}</p>
            ) : null}
            <p style={{ margin: "0 0 4px" }}>{filledValue(data.company.name)}</p>
            {[data.company.phone, data.company.email, data.company.website]
              .filter(Boolean)
              .map((line, index) => (
                <p key={`signature-contact-${index}`} style={{ margin: "0 0 4px" }}>
                  {line}
                </p>
              ))}
          </div>
        </div>
      ),
    },
  ];
}

function createPostPolicyBlocks(data: OfferLetterData): PreviewBlock[] {
  const blocks: PreviewBlock[] = [
    {
      key: "policies-heading",
      estimate: 34,
      keepWithNext: true,
      node: <h2 style={headingStyle}>COMPANY POLICIES & BENEFITS</h2>,
    },
  ];

  const policySections = [
    { title: "Leave Policy", items: data.leavePolicy },
    { title: "Other Benefits", items: data.otherBenefits },
  ];
  policySections.forEach((section, index) => {
    blocks.push({
      key: `policy-${section.title}`,
      estimate: 46 + section.items.reduce((sum, item) => sum + estimateTextLines(item, 64) * 22, 0),
      node: (
        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700 }}>{section.title}</h3>
          <ul style={{ margin: "0 0 14px", paddingLeft: 20, lineHeight: 1.8 }}>
            {section.items.map((item, itemIndex) => (
              <li key={`${section.title}-${itemIndex}`}>{filledValue(item)}</li>
            ))}
          </ul>
          {index < policySections.length - 1 ? <hr style={separatorStyle} /> : null}
        </div>
      ),
    });
  });

  blocks.push(
    {
      key: "insurance",
      estimate: 70,
      node: (
        <div>
          <p style={{ margin: "14px 0 4px", lineHeight: 1.8 }}>
            <strong>Insurance Policy:</strong> {filledValue(data.insuranceCoverage)}
          </p>
          <p style={{ margin: "0 0 18px", lineHeight: 1.8 }}>
            <strong>Insurance Reimbursement Condition:</strong> {filledValue(data.insuranceMinTenure)}
          </p>
        </div>
      ),
    },
    {
      key: "terms-separator",
      estimate: 20,
      node: <hr style={separatorStyle} />,
    },
    {
      key: "terms-heading",
      estimate: 34,
      keepWithNext: true,
      node: <h2 style={headingStyle}>TERMS AND CONDITIONS</h2>,
    },
  );

  data.terms.forEach((term, index) => {
    blocks.push({
      key: term.id,
      estimate: 34 + estimateRichTextHeight(term.content) + 34,
      node: (
        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700 }}>
            {index + 1}. {filledValue(term.title)}
          </h3>
          {renderRichText(term.content, term.id)}
          {index < data.terms.length - 1 ? <hr style={separatorStyle} /> : null}
        </div>
      ),
    });
  });

  if (data.showAcceptance) {
    blocks.push({
      key: "acceptance",
      estimate: 260,
      node: (
        <div style={{ marginTop: 24 }}>
          <hr style={separatorStyle} />
          <h2 style={headingStyle}>ACCEPTANCE</h2>
          <p style={{ margin: "0 0 22px", lineHeight: 1.8 }}>
            I, <strong>{filledValue(data.employeeName)}</strong>, hereby acknowledge that I have read and understood the
            contents of this offer letter, and accept the offer for the role of <strong>{filledValue(data.role)}</strong>{" "}
            with <strong>{filledValue(data.company.name)}</strong>, with effect from{" "}
            <strong>{formatDate(data.dateOfJoining)}</strong>. I agree to abide by the terms and conditions stated herein.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 34 }}>
            <div>
              <div style={{ borderTop: "1px solid #111827", paddingTop: 8 }}>Employee Signature</div>
            </div>
            <div>
              <div style={{ borderTop: "1px solid #111827", paddingTop: 8 }}>Date</div>
            </div>
          </div>
        </div>
      ),
    });
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

export function OfferLetterPreview({ data }: OfferLetterPreviewProps) {
  const signatory = filledValue(data.signatoryName || data.company.founderName);
  const prePolicyBlocks = useMemo(() => createPrePolicyBlocks(data, signatory), [data, signatory]);
  const postPolicyBlocks = useMemo(() => createPostPolicyBlocks(data), [data]);
  const allBlocks = [...prePolicyBlocks, ...postPolicyBlocks];
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

  const prePolicyPages = paginateBlocks(prePolicyBlocks, blockHeights, FIRST_PAGE_CAPACITY, FOLLOWING_PAGE_CAPACITY);
  const postPolicyPages = paginateBlocks(postPolicyBlocks, blockHeights, FOLLOWING_PAGE_CAPACITY, FOLLOWING_PAGE_CAPACITY);

  return (
    <>
      <div
        aria-hidden="true"
        className="offer-letter-measure-layer no-print"
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
        id="offer-letter-preview"
        style={{
          width: PAGE_WIDTH,
          display: "grid",
          gap: 28,
          overflow: "visible",
        }}
      >
        {prePolicyPages.map((pageBlocks, pageIndex) => (
          <Page data={data} key={`pre-policy-${pageIndex + 1}`} pageIndex={pageIndex}>
            {pageBlocks.map((block) => (
              <div key={block.key} style={{ display: "flow-root" }}>
                {block.node}
              </div>
            ))}
          </Page>
        ))}

        {postPolicyPages.map((pageBlocks, pageOffset) => (
          <Page data={data} key={`post-policy-${pageOffset + 1}`} pageIndex={prePolicyPages.length + pageOffset}>
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
