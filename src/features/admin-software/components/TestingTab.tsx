import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  FlaskConical,
  Hand,
  Layers,
  ListChecks,
  MonitorSmartphone,
  RotateCcw,
  Search,
  Server,
  Settings2,
  X,
} from "lucide-react";
import { Markdown } from "./Markdown";
import { plainText } from "../lib/parse-docs";
import type { CheckRow, ModuleTest, TestingDoc } from "../lib/doc-models";

type Section = "modules" | "checklist" | "across" | "how";

const STORAGE_KEY = "mss-admin-software-hand-checks-v2";

function loadTicks(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveTicks(ticks: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ticks]));
  } catch {
    /* private mode — ticks last for this visit only */
  }
}

function level(percent: number): "high" | "mid" | "low" {
  if (percent >= 85) return "high";
  if (percent >= 75) return "mid";
  return "low";
}

function Ring({ percent, size = 132, label }: { percent: number; size?: number; label?: string }) {
  const stroke = size * 0.11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg className="asw-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${percent}% ${label ?? "complete"}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="asw-ring-track" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="asw-ring-value"
        strokeDasharray={`${(percent / 100) * c} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" className="asw-ring-num" fontSize={size * 0.26}>
        {percent}%
      </text>
      {label ? (
        <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" className="asw-ring-label" fontSize={size * 0.1}>
          {label}
        </text>
      ) : null}
    </svg>
  );
}

function ProgressBar({ done, total, label }: { done: number; total: number; label?: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="asw-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span className="asw-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function CheckItem({
  row,
  ticked,
  onToggle,
  highlight,
}: {
  row: CheckRow;
  ticked: boolean;
  onToggle: (id: string) => void;
  highlight: string;
}) {
  return (
    <li className={`asw-check${ticked ? " asw-check--done" : ""}`}>
      <label className="asw-check-box">
        <input type="checkbox" checked={ticked} onChange={() => onToggle(row.id)} aria-label={`Done: ${plainText(row.text)}`} />
        <span aria-hidden className="asw-check-mark">
          <CheckCircle2 size={18} />
        </span>
      </label>
      <div className="asw-check-body">
        <Markdown text={row.text} className="asw-check-what" highlight={highlight} />
      </div>
    </li>
  );
}

function HandList({
  rows,
  ticks,
  onToggle,
  highlight,
}: {
  rows: CheckRow[];
  ticks: Set<string>;
  onToggle: (id: string) => void;
  highlight: string;
}) {
  const kinds = [...new Set(rows.map((row) => row.kind))];
  return (
    <>
      {kinds.map((kind) => {
        const kindRows = rows.filter((row) => row.kind === kind);
        return (
          <div key={kind || "all"} className="asw-hand-kind">
            {kind ? (
              <p className={`asw-hand-kind-label${/edge/i.test(kind) ? " asw-hand-kind-label--edge" : ""}`}>
                {kind} <span>{kindRows.length}</span>
              </p>
            ) : null}
            <ul className="asw-checks">
              {kindRows.map((row) => (
                <CheckItem key={row.id} row={row} ticked={ticks.has(row.id)} onToggle={onToggle} highlight={highlight} />
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

function ModuleTestDetail({
  module,
  ticks,
  onToggle,
}: {
  module: ModuleTest;
  ticks: Set<string>;
  onToggle: (id: string) => void;
}) {
  const done = module.handChecks.filter((row) => ticks.has(row.id)).length;
  const apiChips = module.tests.filter((chip) => !chip.screen);
  const screenChips = module.tests.filter((chip) => chip.screen);
  return (
    <article className="asw-detail" aria-label={module.name}>
      <header className="asw-detail-head asw-detail-head--ring">
        <Ring percent={module.percent} size={86} label="done" />
        <div className="asw-detail-titles">
          <p className="asw-detail-kicker">Module {module.number}</p>
          <h3>{module.name}</h3>
          {module.status ? <Markdown text={module.status} className="asw-detail-status" /> : null}
        </div>
      </header>

      <div className="asw-tt-grid">
        <section className="asw-tt-card asw-tt-card--done">
          <h4>
            <CheckCircle2 size={16} /> Done
          </h4>
          <ul>
            {module.done.map((item, i) => (
              <li key={i}>
                <Markdown text={item} inline />
              </li>
            ))}
          </ul>
        </section>
        <section className="asw-tt-card asw-tt-card--pending">
          <h4>
            <Clock3 size={16} /> Pending
          </h4>
          {module.pending.length === 0 ? (
            <p className="asw-muted">Nothing listed.</p>
          ) : (
            <ul>
              {module.pending.map((item, i) => (
                <li key={i}>
                  <Markdown text={item} inline />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {module.tests.length > 0 || module.testsText ? (
        <section className="asw-tt-tests">
          <h4>
            <FlaskConical size={16} /> Automatic tests
          </h4>
          {apiChips.length > 0 ? (
            <div className="asw-tt-chiprow">
              <span className="asw-tt-chiplabel">
                <Server size={13} /> API
              </span>
              {apiChips.map((chip) => (
                <span key={chip.name} className="asw-chip asw-chip--pass">
                  {chip.name}
                  {chip.count ? <strong>{chip.count}</strong> : null}
                </span>
              ))}
            </div>
          ) : null}
          {screenChips.length > 0 ? (
            <div className="asw-tt-chiprow">
              <span className="asw-tt-chiplabel">
                <MonitorSmartphone size={13} /> Screens
              </span>
              {screenChips.map((chip) => (
                <span key={chip.name} className="asw-chip asw-chip--pass">
                  {chip.name}
                  {chip.count ? <strong>{chip.count}</strong> : null}
                </span>
              ))}
            </div>
          ) : null}
          {module.tests.length === 0 ? <Markdown text={module.testsText} /> : null}
        </section>
      ) : null}

      {module.extra.map((extra) => (
        <section key={extra.label} className="asw-tt-tests">
          <h4>{extra.label}</h4>
          <ul>
            {extra.items.map((item, i) => (
              <li key={i}>
                <Markdown text={item} inline />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {module.handChecks.length > 0 ? (
        <section className="asw-tt-hand">
          <header>
            <h4>
              <Hand size={16} /> Test by hand
            </h4>
            <span className="asw-group-count">
              {done}/{module.handChecks.length}
            </span>
            <ProgressBar done={done} total={module.handChecks.length} label="Hand tests ticked" />
          </header>
          <HandList rows={module.handChecks} ticks={ticks} onToggle={onToggle} highlight="" />
        </section>
      ) : null}
    </article>
  );
}

export function TestingTab({ doc }: { doc: TestingDoc }) {
  const [section, setSection] = useState<Section>("modules");
  const [ticks, setTicks] = useState<Set<string>>(() => loadTicks());
  const [selectedId, setSelectedId] = useState(doc.modules[0]?.id ?? "");
  const [rawQuery, setRawQuery] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(doc.modules.slice(0, 1).map((m) => m.id)));
  const query = rawQuery.trim().toLowerCase();

  useEffect(() => saveTicks(ticks), [ticks]);

  const toggleTick = useCallback((id: string) => {
    setTicks((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allIds = useMemo(() => doc.modules.flatMap((m) => m.handChecks.map((row) => row.id)), [doc.modules]);
  const doneCount = allIds.filter((id) => ticks.has(id)).length;
  const selected = doc.modules.find((m) => m.id === selectedId) ?? doc.modules[0];
  const pendingCount = doc.modules.reduce((sum, m) => sum + m.pending.length, 0);
  const autoSuites = doc.modules.reduce((sum, m) => sum + m.tests.length, 0);

  const sections: Array<[Section, string, typeof ListChecks, string]> = [
    ["modules", "Modules", Layers, String(doc.modules.length)],
    ["checklist", "Hand-test checklist", ListChecks, `${doneCount}/${allIds.length}`],
    ["across", "Across all modules", Layers, String(doc.across.length)],
    ["how", "How tests run", Settings2, String(doc.how.length)],
  ];

  return (
    <div className="asw-tab">
      <section className="asw-hero asw-hero--testing">
        <div className="asw-hero-text">
          <p className="asw-eyebrow">Mahi Solar admin app</p>
          <h2>{doc.title}</h2>
          {doc.whatThisIs ? <Markdown text={doc.whatThisIs} className="asw-hero-lead" /> : null}
          <div className="asw-hero-meta">
            {doc.updatedDate ? <span className="asw-chip asw-chip--accent">Updated {doc.updatedDate}</span> : null}
          </div>
        </div>
        <div className="asw-hero-side">
          <Ring percent={doc.overallPercent} label="complete" />
          <div className="asw-stats asw-stats--tight">
            <div className="asw-stat">
              <span className="asw-stat-value">{pendingCount}</span>
              <span className="asw-stat-label">Pending points</span>
            </div>
            <div className="asw-stat">
              <span className="asw-stat-value">{autoSuites}</span>
              <span className="asw-stat-label">Test suites named</span>
            </div>
            <div className="asw-stat">
              <span className="asw-stat-value">
                {doneCount}
                <small>/{allIds.length}</small>
              </span>
              <span className="asw-stat-label">Hand tests ticked</span>
              <ProgressBar done={doneCount} total={allIds.length} label="Your progress" />
            </div>
          </div>
        </div>
      </section>

      <div className="asw-two-col">
        {doc.overallLead ? (
          <section className="asw-card asw-overall">
            <header className="asw-card-head">
              <Layers size={18} />
              <h3>Overall</h3>
            </header>
            <Markdown text={doc.overallLead} />
          </section>
        ) : null}
        {doc.regression ? (
          <section className="asw-card asw-regression">
            <header className="asw-card-head">
              <CheckCircle2 size={18} />
              <h3>{doc.regressionLabel || "Last full regression"}</h3>
            </header>
            <Markdown text={doc.regression} />
          </section>
        ) : null}
      </div>

      {doc.setup.length > 0 ? (
        <section className="asw-callout">
          <h3>Testing by hand</h3>
          <ul>
            {doc.setup.map((line, i) => (
              <li key={i}>
                <Markdown text={line} inline />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <nav className="asw-sections" aria-label="Testing report sections">
        {sections.map(([key, label, Icon, badge]) => (
          <button
            key={key}
            type="button"
            className={`asw-section-btn${section === key ? " asw-section-btn--on" : ""}`}
            aria-pressed={section === key}
            onClick={() => setSection(key)}
          >
            <Icon size={16} aria-hidden />
            <span>{label}</span>
            <span className="asw-section-badge">{badge}</span>
          </button>
        ))}
      </nav>

      {section === "modules" && selected ? (
        <section className="asw-card">
          <div className="asw-explorer-body">
            <nav className="asw-bars" aria-label="Modules by completion">
              {doc.modules.map((module) => {
                const active = module.id === selected.id;
                const ticked = module.handChecks.filter((row) => ticks.has(row.id)).length;
                return (
                  <button
                    key={module.id}
                    type="button"
                    className={`asw-bar${active ? " asw-bar--on" : ""}`}
                    aria-current={active}
                    onClick={() => setSelectedId(module.id)}
                  >
                    <span className="asw-bar-top">
                      <span className="asw-module-num">{module.number}</span>
                      <span className="asw-bar-name">{module.name}</span>
                      <span className="asw-bar-pct">{module.percent}%</span>
                    </span>
                    <span className="asw-bar-track">
                      <span className={`asw-bar-fill asw-bar-fill--${level(module.percent)}`} style={{ width: `${module.percent}%` }} />
                    </span>
                    {module.handChecks.length > 0 ? (
                      <span className="asw-bar-ticks">
                        {ticked}/{module.handChecks.length} hand tests ticked
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
            <ModuleTestDetail key={selected.id} module={selected} ticks={ticks} onToggle={toggleTick} />
          </div>
        </section>
      ) : null}

      {section === "checklist" ? (
        <section className="asw-card">
          <div className="asw-checklist-bar">
            <label className="asw-search">
              <Search size={16} aria-hidden />
              <input
                type="search"
                placeholder="Search hand tests…"
                value={rawQuery}
                onChange={(event) => setRawQuery(event.target.value)}
                aria-label="Search hand tests"
              />
              {rawQuery ? (
                <button type="button" aria-label="Clear search" onClick={() => setRawQuery("")}>
                  <X size={14} />
                </button>
              ) : null}
            </label>
            <label className="asw-toggle">
              <input type="checkbox" checked={hideDone} onChange={(event) => setHideDone(event.target.checked)} />
              Hide ticked
            </label>
            <button
              type="button"
              className="asw-ghost"
              disabled={doneCount === 0}
              onClick={() => {
                if (window.confirm("Clear all your ticks on this device?")) setTicks(new Set());
              }}
            >
              <RotateCcw size={14} /> Reset ticks
            </button>
          </div>
          <p className="asw-muted asw-small">Ticks are saved in this browser only, so each tester keeps their own list.</p>
          <div className="asw-groups">
            {doc.modules.map((module) => {
              const rows = module.handChecks.filter(
                (row) => (!query || plainText(row.text).toLowerCase().includes(query)) && !(hideDone && ticks.has(row.id)),
              );
              if (module.handChecks.length === 0 || (query && rows.length === 0)) return null;
              const done = module.handChecks.filter((row) => ticks.has(row.id)).length;
              const open = Boolean(query) || openGroups.has(module.id);
              return (
                <section key={module.id} className={`asw-group${open ? " asw-group--open" : ""}`}>
                  <button
                    type="button"
                    className="asw-group-head"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenGroups((current) => {
                        const next = new Set(current);
                        if (next.has(module.id)) next.delete(module.id);
                        else next.add(module.id);
                        return next;
                      })
                    }
                  >
                    <span className="asw-group-title">
                      {module.number}. {module.name}
                    </span>
                    <span className="asw-group-count">
                      {done}/{module.handChecks.length}
                    </span>
                    <ProgressBar done={done} total={module.handChecks.length} label={`${module.name} progress`} />
                    <ChevronDown size={18} className={open ? "asw-rotate" : ""} aria-hidden />
                  </button>
                  {open ? (
                    <div className="asw-group-body">
                      {rows.length === 0 ? (
                        <p className="asw-empty">All ticked here.</p>
                      ) : (
                        <HandList rows={rows} ticks={ticks} onToggle={toggleTick} highlight={query} />
                      )}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </section>
      ) : null}

      {section === "across" ? (
        <section className="asw-card">
          <header className="asw-card-head">
            <Layers size={18} />
            <h3>Across all modules</h3>
          </header>
          <p className="asw-muted">Not counted in the module percentages.{doc.acrossStatus ? ` Summary: ${doc.acrossStatus}.` : ""}</p>
          <div className="asw-across">
            {doc.across.map((item, i) => {
              const match = /^\*\*([^*]+?):?\*\*:?\s*(.*)$/s.exec(item);
              return (
                <article key={i} className="asw-across-card">
                  <span className="asw-across-num">{i + 1}</span>
                  <h4>{match ? match[1] : `Point ${i + 1}`}</h4>
                  <Markdown text={match ? match[2] : item} />
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {section === "how" ? (
        <section className="asw-card">
          <header className="asw-card-head">
            <Settings2 size={18} />
            <h3>{doc.howTitle}</h3>
          </header>
          <div className="asw-across">
            {doc.how.map((item, i) => {
              const match = /^\*\*([^*]+?):?\*\*:?\s*(.*)$/s.exec(item);
              return (
                <article key={i} className="asw-across-card">
                  <h4>{match ? match[1] : `Note ${i + 1}`}</h4>
                  <Markdown text={match ? match[2] : item} />
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
