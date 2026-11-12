import statusMarkdown from "../content/OVERALL_PROJECT_STATUS.md?raw";
import testingMarkdown from "../content/TESTING_MODULE_REPORT.md?raw";
import {
  boldField,
  findDate,
  findSection,
  numberedItems,
  parseSections,
  parseTables,
  plainText,
  slugify,
  splitUpdatedNote,
  topLevelBullets,
  withoutTables,
  type MdSection,
  type MdTable,
} from "./parse-docs";

/* ───────────── Overall project status ───────────── */

export interface FeatureGroup {
  title: string;
  /** Markdown under the group (bullets). */
  items: string[];
  /** Free text under the group that is not a bullet (e.g. "**Automatic:** …"). */
  note: string;
}

export interface ModuleInfo {
  id: string;
  number: number;
  name: string;
  whatItDoes: string;
  screens: string;
  tables: string;
  apiCount: string;
  featureGroups: FeatureGroup[];
  featureCount: number;
  apis: string;
  reviewStatus: string;
  reviewDate: string;
  reviewed: boolean;
  openItems: string[];
  reviewBody: string;
  searchText: string;
}

export interface StatusDoc {
  title: string;
  updatedDate: string;
  changes: string[];
  repos: string;
  purpose: string;
  agreements: string[];
  agreementsTitle: string;
  tagLegend: string;
  watchList: string[];
  modules: ModuleInfo[];
  reviewSteps: string[];
  reviewOrder: string;
  related: MdTable | null;
}

function capitalize(text: string): string {
  return text ? text[0].toUpperCase() + text.slice(1) : text;
}

function parseFeatureGroups(body: string): FeatureGroup[] {
  const groups: FeatureGroup[] = [];
  let current: FeatureGroup | null = null;
  const lines = body.split("\n");
  for (const line of lines) {
    const heading = /^\*\*([^*]+)\*\*\s*(.*)$/.exec(line.trim());
    if (heading && !line.startsWith("-") && !/^\*\*[^*]+:\*\*/.test(line.trim())) {
      current = { title: heading[1].trim(), items: [], note: heading[2].replace(/^[—–-]\s*/, "").trim() };
      groups.push(current);
      continue;
    }
    if (!current) {
      current = { title: "General", items: [], note: "" };
      groups.push(current);
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) current.items.push(bullet[1].trim());
    else if (/^\s{2,}[-*]\s+/.test(line) && current.items.length > 0) current.items[current.items.length - 1] += `\n${line}`;
    else if (line.trim()) current.note = [current.note, line.trim()].filter(Boolean).join(" ");
  }
  return groups.filter((group) => group.items.length > 0 || group.note);
}

function parseOpenItems(body: string): string[] {
  const lines = body.split("\n");
  const index = lines.findIndex((line) => /^\*\*Open[^*]*\*\*/.test(line.trim()));
  if (index < 0) return [];
  const inline = lines[index].replace(/^\*\*Open[^*]*\*\*:?\s*/, "").trim();
  if (inline) {
    return inline
      .split(/;\s+/)
      .map((item) => item.replace(/\.$/, "").trim())
      .filter(Boolean);
  }
  return topLevelBullets(lines.slice(index + 1).join("\n"));
}

function buildModule(section: MdSection, mapRows: Map<number, string[]>): ModuleInfo {
  const match = /^(\d+)\.\s+(.*)$/.exec(section.title)!;
  const number = Number(match[1]);
  const features = findSection(section, /^Features/i);
  const apis = findSection(section, /^APIs?/i);
  const review = findSection(section, /^Review status/i);
  const reviewBody = review?.body ?? "";
  const reviewStatus = boldField(reviewBody, "Status");
  const featureGroups = parseFeatureGroups(features?.body ?? "");
  const featureCount = featureGroups.reduce(
    (sum, group) => sum + group.items.reduce((n, item) => n + 1 + (item.match(/\n\s+[-*]\s/g)?.length ?? 0), 0),
    0,
  );
  const row = mapRows.get(number) ?? [];
  const whatItDoes = boldField(section.body, "What it does");
  return {
    id: `m${number}`,
    number,
    name: match[2].trim(),
    whatItDoes,
    screens: row[2] ?? "",
    tables: row[3] ?? "",
    apiCount: row[4] ?? "",
    featureGroups,
    featureCount,
    apis: apis?.body ?? "",
    reviewStatus,
    reviewDate: findDate(reviewStatus)?.label ?? "",
    reviewed: /^reviewed/i.test(reviewStatus),
    openItems: parseOpenItems(reviewBody),
    reviewBody,
    searchText: plainText([section.title, whatItDoes, features?.body, apis?.body, reviewBody].join(" ")).toLowerCase(),
  };
}

