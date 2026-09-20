import { ArrowRight, BatteryCharging, Building2, Zap } from "lucide-react";
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

function CommercialCard({ template }: { template: QuotationTemplateMeta }) {
  const priced = Boolean(template.projectAmount.trim());

  return (
    <Link className="quotation-package-card quotation-package-card--commercial" to={`/quotation?template=${template.id}`}>
      <div className="quotation-package-card-top">
        <div className="quotation-package-card-title-row">
          <h3>{template.label}</h3>
          <span className="quotation-phase-badge quotation-phase-badge--commercial">No subsidy</span>
        </div>
        <div className="quotation-package-card-sub">
          <p className="quotation-package-card-phase">
            {priced
              ? `Commercial rooftop · ${template.capacity} ${template.phase}`
              : `Commercial rooftop · starts at ${template.capacity} ${template.phase}`}
          </p>
        </div>
      </div>

      {priced ? (
        <dl className="quotation-package-card-pricing">
          <div>
            <dt>Project cost</dt>
            <dd>{formatTemplateInr(template.projectAmount)}</dd>
          </div>
          <div className="quotation-package-card-net">
            <dt>Customer payable</dt>
            <dd>{formatTemplateInr(template.projectAmount)}</dd>
          </div>
        </dl>
      ) : (
        <p className="quotation-package-card-copy">
          Same MSS layout with commercial defaults: site summary extras, grid-tie BOM sized to plant kW, turnkey EPC
          price with DISCOM extra as actual, 30-day validity. No PM Surya Ghar subsidy.
        </p>
      )}

      <div className="quotation-package-card-meta">
        <span>
          {template.panels} × {template.wp}W {template.moduleBrand ? template.moduleBrand.split(" ")[0] : "starter BOM"}
        </span>
        <span className="quotation-package-card-cta">
          Open <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

function OffgridCard({ template }: { template: QuotationTemplateMeta }) {
  return (
    <Link className="quotation-package-card quotation-package-card--offgrid" to={`/quotation?template=${template.id}`}>
      <div className="quotation-package-card-top">
        <div className="quotation-package-card-title-row">
          <h3>{template.label}</h3>
          <span className="quotation-phase-badge quotation-phase-badge--offgrid">No subsidy</span>
        </div>
        <div className="quotation-package-card-sub">
          <p className="quotation-package-card-phase">
            Standalone plant · {template.capacity} · ₹{Number(template.projectAmount).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <p className="quotation-package-card-copy">
        Devandra Ji · 5 × Waaree 590 Wp Topcon Bifacial, Microtek 5.1 kW off-grid PCU, 5 × Luminous 12V 220 Ah
        tubular. No phase, earthing, LA, AC cable, AC/DC DB, solar meter, or subsidy.
      </p>

      <div className="quotation-package-card-meta">
        <span>
          {template.panels} × {template.wp}W · {template.batteries ?? 5} × 220Ah
        </span>
        <span className="quotation-package-card-cta">
          Open <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function AllQuotations() {
  const residential = QUOTATION_TEMPLATES.filter((t) => t.kind === "residential");
  const commercial = QUOTATION_TEMPLATES.filter((t) => t.kind === "commercial");
  const offgrid = QUOTATION_TEMPLATES.filter((t) => t.kind === "offgrid");
  const singlePhase = residential.filter((t) => t.phase === "1PH");
  const threePhase = residential.filter((t) => t.phase === "3PH");

  return (
    <div className="page-shell">
      <div className="maker-toolbar" style={{ marginBottom: 28 }}>
        <div className="maker-heading">
          <p className="eyebrow">Quotations</p>
          <h1>Packages</h1>
          <p>
            PM SURYA GHAR residential packages include MNRE ₹78,000 + state ₹17,000. Commercial and off-grid quotes
            have no subsidy. Off-grid 3 kW package is ₹2,60,000. <strong>New Quotation</strong> opens the 3 KW single-phase
            package.
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
          <p className="muted-text">PM SURYA GHAR · 1PH</p>
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
          <p className="muted-text">PM SURYA GHAR · 3PH</p>
        </header>
        <div className="quotation-package-grid">
          {threePhase.map((template) => (
            <PackageCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="quotation-package-section">
        <header className="quotation-package-section-header">
          <Building2 size={18} aria-hidden />
          <h2>Commercial</h2>
          <p className="muted-text">No subsidy</p>
        </header>
        <div className="quotation-package-grid">
          {commercial.map((template) => (
            <CommercialCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      <section className="quotation-package-section">
        <header className="quotation-package-section-header">
          <BatteryCharging size={18} aria-hidden />
          <h2>Off-grid</h2>
          <p className="muted-text">₹2,60,000 · 3 kW · no subsidy</p>
        </header>
        <div className="quotation-package-grid">
          {offgrid.map((template) => (
            <OffgridCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </div>
  );
}
