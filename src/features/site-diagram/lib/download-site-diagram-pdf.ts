import { jsPDF } from "jspdf";
import "svg2pdf.js";
import { capacityFileLabel, documentDownloadName } from "@/lib/document-filename";

/** Longest PDF page edge in mm — keeps files manageable while staying vector-sharp when zoomed. */
const PDF_MAX_EDGE_MM = 1000;

/** Header band above the diagram for project / capacity details. */
const PDF_HEADER_MM = 72;
const PDF_MARGIN_MM = 8;

/** Solid stand-in for panel cell patterns (svg2pdf pattern support is unreliable). */
const PANEL_CELL_FILL = "#1d4ed8";

export type SiteDiagramPdfMeta = {
  projectName: string;
  diagramTitle: string;
  location?: string;
  /** Project target, e.g. "90 kW". */
  targetCapacity?: string;
  panelCount: number;
  /** Computed from panel count, e.g. "89.09 kW". */
  panelCapacity: string;
  panelBrand?: string;
  panelWp?: number;
};

function svgViewSize(svg: SVGSVGElement): { width: number; height: number } {
  const box = svg.viewBox.baseVal;
  if (box.width > 0 && box.height > 0) {
    return { width: box.width, height: box.height };
  }
  return {
    width: Math.max(1, svg.clientWidth || Number(svg.getAttribute("width")) || 1),
    height: Math.max(1, svg.clientHeight || Number(svg.getAttribute("height")) || 1),
  };
}

/** CSS px from getComputedStyle → SVG user units via the element's screen CTM. */
function screenPxToUserUnits(el: Element, px: number): number {
  if (!(el instanceof SVGGraphicsElement) || !Number.isFinite(px)) return px;
  const ctm = el.getScreenCTM();
  if (!ctm) return px;
  const scale = Math.hypot(ctm.a, ctm.b);
  if (scale < 1e-8) return px;
  return px / scale;
}

function parsePx(value: string): number | null {
  const match = value.trim().match(/^(-?[\d.]+)(px)?$/i);
  if (!match) return null;
  return Number(match[1]);
}

/** svg2pdf rejects many CSS color forms; normalize to rgb + *-opacity. */
function applyPaint(el: Element, prop: "fill" | "stroke", raw: string) {
  const value = raw.trim();
  if (!value || value === "none") {
    el.setAttribute(prop, "none");
    return;
  }

  if (/^url\(/i.test(value)) {
    el.setAttribute(prop, PANEL_CELL_FILL);
    el.removeAttribute(`${prop}-opacity`);
    return;
  }

  const rgba = value.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
  );
  if (rgba) {
    const [, r, g, b, a] = rgba;
    el.setAttribute(prop, `rgb(${Math.round(Number(r))}, ${Math.round(Number(g))}, ${Math.round(Number(b))})`);
    if (a != null && Number(a) < 1) {
      el.setAttribute(`${prop}-opacity`, String(Number(a)));
    } else {
      el.removeAttribute(`${prop}-opacity`);
    }
    return;
  }

  el.setAttribute(prop, value);
}

function fontWeightForPdf(value: string): string {
  const n = Number(value);
  if (value === "bold" || value === "bolder" || (Number.isFinite(n) && n >= 600)) return "bold";
  return "normal";
}

const PAINT_TAGS = new Set([
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "text",
  "tspan",
]);

function isWhitePaint(value: string | null): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  if (v === "#fff" || v === "#ffffff" || v === "white") return true;
  const rgb = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (!rgb) return false;
  return Number(rgb[1]) >= 250 && Number(rgb[2]) >= 250 && Number(rgb[3]) >= 250;
}

/**
 * svg2pdf corrupts SVG text stroke halos into white shards. Recreate the browser
 * look (dark fill + white outline) with offset white text copies behind the label.
 */
