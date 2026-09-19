import { Download, Lock, Maximize2, Minus, Pencil, Plus, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PANEL_BRAND, PANEL_WP, formatPanelCapacityKw, type SiteLayout } from "../lib/build-site-layout";
import { downloadSiteDiagramPdf, type SiteDiagramPdfMeta } from "../lib/download-site-diagram-pdf";
import { SiteDiagramSvg } from "./SiteDiagramSvg";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 1;

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(value * 100) / 100));
}

export function DiagramPane({
  title,
  status,
  layout,
  ariaLabel,
  idPrefix,
  pdfMeta,
}: {
  title: string;
  status: "editable" | "locked";
  layout: SiteLayout;
  ariaLabel: string;
  idPrefix: string;
  pdfMeta: SiteDiagramPdfMeta;
}) {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panelCount = layout.roofPanels.length;
  const capacity = formatPanelCapacityKw(panelCount);
  const StatusIcon = status === "locked" ? Lock : Pencil;

  const applyZoom = useCallback((nextZoom: number) => {
    setZoom(clampZoom(nextZoom));
  }, []);

  const fitZoom = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      setZoom(ZOOM_DEFAULT);
      return;
    }
    const svg = viewport.querySelector("svg");
    if (!(svg instanceof SVGSVGElement)) {
      setZoom(ZOOM_DEFAULT);
      return;
    }
    const box = svg.viewBox.baseVal;
    const aspect = box.height / Math.max(1, box.width);
    const availW = Math.max(1, viewport.clientWidth - 32);
    const availH = Math.max(1, viewport.clientHeight - 32);
    const need = Math.min(1, availH / (availW * aspect));
    setZoom(clampZoom(need));
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
  }, []);

  return (
    <section className={`site-diagram-pane site-diagram-pane--${status}`} aria-label={ariaLabel}>
      <div className="site-diagram-pane__bar">
        <div className="site-diagram-pane__bar-left">
          <h2>{title}</h2>
          <span className={`site-diagram-pane__badge site-diagram-pane__badge--${status}`}>
            <StatusIcon size={12} aria-hidden />
            {status === "locked" ? "Locked" : "Editable"}
          </span>
          <p className="site-diagram-pane__summary">
            <strong>{panelCount}</strong> panels
            <span aria-hidden>·</span>
            <strong>{capacity}</strong>
            <span aria-hidden>·</span>
            {PANEL_BRAND} {PANEL_WP} Wp
          </p>
        </div>
        <ZoomControls
          title={title}
          zoom={zoom}
          onZoom={applyZoom}
          onFit={fitZoom}
          onDownload={() => {
            const svg = viewportRef.current?.querySelector("svg");
            if (svg instanceof SVGSVGElement) {
              return downloadSiteDiagramPdf(svg, {
                ...pdfMeta,
                diagramTitle: title,
                panelCount,
                panelCapacity: capacity,
              });
            }
            return Promise.reject(new Error("Diagram SVG not found"));
          }}
        />
      </div>

      <div
        className="site-diagram-viewport"
        ref={viewportRef}
        style={{ "--site-diagram-zoom": zoom } as CSSProperties}
      >
        <div className="site-diagram-zoom-stage">
          <SiteDiagramSvg layout={layout} idPrefix={idPrefix} />
        </div>
      </div>
    </section>
  );
}

