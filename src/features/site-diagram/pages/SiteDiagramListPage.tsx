import { ArrowRight, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE_DIAGRAM_PROJECTS } from "../lib/site-diagram-projects";

export function SiteDiagramListPage() {
  return (
    <div className="page-shell">
      <div className="maker-heading" style={{ marginBottom: 20 }}>
        <p className="eyebrow">
          <Map size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
          Site Planning
        </p>
        <h1>Site Diagrams</h1>
        <p className="muted-text" style={{ marginBottom: 0 }}>
          Rooftop layout studies by project
        </p>
      </div>

      <div className="site-diagram-project-grid">
        {SITE_DIAGRAM_PROJECTS.map((project) => (
          <Link
            key={project.id}
            className="site-diagram-project-card"
            to={`/site-diagram/${project.id}`}
          >
            <div className="site-diagram-project-card__icon" aria-hidden>
              <Map size={20} />
            </div>
            <div className="site-diagram-project-card__body">
              <div className="site-diagram-project-card__title-row">
                <h2>{project.name}</h2>
                <span
                  className={`site-diagram-project-card__badge site-diagram-project-card__badge--${project.status}`}
                >
                  {project.status === "ready" ? "Ready" : "Draft"}
                </span>
              </div>
              <p className="site-diagram-project-card__capacity">{project.capacityLabel} project</p>
              <p className="site-diagram-project-card__summary">
                {project.location} · {project.summary}
              </p>
            </div>
            <span className="site-diagram-project-card__cta">
              Open <ArrowRight size={14} aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