function expandTextHalosForPdf(svg: SVGSVGElement) {
  const texts = Array.from(svg.querySelectorAll("text"));
  const offsets: Array<[number, number]> = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const text of texts) {
    const stroke = text.getAttribute("stroke");
    const strokeWidth = Number(text.getAttribute("stroke-width") || 0);
    const parent = text.parentNode;
    if (!parent || !stroke || stroke === "none" || !(strokeWidth > 0)) {
      text.setAttribute("stroke", "none");
      text.removeAttribute("stroke-width");
      text.removeAttribute("paint-order");
      continue;
    }

    const haloFill = isWhitePaint(stroke) ? "#ffffff" : stroke;
    const step = strokeWidth * 0.42;
    const x = Number(text.getAttribute("x") || 0);
    const y = Number(text.getAttribute("y") || 0);

    for (const [ox, oy] of offsets) {
      const copy = text.cloneNode(true) as SVGTextElement;
      copy.setAttribute("fill", haloFill);
      copy.setAttribute("stroke", "none");
      copy.removeAttribute("stroke-width");
      copy.removeAttribute("paint-order");
      copy.setAttribute("x", String(x + ox * step));
      copy.setAttribute("y", String(y + oy * step));
      parent.insertBefore(copy, text);
    }

    text.setAttribute("stroke", "none");
    text.removeAttribute("stroke-width");
    text.removeAttribute("paint-order");
  }
}

function prepareSvgForPdf(source: SVGSVGElement): { host: HTMLDivElement; svg: SVGSVGElement } {
  const clone = source.cloneNode(true) as SVGSVGElement;
  const { width, height } = svgViewSize(source);

  clone.removeAttribute("class");
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.style.cssText = `width:${width}px;height:${height}px;display:block;`;

  const sources = [source, ...Array.from(source.querySelectorAll("*"))];
  const targets = [clone, ...Array.from(clone.querySelectorAll("*"))];

  for (let i = 0; i < sources.length; i += 1) {
    const src = sources[i];
    const dst = targets[i];
    if (!(src instanceof Element) || !(dst instanceof Element)) continue;

    const tag = src.tagName.toLowerCase();
    const computed = getComputedStyle(src);
    const isPaintTarget = PAINT_TAGS.has(tag) || tag === "g";

    if (isPaintTarget) {
      applyPaint(dst, "fill", computed.fill);

      // Keep author stroke on text (white halo) for expandTextHalosForPdf; shapes use computed.
      if (tag !== "text" && tag !== "tspan") {
        applyPaint(dst, "stroke", computed.stroke);
      }

      const fillOpacity = computed.fillOpacity;
      if (fillOpacity && fillOpacity !== "1" && !dst.hasAttribute("fill-opacity")) {
        dst.setAttribute("fill-opacity", fillOpacity);
      }

      const strokeOpacity = computed.strokeOpacity;
      if (strokeOpacity && strokeOpacity !== "1" && !dst.hasAttribute("stroke-opacity")) {
        dst.setAttribute("stroke-opacity", strokeOpacity);
      }

      const opacity = computed.opacity;
      if (opacity && opacity !== "1") {
        dst.setAttribute("opacity", opacity);
      }

      if (tag !== "text" && tag !== "tspan" && !dst.hasAttribute("stroke-width")) {
        const strokeWidthPx = parsePx(computed.strokeWidth);
        if (strokeWidthPx != null && strokeWidthPx > 0 && computed.stroke !== "none") {
          dst.setAttribute("stroke-width", String(screenPxToUserUnits(src, strokeWidthPx)));
        }
      }

      const lineCap = computed.strokeLinecap;
      if (lineCap && lineCap !== "butt") dst.setAttribute("stroke-linecap", lineCap);
      const lineJoin = computed.strokeLinejoin;
      if (lineJoin && lineJoin !== "miter") dst.setAttribute("stroke-linejoin", lineJoin);
    }

    if (tag === "text" || tag === "tspan") {
      if (!dst.hasAttribute("font-size")) {
        const fontSizePx = parsePx(computed.fontSize);
        if (fontSizePx != null && fontSizePx > 0) {
          dst.setAttribute("font-size", String(screenPxToUserUnits(src, fontSizePx)));
        }
      }

      dst.setAttribute("font-family", "Helvetica, Arial, sans-serif");
      dst.setAttribute("font-weight", fontWeightForPdf(computed.fontWeight || "normal"));

      if (computed.fontStyle && computed.fontStyle !== "normal") {
        dst.setAttribute("font-style", computed.fontStyle);
      }

      const textAnchor = computed.getPropertyValue("text-anchor").trim();
      if (textAnchor) dst.setAttribute("text-anchor", textAnchor);

      const dominantBaseline = computed.getPropertyValue("dominant-baseline").trim();
      if (dominantBaseline && dominantBaseline !== "auto") {
        dst.setAttribute("dominant-baseline", dominantBaseline);
      }
    }

    const attrFill = dst.getAttribute("fill");
    if (attrFill && /^url\(/i.test(attrFill)) {
      dst.setAttribute("fill", PANEL_CELL_FILL);
    }
  }

  expandTextHalosForPdf(clone);
  clone.querySelectorAll("pattern").forEach((node) => node.remove());

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed;left:-100000px;top:0;pointer-events:none;z-index:-1;margin:0;padding:0;border:0;";
  host.appendChild(clone);

  return { host, svg: clone };
}

function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim() || "Site Diagram";
}

