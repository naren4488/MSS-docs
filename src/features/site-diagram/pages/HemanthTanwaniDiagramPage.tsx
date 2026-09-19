import { Link } from "react-router-dom";
import { DiagramShellPane } from "../components/DiagramPane";
import { HemanthSiteDiagramSvg } from "../components/HemanthSiteDiagramSvg";
import {
  CIRCLE_DIA_FT,
  CYLINDER_HEIGHT_LABEL,
  PANEL_BRAND,
  PANEL_WP,
  WORKING_HEMANTH_LAYOUT,
  formatPanelCapacityKw,
} from "../lib/build-hemanth-layout";
import { getSiteDiagramProject } from "../lib/site-diagram-projects";

const PROJECT = getSiteDiagramProject("hemanth-tanwani-90kw")!;

export function HemanthTanwaniDiagramPage() {
  const panelCount = WORKING_HEMANTH_LAYOUT.roofPanels.length;
  const capacity = formatPanelCapacityKw(panelCount);

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
        <DiagramShellPane
          title="Working"
          status="editable"
          ariaLabel={`${PROJECT.name} working site diagram`}
          pdfMeta={{
            projectName: PROJECT.name,
            diagramTitle: "Working",
            location: PROJECT.location,
            targetCapacity: PROJECT.capacityLabel,
            panelCount,
            panelCapacity: capacity,
            panelBrand: PANEL_BRAND,
            panelWp: PANEL_WP,
          }}
          summary={
            <>
              <strong>{panelCount}</strong> panels
              <span aria-hidden>·</span>
              <strong>{capacity}</strong>
              <span aria-hidden>·</span>
              mid walk west of 6th-from-east
            </>
          }
        >
          <HemanthSiteDiagramSvg
            layout={WORKING_HEMANTH_LAYOUT}
            idPrefix="hemanth-working"
            ariaLabel={`${PROJECT.name} rooftop panel layout`}
          />
        </DiagramShellPane>
      </div>
    </div>
  );
}