export function buildStatusDoc(markdown: string = statusMarkdown): StatusDoc {
  const root = parseSections(markdown);
  const top = root.children[0] ?? root;
  const updated = splitUpdatedNote(boldField(top.body, "Updated"));
  const agreements = findSection(top, /^Working agreements/i);
  const howToRead = findSection(top, /^How to read/i);
  const map = findSection(top, /^Module map/i);
  const mapRows = new Map<number, string[]>();
  for (const row of map ? parseTables(map.body)[0]?.rows ?? [] : []) {
    const n = Number(row[0]);
    if (Number.isFinite(n)) mapRows.set(n, row);
  }
  const howToReview = findSection(top, /^How we.?ll review/i);
  const related = findSection(top, /^Related documents/i);
  const watchStart = howToRead?.body.indexOf("**Most likely to matter") ?? -1;

  return {
    title: top.title,
    updatedDate: updated.date,
    changes: updated.items,
    repos: boldField(top.body, "Repos"),
    purpose: capitalize(boldField(top.body, "Purpose")),
    agreementsTitle: agreements?.title ?? "Working agreements",
    agreements: topLevelBullets(agreements?.body ?? ""),
    tagLegend: boldField(howToRead?.body ?? "", "Tags"),
    watchList: watchStart >= 0 ? topLevelBullets(howToRead!.body.slice(watchStart)) : [],
    modules: top.children.filter((child) => /^\d+\.\s/.test(child.title)).map((child) => buildModule(child, mapRows)),
    reviewSteps: numberedItems(howToReview?.body ?? ""),
    reviewOrder: boldField(howToReview?.body ?? "", "Proposed order"),
    related: related ? parseTables(related.body)[0] ?? null : null,
  };
}

/* ───────────── Testing report ───────────── */

export type ProblemTone = "broken" | "real" | "missing" | "fine";

export interface ProblemGroup {
  id: string;
  title: string;
  tone: ProblemTone;
  intro: string;
  rows: Array<{ where: string; problem: string; seen: string }>;
  bullets: string[];
}

export interface CheckRow {
  id: string;
  check: string;
  pass: string;
  note: string;
}

export interface CheckGroup {
  id: string;
  title: string;
  intro: string;
  rows: CheckRow[];
}

export interface TimelineEntry {
  id: string;
  title: string;
  date: string;
  sortKey: number;
  automated: string;
  intro: string;
  checks: CheckRow[];
}

export interface TestingDoc {
  title: string;
  updatedDate: string;
  changes: string[];
  headline: string;
  setup: string[];
  problemsIntro: string;
  problems: ProblemGroup[];
  checksIntro: string;
  checks: CheckGroup[];
  pathTitle: string;
  pathIntro: string;
  pathSteps: string[];
  pathStop: string;
  timeline: TimelineEntry[];
}

function toneFor(title: string): ProblemTone {
  if (/broken/i.test(title)) return "broken";
  if (/not built/i.test(title)) return "missing";
  if (/not a problem/i.test(title)) return "fine";
  return "real";
}

function columnFinder(headers: string[]) {
  const lower = headers.map((header) => header.toLowerCase());
  return (...tests: RegExp[]) => lower.findIndex((header) => tests.some((test) => test.test(header)));
}

function checkRows(table: MdTable | undefined, prefix: string): CheckRow[] {
  if (!table) return [];
  const find = columnFinder(table.headers);
  const checkCol = Math.max(0, find(/what to check/, /^check$/, /check/));
  const passCol = find(/pass when/, /expected/);
  const noteCol = find(/problem/, /note/);
  return table.rows.map((row) => {
    const check = row[checkCol] ?? "";
    return {
      id: `${prefix}:${slugify(plainText(check)).slice(0, 80)}`,
      check,
      pass: passCol >= 0 ? row[passCol] ?? "" : "",
      note: noteCol >= 0 ? row[noteCol] ?? "" : "",
    };
  });
}

