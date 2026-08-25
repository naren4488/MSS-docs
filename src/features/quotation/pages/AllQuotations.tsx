import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DEFAULT_QUOTATION_TEMPLATE_ID,
  formatTemplateInr,
  QUOTATION_TEMPLATES,
  templateNetPayable,
  type QuotationTemplateMeta,
} from "../lib/quotation-templates";

function PackageCard({ template }: { template: QuotationTemplateMeta }) {
  const isDefault = template.id === DEFAULT_QUOTATION_TEMPLATE_ID;
  const net = templateNetPayable(template);
  const phaseLabel = template.phase === "3PH" ? "Three phase" : "Single phase";

  return (
    <Link
      className={`quotation-package-card quotation-package-card--${template.phase.toLowerCase()}${isDefault ? " quotation-package-card--default" : ""}`}
      to={`/quotation?template=${template.id}`}
    >
      <div className="quotation-package-card-top">
        <div className="quotation-package-card-title-row">
          <h3>{template.capacity}</h3>
          <span className={`quotation-phase-badge quotation-phase-badge--${template.phase.toLowerCase()}`}>
            {template.phase}
          </span>
        </div>
        <div className="quotation-package-card-sub">
          <p className="quotation-package-card-phase">{phaseLabel}</p>
          {isDefault ? <span className="quotation-package-card-default">Default</span> : null}
        </div>
      </div>

      <dl className="quotation-package-card-pricing">
        <div>
          <dt>Project cost</dt>
          <dd>{formatTemplateInr(template.projectAmount)}</dd>
        </div>
        <div className="quotation-package-card-net">
          <dt>After subsidy</dt>
          <dd>{formatTemplateInr(net)}</dd>
        </div>
      </dl>

      <div className="quotation-package-card-meta">
        <span>
          {template.panels} × {template.wp}W panels
        </span>
        <span className="quotation-package-card-cta">
          Open <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function AllQuotations() {
  const singlePhase = QUOTATION_TEMPLATES.filter((t) => t.phase === "1PH");
  const threePhase = QUOTATION_TEMPLATES.filter((t) => t.phase === "3PH");

  return (
    <div className="page-shell">
      <div className="maker-toolbar" style={{ marginBottom: 28 }}>
        <div className="maker-heading">
          <p className="eyebrow">Quotations</p>
          <h1>PM SURYA GHAR packages</h1>
          <p>
            MNRE ₹78,000 + state ₹17,000 · generation savings at ₹8/unit.{" "}
            <strong>New Quotation</strong> opens the 3 KW single-phase package.
          </p>
        </div>
        <Link className="primary-button" to={`/quotation?template=${DEFAULT_QUOTATION_TEMPLATE_ID}`}>
          <Zap size={16} />
          New Quotation
        </Link>
      </div>

      <section className="quotation-package-section">
        <header className="quotation-package-section-header">
          <h2>Single phase</h2>
          <p className="muted-text">1PH packages</p>
        </header>
        <div className="quotation-package-grid">
          {singlePhase.map((template) => (
            <PackageCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="quotation-package-section">
        <header className="quotation-package-section-header">
          <h2>Three phase</h2>
          <p className="muted-text">3PH packages</p>
        </header>
        <div className="quotation-package-grid">
          {threePhase.map((template) => (
            <PackageCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </div>
  );
}
