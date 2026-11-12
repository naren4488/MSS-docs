import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Eye,
  Handshake,
  Plug,
  Search,
  X,
} from "lucide-react";
import { Markdown } from "./Markdown";
import { plainText } from "../lib/parse-docs";
import type { ModuleInfo, StatusDoc } from "../lib/doc-models";

type DetailTab = "features" | "apis" | "review";

function apiTotal(modules: ModuleInfo[]): number {
  return modules.reduce((sum, module) => sum + (Number(/\d+/.exec(module.apiCount)?.[0]) || 0), 0);
}

function matches(text: string, query: string) {
  return plainText(text).toLowerCase().includes(query);
}

function StatTile({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="asw-stat">
      <span className="asw-stat-value">{value}</span>
      <span className="asw-stat-label">{label}</span>
      {hint ? <span className="asw-stat-hint">{hint}</span> : null}
    </div>
  );
}

function ChangesList({ changes }: { changes: string[] }) {
  const [open, setOpen] = useState(false);
  if (changes.length === 0) return null;
  const shown = open ? changes : changes.slice(0, 4);
  return (
    <section className="asw-card asw-changes">
      <header className="asw-card-head">
        <h3>Latest changes</h3>
        <span className="asw-count">{changes.length}</span>
      </header>
      <ol className="asw-changes-list">
        {shown.map((change, index) => (
          <li key={index}>
            <Markdown text={change} inline />
          </li>
        ))}
      </ol>
      {changes.length > 4 ? (
        <button type="button" className="asw-link-button" onClick={() => setOpen((value) => !value)}>
          {open ? "Show fewer" : `Show all ${changes.length} changes`}
          <ChevronDown size={14} className={open ? "asw-rotate" : ""} />
        </button>
      ) : null}
    </section>
  );
}

