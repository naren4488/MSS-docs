import { Link } from "react-router-dom";
import { DiagramPane } from "../components/DiagramPane";
import {
  CIRCLE_DIA_FT,
  CYLINDER_HEIGHT_LABEL,
  PANEL_BRAND,
  PANEL_WP,
  WORKING_SITE_LAYOUT,
  formatPanelCapacityKw,
} from "../lib/build-site-layout";
import { getSiteDiagramProject } from "../lib/site-diagram-projects";
import { SAVED_SITE_LAYOUT_V1, SAVED_SNAPSHOT_META } from "../lib/site-diagram-snapshot-v1";

const PROJECT = getSiteDiagramProject("mukesh-kumawat-80kw")!;

function mukeshPdfMeta(diagramTitle: string, panelCount: number) {
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

export function MukeshKumawatDiagramPage() {
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
        <DiagramPane
          title="Working"
          status="editable"
          layout={WORKING_SITE_LAYOUT}
          ariaLabel={`${PROJECT.name} working site diagram`}
          idPrefix="mukesh-working"
          pdfMeta={mukeshPdfMeta("Working", WORKING_SITE_LAYOUT.roofPanels.length)}
        />
        <DiagramPane
          title={SAVED_SNAPSHOT_META.label}
          status="locked"
          layout={SAVED_SITE_LAYOUT_V1}
          ariaLabel={`${PROJECT.name} max panels site diagram`}
          idPrefix="mukesh-saved-v1"
          pdfMeta={mukeshPdfMeta(SAVED_SNAPSHOT_META.label, SAVED_SITE_LAYOUT_V1.roofPanels.length)}
        />
      </div>
    </div>
  );
}