/** Turns "x.sh 39/39, y_ui 73/73 at …" into a readable sentence (kept as markdown). */
function automatedLine(body: string): string {
  const match = /^Automated:\s*(.*)$/im.exec(body);
  return match?.[1]?.trim() ?? "";
}

export function buildTestingDoc(markdown: string = testingMarkdown): TestingDoc {
  const root = parseSections(markdown);
  const top = root.children[0] ?? root;
  const updatedRaw = /^\*\*Updated\s+([^*]+)\*\*\s*(.*)$/im.exec(top.body);
  const updated = splitUpdatedNote(updatedRaw ? `${updatedRaw[1]} ${updatedRaw[2]}` : "");
  const regressionNote = updated.items.find((item) => /[\d,]+ passed/.test(item)) ?? "";
  const headline =
    /([\d,]+ passed(?:,\s*only [^,;)]+|[^,;)]*))/.exec(regressionNote)?.[1]?.replace(/\*\*/g, "").trim() ?? "";

  const setup = top.body
    .split("\n")
    .slice(1)
    .map((line) => line.replace(/\s+$/, "").trim())
    .filter((line) => line && !/^---$/.test(line) && !/^Two lists below/i.test(line));

  const problems = findSection(top, /^Problems/i);
  const checks = findSection(top, /^What to check/i);
  const path = findSection(top, /^One path/i);
  const newOnly = findSection(top, /^New problems/i);

  const problemGroups: ProblemGroup[] = (problems?.children ?? []).map((child) => {
    const table = parseTables(child.body)[0];
    const find = table ? columnFinder(table.headers) : () => -1;
    const where = Math.max(0, find(/where/));
    const problem = find(/problem/);
    const seen = find(/what you will see/, /see/);
    return {
      id: slugify(child.title),
      title: child.title,
      tone: toneFor(child.title),
      intro: withoutTables(child.body)
        .split("\n")
        .filter((line) => !/^[-*]\s/.test(line))
        .join(" ")
        .trim(),
      rows: (table?.rows ?? []).map((row) => ({
        where: row[where] ?? "",
        problem: problem >= 0 ? row[problem] ?? "" : "",
        seen: seen >= 0 ? row[seen] ?? "" : "",
      })),
      bullets: topLevelBullets(child.body),
    };
  });

  const checkGroups: CheckGroup[] = (checks?.children ?? []).map((child) => ({
    id: slugify(child.title),
    title: child.title,
    intro: withoutTables(child.body),
    rows: checkRows(parseTables(child.body)[0], slugify(child.title)),
  }));

  const timeline: TimelineEntry[] = (newOnly?.children ?? [])
    .map((child) => {
      const date = findDate(child.title);
      const intro = withoutTables(child.body)
        .split("\n")
        .filter((line) => !/^Automated:/i.test(line))
        .join("\n")
        .trim();
      return {
        id: slugify(child.title),
        title: child.title
          .replace(/\s*[—–-]\s*\d{1,2}\s+\w{3}\s+\d{4}\s*$/, "")
          .replace(/\s*\(\d{1,2}\s+\w{3}\s+\d{4}\)\s*$/, "")
          .trim(),
        date: date?.label ?? "",
        sortKey: date?.sortKey ?? 0,
        automated: automatedLine(child.body),
        intro,
        checks: checkRows(parseTables(child.body)[0], slugify(child.title)),
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey);

  const pathBody = path?.body ?? "";
  return {
    title: top.title,
    updatedDate: updated.date,
    changes: updated.items,
    headline,
    setup,
    problemsIntro: problems?.body ?? "",
    problems: problemGroups,
    checksIntro: checks?.body ?? "",
    checks: checkGroups,
    pathTitle: path?.title ?? "One path",
    pathIntro: pathBody.split("\n").find((line) => line.trim() && !/^\d+\./.test(line) && !/^\*\*Stop/.test(line))?.trim() ?? "",
    pathSteps: numberedItems(pathBody),
    pathStop: /^\*\*Stop[^*]*\*\*\s*(.*)$/im.exec(pathBody)?.[0] ?? "",
    timeline,
  };
}
