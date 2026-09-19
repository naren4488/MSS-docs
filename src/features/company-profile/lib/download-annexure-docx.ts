import {
  AlignmentType,
  BorderStyle,
  Document,
  FileChild,
  Footer,
  Header,
  HeightRule,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  convertMillimetersToTwip,
  type IParagraphOptions,
  type IRunOptions,
} from "docx";
import { documentDownloadName } from "@/lib/document-filename";
import type { AnnexureProjectReference, CompanyProfileData, EmpanelmentAnnexure } from "../types/company-profile";
import { isMseLogoUrl } from "@/components/CompanyLogo";
import { filledValue, formatDate } from "./company-profile-formatters";
import { getLetterheadVendorLine, isMseFirm } from "./company-profile-defaults";

const NAVY_HEX = "14306B";
const GOLD_HEX = "E8A317";
const LABEL_FILL = "F4F7FB";

function joinParts(parts: Array<string | undefined>) {
  return parts
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join("  |  ");
}
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 8, color: NAVY_HEX };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const CELL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

function hexFill(fill: string) {
  return { type: ShadingType.CLEAR, fill };
}

function run(text: string, options: Omit<IRunOptions, "text" | "children"> = {}) {
  return new TextRun({ font: "Calibri", size: 21, color: "111827", ...options, text });
}

function para(text: string, options: Omit<IParagraphOptions, "children"> = {}) {
  return new Paragraph({ spacing: { after: 40 }, ...options, children: [run(text)] });
}

function barRow(fill: string, heightTwips: number) {
  return new TableRow({
    height: { value: heightTwips, rule: HeightRule.EXACT },
    children: [
      new TableCell({
        borders: NO_BORDERS,
        shading: hexFill(fill),
        width: { size: 100, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ spacing: { after: 0, before: 0 }, children: [] })],
      }),
    ],
  });
}

function colorBar(fill: string, heightTwips: number) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [barRow(fill, heightTwips)],
  });
}

function cell(text: string, options?: { bold?: boolean; fill?: string; width?: number; center?: boolean; color?: string; span?: number }) {
  return new TableCell({
    borders: CELL_BORDERS,
    shading: options?.fill ? hexFill(options.fill) : undefined,
    width: options?.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined,
    columnSpan: options?.span,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: [
      new Paragraph({
        alignment: options?.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 0, before: 0 },
        children: [
          run(text || " ", {
            bold: options?.bold,
            color: options?.color ?? (options?.fill === NAVY_HEX ? "FFFFFF" : "1F2937"),
            size: options?.fill === NAVY_HEX ? 17 : 20,
          }),
        ],
      }),
    ],
  });
}

function formRow(label: string, value: string) {
  return new TableRow({
    children: [cell(label, { bold: true, fill: LABEL_FILL, width: 38 }), cell(value, { width: 62 })],
  });
}

function experienceTable(data: CompanyProfileData, annexure: EmpanelmentAnnexure) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3800, 6200],
    rows: [
      formRow("Name of the Company", data.legalName),
      formRow("Constitution (Pvt Ltd, Partnership etc)", annexure.constitution),
      formRow("Name of Proprietors / Partners / Directors (Please mention all)", annexure.proprietors),
      formRow("Communication & Address – Office (With Pincode and Landmark)", annexure.officeAddress),
      formRow("Registered Address (With Pincode and Landmark)", annexure.registeredAddress),
      formRow("Contact Person", annexure.contactPerson),
      formRow("Phone No", data.phone),
      formRow("Email Address", data.email),
      formRow("No of years experience in current business", annexure.yearsCurrentBusiness),
      formRow("No of years experience in any other business (Please provide segment details also)", annexure.yearsOtherBusiness),
      new TableRow({
        children: [cell("Business Details (Brief)", { bold: true, fill: LABEL_FILL, span: 2 })],
      }),
      formRow("Infrastructure", annexure.infrastructure),
      formRow("No of employees working", annexure.employeeCount),
      formRow("Total years at current office address", annexure.yearsAtOffice),
      formRow("If working with other NBFCs / Banks — name & years of association", annexure.nbfcBanks),
      formRow("Attach profile / corporate presentation (If available)", annexure.attachProfile),
    ],
  });
}