export function DiagramShellPane({
  title,
  status,
  ariaLabel,
  summary,
  pdfMeta,
  children,
}: {
  title: string;
  status: "editable" | "locked";
  ariaLabel: string;
  summary: ReactNode;
  pdfMeta: SiteDiagramPdfMeta;
  children: ReactNode;
}) {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const viewportRef = useRef<HTMLDivElement>(null);
  const StatusIcon = status === "locked" ? Lock : Pencil;

  const applyZoom = useCallback((nextZoom: number) => {
    setZoom(clampZoom(nextZoom));
  }, []);

  const fitZoom = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      setZoom(ZOOM_DEFAULT);
      return;
    }
    const svg = viewport.querySelector("svg");
    if (!(svg instanceof SVGSVGElement)) {
      setZoom(ZOOM_DEFAULT);
      return;
    }
    const box = svg.viewBox.baseVal;
    const aspect = box.height / Math.max(1, box.width);
    const availW = Math.max(1, viewport.clientWidth - 32);
    const availH = Math.max(1, viewport.clientHeight - 32);
    const need = Math.min(1, availH / (availW * aspect));
    setZoom(clampZoom(need));
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
  }, []);

  return (
    <section className={`site-diagram-pane site-diagram-pane--${status}`} aria-label={ariaLabel}>
      <div className="site-diagram-pane__bar">
        <div className="site-diagram-pane__bar-left">
          <h2>{title}</h2>
          <span className={`site-diagram-pane__badge site-diagram-pane__badge--${status}`}>
            <StatusIcon size={12} aria-hidden />
            {status === "locked" ? "Locked" : "Editable"}
          </span>
          <p className="site-diagram-pane__summary">{summary}</p>
        </div>
        <ZoomControls
          title={title}
          zoom={zoom}
          onZoom={applyZoom}
          onFit={fitZoom}
          onDownload={() => {
            const svg = viewportRef.current?.querySelector("svg");
            if (svg instanceof SVGSVGElement) {
              return downloadSiteDiagramPdf(svg, { ...pdfMeta, diagramTitle: title });
            }
            return Promise.reject(new Error("Diagram SVG not found"));
          }}
        />
      </div>

      <div
        className="site-diagram-viewport"
        ref={viewportRef}
        style={{ "--site-diagram-zoom": zoom } as CSSProperties}
      >
        <div className="site-diagram-zoom-stage">{children}</div>
      </div>
    </section>
  );
}

export function DiagramPlaceholderPane({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="site-diagram-pane site-diagram-pane--editable" aria-label={title}>
      <div className="site-diagram-pane__bar">
        <div className="site-diagram-pane__bar-left">
          <h2>{title}</h2>
          <span className="site-diagram-pane__badge site-diagram-pane__badge--editable">
            <Pencil size={12} aria-hidden />
            Draft
          </span>
        </div>
      </div>
      <div className="site-diagram-placeholder">{children}</div>
    </section>
  );
}

function ZoomControls({
  title,
  zoom,
  onZoom,
  onFit,
  onDownload,
}: {
  title: string;
  zoom: number;
  onZoom: (next: number) => void;
  onFit: () => void;
  onDownload: () => Promise<void>;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await onDownload();
    } catch (error) {
      console.error("Site diagram PDF download failed", error);
      window.alert("Could not download this diagram as PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [downloading, onDownload]);

  return (
    <div className="site-diagram-zoom" role="group" aria-label={`${title} zoom`}>
      <button
        className="icon-button"
        type="button"
        onClick={() => onZoom(zoom - ZOOM_STEP)}
        disabled={zoom <= ZOOM_MIN}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <Minus size={16} aria-hidden />
      </button>
      <span className="site-diagram-zoom__value">{Math.round(zoom * 100)}%</span>
      <button
        className="icon-button"
        type="button"
        onClick={() => onZoom(zoom + ZOOM_STEP)}
        disabled={zoom >= ZOOM_MAX}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <Plus size={16} aria-hidden />
      </button>
      <button
        className="icon-button"
        type="button"
        onClick={onFit}
        aria-label="Fit diagram to view"
        title="Fit to view"
      >
        <Maximize2 size={16} aria-hidden />
      </button>
      <button
        className="icon-button"
        type="button"
        onClick={() => onZoom(ZOOM_DEFAULT)}
        disabled={zoom === ZOOM_DEFAULT}
        aria-label="Reset zoom"
        title="Reset zoom"
      >
        <RotateCcw size={16} aria-hidden />
      </button>
      <button
        className="icon-button"
        type="button"
        onClick={() => void handleDownload()}
        disabled={downloading}
        aria-label="Download diagram as vector PDF"
        title={downloading ? "Preparing PDF…" : "Download vector PDF"}
      >
        <Download size={16} aria-hidden />
      </button>
    </div>
  );
}