function buildDetailLine(meta: SiteDiagramPdfMeta): string {
  const parts = [
    meta.diagramTitle,
    meta.location,
    meta.targetCapacity ? `target ${meta.targetCapacity}` : "",
    `${meta.panelCount} panels`,
    meta.panelCapacity,
    meta.panelBrand && meta.panelWp != null ? `${meta.panelBrand} ${meta.panelWp} Wp` : meta.panelBrand,
  ].filter(Boolean);
  return parts.join(" · ");
}

function siteDiagramPdfFilename(meta: SiteDiagramPdfMeta): string {
  const kw = capacityFileLabel(meta.panelCapacity) || capacityFileLabel(meta.targetCapacity ?? "");
  const subject = [meta.projectName, kw, `${meta.panelCount} panels`, meta.diagramTitle]
    .filter(Boolean)
    .join(" ");
  return `${sanitizeFilename(documentDownloadName(subject, "Site Diagram"))}.pdf`;
}

function drawPdfHeader(doc: jsPDF, meta: SiteDiagramPdfMeta, pageW: number) {
  const left = PDF_MARGIN_MM;
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageW, PDF_HEADER_MM, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(0, PDF_HEADER_MM, pageW, PDF_HEADER_MM);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.text(meta.projectName, left, 26);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(22);
  doc.setTextColor(51, 65, 85);
  const detail = buildDetailLine(meta);
  const wrapped = doc.splitTextToSize(detail, pageW - PDF_MARGIN_MM * 2);
  doc.text(wrapped, left, 46);
}

/** Vector PDF from the live SVG — paths stay vectors so PDF zoom stays crisp. */
export async function downloadSiteDiagramPdf(
  svg: SVGSVGElement,
  labelOrMeta: string | SiteDiagramPdfMeta,
): Promise<void> {
  const meta: SiteDiagramPdfMeta =
    typeof labelOrMeta === "string"
      ? {
          projectName: labelOrMeta,
          diagramTitle: labelOrMeta,
          panelCount: 0,
          panelCapacity: "",
        }
      : labelOrMeta;

  const { host, svg: prepared } = prepareSvgForPdf(svg);
  document.body.appendChild(host);

  try {
    const { width: vbW, height: vbH } = svgViewSize(prepared);
    const contentMax = PDF_MAX_EDGE_MM - PDF_HEADER_MM;
    const scale = contentMax / Math.max(vbW, vbH);
    const diagramW = vbW * scale;
    const diagramH = vbH * scale;
    const pageW = Math.max(diagramW, 120);
    const pageH = PDF_HEADER_MM + diagramH;

    const doc = new jsPDF({
      orientation: pageW >= pageH ? "landscape" : "portrait",
      unit: "mm",
      format: [pageW, pageH],
      compress: true,
    });

    drawPdfHeader(doc, meta, pageW);
    const diagramX = (pageW - diagramW) / 2;
    await doc.svg(prepared, { x: diagramX, y: PDF_HEADER_MM, width: diagramW, height: diagramH });

    doc.save(siteDiagramPdfFilename(meta));
  } finally {
    host.remove();
  }
}