function referenceTable(rows: AnnexureProjectReference[]) {
  const displayRows = rows.length >= 2 ? rows : [...rows, { details: "", address: "", contactName: "", mobile: "" }];
  const headers = ["S. No", "Brief details of projects executed (Type, capacity, commissioning date)", "Address of installation / project", "Name of contact person for reference check", "Mobile No of contact person"];
  const widths = [8, 32, 24, 20, 16];
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: widths.map((part) => part * 100),
    rows: [
      new TableRow({
        children: headers.map((title, index) => cell(title, { bold: true, fill: NAVY_HEX, center: true, width: widths[index] })),
      }),
      ...displayRows.map(
        (row, index) =>
          new TableRow({
            children: [
              cell(String(index + 1), { bold: true, center: true, width: 8 }),
              cell(row.details, { width: 32 }),
              cell(row.address, { width: 24 }),
              cell(row.contactName, { width: 20 }),
              cell(row.mobile, { width: 16 }),
            ],
          }),
      ),
    ],
  });
}

function signatureTable(data: CompanyProfileData, annexure: EmpanelmentAnnexure) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    columnWidths: [5000, 5000],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: NO_BORDERS,
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              para(`Place: ${annexure.place || "Jaipur"}`),
              para(`Date: ${formatDate(annexure.date)}`),
            ],
          }),
          new TableCell({
            borders: NO_BORDERS,
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [run(`For ${filledValue(data.legalName)}`, { bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: { top: { style: BorderStyle.SINGLE, size: 6, color: NAVY_HEX, space: 8 } },
                spacing: { before: 360, after: 40 },
                children: [run(annexure.signatoryName || data.contactName, { bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 20 },
                children: [run(annexure.signatoryTitle || data.contactTitle || "Authorised Signatory")],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [run("(Sign & stamp)", { italics: true, size: 18, color: "4B5563" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function sectionTitle(title: string, note: string) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 40 },
      children: [run(title, { bold: true, size: 24, color: NAVY_HEX, allCaps: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [run(note, { italics: true, size: 17, color: "4B5563" })],
    }),
  ];
}

async function loadLogoPng(logoUrl: string): Promise<Uint8Array | undefined> {
  const url = logoUrl.trim();
  if (!url) {
    return undefined;
  }
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      const timer = window.setTimeout(() => reject(new Error("logo load timeout")), 2500);
      img.onload = () => {
        window.clearTimeout(timer);
        resolve(img);
      };
      img.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("logo load failed"));
      };
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    const width = isMseLogoUrl(url) ? 280 : 520;
    const cropBottom = isMseLogoUrl(url) ? 0 : 0.14;
    const sourceHeight = image.naturalHeight * (1 - cropBottom);
    const height = Math.max(80, Math.round((sourceHeight / Math.max(image.naturalWidth, 1)) * width));
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }
    ctx.drawImage(image, 0, 0, image.naturalWidth, sourceHeight, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) {
      return undefined;
    }
    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    return undefined;
  }
}

function letterheadChildren(data: CompanyProfileData, logoPng?: Uint8Array) {
  const contactLine = joinParts([data.phone, data.altPhone, data.email, data.website]);
  const statutoryLine = joinParts([
    data.gst ? `GST: ${data.gst}` : "",
    data.pan ? `PAN: ${data.pan}` : "",
    data.cin ? `CIN: ${data.cin}` : "",
  ]);
  const vendorLine = getLetterheadVendorLine(data.firm);
  const compact = isMseFirm(data.firm);
  const children: Array<Paragraph | Table> = [];
  if (logoPng) {
    const logoDims = compact ? { width: 95, height: 72 } : { width: 170, height: 108 };
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: compact ? 20 : 40, before: 0 },
        children: [
          new ImageRun({
            type: "png",
            data: logoPng,
            transformation: logoDims,
            altText: { title: "Logo", description: filledValue(data.legalName), name: "Logo" },
          }),
        ],
      }),
    );
  }
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: compact ? 16 : 40 },
      children: [run(filledValue(data.legalName), { bold: true, size: compact ? 28 : 32, color: NAVY_HEX, allCaps: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: compact ? 16 : 40 },
      children: [run(vendorLine, { bold: true, size: 18, color: "1F4E79" })],
    }),
  );
  if (data.address.trim()) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: compact ? 10 : 20 },
        children: [run(data.address, { size: 18, color: "374151" })],
      }),
    );
  }
  if (contactLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: compact ? 10 : 20 },
        children: [run(contactLine, { size: 18, color: "374151" })],
      }),
    );
  }
  if (statutoryLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [run(statutoryLine, { size: 17, color: "4B5563" })],
      }),
    );
  }
  children.push(colorBar(NAVY_HEX, 80), colorBar(GOLD_HEX, 60));
  return children;
}

