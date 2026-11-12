import { Marked } from "marked";

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    link({ href, tokens }) {
      const text = this.parser.parseInline(tokens);
      // Links to other docs in the admin repo don't exist on this site — show the name only.
      if (!/^https?:\/\//i.test(href)) return `<span class="asw-doc-ref">${text}</span>`;
      return `<a href="${href}" target="_blank" rel="noreferrer">${text}</a>`;
    },
    html({ text }) {
      // Never pass raw HTML from the docs through.
      return text.replace(/</g, "&lt;");
    },
  },
});

function escapeHighlight(html: string, query: string): string {
  const needle = query.trim();
  if (needle.length < 2) return html;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Highlight only in text, not inside tags.
  return html.replace(/(>|^)([^<]+)/g, (_all, lead: string, text: string) =>
    `${lead}${text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>")}`,
  );
}

interface MarkdownProps {
  text: string;
  inline?: boolean;
  highlight?: string;
  className?: string;
}

export function Markdown({ text, inline = false, highlight = "", className = "" }: MarkdownProps) {
  const raw = inline ? (marked.parseInline(text) as string) : (marked.parse(text) as string);
  const html = escapeHighlight(raw, highlight);
  const Tag = inline ? "span" : "div";
  return <Tag className={`asw-md ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} />;
}
