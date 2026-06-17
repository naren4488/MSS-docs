import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  FIRST_PAGE_CAPACITY,
  FOLLOWING_PAGE_CAPACITY,
  PAGE_HEIGHT,
  PAGE_NUMBER_FOOTER_HEIGHT,
  PAGE_SIDE_PADDING,
  PAGE_TOP_BOTTOM_PADDING,
  PAGE_WIDTH,
} from "../constants/sheet-layout";
import type { Employee, EmployeeDirectoryData } from "../types/employee-directory";
import { filledValue } from "../lib/employee-directory-formatters";
import { formatDate } from "@/features/offer-letter/lib/offer-letter-formatters";

interface EmployeeDirectoryPreviewProps {
  data: EmployeeDirectoryData;
}

interface PreviewBlock {
  key: string;
  estimate: number;
  node: ReactNode;
  keepWithNext?: boolean;
}

const NAVY = "#14306b";
const NAVY2 = "#1f4aa0";

const sectionBarStyle: CSSProperties = {
  background: `linear-gradient(90deg, ${NAVY}, ${NAVY2})`,
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  padding: "6px 12px",
  borderRadius: 4,
  margin: "14px 0 8px",
};

const pageBodyStyle: CSSProperties = {
  padding: `${PAGE_TOP_BOTTOM_PADDING}px ${PAGE_SIDE_PADDING}px`,
};

function employeeRows(employee: Employee) {
  const holder = employee.bankAccountName.trim() || employee.name.trim();
  return [
    { label: "Employee ID", value: employee.employeeId },
    { label: "Designation", value: employee.designation },
    { label: "Department", value: employee.department },
    { label: "Address", value: employee.address },
    { label: "Phone", value: employee.phone },
    { label: "Email", value: employee.email },
    { label: "Aadhaar", value: employee.aadhaar },
    { label: "PAN", value: employee.pan },
    { label: "Date of Joining", value: employee.dateOfJoining ? formatDate(employee.dateOfJoining) : "" },
    { label: "Account Holder", value: holder },
    { label: "Bank", value: employee.bankName },
    { label: "Branch", value: employee.bankBranch },
    { label: "A/c No.", value: employee.bankAccountNo },
    { label: "Account Type", value: employee.bankAccountType },
    { label: "IFSC", value: employee.bankIfsc },
  ].filter((row) => row.value.trim());
}

function EmployeeSection({ employee, index }: { employee: Employee; index: number }) {
  const rows = employeeRows(employee);
  const title = employee.name.trim() || `Employee ${index + 1}`;

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={sectionBarStyle}>
        {index + 1}. {title}
      </div>
      {rows.length > 0 ? (
        <div style={{ display: "grid", gap: 5 }}>
          {rows.map((row) => (
            <div key={row.label} style={{ display: "grid", gridTemplateColumns: "130px 1fr", fontSize: 11, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: "#374151" }}>{row.label}</span>
              <span>: {row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>No details entered yet.</p>
      )}
    </div>
  );
}

function Header({ data }: { data: EmployeeDirectoryData }) {
  return (
    <div style={{ textAlign: "center", borderBottom: `3px solid ${NAVY}`, paddingBottom: 14, marginBottom: 8 }}>
      {data.companyLogoUrl ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <img
            alt="Company logo"
            crossOrigin="anonymous"
            src={data.companyLogoUrl}
            style={{ maxHeight: 72, width: "auto", objectFit: "contain" }}
          />
        </div>
      ) : null}
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1, color: NAVY, textTransform: "uppercase" }}>
        {filledValue(data.companyName)}
      </div>
      <div style={{ fontSize: 10, marginTop: 6, color: "#4b5563" }}>{filledValue(data.companyAddress)}</div>
      <div style={{ fontSize: 10, marginTop: 4, color: "#4b5563" }}>
        {[data.companyPhone, data.companyEmail].filter(Boolean).join(" | ") || filledValue("")}
      </div>
      {data.companyGst ? (
        <div style={{ fontSize: 9.5, marginTop: 4, color: "#4b5563" }}>GST: {data.companyGst}</div>
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
  data: EmployeeDirectoryData;
  pageIndex: number;
  pageCount: number;
}) {
  const showHeader = data.showLetterhead && pageIndex === 0;

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
        <div style={{ position: "absolute", right: PAGE_SIDE_PADDING, bottom: 16, fontSize: 10, color: "#6b7280" }}>
          Page {pageIndex + 1} of {pageCount}
        </div>
      ) : null}
    </div>
  );
}

function estimateEmployeeHeight(employee: Employee) {
  const rowCount = employeeRows(employee).length || 1;
  return 52 + rowCount * 22;
}

function createBlocks(data: EmployeeDirectoryData): PreviewBlock[] {
  const blocks: PreviewBlock[] = [];

  if (!data.showLetterhead) {
    blocks.push({
      key: "title",
      estimate: 48,
      keepWithNext: true,
      node: (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: NAVY, textTransform: "uppercase" }}>
            {filledValue(data.title)}
          </div>
        </div>
      ),
    });
  } else {
    blocks.push({
      key: "title",
      estimate: 36,
      keepWithNext: true,
      node: (
        <div style={{ textAlign: "center", margin: "8px 0 12px" }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: NAVY, textTransform: "uppercase" }}>
            {filledValue(data.title)}
          </div>
        </div>
      ),
    });
  }

  if (data.employees.length === 0) {
    blocks.push({
      key: "empty",
      estimate: 40,
      node: <p style={{ margin: 0, fontSize: 11, color: "#6b7280", textAlign: "center" }}>No employees added yet.</p>,
    });
    return blocks;
  }

  data.employees.forEach((employee, index) => {
    blocks.push({
      key: `employee-${employee.id}`,
      estimate: estimateEmployeeHeight(employee),
      node: <EmployeeSection employee={employee} index={index} />,
    });
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

  return pages.length > 0 ? pages : [[]];
}

export function EmployeeDirectoryPreview({ data }: EmployeeDirectoryPreviewProps) {
  const allBlocks = useMemo(() => createBlocks(data), [data]);
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [blockHeights, setBlockHeights] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    setBlockHeights((prev) => {
      const nextHeights = Object.fromEntries(
        allBlocks.map((block) => [block.key, Math.ceil(measureRefs.current[block.key]?.offsetHeight ?? block.estimate)]),
      );

      const changed = allBlocks.some((block) => nextHeights[block.key] !== prev[block.key]);
      return changed ? nextHeights : prev;
    });
  }, [allBlocks]);

  const footerReserve = data.showPageNumbers ? PAGE_NUMBER_FOOTER_HEIGHT : 0;
  const firstCapacity = (data.showLetterhead ? FIRST_PAGE_CAPACITY : FOLLOWING_PAGE_CAPACITY) - footerReserve;
  const followingCapacity = FOLLOWING_PAGE_CAPACITY - footerReserve;
  const pages = paginateBlocks(allBlocks, blockHeights, firstCapacity, followingCapacity);

  return (
    <>
      <div
        aria-hidden="true"
        className="employee-directory-measure-layer no-print"
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

      <div id="employee-directory-preview" style={{ width: PAGE_WIDTH, display: "grid", gap: 28, overflow: "visible" }}>
        {pages.map((pageBlocks, pageIndex) => (
          <Page data={data} key={`employee-directory-page-${pageIndex + 1}`} pageCount={pages.length} pageIndex={pageIndex}>
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