function footerChildren(data: CompanyProfileData) {
  const line = joinParts([data.website, data.phone, data.email]);
  if (!line) {
    return [];
  }
  return [
    colorBar(GOLD_HEX, 60),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDERS,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: NO_BORDERS,
              shading: hexFill(NAVY_HEX),
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 0, before: 0 },
                  children: [run(line, { color: "FFFFFF", size: 17 })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];
}

function buildDocument(data: CompanyProfileData, logoPng?: Uint8Array) {
  const annexure = data.annexure;
  const body: FileChild[] = [
    ...sectionTitle(
      "Annexure 1 — Experience Certificate and Reference Details of Projects Executed",
      "(To be provided on Company letter head along with sign and stamp)",
    ),
    new Paragraph({ spacing: { after: 80 }, children: [run("Experience Details", { bold: true, size: 22, color: NAVY_HEX })] }),
    experienceTable(data, annexure),
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      spacing: { after: 120 },
      children: [run("Details and references of projects executed (2 references to be provided mandatory)", { bold: true, size: 22, color: NAVY_HEX })],
    }),
    referenceTable(annexure.references),
    new Paragraph({ spacing: { after: 80 }, children: [] }),
    signatureTable(data, annexure),
    new Paragraph({ spacing: { before: 200, after: 80 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D1D5DB" } }, children: [] }),
    ...sectionTitle("Annexure 2 — Consent Form for Bureau", "(To be provided on Company letter head along with sign and stamp)"),
    para("To,"),
    ...annexure.consentRecipient.split("\n").map((line, index, lines) =>
      new Paragraph({
        spacing: { after: index === lines.length - 1 ? 160 : 20 },
        children: [run(line || " ", { bold: true, size: 21 })],
      }),
    ),
    new Paragraph({
      alignment: AlignmentType.BOTH,
      spacing: { after: 200, line: 276 },
      children: [run(annexure.consentBody, { size: 21 })],
    }),
    signatureTable(data, annexure),
  ];

  return new Document({
    creator: data.legalName || (isMseFirm(data.firm) ? "Mahi Solar Energy" : "Mahi Solar Solution"),
    title: isMseFirm(data.firm) ? "MSE Empanelment Annexure" : "MSS Empanelment Annexure",
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertMillimetersToTwip(210),
              height: convertMillimetersToTwip(297),
            },
            margin: {
              top: convertMillimetersToTwip(12),
              right: convertMillimetersToTwip(16),
              bottom: convertMillimetersToTwip(16),
              left: convertMillimetersToTwip(16),
              header: convertMillimetersToTwip(8),
              footer: convertMillimetersToTwip(8),
            },
          },
        },
        headers: {
          default: new Header({ children: letterheadChildren(data, logoPng) }),
        },
        footers: {
          default: new Footer({ children: footerChildren(data) }),
        },
        children: body,
      },
    ],
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadAnnexureDocx(data: CompanyProfileData) {
  const logoPng = await loadLogoPng(data.logoUrl);
  const document = buildDocument(data, logoPng);
  const blob = await Packer.toBlob(document);
  const brand = isMseFirm(data.firm) ? "MSE" : "MSS";
  triggerDownload(blob, `${documentDownloadName("", "Empanelment Annexure", brand)}.docx`);
}