function ModuleDetail({ module, query }: { module: ModuleInfo; query: string }) {
  const [tab, setTab] = useState<DetailTab>("features");
  const groups = useMemo(() => {
    if (!query) return module.featureGroups;
    return module.featureGroups
      .map((group) =>
        matches(group.title, query)
          ? group
          : { ...group, items: group.items.filter((item) => matches(item, query)), note: matches(group.note, query) ? group.note : "" },
      )
      .filter((group) => group.items.length > 0 || group.note);
  }, [module, query]);

  return (
    <article className="asw-detail" aria-label={module.name}>
      <header className="asw-detail-head">
        <span className="asw-detail-num">{String(module.number).padStart(2, "0")}</span>
        <div className="asw-detail-titles">
          <h3>{module.name}</h3>
          {module.whatItDoes ? <p>{module.whatItDoes}</p> : null}
        </div>
      </header>

      <div className="asw-detail-facts">
        <span className={`asw-pill ${module.reviewed ? "asw-pill--done" : "asw-pill--open"}`}>
          {module.reviewed ? <CheckCircle2 size={13} /> : <CircleDot size={13} />}
          {module.reviewed ? `Reviewed ${module.reviewDate}` : "Not reviewed"}
        </span>
        <span className="asw-pill">{module.featureCount} features</span>
        {module.apiCount ? <span className="asw-pill">{module.apiCount} APIs</span> : null}
        {module.openItems.length > 0 ? <span className="asw-pill asw-pill--warn">{module.openItems.length} open</span> : null}
      </div>
      {module.screens ? (
        <p className="asw-detail-screens">
          <strong>Screens:</strong> {module.screens}
          {module.tables ? (
            <>
              {" "}
              · <strong>Tables:</strong> <Markdown text={module.tables} inline />
            </>
          ) : null}
        </p>
      ) : null}

      <div className="asw-segment" role="tablist" aria-label="Module sections">
        {(
          [
            ["features", "Features", Boxes],
            ["apis", "APIs", Plug],
            ["review", "Review status", CheckCircle2],
          ] as const
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`asw-segment-btn${tab === key ? " asw-segment-btn--on" : ""}`}
            onClick={() => setTab(key)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "features" ? (
        groups.length === 0 ? (
          <p className="asw-empty">No features in this module match “{query}”.</p>
        ) : (
          <div className="asw-feature-grid">
            {groups.map((group, index) => (
              <section key={`${group.title}-${index}`} className="asw-feature-card">
                <h4>
                  <Markdown text={group.title} inline highlight={query} />
                </h4>
                {group.note ? <Markdown text={group.note} className="asw-feature-note" highlight={query} /> : null}
                {group.items.length > 0 ? (
                  <ul>
                    {group.items.map((item, i) => (
                      <li key={i}>
                        <Markdown text={item} highlight={query} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        )
      ) : tab === "apis" ? (
        <div className="asw-prose asw-prose--api">
          <Markdown text={module.apis || "No API list for this module."} highlight={query} />
        </div>
      ) : (
        <div className="asw-review">
          {module.openItems.length > 0 ? (
            <section className="asw-open-box">
              <h4>Still open</h4>
              <ul>
                {module.openItems.map((item, i) => (
                  <li key={i}>
                    <Markdown text={item} inline highlight={query} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <div className="asw-prose">
            <Markdown text={module.reviewBody} highlight={query} />
          </div>
        </div>
      )}
    </article>
  );
}

export function StatusTab({ doc }: { doc: StatusDoc }) {
  const [rawQuery, setRawQuery] = useState("");
  const query = rawQuery.trim().toLowerCase();
  const [selectedId, setSelectedId] = useState(doc.modules[0]?.id ?? "");

  const visibleModules = useMemo(
    () => (query ? doc.modules.filter((module) => module.searchText.includes(query)) : doc.modules),
    [doc.modules, query],
  );
  const selected =
    visibleModules.find((module) => module.id === selectedId) ?? visibleModules[0] ?? null;

  const reviewed = doc.modules.filter((module) => module.reviewed).length;
  const features = doc.modules.reduce((sum, module) => sum + module.featureCount, 0);
  const openItems = doc.modules.reduce((sum, module) => sum + module.openItems.length, 0);
  const orderSteps = doc.reviewOrder.split("→").map((step) => step.trim().replace(/\.$/, "")).filter(Boolean);

  return (
    <div className="asw-tab">
      <section className="asw-hero">
        <div className="asw-hero-text">
          <p className="asw-eyebrow">Mahi Solar admin app</p>
          <h2>{doc.title}</h2>
          {doc.purpose ? <Markdown text={doc.purpose} className="asw-hero-lead" /> : null}
          <div className="asw-hero-meta">
            {doc.updatedDate ? <span className="asw-chip asw-chip--accent">Updated {doc.updatedDate}</span> : null}
            {doc.repos ? <Markdown text={doc.repos} inline className="asw-hero-repos" /> : null}
          </div>
        </div>
        <div className="asw-stats">
          <StatTile value={String(doc.modules.length)} label="Modules" />
          <StatTile value={`${reviewed}/${doc.modules.length}`} label="Reviewed" />
          <StatTile value={features.toLocaleString("en-IN")} label="Features listed" />
          <StatTile value={`~${apiTotal(doc.modules).toLocaleString("en-IN")}`} label="APIs" />
          <StatTile value={String(openItems)} label="Open points" hint="across modules" />
        </div>
      </section>

      <ChangesList changes={doc.changes} />

      <section className="asw-card asw-explorer">
        <header className="asw-explorer-head">
          <div>
            <h3>Module explorer</h3>
            <p className="asw-muted">Every screen, action and API of each module, with its review status.</p>
          </div>
          <label className="asw-search">
            <Search size={16} aria-hidden />
            <input
              type="search"
              placeholder="Search features, screens, APIs…"
              value={rawQuery}
              onChange={(event) => setRawQuery(event.target.value)}
              aria-label="Search modules"
            />
            {rawQuery ? (
              <button type="button" aria-label="Clear search" onClick={() => setRawQuery("")}>
                <X size={14} />
              </button>
            ) : null}
          </label>
        </header>

        {visibleModules.length === 0 ? (
          <p className="asw-empty">No module mentions “{rawQuery}”.</p>
        ) : (
          <div className="asw-explorer-body">
            <nav className="asw-module-list" aria-label="Modules">
              {visibleModules.map((module) => {
                const active = selected?.id === module.id;
                return (
                  <button
                    key={module.id}
                    type="button"
                    className={`asw-module-item${active ? " asw-module-item--on" : ""}`}
                    aria-current={active}
                    onClick={() => setSelectedId(module.id)}
                  >
                    <span className="asw-module-num">{module.number}</span>
                    <span className="asw-module-name">{module.name}</span>
                    <span className="asw-module-meta">
                      {module.featureCount}
                      <span className={`asw-dot ${module.reviewed ? "asw-dot--done" : ""}`} aria-label={module.reviewed ? "Reviewed" : "Not reviewed"} />
                    </span>
                  </button>
                );
              })}
            </nav>
            {selected ? <ModuleDetail key={selected.id} module={selected} query={query} /> : null}
          </div>
        )}
      </section>

      <div className="asw-two-col">
        {doc.agreements.length > 0 ? (
          <section className="asw-card">
            <header className="asw-card-head">
              <Handshake size={18} />
              <h3>{doc.agreementsTitle}</h3>
            </header>
            <div className="asw-agreements">
              {doc.agreements.map((item, i) => (
                <div key={i} className="asw-agreement">
                  <Markdown text={item} />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {doc.watchList.length > 0 ? (
          <section className="asw-card">
            <header className="asw-card-head">
              <Eye size={18} />
              <h3>Most likely to matter</h3>
            </header>
            {doc.tagLegend ? <Markdown text={doc.tagLegend} className="asw-legend" /> : null}
            <ul className="asw-watch">
              {doc.watchList.map((item, i) => (
                <li key={i}>
                  <Markdown text={item} inline />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {doc.reviewSteps.length > 0 ? (
        <section className="asw-card">
          <header className="asw-card-head">
            <CheckCircle2 size={18} />
            <h3>How each module is reviewed</h3>
          </header>
          <ol className="asw-steps">
            {doc.reviewSteps.map((step, i) => (
              <li key={i}>
                <span className="asw-step-num">{i + 1}</span>
                <Markdown text={step} inline />
              </li>
            ))}
          </ol>
          {orderSteps.length > 1 ? (
            <div className="asw-order" aria-label="Review order">
              {orderSteps.map((step, i) => (
                <span key={i} className="asw-order-step">
                  <span className="asw-chip">{step}</span>
                  {i < orderSteps.length - 1 ? <ArrowRight size={12} aria-hidden /> : null}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {doc.related && doc.related.rows.length > 0 ? (
        <section className="asw-card">
          <header className="asw-card-head">
            <BookOpen size={18} />
            <h3>Related documents</h3>
          </header>
          <div className="asw-docs-grid">
            {doc.related.rows.map((row, i) => (
              <div key={i} className="asw-doc">
                <Markdown text={row[0] ?? ""} inline className="asw-doc-name" />
                <Markdown text={row[1] ?? ""} inline className="asw-doc-about" />
              </div>
            ))}
          </div>
          <p className="asw-muted asw-small">These documents live in the admin app repositories.</p>
        </section>
      ) : null}
    </div>
  );
}
