import { Link } from "react-router-dom";
import { DiagramShellPane } from "../components/DiagramPane";
import { HemanthSiteDiagramSvg } from "../components/HemanthSiteDiagramSvg";
import {
  CIRCLE_DIA_FT,
  CYLINDER_HEIGHT_LABEL,
  PANEL_BRAND,
  PANEL_WP,
  formatPanelCapacityKw,
} from "../lib/build-hemanth-layout";
import { HEMANTH_LAYOUT_V2, HEMANTH_V2_META } from "../lib/hemanth-layout-v2";
import { HEMANTH_LAYOUT_V1, HEMANTH_V1_META } from "../lib/hemanth-snapshot-v1";
import { getSiteDiagramProject } from "../lib/site-diagram-projects";

const PROJECT = getSiteDiagramProject("hemanth-tanwani-90kw")!;

function hemanthPdfMeta(diagramTitle: string, panelCount: number) {
  return {
    projectName: PROJECT.name,
    diagramTitle,
    location: PROJECT.location,
    targetCapacity: PROJECT.capacityLabel,
    panelCount,
    panelCapacity: formatPanelCapacityKw(panelCount),
    panelBrand: PANEL_BRAND,
    panelWp: PANEL_WP,
  };
}

function Pane({
  title,
  status,
  layout,
  idPrefix,
  note,
}: {
  title: string;
  status: "editable" | "locked";
  layout: typeof HEMANTH_LAYOUT_V1;
  idPrefix: string;
  note: string;
}) {
  const panelCount = layout.roofPanels.length;
  const capacity = formatPanelCapacityKw(panelCount);
  return (
    <DiagramShellPane
      title={title}
      status={status}
      ariaLabel={`${PROJECT.name} ${title} site diagram`}
      pdfMeta={hemanthPdfMeta(title, panelCount)}
      summary={
        <>
          <strong>{panelCount}</strong> panels
          <span aria-hidden>·</span>
          <strong>{capacity}</strong>
          <span aria-hidden>·</span>
          {note}
        </>
      }
    >
      <HemanthSiteDiagramSvg
        layout={layout}
        idPrefix={idPrefix}
        ariaLabel={`${PROJECT.name} ${title} rooftop panel layout`}
      />
    </DiagramShellPane>
  );
}

export function HemanthTanwaniDiagramPage() {
  return (
    <div className="page-shell page-shell--site-diagram">
      <header className="maker-toolbar site-diagram-toolbar">
        <div className="maker-heading">
          <p className="eyebrow">
            <Link to="/site-diagram" className="site-diagram-back">
              Site Diagrams
            </Link>
            <span aria-hidden> / </span>
            {PROJECT.capacityLabel}
          </p>
          <h1>{PROJECT.name}</h1>
          <p className="site-diagram-note">
            {PROJECT.location} · Ø {CIRCLE_DIA_FT} ft × {CYLINDER_HEIGHT_LABEL} exhaust · {PANEL_BRAND}{" "}
            {PANEL_WP} Wp · {PROJECT.capacityLabel} target
          </p>
        </div>
      </header>

      <div className="site-diagram-stack">
        <Pane
          title={HEMANTH_V1_META.label}
          status="locked"
          layout={HEMANTH_LAYOUT_V1}
          idPrefix="hemanth-v1"
          note="locked N–S reference"
        />
        <Pane
          title={HEMANTH_V2_META.label}
          status="editable"
          layout={HEMANTH_LAYOUT_V2}
          idPrefix="hemanth-v2"
          note="walk 1 after row 1 · south N–S walk aligned"
        />
      </div>
    </div>
  );
}
