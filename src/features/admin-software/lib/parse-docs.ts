/** Light parsers for the two admin-software docs (headings, tables, bullet lists). */

export interface MdSection {
  level: number;
  title: string;
  /** Lines directly under the heading, before the next heading of any level. */
  body: string;
  children: MdSection[];
}

export function parseSections(markdown: string): MdSection {
  const root: MdSection = { level: 0, title: "", body: "", children: [] };
  const stack: MdSection[] = [root];
  const bodyLines = new Map<MdSection, string[]>([[root, []]]);
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^```/.test(line.trim())) inFence = !inFence;
    const match = !inFence ? /^(#{1,6})\s+(.*)$/.exec(line) : null;
    if (match) {
      const section: MdSection = { level: match[1].length, title: match[2].trim(), body: "", children: [] };
      while (stack.length > 1 && stack[stack.length - 1].level >= section.level) stack.pop();
      stack[stack.length - 1].children.push(section);
      stack.push(section);
      bodyLines.set(section, []);
      continue;
    }
    bodyLines.get(stack[stack.length - 1])!.push(line);
  }
  for (const [section, lines] of bodyLines) {
    section.body = lines
      .filter((line) => !/^\s*-{3,}\s*$/.test(line))
      .join("\n")
      .trim();
  }
  return root;
}

export function findSection(parent: MdSection, test: RegExp): MdSection | undefined {
  return parent.children.find((child) => test.test(child.title));
}

export interface MdTable {
  headers: string[];
  rows: string[][];
}

function splitRow(line: string): string[] {
  const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells: string[] = [];
  let current = "";
  let inCode = false;
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (ch === "`") inCode = !inCode;
    if (ch === "\\" && inner[i + 1] === "|") {
      current += "|";
      i += 1;
      continue;
    }
    if (ch === "|" && !inCode) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current.trim());
  return cells;
}

/** All pipe tables in a block of markdown. Rows with every cell empty are dropped. */
export function parseTables(body: string): MdTable[] {
  const tables: MdTable[] = [];
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].trim().startsWith("|") || !/^\s*\|?\s*:?-{2,}/.test(lines[i + 1] ?? "")) continue;
    const headers = splitRow(lines[i]);
    const rows: string[][] = [];
    i += 2;
    while (i < lines.length && lines[i].trim().startsWith("|")) {
      const cells = splitRow(lines[i]);
      if (cells.some((cell) => cell.length > 0)) rows.push(cells);
      i += 1;
    }
    tables.push({ headers, rows });
  }
  return tables;
}

/** Body text with the tables removed. */
export function withoutTables(body: string): string {
  return body
    .split("\n")
    .filter((line) => !line.trim().startsWith("|"))
    .join("\n")
    .trim();
}

export function topLevelBullets(body: string): string[] {
  const items: string[] = [];
  for (const line of body.split("\n")) {
    const match = /^[-*]\s+(.*)$/.exec(line);
    if (match) items.push(match[1].trim());
    else if (/^\s{2,}\S/.test(line) && items.length > 0) items[items.length - 1] += `\n${line}`;
  }
  return items;
}

export function numberedItems(body: string): string[] {
  return body
    .split("\n")
    .map((line) => /^\d+\.\s+(.*)$/.exec(line)?.[1]?.trim())
    .filter((item): item is string => Boolean(item));
}

const DATE_RE = /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function findDate(text: string): { label: string; sortKey: number } | null {
  const match = DATE_RE.exec(text);
  if (!match) return null;
  const month = MONTHS.indexOf(match[2]);
  return {
    label: `${Number(match[1])} ${match[2]} ${match[3]}`,
    sortKey: Number(match[3]) * 10000 + (month + 1) * 100 + Number(match[1]),
  };
}

/** Value after a bold label such as **Updated:** on its own line. */
export function boldField(body: string, label: string): string {
  const re = new RegExp(`^\\*\\*${label}:?\\*\\*:?\\s*(.*)$`, "im");
  return re.exec(body)?.[1]?.trim() ?? "";
}

/** Splits text at a separator that is outside parentheses and outside **bold**. */
function splitOutside(text: string, isBreak: (text: string, index: number) => number): string[] {
  const parts: string[] = [];
  let depth = 0;
  let bold = false;
  let current = "";
  for (let i = 0; i < text.length; i += 1) {
    if (text.startsWith("**", i)) {
      bold = !bold;
      current += "**";
      i += 1;
      continue;
    }
    const ch = text[i];
    if (ch === "(") depth += 1;
    if (ch === ")") depth = Math.max(0, depth - 1);
    const skip = depth === 0 && !bold ? isBreak(text, i) : 0;
    if (skip > 0) {
      current += ch === ";" ? "" : ch;
      parts.push(current.trim());
      current = "";
      i += skip - 1;
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
}

/**
 * Splits the long "Updated: date (…)" note into its date and readable change items:
 * one item per sentence, and the long "Earlier, <date>: a; b; c" sentence one item per part.
 */
export function splitUpdatedNote(value: string): { date: string; items: string[] } {
  const open = value.indexOf("(");
  const date = (open >= 0 ? value.slice(0, open) : value).replace(/\*\*/g, "").trim();
  if (open < 0) return { date, items: [] };
  let inner = value.slice(open + 1).trim();
  if (inner.endsWith(")")) inner = inner.slice(0, -1);

  const sentences = splitOutside(inner, (text, i) =>
    text[i] === "." && /^\s+(\*\*|[A-Z])/.test(text.slice(i + 1, i + 4)) ? 1 : 0,
  );
  const items: string[] = [];
  for (const sentence of sentences) {
    if (/^Earlier\b/i.test(sentence)) {
      items.push(...splitOutside(sentence, (text, i) => (text[i] === ";" ? 1 : 0)));
    } else {
      items.push(sentence);
    }
  }
  return { date, items: items.map((item) => item.replace(/^[;,\s]+/, "")).filter(Boolean) };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Plain text for search: strips markdown marks. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
