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

/* ───────────── Module status and testing report ───────────── */

export interface CheckRow {
  id: string;
  text: string;
}

export interface TestChip {
  name: string;
  count: string;
  screen: boolean;
}

export interface ModuleTest {
  id: string;
  number: number;
  name: string;
  percent: number;
  status: string;
  done: string[];
  pending: string[];
  testsText: string;
  tests: TestChip[];
  handChecks: CheckRow[];
  /** Any other labelled bullet (kept so nothing in the doc is lost). */
  extra: Array<{ label: string; items: string[] }>;
}

export interface TestingDoc {
  title: string;
  updatedDate: string;
  whatThisIs: string;
  setup: string[];
  overallPercent: number;
  overallLead: string;
  regression: string;
  regressionLabel: string;
  modules: ModuleTest[];
  acrossStatus: string;
  across: string[];
  howTitle: string;
  how: string[];
}

interface LabelledBullet {
  label: string;
  inline: string;
  items: string[];
}

/** "- **Done:** text" bullets with optional indented sub-bullets. */
function labelledBullets(body: string): LabelledBullet[] {
  const out: LabelledBullet[] = [];
  for (const line of body.split("\n")) {
    const top = /^[-*]\s+\*\*([^*]+?):?\*\*:?\s*(.*)$/.exec(line);
    if (top) {
      out.push({ label: top[1].replace(/:$/, "").trim(), inline: top[2].trim(), items: [] });
      continue;
    }
    const sub = /^\s{2,}[-*]\s+(.*)$/.exec(line);
    if (sub && out.length > 0) {
      out[out.length - 1].items.push(sub[1].trim());
      continue;
    }
    const deeper = /^\s{4,}\S/.test(line);
    if (deeper && out.length > 0) {
      const last = out[out.length - 1];
      if (last.items.length > 0) last.items[last.items.length - 1] += `\n${line}`;
    }
  }
  return out;
}

function listOf(bullet: LabelledBullet | undefined): string[] {
  if (!bullet) return [];
  if (bullet.items.length > 0) return bullet.inline ? [bullet.inline, ...bullet.items] : bullet.items;
  return bullet.inline ? [bullet.inline] : [];
}

function parseTestChips(text: string): TestChip[] {
  const chips: TestChip[] = [];
  const screensAt = text.search(/screens?\b/i);
  for (const match of text.matchAll(/`([^`]+)`\s*(\d[\d,]*(?:\/\d[\d,]*)?)?/g)) {
    chips.push({ name: match[1], count: (match[2] ?? "").replace(/,$/, ""), screen: screensAt >= 0 && (match.index ?? 0) > screensAt });
  }
  return chips;
}

export function buildTestingDoc(markdown: string = testingMarkdown): TestingDoc {
  const root = parseSections(markdown);
  const top = root.children[0] ?? root;
  const handSection = findSection(top, /^Testing by hand/i);
  const overall = findSection(top, /^Overall/i);
  const byModule = findSection(top, /^Module by module/i);
  const across = findSection(top, /^Across all/i);
  const how = findSection(top, /^How the automatic/i);

  const overallBody = overall?.body ?? "";
  const statusRows = new Map<number, string[]>();
  let acrossStatus = "";
  for (const row of parseTables(overallBody)[0]?.rows ?? []) {
    const n = Number(row[0]);
    if (Number.isFinite(n) && row[0].trim()) statusRows.set(n, row);
    else if (/across/i.test(row[1] ?? "")) acrossStatus = row[3] ?? "";
  }
  const paragraphs = withoutTables(overallBody)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const leadBlock = paragraphs.find((block) => /complete/i.test(block)) ?? paragraphs[0] ?? "";
  const regressionBlock = paragraphs.find((block) => /regression/i.test(block)) ?? "";
  const regressionMatch = /^\*\*([^*]+?):?\*\*:?\s*(.*)$/s.exec(regressionBlock);

  const modules: ModuleTest[] = (byModule?.children ?? [])
    .map((child) => {
      const match = /^(\d+)\.\s+(.*?)\s*(?:\((\d+)\s*%\))?$/.exec(child.title);
      if (!match) return null;
      const number = Number(match[1]);
      const bullets = labelledBullets(child.body);
      const get = (re: RegExp) => bullets.find((bullet) => re.test(bullet.label));
      const tests = get(/^tests?$/i);
      const hand = get(/test by hand/i);
      const row = statusRows.get(number) ?? [];
      const known = [/^done$/i, /^pending$/i, /^tests?$/i, /test by hand/i];
      return {
        id: `t${number}`,
        number,
        name: match[2].trim(),
        percent: Number(match[3] ?? /\d+/.exec(row[2] ?? "")?.[0] ?? 0),
        status: row[3] ?? "",
        done: listOf(get(/^done$/i)),
        pending: listOf(get(/^pending$/i)),
        testsText: tests ? [tests.inline, ...tests.items].join(" ") : "",
        tests: tests ? parseTestChips([tests.inline, ...tests.items].join(" ")) : [],
        handChecks: listOf(hand).map((text) => ({ id: `m${number}:${slugify(plainText(text)).slice(0, 80)}`, text })),
        extra: bullets
          .filter((bullet) => !known.some((re) => re.test(bullet.label)))
          .map((bullet) => ({ label: bullet.label, items: listOf(bullet) })),
      } satisfies ModuleTest;
    })
    .filter((module): module is ModuleTest => module !== null);

  const percentFromLead = /(\d+)\s*%/.exec(leadBlock)?.[1];
  const average = modules.length ? Math.round(modules.reduce((sum, m) => sum + m.percent, 0) / modules.length) : 0;

  return {
    title: top.title,
    updatedDate: boldField(top.body, "Updated"),
    whatThisIs: capitalize(boldField(top.body, "What this is")),
    setup: topLevelBullets(handSection?.body ?? ""),
    overallPercent: percentFromLead ? Number(percentFromLead) : average,
    overallLead: leadBlock,
    regression: regressionMatch ? regressionMatch[2].trim() : regressionBlock,
    regressionLabel: regressionMatch ? regressionMatch[1].trim() : "",
    modules,
    acrossStatus,
    across: topLevelBullets(across?.body ?? ""),
    howTitle: how?.title ?? "How the automatic tests run",
    how: topLevelBullets(how?.body ?? ""),
  };
}
