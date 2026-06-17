const DYNAMIC_PRINT_STYLE_ID = "mss-sites-dynamic-print";
const PX_TO_MM = 25.4 / 96;

export interface PrepareMssSitesPrintOptions {
  /** When false, the MORE / tooltip column is omitted from the PDF layout. */
  includeMoreColumn?: boolean;
}

/**
 * Locks column widths from the on-screen table and sets a wide @page size so
 * print/PDF matches the horizontal-scroll UI (spreadsheet-style), not squeezed A4.
 */
export function prepareMssSitesPrint(options: PrepareMssSitesPrintOptions = {}): () => void {
  const includeMoreColumn = options.includeMoreColumn ?? true;
  const table = document.querySelector<HTMLTableElement>(".mss-sites-table");
  const preview = document.getElementById("mss-sites-preview");
  if (!table || !preview) {
    return () => undefined;
  }

  const root = document.documentElement;
  root.classList.add("print-mss-sites");
  if (!includeMoreColumn) {
    root.classList.add("print-mss-sites--hide-more");
  }

  const headers = Array.from(table.querySelectorAll<HTMLTableCellElement>("thead th")).filter(
    (th) => includeMoreColumn || !th.classList.contains("mss-sites-table-more-col"),
  );
  const widths = headers.map((th) => th.getBoundingClientRect().width);

  let colgroup = table.querySelector("colgroup");
  if (!colgroup) {
    colgroup = document.createElement("colgroup");
    table.insertBefore(colgroup, table.firstChild);
  }
  colgroup.replaceChildren(
    ...widths.map((width) => {
      const col = document.createElement("col");
      col.style.width = `${width}px`;
      return col;
    }),
  );

  const tableWidthPx = includeMoreColumn
    ? table.scrollWidth
    : headers.reduce((sum, th) => sum + th.getBoundingClientRect().width, 0);
  table.style.width = `${tableWidthPx}px`;
  table.dataset.printWidth = String(tableWidthPx);
  table.classList.add("mss-sites-table--print-prepared");

  const pageWidthMm = Math.ceil(tableWidthPx * PX_TO_MM + 8);
  const pageHeightMm = 297;

  let style = document.getElementById(DYNAMIC_PRINT_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = DYNAMIC_PRINT_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `@media print {
  @page mss-sites-page {
    size: ${pageWidthMm}mm ${pageHeightMm}mm;
    margin: 4mm;
  }
}`;

  return () => {
    root.classList.remove("print-mss-sites", "print-mss-sites--hide-more");
    table.classList.remove("mss-sites-table--print-prepared");
    table.style.width = "";
    delete table.dataset.printWidth;
    colgroup?.remove();
    style?.remove();
  };
}
