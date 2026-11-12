import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronDown,
  CircleSlash,
  History,
  ListChecks,
  OctagonX,
  RotateCcw,
  Route,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Markdown } from "./Markdown";
import { plainText } from "../lib/parse-docs";
import type { CheckRow, ProblemGroup, ProblemTone, TestingDoc } from "../lib/doc-models";

type Section = "problems" | "checklist" | "path" | "log";

const STORAGE_KEY = "mss-admin-software-checks-v1";

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

const TONE_ICON: Record<ProblemTone, typeof AlertTriangle> = {
  broken: OctagonX,
  real: AlertTriangle,
  missing: Ban,
  fine: ShieldCheck,
};

function ProgressBar({ done, total, label }: { done: number; total: number; label?: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="asw-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span className="asw-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function ProblemColumn({ group }: { group: ProblemGroup }) {
  const Icon = TONE_ICON[group.tone];
  const count = group.rows.length + (group.rows.length === 0 ? group.bullets.length : 0);
  return (
    <section className={`asw-problem-col asw-problem-col--${group.tone}`}>
      <header>
        <Icon size={18} aria-hidden />
        <h4>{group.title}</h4>
        <span className="asw-count">{count}</span>
      </header>
      {group.intro ? <Markdown text={group.intro} className="asw-problem-intro" /> : null}
      {group.rows.length === 0 && group.bullets.length === 0 ? (
        <p className="asw-problem-empty">
          <CheckCircle2 size={16} /> Nothing listed right now.
        </p>
      ) : null}
      {group.rows.map((row, i) => (
        <article key={i} className="asw-problem">
          <span className="asw-problem-where">
            <Markdown text={row.where} inline />
          </span>
          {row.problem ? <Markdown text={row.problem} className="asw-problem-what" /> : null}
          {row.seen ? <Markdown text={row.seen} className="asw-problem-seen" /> : null}
        </article>
      ))}
      {group.rows.length === 0
        ? group.bullets.map((item, i) => (
            <article key={i} className="asw-problem asw-problem--bullet">
              <Markdown text={item} />
            </article>
          ))
        : null}
    </section>
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
        <input type="checkbox" checked={ticked} onChange={() => onToggle(row.id)} aria-label={`Done: ${plainText(row.check)}`} />
        <span aria-hidden className="asw-check-mark">
          <CheckCircle2 size={18} />
        </span>
      </label>
      <div className="asw-check-body">
        <Markdown text={row.check} className="asw-check-what" highlight={highlight} />
        {row.pass ? (
          <div className="asw-check-pass">
            <span className="asw-check-label">Pass when</span>
            <Markdown text={row.pass} highlight={highlight} />
          </div>
        ) : null}
        {row.note ? (
          <div className="asw-check-note">
            <span className="asw-check-label">Note</span>
            <Markdown text={row.note} highlight={highlight} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

function rowMatches(row: CheckRow, query: string) {
  return !query || plainText(`${row.check} ${row.pass} ${row.note}`).toLowerCase().includes(query);
}

export function TestingTab({ doc }: { doc: TestingDoc }) {
  const [section, setSection] = useState<Section>("problems");
  const [ticks, setTicks] = useState<Set<string>>(() => loadTicks());
  const [rawQuery, setRawQuery] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(doc.checks.slice(0, 1).map((g) => g.id)));
  const [openLog, setOpenLog] = useState<Set<string>>(() => new Set(doc.timeline.slice(0, 1).map((e) => e.id)));
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

  const allCheckIds = useMemo(() => doc.checks.flatMap((group) => group.rows.map((row) => row.id)), [doc.checks]);
  const doneCount = allCheckIds.filter((id) => ticks.has(id)).length;
  const knownProblems = doc.problems
    .filter((group) => group.tone !== "fine")
    .reduce((sum, group) => sum + group.rows.length, 0);
  const logChecks = doc.timeline.reduce((sum, entry) => sum + entry.checks.length, 0);

  const toggleSet = (setter: typeof setOpenGroups, id: string) =>
    setter((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const sections: Array<[Section, string, typeof ListChecks, string]> = [
    ["problems", "Known problems", AlertTriangle, String(knownProblems)],
    ["checklist", "Checklist", ListChecks, `${doneCount}/${allCheckIds.length}`],
    ["path", "20-minute path", Route, String(doc.pathSteps.length)],
    ["log", "Test rounds", History, String(doc.timeline.length)],
  ];

  return (
    <div className="asw-tab">
      <section className="asw-hero asw-hero--testing">
        <div className="asw-hero-text">
          <p className="asw-eyebrow">Mahi Solar admin app</p>
          <h2>{doc.title}</h2>
          {doc.headline ? (
            <p className="asw-headline">
              <CheckCircle2 size={22} aria-hidden /> Latest full regression: <strong>{doc.headline}</strong>
            </p>
          ) : null}
          <div className="asw-hero-meta">
            {doc.updatedDate ? <span className="asw-chip asw-chip--accent">Updated {doc.updatedDate}</span> : null}
          </div>
        </div>
        <div className="asw-stats">
          <div className="asw-stat">
            <span className="asw-stat-value">{knownProblems}</span>
            <span className="asw-stat-label">Known problems</span>
          </div>
          <div className="asw-stat">
            <span className="asw-stat-value">{allCheckIds.length}</span>
            <span className="asw-stat-label">Checks to run</span>
          </div>
          <div className="asw-stat">
            <span className="asw-stat-value">
              {doneCount}
              <small>/{allCheckIds.length}</small>
            </span>
            <span className="asw-stat-label">Ticked by you</span>
            <ProgressBar done={doneCount} total={allCheckIds.length} label="Your progress" />
          </div>
          <div className="asw-stat">
            <span className="asw-stat-value">{doc.timeline.length}</span>
            <span className="asw-stat-label">Test rounds</span>
            <span className="asw-stat-hint">{logChecks} checks in them</span>
          </div>
        </div>
      </section>

      {doc.setup.length > 0 ? (
        <section className="asw-callout">
          <h3>Before you test</h3>
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

      {section === "problems" ? (
        <div className="asw-problems">
          {doc.problems.map((group) => (
            <ProblemColumn key={group.id} group={group} />
          ))}
        </div>
      ) : null}

      {section === "checklist" ? (
        <section className="asw-card">
          <div className="asw-checklist-bar">
            <label className="asw-search">
              <Search size={16} aria-hidden />
              <input
                type="search"
                placeholder="Search checks…"
                value={rawQuery}
                onChange={(event) => setRawQuery(event.target.value)}
                aria-label="Search checks"
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
            {doc.checks.map((group) => {
              const rows = group.rows.filter((row) => rowMatches(row, query) && !(hideDone && ticks.has(row.id)));
              if (query && rows.length === 0) return null;
              const done = group.rows.filter((row) => ticks.has(row.id)).length;
              const open = Boolean(query) || openGroups.has(group.id);
              return (
                <section key={group.id} className={`asw-group${open ? " asw-group--open" : ""}`}>
                  <button type="button" className="asw-group-head" aria-expanded={open} onClick={() => toggleSet(setOpenGroups, group.id)}>
                    <span className="asw-group-title">{group.title}</span>
                    <span className="asw-group-count">
                      {done}/{group.rows.length}
                    </span>
                    <ProgressBar done={done} total={group.rows.length} label={`${group.title} progress`} />
                    <ChevronDown size={18} className={open ? "asw-rotate" : ""} aria-hidden />
                  </button>
                  {open ? (
                    <div className="asw-group-body">
                      {group.intro ? <Markdown text={group.intro} className="asw-group-intro" /> : null}
                      {rows.length === 0 ? (
                        <p className="asw-empty">All ticked here.</p>
                      ) : (
                        <ul className="asw-checks">
                          {rows.map((row) => (
                            <CheckItem key={row.id} row={row} ticked={ticks.has(row.id)} onToggle={toggleTick} highlight={query} />
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </section>
      ) : null}

      {section === "path" ? (
        <section className="asw-card asw-path">
          <header className="asw-card-head">
            <Route size={18} />
            <h3>{doc.pathTitle}</h3>
          </header>
          {doc.pathIntro ? <p className="asw-muted">{doc.pathIntro}</p> : null}
          <ol className="asw-path-steps">
            {doc.pathSteps.map((step, i) => (
              <li key={i}>
                <span className="asw-path-num">{i + 1}</span>
                <Markdown text={step} inline />
              </li>
            ))}
          </ol>
          {doc.pathStop ? (
            <div className="asw-stop">
              <CircleSlash size={18} aria-hidden />
              <Markdown text={doc.pathStop} />
            </div>
          ) : null}
        </section>
      ) : null}

      {section === "log" ? (
        <ol className="asw-timeline">
          {doc.timeline.map((entry) => {
            const open = openLog.has(entry.id);
            const chips = [...entry.automated.matchAll(/`([^`]+)`\s+(\d[\d,]*\/\d[\d,]*)/g)];
            const done = entry.checks.filter((row) => ticks.has(row.id)).length;
            return (
              <li key={entry.id} className="asw-tl-item">
                <span className="asw-tl-dot" aria-hidden />
                <div className="asw-tl-card">
                  <button type="button" className="asw-tl-head" aria-expanded={open} onClick={() => toggleSet(setOpenLog, entry.id)}>
                    <span className="asw-tl-date">{entry.date || "Undated"}</span>
                    <span className="asw-tl-title">{entry.title}</span>
                    {entry.checks.length > 0 ? (
                      <span className="asw-group-count">
                        {done}/{entry.checks.length}
                      </span>
                    ) : null}
                    <ChevronDown size={18} className={open ? "asw-rotate" : ""} aria-hidden />
                  </button>
                  {chips.length > 0 ? (
                    <div className="asw-tl-chips">
                      {chips.map((chip, i) => (
                        <span key={i} className="asw-chip asw-chip--pass">
                          <CheckCircle2 size={12} /> {chip[1]} <strong>{chip[2]}</strong>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {open ? (
                    <div className="asw-tl-body">
                      {entry.automated && chips.length === 0 ? <Markdown text={`Automated: ${entry.automated}`} /> : null}
                      {entry.intro ? <Markdown text={entry.intro} /> : null}
                      {entry.checks.length > 0 ? (
                        <ul className="asw-checks">
                          {entry.checks.map((row) => (
                            <CheckItem key={row.id} row={row} ticked={ticks.has(row.id)} onToggle={toggleTick} highlight="" />
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
